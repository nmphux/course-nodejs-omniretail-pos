const mongoose = require('mongoose');

const legacyAssetPathMigrations = [
  {
    collection: 'products',
    field: 'image',
    oldPrefix: '/images/pdThumbs/',
    newPrefix: '/uploads/product_thumb/',
  },
  {
    collection: 'products',
    field: 'barcodeImg',
    oldPrefix: '/images/barcode/',
    newPrefix: '/uploads/barcode/',
  },
  {
    collection: 'users',
    field: 'avtImage',
    oldPrefix: '/images/avatar/',
    newPrefix: '/uploads/avatar/',
  },
];

const migrateLegacyAssetPaths = async (database) => {
  let migratedCount = 0;

  for (const migration of legacyAssetPathMigrations) {
    const { collection, field, oldPrefix, newPrefix } = migration;
    const result = await database.collection(collection).updateMany(
      { [field]: { $regex: `^${oldPrefix}` } },
      [
        {
          $set: {
            [field]: {
              $replaceOne: {
                input: `$${field}`,
                find: oldPrefix,
                replacement: newPrefix,
              },
            },
          },
        },
      ],
    );
    migratedCount += result.modifiedCount;
  }

  if (migratedCount > 0) {
    console.log(`Migrated ${migratedCount} legacy asset path(s).`);
  }
};

const connect = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/omniretail_db';
  await mongoose.connect(mongoURI);
  await migrateLegacyAssetPaths(mongoose.connection.db);
  console.log('\nConnect to DB successfully !!!');
};

module.exports = { connect, migrateLegacyAssetPaths };
