import { evaluarIms } from '../logica/ims/evaluador.ts';
import type { Evaluacion, Vehiculo } from '../logica/ims/tipos.ts';
import {
  ACCIONES, AVISO, CONFIANZA, ESTADOS, INCIDENCIA, MOTIVOS, OPCIONES,
  PREGUNTAS, RETROFIT, RODAMIENTOS, SUSTITUIBILIDAD, UI,
} from '../logica/ims/textos.es.ts';
import { evento } from './eventos.ts';

/**
 * Comportamiento de la calculadora IMS.
 *
 * El evaluador es puro y vive aparte; aqui solo se leen campos, se pinta el
 * resultado y se mide. El numero de motor NO sale de esta funcion: ni a la
 * analitica, ni a la URL, ni a un log.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fila = (etiqueta: string, valor: string) =>
  `<div><dt>${esc(etiqueta)}</dt><dd>${esc(valor)}</dd></div>`;

function pintaResultado(r: Evaluacion, familia: string, ano: number): string {
  const t = ESTADOS[r.estado];
  const retro = r.estadoActual ? RETROFIT[r.estadoActual] : null;

  const motivos = r.motivos.map((m) => MOTIVOS[m]).filter(Boolean);
  const acciones = [...new Set(r.acciones)].map((a) => ACCIONES[a]).filter(Boolean);

  /* Solo datos no sensibles en la URL del CTA: ni VIN, ni numero de motor. */
  const cta = `/contacto?motivo=ims&modelo=${encodeURIComponent(familia)}`
    + `&anio=${ano}&resultado=${encodeURIComponent(r.estado.toLowerCase())}`;

  return `
    <div class="ims-res ims-res--${r.respuesta}">
      <p class="ims-res-etiqueta">${esc(t.etiqueta)}</p>
      <h3 class="ims-res-titular">${esc(t.titular)}</h3>
      <p class="ims-res-cuerpo">${esc(t.cuerpo)}</p>

      <dl class="ims-res-datos">
        ${fila(UI.configuracion, RODAMIENTOS[r.rodamientoDeFabrica])}
        ${fila(UI.incidencia, INCIDENCIA[r.incidenciaRelativa])}
        ${fila(UI.sustitucion, SUSTITUIBILIDAD[r.sustituibilidad])}
        ${fila(UI.confianza, CONFIANZA[r.confianza])}
      </dl>

      ${motivos.length ? `<div class="ims-res-bloque">
        <h4>${esc(UI.porQue)}</h4>
        <ul>${motivos.map((m) => `<li>${esc(m!)}</li>`).join('')}</ul>
      </div>` : ''}

      ${retro ? `<div class="ims-res-bloque ims-res-retro">
        <h4>${esc(UI.situacionActual)}</h4>
        <p><strong>${esc(retro.titular)}</strong></p>
        <p>${esc(retro.cuerpo)}</p>
      </div>` : ''}

      ${acciones.length ? `<div class="ims-res-bloque">
        <h4>${esc(UI.siguientePaso)}</h4>
        <ul>${acciones.map((a) => `<li>${esc(a!)}</li>`).join('')}</ul>
      </div>` : ''}

      ${t.accion ? `<p class="ims-res-nota">${esc(t.accion)}</p>` : ''}

      <div class="ims-cta">
        <p class="ims-cta-titulo">${esc(UI.ctaTitulo)}</p>
        <p class="ims-cta-texto">${esc(UI.ctaTexto)}</p>
        <a class="cta" href="${cta}" data-ims-cta>${esc(UI.ctaBoton)}</a>
      </div>
      <p class="ims-res-aviso">${esc(AVISO)}</p>
    </div>`;
}

function pintaPregunta(r: Evaluacion): string {
  const motivo = r.motivos.map((m) => MOTIVOS[m]).filter(Boolean)[0] ?? '';
  return `
    <div class="ims-res ims-res--desconocida">
      <p class="ims-res-etiqueta">${esc(PREGUNTAS[r.siguientePregunta ?? 'generacion'] ?? '')}</p>
      <h3 class="ims-res-titular">${esc(ESTADOS.DATOS_INSUFICIENTES.titular)}</h3>
      <p class="ims-res-cuerpo">${esc(motivo)}</p>
      <p class="ims-res-nota">${esc(ACCIONES.completar_dato)}</p>
    </div>`;
}

