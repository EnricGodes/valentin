import { evaluarBoreScoring } from '../logica/bore-scoring/evaluador.ts';
import { consumoPorMilKm } from '../logica/bore-scoring/reglas-evidencia.ts';
import {
  cilindradasPosibles, generacionesCandidatas, variantesPosibles,
} from '../logica/bore-scoring/reglas-vehiculo.ts';
import type {
  Pruebas, Sintomas, Valoracion, Vehiculo,
} from '../logica/bore-scoring/tipos.ts';
import {
  ACCIONES, AFINAR, AVISO, AVISOS, BOROSCOPIA_DETALLE, CONFIANZA, CONFIRMACION,
  CTA, EVIDENCIA, GENERACION, HISTORIAL, MOTIVOS, OPCIONES, PREGUNTAS, PRUEBAS,
  SINTOMAS, SUSCEPTIBILIDAD, TECNOLOGIA, UI, URGENCIA, VARIANTE,
} from '../logica/bore-scoring/textos.es.ts';
import { evento } from './eventos.ts';

/**
 * Comportamiento del evaluador de bore scoring.
 *
 * Reutiliza lo que se aprendio rehaciendo la calculadora IMS: formulario
 * minimo, aclaracion junto al campo con las opciones reales de ese coche, y en
 * el resultado solo lo que aporta algo a ESE caso.
 *
 * Lo que cambia respecto a la IMS es el numero de pasos. Aqui hay dos niveles:
 * primero la susceptibilidad, que sale con modelo y ano; y despues, si el
 * usuario quiere, sintomas y pruebas. El segundo nivel es voluntario y se abre
 * ya desplegado cuando el propio usuario ha dicho que viene con un sintoma o
 * con una prueba: en ese caso esconderselo seria hacerle buscar la razon por
 * la que ha entrado.
 *
 * Ni el codigo de motor ni el consumo declarado salen de esta funcion: ni a la
 * analitica, ni a la URL del CTA.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* El tono acompana a la ACCION, no a la susceptibilidad. Colorear la
   susceptibilidad seria pintar de rojo un coche por su modelo y su ano, que es
   justo lo que la herramienta no puede decir. Y el tono nunca sustituye a la
   palabra: la especificacion prohibe el semaforo y el velocimetro. */
const TONO: Record<Valoracion['urgencia'], string> = {
  INFORMATION_ONLY: 'calma',
  PPI_SCOPE_RECOMMENDED: 'aviso',
  BOOK_SPECIALIST_INSPECTION: 'aviso',
  PROMPT_INSPECTION: 'alerta',
  MINIMIZE_USE_AND_CONTACT: 'alerta',
  REPAIR_PLANNING: 'alerta',
  INSUFFICIENT_DATA: 'neutro',
};

/** Generaciones donde tambien existe la calculadora IMS. */
const GENERACIONES_CON_IMS = new Set(['996_1', '996_2', '997_1', '986', '987_1']);

type Memoria = Record<string, string>;

/** Los cuatro ejes del resultado. Un eje sin nada que decir no se pinta. */
function ejes(r: Valoracion): [string, string, string][] {
  const filas: [string, string, string][] = [];
  if (r.tecnologia !== 'desconocida') {
    filas.push([UI.ejeConfiguracion, TECNOLOGIA[r.tecnologia], '']);
  }
  filas.push([UI.ejeSusceptibilidad, SUSCEPTIBILIDAD[r.susceptibilidad].etiqueta,
              SUSCEPTIBILIDAD[r.susceptibilidad].resumen]);
  if (r.susceptibilidad !== 'NOT_APPLICABLE_ELECTRIC') {
    filas.push([UI.ejeEvidencia, EVIDENCIA[r.evidencia].etiqueta,
                EVIDENCIA[r.evidencia].resumen]);
    filas.push([UI.ejeConfianza, CONFIANZA[r.confianza], '']);
  }
  return filas;
}

