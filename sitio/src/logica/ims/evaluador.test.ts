import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluarIms, normalizaSerie } from './evaluador.ts';
import type { Vehiculo } from './tipos.ts';

/**
 * Los 36 casos obligatorios de la especificacion, mas los bordes exactos de
 * cada corte por numero de motor.
 *
 *   node --test src/logica/ims/
 *
 * Un corte se comprueba SIEMPRE por los dos lados. Un `<=` escrito como `<`
 * manda a media flota al tramo equivocado y no lo nota nadie.
 */

const v = (p: Partial<Vehiculo>): Vehiculo => ({
  familia: 'boxster', ano: 2003, baseAno: 'modelo', originalidadMotor: 'original', ...p,
});

// ── 1–2, 9, 33–34: clasificacion de fabrica ────────────────────────────────
test('1. Boxster 986 MY1998 con motor original: doble hilera, confianza alta', () => {
  const r = evaluarIms(v({ ano: 1998, generacion: '986' }));
  assert.equal(r.estado, 'AFECTADO_DOBLE_SUSTITUIBLE');
  assert.equal(r.confianza, 'alta');
  assert.equal(r.sustituibilidad, 'sin_abrir_el_bloque');
});

test('2. Boxster 986 MY2000 sin numero de motor: transicion', () => {
  const r = evaluarIms(v({ ano: 2000, generacion: '986' }));
  assert.equal(r.estado, 'TRANSICION_DOBLE_O_SIMPLE');
  assert.notEqual(r.confianza, 'alta');
});

test('9. 911 996 Carrera MY2003: 6204 simple', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2003, generacion: '996', variante: 'carrera_atmosferico',
  }));
  assert.equal(r.estado, 'AFECTADO_SIMPLE_SUSTITUIBLE');
  assert.equal(r.incidenciaRelativa, 'mayor');
});

test('33. 911 Carrera MY2005 con generacion 996 confirmada: 6204 simple', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2005, generacion: '996', variante: 'carrera_atmosferico',
  }));
  assert.equal(r.estado, 'AFECTADO_SIMPLE_SUSTITUIBLE');
});

test('34. Boxster matriculado en 2005, generacion 986: simple y confianza media', () => {
  const r = evaluarIms(v({ ano: 2005, baseAno: 'matriculacion', generacion: '986' }));
  assert.equal(r.estado, 'AFECTADO_SIMPLE_SUSTITUIBLE');
  assert.equal(r.confianza, 'media');
});

// ── 3–8: cortes de MY 2000–2001, por los dos lados ─────────────────────────
const corte2000: [string, string, string, string][] = [
  ['3', 'boxster', '65112851', 'AFECTADO_DOBLE_SUSTITUIBLE'],
  ['4', 'boxster', '65112852', 'AFECTADO_SIMPLE_SUSTITUIBLE'],
];
for (const [n, familia, serie, esperado] of corte2000) {
  test(`${n}. Boxster 2.7 M96.22 numero ${serie}`, () => {
    const r = evaluarIms(v({
      familia: familia as 'boxster', ano: 2000, generacion: '986',
      codigoMotor: 'M96.22', serieMotor: serie,
    }));
    assert.equal(r.estado, esperado);
  });
}

test('5. Boxster S M96.21 numero 67111237: doble hilera', () => {
  const r = evaluarIms(v({
    ano: 2000, generacion: '986', codigoMotor: 'M96.21', serieMotor: '67111237',
  }));
  assert.equal(r.rodamientoDeFabrica, 'doble_hilera_5204');
});

test('6. Boxster S M96.21 numero 67111238: una hilera pequena', () => {
  const r = evaluarIms(v({
    ano: 2000, generacion: '986', codigoMotor: 'M96.21', serieMotor: '67111238',
  }));
  assert.equal(r.rodamientoDeFabrica, 'una_hilera_6204');
});

