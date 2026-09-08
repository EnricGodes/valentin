# Validación de las traducciones

90 guías: 18 modelos en cada uno de los cinco idiomas. JSON en UTF-8, con el formato `valentinmotors-guias-v1`.

| Idioma | Guías | Longitud de títulos SEO | Longitud de descripciones SEO | Resultado |
| --- | ---: | ---: | ---: | --- |
| en | 18 | 45–56 | 127–136 | Correcto |
| ca | 18 | 42–55 | 124–136 | Correcto |
| it | 18 | 45–56 | 130–146 | Correcto |
| de | 18 | 43–55 | 128–139 | Correcto |
| fr | 18 | 42–50 | 127–141 | Correcto |

Comprobaciones aplicadas a todos los archivos:

- JSON válido, misma estructura y mismo orden de guías que el original.
- Conservación exacta de `formato`, `slug`, `tarifa`, `enlace`, `articulos` y `tras`, cuando existen.
- Conservación de cifras y términos del glosario técnico; los tipos genéricos de carrocería admiten la flexión del idioma.
- Ninguna cadena vacía, marcador de trabajo o guion largo.
- Límites de 70 caracteres por título SEO y de 120–160 por descripción.

La validación se refiere a los archivos entregados y a su correspondencia con el original castellano. La importación y publicación en el sitio se realizan mediante su circuito habitual.
