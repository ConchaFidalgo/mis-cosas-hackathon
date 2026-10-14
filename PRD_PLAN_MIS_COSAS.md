# Mis Cosas: PRD y plan de ejecución

Versión 3.2. Fecha: 14 de octubre de 2026.
Alcance aprobado: objetos, garantías, ventas por eBay y Facebook Marketplace con anuncios enviados al propietario por email, préstamos, donaciones y suscripciones. Sustituye las versiones anteriores. La idea de la huerta queda fuera de este proyecto. La construcción todavía no ha empezado; la documentación técnica es un borrador y el registro actual conserva planificación.

## 1. Objetivo del producto

Crear una aplicación web en español para una persona que quiere organizar sus objetos, conservar sus garantías, vender las cosas que ya no usa, seguir sus préstamos y controlar sus suscripciones.

La ficha de cada objeto reúne su situación completa: ubicación, conservación, documentos, garantías, préstamos, anuncios, ofertas y cierre de venta. Recorrido de venta: registrar objeto, revisar anuncios para eBay y Facebook Marketplace, recibir textos e imágenes por email, publicar manualmente y registrar los enlaces. Recorrido de préstamo: entregar, recordar devolución y registrar retorno. Las suscripciones tienen fichas separadas y comparten el centro de avisos.

El resultado debe ser una aplicación utilizable desde móvil y ordenador, con datos persistentes, no solo una maqueta.

## 2. Decisiones de alcance

- Únicas plataformas iniciales para preparar textos: eBay y Facebook Marketplace. Wallapop, Vinted y Milanuncios quedan fuera del alcance.
- El email se envía al propietario, no a compradores ni a las plataformas.
- El usuario publica manualmente el anuncio y registra su enlace.
- No solicitar ni almacenar contraseñas de sus cuentas de venta.
- No implementar bots, extracción de mensajes ni interfaces no documentadas.
- La futura publicación mediante eBay se desarrolla después del recorrido completo y solo con acceso oficial configurado.
- El seguimiento de ofertas y ventas es manual en esta versión. La interfaz debe indicarlo.
- Optimizar textos significa mejorar claridad, orden e información relevante; no prometer una venta ni inventar características.
- No desarrollar todavía diagnóstico de averías, comparación de reparaciones ni tasación automática.
- Préstamos: registrar persona, entrega, devolución prevista, accesorios y recordatorios solo al propietario. No enviar mensajes automáticos a quien tiene el objeto.
- Suscripciones: controlar pruebas gratuitas, próximos cobros, renovación y límite de cancelación. No conectar bancos ni cuentas de proveedores.
- Comparación inicial: calcular costes de ofertas introducidas por el usuario, sin búsqueda automática de tarifas ni contratación o cancelación externa.

## 3. Funciones obligatorias y aceptación

### F1. Mis objetos

Crear, editar, archivar, consultar y eliminar fichas. Buscar por nombre, marca, modelo y ubicación; filtrar por categoría y estado.

Campos: nombre obligatorio; categoría; marca; modelo; descripción; estado de conservación; defectos; accesorios; ubicación; fecha de compra; precio de compra; vendedor; fotos; documentos. Solo exigir inicialmente nombre y categoría. Pedir los datos de venta al preparar un anuncio.

Estados del objeto: en uso, guardado, en venta, reservado, disponible para donar, donación acordada, vendido, donado, reciclado. Registrar disponibilidad por separado: disponible o prestado, calculada a partir del préstamo activo. Mostrarla de forma destacada en la ficha. El archivo es independiente del estado.

La ficha muestra una cronología de cuidados del objeto, cambios de estado, préstamos y devoluciones, anuncios preparados/enviados/publicados y venta. Cada evento conserva fecha y origen. Ningún préstamo ni envío de email se confunde con una venta.

Aceptar hasta 8 fotografías por objeto, JPEG, PNG o WebP, con límite configurable de 10 MB por archivo. Mantener orden y elección de portada. Permitir documentos PDF o imágenes, con un límite inicial de 15 MB. Validar también en el servidor.

Eliminar requiere confirmación y debe gestionar archivos asociados. No modificar los originales locales del usuario. Conservarlos fuera de la app es decisión del usuario.

Aceptación: una ficha con fotos persiste después de cerrar sesión; editarla no altera otras fichas; archivar la oculta del listado normal y permite recuperarla; eliminar no deja acceso público a sus archivos.

### F2. Garantías y documentación

Asociar una o más garantías por objeto: tipo de cobertura declarado, inicio, vencimiento, proveedor, contacto y notas. Los documentos se guardan separados de las fotos de venta.

