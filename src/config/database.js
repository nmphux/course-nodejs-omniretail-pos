const mongoose = require('mongoose');

const connect = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/omniretail_db';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('\nConnect to DB successfully !!!');
  } catch (error) {
    console.log('\nConnect to DB failed !!!');
    console.log(error);
  }
};

module.exports = { connect };