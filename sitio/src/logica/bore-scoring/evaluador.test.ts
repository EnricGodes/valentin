import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluarBoreScoring } from './evaluador.ts';
import { consumoPorMilKm, familiasPresentes } from './reglas-evidencia.ts';
import { REGLAS, generacionesCandidatas, variantesPosibles } from './reglas-vehiculo.ts';
import { SUSCEPTIBILIDAD, EVIDENCIA, URGENCIA, MOTIVOS } from './textos.es.ts';
import type { Pruebas, Sintomas, Vehiculo } from './tipos.ts';

/**
 * Los 48 casos obligatorios de la especificacion, mas los bordes de cada tramo
 * y las precedencias que la herramienta no puede romper.
 *
 *   node --test src/logica/bore-scoring/
 *
 * Las tres que valen por encima de todas: nunca diagnostica por modelo y ano,
 * nunca descarta por ausencia de sintomas y nunca devuelve un porcentaje.
 */

const v = (p: Partial<Vehiculo>): Vehiculo => ({
  familia: '911', ano: 2007, baseAno: 'modelo', ...p,
});
const ev = (p: Partial<Vehiculo>, s: Sintomas = {}, t: Pruebas = {}) =>
  evaluarBoreScoring(v(p), s, t);

const CARRERA_997_1: Partial<Vehiculo> = {
  familia: '911', ano: 2007, generacion: '997_1', variante: 'carrera_s',
};