Estados calculados: sin fecha confirmada, pendiente de inicio, vigente, próxima a vencer, vence hoy, vencida. La fecha de vencimiento es inclusiva: vence hoy hasta el final de ese día en Europe/Madrid.

Mostrar avisos en la app a 30 y 7 días, sin duplicar tarjetas para la misma garantía. No borrar facturas al vencer. No inferir garantía transferible, cobertura legal o duración a partir del tipo de producto.

La extracción de facturas es opcional. Si se incorpora, los resultados son propuestas que el usuario debe confirmar antes de guardar.

Aceptación: probar fechas futuras, fecha de hoy, fecha pasada, datos ausentes y vencimiento anterior al inicio. No mostrar días negativos ni garantías vigentes sin fecha confirmada.

### F3. Preparar la venta

El usuario selecciona el objeto y confirma: características, estado, defectos, accesorios, fotos públicas, precio solicitado, moneda EUR, negociación permitida, recogida/envío y localidad si desea mostrarla. No incluir dirección exacta.

Cada plataforma genera una variante editable con título, descripción, resumen de campos y lista de datos pendientes. Permitir selección de plataformas y conservar versiones. El usuario revisa antes del envío.

Reglas de texto:
- Usar únicamente información aportada o confirmada.
- No omitir defectos para hacer el anuncio más atractivo.
- No inventar medidas, marca, materiales, autenticidad, funcionamiento, pruebas realizadas ni documentación incluida.
- No afirmar que hay garantía transferible sin confirmación.
- Describir funciones conocidas y uso posible sin promesas exageradas.
- No usar etiquetas irrelevantes, superlativos vacíos ni falsa urgencia.
- Respetar el precio introducido. El precio de compra es un dato privado por defecto.
- Si faltan datos esenciales, pedirlos en la app; no insertar marcadores internos en el texto final.
- Mantener un perfil por plataforma con longitud objetivo y campos, separado del código de generación. Los límites oficiales solo se etiquetarán como verificados cuando se hayan comprobado, con fuente y fecha.
- Las categorías permitidas se comprobarán antes de presentar una plataforma como adecuada para un objeto. Si no están comprobadas, mostrar «comprueba que esta categoría está admitida».

La IA es una mejora prevista. Implementar primero un generador por plantillas honesto y utilizable. Después integrar un proveedor de IA en el servidor, siguiendo el flujo de credenciales disponible en Codex. No pedir claves en el chat ni incluirlas en el navegador.

Si el objeto está prestado, mostrar a quién y hasta cuándo. Permitir preparar borradores, pero impedir enviarlos para venta o confirmar una publicación hasta registrar la devolución. No permitir cerrar una venta mientras hay un préstamo activo.

Aceptación: conservar defectos y precio en las dos variantes; soportar generación fallida; editar una variante sin sobrescribir la otra; impedir un envío con precio ausente o fotos seleccionadas inexistentes; no modificar textos aprobados silenciosamente; aplicar los controles de préstamo también en servidor.

### F4. Paquete de anuncios por email

Botón «Enviarme los anuncios», con resumen del objeto, plataformas y destinatario verificado del usuario. No permitir destinatarios arbitrarios en la primera versión.

Contenido del mensaje:
- Nombre del objeto y fecha de preparación.
- Un apartado por plataforma: título, descripción y campos que debe introducir.
- Fotos seleccionadas: adjuntas si el tamaño lo permite o enlace a la ficha privada para descargarlas.
- Enlace a la aplicación y explicación del siguiente paso: publicar y guardar el enlace.

No incluir facturas, documentos de garantía, número de serie, domicilio, teléfono ni otros campos privados por defecto. Para una garantía solo incluir el dato público que el usuario haya confirmado explícitamente.

Enviar una versión HTML legible en móvil y otra de texto simple. No poner documentos privados en direcciones públicas permanentes. Para grandes paquetes, permitir descargar fotos en ZIP desde una ruta autenticada de la app.

Guardar destinatario, versión enviada, fecha, identificador del proveedor y estado: pendiente, aceptado por el proveedor, entregado, fallido o entrega desconocida. «Aceptado» no equivale a «entregado». Usar eventos firmados del proveedor para confirmar entrega cuando estén disponibles. Si faltan, mostrar solo el estado que pueda acreditarse.

Evitar duplicados mediante identificador de operación. Bloquear doble clic, pero también resolverlo en servidor. Después de un timeout con resultado desconocido no reenviar automáticamente sin comprobar el estado. Permitir reenvío explícito y registrar que es una nueva operación.

Modo demostración: previsualizar el email y registrar claramente «simulado, no enviado». Este modo no necesita una cuenta real ni debe figurar como prueba de entrega.

