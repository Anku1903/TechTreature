const mongoose = require('mongoose')
MONGO_USER="techassist"
MONGO_PASS="Ieeemongo@1903"
MONGO_DB="TechTreasure"
const connectDB=async()=>{
    try{await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.pj1hi.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true,
        useFindAndModify: false
    });

    console.log("DB connection established")
    }catch(error){
        console.log("DB connection not established")
    }
}

module.exports =connectDB;
