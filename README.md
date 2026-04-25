# Awstests

Aplicacion Angular para practicar cuestionarios AWS, ahora con autenticacion Firebase y datos en Firestore.

## Estado actual

- Fuente de datos: Firestore (migrado desde MongoDB Atlas).
- Autenticacion: Firebase Auth (Google + anonimo + email/password).
- UI: PrimeNG.
- Tests unitarios: Jest.
- Build para GitHub Pages: activa y validada.

## Cambios aplicados recientemente

### 1) Migracion de datos a Firestore

- Se migraron 36 colecciones de cuestionarios a Firestore.
- Se eliminaron dependencias de MongoDB Data API en el frontend.
- `DataService` ahora consulta directamente Firestore.

Archivos clave:

- `src/app/services/data.service.ts`
- `src/app/config/firebase.config.ts`

### 2) Seguridad de Firestore

- Reglas versionadas en el repo:
	- `firestore.rules`
	- `firebase.json`
- Reglas desplegadas al proyecto `awstests-71b14`.
- Politica actual: lectura solo para usuarios autenticados y escritura denegada desde cliente.

### 3) Limpieza de legacy MongoDB

Eliminado:

- `src/app/services/mongo-data-auth.service.ts`
- `src/app/services/auth-mongodb-interceptor.service.ts`
- `src/app/guards/auth-mongodb.guard.ts`

Y limpieza de variables MongoDB en:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `src/environments/environment.local.example.ts`
- `src/environments/environment.local.ts`

### 4) UX y layout

- El menu lateral no se muestra en login/registro.
- Se agrego boton de logout en navegacion.
- El estado de tema se guarda y restaura entre sesiones.
- Corregido filtro por secciones: ahora se construye dinamicamente en base a las secciones reales del cuestionario cargado.

### 5) Tooling de tests

- Jest es el runner activo.
- Se retiraron restos de configuracion antigua de Karma/Jasmine.

## Arranque local

1. Instalar dependencias:

```bash
npm install
```

2. Crear entorno local:

```bash
cp src/environments/environment.local.example.ts src/environments/environment.local.ts
```

3. Completar Firebase en `src/environments/environment.local.ts`.

4. Arrancar app:

```bash
npm start
```

## Scripts principales

### Calidad y build

```bash
npm run lint
npm run test:unit
npm run build:pages
```

### Migracion Atlas -> Firestore

Valida prerequisitos del flujo antiguo (si aplica):

```bash
npm run migrate:validate
```

Migracion directa Atlas -> Firestore:

```bash
MONGODB_USER="<user>" \
MONGODB_PASSWORD="<password>" \
FIREBASE_SERVICE_KEY="./scripts/firebase-service-key.json" \
npm run migrate:atlas-to-firestore
```

Opcionalmente puedes usar `MONGODB_URI` en lugar de user/password.

## GitHub Pages

- `baseHref` de Pages: `/awstests/`
- Salida: `dist/awstests`
- Workflow de deploy: `.github/workflows/deploy-pages.yml`

Build local de Pages:

```bash
npm run build:pages
```

## Variables/secretos esperados en CI

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

## Notas de seguridad

- No subir claves de Service Account al repo.
- Usar archivos temporales de credenciales solo para migraciones puntuales.
- Rotar credenciales si se han usado en comandos de terminal compartidos.

## Checklist rapida post-deploy

1. Login correcto (Google/anonimo/email).
2. Carga de preguntas desde Firestore.
3. Cambio de cuestionario.
4. Filtro de secciones funcional.
5. Cambio de tema correcto y persistente.
6. Logout y vuelta a login.
