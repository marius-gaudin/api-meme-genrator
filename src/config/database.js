import mongoose from 'mongoose'

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@memegenerator.iljt3fm.mongodb.net/memeGenerator?retryWrites=true&w=majority`)
    .then(() => console.log('✅ Successfully connected to the database'))
    .catch((e) => console.log(`⛔️ Error during database connection ${e}`))