
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
   console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
console.log(process.argv);
// [ 'D:\\nodejs\\node.exe','C:\\Users\\alphabet\\Desktop\\notes-app-backend\\mongo.js','12345' ]

const url =
  `mongodb+srv://mongodb_user_01:${password}@cluster0.tt38q.mongodb.net/note-app?retryWrites=true`

// 建立与数据库的连接
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// 在建立到数据库的连接之后，我们为一个便笺定义模式schema和匹配的模型model
// 首先，定义了存储在 noteSchema 变量中的便笺的模式。 模式告诉 Mongoose 如何将 note 对象存储在数据库中。
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})
// 在 Note 模型定义中，第一个 "Note"参数是模型的单数名。 集合的名称将是小写的复数 notes，因为Mongoose 约定是当模式以单数(例如Note)引用集合时自动将其命名为复数(例如notes)。
const Note = mongoose.model('Note', noteSchema)

// Note.find({
//     important:true,
// }).then((result) => {
//     // result 会返回数据库中所有结果
//     result.forEach((note) => {
//         console.log("note1", note);
//     });
//     mongoose.connection.close();
// });

// 使用 Note 模型创建一个新的对象
// 模型是所谓的构造函数constructor function，它根据提供的参数创建新的 JavaScript 对象。 由于对象是使用模型的构造函数创建的，因此它们具有模型的所有属性，其中包括将对象保存到数据库的方法。
// const note = new Note({
//   content: 'HTML is Easy',
//   date: new Date(),
//   important: true,
// })

// 将对象保存到数据库是通过恰当命名的 save 方法实现的，可以通过 then 方法提供一个事件处理程序
// 当对象保存到数据库时，将调用提供给该对象的事件处理。 事件处理程序使用命令代码 mongoose.connection.close()关闭数据库连接。 如果连接没有关闭，程序将永远不能完成它的执行。
// note.save().then(result => {
//   // 保存的结果 result：{ _id: '5f4e4246ebc8df5d58e4e1ce', content: 'HTML is Easy', date: '2020-09-01T12:44:54.968Z', important: true, __v: 0 }
//   console.log('note saved!', result);
//   mongoose.connection.close()
// })


