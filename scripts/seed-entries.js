const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const Entries = require('../src/models/Entries').default;

const userID = new mongoose.Types.ObjectId('68c95d128495255473b31cac');

async function seedEntries() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Remove all entries for this user before seeding
  await Entries.deleteMany({ userID });

  // Seed data for new schema: groups -> entries -> monthlyPaymentStatus
  const entryData = {
    userID,
    groups: [
      {
        name: 'Grade 1',
        entries: [
          {
            name: 'Alice',
            monthlyPaymentStatus: {
              1: true, 2: false, 3: true, 4: false, 5: false, 6: false,
              7: false, 8: false, 9: false, 10: false, 11: false, 12: false
            }
          },
          {
            name: 'Bob',
            monthlyPaymentStatus: {
              1: false, 2: true, 3: false, 4: true, 5: false, 6: false,
              7: false, 8: false, 9: false, 10: false, 11: false, 12: false
            }
          }
        ]
      },
      {
        name: 'Grade 2',
        entries: [
          {
            name: 'Charlie',
            monthlyPaymentStatus: {
              1: false, 2: false, 3: false, 4: false, 5: true, 6: true,
              7: false, 8: false, 9: false, 10: false, 11: false, 12: false
            }
          },
          {
            name: 'Daisy',
            monthlyPaymentStatus: {
              1: true, 2: true, 3: false, 4: false, 5: false, 6: false,
              7: false, 8: false, 9: false, 10: false, 11: false, 12: false
            }
          }
        ]
      }
    ]
  };

  // Use Mongoose instance to save
  const entryDoc = new Entries(entryData);
  await entryDoc.save();
  console.log('✅ Seeded grouped entries for user:', userID.toString());
  await mongoose.disconnect();
}

seedEntries().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
