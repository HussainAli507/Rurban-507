
const mongoose = require("mongoose");

const connectDatabase = () =>{

    mongoose.connect(`mongodb+srv://rurbanadmin:${process.env.adminPassword}@cluster0.tbqlijo.mongodb.net/test`,{useNewUrlParser:true}).then((data)=>{

        console.log(`mongodb connected with server:${data.connection.host}`);
        
        });
     
};

module.exports = connectDatabase