Modo operativo: conectar un servicio de correo transaccional con remitente autorizado. Si no está configurado, conservar la previsualización y señalar la dependencia. No afirmar que el envío real funciona hasta comprobarlo con un destinatario autorizado en un entorno privado separado de la entrega del concurso.

Aceptación: email fiel a la versión aprobada; adjuntos solo de fotos seleccionadas; doble clic no duplica; errores dejan borradores intactos; un mensaje simulado nunca se presenta como enviado.

### F5. Seguimiento de ventas

Crear registros independientes por plataforma con enlace HTTPS, fecha de publicación, precio, estado, última revisión, ofertas y próxima acción.

Separar el estado del borrador/preparación del estado de publicación. Estados de publicación: no publicada, publicada, pausada, reservada, retirada, vendida. El envío del email no cambia un anuncio a publicado.

Guardar ofertas por importe, fecha y nota. No exigir nombres, teléfonos ni mensajes de compradores. Registrar cierre con fecha, plataforma e importe real de venta.

Al vender el objeto, mostrar otros anuncios activos y crear acciones pendientes para retirarlos. El usuario confirma la retirada; la app no afirma haberlo hecho automáticamente. No permitir reservar o vender un mismo objeto dos veces sin una corrección explícita.

Aceptación: seguir dos publicaciones de un objeto, añadir una oferta, cerrar una venta y detectar el otro anuncio pendiente de retirada. La suma de ventas cuenta cada objeto una sola vez y solo usa importes de cierre.

### F6. Cosas prestadas

Desde la ficha, botón «Prestar». Campos: nombre o alias de la persona, fecha de entrega, devolución prevista opcional, accesorios entregados y notas del estado. No exigir teléfono, email ni agenda de contactos. Adjuntar fotos del estado antes de prestar es opcional.

Solo un préstamo activo por objeto. Impedir préstamos de objetos vendidos, donados, reciclados o reservados; si hay anuncios publicados, pedir pausarlos o retirarlos y registrar la confirmación antes de prestar.

Mostrar «prestado a…», fecha prevista y retraso cuando corresponda. Si no hay fecha, mostrar «sin fecha acordada» y permitir un recordatorio de revisión elegido por el usuario. No inventar una fecha de devolución.

Recordatorios predeterminados: dos días antes, el día previsto y un aviso de retraso al día siguiente. Se dirigen al propietario; no contactar al prestatario. Permitir ampliar plazo y conservar la fecha anterior en el historial. Cancelar los avisos de la fecha anterior y recalcular los nuevos.

«Registrar devolución» guarda fecha real, accesorios recibidos y estado, cierra el préstamo y recupera la disponibilidad. Puede quedar una incidencia pendiente por accesorio ausente sin mantener falsamente todo el objeto como prestado.

Aceptación: prestar un taladro, ver su ubicación temporal, cambiar el plazo, recibir avisos sin duplicados, devolverlo y consultar el historial. Impedir segundo préstamo activo, envío para venta y cierre de venta mientras siga prestado. Préstamos sin fecha funcionan sin marcarse como atrasados.

### F7. Suscripciones y pruebas gratuitas

Ficha independiente: servicio, compañía, categoría, moneda EUR, coste recurrente, periodicidad mensual/anual, inicio, fin de prueba gratuita, primer cobro previsto, próxima renovación, límite de cancelación, precio tras promoción, enlace oficial y notas. No guardar credenciales del servicio ni datos bancarios.

Estados: prueba gratuita, activa, cancelación solicitada, cancelada, finalizada. La app no cancela por el usuario. Registrar si una cancelación está solo solicitada o confirmada y, cuando se conoce, la fecha efectiva. No dar por terminado el servicio al pulsar «quiero cancelar».

Las fechas de fin de prueba, primer cobro y límite para cancelar son independientes. No inferir una a partir de otra. Permitir datos incompletos y señalar lo que debe comprobarse. Conservar eventos pasados y avanzar renovaciones recurrentes según calendario; para día 29, 30 o 31, usar el último día válido del mes cuando corresponda. Un cobro previsto no se presenta como cobro bancario confirmado.

Avisos: 7, 3 y 1 día antes del fin de prueba o límite de cancelación, sin duplicar si coinciden. Mostrar cuál es la fecha que exige actuar antes. Para renovaciones ordinarias, avisar 7 días antes. Fechas en Europe/Madrid.

Resumen: gasto mensual equivalente y gasto anual equivalente de las cuotas vigentes. Separar precio actual, precio tras promoción y compromisos futuros; indicar datos incompletos y no mezclar una proyección de doce meses con un total anualizado simple.

