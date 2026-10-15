# Estado de Mis Cosas

Fecha: 15 de octubre de 2026. Etapa: demo local construida, ampliada con objetos que me prestan.

## Funciona en esta versión

Colección con seis objetos ficticios, alta/edición, búsqueda/filtros, fotografías y documentos, portada, archivo y recuperación; limpieza selectiva con confirmación; garantías visibles en navegación y ficha, fechas y documentos; préstamos, ampliación y devolución; donación con texto/fotos, paquete demo, acuerdo/cancelación/entrega; anuncios por plantillas para eBay y Facebook Marketplace, variantes editables, versiones, HTML/texto simple, ZIP y envío simulado; publicaciones/ofertas/reservas/cierre manual; suscripciones y centro de avisos; dictado por campo con propuesta revisable.

Los cambios se guardan en IndexedDB de este navegador. Se usa una transacción para evitar que dos pestañas pierdan las creaciones ajenas. No se presentan como sincronización ni cuentas reales.

## Ampliación aprobada el 15 de octubre

La navegación de préstamos salientes pasa a llamarse «Prestado». Se añade «Me prestan» para objetos ajenos: objeto, dueño o alias, recepción, devolución opcional, estado, accesorios y notas. Permite editar, ampliar la fecha y confirmar manualmente la devolución de hoy, con notas e historial. Todos los campos permiten dictado revisado.

Estos registros quedan separados de los objetos propios y no entran en venta, donación o limpieza de la colección. Inicio muestra su contador y avisos desde dos días antes; completar el preaviso no silencia el vencimiento o el retraso. Devolver retira los avisos. Sin fecha acordada no se inventa vencimiento.

Al cargar o modificar colecciones anteriores se añade una lista vacía sin borrar sus datos. Una edición aplica solo los campos que se han cambiado en el formulario; si otra pestaña modificó el mismo campo se solicita recargar y revisar. No se sustituye una ampliación reciente por una fecha antigua al editar notas.

Esta petición amplía el alcance base del PRD 3.2. Los tres archivos originales permanecen conservados sin edición; la petición literal y su aprobación constan en el historial.

## Comprobado

31 pruebas de dominio y 16 pruebas de navegador superadas. TypeScript, ESLint y compilación de Vite correctos. Navegador integrado de Codex: colección, garantías y formularios. QA de Me prestan a 1435 × 1096, 390 × 844 y 320 × 740; sin desbordamiento horizontal ni errores de consola en el contexto de prueba. Se detectó y corrigió texto demasiado estrecho en el resumen móvil. Pruebas detalladas en docs/pruebas.md.

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

