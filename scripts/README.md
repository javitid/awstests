# 🚀 Migración MongoDB → Firestore

## ⚡ TL;DR (Quick Start)

1. Descarga la clave de servicio de Firebase desde Console
2. Guárdala en `scripts/firebase-service-key.json`
3. Ejecuta:
   ```bash
   npm run migrate:validate      # Verifica credenciales
   npm run migrate:mongodb-to-firestore  # Inicia migración
   ```

---

## 📋 Proceso detallado

### Paso 1️⃣: Obtener Firebase Service Account Key

Este archivo contiene las credenciales para acceder a Firestore desde el script.

**Ubicación:** 
- URL: https://console.firebase.google.com/
- Proyecto: awstests-71b14
- Menú: ⚙️ Configuración > Cuentas de Servicio > Generar Nueva Clave Privada

**Guardar:**
```
awstests/
└── scripts/
    └── firebase-service-key.json  ← Aquí va el archivo descargado
```

⚠️ **IMPORTANTE:** Nunca subas este archivo a git (ya está en .gitignore)

---

### Paso 2️⃣: Validar credenciales

Antes de migrar, verifica que todo funciona:

```bash
npm run migrate:validate
```

Debería mostrar:
```
═══════════════════════════════════════
  Validación de credenciales
═══════════════════════════════════════

🔍 Validando Firebase...
✅ Firebase: OK
🔍 Validando MongoDB Realm...
✅ MongoDB Realm: OK (65 documentos en architectA1)

═══════════════════════════════════════
✨ ¡Todo está listo para migrar!

Ejecuta:
  npm run migrate:mongodb-to-firestore
```

Si hay errores, revisa [TROUBLESHOOTING](#troubleshooting) abajo.

---

### Paso 3️⃣: Ejecutar migración

```bash
npm run migrate:mongodb-to-firestore
```

El script hará automáticamente:
- ✅ Conectar a Firestore
- ✅ Obtener token de MongoDB Realm
- ✅ Descargar 36 colecciones de preguntas
- ✅ Importar documentos a Firestore

Ejemplo de salida:
```
🚀 Iniciando migración MongoDB → Firestore

🔧 Conectando a Firestore...
✅ Conectado a Firestore

🔓 Obteniendo token de MongoDB Realm...
✅ Token obtenido

📦 Migrando colecciones:

   architectA1                     ✅ 65 documentos
   architectA2                     ✅ 50 documentos
   architectA3                     ✅ 48 documentos
   architectA4                     ✅ 70 documentos
   ...

✨ Migración completada!
   - Colecciones migradas: 36/36
   - Documentos totales: 1750

📍 Todos los datos están ahora en Firestore: awstests-71b14
```

⏱️ **Tiempo estimado:** 2-5 minutos

---

### Paso 4️⃣: Verificar en Firebase Console

1. Abre https://console.firebase.google.com/
2. Selecciona proyecto **awstests-71b14**
3. Ve a **Firestore Database** en el menú lateral
4. Verifica colecciones: `architectA1`, `architectA2`, etc.

---

## 🔒 Configurar Security Rules

Una vez migrados los datos:

1. En Firebase Console → **Firestore Database** → **Rules**
2. Reemplaza el contenido con:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer
    match /{collectionName}/documents {
      allow read: if request.auth != null;
      allow write: if false; // Solo lectura
    }
  }
}
```

3. Haz clic en **Publicar**

---

## 🛠️ Scripts disponibles

| Comando | Función |
|---------|---------|
| `npm run migrate:validate` | Valida credenciales antes de migrar |
| `npm run migrate:mongodb-to-firestore` | Ejecuta la migración completa |

---

## ❌ Troubleshooting

### ❌ "firebase-service-key.json not found"

**Solución:**
1. Ve a Firebase Console > awstests-71b14
2. Configuración (⚙️) > Cuentas de Servicio
3. Haz clic en "Generar nueva clave privada"
4. Guarda el archivo JSON como `scripts/firebase-service-key.json`

### ❌ "HTTP error! status: 401" (MongoDB)

**Causa:** La API Key de MongoDB ha expirado o es inválida

**Solución:**
- Ve a MongoDB Realm > API Keys
- Genera una nueva clave
- Actualiza el valor en `scripts/migrate-mongodb-to-firestore.js` (línea 14)

### ❌ "Error al conectar a Firestore"

**Solución:**
- Verifica que el archivo `firebase-service-key.json` es válido
- Comprueba que el `projectId` en el archivo es "awstests-71b14"
- Regenera la clave en Firebase Console

### ⚠️ La migración es lenta

**Nota:** Esto es normal. Firestore tiene límites de escritura. Si se detiene:
- Puedes reiniciar el script
- Solo remigra las colecciones que fallaron
- El script es idempotente (duplicados se overwritean con los mismos datos)

---

## 📝 Próximos pasos

Una vez completada la migración, actualiza el código:

1. ✅ Instalar Firestore SDK en la app
   ```bash
   npm install firebase
   ```

2. ✅ Reescribir `DataService` para usar Firestore
   - `src/app/services/data.service.ts`

3. ✅ Eliminar `MongoDataAuthService`
   - `src/app/services/mongo-data-auth.service.ts`

4. ✅ Limpiar environments
   - Remover variables MongoDB de `environment.ts`

5. ✅ Tests y validación

---

## 📞 ¿Necesitas ayuda?

- Revisa la guía detallada: `scripts/MIGRATION_GUIDE.md`
- Firebase Docs: https://firebase.google.com/docs/firestore/
- MongoDB Realm API: https://www.mongodb.com/docs/atlas/api/data-api/
