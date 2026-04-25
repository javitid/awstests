# Awstests

## Arranque local

1. Instala dependencias:

```bash
npm install
```

2. Crea tu entorno local:

```bash
cp src/environments/environment.local.example.ts src/environments/environment.local.ts
```

3. Rellena `src/environments/environment.local.ts`.

4. Arranca la app:

```bash
npm start
```

## GitHub Pages

La build para Pages usa `baseHref` en `/awstests/` y genera el contenido en `dist/awstests`.

Comando local:

```bash
npm run build:pages
```

El workflow `.github/workflows/deploy-pages.yml` publica automáticamente en GitHub Pages cuando hay push a `main`.

## Tests

Los tests unitarios se ejecutan con Jest:

```bash
npm run test:unit
```

Necesitas estos secretos en GitHub:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test:unit` to execute the unit tests with Jest.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