test('7. 911 996 Carrera 3.4 numero 66114164: doble hilera', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2000, generacion: '996', variante: 'carrera_atmosferico',
    codigoMotor: 'M96.04', serieMotor: '66114164',
  }));
  assert.equal(r.rodamientoDeFabrica, 'doble_hilera_5204');
});

test('8. 911 996 Carrera 3.4 numero 66114165: una hilera pequena', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2000, generacion: '996', variante: 'carrera_atmosferico',
    codigoMotor: 'M96.04', serieMotor: '66114165',
  }));
  assert.equal(r.rodamientoDeFabrica, 'una_hilera_6204');
});

/* El lado del corte elegido llega al mismo sitio que el numero escrito: no hay
   lista de numeros de motor que ofrecer, solo el umbral y sus dos lados. */
test('8b. El lado inferior elegido da lo mismo que un numero por debajo', () => {
  const base = {
    familia: '911' as const, ano: 2000, generacion: '996' as const,
    variante: 'carrera_atmosferico' as const, codigoMotor: 'M96.04',
  };
  const escrito = evaluarIms(v({ ...base, serieMotor: '66114164' }));
  const elegido = evaluarIms(v({ ...base, ladoDelCorte: 'inferior' }));
  assert.equal(elegido.rodamientoDeFabrica, escrito.rodamientoDeFabrica);
  assert.equal(elegido.estado, escrito.estado);
  assert.equal(elegido.confianza, escrito.confianza);
});

test('8c. El lado superior elegido da lo mismo que un numero por encima', () => {
  const base = {
    familia: '911' as const, ano: 2000, generacion: '996' as const,
    variante: 'carrera_atmosferico' as const, codigoMotor: 'M96.04',
  };
  const escrito = evaluarIms(v({ ...base, serieMotor: '66114165' }));
  const elegido = evaluarIms(v({ ...base, ladoDelCorte: 'superior' }));
  assert.equal(elegido.rodamientoDeFabrica, escrito.rodamientoDeFabrica);
  assert.equal(elegido.estado, escrito.estado);
});

test('8d. Un lado sin tipo de motor no resuelve: no hay corte que aplicar', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2000, generacion: '996', variante: 'carrera_atmosferico',
    ladoDelCorte: 'inferior',
  }));
  assert.equal(r.estado, 'TRANSICION_DOBLE_O_SIMPLE');
  assert.ok(r.motivos.includes('sin_corte_para_ese_motor'));
});

// ── 10–11, 18, 20: Mezger ──────────────────────────────────────────────────
for (const [n, ano, generacion, variante] of [
  ['10', 2003, '996', 'turbo'], ['11', 2004, '996', 'gt3'],
  ['18', 2007, '997_1', 'turbo'], ['20', 2010, '997_2', 'gt3'],
] as const) {
  test(`${n}. 911 ${generacion} ${variante} MY${ano}: Mezger, fuera del fallo clasico`, () => {
    const r = evaluarIms(v({ familia: '911', ano, generacion, variante }));
    assert.equal(r.estado, 'NO_ES_EL_IMS_CLASICO_MEZGER');
    assert.equal(r.respuesta, 'no');
  });
}

// ── 12–17, 22–24: transiciones y 6305 ──────────────────────────────────────
test('12. 911 997.1 Carrera 3.6 MY2005 sin numero: transicion simple o grande', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2005, generacion: '997_1', variante: 'carrera_atmosferico',
  }));
  assert.equal(r.estado, 'TRANSICION_SIMPLE_O_GRANDE');
});

const corte2005: [string, string, string, string][] = [
  ['13', 'M96.05', '69507475', 'una_hilera_6204'],
  ['14', 'M96.05', '69507476', 'una_hilera_grande_6305'],
  ['15', 'M97.01', '68509790', 'una_hilera_6204'],
  ['16', 'M97.01', '68509791', 'una_hilera_grande_6305'],
];
for (const [n, codigo, serie, esperado] of corte2005) {
  test(`${n}. 997.1 ${codigo} numero ${serie}`, () => {
    const r = evaluarIms(v({
      familia: '911', ano: 2005, generacion: '997_1',
      variante: codigo === 'M96.05' ? 'carrera_atmosferico' : 'carrera_s_atmosferico',
      codigoMotor: codigo, serieMotor: serie,
    }));
    assert.equal(r.rodamientoDeFabrica, esperado);
  });
}

