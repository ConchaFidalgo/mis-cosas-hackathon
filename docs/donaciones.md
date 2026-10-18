# Donaciones: ampliación aprobada el 18 de octubre de 2026

Se añade una sección propia con acuerdos pendientes y entregas registradas. Una nueva donación permite seleccionar varios objetos propios disponibles, destinatario, fecha prevista y condiciones. Cada objeto conserva su ficha y su registro de donación; los acuerdos múltiples comparten el identificador de donación. No se modifica el esquema de Supabase ni se necesita una API de pago.

La entrega requiere selección y confirmación explícitas. Se pueden entregar solo algunos objetos del acuerdo; el resto continúa pendiente. Los paquetes preparados sin acuerdo también aparecen entre los pendientes. La búsqueda del catálogo incluye destinatarios y encuentra fichas archivadas al introducir una búsqueda. El filtro Donados y las tarjetas muestran destinatario y fecha.

Verificación: 54 pruebas de dominio correctas; tipos y lint correctos; recorrido de navegador con acuerdo múltiple, entrega parcial, recarga, búsqueda y capturas en escritorio y móvil correcto. La compilación pasa con el aviso existente de tamaño de bundle. Las pruebas usan una colección ficticia aislada, sin modificar la cuenta de la usuaria. Queda la comprobación guiada de este nuevo recorrido en su cuenta privada.

No se envían mensajes ni se publican anuncios. Los archivos y el historial se conservan. Un préstamo activo, venta cerrada, reserva o donación ya acordada impiden incluir el objeto en otro acuerdo.