Aceptación: prueba gratuita con primer cobro posterior, límite de cancelación anterior y cuota de pago; avisos correctos; renovación mensual/anual; cancelación solicitada y efectiva; precio tras promoción visible; datos incompletos sin cifras inventadas.

### F8. Comparar ofertas aportadas

Segunda prioridad dentro del proyecto, después de F1 a F7. Para comparar compañía actual y alternativas, introducir cuotas, periodicidad, meses promocionales, precio posterior, alta, otros gastos de cambio, permanencia y prestaciones relevantes. Enlaces o documentos son opcionales; la extracción automática no forma parte de esta versión.

Mostrar coste para los próximos doce meses, desglose y ahorro estimado. Calcular sobre el mismo horizonte y servicio, con supuestos visibles. Incluir el coste de solapamiento o cancelación anticipada solo si se conoce. Si faltan datos, mostrar comparación parcial y pedirlos; no declarar un ganador.

La app ayuda a comparar importes y condiciones; no asegura igualdad de cobertura/prestaciones ni tramita el cambio. El usuario decide. No buscar precios en internet automáticamente.

Aceptación: comparar oferta con tres meses promocionales y precio posterior frente a una cuota estable, añadir gasto de alta y comprobar resultado. Para pago anual considerar los pagos que realmente caen en el horizonte, no confundirlos con cuota anual prorrateada.

### F9. Centro de avisos

Unificar garantías, devoluciones, suscripciones y acciones de venta. Avisos en la app obligatorios; email al propietario configurable cuando el proveedor esté conectado, desactivado por defecto hasta que el usuario lo active.

Los emails programados requieren una tarea diaria en el servidor, independiente de que la app esté abierta. Implementar autenticación del proceso y deduplicación por usuario, evento, fecha y canal. No crear una automatización del chat de Codex para sustituir este componente de la app.

Permitir completar o posponer tareas. Cerrar un préstamo o confirmar la cancelación invalida avisos pendientes que ya no corresponden. Agrupar los recordatorios por propietario y día para evitar varios correos sobre el mismo hecho. No avisar repetidamente por un vencimiento sin una regla explícita.

Aceptación: ejecutar dos veces la tarea diaria no duplica emails; cambiar una fecha o cerrar un evento elimina avisos obsoletos; la demo identifica los avisos simulados.

### F10. Donar cosas

Función básica obligatoria desde la ficha: botón «Donar». Marcar el objeto como disponible para donar, preparar un texto editable con descripción, estado, defectos, fotos seleccionadas y condiciones de recogida, y permitir copiarlo o enviarlo por email al propietario mediante el mismo sistema de paquetes.

El texto de donación es independiente de los anuncios de venta: no incluir precio ni presentarlo como venta publicada. No asumir que eBay o Facebook Marketplace admiten esa publicación; el usuario decide dónde compartirlo de acuerdo con las reglas del destino. No buscar entidades ni contactar a personas automáticamente.

Registrar persona o entidad destinataria mediante nombre/alias opcional, fecha prevista, condiciones y notas. Estados: disponible para donar, donación acordada y donado. Solo «Confirmar entrega» guarda la fecha real y marca donado; acordar la recogida no equivale a entregar.

No permitir acordar o completar una donación mientras el objeto esté prestado, vendido, reciclado o ya donado. Si está reservado para venta, resolver la reserva antes de cambiar a donación. Al pasar a donación, recordar retirar los anuncios de venta activos y conservarlos como pendientes hasta confirmación manual. Una entrega donada no se suma al importe de ventas. Cancelar el acuerdo devuelve el objeto a disponible para donar y conserva el historial.

Aceptación: preparar texto con defectos, acordar recogida, cancelar o confirmar entrega, conservar destinatario e historial y recordar anuncios de venta aún activos. Impedir doble entrega y comprobar que la donación no altera ingresos.

### F11. Limpieza y eliminación selectiva

Desde la ficha, permitir eliminar una garantía, una foto o un documento concreto sin eliminar el objeto. Antes de confirmar, mostrar exactamente qué se perderá. Eliminar una garantía cancela sus avisos pendientes, pero conserva por defecto sus documentos en la ficha: el usuario selecciona explícitamente si también quiere borrarlos. Quitar un documento no elimina por sí solo los datos de la garantía.

Mantener «Archivar» para ocultar una ficha conservando sus archivos e historial, y «Eliminar objeto» para borrar ficha, archivos e historial asociados. Avisar de préstamos activos y anuncios externos antes de la eliminación completa. La app no retira anuncios externos al borrar una ficha. Exigir resolver el préstamo activo antes de eliminar el objeto.

