document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    document.getElementById('colorPicker').addEventListener('change', function(event) {
        document.documentElement.style.setProperty('--bgBtn', event.target.value);
        document.documentElement.style.setProperty('--bgBtnHover', shadeColor(event.target.value, -20));
    });
});

function toggleColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.style.display = colorPicker.style.display === 'block' ? 'none' : 'block';
}

function toggleInfo() {
    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = infoSection.style.display === 'block' ? 'none' : 'block';
}

function addTask(groupId) {
    const taskInput = document.querySelector(`#${groupId} .taskInput`);
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }
    const li = document.createElement("li");
    li.draggable = true;
    li.innerHTML = `${taskText} <button onclick="completeTask(this)">X</button>`;
    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragend', dragEnd);
    document.querySelector(`#${groupId} .taskList`).appendChild(li);
    taskInput.value = "";
    saveTasks();
}

function completeTask(button) {
    const li = button.parentElement;
    li.remove();
    saveTasks();
}

function dragStart(e) {
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    setTimeout(() => e.target.classList.add('hide'), 0);
}

function dragEnd(e) {
    e.target.classList.remove('hide');
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/html');
    const newLi = document.createElement('li');
    newLi.draggable = true;
    newLi.innerHTML = data;
    newLi.addEventListener('dragstart', dragStart);
    newLi.addEventListener('dragend', dragEnd);
    e.target.closest('.group').querySelector('.taskList').appendChild(newLi);
    const draggedTask = document.querySelector('.hide');
    if (draggedTask) {
        draggedTask.remove();
    }
    saveTasks();
}

function saveTasks() {
    const groups = document.querySelectorAll('.group');
    const tasks = {};
    groups.forEach(group => {
        const groupId = group.id;
        const taskList = group.querySelector('.taskList').innerHTML;
        tasks[groupId] = taskList;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        Object.keys(tasks).forEach(groupId => {
            document.querySelector(`#${groupId} .taskList`).innerHTML = tasks[groupId];
            document.querySelectorAll(`#${groupId} .taskList li`).forEach(li => {
                li.draggable = true;
                li.addEventListener('dragstart', dragStart);
                li.addEventListener('dragend', dragEnd);
            });
        });
    }
}

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}