test('17. 911 997.1 Carrera MY2007: 6305 grande', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2007, generacion: '997_1', variante: 'carrera_atmosferico',
  }));
  assert.equal(r.estado, 'AFECTADO_GRANDE_NO_SUSTITUIBLE');
  assert.equal(r.sustituibilidad, 'desmontando_el_motor');
});

test('22. Boxster 987.1 MY2005 sin identificacion: transicion', () => {
  const r = evaluarIms(v({ ano: 2005, generacion: '987_1' }));
  assert.equal(r.estado, 'TRANSICION_SIMPLE_O_GRANDE');
});

test('22b. El corte de 997 NO se aplica a un Boxster 987.1', () => {
  const r = evaluarIms(v({
    ano: 2005, generacion: '987_1', codigoMotor: 'M96.05', serieMotor: '69507476',
  }));
  assert.equal(r.estado, 'TRANSICION_SIMPLE_O_GRANDE');
});

test('23. Boxster 987.1 MY2007: 6305 grande', () => {
  const r = evaluarIms(v({ ano: 2007, generacion: '987_1' }));
  assert.equal(r.estado, 'AFECTADO_GRANDE_NO_SUSTITUIBLE');
});

test('24. Cayman S 987.1 MY2006: 6305 grande', () => {
  const r = evaluarIms(v({ familia: 'cayman', ano: 2006, generacion: '987_1' }));
  assert.equal(r.estado, 'AFECTADO_GRANDE_NO_SUSTITUIBLE');
});

// ── 19, 21, 25: sin IMS ────────────────────────────────────────────────────
test('19. 911 997.2 Carrera MY2009: sin IMS', () => {
  const r = evaluarIms(v({
    familia: '911', ano: 2009, generacion: '997_2', variante: 'carrera_atmosferico',
  }));
  assert.equal(r.estado, 'SIN_IMS_9A1');
});

test('21. 911 997.2 Turbo MY2010: sin IMS', () => {
  const r = evaluarIms(v({ familia: '911', ano: 2010, generacion: '997_2', variante: 'turbo' }));
  // El Turbo 997.2 abandona el Mezger: es 9A1 y no tiene IMS.
  assert.equal(r.respuesta, 'no');
});

test('25. Cayman 987.2 MY2009: sin IMS', () => {
  const r = evaluarIms(v({ familia: 'cayman', ano: 2009, generacion: '987_2' }));
  assert.equal(r.estado, 'SIN_IMS_9A1');
});

// ── 26–27, 35–36: datos insuficientes ──────────────────────────────────────
test('26. 911 ano 2005 sin generacion ni version: faltan datos, pide generacion', () => {
  const r = evaluarIms(v({ familia: '911', ano: 2005 }));
  assert.equal(r.estado, 'DATOS_INSUFICIENTES');
  assert.equal(r.siguientePregunta, 'generacion');
});

test('27. 911 matriculado en 2008, facelift desconocido: faltan datos', () => {
  const r = evaluarIms(v({ familia: '911', ano: 2008, baseAno: 'matriculacion' }));
  assert.equal(r.estado, 'DATOS_INSUFICIENTES');
  assert.equal(r.siguientePregunta, 'generacion');
});

test('35. Cayman "MY 2005": faltan datos, el Cayman nace como 987.1', () => {
  const r = evaluarIms(v({ familia: 'cayman', ano: 2005 }));
  assert.equal(r.estado, 'DATOS_INSUFICIENTES');
});

test('36. 911 ano 1998 sin generacion: faltan datos, 993 o 996', () => {
  const r = evaluarIms(v({ familia: '911', ano: 1998 }));
  assert.equal(r.estado, 'DATOS_INSUFICIENTES');
  assert.equal(r.siguientePregunta, 'generacion');
});

