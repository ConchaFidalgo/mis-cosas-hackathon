# Mis Cosas

Aplicación local de demostración para el hackathon. Interfaz en español para objetos, garantías, préstamos, donaciones, ventas manuales y suscripciones.

## Ejecutar

Probado con Node 24.19.0 y pnpm 11.25.0.

1. pnpm install --ignore-scripts
2. pnpm demo para dejar el servidor activo, o pnpm dev para desarrollo con terminal abierto
3. Abrir http://127.0.0.1:5173/cosas

La aplicación guarda los cambios en IndexedDB de este navegador. No sincroniza dispositivos ni implementa todavía cuentas de producción. Usa datos ficticios.

La cámara está en Mis cosas → Añadir objeto o Editar objeto → Hacer foto. Permite capturar, revisar, repetir y añadir antes de guardar. Requiere permisos del navegador; no solicita audio. Una dirección localhost del ordenador no abre la app desde otro teléfono; ese acceso necesita despliegue o configuración de red y contexto seguro.

## Comprobaciones

- pnpm typecheck
- pnpm lint
- pnpm test
- pnpm test:e2e
- pnpm build

Las pruebas de navegador usan Microsoft Edge instalado, en contextos de prueba separados. El dictado automatizado utiliza un reconocimiento controlado para comprobar propuestas, cancelación y cambios de contexto. No acredita calidad de reconocimiento con micrófono real.

## Qué se puede probar

Crear y editar objetos, fotos y documentos, elegir portada, buscar y filtrar, archivar y recuperar; garantías con fechas y documentos; limpieza selectiva con confirmación; prestar/ampliar/devolver; preparar donación editable y acordar/cancelar/confirmar entrega; cuatro destinos con anuncios editables, paquete HTML/texto, fotos ZIP y envío simulado; registrar publicaciones HTTPS, ofertas, reservas y cierre; suscripciones y avisos calculados; dictado por campo con revisión.

Garantías tiene sección propia en la navegación y pestaña en cada ficha. Los documentos se conservan al quitar garantía salvo elección explícita. Facturas y precio de compra no se incluyen en paquetes.

«Prestado» reúne lo que tú prestas. «Me prestan» guarda objetos ajenos con dueño/alias, fechas, estado, accesorios y notas, separados del inventario propio. Permite editar, ampliar y devolver con historial, avisos en Inicio y dictado revisado. En móvil se accede desde «Más». Los datos de versiones anteriores se conservan.

Ventas prepara variantes para Vinted, Wallapop, eBay y Facebook Marketplace. Cada publicación registrada muestra plataforma, precio, fecha y antigüedad. Revisar precio guarda el anterior y una nota sin cambiar el anuncio externo. Las versiones aprobadas anteriores se conservan; los conflictos entre pestañas se rechazan. Sin una publicación registrada se indica Precio por registrar.

Comprobación más reciente: 39 pruebas de dominio y 27 de navegador, tipos, lint y build correctos. La cámara automatizada usa getUserMedia sustituido por MediaStream de canvas; no acredita hardware o permisos reales. Véase docs/pruebas.md.

## Pendientes

Supabase, autenticación, aislamiento entre cuentas, archivos privados de servidor, remitente de correo real y proceso diario de servidor. La demo no envía correos ni publica anuncios. Comparación manual de ofertas e IA se abordan después del núcleo.

## Windows

Los ejecutables nativos de esbuild/Rollup están bloqueados por Control de aplicaciones en este equipo. pnpm-workspace.yaml usa sus versiones WebAssembly oficiales. No se ha desactivado ninguna protección del sistema.

Los scripts usan --configLoader native con Node 24 para evitar el atasco de empaquetado de la configuración observado en este equipo.

## Materiales

Requisitos: PRD_PLAN_MIS_COSAS.md 3.2. Plan: docs/superpowers/plans/2026-10-14-mis-cosas.md. Resultados y limitaciones: docs/pruebas.md. Destinos de concurso: DRIVE_ENTREGA_MIS_COSAS.md.