Mostrar garantías vencidas como candidatas para revisar, sin borrar nada automáticamente. El archivo no libera espacio de almacenamiento. Los originales del móvil o del ordenador no se modifican. Una foto usada en un borrador activo requiere advertir y seleccionar sustitución o actualizar ese borrador antes de eliminarla.

Aceptación: eliminar garantía sin perder factura u objeto; cancelar sus avisos; borrar un archivo seleccionado; recuperar objeto archivado; mostrar consecuencias de eliminación completa; validar propiedad también en servidor.

### F12. Crear y editar mediante voz

Botón de micrófono dentro de formularios de objetos, garantías, préstamos, donaciones, suscripciones y preparación de venta. Permite dictar texto en un campo y, donde haya interpretación de instrucciones, proponer cambios estructurados en la ficha que el usuario tiene abierta. No ofrecer un asistente global que cambie objetos sin contexto en la primera versión.

Ejemplos: «está en el garaje», «cambia el precio a 40 euros», «lo he prestado a Ana hasta el viernes». Mostrar transcripción editable y resumen de los campos propuestos, conservando el valor anterior. Nada se guarda hasta pulsar Guardar. Preguntar cuando falte un dato o una fecha sea ambigua; mostrar siempre la fecha exacta antes de guardar. No inventar importes ni aplicar comandos a otra ficha.

La voz no elimina datos, envía emails, confirma entrega, publica anuncios ni contrata/cancela servicios directamente. Las acciones conservan sus confirmaciones en pantalla. Los textos de documentos o transcripciones se tratan como datos, no como instrucciones de sistema.

Solicitar permiso de micrófono cuando se pulse el botón; mostrar grabación activa, detener y cancelar. Conservar edición por teclado si no hay permiso, no existe soporte o falla la transcripción. No guardar audio permanentemente por defecto. Si un proveedor externo procesa voz, informar de ello antes de usarlo y comprobar sus condiciones de conservación. La implementación debe verificar compatibilidad y calidad en los navegadores elegidos antes de declarar disponible la función.

Prioridad: limpieza obligatoria. Dictado por campo y revisión como primera entrega de voz; interpretación estructurada solo después de que funcione esa base y estén configurados sus servicios. Si la voz requiere acceso externo pendiente, indicarlo expresamente sin impedir el resto del proyecto.

Aceptación: permiso denegado conserva formulario; transcripción puede corregirse/cancelarse; importe y fecha exacta se revisan antes de guardar; ninguna acción irreversible se ejecuta al hablar; no hay cambios silenciosos; no se retiene audio sin una opción explícita.

## 4. Pantallas y diseño

1. Inicio: garantías próximas, devoluciones, suscripciones y acciones de venta pendientes.
2. Mis cosas: listado, búsqueda, filtros y alta.
3. Ficha: situación completa, datos, fotos, documentos, garantías, préstamos, ventas, donaciones y cronología. Acciones diferenciadas «Vender», «Prestar» y «Donar».
4. Preparar venta: pasos cortos para datos, fotos, plataformas y revisión.
5. Previsualización del email: contenido exacto y botón de envío.
6. Mis ventas: seguimiento de publicaciones y cierre.
7. Mis préstamos: activos, sin fecha, atrasados e historial de devoluciones.
8. Suscripciones: fichas, próximas fechas y resumen de costes.
9. Comparar ofertas: datos manuales, desglose y supuestos, en segunda prioridad.
10. Ajustes: cuenta, email verificado, preferencias de avisos, modo de demostración y exportación. Formularios con micrófono y revisión; fichas con menú de limpieza selectiva y archivo.

Estilo claro y doméstico. Navegación móvil sencilla, controles accesibles, etiquetas comprensibles y estados vacíos con acción. No mostrar claves, arquitectura ni errores internos en el recorrido del usuario. Indicar honestamente las operaciones manuales y las simuladas.

## 5. Propuesta técnica

Decisión inicial propuesta, ajustable tras inspeccionar el entorno:
- Interfaz: React, TypeScript y Vite.
- Datos, acceso y archivos: Supabase, con políticas por propietario y archivos privados.
- Operaciones sensibles: funciones de servidor para generación de textos y correo.
- Recordatorios: tarea diaria del servidor, con zona horaria y deduplicación; avisos en app calculados sin depender del correo.
- Email: adaptador de correo transaccional; Resend como candidato, sujeto a configuración de remitente y condiciones comprobadas.
- IA: adaptador independiente, activado después de configurar credenciales y límites de gasto autorizados.
- Alojamiento: elegir un servicio permitido por las bases, compatible con la arquitectura y sin contratar planes de pago sin autorización.

