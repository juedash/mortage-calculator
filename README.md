# Mortgage Calculator (Vue 3 + TypeScript)

A mortgage calculator built with Vue 3 and TypeScript.

**Author:** Jueda Sherifi  
**Email:** juedasherifi@gmail.com

## Features

- Form validation using **vee-validate + yup**
- Live calculations via Vue composables
- Async tax loading via GraphQL
- Global location state using **Pinia** (currently hardcoded to `berlin`)
- Optional rates table fetching based on user inputs

## Tech stack

- Vue 3 + `<script setup>` + TypeScript
- Tailwind CSS
- Pinia
- vee-validate + yup
- Vitest
- Axios (GraphQL HTTP client)

---

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint

### Unit Tests with [Vitest](https://eslint.org/)

```sh
npm run test
```
