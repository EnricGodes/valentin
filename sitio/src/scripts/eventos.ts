/**
 * Eventos de conversion.
 *
 * La auditoria encontro 4.978 sesiones en GA4 con CERO key events: ni un
 * formulario, ni una llamada, ni un WhatsApp, ni un clic en email medidos. Sin
 * eso no se sabe que pagina trae clientes, y por tanto tampoco donde invertir.
 *
 * Se miden por delegacion en el documento, asi que funcionan tambien con el
 * contenido que llega despues (galerias, navegacion con View Transitions).
 */
type Parametros = Record<string, string | number | undefined>;

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; }
}

/** Envia el evento si hay consentimiento; si no, se descarta sin ruido. */
export function evento(nombre: string, params: Parametros = {}): void {
  const limpio = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
  );
  window.gtag?.('event', nombre, {
    ...limpio,
    idioma: document.documentElement.lang,
  });
}

/** Contexto de la pagina: sirve para saber QUE ficha genero el contacto. */
function contexto() {
  const cuerpo = document.body.dataset;
  return {
    tipo_pagina: cuerpo.tipoPagina,
    coche: cuerpo.coche,
    ruta: location.pathname,
  };
}

export function iniciarEventos(): void {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element)?.closest?.('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';

    if (href.startsWith('tel:')) {
      evento('click_telefono', { ...contexto(), telefono: href.slice(4) });
    } else if (href.startsWith('mailto:')) {
      evento('click_email', { ...contexto(), destino: href.slice(7) });
    } else if (/wa\.me|api\.whatsapp\.com/.test(href)) {
      evento('click_whatsapp', contexto());
    } else if (a.classList.contains('cta')) {
      // El CTA de una ficha es la senal de intencion mas fuerte del sitio
      evento(contexto().coche ? 'solicitar_info_coche' : 'click_cta',
             { ...contexto(), texto: a.textContent?.trim().slice(0, 40) });
    } else if (a.classList.contains('car-card')) {
      evento('ver_ficha_coche', {
        coche: a.getAttribute('href')?.split('/').pop(),
        ruta: location.pathname,
      });
    }
  }, { passive: true });

  // Envio de formulario: el lead propiamente dicho
  document.addEventListener('submit', (e) => {
    const f = e.target as HTMLFormElement;
    if (!f?.matches?.('form[data-lead]')) return;
    evento('generate_lead', { ...contexto(), formulario: f.dataset.lead });
  });

  // Una ficha de coche vista mas de 30 segundos es interes real, no un rebote
  const cuerpo = document.body.dataset;
  if (cuerpo.tipoPagina === 'ficha') {
    window.setTimeout(() => {
      if (!document.hidden) evento('ficha_coche_leida', contexto());
    }, 30_000);
  }
}
