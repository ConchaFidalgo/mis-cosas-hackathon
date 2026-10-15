# Comprobaciones — Mis Cosas, primera versión local

Actualizado: 15 de octubre de 2026. Entorno: Node 24.19.0, pnpm 11.25.0, Vite 7.3.7 y React 19.3.0. Aplicación local de demostración.

## Evidencia

Último resultado del 15 de octubre: 39 pruebas de dominio y 27 de navegador superadas. Las cifras de las secciones anteriores describen sus etapas históricas; la ampliación más reciente se detalla al final.

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

## Cuatro plataformas, precios, fotos y cámara — 15 de octubre de 2026

Resultado final: 39 pruebas de dominio, 27 E2E, TypeScript, ESLint y compilación correctos. Suite completa: node node_modules/@playwright/test/cli.js test --workers=1. No se presentan el fallo inicial o un éxito parcial como verificación final.

Dominio: se añaden plataformas/versiones, conservación de defectos y precio, bases obsoletas de anuncios, revisiones de precio con historial, importes/fechas inválidas, cierres/retiradas, conflictos de precio del mismo día y separación de revisión de precio frente a programación de acciones. La revisión independiente detectó sobrescritura de versiones y dos formularios obsoletos; se reprodujeron y corrigieron con pruebas RED/GREEN.

E2E: cuatro recorridos de plataformas prueban selección de destinos, paquete filtrado, cierre Vinted con aviso de retirada Wallapop y un solo ingreso, compatibilidad de borradores anteriores y nueva versión al editar un anuncio aprobado. Tres recorridos prueban ventas sin publicaciones sin inventar datos, plataforma/precio/fecha/15 días y revisión persistente con historial, y carga de las seis fotos demo. Los doce recorridos iniciales y cuatro de Me prestan siguen pasando.

Cámara: cuatro recorridos prueban revisión/repetición antes de añadir, JPEG/lectura lenta/guardado/recarga, descarte y cierre de pistas, permiso denegado sin perder formulario, y respuesta tardía después de cancelar. Se observó RED al faltar Hacer foto. El dispositivo falso nativo de Edge mostró reproducción intermitente; las pruebas definitivas sustituyen únicamente getUserMedia por MediaStream de canvas. El elemento de vídeo, captura JPEG, FileReader, IndexedDB y recarga son reales. No se utilizó cámara física ni audio del usuario. La revisión independiente de cámara no encontró fallos materiales dentro del alcance.

Fotos: CUA leyó seis naturalWidth 0 en la pestaña antigua y un error histórico de WebSocket; los archivos existían y respondían 200 image/webp. La recarga de esa pestaña mostró imágenes de 1200 × 900, y el E2E recorrió las seis. No se borraron datos, no se restauró la demo y no se cambiaron las rutas de fotos. Se dejó el servidor local separado y se probó node scripts/start-demo.mjs reutilizando el servidor activo.

| Comprobación visual | Resultado |
| --- | --- |
| URL/título, contenido y controles | Correctos en los recorridos comprobados |
| Overlay de framework y consola del contexto de capturas | Sin errores o advertencias relevantes |
| Escritorio 1435 × 1096 | Plataformas, resumen por anuncio y revisión de cámara inspeccionados |
| Móvil 390 × 844 y 320 × 740 | Sin desbordamiento horizontal en recorridos comprobados |
| Selección/cambio de plataforma | Textos independientes y dictado separado |
| Captura de foto | Revisión explícita, Guardar bloqueado hasta cerrar cámara y terminar lectura |

Capturas inspeccionadas: ventas-cuatro-plataformas-desktop/movil.png, ventas-resumen-desktop/movil.png y camara-revision-desktop/movil.png, en docs/capturas. Dos anuncios ficticios y el dibujo de cámara de prueba pertenecen solo a contextos aislados; no son publicaciones reales ni fotos del dispositivo de la usuaria. Se subieron a la carpeta de capturas existente, se verificaron tipo/padre/tamaño y se referenciaron desde el Doc técnico.

Pendiente: cámara física, permisos reales del navegador integrado, reconocimiento acústico, Safari/iPhone, lector de pantalla, conexión desde teléfono real y despliegue seguro. eBay automático requiere cuenta del vendedor, autorización, servidor seguro y desarrollo; no está implementado. Para Facebook Marketplace no se confirmó una vía oficial aplicable a esta cuenta particular. No hay correo real ni tareas de servidor con app cerrada.



## Fotografía directa de garantías — 15 de octubre de 2026

Añadir garantía y Editar garantía incluyen Fotografiar garantía o ticket. La imagen se revisa o repite antes de asociarla; se guarda como documento con la garantía en la misma transacción. Cancelar descarta los archivos nuevos. No hay reconocimiento automático de contenido ni de fechas.

Verificado: 29 pruebas de navegador superadas, TypeScript, ESLint y compilación correctos. Dos pruebas nuevas comprueban asociación tras recarga y cancelación sin documentos guardados. La cámara usa un MediaStream simulado en pruebas; cámara física pendiente. Botón revisado en el navegador integrado sin errores de consola. Captura: docs/capturas/garantia-fotografiar.jpg (JPEG).
