# Informe de revision Angular

Fecha: 2026-04-28
Proyecto: `awstests`

## Alcance

Se reviso el proyecto comparandolo con los puntos de la captura:

1. Estructura escalable.
2. Uso de Signals vs RxJS.
3. Rendimiento en apps grandes.
4. Prevencion de memory leaks.
5. Diseno del data flow.
6. Testing.
7. Depuracion de incidencias en produccion.

Tambien se validaron estos comandos:

- `npm test -- --runInBand` -> OK. 10 suites, 12 tests.
- `npm run lint` -> OK.
- `npm run build` -> OK, con 1 warning de budget en `navigation.component.scss`.

## Resumen ejecutivo

El proyecto esta sano a nivel basico: compila, pasa lint y pasa tests. La separacion minima entre componentes, servicios y guard existe, y se usa RxJS donde tiene sentido para async. Aun asi, la aplicacion no esta todavia preparada como una base realmente escalable para crecer sin deuda.

La conclusion global es:

- Estructura escalable: cumple parcial.
- Signals vs RxJS: cumple parcial.
- Rendimiento: cumple parcial.
- Memory leaks: cumple parcial, sin riesgos graves inmediatos.
- Data flow: cumple parcial con varios puntos mejorables.
- Testing: cumple minimo.
- Debug en produccion: cumple bajo.

## Evaluacion por punto

### 1. Estructura escalable

Estado: **cumple parcial**

Lo positivo:

- Hay separacion entre componentes, servicios, guard y config.
- La autenticacion y el acceso a Firestore estan encapsulados en servicios: [src/app/services/auth.service.ts](/Users/javiergarcia/git/awstests/src/app/services/auth.service.ts:22), [src/app/services/data.service.ts](/Users/javiergarcia/git/awstests/src/app/services/data.service.ts:16).

Lo que no escala bien:

- La estructura sigue siendo por tipo tecnico (`components`, `services`, `guards`) y no por features de negocio.
- Todo cuelga de un unico `AppModule`, con muchas declaraciones y providers centralizados: [src/app/app.module.ts](/Users/javiergarcia/git/awstests/src/app/app.module.ts:36).
- El routing no usa lazy loading ni separacion por areas: [src/app/app-routing.module.ts](/Users/javiergarcia/git/awstests/src/app/app-routing.module.ts:12).
- Hay constantes de dominio grandes y globales en un fichero comun, por ejemplo el listado de cuestionarios: [src/app/config/constants.ts](/Users/javiergarcia/git/awstests/src/app/config/constants.ts:11).

Lectura:

Para el tamano actual funciona, pero si se anaden mas pantallas, estados o flujos de usuario, la mantenibilidad bajara rapido.

### 2. Signals vs RxJS

Estado: **cumple parcial**

Lo positivo:

- RxJS se usa en autenticacion y carga de datos async, que es un uso razonable: [src/app/services/auth.service.ts](/Users/javiergarcia/git/awstests/src/app/services/auth.service.ts:24), [src/app/services/data.service.ts](/Users/javiergarcia/git/awstests/src/app/services/data.service.ts:21).
- En plantilla ya se usa `async` para autenticacion: [src/app/app.component.html](/Users/javiergarcia/git/awstests/src/app/app.component.html:2).

Lo mejorable:

- No hay uso de Signals para estado local de UI.
- Parte del estado local se maneja con propiedades mutables y eventos manuales (`filterName`, `questionaryName`, `showResponse`, `showExplanation`, arrays reasignados).
- Se mezcla estado remoto, estado de formulario y estado de presentacion sin una fachada clara.

Lectura:

El proyecto entiende RxJS como herramienta async, pero todavia no aprovecha el modelo moderno de Angular para estado local reactivo.

### 3. Rendimiento en apps grandes

Estado: **cumple parcial**

Lo positivo:

- `DataService` cachea cuestionarios con `shareReplay(1)`: [src/app/services/data.service.ts](/Users/javiergarcia/git/awstests/src/app/services/data.service.ts:19).
- En la lista principal se usa la nueva sintaxis `@for`: [src/app/components/dashboard/dashboard.component.html](/Users/javiergarcia/git/awstests/src/app/components/dashboard/dashboard.component.html:3).

Lo mejorable:

- No se usa `ChangeDetectionStrategy.OnPush` en los componentes revisados.
- No hay lazy loading de rutas: [src/app/app-routing.module.ts](/Users/javiergarcia/git/awstests/src/app/app-routing.module.ts:12).
- `DashboardComponent` recrea controles al cambiar cuestionario y no limpia el formulario antes de volver a anadir controles: [src/app/components/dashboard/dashboard.component.ts](/Users/javiergarcia/git/awstests/src/app/components/dashboard/dashboard.component.ts:25).
- Hay manipulacion directa del DOM con `document.querySelector` y `querySelectorAll`, lo que dificulta una UI mas predecible y eficiente: [src/app/components/header/header.component.ts](/Users/javiergarcia/git/awstests/src/app/components/header/header.component.ts:35), [src/app/components/navigation/navigation.component.ts](/Users/javiergarcia/git/awstests/src/app/components/navigation/navigation.component.ts:39).
- El build ya muestra un warning de budget en `navigation.component.scss`.

Lectura:

Para una app pequena va bien. Para crecer, faltan patrones de cambio de deteccion y carga diferida.

### 4. Prevencion de memory leaks

Estado: **cumple parcial**

Lo positivo:

- Las lecturas de Firestore con `getDocs(...)` completan por si mismas, asi que las suscripciones de `HeaderComponent` no son un leak permanente: [src/app/components/header/header.component.ts](/Users/javiergarcia/git/awstests/src/app/components/header/header.component.ts:28).
- La autenticacion expuesta al template usa `async` pipe en root: [src/app/app.component.html](/Users/javiergarcia/git/awstests/src/app/app.component.html:2).

