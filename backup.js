import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// ✅ اسم متغیر رو دقیقاً با فایل .env هماهنگ کردیم
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qeshm';

const backup = async () => {
  try {
    console.log('Connecting to:', MONGO_URI.split('@')[1] || 'Local DB');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const allData = {};

    for (let col of collections) {
      const data = await db.collection(col.name).find({}).toArray();
      allData[col.name] = data;
      console.log(`- Backed up ${col.name}: ${data.length} docs`);
    }

    fs.writeFileSync('backup-qeshm.json', JSON.stringify(allData, null, 2));
    console.log('🎉 Backup saved to backup-qeshm.json');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

backup();
