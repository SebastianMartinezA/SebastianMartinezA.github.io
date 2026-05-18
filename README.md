# SebastianMartinezA.github.io

Portfolio personal publicado en [smar.ar](https://smar.ar/).

## Estructura del repo

- `main`: rama fuente. Todo cambio de código se hace acá.
- `frontend_react/`: app React 18 + Vite + SCSS.
- `gh-pages`: rama generada por GitHub Actions. Contiene solo el build estático publicado; no editar a mano.
- `backend_sanity/`: legado del portfolio anterior. No participa del deploy actual.

## Desarrollo local

```bash
cd frontend_react
npm ci
npm run dev
```

La app queda disponible en `http://localhost:5173/` salvo que Vite elija otro puerto.

## Verificación

```bash
cd frontend_react
npm test
npm run build
```

## Deploy

El workflow `.github/workflows/workflow.yml` corre en cada push a `main`:

1. instala dependencias en `frontend_react/`;
2. ejecuta `npm run build`;
3. publica `frontend_react/dist/` en `gh-pages`.

Para publicar cambios: hacer commit en `main` y pushear a `origin/main`.
