# Estado de Mis Cosas

Fecha: 14 de octubre de 2026. Etapa: primera versión local de demostración construida.

## Funciona en esta versión

Colección con seis objetos ficticios, alta/edición, búsqueda/filtros, fotografías y documentos, portada, archivo y recuperación; limpieza selectiva con confirmación; garantías visibles en navegación y ficha, fechas y documentos; préstamos, ampliación y devolución; donación con texto/fotos, paquete demo, acuerdo/cancelación/entrega; anuncios por plantillas para eBay y Facebook Marketplace, variantes editables, versiones, HTML/texto simple, ZIP y envío simulado; publicaciones/ofertas/reservas/cierre manual; suscripciones y centro de avisos; dictado por campo con propuesta revisable.

Los cambios se guardan en IndexedDB de este navegador. Se usa una transacción para evitar que dos pestañas pierdan las creaciones ajenas. No se presentan como sincronización ni cuentas reales.

## Comprobado

22 pruebas de dominio y 12 pruebas de navegador superadas. TypeScript, ESLint y compilación de Vite correctos. Navegador integrado de Codex: colección, garantías y formularios, captura a 1435 × 1096; móvil a 390 × 844 y garantías a 320 × 740. Fotografías locales cargadas y sin desbordamiento horizontal en tamaños comprobados.

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

