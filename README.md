# Mis Cosas

Aplicación local de demostración para el hackathon. Interfaz en español para objetos, garantías, préstamos, donaciones, ventas manuales y suscripciones.

## Ejecutar

Probado con Node 24.19.0 y pnpm 11.25.0.

1. pnpm install --ignore-scripts
2. pnpm dev
3. Abrir http://127.0.0.1:5173/cosas

La aplicación guarda los cambios en IndexedDB de este navegador. No sincroniza dispositivos ni implementa todavía cuentas de producción. Usa datos ficticios.

## Comprobaciones

- pnpm typecheck
- pnpm lint
- pnpm test
- pnpm test:e2e
- pnpm build

Las pruebas de navegador usan Microsoft Edge instalado, en contextos de prueba separados. El dictado automatizado utiliza un reconocimiento controlado para comprobar propuestas, cancelación y cambios de contexto. No acredita calidad de reconocimiento con micrófono real.

## Qué se puede probar

Crear y editar objetos, fotos y documentos, elegir portada, buscar y filtrar, archivar y recuperar; garantías con fechas y documentos; limpieza selectiva con confirmación; prestar/ampliar/devolver; preparar donación editable y acordar/cancelar/confirmar entrega; dos anuncios editables, paquete HTML/texto, fotos ZIP y envío simulado; registrar publicaciones HTTPS, ofertas, reservas y cierre; suscripciones y avisos calculados; dictado por campo con revisión.

Garantías tiene sección propia en la navegación y pestaña en cada ficha. Los documentos se conservan al quitar garantía salvo elección explícita. Facturas y precio de compra no se incluyen en paquetes.

## Pendientes

Supabase, autenticación, aislamiento entre cuentas, archivos privados de servidor, remitente de correo real y proceso diario de servidor. La demo no envía correos ni publica anuncios. Comparación manual de ofertas e IA se abordan después del núcleo.

## Windows

Los ejecutables nativos de esbuild/Rollup están bloqueados por Control de aplicaciones en este equipo. pnpm-workspace.yaml usa sus versiones WebAssembly oficiales. No se ha desactivado ninguna protección del sistema.

## Materiales

Requisitos: PRD_PLAN_MIS_COSAS.md 3.2. Plan: docs/superpowers/plans/2026-10-14-mis-cosas.md. Resultados y limitaciones: docs/pruebas.md. Destinos de concurso: DRIVE_ENTREGA_MIS_COSAS.md.

