
const app = require("./app");

const dotenv = require("dotenv")
const connectDatabase = require("./config/database");
dotenv.config()
// handling uncaught exceptions

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught exceptions`);
    process.exit(1);
})

// config
dotenv.config({path:"backend/config/config.env"});

// connecting database

connectDatabase();

 const server =  app.listen(process.env.PORT,()=>{

    console.log(`server is working on http://localhost:${process.env.PORT}`);

});

// unhandled promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled promise Rejection`);

    server.close(()=>{
        process.exit(1);
    });

});