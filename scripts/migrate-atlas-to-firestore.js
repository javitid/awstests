#!/usr/bin/env node

/**
 * Direct migration from MongoDB Atlas to Firestore.
 *
 * Required environment variables (option A):
 * - MONGODB_URI: MongoDB Atlas connection string
 *
 * Required environment variables (option B, easier):
 * - MONGODB_USER: Atlas database username
 * - MONGODB_PASSWORD: Atlas database password
 * - MONGODB_HOST: Atlas host (default: cluster0.fzaja.mongodb.net)
 * - MONGODB_OPTIONS: URI query options (default: appName=Cluster0)
 * - MONGODB_DB: source database name (default: awstests)
 * - FIREBASE_SERVICE_KEY: path to Firebase service account json
 * - FIREBASE_PROJECT_ID: Firebase project id (default: awstests-71b14)
 *
 * Usage (A):
 * MONGODB_URI='mongodb+srv://...' \
 * MONGODB_DB='awstests' \
 * FIREBASE_SERVICE_KEY='./scripts/firebase-service-key.json' \
 * npm run migrate:atlas-to-firestore
 *
 * Usage (B):
 * MONGODB_USER='your_user' \
 * MONGODB_PASSWORD='your_password' \
 * npm run migrate:atlas-to-firestore
 */

const { MongoClient } = require('mongodb');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const QUESTIONARIES = [
  'architectA1', 'architectA2', 'architectA3', 'architectA4', 'architectA5', 'architectA6',
  'architectA-2023-1', 'architectA-2023-2', 'architectA-2023-3', 'architectA-2023-4', 'architectA-2023-5', 'architectA-2023-6',
  'architectP1', 'architectP2', 'architectP3', 'architectP4', 'architectP5', 'architectP6',
  'developerA1', 'developerA2', 'developerA3', 'developerA4', 'developerA5', 'developerA6',
  'practitioner1', 'practitioner2', 'practitioner3', 'practitioner4', 'practitioner5', 'practitioner6',
  'practitioner2020-1', 'practitioner2020-2', 'practitioner2020-3', 'practitioner2020-4', 'practitioner2020-5', 'practitioner2020-6'
];

function getConfig() {
  const serviceKeyPath = process.env.FIREBASE_SERVICE_KEY
    ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_KEY)
    : path.join(__dirname, 'firebase-service-key.json');

  const config = {
    mongodbUri: buildMongoUri(),
    mongodbDb: process.env.MONGODB_DB || 'awstests',
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'awstests-71b14',
    serviceKeyPath,
  };

  if (!config.mongodbUri) {
    throw new Error('Missing MongoDB config. Set MONGODB_URI or set MONGODB_USER and MONGODB_PASSWORD.');
  }

  if (!fs.existsSync(config.serviceKeyPath)) {
    throw new Error(
      `Firebase service key not found at ${config.serviceKeyPath}. ` +
      'Set FIREBASE_SERVICE_KEY or place scripts/firebase-service-key.json.'
    );
  }

  return config;
}

function buildMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;

  if (!user || !password) {
    return '';
  }

  const host = process.env.MONGODB_HOST || 'cluster0.fzaja.mongodb.net';
  const options = process.env.MONGODB_OPTIONS || 'appName=Cluster0';
  const safeUser = encodeURIComponent(user);
  const safePassword = encodeURIComponent(password);

  return `mongodb+srv://${safeUser}:${safePassword}@${host}/?${options}`;
}

function initializeFirebase(serviceKeyPath, projectId) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceKeyPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId,
  });
  return admin.firestore();
}

async function writeInBatches(firestore, collectionName, docs) {
  if (!docs.length) {
    return 0;
  }

  const MAX_BATCH_SIZE = 450;
  let written = 0;

  for (let i = 0; i < docs.length; i += MAX_BATCH_SIZE) {
    const chunk = docs.slice(i, i + MAX_BATCH_SIZE);
    const batch = firestore.batch();

    for (const rawDoc of chunk) {
      const doc = rawDoc && typeof rawDoc.toObject === 'function' ? rawDoc.toObject() : rawDoc;
      const mongoId = doc && doc._id ? String(doc._id) : undefined;
      const docId = mongoId || `${collectionName}_${i}_${written}`;
      const ref = firestore.collection(collectionName).doc(docId);

      if (doc && Object.prototype.hasOwnProperty.call(doc, '_id')) {
        delete doc._id;
      }

      batch.set(ref, doc);
      written += 1;
    }

    await batch.commit();
  }

  return written;
}

async function migrateAtlasToFirestore() {
  const config = getConfig();

  console.log('\nStarting Atlas -> Firestore migration\n');
  console.log(`MongoDB DB: ${config.mongodbDb}`);
  console.log(`Firebase project: ${config.firebaseProjectId}\n`);

  const firestore = initializeFirebase(config.serviceKeyPath, config.firebaseProjectId);
  const mongoClient = new MongoClient(config.mongodbUri);

  let totalDocs = 0;
  let okCollections = 0;

  try {
    await mongoClient.connect();
    const db = mongoClient.db(config.mongodbDb);

    for (const collectionName of QUESTIONARIES) {
      process.stdout.write(`- ${collectionName.padEnd(24)} `);
      try {
        const collection = db.collection(collectionName);
        const docs = await collection.find({}).toArray();
        const count = await writeInBatches(firestore, collectionName, docs);
        totalDocs += count;
        okCollections += 1;
        console.log(`OK (${count})`);
      } catch (error) {
        console.log(`ERROR (${error.message})`);
      }
    }

    console.log('\nMigration finished');
    console.log(`Collections migrated: ${okCollections}/${QUESTIONARIES.length}`);
    console.log(`Documents migrated: ${totalDocs}\n`);
  } finally {
    await mongoClient.close();
    await admin.app().delete();
  }
}

if (require.main === module) {
  migrateAtlasToFirestore().catch((error) => {
    console.error('\nMigration failed:', error.message);
    process.exit(1);
  });
}

module.exports = { migrateAtlasToFirestore };
