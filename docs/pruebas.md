# Comprobaciones — Mis Cosas, primera versión local

Actualizado: 15 de octubre de 2026. Entorno: Node 24.19.0, pnpm 11.25.0, Vite 7.3.7 y React 19.3.0. Aplicación local de demostración.

## Evidencia

- TypeScript: node node_modules/typescript/bin/tsc -b.
- ESLint: node node_modules/eslint/bin/eslint.js .
- Vitest: node node_modules/vitest/vitest.mjs run --configLoader native.
- Recorridos: node node_modules/@playwright/test/cli.js test.
- Compilación: node node_modules/vite/bin/vite.js build --configLoader native.
- Navegador principal para QA visual: navegador integrado de Codex, controlado por cua_repl. Pruebas automatizadas complementarias: Playwright con Edge instalado y contextos separados.
- Capturas definitivas: PNG de Edge de pruebas, porque las capturas del navegador integrado se comprimían o recortaban. La revisión principal de interacciones se mantuvo en el navegador integrado.

Se observaron pruebas fallar antes de implementar las reglas y las regresiones. No se presentó el fallo inicial como comprobación superada.

## Reglas cubiertas

22 pruebas: fecha inclusiva de garantía, fecha ausente y orden inválido, validación de nombre/categoría, préstamo único, venta bloqueada durante préstamo, devolución con incidencia, entrega de donación distinta de acuerdo y sin ingresos, conservación de factura al quitar garantía, fotografía referenciada, precio y defectos, cierre único/retirada, ancla de día 31 y año bisiesto, cuotas incompletas, avisos coincidentes e invalidados, fase gratuita tras solicitar cancelación, versión más reciente de cada plataforma, estado de donación y conservación de relaciones al editar.

## Recorridos cubiertos

12 pruebas de navegador: crear/editar/recuperar al recargar, quitar garantía conservando factura, devolver préstamo, donación con texto editable y paquete sin precio, descarga de fotos ZIP/texto simple, dos pestañas guardando sin perder objetos, lecturas de archivos pendientes, propuestas y cancelación de dictado, resultado tardío al cambiar plataforma, fecha imposible pendiente de revisión, móvil sin desbordamiento, etiqueta demo y categorías visibles.

El simulador de reconocimiento pertenece a las pruebas, no a la aplicación. Las pruebas de dictado verifican el tratamiento del resultado; no se ha grabado a la usuaria ni probado reconocimiento acústico real.

## Comparación visual

Referencia: docs/diseno/concepto-coleccion.png, 1435 × 1096 px.
Render: docs/capturas/coleccion-desktop.png. Revisión móvil: 390 × 844 px y garantías a 320 × 740 px.

1. Estructura: lateral, encabezado y catálogo de tres columnas conservados; móvil pasa a una columna.
2. Tipografía: Fraunces en títulos y Manrope en controles, servidas localmente.
3. Paleta: fondo RGB 246/245/240 y verde forestal coinciden con la referencia.
4. Fotografías: seis activos independientes cargados, proporción 4:3 y esquinas redondeadas; no son recortes de la captura.
5. Controles: búsqueda, filtros, alta y enlaces de ficha son elementos reales. Garantías se añade al menú a petición de la usuaria.
6. Texto del primer pantallazo: título, subtítulo, búsqueda, acción y filtros conservados. Fecha dinámica, filtro de categoría y etiqueta demo añadidos por requisitos funcionales.
7. Disponibilidad: el abrigo muestra un préstamo atrasado real del conjunto demo; se prioriza el estado correcto frente al texto guardado de la referencia.
8. Móvil: navegación inferior, acceso directo a garantías y modo demo visible; no se detectó desbordamiento horizontal en las dimensiones comprobadas.

La captura original y el render final se inspeccionan con view_image antes de la entrega. Las diferencias anteriores son intencionales y están ligadas a requisitos; no se considera la referencia una prueba funcional.

## Revisión de código

Un revisor independiente inspeccionó el código sin modificarlo. Detectó versiones históricas aprobadas, dictado compartido entre plataformas, fotos guardadas antes de terminar lectura, renovación de hoy, cancelación gratuita y cambio a donación sin aviso de retirada. Se reprodujeron y corrigieron las regresiones con pruebas de reglas o navegador.