No depender de recursos externos para arrancar la interfaz: disponer de modo demo con datos ficticios, aislamiento y etiqueta visible. La demo no demuestra acceso entre cuentas ni envío externo; probar esas funciones por separado en el entorno conectado.

Definir migraciones, datos de prueba reproducibles, variables de entorno documentadas sin valores secretos y guía de despliegue. No tratar localStorage como almacenamiento de producción.

## 6. Modelo de datos

| Entidad | Campos principales |
| --- | --- |
| profile | propietario, email verificado, zona horaria |
| item | propietario, nombre, categoría, descripción, estado, ubicación, compra, marca, modelo, defectos, accesorios, archivo |
| asset | objeto, propietario, tipo foto/documento, ruta privada, nombre, tamaño, orden, portada |
| warranty | objeto, tipo, proveedor, inicio, vencimiento, notas, fechas confirmadas |
| listing_draft | objeto, plataforma, título, descripción, precio, versión, aprobación, fotos seleccionadas |
| publication | objeto, plataforma, enlace, estado, precio publicado, fechas, versión usada |
| offer | publicación, importe, fecha, nota |
| sale | objeto único, publicación de origen, fecha, importe final |
| donation | objeto, propietario, estado, destinatario opcional, recogida prevista, entrega real, condiciones, texto aprobado y fotos seleccionadas |
| loan | objeto, propietario, persona/alias, entrega, devolución prevista, devolución real, accesorios, estado, notas |
| loan_event | préstamo, fecha, cambio de plazo, devolución o incidencia |
| subscription | propietario, compañía, servicio, estado, cuotas, periodicidad, prueba, cobros previstos, límite de cancelación, renovación, fecha efectiva de cancelación |
| subscription_event | suscripción, fecha, renovación prevista, cambio de condiciones o cancelación |
| comparison_offer | propietario, comparación, proveedor, cuotas, promoción, gastos, condiciones y fuente aportada |
| item_event | objeto, propietario, fecha, tipo, entidad de origen y resumen de cambio |
| followup | propietario, objeto/publicación/préstamo/suscripción, acción, vencimiento, completado |
| reminder | propietario, entidad, tipo de aviso, fecha, canal, estado y clave única |
| email_job | propietario, tipo anuncios/recordatorio, destinatario, versiones exactas, clave de operación, estado, identificador proveedor, errores resumidos |

Comprobar propiedad y relaciones en servidor; no confiar en identificadores o precio enviados por el navegador. Los archivos no deben poder enlazarse a fichas de otro usuario.

## 7. Seguridad y uso personal

La app es de uso personal, pero cada cuenta tendrá aislamiento. Probar lectura y modificación cruzadas con dos cuentas de prueba. Verificar también los archivos.

Claves solo en servidor. Sanitizar contenido y emails. Validar enlaces y archivos; no descargar automáticamente URLs arbitrarias introducidas por usuarios. Limitar generación y envíos por usuario para evitar costes inesperados y abuso. No registrar documentos completos, claves ni datos privados en logs.

Permitir exportar inventario a CSV y descargar documentos propios. La exportación completa es secundaria si amenaza el plazo.

Durante el concurso, la app entregada, el vídeo, repositorio y documentos contendrán únicamente datos ficticios. Separar la futura instancia personal con información real. Los emails de uso real se habilitarán en esa instancia; la entrega tendrá previsualización o entorno de pruebas sin datos personales reales.

## 8. Plan diario

Cronograma basado en las bases aportadas. Verificar cualquier cambio comunicado por la organización antes de entregar.

| Fecha | Objetivo | Condición para avanzar |
| --- | --- | --- |
| 13 octubre | Confirmar inscripción antes de 23:59; revisar entorno; crear proyecto, datos demo y registro de prompts | Alcance cerrado y aplicación inicial que arranca |
| 14 octubre | Fichas, almacenamiento, acceso y primer despliegue | Crear, editar y recuperar un objeto desde la URL |
| 15 octubre | Documentos, garantías, préstamos, donación básica y cronología | Fechas comprobadas, devolución y entrega registradas, controles entre préstamo/venta/donación |
| 16 octubre | Dos variantes de anuncios, email previsualizable, seguimiento y suscripciones básicas | Venta completa, prueba gratuita y fecha límite visibles |
| 17 octubre | Centro de avisos; correo y tarea diaria si hay acceso; comparación manual básica después del núcleo; IA si hay credenciales | Versión candidata con pruebas de fechas, costes y duplicados; dependencias identificadas |
| 18 octubre | Pruebas finales, documentación, historial y vídeo | Todos los entregables completos y enlaces accesibles |
| 19 octubre | Correcciones imprescindibles y envío con objetivo interno a las 18:00 | Constancia del envío guardada; límite oficial 23:59 |

