# Estado de Mis Cosas

Fecha: 15 de octubre de 2026. Etapa: demo local ampliada con Me prestan, cuatro plataformas de venta, revisión de precios y cámara.

## Funciona en esta versión

Colección con seis objetos ficticios, alta/edición, búsqueda/filtros, fotografías y documentos, portada, archivo y recuperación; limpieza selectiva con confirmación; garantías visibles en navegación y ficha, fechas y documentos; préstamos, ampliación y devolución; donación con texto/fotos, paquete demo, acuerdo/cancelación/entrega; anuncios por plantillas para Vinted, Wallapop, eBay y Facebook Marketplace, variantes editables, versiones, HTML/texto simple, ZIP y envío simulado; publicaciones/ofertas/reservas/cierre manual; suscripciones y centro de avisos; dictado por campo con propuesta revisable.

Los cambios se guardan en IndexedDB de este navegador. Se usa una transacción para evitar que dos pestañas pierdan las creaciones ajenas. No se presentan como sincronización ni cuentas reales.

## Ampliación aprobada el 15 de octubre

La navegación de préstamos salientes pasa a llamarse «Prestado». Se añade «Me prestan» para objetos ajenos: objeto, dueño o alias, recepción, devolución opcional, estado, accesorios y notas. Permite editar, ampliar la fecha y confirmar manualmente la devolución de hoy, con notas e historial. Todos los campos permiten dictado revisado.

Estos registros quedan separados de los objetos propios y no entran en venta, donación o limpieza de la colección. Inicio muestra su contador y avisos desde dos días antes; completar el preaviso no silencia el vencimiento o el retraso. Devolver retira los avisos. Sin fecha acordada no se inventa vencimiento.

Al cargar o modificar colecciones anteriores se añade una lista vacía sin borrar sus datos. Una edición aplica solo los campos que se han cambiado en el formulario; si otra pestaña modificó el mismo campo se solicita recargar y revisar. No se sustituye una ampliación reciente por una fecha antigua al editar notas.

Esta petición amplía el alcance base del PRD 3.2. Los tres archivos originales permanecen conservados sin edición; la petición literal y su aprobación constan en el historial.

## Prioridad adicional de ventas

Vinted y Wallapop ya están incorporadas y aparecen primero, junto con eBay y Facebook Marketplace. Se eligen destinos, se revisan variantes y se prepara el paquete solo con los seleccionados. El correo sigue simulado. Se conservan versiones aprobadas anteriores y se detectan formularios obsoletos entre pestañas.

Ventas muestra por anuncio la plataforma, el precio publicado, la fecha, los días transcurridos y la última revisión real de precio. Revisar precio conserva anterior, fecha y nota; no modifica el anuncio externo. Los objetos sin publicación registrada no muestran precios o fechas inventados y enlazan directamente al registro manual en su ficha.

La usuaria autoriza estudiar automatización donde exista acceso oficial. eBay documenta publicación mediante API, pero todavía no tiene cuenta y la integración requiere desarrollo, servidor seguro y autorización. Para Facebook Marketplace no se ha confirmado una vía oficial aplicable a esta app y cuenta particular; se mantiene manual. Fuentes y límites en el Doc técnico existente. No se han creado cuentas ni publicado anuncios. Los archivos originales del alcance 3.2 se conservan como base histórica.

## Cámara y fotografías

En Añadir/Editar objeto aparece Hacer foto: cámara sin audio, captura, revisión, repetir o añadir, y guardado manual del formulario. Se mantiene Añadir fotos y los límites de 8 fotografías/10 MB. Cancelar y cerrar libera las pistas e invalida resultados tardíos; Guardar espera FileReader y la cámara cerrada. La calidad con cámara física y sus permisos reales sigue pendiente de probar.

La pestaña de la usuaria conservaba una versión antigua con fotos sin cargar y conexión WebSocket fallida. Los archivos respondían HTTP 200; al recargar aparecieron decodificados. Se verifican las seis fotos demo en una prueba de navegador. No se restauraron sus datos. pnpm demo deja el servidor local separado de los comandos de pruebas; un servidor existente de Mis Cosas se reutiliza.

## Comprobado

39 pruebas de dominio y 27 pruebas de navegador superadas. TypeScript, ESLint y compilación de Vite correctos. QA visual de ventas y cámara a 1435 × 1096, 390 × 844 y 320 × 740; sin desbordamiento horizontal ni errores de consola en los contextos de prueba. Las capturas de cámara muestran expresamente una imagen de prueba generada por canvas. No acreditan cámara física. Pruebas y revisiones detalladas en docs/pruebas.md.

El tratamiento del dictado se probó con reconocimiento controlado: revisión/cancelación, cambio de plataforma y fecha imposible. La calidad acústica con el micrófono real de la usuaria todavía no se ha comprobado.

