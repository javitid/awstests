#!/usr/bin/env node

/**
 * Validación de credenciales antes de migración
 * 
 * Verifica que:
 * - Firebase Service Account Key es válida
 * - MongoDB Realm API funciona (si no esta en EOL)
 * - Tienes acceso a ambos servicios
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const MONGODB_CONFIG = {
  apiKey: 'wqpWulczRnpjjlxT6l63Zcc8ySV9mTB9VuRuxgcvARxFkILvNZuMDUpdyLUGxdF9',
  urlBearerToken: 'https://eu-west-2.aws.realm.mongodb.com/api/client/v2.0/app/data-iuwtk/auth/providers/api-key/login',
  urlPostQuestionaries: 'https://eu-west-2.aws.data.mongodb-api.com/app/data-iuwtk/endpoint/data/v1/action/find'
};

async function validateFirebase() {
  console.log('🔍 Validando Firebase...');
  
  const serviceKeyPath = path.join(__dirname, 'firebase-service-key.json');
  
  if (!fs.existsSync(serviceKeyPath)) {
    console.log('❌ firebase-service-key.json no encontrado');
    console.log('   Descárgalo desde Firebase Console > Configuración > Cuentas de Servicio\n');
    return false;
  }

  try {
    const serviceAccount = require(serviceKeyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'awstests-71b14'
    });

    const firestore = admin.firestore();
    await firestore.collection('_test_').doc('_test_').set({ test: true });
    await firestore.collection('_test_').doc('_test_').delete();
    
    console.log('✅ Firebase: OK');
    await admin.app().delete();
    return true;
  } catch (error) {
    console.log('❌ Firebase: Error -', error.message);
    return false;
  }
}

async function validateMongoDB() {
  console.log('🔍 Validando MongoDB Realm...');
  
  try {
    // Obtener token
    const response = await fetch(MONGODB_CONFIG.urlBearerToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: MONGODB_CONFIG.apiKey })
    });

    if (!response.ok) {
      const body = await response.text();
      if (response.status === 410 || body.includes('have reached EOL')) {
        console.log('❌ MongoDB Realm: EOL detectado');
        console.log('   Atlas App Services/Device Sync ya no esta disponible para este endpoint.');
        console.log('   Usa migracion directa Atlas -> Firestore con:');
        console.log('   npm run migrate:atlas-to-firestore\n');
        return false;
      }

      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const token = `Bearer ${data.access_token}`;

    // Probar con una colección pequeña
    const testResponse = await fetch(MONGODB_CONFIG.urlPostQuestionaries, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        database: 'awstests',
        collection: 'architectA1'
      })
    });

    if (!testResponse.ok) {
      throw new Error(`HTTP ${testResponse.status}`);
    }

    const testData = await testResponse.json();
    const docCount = testData.documents?.length || 0;
    
    console.log(`✅ MongoDB Realm: OK (${docCount} documentos en architectA1)`);
    return true;
  } catch (error) {
    console.log('❌ MongoDB Realm: Error -', error.message);
    return false;
  }
}

async function validate() {
  console.log('\n═══════════════════════════════════════');
  console.log('  Validación de credenciales');
  console.log('═══════════════════════════════════════\n');

  const firebaseOk = await validateFirebase();
  const mongodbOk = await validateMongoDB();

  console.log('\n═══════════════════════════════════════');
  
  if (firebaseOk && mongodbOk) {
    console.log('✨ ¡Todo esta listo para migrar!');
    console.log('\nEjecuta:');
    console.log('  node scripts/migrate-mongodb-to-firestore.js\n');
    process.exit(0);
  } else {
    console.log('❌ Hay problemas. Revisa los errores arriba.\n');
    console.log('Si MongoDB Realm esta en EOL, usa: npm run migrate:atlas-to-firestore\n');
    process.exit(1);
  }
}

if (require.main === module) {
  validate().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}