test('26b. 911 996 MY2003 sin version: pide la version antes de clasificar', () => {
  const r = evaluarIms(v({ familia: '911', ano: 2003, generacion: '996' }));
  assert.equal(r.estado, 'DATOS_INSUFICIENTES');
  assert.equal(r.siguientePregunta, 'variante');
});

// ── 28–29: historial ───────────────────────────────────────────────────────
test('28. Afectado con motor sustituido sin identificar: familia de origen, confianza baja', () => {
  const r = evaluarIms(v({ ano: 2003, generacion: '986', originalidadMotor: 'sustituido' }));
  assert.equal(r.estado, 'AFECTADO_SIMPLE_SUSTITUIBLE');
  assert.equal(r.confianza, 'baja');
  assert.ok(r.acciones.includes('identificar_motor_actual'));
});

test('29. Boxster 2003 con IMS documentado y kit desconocido: fabrica + modificador', () => {
  const r = evaluarIms(v({ ano: 2003, generacion: '986', intervencionIms: 'documentada' }));
  assert.equal(r.estado, 'AFECTADO_SIMPLE_SUSTITUIBLE');
  assert.equal(r.estadoActual, 'RETROFIT_DOCUMENTADO');
  assert.ok(r.acciones.includes('verificar_factura_y_referencia'));
});

// ── 30: otros modelos ──────────────────────────────────────────────────────
test('30. Cayenne 2004: fuera de la familia estudiada', () => {
  const r = evaluarIms(v({ familia: 'cayenne', ano: 2004 }));
  assert.equal(r.estado, 'NO_APLICA_OTRO_MODELO');
});

// ── 31–32: numeros de motor problematicos ──────────────────────────────────
test('31. Numero de motor mal formado: no bloquea, conserva la transicion', () => {
  const r = evaluarIms(v({
    ano: 2000, generacion: '986', codigoMotor: 'M96.22', serieMotor: '651-abc',
  }));
  assert.equal(r.estado, 'TRANSICION_DOBLE_O_SIMPLE');
  assert.ok(r.motivos.includes('serie_ilegible'));
});

test('32. Numero con marca de remanufacturado: no se aplica el corte', () => {
  const r = evaluarIms(v({
    ano: 2000, generacion: '986', codigoMotor: 'M96.22', serieMotor: '65112852AT',
  }));
  assert.equal(r.estado, 'TRANSICION_DOBLE_O_SIMPLE');
  assert.ok(r.motivos.includes('serie_remanufacturado'));
});

test('El corte no se aplica si el motor no se declara original', () => {
  const r = evaluarIms(v({
    ano: 2000, generacion: '986', codigoMotor: 'M96.22', serieMotor: '65112852',
    originalidadMotor: 'sustituido',
  }));
  assert.equal(r.estado, 'TRANSICION_DOBLE_O_SIMPLE');
});

// ── Normalizacion y determinismo ───────────────────────────────────────────
test('El numero de serie se normaliza: espacios, puntos, barras y guiones', () => {
  assert.equal(normalizaSerie(' 65.112-852/ '), '65112852');
});

test('Misma entrada, misma salida', () => {
  const entrada = v({ familia: '911', ano: 2005, generacion: '997_1', variante: 'carrera_atmosferico' });
  assert.deepEqual(evaluarIms(entrada), evaluarIms(entrada));
});

test('Ningun resultado afectado sale con confianza alta si el ano es de transicion', () => {
  for (const ano of [2000, 2001]) {
    const r = evaluarIms(v({ ano, generacion: '986' }));
    assert.notEqual(r.confianza, 'alta');
  }
});

test('Un ano fuera de rango no revienta: devuelve datos insuficientes', () => {
  assert.equal(evaluarIms(v({ ano: 1800 })).estado, 'DATOS_INSUFICIENTES');
  assert.equal(evaluarIms(v({ ano: 2200 })).estado, 'DATOS_INSUFICIENTES');
});
