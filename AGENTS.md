# AGENTS.md

## Commands
- `npm run dev` - Dev server with HMR
- `npm run build` - Production build → dist/
- `npm run lint` - ESLint check
- `npm run preview` - Preview production build

## Architecture
- Entry: src/main.jsx → src/App.jsx
- Plain JavaScript (no TypeScript)
- React 19 with React Compiler enabled

## Important
- React Compiler adds build overhead but enables automatic optimization
- No test suite configured
- Single-page app, no routing