require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { setupDatabase } = require('../db');

setupDatabase()
  .then(() => {
    console.log('Database setup complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database setup failed:', err);
    process.exit(1);
  });