Si faltan credenciales, avanzar con proveedores simulados identificados y dejar instrucciones concretas de activación. No marcar esas integraciones como terminadas ni posponer las funciones independientes.

Si hay retraso, recortar en este orden: extracción de facturas, IA, exportación, estadísticas, detalles visuales secundarios y comparación avanzada. La comparación manual básica es segunda prioridad y debe figurar como pendiente si no se termina. Mantener objetos, garantías, préstamos y devoluciones, dos anuncios editables, paquete por email, seguimiento y avisos básicos de suscripciones. Si falta configurar el correo, no declarar terminado el envío real; documentar la previsualización como tal.

## 9. Fases de implementación para Codex

### Fase 0. Inspección y preparación
Leer AGENTS.md y los archivos existentes. No sobrescribir trabajo previo. Confirmar estructura y comandos disponibles. Preparar arquitectura, migraciones y datos ficticios. Iniciar docs/registro-prompts.md y docs/estado-proyecto.md.

### Fase 1. Recorrido local completo
Crear navegación, fichas y cronología, garantías, préstamos, suscripciones, anuncios por plantilla para eBay y Facebook Marketplace, previsualización de email y seguimiento usando el modo demo. Priorizar recorridos funcionales sobre pantallas aisladas. No llamarlo producción.

### Fase 2. Persistencia y cuentas
Conectar datos, archivos privados y autenticación. Aplicar políticas por propietario. Probar aislamiento, conservación de datos y eliminación de archivos. Desplegar pronto.

### Fase 3. Email
Implementar adaptador simulado y adaptador real; guardar versiones exactas y trabajos de envío; añadir idempotencia, errores y estados acreditados. Incorporar tarea diaria de recordatorios y preferencias del propietario. Probar destinatario autorizado solo en el entorno privado configurado.

### Fase 4. Mejora de textos con IA
Seguir el proceso de configuración de claves disponible en Codex. Validar entrada y salida, no enviar documentos de garantía ni información privada al modelo. Mantener plantillas si el servicio falla. Probar especialmente objetos con defectos y datos incompletos.

### Fase 5. Calidad y entrega
Después del núcleo, implementar comparación manual básica si queda margen, con cálculos comprobados. Verificar recorridos móvil y escritorio, pruebas significativas y build. Corregir fallos, documentar límites reales y preparar materiales. No ampliar alcance una vez estable la versión candidata.

## 10. Pruebas necesarias

- Garantías: vencimiento inclusivo, cambios de mes/año y datos ausentes.
- Anuncios: conservación de precio/defectos, fotos seleccionadas, edición y versiones.
- Email: idempotencia del servidor, proveedor fallido, timeout ambiguo, webhook repetido y diferencia aceptado/entregado.
- Seguridad: dos usuarios no pueden acceder a fichas o archivos ajenos ni invocar envíos para otra cuenta.
- Ventas: múltiples anuncios, cierre único y recordatorios de retirada.
- Préstamos: solo uno activo, ampliación, devolución sin fecha prevista, accesorios y bloqueo de venta/publicación/envío durante préstamo.
- Donaciones: texto y defectos, acuerdo distinto de entrega, cancelación, bloqueo por préstamo/reserva, anuncios pendientes de retirar y exclusión de ingresos.
- Suscripciones: fin de prueba distinto del cobro, cancelación anterior, recurrencia en meses cortos, cuota anual y precio tras promoción.
- Comparaciones, si se implementan: horizonte común, promociones, gastos, pagos anuales y datos ausentes.
- Avisos: tarea diaria repetida, canales y preferencias, fechas modificadas y cancelación de avisos obsoletos.
- Recorrido integral: crear objeto y garantía, prestar y devolver, preparar dos borradores, previsualizar email, registrar dos publicaciones y cerrar una venta; registrar una prueba gratuita y consultar su aviso.
- Accesibilidad básica: teclado, etiquetas, foco, contraste y formularios.
- Despliegue: URL funcional, rutas profundas, cuentas de prueba y persistencia.

Registrar qué se probó, resultado y limitaciones. No repetir pruebas ya superadas sin cambios o dudas nuevas que lo justifiquen.

## 11. Datos ficticios para demostrar

Preparar seis objetos: cafetera con garantía próxima, bicicleta en buen estado declarado, abrigo con medidas aportadas, taladro con accesorio ausente, consola con defecto declarado y lámpara sin garantía.

