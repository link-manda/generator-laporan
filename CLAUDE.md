# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Existing repository instructions

- `AGENTS.md` is authoritative for framework-specific caution: this repo uses Next.js `16.2.9`, and its APIs/conventions may differ from older Next.js behavior in model memory.
- Before changing Next.js behavior, read the relevant guide under `node_modules/next/dist/docs/` and watch for deprecations.

## Common commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Start built app: `npm run start`
- Lint whole repo: `npm run lint`
- Lint one file: `npx eslint app/page.tsx`
- Type-check only: `npx tsc --noEmit`

## Test status

- No test runner or `npm test` script configured yet.
- No single-test command exists yet; if tests are added later, update this file with exact commands.

## Current codebase shape

- Current repo is small and still close to starter scaffold.
- Main runtime surface is App Router under `app/`.
- `app/layout.tsx` is global shell. It loads `Geist`, `Geist_Mono`, and `DM_Sans`, imports `app/globals.css`, and sets shared `<html>` / `<body>` classes.
- `app/page.tsx` is still starter landing page, so current shipped UI does **not** match intended product yet.
- Styling is Tailwind CSS v4, driven from `app/globals.css` instead of legacy Tailwind config.
  - File imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`.
  - Theme tokens live in CSS custom properties on `:root` and `.dark`.
  - `@theme inline` maps those variables into Tailwind token names.
- UI primitives live in `components/ui/`. Current example is `components/ui/button.tsx`, using shadcn style, Radix Slot composition, and `class-variance-authority` variants.
- Shared utility layer is tiny. `lib/utils.ts` exports `cn()`, which combines `clsx` + `tailwind-merge`; reuse it for className composition.

## Conventions and dependencies that matter

- Path alias `@/*` is enabled in `tsconfig.json`; prefer imports like `@/lib/utils` over long relative paths.
- `components.json` shows shadcn is configured with:
  - style: `radix-rhea`
  - RSC enabled
  - Tailwind CSS source: `app/globals.css`
  - aliases for `components`, `ui`, `lib`, `utils`, `hooks`
- Dependency stack worth recognizing before edits:
  - `next@16.2.9`
  - `react@19.2.4`
  - `tailwindcss@4`
  - `shadcn`
  - `radix-ui`
  - `class-variance-authority`
  - `tailwind-merge`
  - `@tabler/icons-react`
- `next.config.ts` is currently empty.
- ESLint uses flat config in `eslint.config.mjs` with `eslint-config-next` core-web-vitals + TypeScript presets.

## Product blueprint from `blueprint_print.md`

- Root project is intended to become **Generator Laporan** for Diskominfo Kabupaten Badung, not generic landing page.
- Blueprint describes single-screen document composer with two main panes:
  - left pane: input form/editor
  - right pane: live A4 preview ready for printing/PDF export
- Primary workflow in blueprint:
  1. user edits report metadata and intro text
  2. user manages dynamic report items per section
  3. user optionally uploads screenshots per item
  4. app renders formatted official report preview
  5. user prints/export via `window.print()`

## Domain model implied by blueprint

- Report metadata includes month/year, author identity, author job title/NIP, report date, approver identity, approver title/NIP.
- Intro paragraph is editable free text.
- Report body has four named sections:
  - `persiapan`
  - `perancangan`
  - `finalisasi`
  - `evaluasi`
- Each section contains dynamic list items shaped roughly like:
  - `id`
  - `text`
  - optional `image`
- Blueprint uses alphabetical sub-point rendering (`a.`, `b.`, ...) for multi-item sections and embeds screenshots below related points.

## Implementation implications from blueprint

- Main report editor will likely need client-side state (`useState`) and browser-only actions (`window.print()`, file input, `URL.createObjectURL`), so root report page or key subtrees will need `"use client"`.
- Current blueprint is written as one large React component. When implementing in this repo, preserve behavior but split into small pieces if it improves readability without changing flow:
  - metadata form
  - section editor
  - print preview
  - print-specific styles
- Print layout is core feature, not polish. Changes to styling must be checked in print mode, especially A4 sizing, margins, hidden editor pane, and screenshot rendering.
- Blueprint uses inline print CSS with `@media print` and `@page size: A4`; keep print behavior explicit when porting to Next/Tailwind.
- Official document formatting matters: government header, section numbering, signature blocks, and Indonesian report wording are part of product behavior, not decorative content.

## Working assumptions for future edits

- If task touches root product direction, read `blueprint_print.md` first.
- Treat `app/page.tsx` starter content as disposable scaffold unless user says otherwise.
- Existing uncommitted files (`components/`, `lib/`, `components.json`, edits in `app/`) indicate UI/theming setup is already in progress; inspect working tree before overwriting scaffold files.

## Notes from other guidance sources

- `README.md` is default Create Next App README; no extra project-specific workflow documented there.
- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` were present when this file was generated.
