# Pip Project Agent Notes

Angular + PrimeNG starter app for local iteration.

## Stack

- Node: 26.2.0 (n-1 stable)
- Package manager: npm
- Angular: 21.2.x
- PrimeNG: 21.x
- Tailwind CSS 4 + PostCSS

## Run

```bash
npm start
```

## Agent Workflow

- Use npm commands for dependency and script tasks.
- Prefer `npm start` for local verification workflows.
- Do not run `npm run build` or `ng build` proactively unless the user asks.
- Keep changes minimal and scoped to the request.

## Current Dependencies Notes

- PrimeNG expects Angular 21 peer versions in this repo.
- `@angular/cdk` is installed as a PrimeNG peer dependency.

## Theme

- **PrimeNG preset: Lara** — `PipPreset` extends Lara in `src/app/theme/pip-preset.ts`.
- **Locked:** Do not switch to Nora, Aura, or another base preset unless the user explicitly asks.
- Pip brand colors live in `pip-tokens.ts`; only surfaces, text, and primary override Lara via `definePreset`.
- Do not recreate Lara component styling (card borders, shadows, padding) in CSS — use Lara defaults.

## Styling

- **Tailwind 4 + tailwindcss-primeui** — utilities in section `.html` templates
- Use semantic utilities: `text-color`, `text-muted-color`, `border-surface`, `bg-surface-0`, `rounded-border`, `text-primary`
- Do not add custom component CSS to `styles.css`; reserve global CSS for PrimeNG overrides and base layer
- Before styling, read a sibling section (`bottleneck`, `schedule`) as the reference pattern
- Exceptions: Chart.js (trends), funnel bar `color-mix` (inline component styles)