Añadir préstamos ficticios: uno con fecha próxima, uno atrasado y uno devuelto. Usar alias inventados. Usar la lámpara para demostrar donación con recogida acordada y entrega confirmada. Añadir suscripciones ficticias: prueba gratuita próxima a acabar, cuota mensual y cuota anual; incluir límite de cancelación distinto del próximo cobro. Para comparar, usar compañías inventadas y ofertas claramente ficticias, sin presentarlas como precios actuales del mercado.

Usar imágenes propias de demostración o con licencia compatible y documentos ficticios etiquetados. No inventar la idoneidad de una categoría para una plataforma. No publicar estos objetos en plataformas reales.

## 12. Entregables del hackathon

Según el PDF facilitado:
- App desplegada con datos de prueba.
- Repositorio GitHub accesible al jurado; si es privado, seguir el acceso exigido por las bases.
- Un Google Doc de documentación técnica: descripción, plataformas, arquitectura, casos de uso, iteraciones, dificultades, soluciones y capturas.
- Un Google Doc separado con historial auténtico de prompts.
- Vídeo de máximo cinco minutos en Drive; objetivo cuatro minutos.
- Carpeta y archivos de Drive con «cualquier persona con el enlace puede ver».
- Enlace a carpeta y enlaces individuales enviados por formulario.
- No modificar entregables después del plazo.

Los borradores locales de documentación no sustituyen los Google Docs obligatorios. El registro resumido tampoco debe presentarse como transcripción literal: conservar los prompts originales y exportar el historial real cuando sea posible.

Guion objetivo de cuatro minutos: problema (15 s), ficha y garantía (30 s), préstamo y devolución (30 s), donación (20 s), anuncios y email (50 s), seguimiento de venta (25 s), suscripciones y avisos (45 s), proceso mediante prompts (25 s). Mostrar comparación solo si está terminada y sin superar cinco minutos.

## 13. Ampliaciones posteriores

1. eBay: conectar cuenta autorizada, validar datos obligatorios, fotos, precio y costes; publicar mediante integración oficial; guardar confirmación; probar primero en sandbox.
2. Comparación de ofertas con búsqueda de fuentes actuales, solo cuando podamos verificar condiciones completas.
3. Extracción de facturas y comparación de reparación/sustitución.
4. Otras plataformas, únicamente si el usuario las incorpora al alcance y se verifica el acceso permitido.

No construir falsos botones de publicación. Si una integración no existe en la app, mostrar su estado como pendiente.

## 14. Referencias verificadas el 13 de octubre de 2026

- Bases del concurso: PDF facilitado por el usuario, Bases-Hackaton-Vibecoding-E7.docx.pdf.
- eBay, creación de anuncios: https://developer.ebay.com/develop/guides/sell/listing-creation
- Facebook Marketplace, compraventa cercana: https://about.fb.com/es/news/2017/08/presentamos-marketplace-compra-y-vende-dentro-de-tu-comunidad/
- Supabase, archivos privados: https://supabase.com/docs/guides/storage/buckets/fundamentals

Preparar textos e imágenes y enviarlos al propietario no equivale a publicarlos por email en eBay o Facebook Marketplace. La publicación y el seguimiento externo son manuales en esta versión. Las referencias anteriores no acreditan integración ni límites actuales de campos: comprobarlos cuando sean necesarios.

Donación es parte del núcleo: incluirla en el recorrido demo, la cronología, las pruebas y la definición de terminado. La comparación de ofertas sigue siendo secundaria frente a objetos, garantías, préstamos, donaciones, ventas y suscripciones.

Limpieza selectiva forma parte del núcleo. Incorporar sus controles a las pruebas y la fase de persistencia. Probar el dictado en la fase de formularios, manteniendo teclado y revisión; si no funciona en un navegador, identificar esa limitación. Priorizar dictado sencillo sobre interpretación estructurada y comparación de ofertas. El calendario inicial se conserva como referencia: el desarrollo que empiece el 14 de octubre debe reagrupar las tareas pendientes del día 13 antes de avanzar y reservar el 18 para documentación y vídeo.

## 15. Definición de terminado

El usuario puede recuperar objetos con su situación completa, consultar garantías, prestar y registrar devoluciones, acordar y confirmar donaciones, preparar anuncios para las dos plataformas, recibir su paquete por email cuando esté configurado, seguir una venta y consultar fechas y avisos de suscripciones. Las cuentas y archivos están aislados. El correo y los avisos programados, si están activados, tienen pruebas; si falta configurarlos, quedan pendientes de forma explícita. La comparación de ofertas muestra su estado real de implementación. La entrega del concurso está completa y accesible.
