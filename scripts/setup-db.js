const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/feez-db';

async function setupDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    
    // Create Users collection with indexes
    console.log('📁 Setting up Users collection...');
    await db.collection('users').createIndex({ user: 1 }, { unique: true });
    console.log('✅ Created unique index on users.user (username/email)');

    // Create Entries collection with indexes  
    console.log('📁 Setting up Entries collection...');
    await db.collection('entries').createIndex({ userID: 1 });
    console.log('✅ Created index on entries.userID');

    // Verify collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log('📋 Available collections:', collectionNames);
    
    // Display schema information
    console.log('\n📊 Database Schema:');
    console.log('🔹 Users Collection:');
    console.log('   - _id (ObjectId) - userID');
    console.log('   - userName (String) - Display name');
    console.log('   - user (String) - Username/Email (unique)');
    console.log('   - password (String) - Hashed password');
    console.log('   - createdAt/updatedAt (Date)');
    
    console.log('🔹 Entries Collection:');
    console.log('   - userID (ObjectId) - Reference to user');
    console.log('   - [entryName] (Object) - Dynamic student names');
    console.log('     └── monthlyPaymentStatus (Object)');
    console.log('         ├── 1-12 (Boolean) - Payment status for each month');
    console.log('   - createdAt/updatedAt (Date)');

    console.log('\n✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupDatabase();
