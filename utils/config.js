console.log("process.env.NODE_ENV", process.env.NODE_ENV); // 本地为undefined，heroku中被设置为production
if (process.env.NODE_ENV !== "production") {
    // 本地使用 .env 中的环境变量，heroku 中使用通过 heroku config:set 设置的环境变量
    require("dotenv").config();
}


const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports={
    PORT,
    MONGODB_URI,
}
