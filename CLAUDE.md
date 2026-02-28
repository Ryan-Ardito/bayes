# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bayesian reasoning experiment built with React 19, TypeScript 5.9, and Vite 7. Uses Bun as the package manager.

## Commands

- **Dev server**: `bun run dev`
- **Build**: `bun run build` (runs `tsc -b && vite build`)
- **Lint**: `bun run lint`
- **Preview production build**: `bun run preview`

## Architecture

- **Entry point**: `src/main.tsx` mounts `<App />` inside `<StrictMode>` to `#root`
- **Root component**: `src/App.tsx`
- **Static assets**: `public/`
- **Build output**: `dist/`

## TypeScript

- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Target: ES2022, Module: ESNext, JSX: react-jsx
- Bundler module resolution (Vite handles imports)

## Linting

ESLint 9 flat config with TypeScript, React Hooks, and React Refresh plugins.
