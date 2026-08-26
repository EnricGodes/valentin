import { iniciarReveals } from './reveal.ts';
import { iniciarCursor } from './cursor.ts';
import { iniciarFondos } from './fondos.ts';
import { iniciarGalerias } from './galeria.ts';
import { iniciarContadores } from './contador.ts';
import { iniciarMagneticos } from './magnetico.ts';

/**
 * Arranque unico del sitio. Cada modulo comprueba por su cuenta si tiene algo
 * que hacer, asi que una pagina sin galeria o sin hero no falla: en las fichas
 * actuales un querySelector vacio rompia el resto del script.
 */
function iniciar(): void {
  iniciarReveals();
  iniciarCursor();
  iniciarFondos();
  iniciarGalerias();
  iniciarContadores();
  iniciarMagneticos();
}

iniciar();
// Astro reutiliza el documento entre paginas con View Transitions
document.addEventListener('astro:after-swap', iniciar);
