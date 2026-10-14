# Comprobaciones — Mis Cosas, primera versión local

Fecha: 14 de octubre de 2026. Entorno: Node 24.19.0, pnpm 11.25.0, Vite 7.3.7 y React 19.3.0. Aplicación local de demostración.

## Evidencia

- TypeScript: node node_modules/typescript/bin/tsc -b.
- ESLint: node node_modules/eslint/bin/eslint.js .
- Vitest: node node_modules/vitest/vitest.mjs run.
- Recorridos: node node_modules/@playwright/test/cli.js test.
- Compilación: node node_modules/vite/bin/vite.js build.
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

