const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
    .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connection to MongoDB:", error.message);
    });

app.use(cors()); // 允许所有来源的请求
app.use(express.static("build"));
app.use(express.json()); // 如果没有 json-parser，post 请求的 body 属性将是undefined的。 json-parser 的功能是获取请求的 JSON 数据，将其转换为 JavaScript 对象，然后在调用路由处理程序之前将其附加到请求对象的 body 属性。
app.use(middleware.requestLogger);

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});
app.use("/api/notes", notesRouter); // /api/notes 所有请求都使用 notesRouter 中间件处理

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
