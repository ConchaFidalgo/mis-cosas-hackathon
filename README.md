# Mis Cosas

Aplicación del hackathon de Vibe Coding, construida con Codex. Organiza objetos, fotos, facturas, garantías y avisos, ventas manuales con historial de precios, préstamos en ambos sentidos, donaciones individuales o agrupadas y suscripciones. Incluye dictado con revisión y limpieza selectiva.

## Demo pública para el jurado

La compilación pública usa exclusivamente ejemplos ficticios y guarda los cambios en IndexedDB de cada navegador. No necesita cuenta ni credenciales. El acceso privado a Supabase queda deshabilitado en esta compilación. Los correos de anuncios y donaciones son simulados; la publicación en plataformas se hace manualmente. No se utiliza IA de pago ni lectura automática de tickets.

## Ejecutar y publicar

Node 24 y pnpm. Ejecutar `pnpm install --ignore-scripts`, después `pnpm demo` y abrir http://127.0.0.1:5173/cosas. Para el alojamiento del concurso: `pnpm run build:public`; el resultado está en dist. vercel.json configura el build y las rutas de la app.

El build público vacía las variables de conexión privada incluso si existe un .env.local. No subir archivos .env, claves, bases de datos personales o sesiones del navegador. Los originales locales de fotos y documentos no se eliminan al quitar sus copias de la app.

## Cuenta privada opcional

El adaptador Supabase, las migraciones y la función collection-api están en el repositorio para revisión. La instancia privada se configura por separado con .env.example y archivos de entorno ignorados. Usa autenticación por enlace, políticas por propietario y archivos privados con enlaces temporales. No se comparten credenciales reales con el jurado.

## Comprobaciones

`pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm run build:public`. Las pruebas de navegador usan Edge. Algunas pruebas de cámara y dictado usan sustitutos controlados y no certifican hardware real. El dictado se ha ensayado también por la usuaria, con revisión. Los servicios de reconocimiento dependen del navegador.

## Documentación

PRD_PLAN_MIS_COSAS.md contiene el alcance original. docs/donaciones.md explica la ampliación aprobada. docs/conexion-supabase.md describe la conexión privada y sus límites en su fecha. La documentación técnica y el historial oficiales se mantienen en los dos Google Docs indicados en DRIVE_ENTREGA_MIS_COSAS.md; los registros locales conservan el contexto histórico, no son una certificación de entrega completa.

En Windows, pnpm-workspace.yaml usa versiones WebAssembly oficiales de esbuild y Rollup por las restricciones de ejecución del equipo. No se han desactivado protecciones del sistema.