export function iniciarCalculadoraIms(): void {
  const raiz = document.querySelector<HTMLElement>('[data-ims]');
  if (!raiz) return;

  /* Dentro de un articulo la calculadora se sirve al final del cuerpo y se
     mueve al hueco que dejo la directiva `:::herramienta`. Asi el formulario
     esta escrito una sola vez, en el componente, y aparece donde toca. */
  const hueco = document.querySelector('[data-ims-hueco="calculadora-ims"]');
  if (hueco) {
    // La colocacion en la rejilla la lleva el hueco, no el componente: al
    // moverlo hay que llevarsela, o la calculadora cae en la columna de
    // lectura y se queda estrecha.
    raiz.classList.add(...hueco.classList);
    hueco.replaceWith(raiz);
  }

  const form = raiz.querySelector<HTMLFormElement>('[data-ims-form]')!;
  const extra = raiz.querySelector<HTMLElement>('[data-ims-extra]')!;
  const salida = raiz.querySelector<HTMLElement>('[data-ims-resultado]')!;
  const afinar = raiz.querySelector<HTMLDetailsElement>('[data-ims-afinar]')!;
  const error = raiz.querySelector<HTMLElement>('[data-ims-error]')!;
  const selGeneracion = raiz.querySelector<HTMLSelectElement>('#ims-generacion')!;
  const campo = (nombre: string) =>
    raiz.querySelector<HTMLElement>(`[data-ims-campo="${nombre}"]`)!;

  let empezado = false;

  const valor = (n: string) =>
    (form.querySelector<HTMLInputElement>(`[name="${n}"]`)
      ?? afinar.querySelector<HTMLInputElement>(`[name="${n}"]`))?.value ?? '';

  /** Las generaciones dependen del modelo: un Cayman no puede ser un 986. */
  function poblarGeneraciones(familia: string) {
    const lista = OPCIONES.generacion[familia];
    if (!lista) return;
    selGeneracion.innerHTML = lista
      .map((o) => `<option value="${o.valor}">${esc(o.etiqueta)}</option>`).join('');
  }

  function leer(): Vehiculo {
    const familia = valor('familia') as Vehiculo['familia'];
    const generacion = campo('generacion').hidden
      ? undefined : (valor('generacion') as Vehiculo['generacion']);
    const variante = campo('variante').hidden
      ? undefined : (valor('variante') as Vehiculo['variante']);
    return {
      familia,
      ano: Number(valor('ano')),
      baseAno: (valor('baseAno') || 'modelo') as Vehiculo['baseAno'],
      generacion: generacion === 'desconocida' ? undefined : generacion,
      variante: variante === 'desconocida' ? undefined : variante,
      codigoMotor: valor('codigoMotor') || undefined,
      serieMotor: valor('serieMotor') || undefined,
      originalidadMotor: (valor('originalidadMotor') || 'desconocida') as Vehiculo['originalidadMotor'],
      intervencionIms: (valor('intervencionIms') || 'ninguna') as Vehiculo['intervencionIms'],
    };
  }

  function calcular() {
    const v = leer();

    error.hidden = true;
    if (!v.familia) { error.textContent = UI.errorModelo; error.hidden = false; return; }
    if (!Number.isInteger(v.ano) || v.ano < 1948 || v.ano > new Date().getFullYear() + 1) {
      error.textContent = UI.errorAno; error.hidden = false;
      raiz.querySelector<HTMLInputElement>('#ims-ano')?.focus();
      return;
    }

    const r = evaluarIms(v);

    // Solo se pide el dato que hace falta, y solo cuando hace falta.
    if (r.estado === 'DATOS_INSUFICIENTES' && r.siguientePregunta) {
      extra.hidden = false;
      if (r.siguientePregunta === 'generacion') {
        poblarGeneraciones(v.familia);
        campo('generacion').hidden = false;
      }
      if (r.siguientePregunta === 'variante') campo('variante').hidden = false;
      salida.innerHTML = pintaPregunta(r);
      salida.hidden = false;
      evento('ims_calculator_clarification_shown', {
        familia: v.familia, pregunta: r.siguientePregunta, version_reglas: r.versionReglas,
      });
      raiz.querySelector<HTMLSelectElement>(
        r.siguientePregunta === 'variante' ? '#ims-variante' : '#ims-generacion')?.focus();
      return;
    }

    salida.innerHTML = pintaResultado(r, v.familia, v.ano);
    salida.hidden = false;
    afinar.hidden = false;

    /* Analitica sin datos sensibles: familia, decada, estado y confianza.
       Ni el ano exacto, ni el numero de motor, ni texto libre. */
    evento('ims_calculator_result', {
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

  /* Solo el modelo y el ano invalidan las preguntas condicionales. Escuchar
     el formulario entero escondia el campo que el usuario acababa de
     responder, y la calculadora volvia a preguntar lo mismo. */
  for (const sel of ['#ims-familia', '#ims-ano', '#ims-base']) {
    raiz.querySelector(sel)?.addEventListener('change', () => {
      campo('generacion').hidden = true;
      campo('variante').hidden = true;
    });
  }

  afinar.addEventListener('change', () => {
    if (!salida.hidden) {
      calcular();
      evento('ims_calculator_refined', { familia: valor('familia') });
    }
  });

  salida.addEventListener('click', (e) => {
    if ((e.target as Element)?.closest?.('[data-ims-cta]')) {
      evento('ims_contact_clicked', { familia: valor('familia') });
    }
  });
}
