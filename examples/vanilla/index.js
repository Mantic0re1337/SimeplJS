import { h }from "../../packages/runtime/src/h.js";
import { mountDom } from "../../packages/runtime/src/mount-dom.js";


const todos = ["Walk the dog", "Water the plants", "go to work"]

const addTodoInput = document.getElementById("new_todo")
const addTodoButton = document.getElementById("add_todo")
const todoList = document.getElementById("todo_list")

const vdom = h("p", {}, ["GOTCHA"]);
const vbody = document.body;
mountDom(vdom, vbody);

for(const todo of todos)
{
    todoList.append(renderTodoInReadMode(todo))
}

addTodoInput.addEventListener("input", () => {
    addTodoButton.disabled = addTodoInput.value.length < 3
})

addTodoInput.addEventListener("keydown", ({key}) => {
    if(key === "Enter" && addTodoInput.value.length >= 3)
    {
        addTodo()
    }
})

addTodoButton.addEventListener("click", () =>
    {
        addTodo()
    }
)

// Functions
function renderTodoInReadMode(todo) {
    const li = document.createElement("li")
    const span = document.createElement("span")
    const button = document.createElement("button")

    span.textContent = todo
    span.addEventListener("dblclick", () => {
        const idx = todos.indexOf(todo)

        todoList.replaceChild(renderTodoInEditMode(todo), todoList.childNodes[idx])
        }
    )
    li.append(span)

    button.textContent = "Done"
    button.addEventListener("click", () => {
        const idx = todos.indexOf(todo)
        removeTodo(idx)
    })
    li.append(button)

    return li
}
function addTodo() {
    const description = addTodoInput.value
    todos.push(description)

    const todo = renderTodoInReadMode(description)
    todoList.append(todo)

    addTodoButton.value = ""
    addTodoButton.disabled = true
}

function removeTodo(index) {
    todos.splice(index, 1)
    todoList.childNodes[index].remove()
}


function renderTodoInEditMode(todo){
    const li = document.createElement("li")
    const input = document.createElement("input")
    input.type = "text"
    input.value = todo
    li.append(input)
    const saveButton = document.createElement("button")
    const cancelButton = document.createElement("button")

    input.textContent = todo
    saveButton.textContent = "Save"
    cancelButton.textContent = "Cancel"

    input.addEventListener("input", () => {
        addTodoButton.disabled = input.value.length < 3
    })

    input.addEventListener("keydown", ({key}) => {
        if(key === "Enter" && input.value.length >= 3)
        {
            const idx = todos.indexOf(todo)
            updateTodo(idx, input.value)
        }
    })

    saveButton.addEventListener("click", () =>
    {
        if(input.value.length >= 3)
        {
            const idx = todos.indexOf(todo)
            updateTodo(idx, input.value)
        }
    })

    cancelButton.addEventListener("click", () => {
        const idx = todos.indexOf(todo)
        todoList.replaceChild(renderTodoInReadMode(todo), todoList.childNodes[idx])
    })
    li.append(saveButton)
    li.append(cancelButton)

    return li
}

function updateTodo(index, description) {
    todos[index] = description
    const todo = renderTodoInReadMode(description)
    todoList.replaceChild(todo, todoList.childNodes[index])
}

