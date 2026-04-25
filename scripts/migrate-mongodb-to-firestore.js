#!/usr/bin/env node

/**
 * MongoDB to Firestore Migration Script
 * 
 * Este script migra todas las colecciones de preguntas de MongoDB Realm a Firestore
 * 
 * Uso:
 *   node scripts/migrate-mongodb-to-firestore.js
 * 
 * Requisitos:
 *   1. Firebase Service Account Key en: ./scripts/firebase-service-key.json
 *   2. Variables en environment.local.ts con credenciales MongoDB Realm
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Colecciones a migrar (desde src/app/config/constants.ts)
const QUESTIONARIES = [
  'architectA1', 'architectA2', 'architectA3', 'architectA4', 'architectA5', 'architectA6',
  'architectA-2023-1', 'architectA-2023-2', 'architectA-2023-3', 'architectA-2023-4', 'architectA-2023-5', 'architectA-2023-6',
  'architectP1', 'architectP2', 'architectP3', 'architectP4', 'architectP5', 'architectP6',
  'developerA1', 'developerA2', 'developerA3', 'developerA4', 'developerA5', 'developerA6',
  'practitioner1', 'practitioner2', 'practitioner3', 'practitioner4', 'practitioner5', 'practitioner6',
  'practitioner2020-1', 'practitioner2020-2', 'practitioner2020-3', 'practitioner2020-4', 'practitioner2020-5', 'practitioner2020-6'
];

// Credenciales MongoDB Realm
const MONGODB_CONFIG = {
  apiKey: 'wqpWulczRnpjjlxT6l63Zcc8ySV9mTB9VuRuxgcvARxFkILvNZuMDUpdyLUGxdF9',
  urlBearerToken: 'https://eu-west-2.aws.realm.mongodb.com/api/client/v2.0/app/data-iuwtk/auth/providers/api-key/login',
  urlPostQuestionaries: 'https://eu-west-2.aws.data.mongodb-api.com/app/data-iuwtk/endpoint/data/v1/action/find'
};

// Inicializar Firebase Admin
async function initializeFirebase() {
  const serviceKeyPath = path.join(__dirname, 'firebase-service-key.json');
  
  if (!fs.existsSync(serviceKeyPath)) {
    console.error('❌ Error: No se encontró firebase-service-key.json');
    console.error('   Pasos:');
    console.error('   1. Ve a Firebase Console > awstests-71b14');
    console.error('   2. Proyecto Settings > Service Accounts > Generate New Private Key');
    console.error('   3. Guarda el archivo como: scripts/firebase-service-key.json');
    process.exit(1);
  }

  const serviceAccount = require(serviceKeyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'awstests-71b14'
  });

  return admin.firestore();
}

// Obtener token de autenticación de MongoDB Realm
async function getMongoDBToken() {
  try {
    const response = await fetch(MONGODB_CONFIG.urlBearerToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: MONGODB_CONFIG.apiKey })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return `Bearer ${data.access_token}`;
  } catch (error) {
    console.error('❌ Error al obtener token de MongoDB Realm:', error);
    throw error;
  }
}

// Descargar documentos de una colección desde MongoDB
async function downloadFromMongoDB(collectionName, token) {
  try {
    const requestBody = {
      dataSource: 'Cluster0',
      database: 'awstests',
      collection: collectionName
    };

    const response = await fetch(MONGODB_CONFIG.urlPostQuestionaries, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error(`❌ Error descargando ${collectionName}:`, error);
    throw error;
  }
}

// Importar documentos a Firestore
async function importToFirestore(firestore, collectionName, documents) {
  if (!documents || documents.length === 0) {
    console.log(`   ⚠️  No hay documentos para ${collectionName}`);
    return 0;
  }

  const batch = firestore.batch();
  const collectionRef = firestore.collection(collectionName);

  for (const doc of documents) {
    // Usar _id de MongoDB como ID del documento en Firestore
    const docId = doc._id?.$oid || doc._id || `doc_${Date.now()}_${Math.random()}`;
    const docRef = collectionRef.doc(docId);
    
    // Remover _id para evitar duplicados
    const { _id, ...data } = doc;
    batch.set(docRef, data);
  }

  await batch.commit();
  return documents.length;
}

// Ejecutar migración
async function migrate() {
  console.log('\n🚀 Iniciando migración MongoDB → Firestore\n');

  try {
    // Inicializar Firebase
    console.log('🔧 Conectando a Firestore...');
    const firestore = await initializeFirebase();
    console.log('✅ Conectado a Firestore\n');

    // Obtener token de MongoDB
    console.log('🔓 Obteniendo token de MongoDB Realm...');
    const token = await getMongoDBToken();
    console.log('✅ Token obtenido\n');

    // Migrar cada colección
    console.log('📦 Migrando colecciones:\n');
    let totalDocuments = 0;
    const migratedCollections = [];

    for (const collectionName of QUESTIONARIES) {
      try {
        process.stdout.write(`   ⏳ ${collectionName.padEnd(30)}`);
        
        // Descargar de MongoDB
        const documents = await downloadFromMongoDB(collectionName, token);
        
        // Importar a Firestore
        const count = await importToFirestore(firestore, collectionName, documents);
        
        totalDocuments += count;
        migratedCollections.push(collectionName);
        console.log(`✅ ${count} documentos`);
        
      } catch (error) {
        console.log(`❌ Error`);
      }
    }

    // Resumen
    console.log(`\n✨ Migración completada!`);
    console.log(`   - Colecciones migradas: ${migratedCollections.length}/${QUESTIONARIES.length}`);
    console.log(`   - Documentos totales: ${totalDocuments}`);
    console.log(`\n📍 Todos los datos están ahora en Firestore: awstests-71b14`);

    await admin.app().delete();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error fatal en migración:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  migrate().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { migrate };
