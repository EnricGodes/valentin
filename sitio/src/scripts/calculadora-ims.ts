import { evaluarIms } from '../logica/ims/evaluador.ts';
import type { Evaluacion, Vehiculo } from '../logica/ims/tipos.ts';
import {
  ACCIONES, AFINAR, AVISO, ESTADOS, GENERACION, MOTIVOS,
  OPCIONES, PREGUNTAS, RETROFIT, RODAMIENTOS, SUSTITUIBILIDAD, UI,
} from '../logica/ims/textos.es.ts';
import { corteDe, generacionesCandidatas } from '../logica/ims/reglas.ts';
import { evento } from './eventos.ts';

/**
 * Comportamiento de la calculadora IMS.
 *
 * Tres estados y nada mas: formulario, aclaracion, resultado. En pantalla solo
 * esta lo que hace falta para el paso siguiente.
 *
 * El evaluador es puro y vive aparte. Aqui se leen campos, se pinta y se mide.
 * El numero de motor NO sale de esta funcion: ni a la analitica, ni a la URL.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Datos que aportan algo en ESTE resultado. Un "no aplica" no es un dato. */
function datos(r: Evaluacion): [string, string][] {
  const fuera = new Set(['no_aplica', 'desconocida', 'desconocido']);
  const filas: [string, string][] = [];
  if (!fuera.has(r.rodamientoDeFabrica)) {
    filas.push([UI.configuracion, RODAMIENTOS[r.rodamientoDeFabrica]]);
  }
  if (!fuera.has(r.sustituibilidad)) {
    filas.push([UI.sustitucion, SUSTITUIBILIDAD[r.sustituibilidad]]);
  }
  return filas;
}

/**
 * Que campos pueden cambiar ESTE resultado. Solo la transicion se afina: ahi el
 * numero de motor decide entre un rodamiento y otro. Cuando el veredicto ya
 * esta cerrado no se pide nada mas; preguntar por el historial despues de un
 * "Si" no cambiaba la respuesta y alargaba el formulario.
 */
function afinables(r: Evaluacion): { modo: keyof typeof AFINAR; campos: string[] } | null {
  if (r.estado === 'TRANSICION_DOBLE_O_SIMPLE' || r.estado === 'TRANSICION_SIMPLE_O_GRANDE') {
    return { modo: 'transicion', campos: ['originalidadMotor', 'codigoMotor', 'ladoDelCorte'] };
  }
  return null;
}

