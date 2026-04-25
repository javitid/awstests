# Migración de MongoDB a Firestore

Este documento guía la migración de todas las preguntas de AWS desde MongoDB Realm a Google Cloud Firestore.

## 📋 Requisitos

- Node.js 18+
- Acceso a Firebase Console (proyecto: awstests-71b14)
- Credenciales de MongoDB Realm (ya las tienes)

## 🔑 Paso 1: Obtener Firebase Service Account Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto **awstests-71b14**
3. Abre **Configuración del Proyecto** (icono de engranaje en la parte superior)
4. Ve a la pestaña **Cuentas de Servicio**
5. Haz clic en **Generar nueva clave privada**
6. Se descargará un archivo JSON
7. Renómbralo a `firebase-service-key.json` y guárdalo en la carpeta `scripts/`

Ejemplo de ruta final:
```
awstests/
└── scripts/
    └── firebase-service-key.json
```

## 🚀 Paso 2: Ejecutar la migración

```bash
node scripts/migrate-mongodb-to-firestore.js
```

El script hará automáticamente:
- ✅ Conectar a MongoDB Realm con tu API Key
- ✅ Descargar todas las 36 colecciones de preguntas
- ✅ Importar los documentos a Firestore
- ✅ Mostrar un resumen con el número de documentos migrados

Ejemplo de salida:
```
🚀 Iniciando migración MongoDB → Firestore

🔧 Conectando a Firestore...
✅ Conectado a Firestore

🔓 Obteniendo token de MongoDB Realm...
✅ Token obtenido

📦 Migrando colecciones:

   ⏳ architectA1                    ✅ 65 documentos
   ⏳ architectA2                    ✅ 50 documentos
   ⏳ architectA3                    ✅ 48 documentos
   ...
   
✨ Migración completada!
   - Colecciones migradas: 36/36
   - Documentos totales: 1750

📍 Todos los datos están ahora en Firestore: awstests-71b14
```

## 📊 Verificar la migración en Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona **awstests-71b14**
3. Abre **Firestore Database** en el menú lateral
4. Verifica que aparecen las colecciones: `architectA1`, `architectA2`, etc.

## 🔒 Configurar Security Rules en Firestore

Una vez migrados los datos, configura las reglas de seguridad:

1. En Firebase Console, ve a **Firestore Database** > **Rules**
2. Reemplaza el contenido con esto:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer las colecciones de preguntas
    match /{collectionName}/documents {
      allow read: if request.auth != null;
      allow write: if false; // Solo lectura
    }
  }
}
```

3. Haz clic en **Publicar**

## ⚠️ Troubleshooting

### Error: "firebase-service-key.json not found"
- Descarga la clave desde Firebase Console (paso 1)
- Guárdala en la carpeta `scripts/`

### Error: "HTTP error! status: 401" de MongoDB
- Verifica que el mongoDBApiKey en environment.local.ts es correcto
- La API Key tiene fecha de expiración; si es antigua, pide una nueva en MongoDB Realm

### Error: "Unauthorized" de Firestore
- Verifica que la clave de servicio es válida
- Que el projectId en firebase-service-key.json es "awstests-71b14"

## 📝 Próximos pasos

Una vez completada la migración:

1. ✅ Instalar Firestore SDK en la app
2. ✅ Reescribir `DataService` para usar Firestore en lugar de MongoDB
3. ✅ Remover `MongoDataAuthService` (ya no necesaria)
4. ✅ Actualizar `environment.ts` para eliminar variables MongoDB
5. ✅ Tests y validación en desarrollo

## 🔗 Referencias

- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [MongoDB Data API](https://www.mongodb.com/docs/atlas/api/data-api/)