También se completaron el texto/fotos de donación, los paquetes demo, HTML/texto simple y ZIP. Se protegió la modificación local con transacciones IndexedDB para dos pestañas.

## Límites de esta comprobación

No se han comprobado cuentas Supabase, RLS, archivos privados de servidor, idempotencia de correo real, firmas de webhooks, tarea diaria con app cerrada, reconocimiento acústico real, Safari/iPhone, accesibilidad con lector de pantalla ni despliegue remoto. Esas funciones no se presentan como terminadas.

Los avisos pospuestos siguen visibles con su nueva fecha: la vista actual reúne pendientes futuros. La factura de ejemplo es ficticia y está identificada como tal.

Los hashes de los tres documentos originales coinciden con los registrados al iniciar la planificación; no se han editado.

## Ampliación Me prestan — 15 de octubre de 2026

Resultado actual: 31 pruebas de dominio y 16 de navegador superadas; tipos, lint y build correctos. Las cifras anteriores corresponden a la primera construcción del 14 de octubre.

Nueve pruebas de dominio nuevas comprueban alta y dueño, fechas imposibles/futuras/invertidas y dueño vacío, ampliación con historial y cambio de aviso, devolución con notas y bloqueo de nuevas operaciones, aviso dos días antes/atrasado/sin fecha, edición con historial, edición de notas que conserva una ampliación de otra pestaña, conflicto al cambiar el mismo campo y fases independientes de preaviso/vencimiento/retraso. Se observaron fallos antes de implementar las reglas y las regresiones.

Cuatro recorridos nuevos comprueban alta/recarga/separación del inventario/aviso/ampliación/devolución/historial, dictado con propuesta editable antes de aplicar, apertura de una colección anterior sin borrowed conservando un objeto creado y acceso móvil, y dos pestañas reales editando notas y ampliando fecha sin sobrescribirla. El último se añadió al reproducir el problema detectado por la revisión independiente.

La revisión visual detectó que un contador de atrasados estrechaba el título en móvil. Se reprodujo con una prueba de altura de título (177 px frente al máximo de 130) y se corrigió pasando el resumen a una cuadrícula con el contador en la fila siguiente. Las pruebas completas pasaron después. Se conservan paleta, tipografías e iconos de la interfaz existente.

Entorno y flujo: http://127.0.0.1:5173/me-prestan → Añadir préstamo → guardar/revisar/ampliar/devolver. Browser plugin no disponible; navegación y formulario revisados con CUA en el navegador integrado. Playwright con Edge y contextos separados verifica el guardado, el reconocimiento controlado y la consola. La captura usa dos ejemplos ficticios creados mediante la interfaz solo en ese contexto, sin modificar los datos de la usuaria.

| Comprobación | Resultado |
| --- | --- |
| URL y título de página | Correctos |
| Contenido visible y controles | Correctos |
| Overlay de error | Ausente |
| Errores de página/consola en captura | Ninguno |
| Escritorio 1435 × 1096 | Revisado |
| Móvil 390 × 844 y 320 × 740 | Sin desbordamiento; formulario y dictado accesibles |
| Capturas PNG | docs/capturas/me-prestan-desktop.png y me-prestan-movil.png inspeccionadas |
| Datos anteriores y dos pestañas | Pruebas superadas |

La captura móvil recoge una tarjeta tras desplazar la página; la de escritorio muestra la sección completa. Ambas se guardaron en la carpeta de capturas de Drive y se verificaron sus metadatos. No se ha probado micrófono real, Safari/iPhone ni lector de pantalla. Servidor, cuentas y correo siguen pendientes.

El registro del navegador integrado conserva un error histórico de conexión del WebSocket de Vite a las 10:08:12 UTC, durante el arranque/reinicio del servidor de esta sesión. Las páginas posteriores cargan y responden; el contexto nuevo de Edge usado para las capturas no registró errores ni advertencias. No se presenta todo el registro histórico del navegador integrado como limpio.

Para evitar el atasco observado al empaquetar la configuración WASM, los comandos de desarrollo, pruebas, compilación y servidor E2E usan --configLoader native con el Node 24 probado. No se instalaron dependencias ni se cambiaron las protecciones del equipo.