function pintaResultado(
  r: Valoracion, v: Vehiculo, s: Sintomas, enlaces: { articulo?: string; ims?: string },
): string {
  const urg = URGENCIA[r.urgencia];
  const susc = SUSCEPTIBILIDAD[r.susceptibilidad];
  const motivos = r.motivos.map((m) => MOTIVOS[m]).filter(Boolean) as string[];
  const avisos = r.avisos.map((a) => AVISOS[a]).filter(Boolean) as string[];
  const acciones = [...new Set(r.acciones)].map((a) => ACCIONES[a]).filter(Boolean) as string[];

  /* Solo datos no sensibles en la URL: ni VIN, ni matricula, ni codigo de
     motor, ni el consumo declarado. */
  const cta = `/contacto?motivo=bore-scoring&modelo=${encodeURIComponent(v.familia)}`
    + (v.generacion ? `&generacion=${encodeURIComponent(v.generacion)}` : '')
    + `&resultado=${encodeURIComponent(r.susceptibilidad.toLowerCase())}`
    + `&urgencia=${encodeURIComponent(r.urgencia.toLowerCase())}`;

  /* La configuracion de fabrica solo se ensena si difiere de la actual: si el
     motor es el que salio de la fabrica, repetirla es ruido. */
  const difiereFabrica = r.susceptibilidadDeFabrica !== r.susceptibilidad;

  const litros = consumoPorMilKm(s);
  const electrico = r.susceptibilidad === 'NOT_APPLICABLE_ELECTRIC';
  const puenteIms = enlaces.ims && v.generacion && GENERACIONES_CON_IMS.has(v.generacion);

  /* El titular es la susceptibilidad: es lo que se ha venido a preguntar. La
     urgencia es la respuesta a "y ahora que hago", y va con la accion. */
  return `
    <div class="herr-res bs-res">
      <p class="herr-veredicto">${esc(susc.etiqueta)}</p>
      <p class="herr-res-resumen">${esc(susc.resumen)}</p>

      <dl class="herr-res-datos bs-ejes">
        ${ejes(r).map(([k, val, pie]) => `<div>
            <dt>${esc(k)}</dt>
            <dd>${esc(val)}</dd>
            ${pie ? `<p class="bs-eje-pie">${esc(pie)}</p>` : ''}
          </div>`).join('')}
      </dl>

      ${difiereFabrica ? `<p class="herr-res-retro">
        <strong>${esc(UI.deFabrica)}:</strong>
        ${esc(SUSCEPTIBILIDAD[r.susceptibilidadDeFabrica].etiqueta)}.
        ${esc(SUSCEPTIBILIDAD[r.susceptibilidadDeFabrica].resumen)}</p>` : ''}

      ${litros !== undefined ? `<p class="bs-consumo">
        <span>${esc(UI.consumoDeclarado)}</span>
        <b>${litros} ${esc(UI.consumoUnidad)}</b></p>` : ''}

      <div class="bs-paso bs-paso--${TONO[r.urgencia]}">
        <p class="bs-paso-titulo">${esc(UI.siguientePaso)}</p>
        <p class="bs-paso-que">${esc(urg.etiqueta)}</p>
        <p class="bs-paso-porque">${esc(urg.resumen)}</p>
        <div class="herr-acciones">
          <a class="cta" href="${cta}" data-bs-cta>${esc(CTA[r.urgencia])}</a>
          ${enlaces.articulo
            ? `<a class="cta cta--linea" href="${enlaces.articulo}">${esc(UI.ctaArticulo)}</a>`
            : ''}
        </div>
      </div>

      ${/* Situacion: una linea que cambia el siguiente paso, no la mecanica. */ ''}
      ${electrico ? '' : `
      <fieldset class="bs-situacion" data-bs-situacion aria-live="off">
        <legend>${esc(UI.situacion)}</legend>
        <div class="herr-opciones-lista">
          ${OPCIONES.situacion.map((o) => `
            <label class="herr-opcion">
              <input type="radio" name="situacion" value="${esc(o.valor)}"
                     ${v.situacion === o.valor ? 'checked' : ''}>
              <span>${esc(o.etiqueta)}</span>
            </label>`).join('')}
        </div>
      </fieldset>`}

      ${electrico ? '' : `
      <div class="herr-afinar bs-afinar" data-bs-afinar aria-live="off">
        <button type="button" class="bs-afinar-boton" data-bs-abrir
                aria-expanded="false" aria-controls="bs-preguntas">
          <span class="herr-afinar-titulo">${esc(AFINAR.titulo)}</span>
          <span class="bs-afinar-signo" aria-hidden="true"></span>
        </button>
        <p class="herr-afinar-ayuda">${esc(AFINAR.ayuda)}</p>
        <div class="bs-preguntas" id="bs-preguntas" data-bs-preguntas></div>
      </div>`}

      <div class="herr-detalle">
        <div class="herr-detalle-cuerpo">
          <p>${esc(susc.cuerpo ?? susc.resumen)}</p>
          ${electrico ? '' : `<p>${esc(EVIDENCIA[r.evidencia].cuerpo ?? '')}</p>`}
          ${motivos.length ? `<h4>${esc(UI.porqueEsto)}</h4>
            <ul>${motivos.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
          ${acciones.length ? `<h4>${esc(UI.siguientePaso)}</h4>
            <ul>${acciones.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
          ${avisos.length ? `<h4>${esc(UI.aTenerEnCuenta)}</h4>
            <ul>${avisos.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
          ${electrico ? '' : `<p class="bs-confirmacion">${esc(CONFIRMACION)}</p>`}
          ${puenteIms ? `<p class="bs-puente">${esc(UI.imsPuente)}
            <a href="${enlaces.ims}">${esc(UI.ctaIms)}</a></p>` : ''}
          <p class="herr-aviso">${esc(AVISO)}</p>
        </div>
      </div>
    </div>`;
}

export function iniciarEvaluadorBoreScoring(): void {
  const raiz = document.querySelector<HTMLElement>('[data-bs]');
  if (!raiz) return;

  /* Dentro de un articulo se sirve al final del cuerpo y se mueve al hueco de
     la directiva `:::herramienta`, con su colocacion en la rejilla. */
  const hueco = document.querySelector('[data-herramienta-hueco="evaluador-bore-scoring"]');
  if (hueco) {
    raiz.classList.add(...hueco.classList);
    hueco.replaceWith(raiz);
  }

  const form = raiz.querySelector<HTMLFormElement>('[data-bs-form]')!;
  const zonaPregunta = raiz.querySelector<HTMLElement>('[data-bs-pregunta]')!;
  const salida = raiz.querySelector<HTMLElement>('[data-bs-resultado]')!;
  const error = raiz.querySelector<HTMLElement>('[data-bs-error]')!;
  const campoAno = raiz.querySelector<HTMLInputElement>('#bs-ano');
  const enlaces = {
    articulo: raiz.dataset.articulo || undefined,
    ims: raiz.dataset.enlaceIms || undefined,
  };

  /** Lo respondido fuera de los tres campos fijos. Sobrevive al repintado. */
  const memoria: Memoria = {};
  let empezado = false;
  let afinadoAbierto = false;
  let medidoPaso2 = false;

  const valor = (n: string) =>
    raiz.querySelector<HTMLInputElement>(`[name="${n}"]`)?.value ?? '';

  const limpia = (x?: string) => (x && x !== 'desconocida' && x !== '' ? x : undefined);

  function leerVehiculo(): Vehiculo {
    return {
      familia: valor('familia') as Vehiculo['familia'],
      ano: Number(valor('ano')),
      baseAno: (valor('baseAno') || 'modelo') as Vehiculo['baseAno'],
      generacion: limpia(memoria.generacion) as Vehiculo['generacion'],
      variante: limpia(memoria.variante) as Vehiculo['variante'],
      combustible: limpia(memoria.combustible) as Vehiculo['combustible'],
      cilindrada: memoria.cilindrada ? Number(memoria.cilindrada) : undefined,
      originalidadMotor: limpia(memoria.originalidadMotor) as Vehiculo['originalidadMotor'],
      tecnologiaReconstruida:
        limpia(memoria.tecnologiaReconstruida) as Vehiculo['tecnologiaReconstruida'],
      situacion: limpia(memoria.situacion) as Vehiculo['situacion'],
    };
  }

  function leerSintomas(): Sintomas {
    const n = (k: string) => (memoria[k] ? Number(memoria[k]) : undefined);
    return {
      consumoAceite: limpia(memoria.consumoAceite) as Sintomas['consumoAceite'],
      litrosAnadidos: n('litrosAnadidos'),
      kmEntreAportaciones: n('kmEntreAportaciones'),
      golpeteo: limpia(memoria.golpeteo) as Sintomas['golpeteo'],
      hollin: limpia(memoria.hollin) as Sintomas['hollin'],
      humo: limpia(memoria.humo) as Sintomas['humo'],
      fallosCombustion: limpia(memoria.fallosCombustion) as Sintomas['fallosCombustion'],
      /* La bujia aceitosa viaja dentro de "fallo activo": son la misma
         pregunta en el taller y separarlas alargaba el formulario sin cambiar
         ninguna respuesta. */
      bujiaAceitosa: memoria.fallosCombustion === 'activo' ? true : undefined,
    };
  }

  function leerPruebas(): Pruebas {
    return {
      boroscopia: limpia(memoria.boroscopia) as Pruebas['boroscopia'],
      viaBoroscopia: limpia(memoria.viaBoroscopia) as Pruebas['viaBoroscopia'],
      calidadBoroscopia: limpia(memoria.calidadBoroscopia) as Pruebas['calidadBoroscopia'],
      sintomasNuevosDesdeBoroscopia: memoria.sintomasNuevosDesdeBoroscopia === 'si',
      analisisAceite: limpia(memoria.analisisAceite) as Pruebas['analisisAceite'],
      compresionLeakdown: limpia(memoria.compresionLeakdown) as Pruebas['compresionLeakdown'],
    };
  }

  /**
   * La aclaracion: una linea de por que y las opciones REALES de ese coche, a
   * la vista y sin nada preseleccionado. Elegir resuelve; no hay que volver a
   * pulsar el boton.
   */
  function pintaPregunta(r: Valoracion, v: Vehiculo) {
    const clave = r.siguientePregunta!;
    const p = PREGUNTAS[clave];

    /* Un ano que no existe para ese modelo no se resuelve preguntando otra
       cosa: se dice, y se corrige arriba. */
    if (clave === 'ano_imposible') {
      zonaPregunta.innerHTML = `<p class="herr-pregunta-porque">${esc(p.porque)}
        <b>${esc(p.etiqueta)}</b></p>`;
      zonaPregunta.hidden = false;
      salida.hidden = true;
      return;
    }

    const opciones: { valor: string; etiqueta: string }[] =
      clave === 'generacion'
        ? [...generacionesCandidatas(v.familia, v.ano).map(
            (g) => ({ valor: g, etiqueta: GENERACION[g] ?? g })),
           { valor: 'desconocida', etiqueta: GENERACION.desconocida }]
      : clave === 'variante'
        ? [...variantesPosibles(v.familia, v.generacion).map(
            (x) => ({ valor: x, etiqueta: VARIANTE[x] })),
           { valor: 'desconocida', etiqueta: UI.noLoSe }]
      : clave === 'cilindrada'
        ? [...cilindradasPosibles(v.familia, v.generacion).map(
            (c) => ({ valor: String(c), etiqueta: `${c} l`.replace('.', ',') })),
           { valor: '', etiqueta: UI.noLoSe }]
        : OPCIONES.combustible;

    zonaPregunta.innerHTML = `
      <fieldset class="herr-opciones">
        <legend class="herr-pregunta-porque">${esc(p.porque)}
          <b>${esc(p.etiqueta)}</b></legend>
        <div class="herr-opciones-lista">
          ${opciones.map((o) => `
            <label class="herr-opcion">
              <input type="radio" name="${clave}" value="${esc(o.valor)}"
                     ${memoria[clave] === o.valor ? 'checked' : ''}>
              <span>${esc(o.etiqueta)}</span>
            </label>`).join('')}
        </div>
      </fieldset>`;
    zonaPregunta.hidden = false;

    for (const radio of zonaPregunta.querySelectorAll<HTMLInputElement>('input[type=radio]')) {
      radio.addEventListener('change', () => {
        memoria[clave] = radio.value;
        calcular();
      });
    }

    salida.hidden = true;
    zonaPregunta.querySelector<HTMLInputElement>('input[type=radio]')?.focus();

    evento('bore_scoring_clarification_shown', {
      familia: v.familia, pregunta: clave, version_reglas: r.versionReglas,
    });
  }

  /* ── Paso 2: sintomas y pruebas ───────────────────────────────────────── */

  function grupoRadio(
    destino: HTMLElement, p: typeof SINTOMAS[number], nivel: 'sintoma' | 'prueba' | 'detalle',
  ) {
    const caja = document.createElement('fieldset');
    caja.className = `bs-pregunta bs-pregunta--${nivel}`;
    const leyenda = document.createElement('legend');
    leyenda.textContent = p.etiqueta;
    caja.append(leyenda);
    if (p.ayuda) {
      const ayuda = document.createElement('p');
      ayuda.className = 'herr-afinar-ayuda';
      ayuda.textContent = p.ayuda;
      caja.append(ayuda);
    }
    const lista = document.createElement('div');
    lista.className = 'herr-opciones-lista';
    for (const o of p.opciones) {
      const label = document.createElement('label');
      label.className = 'herr-opcion';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = p.campo;
      input.value = o.valor;
      if (memoria[p.campo] === o.valor) input.checked = true;
      const span = document.createElement('span');
      span.textContent = o.etiqueta;
      label.append(input, span);
      lista.append(label);
      input.addEventListener('change', () => {
        memoria[p.campo] = o.valor;
        calcular('afinado');
      });
    }
    caja.append(lista);
    destino.append(caja);
  }

  /** Los dos numeros del consumo. Se recogen para el taller, no para puntuar. */
  function detalleConsumo(destino: HTMLElement) {
    const caja = document.createElement('div');
    caja.className = 'bs-detalle-campos';
    const titulo = document.createElement('p');
    titulo.className = 'herr-afinar-ayuda';
    titulo.textContent = UI.detallesConsumo;
    caja.append(titulo);
    const campos = document.createElement('div');
    campos.className = 'herr-campos';
    for (const [campo, etiqueta] of [
      ['litrosAnadidos', 'Litros añadidos'],
      ['kmEntreAportaciones', 'Km entre aportaciones'],
    ] as [string, string][]) {
      const p = document.createElement('p');
      p.className = 'herr-campo';
      const lab = document.createElement('label');
      lab.setAttribute('for', `bs-${campo}`);
      lab.textContent = etiqueta;
      const input = document.createElement('input');
      input.type = 'number';
      input.inputMode = 'decimal';
      input.min = '0';
      input.id = `bs-${campo}`;
      input.name = campo;
      input.value = memoria[campo] ?? '';
      input.addEventListener('change', () => {
        memoria[campo] = input.value;
        calcular('afinado');
      });
      p.append(lab, input);
      campos.append(p);
    }
    caja.append(campos);
    destino.append(caja);
  }

  /**
   * Las preguntas del paso 2. El detalle solo aparece cuando la respuesta lo
   * pide: preguntar la via de acceso de una boroscopia que no existe, o los
   * litros de un consumo estable, es pedir por pedir.
   */
  function pintaAfinado(v: Vehiculo) {
    const caja = salida.querySelector<HTMLElement>('[data-bs-preguntas]');
    if (!caja) return;

    for (const p of SINTOMAS) {
      grupoRadio(caja, p, 'sintoma');
      if (p.campo === 'consumoAceite' && memoria.consumoAceite === 'aumenta') {
        detalleConsumo(caja);
      }
    }

    for (const p of PRUEBAS) {
      grupoRadio(caja, p, 'prueba');
      if (p.campo === 'boroscopia' && memoria.boroscopia && memoria.boroscopia !== 'no') {
        for (const d of BOROSCOPIA_DETALLE) grupoRadio(caja, d, 'detalle');
      }
    }

    /* El historial solo cambia algo donde hay una susceptibilidad de fabrica
       que contradecir. En un electrico no se pregunta. */
    grupoRadio(caja, HISTORIAL, 'prueba');
    if (memoria.originalidadMotor === 'reconstruido'
        || memoria.originalidadMotor === 'sustituido') {
      grupoRadio(caja, {
        campo: 'tecnologiaReconstruida',
        etiqueta: '¿Qué se instaló en los cilindros?',
        opciones: OPCIONES.tecnologiaReconstruida,
      }, 'detalle');
    }
    void v;
  }

  function cableaSituacion() {
    for (const radio of salida.querySelectorAll<HTMLInputElement>(
      '[data-bs-situacion] input[type=radio]')) {
      radio.addEventListener('change', () => {
        memoria.situacion = radio.value;
        calcular('situacion');
      });
    }
  }

  function calcular(origen: 'inicial' | 'situacion' | 'afinado' = 'inicial') {
    const v = leerVehiculo();

    error.hidden = true;
    if (!Number.isInteger(v.ano) || v.ano < 1948 || v.ano > new Date().getFullYear() + 1) {
      error.textContent = UI.errorAno;
      error.hidden = false;
      campoAno?.focus();
      return;
    }

    const sintomas = leerSintomas();
    const pruebas = leerPruebas();
    const r = evaluarBoreScoring(v, sintomas, pruebas);

    if (r.siguientePregunta) {
      /* Si ya ha contestado "No lo se" a esa misma pregunta, repintarla otra
         vez es no hacer nada a ojos de quien la usa. Se responde lo que se
         puede responder, que es que sin ese dato no se sabe. */
      const yaDijoQueNoSabe = memoria[r.siguientePregunta] === 'desconocida'
        || memoria[r.siguientePregunta] === '';
      if (!yaDijoQueNoSabe) {
        pintaPregunta(r, v);
        return;
      }
    }

    // Resuelto: la aclaracion ya no hace falta.
    zonaPregunta.hidden = true;

    /* El foco puede estar dentro de lo que se va a repintar. Se recuerda para
       devolverlo despues: si no, quien navega con teclado vuelve al principio. */
    const activo = document.activeElement as HTMLElement | null;
    const foco = activo?.getAttribute?.('name');
    const focoValor = (activo as HTMLInputElement | null)?.value;

    salida.innerHTML = pintaResultado(r, v, sintomas, enlaces);
    salida.hidden = false;
    cableaSituacion();
    pintaAfinado(v);

    /* El cuestionario se queda abierto en cuanto se ha contestado algo, y se
       abre solo si el usuario ha dicho que viene por un sintoma o con una
       prueba: es lo que ha venido a contar, y esconderselo le obligaria a
       buscarlo. Elegir la situacion no lo abre: eso cambia el siguiente paso,
       no lo que se sabe del motor. */
    if (origen === 'afinado' || v.situacion === 'sintoma' || v.situacion === 'prueba') {
      afinadoAbierto = true;
    }
    const caja = salida.querySelector('[data-bs-afinar]');
    caja?.classList.toggle('bs-afinar--abierto', afinadoAbierto);
    const boton = caja?.querySelector('[data-bs-abrir]');
    boton?.setAttribute('aria-expanded', String(afinadoAbierto));
    boton?.addEventListener('click', () => {
      afinadoAbierto = !afinadoAbierto;
      caja?.classList.toggle('bs-afinar--abierto', afinadoAbierto);
      boton.setAttribute('aria-expanded', String(afinadoAbierto));
    });

    if (foco) {
      const vuelta = focoValor
        ? salida.querySelector<HTMLElement>(`[name="${foco}"][value="${CSS.escape(focoValor)}"]`)
        : salida.querySelector<HTMLElement>(`[name="${foco}"]`);
      vuelta?.focus();
    }

    if (afinadoAbierto && !medidoPaso2) {
      medidoPaso2 = true;
      evento('bore_scoring_symptom_step_started', { familia: v.familia });
    }

    /* Analitica sin datos sensibles: ni el ano exacto, ni el codigo de motor,
       ni el consumo declarado. */
    evento(origen === 'afinado' ? 'bore_scoring_final_result' : 'bore_scoring_baseline_result', {
      familia: v.familia,
      generacion: v.generacion ?? 'deducida',
      decada: `${Math.floor(v.ano / 10) * 10}s`,
      tecnologia: r.tecnologia,
      susceptibilidad: r.susceptibilidad,
      evidencia: r.evidencia,
      urgencia: r.urgencia,
      situacion: v.situacion ?? 'sin_declarar',
      confianza: r.confianza,
      version_reglas: r.versionReglas,
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calcular();
  });

  form.addEventListener('change', () => {
    if (empezado) return;
    empezado = true;
    evento('bore_scoring_evaluator_started', { familia: valor('familia') });
  });

  /* Cambiar el coche invalida lo respondido antes. Escuchar el formulario
     entero borraria la respuesta que se acaba de dar a la aclaracion. */
  for (const sel of ['#bs-familia', '#bs-ano', '#bs-base']) {
    raiz.querySelector(sel)?.addEventListener('change', () => {
      for (const k of Object.keys(memoria)) delete memoria[k];
      afinadoAbierto = false;
      zonaPregunta.hidden = true;
      zonaPregunta.innerHTML = '';
      salida.hidden = true;
    });
  }

  salida.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t?.closest?.('[data-bs-cta]')) {
      evento('bore_scoring_contact_clicked', { familia: valor('familia') });
    } else if (t?.closest?.('.bs-puente a')) {
      evento('bore_scoring_ims_crosslink_clicked', { familia: valor('familia') });
    }
  });
}
