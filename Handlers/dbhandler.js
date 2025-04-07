const mongoose = require('mongoose');
let db = null;


async function connectDB(mongoString) {
    try {
        console.log('attempting connection to the database:', {mongoString});
        db = await mongoose.connect(mongoString);
        if (db){
            console.info('Connected to database');
        }
    } catch (error) {
        console.error('error connecting to the database');
    }
}

module.exports={
    connectDB
};