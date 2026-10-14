# Instrucción inicial para Codex

Quiero que construyas la aplicación «Mis Cosas» siguiendo la versión 3.2 de PRD_PLAN_MIS_COSAS.md, ubicado en esta misma carpeta. Léelo completo antes de implementar y úsalo como fuente de requisitos. Este alcance sustituye propuestas anteriores. La huerta no forma parte del proyecto.

Incluye limpieza selectiva: eliminar garantía, foto o documento sin borrar todo el objeto, archivar y eliminar la ficha completa. Mostrar consecuencias y pedir confirmación. Una garantía vencida no se borra automáticamente; eliminarla conserva sus documentos salvo selección explícita y cancela sus avisos. No modificar originales locales ni afirmar que borrar la ficha retira anuncios externos.

Añade edición por voz mediante micrófono dentro de los formularios. Primero dictado por campo; después propuestas estructuradas si están disponibles. Mostrar texto editable, valores anteriores y cambios propuestos antes de Guardar. Aclarar fechas ambiguas y conservar teclado cuando falle el micrófono. No guardar audio permanentemente por defecto ni ejecutar borrados, emails o confirmaciones de entrega directamente por voz. Comprobar compatibilidad y explicar cualquier procesamiento externo de audio.

Incluye la opción «Donar» junto a «Vender» y «Prestar». Permite marcar disponibilidad para donación, preparar texto y fotos, registrar destinatario y recogida, cancelar el acuerdo y confirmar la entrega. Conserva el historial y recuerda retirar anuncios de venta activos. No contactes automáticamente a destinatarios ni busques entidades. No permitas entregar un objeto prestado, vendido o ya donado; no sumes donaciones a los ingresos. No asumas que un anuncio de donación puede publicarse en las plataformas de venta sin comprobar sus reglas.

La app reúne Mis cosas, Garantías, Ventas, Préstamos y Suscripciones. La primera versión prepara anuncios editables solo para eBay y Facebook Marketplace y me los envía por email con los textos y las imágenes seleccionadas. Yo publicaré los anuncios y guardaré sus enlaces. El seguimiento de ofertas y ventas será manual. Wallapop, Vinted y Milanuncios quedan fuera del alcance. La publicación automática es una ampliación posterior.

La ficha de cada objeto debe reflejar toda su situación: ubicación, estado, documentos, garantías, disponibilidad, a quién está prestado, devolución prevista, anuncios, ofertas e historial. Añade préstamos con entrega, accesorios, ampliación de plazo, devolución y recordatorios solo para mí. Impide préstamos simultáneos y venta o envío de anuncios mientras el objeto esté prestado.

Incluye suscripciones con fin de prueba gratuita, primer cobro, importe, periodicidad, renovación y fecha límite de cancelación como datos distintos. Añade avisos en app y correo configurable al propietario. Para avisos por email usa una tarea de servidor que funcione con la app cerrada, con deduplicación; no una automatización del chat. Después del núcleo, incorpora comparación manual de ofertas con promociones, precio posterior, gastos y coste de doce meses. No busques tarifas automáticamente ni canceles o contrates servicios.

Trabaja por las fases del plan, empezando por inspeccionar el entorno y las instrucciones AGENTS.md. No te limites a devolver otra planificación: construye, ejecuta, comprueba y documenta el resultado. No sobrescribas trabajo existente.

Empieza por recorridos completos de objetos, garantías, préstamos, ventas y suscripciones con datos ficticios y modo demo identificado. Después conecta persistencia, cuentas y archivos privados. Implementa correo real, recordatorios programados y generación con IA cuando sus accesos estén disponibles; conserva previsualización de emails y generación por plantillas para avanzar sin ellos. No presentes una simulación como envío, publicación o sincronización real.

Antes de configurar servicios externos, explica qué acceso falta y usa los mecanismos seguros de configuración disponibles. No pidas claves en texto por el chat, no las muestres ni las guardes en el repositorio. No contrates servicios de pago sin mi autorización. No envíes correos a terceros: el envío funcional será solo al propietario verificado y se probará en un entorno privado autorizado.

La entrega pública del hackathon utilizará exclusivamente datos ficticios y modo de prueba. No publiques objetos ficticios en mercados reales. Respeta el alcance y los requisitos del concurso descritos en el plan.

Registra desde el inicio los prompts originales, cambios y comprobaciones en docs/registro-prompts.md; indica cuáles son resúmenes y conserva el historial auténtico para la entrega. Mantén docs/estado-proyecto.md con funciones terminadas, dependencias, fallos y siguiente acción. Prepara documentación técnica local y guion del vídeo; recuerda que la entrega final requiere dos Google Docs separados.

Aplica textos claros, diseño móvil accesible y anuncios honestos. Conserva los defectos y el precio indicado. No inventes características ni garantías transferibles. Los emails incluirán solo textos y fotos seleccionadas para venta, nunca facturas ni documentos privados.

Prueba persistencia, aislamiento entre cuentas, fechas de garantía, préstamos y devoluciones, bloqueo de venta durante un préstamo, versiones de los dos anuncios, envíos duplicados, cierre de ventas, fechas independientes de suscripciones y cancelación de avisos obsoletos. Si implementas comparación, prueba promociones, cuotas anuales y gastos de cambio. Ejecuta las comprobaciones necesarias para la implementación y el despliegue. Avanza en lo independiente si alguna integración está bloqueada.

Al terminar cada fase, indica brevemente qué funciona, cómo se comprobó y qué requiere configuración. Entrega una aplicación funcional, instrucciones de ejecución/despliegue y un estado honesto de lo que queda pendiente.

Lee DRIVE_ENTREGA_MIS_COSAS.md para recuperar la carpeta y los Google Docs ya creados. Durante el trabajo, guarda allí los materiales destinados al hackathon: actualiza la documentación técnica existente, añade las instrucciones originales al historial sin duplicarlas y sube las capturas o el vídeo a sus destinos. Usa el conector de Drive y verifica cada escritura. No sustituyas estos documentos por archivos locales ni inventes un historial. Si Drive no está disponible, conserva lo pendiente localmente e indícalo. Antes de la entrega, verifica los permisos exigidos; respeta el cierre del plazo.