## Pendiente de configurar o construir

Supabase, autenticación y aislamiento entre cuentas, Storage privado y validación del servidor. Correo real con propietario/remitente verificados y tarea diaria de servidor. Prueba real de voz en los dispositivos de la usuaria y condiciones de conservación del servicio del navegador. IA y comparación de ofertas siguen siendo segunda prioridad.

No hay despliegue remoto ni repositorio GitHub conectado. La app local no es la entrega final. Las bases/formulario y permisos públicos se comprobarán antes de presentar.

## Siguiente fase

Revisar la versión visual con la usuaria y conectar Supabase reutilizando su cuenta si existe. Después comprobar dos cuentas, archivos privados y recuperar desde otro dispositivo; configurar correo solo en entorno privado autorizado.

## Materiales

Plan: docs/superpowers/plans/2026-10-14-mis-cosas.md.
Pruebas y revisión: docs/pruebas.md.
Imágenes y referencia: docs/diseno/.
Capturas: docs/capturas/.
Originales de requisitos conservados sin edición. Datos ficticios y tipografías con licencias locales.

El Doc técnico existente y el historial se actualizaron durante esta sesión. La lectura posterior confirmó el texto añadido una sola vez, los prompts conservados y ausencia del correo personal. Se subieron las tres capturas y se verificaron sus IDs, carpeta, formato y tamaño mediante lectura directa de metadatos. La búsqueda indexada de la subcarpeta devolvió vacío; no se tomó como prueba de ausencia. El conector no devolvió el checksum solicitado, por lo que no se afirma comparación de hash remoto. No se ha activado acceso público ni se han enviado correos reales.

Actualización del 15 de octubre: los mismos Docs contienen la ampliación y los tres mensajes originales nuevos, comprobados por lectura posterior sin duplicados. Se añadieron dos capturas de Me prestan a la carpeta existente, verificando ID, tipo PNG, padre y tamaño. IDs: escritorio 1Lh8W1IZeyZP-2igBLGXJoOP_XQ8JgTVn (118231 bytes), móvil 1H_Lsajiq-NQGBrvaccYMDPvFTtr_Sva9 (42510 bytes). Son ejemplos ficticios de un contexto de prueba separado; no se añadieron registros a la colección de la usuaria.

Actualización posterior del 15 de octubre: el apartado de funciones de Ventas ya refleja las cuatro plataformas implementadas. Se añadieron las instrucciones y aprobaciones originales de automatización, resumen de ventas y cámara, y se verificó la conservación de los párrafos anteriores. Se subieron seis capturas nuevas de plataformas, resumen y cámara, con lectura de metadatos y tamaños coincidentes con los locales. Permanecen privadas, como los Docs; no se ha activado acceso público.



## Fotografía directa de garantías — 15 de octubre de 2026

Añadir garantía y Editar garantía incluyen Fotografiar garantía o ticket. La imagen se revisa o repite antes de asociarla; se guarda como documento con la garantía en la misma transacción. Cancelar descarta los archivos nuevos. No hay reconocimiento automático de contenido ni de fechas.

Verificado: 29 pruebas de navegador superadas, TypeScript, ESLint y compilación correctos. Dos pruebas nuevas comprueban asociación tras recarga y cancelación sin documentos guardados. La cámara usa un MediaStream simulado en pruebas; cámara física pendiente. Botón revisado en el navegador integrado sin errores de consola. Captura: docs/capturas/garantia-fotografiar.jpg (JPEG).


## Reanudación y compresión — 16 de octubre de 2026

Seis imágenes recuperadas al recargar la pestaña tras comprobar el servidor, sin borrar datos. Archivos servidos HTTP 200 y seis naturalWidth 1200 en el navegador integrado. La sesión local pierde disponibilidad al apagar el PC; no es una corrección permanente de alojamiento.

Nuevas capturas de cámara: objetos hasta 1600 px en el lado largo, JPEG 0,82 y ajuste hasta 0,68 buscando 400 KB sin garantizar un peso fijo; garantías hasta 2800 px, calidad 0,94. No amplía imágenes pequeñas. Se revisa la copia final con su peso y enlace para verla en grande. Fotos existentes y selección de archivos sin cambios. Sigue guardándose localmente, sin Supabase conectado.

Verificación: 8 pruebas de navegador superadas, TypeScript, ESLint y compilación correctos. Cámara simulada; hardware y legibilidad real pendientes. Captura: docs/capturas/imagenes-recuperadas-2026-10-16.jpg.

Plan hacia el 19: 16, base de datos y archivos privados; 17, cuentas y enlace remoto con pruebas móviles; 18, correo, avisos y revisión; 19, vídeo, documentación, permisos y presentación. Depende de acceso a las cuentas.