// ── 1-4. 911 atmosfericos: el grupo central de la matriz ───────────────────
test('1. 996.1 Carrera 3.4 MY2000, propietario, sin sintomas', () => {
  const r = ev({ ano: 2000, generacion: '996_1', variante: 'carrera',
                 situacion: 'propietario' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
  assert.equal(r.evidencia, 'NO_EVIDENCE_REPORTED');
});

test('2. 996.2 Carrera 3.6 MY2003, compra, sin sintomas: PPI con boroscopia', () => {
  const r = ev({ ano: 2003, generacion: '996_2', variante: 'carrera', situacion: 'compra' });
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
  assert.equal(r.urgencia, 'PPI_SCOPE_RECOMMENDED');
});

test('3. 997.1 Carrera 3.6 MY2007, propietario: elevada, sin afirmar que este afectado', () => {
  const r = ev({ generacion: '997_1', variante: 'carrera', situacion: 'propietario' });
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
  assert.equal(r.evidencia, 'NO_EVIDENCE_REPORTED');
  assert.equal(r.urgencia, 'INFORMATION_ONLY');
  assert.ok(r.avisos.includes('sin_indicios_no_es_sano'));
});

test('4. 997.1 Carrera S 3.8 MY2007, compra: elevada + PPI', () => {
  const r = ev({ ...CARRERA_997_1, situacion: 'compra' });
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
  assert.equal(r.urgencia, 'PPI_SCOPE_RECOMMENDED');
});

// ── 5-7. Sintomas ──────────────────────────────────────────────────────────
test('5. Tic aislado en frio: una senal inespecifica, revision especializada', () => {
  const r = ev(CARRERA_997_1, { golpeteo: 'solo_frio' });
  assert.equal(r.evidencia, 'ONE_NON_SPECIFIC_SIGNAL');
  assert.equal(r.urgencia, 'BOOK_SPECIALIST_INSPECTION');
});

test('6. Consumo creciente + tic en caliente + hollin asimetrico: varias familias', () => {
  const r = ev(CARRERA_997_1, {
    consumoAceite: 'aumenta', golpeteo: 'frio_y_caliente', hollin: 'asimetrico',
  });
  assert.equal(r.evidencia, 'MULTIPLE_COMPATIBLE_SIGNALS');
  assert.ok(['PROMPT_INSPECTION', 'MINIMIZE_USE_AND_CONTACT'].includes(r.urgencia));
});

test('7. Consumo creciente + misfire activo + bujia aceitosa: reducir el uso', () => {
  const r = ev(CARRERA_997_1, {
    consumoAceite: 'aumenta', fallosCombustion: 'activo', bujiaAceitosa: true,
  });
  assert.equal(r.urgencia, 'MINIMIZE_USE_AND_CONTACT');
});

// ── 8-13. Mezger, 9A1/MA1 y tecnologias posteriores ────────────────────────
test('8. 996 Turbo Mezger: no hereda la regla del Carrera', () => {
  const r = ev({ ano: 2003, generacion: '996_2', variante: 'turbo' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
  assert.equal(r.tecnologia, 'nikasil');
});

test('9. 997.1 GT3 Mezger: susceptibilidad comparativamente baja', () => {
  const r = ev({ generacion: '997_1', variante: 'gt3' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
});

test('10. 997.2 Carrera MY2010: casos documentados, no "libre desde 2009"', () => {
  const r = ev({ ano: 2010, generacion: '997_2', variante: 'carrera' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
  assert.equal(r.tecnologia, 'alusil');
});

test('11. 991.1 Carrera S 3.8: casos documentados', () => {
  const r = ev({ ano: 2014, generacion: '991_1', variante: 'carrera_s' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
});

test('12. 991.1 GT3 sin motor identificado: hay que identificar el motor', () => {
  const r = ev({ ano: 2014, generacion: '991_1', variante: 'gt3' });
  assert.equal(r.susceptibilidad, 'ENGINE_SPECIFIC_CLASSIFICATION');
});

test('13. 991.2 Carrera: tecnologia menos asociada', () => {
  const r = ev({ ano: 2018, generacion: '991_2', variante: 'carrera' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
  assert.equal(r.tecnologia, 'recubrimiento_proyectado');
});

// ── 14-15. Cuando el ano no basta ──────────────────────────────────────────
test('14. 911 matriculado en 2008, generacion desconocida: pregunta la generacion', () => {
  const r = ev({ ano: 2008, baseAno: 'matriculacion' });
  assert.equal(r.urgencia, 'INSUFFICIENT_DATA');
  assert.equal(r.siguientePregunta, 'generacion');
  const opciones = generacionesCandidatas('911', 2008);
  assert.ok(opciones.includes('997_1') && opciones.includes('997_2'));
});

test('15. 911 de 2005: pregunta 996.2 o 997.1 antes de clasificar', () => {
  const r = ev({ ano: 2005 });
  assert.equal(r.siguientePregunta, 'generacion');
  const opciones = generacionesCandidatas('911', 2005);
  assert.ok(opciones.includes('996_2') && opciones.includes('997_1'));
  assert.ok(!opciones.includes('pre_996'), 'un 911 de 2005 no puede ser un 993');
});

// ── 16-24. Boxster y Cayman ────────────────────────────────────────────────
test('16. Boxster 986 2.7: comparativamente baja, nunca riesgo cero', () => {
  const r = ev({ familia: 'boxster', ano: 2001, generacion: '986' });
  assert.equal(r.susceptibilidad, 'LOWER_REPORTED_SUSCEPTIBILITY');
  assert.ok(r.avisos.includes('menor_no_es_inmune'));
});

test('17. Boxster S 986 3.2: comparativamente baja', () => {
  const r = ev({ familia: 'boxster', ano: 2003, generacion: '986', variante: 's' });
  assert.equal(r.susceptibilidad, 'LOWER_REPORTED_SUSCEPTIBILITY');
});

test('18. Boxster 987.1 S 3.2 MY2006: comparativamente baja', () => {
  const r = ev({ familia: 'boxster', ano: 2006, generacion: '987_1', variante: 's' });
  assert.equal(r.susceptibilidad, 'LOWER_REPORTED_SUSCEPTIBILITY');
});

test('19. Boxster 987.1 S 3.4 MY2007: elevada', () => {
  const r = ev({ familia: 'boxster', ano: 2007, generacion: '987_1', variante: 's' });
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
});

test('20. Cayman 987.1 de acceso 2.7: comparativamente baja', () => {
  const r = ev({ familia: 'cayman', ano: 2007, generacion: '987_1', variante: 'base' });
  assert.equal(r.susceptibilidad, 'LOWER_REPORTED_SUSCEPTIBILITY');
});

test('21. Cayman S 987.1 3.4 MY2006: elevada', () => {
  const r = ev({ familia: 'cayman', ano: 2006, generacion: '987_1', variante: 's' });
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
});

test('22. Cayman 987.2 MY2010: casos documentados', () => {
  const r = ev({ familia: 'cayman', ano: 2010, generacion: '987_2' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
});

test('23. Boxster 981 2.7: casos documentados', () => {
  const r = ev({ familia: 'boxster', ano: 2014, generacion: '981', variante: 'base' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
});

test('24. 718 Boxster de cuatro cilindros: tecnologia menos asociada', () => {
  const r = ev({ familia: 'boxster', ano: 2018, generacion: '718' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
});

// ── 25-33. Precedencias que no se pueden romper ────────────────────────────
test('25. Los sintomas prevalecen sobre una susceptibilidad baja', () => {
  const r = ev({ familia: 'boxster', ano: 2001, generacion: '986' },
    { consumoAceite: 'aumenta', golpeteo: 'frio_y_caliente' });
  assert.equal(r.susceptibilidad, 'LOWER_REPORTED_SUSCEPTIBILITY');
  assert.equal(r.evidencia, 'MULTIPLE_COMPATIBLE_SIGNALS');
  assert.equal(r.urgencia, 'PROMPT_INSPECTION');
});

test('26. Una bocanada al arrancar, sola: senal aislada y sin urgencia alta', () => {
  const r = ev(CARRERA_997_1, { humo: 'bocanada_arranque', consumoAceite: 'estable' });
  assert.equal(r.evidencia, 'ONE_NON_SPECIFIC_SIGNAL');
  assert.equal(r.urgencia, 'INFORMATION_ONLY');
});

test('27. Sin humo ni ruido pero boroscopia positiva: manda la boroscopia', () => {
  const r = ev(CARRERA_997_1,
    { humo: 'no', golpeteo: 'no', consumoAceite: 'estable' },
    { boroscopia: 'positiva' });
  assert.equal(r.evidencia, 'POSITIVE_BORESCOPE_REPORTED');
  assert.equal(r.urgencia, 'PROMPT_INSPECTION');
});

test('28. M96/M97 con boroscopia normal solo por bujias: limitada', () => {
  const r = ev(CARRERA_997_1, {},
    { boroscopia: 'normal', viaBoroscopia: 'bujias', calidadBoroscopia: 'completa' });
  assert.equal(r.evidencia, 'LIMITED_OR_INCONCLUSIVE_BORESCOPE');
  assert.equal(r.urgencia, 'BOOK_SPECIALIST_INSPECTION');
  assert.ok(r.motivos.includes('boroscopia_solo_por_bujias'));
});

test('29. Boroscopia completa, reciente y sin sintomas nuevos: negativa acotada', () => {
  const r = ev(CARRERA_997_1, {}, {
    boroscopia: 'normal', viaBoroscopia: 'ambas', calidadBoroscopia: 'completa',
    mesesDesdeBoroscopia: 2, sintomasNuevosDesdeBoroscopia: false,
  });
  assert.equal(r.evidencia, 'NEGATIVE_BORESCOPE_REPORTED');
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY',
    'una prueba negativa no rebaja la susceptibilidad de la familia');
  assert.ok(r.avisos.includes('negativa_es_de_esa_fecha'));
});

test('30. Boroscopia normal antigua + consumo nuevo: informacion contradictoria', () => {
  const r = ev(CARRERA_997_1, { consumoAceite: 'aumenta' }, {
    boroscopia: 'normal', viaBoroscopia: 'ambas', calidadBoroscopia: 'completa',
    mesesDesdeBoroscopia: 30, sintomasNuevosDesdeBoroscopia: true,
  });
  assert.equal(r.evidencia, 'CONFLICTING_EVIDENCE');
  assert.equal(r.urgencia, 'PROMPT_INSPECTION');
});

test('31. Una muestra de aceite normal no descarta nada', () => {
  const r = ev(CARRERA_997_1, {}, { analisisAceite: 'una_normal' });
  assert.equal(r.evidencia, 'NO_EVIDENCE_REPORTED');
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
});

test('32. Tendencia creciente de Al/Fe/Si: prueba sospechosa', () => {
  const r = ev(CARRERA_997_1, {}, { analisisAceite: 'tendencia_creciente' });
  assert.equal(r.evidencia, 'SUPPORTING_TEST_SUSPICIOUS');
  assert.equal(r.urgencia, 'PROMPT_INSPECTION');
});

test('33. Compresion normal en un modelo elevado no descarta scoring temprano', () => {
  const r = ev(CARRERA_997_1, {}, { compresionLeakdown: 'normal' });
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
  assert.notEqual(r.evidencia, 'NEGATIVE_BORESCOPE_REPORTED');
});

// ── 34-43. Cayenne, Panamera, Macan y electricos ───────────────────────────
test('34. Cayenne 955 de acceso VR6: bloque de hierro', () => {
  const r = ev({ familia: 'cayenne', ano: 2005, generacion: 'cayenne_955',
                 combustible: 'gasolina', variante: 'base' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
  assert.equal(r.tecnologia, 'hierro');
});

test('35. Cayenne 955 S 4.5 V8: casos documentados', () => {
  const r = ev({ familia: 'cayenne', ano: 2005, generacion: 'cayenne_955',
                 combustible: 'gasolina', variante: 's' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
});

test('36. Cayenne 958.1 S 4.8: casos documentados', () => {
  const r = ev({ familia: 'cayenne', ano: 2012, generacion: 'cayenne_958_1',
                 combustible: 'gasolina', variante: 's' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
});

test('37. Cayenne 2014 sin version: pregunta antes de clasificar', () => {
  const r = ev({ familia: 'cayenne', ano: 2014 });
  assert.equal(r.urgencia, 'INSUFFICIENT_DATA');
  assert.equal(r.siguientePregunta, 'combustible', 'el combustible ordena el resto');
  const conCombustible = ev({ familia: 'cayenne', ano: 2014, combustible: 'gasolina' });
  assert.equal(conCombustible.siguientePregunta, 'variante');
});

test('38. Panamera 970 Turbo 4.8: casos documentados', () => {
  const r = ev({ familia: 'panamera', ano: 2012, generacion: 'panamera_970',
                 combustible: 'gasolina', variante: 'turbo' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
});

test('39. Panamera 971 Turbo: tecnologia menos asociada', () => {
  const r = ev({ familia: 'panamera', ano: 2019, generacion: 'panamera_971',
                 combustible: 'gasolina', variante: 'turbo' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
});

test('40. Macan de acceso 2.0 EA888: fuera del patron Alusil', () => {
  const r = ev({ familia: 'macan', ano: 2016, generacion: 'macan_95b',
                 combustible: 'gasolina', variante: 'base' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
});

test('41. Macan S 3.0 MCT MY2016: casos documentados', () => {
  const r = ev({ familia: 'macan', ano: 2016, generacion: 'macan_95b',
                 combustible: 'gasolina', variante: 's' });
  assert.equal(r.susceptibilidad, 'DOCUMENTED_SUSCEPTIBILITY');
});

test('42. Macan S EA839 posterior: tecnologia menos asociada', () => {
  const r = ev({ familia: 'macan', ano: 2021, generacion: 'macan_95b_2',
                 combustible: 'gasolina', variante: 's' });
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
});

test('43. Taycan y Macan Electric: no aplica y sin cuestionario de cilindros', () => {
  for (const entrada of [
    { familia: 'taycan' as const, ano: 2022 },
    { familia: 'macan' as const, ano: 2025, combustible: 'electrico' as const },
  ]) {
    const r = ev(entrada);
    assert.equal(r.susceptibilidad, 'NOT_APPLICABLE_ELECTRIC');
    assert.equal(r.urgencia, 'INFORMATION_ONLY');
    assert.deepEqual(r.acciones, []);
  }
});

// ── 44-47. Motor sustituido, reconstruido y combinaciones imposibles ───────
test('44. Motor sustituido sin codigo: fabrica aparte, actual sin clasificar', () => {
  const r = ev({ ...CARRERA_997_1, originalidadMotor: 'sustituido' });
  assert.equal(r.susceptibilidadDeFabrica, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
  assert.equal(r.susceptibilidad, 'ENGINE_SPECIFIC_CLASSIFICATION');
  assert.equal(r.confianza, 'baja');
});

test('45. Reconstruido con Nikasil documentado: cambia la susceptibilidad actual', () => {
  const r = ev({
    ...CARRERA_997_1, originalidadMotor: 'reconstruido',
    tecnologiaReconstruida: 'nikasil', reconstruccionDocumentada: true,
  });
  assert.equal(r.susceptibilidadDeFabrica, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
  assert.equal(r.susceptibilidad, 'LOWER_BY_BORE_TECHNOLOGY');
  assert.equal(r.tecnologia, 'nikasil');
});

test('46. Reconstruido "parcialmente" sin detalle: no se declara solucionado', () => {
  const r = ev({ ...CARRERA_997_1, originalidadMotor: 'reconstruido' });
  assert.equal(r.susceptibilidad, 'ELEVATED_REPORTED_SUSCEPTIBILITY');
  assert.equal(r.confianza, 'baja');
  assert.ok(r.avisos.includes('no_declarar_solucionado'));
});

test('47. Cayman MY2004 no existe: se pide confirmar, no se corrige en silencio', () => {
  const r = ev({ familia: 'cayman', ano: 2004 });
  assert.equal(r.siguientePregunta, 'ano_imposible');
  assert.equal(r.motivos[0], 'modelo_y_ano_incompatibles');
});

test('48. Dos reglas de igual prioridad: salida segura, nunca una al azar', () => {
  const porPrioridad = new Map<string, string[]>();
  for (const r of REGLAS) {
    for (const f of r.familias) {
      const clave = `${f}|${r.prioridad}|${(r.generaciones ?? ['*']).join(',')}`
        + `|${(r.variantes ?? ['*']).join(',')}|${(r.cilindradas ?? ['*']).join(',')}`
        + `|${r.desde ?? ''}-${r.hasta ?? ''}|${(r.combustibles ?? ['*']).join(',')}`;
      porPrioridad.set(clave, [...(porPrioridad.get(clave) ?? []), r.id]);
    }
  }
  for (const [clave, ids] of porPrioridad) {
    assert.equal(ids.length, 1, `reglas indistinguibles en ${clave}: ${ids.join(', ')}`);
  }
});

// ── Lo que la herramienta no puede hacer nunca ─────────────────────────────
test('Ninguna combinacion de modelo y ano diagnostica bore scoring', () => {
  for (const gen of ['996_2', '997_1'] as const) {
    const r = ev({ generacion: gen, variante: 'carrera_s', ano: 2007 });
    assert.equal(r.evidencia, 'NO_EVIDENCE_REPORTED');
    assert.notEqual(r.urgencia, 'REPAIR_PLANNING');
  }
});

test('La ausencia de sintomas nunca descarta el dano', () => {
  const r = ev(CARRERA_997_1, {
    consumoAceite: 'estable', golpeteo: 'no', humo: 'no',
    hollin: 'no', fallosCombustion: 'no',
  });
  assert.equal(r.evidencia, 'NO_EVIDENCE_REPORTED');
  assert.ok(r.avisos.includes('sin_indicios_no_es_sano'));
});

test('No hay ningun porcentaje ni puntuacion en la salida', () => {
  const r = ev(CARRERA_997_1, { consumoAceite: 'aumenta' });
  const plano = JSON.stringify(r);
  assert.ok(!/\d+\s*%/.test(plano), 'no puede aparecer un porcentaje');
  for (const clave of Object.keys(r)) {
    assert.doesNotMatch(clave, /puntuacion|score|riesgo|probabilidad/i);
  }
});

test('Humo, consumo y hollin del mismo proceso no cuentan como tres familias', () => {
  const familias = familiasPresentes(
    { consumoAceite: 'aumenta', humo: 'en_marcha', hollin: 'ambas' }, {});
  assert.deepEqual(familias, ['aceite'],
    'consumo y humo son la misma familia; "ambas por igual" no es asimetria');
});

test('El consumo declarado se calcula para ensenarlo, no para decidir', () => {
  assert.equal(consumoPorMilKm({ litrosAnadidos: 2, kmEntreAportaciones: 4000 }), 0.5);
  assert.equal(consumoPorMilKm({ litrosAnadidos: 2 }), undefined);
  const flojo = ev(CARRERA_997_1, { litrosAnadidos: 5, kmEntreAportaciones: 1000 });
  assert.equal(flojo.evidencia, 'NO_EVIDENCE_REPORTED',
    'una cifra sin tendencia declarada no es una senal');
});

// ── Bordes de los tramos por ano ───────────────────────────────────────────
test('Cada corte de generacion se comprueba por los dos lados', () => {
  const casos: [number, string][] = [
    [2001, '996_1'], [2002, '996_2'], [2004, '996_2'],
    [2006, '997_1'], [2008, '997_1'], [2009, '997_2'], [2011, '997_2'],
    [2013, '991_1'], [2015, '991_1'], [2017, '991_2'], [2019, '991_2'],
  ];
  for (const [ano, generacion] of casos) {
    const r = ev({ ano, variante: 'carrera' });
    assert.ok(!r.siguientePregunta, `${ano} deberia resolverse sin preguntar`);
    assert.ok(r.motivos.some((m) => m.startsWith('regla_')), `${ano} sin regla`);
    assert.equal(evaluarBoreScoring(
      v({ ano, generacion: generacion as Vehiculo['generacion'], variante: 'carrera' }),
    ).susceptibilidad, r.susceptibilidad, `${ano} no coincide con ${generacion}`);
  }
});

test('Los solapes de generacion preguntan en vez de elegir', () => {
  for (const ano of [1998, 2005, 2012, 2016]) {
    assert.equal(ev({ ano, variante: 'carrera' }).siguientePregunta, 'generacion',
      `${ano} es un solape y deberia preguntarse`);
  }
});

test('Un ano de matriculacion nunca sale con confianza alta', () => {
  const r = ev({ ...CARRERA_997_1, baseAno: 'matriculacion', ano: 2007 });
  assert.notEqual(r.confianza, 'alta');
  assert.ok(r.avisos.includes('ano_no_es_modelo'));
});

test('Un ano fuera de rango no revienta: falta un dato', () => {
  for (const ano of [1800, 2200]) {
    assert.equal(ev({ ano }).urgencia, 'INSUFFICIENT_DATA');
  }
});

// ── Coherencia entre reglas, textos e interfaz ─────────────────────────────
test('Misma entrada, misma salida', () => {
  const entrada = v(CARRERA_997_1);
  const s: Sintomas = { consumoAceite: 'aumenta' };
  assert.deepEqual(evaluarBoreScoring(entrada, s), evaluarBoreScoring(entrada, s));
});

test('Toda salida lleva version de reglas, y las clasificadas llevan fuente', () => {
  const r = ev(CARRERA_997_1);
  assert.equal(r.versionReglas, '1.0.0');
  assert.ok(r.fuentes.length > 0);
});

test('Cada regla de la matriz tiene fuente y texto propio', () => {
  for (const regla of REGLAS) {
    assert.ok(regla.fuentes.length > 0, `${regla.id} sin fuente`);
    assert.ok(MOTIVOS[`regla_${regla.id}`], `${regla.id} sin texto en textos.es.ts`);
  }
});

test('Cada estado de los tres ejes tiene texto', () => {
  const r = ev(CARRERA_997_1);
  assert.ok(SUSCEPTIBILIDAD[r.susceptibilidad]);
  assert.ok(EVIDENCIA[r.evidencia]);
  assert.ok(URGENCIA[r.urgencia]);
});

test('Las versiones que se ofrecen son las posibles de ese coche', () => {
  assert.ok(!variantesPosibles('911').includes('spyder_gt4'));
  assert.ok(variantesPosibles('boxster', '981').includes('spyder_gt4'));
  assert.ok(!variantesPosibles('boxster', '987_1').includes('spyder_gt4'));
});
