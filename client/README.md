# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Demo / Deploy notes

- A `sample-data.json` mock dataset is included in `public/` so the app can run without a backend.
- The client will automatically use the mock data when built in production and no `VITE_API_BASE` is provided, or when you set `VITE_USE_MOCK=true`.
- To deploy on Vercel for quick demo: set no `VITE_API_BASE` (or set `VITE_USE_MOCK=true`) in the project Environment Variables. The app will then use the bundled sample data.

If you want the app to call a real backend, set `VITE_API_BASE` to the API URL in Vercel env vars.
