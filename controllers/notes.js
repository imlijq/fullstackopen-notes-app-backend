const notesRouter = require("express").Router(); // 创建了一个新的 router 对象
const Note = require("../models/note");
const logger = require("../utils/logger");

// 获取所有资源
notesRouter.get("/", (request, response) => {
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
notesRouter.get("/:id", (request, response, next) => {
    logger.info("request.params", request.params);

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
notesRouter.post("/", (request, response, next) => {
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
notesRouter.delete("/:id", (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

// 更新资源
notesRouter.put("/:id", (request, response, next) => {
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


module.exports = notesRouter;