Lo mejorable:

- `AppComponent` se suscribe a `router.events` sin limpieza explicita: [src/app/app.component.ts](/Users/javiergarcia/git/awstests/src/app/app.component.ts:57).
- No se ve uso de `takeUntilDestroyed`, `DestroyRef` ni patrones modernos de teardown.
- Se usan `subscribe()` directos en varios componentes, aunque en este caso muchos son sobre observables finitos.

Lectura:

No veo un problema serio hoy, pero tampoco un patron consistente de higiene reactiva para una app grande.

### 5. Diseno del data flow

Estado: **cumple parcial**

Lo positivo:

- La lectura de preguntas entra por `DataService`.
- La autenticacion entra por `AuthService`.
- Hay un flujo simple `Header -> Dashboard -> Question` por outputs e inputs.

Lo mejorable:

- `DataService` guarda un `FormGroup` en una variable global de modulo, fuera de la clase: [src/app/services/data.service.ts](/Users/javiergarcia/git/awstests/src/app/services/data.service.ts:11).
- `DashboardComponent` depende de ese `FormGroup` compartido y lo muta dinamicamente: [src/app/components/dashboard/dashboard.component.ts](/Users/javiergarcia/git/awstests/src/app/components/dashboard/dashboard.component.ts:22).
- No queda claramente definido donde "vive" el estado principal del cuestionario, quien lo posee y como se reinicia.
- `HeaderComponent` carga datos, recalcula secciones y emite arrays completos; `DashboardComponent` aplica filtros; `QuestionComponent` tambien consulta el mismo formulario compartido. El ownership del estado queda difuso.

Lectura:

Este es uno de los puntos mas flojos respecto a la captura. El flujo funciona, pero la propiedad del estado no esta bien definida.

### 6. Testing

Estado: **cumple minimo**

Lo positivo:

- Hay tests configurados con Jest y el suite actual pasa.
- Existen specs para componentes principales y para `AuthService`.

Lo mejorable:

- La cobertura funcional parece baja. La mayoria de specs verifican solo `should create`, por ejemplo: [src/app/services/auth.service.spec.ts](/Users/javiergarcia/git/awstests/src/app/services/auth.service.spec.ts:6), [src/app/components/header/header.component.spec.ts](/Users/javiergarcia/git/awstests/src/app/components/header/header.component.spec.ts:7), [src/app/components/dashboard/dashboard.component.spec.ts](/Users/javiergarcia/git/awstests/src/app/components/dashboard/dashboard.component.spec.ts:7).
- No se ven tests de flujo real sobre login, filtros, cambio de cuestionario, guard o manejo de errores.
- No hay tests que protejan los puntos de arquitectura o data flow que mas probablemente se rompan al refactorizar.

Lectura:

Hay tooling y base minima, pero no una red de seguridad suficiente para cambios estructurales.

### 7. Depuracion de incidencias en produccion

Estado: **cumple bajo**

Lo positivo:

- Existe integracion de analytics con `gtag`: [src/app/app.component.ts](/Users/javiergarcia/git/awstests/src/app/app.component.ts:57).
- En login y registro se muestran errores de usuario con `MessageService`.

Lo mejorable:

- No se aprecia una estrategia de observabilidad de errores de frontend.
- No hay servicio centralizado de logging o error handling.
- No se ven trazas de data flow ni correlacion de errores por feature.
- La depuracion dependeria bastante de reproducir manualmente o leer mensajes aislados.

Lectura:

Este punto esta por debajo de lo recomendable si la app empieza a tener trafico o incidencias reales.

## Riesgos concretos detectados

1. Estado compartido fragil por el `FormGroup` global en `DataService`.
2. Dificultad para escalar por estructura basada en tipos y no en features.
3. Rendimiento mejorable por falta de `OnPush` y lazy loading.
4. Tests insuficientes para refactors importantes.
5. Observabilidad baja para errores reales en produccion.

## Propuesta de cambios para el siguiente paso

Orden recomendado de implementacion:

1. Reordenar el flujo del cuestionario para que el estado viva en un unico sitio claro.
   - Quitar el `FormGroup` global de `DataService`.
   - Hacer que `DashboardComponent` o una facade de feature sea duena del formulario y del cuestionario cargado.

2. Mejorar la reactividad local con Angular moderno.
   - Introducir Signals para estado de UI local: filtro, cuestionario activo, visibilidad de respuestas, etc.
   - Mantener RxJS para Firestore y auth.

3. Mejorar rendimiento base.
   - Activar `OnPush` en componentes de presentacion.
   - Preparar lazy loading para `dashboard`, `settings`, `login` y `register`.

4. Limpiar acoplamientos de UI.
   - Sustituir manipulacion directa de DOM por bindings de Angular para sidebar y estado activo.

5. Reforzar tests alrededor del comportamiento.
   - Tests de `HeaderComponent` para carga y filtro.
   - Tests de `DashboardComponent` para ownership del formulario y filtrado.
   - Tests de `AuthService` y `TokenGuard` con escenarios reales.

6. Mejorar depuracion.
   - Crear un servicio de error/logging centralizado para capturar contexto y errores de feature.

## Veredicto final

El proyecto **si sigue una parte de los puntos**, pero de forma incompleta. Tiene buenas bases para una app pequena o mediana, pero todavia no refleja de forma consistente los principios de una Angular app escalable y moderna que aparecen en la captura.

La prioridad para el siguiente paso deberia ser **clarificar el data flow y ownership del estado**, porque ese cambio desbloquea casi todo lo demas: mejor testing, mejor rendimiento y una arquitectura mas limpia.