function pintaResultado(r: Evaluacion, v: Vehiculo, articulo?: string): string {
  const t = ESTADOS[r.estado];
  const retro = r.estadoActual ? RETROFIT[r.estadoActual] : null;
  const motivos = r.motivos.map((m) => MOTIVOS[m]).filter(Boolean) as string[];
  const acciones = [...new Set(r.acciones)].map((a) => ACCIONES[a]).filter(Boolean) as string[];

  /* Solo datos no sensibles en la URL: ni VIN, ni numero de motor. */
  const cta = `/contacto?motivo=ims&modelo=${encodeURIComponent(v.familia)}`
    + `&anio=${v.ano}&resultado=${encodeURIComponent(r.estado.toLowerCase())}`;

  const afinar = afinables(r);

  /* A un coche que no tiene este problema no se le ofrece un diagnostico de
     este problema. */
  return `
    <div class="ims-res ims-res--${r.respuesta}">
      <p class="ims-veredicto">${esc(t.veredicto)}</p>

      <p class="ims-res-resumen">${esc(t.resumen)}</p>

      <dl class="ims-res-datos">
        ${datos(r).map(([k, val]) =>
          `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}
      </dl>

      ${retro ? `<p class="ims-res-retro"><strong>${esc(retro.titular)}.</strong>
        ${esc(retro.cuerpo)}</p>` : ''}

      <div class="ims-acciones">
        ${r.respuesta === 'no' ? '' :
          `<a class="cta" href="${cta}" data-ims-cta>${esc(UI.ctaBoton)}</a>`}
        ${articulo ? `<a class="cta cta--linea" href="${articulo}">${esc(UI.ctaArticulo)}</a>` : ''}
      </div>

      ${afinar ? `
      <div class="ims-afinar" data-ims-afinar>
        <p class="ims-afinar-titulo">${esc(AFINAR[afinar.modo].titulo)}</p>
        <p class="ims-afinar-ayuda">${esc(AFINAR[afinar.modo].ayuda)}</p>
        <div class="ims-campos" data-ims-afinar-campos></div>
      </div>` : ''}

      <div class="ims-detalle">
        <div class="ims-detalle-cuerpo">
          <p>${esc(t.cuerpo)}</p>
          ${motivos.length ? `<h4>${esc(UI.porqueEsto)}</h4>
            <ul>${motivos.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
          ${acciones.length ? `<h4>${esc(UI.siguientePaso)}</h4>
            <ul>${acciones.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
          ${t.accion ? `<p>${esc(t.accion)}</p>` : ''}
          <p class="ims-aviso">${esc(AVISO)}</p>
        </div>
      </div>
    </div>`;
}

export function iniciarCalculadoraIms(): void {
  const raiz = document.querySelector<HTMLElement>('[data-ims]');
  if (!raiz) return;

  /* Dentro de un articulo se sirve al final del cuerpo y se mueve al hueco de
     la directiva `:::herramienta`, con su colocacion en la rejilla. */
  const hueco = document.querySelector('[data-ims-hueco="calculadora-ims"]');
  if (hueco) {
    raiz.classList.add(...hueco.classList);
    hueco.replaceWith(raiz);
  }

  const form = raiz.querySelector<HTMLFormElement>('[data-ims-form]')!;
  const zonaPregunta = raiz.querySelector<HTMLElement>('[data-ims-pregunta]')!;
  const salida = raiz.querySelector<HTMLElement>('[data-ims-resultado]')!;
  const error = raiz.querySelector<HTMLElement>('[data-ims-error]')!;
  const articulo = raiz.dataset.articulo || undefined;

  /** Lo respondido fuera de los tres campos fijos. Sobrevive al repintado. */
  const memoria: Record<string, string> = {};
  let empezado = false;

  const plantilla = (campo: string) =>
    raiz.querySelector<HTMLTemplateElement>(`[data-ims-plantilla="${campo}"]`)!
      .content.cloneNode(true) as DocumentFragment;

  /** Monta un campo con su etiqueta dentro de `destino`. */
  function monta(destino: HTMLElement, campo: string, etiqueta: string, ayuda?: string) {
    const frag = plantilla(campo);
    const control = frag.querySelector('select, input') as HTMLSelectElement | HTMLInputElement;
    return montaControl(destino, control, campo, etiqueta, ayuda);
  }

  /** El cableado comun: etiqueta, ayuda, memoria y recalculo al cambiar. */
  function montaControl(
    destino: HTMLElement, control: HTMLSelectElement | HTMLInputElement,
    campo: string, etiqueta: string, ayuda?: string,
  ) {
    const p = document.createElement('p');
    p.className = 'ims-campo';
    const lab = document.createElement('label');
    lab.setAttribute('for', control.id);
    lab.textContent = etiqueta;
    p.append(lab, control);
    if (ayuda) {
      const s = document.createElement('span');
      s.className = 'ims-ayuda';
      s.textContent = ayuda;
      p.append(s);
    }
    destino.append(p);
    if (memoria[campo]) control.value = memoria[campo];

    const guardar = () => { memoria[campo] = control.value; };
    control.addEventListener('input', guardar);
    control.addEventListener('change', () => {
      guardar();
      if (destino.closest('[data-ims-afinar]')) calcular('afinado');
    });
    return control;
  }

  /**
   * El lado del corte. No hay una lista de numeros de motor que ofrecer: cada
   * tipo tiene UN umbral, y el numero grabado en el bloque solo sirve para
   * saber de que lado cae. Se elige el lado y no se teclean ocho cifras.
   */
  function montaLado(destino: HTMLElement, hasta: number) {
    const sel = document.createElement('select');
    sel.name = 'ladoDelCorte';
    sel.id = 'ims-lado';
    for (const [valor, etiqueta] of [
      ['', UI.ladoNoSe],
      ['inferior', UI.ladoInferior(hasta)],
      ['superior', UI.ladoSuperior(hasta)],
    ] as [string, string][]) {
      const o = document.createElement('option');
      o.value = valor;
      o.textContent = etiqueta;
      sel.append(o);
    }
    return montaControl(destino, sel, 'ladoDelCorte', UI.ladoDelCorte, UI.ladoAyuda);
  }

  /** Los motores que no son de ese modelo no se ofrecen. */
  function filtraMotores(sel: HTMLSelectElement, familia: string) {
    for (const o of [...sel.options]) {
      const f = o.dataset.familias;
      if (f && !f.split(',').includes(familia)) o.remove();
    }
  }

  const valor = (n: string) =>
    raiz.querySelector<HTMLInputElement>(`[name="${n}"]`)?.value ?? '';

  function leer(): Vehiculo {
    const limpia = (x?: string) => (x && x !== 'desconocida' ? x : undefined);
    return {
      familia: valor('familia') as Vehiculo['familia'],
      ano: Number(valor('ano')),
      baseAno: (valor('baseAno') || 'modelo') as Vehiculo['baseAno'],
      generacion: limpia(memoria.generacion) as Vehiculo['generacion'],
      variante: limpia(memoria.variante) as Vehiculo['variante'],
      codigoMotor: memoria.codigoMotor || undefined,
      ladoDelCorte: (memoria.ladoDelCorte || undefined) as Vehiculo['ladoDelCorte'],
      originalidadMotor: (memoria.originalidadMotor
        || 'desconocida') as Vehiculo['originalidadMotor'],
      intervencionIms: (memoria.intervencionIms || 'ninguna') as Vehiculo['intervencionIms'],
    };
  }

  /**
   * La aclaracion: una linea de por que y las opciones REALES de ese coche,
   * a la vista y sin nada preseleccionado. Elegir resuelve; no hay que
   * volver a pulsar el boton.
   */
  function pintaPregunta(r: Evaluacion, v: Vehiculo) {
    const clave = r.siguientePregunta!;
    const p = PREGUNTAS[clave];

    // Para un 911 de 2005 son 996 y 997.1. Nunca la lista entera.
    const opciones = clave === 'generacion'
      ? [...generacionesCandidatas(v.familia, v.ano).map(
          (g) => ({ valor: g, etiqueta: GENERACION[g] ?? g })),
         { valor: 'desconocida', etiqueta: GENERACION.desconocida }]
      : OPCIONES.variante;

    zonaPregunta.innerHTML = `
      <fieldset class="ims-opciones">
        <legend class="ims-pregunta-porque">${esc(p.porque)}
          <b>${esc(p.etiqueta)}</b></legend>
        <div class="ims-opciones-lista">
          ${opciones.map((o, i) => `
            <label class="ims-opcion">
              <input type="radio" name="${clave}" value="${esc(o.valor)}"
                     ${memoria[clave] === o.valor ? 'checked' : ''}>
              <span>${esc(o.etiqueta)}</span>
            </label>`).join('')}
        </div>
      </fieldset>`;
    zonaPregunta.hidden = true;
    zonaPregunta.hidden = false;

    for (const radio of zonaPregunta.querySelectorAll<HTMLInputElement>('input[type=radio]')) {
      radio.addEventListener('change', () => {
        memoria[clave] = radio.value;
        calcular();
      });
    }

    salida.hidden = true;
    zonaPregunta.querySelector<HTMLInputElement>('input[type=radio]')?.focus();

    evento('ims_calculator_clarification_shown', {
      familia: v.familia, pregunta: clave, version_reglas: r.versionReglas,
    });
  }

  function pintaAfinado(r: Evaluacion, v: Vehiculo) {
    const caja = salida.querySelector<HTMLElement>('[data-ims-afinar-campos]');
    const cfg = afinables(r);
    if (!caja || !cfg) return;
    const etiquetas: Record<string, string> = {
      originalidadMotor: UI.motorOriginal,
      codigoMotor: UI.codigoMotor,
    };
    const ayudas: Record<string, string> = {
      codigoMotor: UI.codigoAyuda,
    };
    for (const campo of cfg.campos) {
      /* El lado del corte solo existe si ese motor tiene corte, y sus opciones
         son las de ESE corte: se construye aqui, no en una plantilla fija. */
      if (campo === 'ladoDelCorte') {
        const corte = corteDe(v.familia, memoria.codigoMotor);
        if (corte) montaLado(caja, corte.hasta);
        continue;
      }
      const control = monta(caja, campo, etiquetas[campo], ayudas[campo]);
      if (campo === 'codigoMotor') filtraMotores(control as HTMLSelectElement, v.familia);
    }
  }

  function calcular(origen: 'inicial' | 'afinado' = 'inicial') {
    const v = leer();

    error.hidden = true;
    if (!Number.isInteger(v.ano) || v.ano < 1948 || v.ano > new Date().getFullYear() + 1) {
      error.textContent = UI.errorAno;
      error.hidden = false;
      raiz.querySelector<HTMLInputElement>('#ims-ano')?.focus();
      return;
    }

    const r = evaluarIms(v);

    if (r.estado === 'DATOS_INSUFICIENTES' && r.siguientePregunta) {
      /* Si ya ha contestado "No lo se" a esa misma pregunta, repintarla otra
         vez es no hacer nada a ojos de quien la usa. Se responde lo que se
         puede responder: que sin ese dato no se sabe, y como se resuelve. */
      if (memoria[r.siguientePregunta] === 'desconocida') {
        salida.innerHTML = pintaResultado(r, v, articulo);
        salida.hidden = false;
        return;
      }
      pintaPregunta(r, v);
      return;
    }

    // Resuelto: la aclaracion ya no hace falta.
    zonaPregunta.hidden = true;

    /* El foco puede estar dentro de lo que se va a repintar. Se recuerda para
       devolverlo despues: si no, quien navega con teclado vuelve al principio. */
    const foco = (document.activeElement as HTMLElement)?.getAttribute?.('name');

    salida.innerHTML = pintaResultado(r, v, articulo);
    salida.hidden = false;
    pintaAfinado(r, v);

    if (foco) salida.querySelector<HTMLElement>(`[name="${foco}"]`)?.focus();

    /* Analitica sin datos sensibles: ni el ano exacto, ni el numero de motor. */
    evento(origen === 'afinado' ? 'ims_calculator_refined' : 'ims_calculator_result', {
      familia: v.familia,
      generacion: v.generacion ?? 'deducida',
      decada: `${Math.floor(v.ano / 10) * 10}s`,
      estado: r.estado,
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
    evento('ims_calculator_started', { familia: valor('familia') });
  });

  /* Cambiar el coche invalida lo respondido antes. Escuchar el formulario
     entero borraria la respuesta que se acaba de dar a la aclaracion. */
  for (const sel of ['#ims-familia', '#ims-ano', '#ims-base']) {
    raiz.querySelector(sel)?.addEventListener('change', () => {
      for (const k of Object.keys(memoria)) delete memoria[k];
      zonaPregunta.hidden = true;
      zonaPregunta.innerHTML = '';
      salida.hidden = true;
    });
  }

  salida.addEventListener('click', (e) => {
    if ((e.target as Element)?.closest?.('[data-ims-cta]')) {
      evento('ims_contact_clicked', { familia: valor('familia') });
    }
  });
}
