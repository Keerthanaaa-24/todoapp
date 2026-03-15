const API = "/tasks";


// LOAD TASKS
async function loadTasks() {

    const res = await fetch(API);
    const tasks = await res.json();

    const list = document.getElementById("taskList");

    if(!list) return;

    list.innerHTML = "";

    tasks.forEach(task => {

        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
        <span class="${task.completed ? "completed":""}">
        ${task.title}
        </span>

        <div>
        <input type="checkbox" ${task.completed ? "checked":""}
        onchange="toggleComplete('${task._id}',this.checked)">

        <button onclick="editTask('${task._id}')">Edit</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
        </div>
        `;

        list.appendChild(div);
    });
}


async function toggleComplete(id,completed){

await fetch(`${API}/${id}`,{
method:"PUT",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({completed})
})

loadTasks()
}


function editTask(id){
window.location=`edit.html?id=${id}`
}


async function deleteTask(id){

await fetch(`${API}/${id}`,{
method:"DELETE"
})

loadTasks()
}


const form = document.getElementById("taskForm");

if(form){

form.addEventListener("submit",async e=>{

e.preventDefault()

const title = document.getElementById("title").value
const description = document.getElementById("description").value

await fetch(API,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({title,description})
})

window.location="index.html"

})

}


loadTasks()