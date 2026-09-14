import type { Idioma } from '../../i18n/config.ts';
import * as es from './textos.es.ts';
import * as en from './textos.en.ts';
import * as fr from './textos.fr.ts';
import * as it from './textos.it.ts';
import * as de from './textos.de.ts';
import * as ca from './textos.ca.ts';

/** Los textos del evaluador, por idioma. Misma forma en los seis. */
export type Textos = typeof es;
export const TEXTOS: Record<Idioma, Textos> = { es, en, fr, it, de, ca };
export const textosDe = (idioma: string): Textos => TEXTOS[idioma as Idioma] ?? es;
