console.log("process.env.NODE_ENV", process.env.NODE_ENV); // 本地为undefined，heroku中被设置为production

if (process.env.NODE_ENV !== "production") {
    // 本地使用 .env 中的环境变量，heroku 中使用通过 heroku config:set 设置的环境变量
    require("dotenv").config();
}

const express = require("express");
const app = express();
const Note = require("./models/note.js");
const cors = require("cors");

const logger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};

app.use(express.static("build"));
// 如果没有 json-parser，post 请求的 body 属性将是undefined的。 json-parser 的功能是获取请求的 JSON 数据，将其转换为 JavaScript 对象，然后在调用路由处理程序之前将其附加到请求对象的 body 属性。
app.use(express.json());
app.use(cors()); // 允许所有来源的请求
app.use(logger);

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

// 获取所有
app.get("/api/notes", (request, response) => {
    // response.json(notes);

    Note.find({}).then((notes) => {
        // console.log("all notes", notes);
        // [
        //     {
        //         _id: 5f4e2e1c3feffd1ba0e052b9,
        //         content: 'HTML is Easy',
        //         date: '2020-09-01T11:18:52.059Z',
        //         important: true,
        //         __v: 0
        //     },
        //     ...
        // ]

        // mongoose 返回的 notes 对象数组，当 response 以 JSON 格式返回，数组中的对象被修改后的 toJSON 方法会通过 JSON.stringify 自动调用
        response.json(notes);
    });
});

// 获取单个资源
app.get("/api/notes/:id", (request, response, next) => {
    console.log("request.params", request.params);

    Note.findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note);
            } else {
                // null
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

// 新增资源
app.post("/api/notes", (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });

    note.save()
        .then((savedNote) => savedNote.toJSON())
        .then((savedAndFormattedNote) => {
            response.json(savedAndFormattedNote);
        })
        .catch((error) => next(error));
});

// 删除单个资源
app.delete("/api/notes/:id", (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

// 更新资源
app.put("/api/notes/:id", (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important,
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then((updatedNote) => {
            response.json(updatedNote);
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
    console.log("unknownEndpoint中间件");
    response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log("errorHandler中间件");
    console.error(error.message, "--", error.name, "--", error.kind);

    if (error.name === "CastError" && error.kind === "ObjectId") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
