const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.use((req, res, next) => { console.log(req.path); next(); })

//Exmple    
let todoList = [
    { "id": 1, "task": "ทำการบ้าน", "completed": false },
    { "id": 2, "task": "ออกกำลังกาย", "completed": true }
    ]    

//1.1 
app.get('/', (req,res) => {
    res.json(todoList)
})

//1.2 
app.get('/todos/:id', (req,res) => {
    const data = todoList.find((i) => i.id == req.params.id)
    if (data == undefined){
        res.json({message : 'ไม่พบงานบันทึกที่ระบุ'})
    }res.json(data)
})

//1.3
app.post('/todos', (req,res) => {
    const newTodo = { id: todoList.length + 1, ...req.body, completed: req.body.completed};
    todoList.push(newTodo);
    res.json(todoList);
})

//1.4
app.put('/todos/:id', (req, res) => {
    let data = todoList.find(i => i.id == req.params.id)
    data.task = req.body.task
    res.json(todoList)
})

//1.5
app.put('/todos/:id/status', (req, res) => {
    let data = todoList.find(i => i.id == req.params.id)
    data.completed = req.body.completed
    res.json(todoList)
})

//1.6
app.delete('/todos/:id', (req, res) => {
    const todoId = +req.params.id
    const originalLength = todoList.length
    todoList = todoList.filter(i => i.id !== todoId)
    res.json({ message: todoList.length < originalLength ? 'ลบงานสำเร็จ' : 'ไม่พบงานบันทึกที่ระบุ' })
})

//1.7
app.get("/todos/completed", (req, res) => {
    const completedTodos = todoList.filter(todo => todo.completed)
    res.json(completedTodos)
})

//1.8
app.get("/todos/pending", (req, res) => {
    const completedTodos = todoList.filter(todo => !todo.completed)
    res.json(completedTodos)
})

//1.9
app.delete('/todos/completed', (req, res) => {
    const originalLength = todoList.length;
    todoList = todoList.filter(todo => !todo.completed);
    res.json({ 
        message: todoList.length < originalLength 
            ? 'ลบงานที่เสร็จแล้วทั้งหมดสำเร็จ' 
            : 'ไม่มีงานที่เสร็จแล้วให้ลบ'
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
//1.10
app.get('/todos/search', (req, res) => {
    let result = todoList.filter(i => i.task.includes (req.query.query))
    if (result.length == 0) res.send({ "message": "ไม่พบบันทึกงานที่ระบุ" })
    else res.send(result)
})