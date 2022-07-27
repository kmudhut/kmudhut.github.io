"use strict"

let addNewTaskButton;
let newTaskPopup;
let taskListWrapper;
let taskList;
let newTaskPopupForm;
let inputErrorsInfo;
let tasksTab = [];

document.addEventListener('DOMContentLoaded', () => {

    addNewTaskButton = document.getElementById('addNewTaskButton');
    newTaskPopup = document.getElementById('newTaskPopup');
    taskListWrapper = document.getElementById('taskListWrapper');
    newTaskPopupForm = document.getElementById('newTaskPopupForm');
    inputErrorsInfo = document.getElementsByClassName('inputErrorInfo');
    taskList = document.getElementById('taskList');

    addNewTaskButton.addEventListener('click', toggleNewTaskPopup);
    newTaskPopupForm.addEventListener('submit', addNewTask);

});

const toggleNewTaskPopup = () => {
    if (addNewTaskButton.style.opacity !== '0') {
        newTaskPopup.style.transform = 'translateY(0px)';
        taskListWrapper.style.height = 'calc(90% - 350px)';
        addNewTaskButton.style.opacity = '0';
        addNewTaskButton.disabled = true;
    }
    else {
        newTaskPopup.style.transform = 'translateY(350px)';
        taskListWrapper.style.height = '90%';
        addNewTaskButton.style.opacity = '1';
        addNewTaskButton.disabled = false;
    }
}

const generateTaskListDOM = (tasksTab)=> //podobno lepiej zamiast takiego inner HTML używać createElement i na piechotę - do sprawdzenia
{
    taskList.innerHTML = '';
    for(let task of tasksTab)
    {
        let li = document.createElement('li');
        let wrapperDivLeft = document.createElement('div');
        let div = document.createElement('div');
        let h6 = document.createElement('h6');
        let wrapperDivRight = document.createElement('div');
        let button = document.createElement('button');
        let doneIconSpan = document.createElement('span');

        li.classList.add('task');
        wrapperDivLeft.classList.add('task-info-wrapper');
        wrapperDivRight.classList.add('task-done-btn-wrapper');
        div.classList.add('task-info-tittle-wrapper');
        h6.classList.add('task-info-tittle');
        button.classList.add('task-done-btn');
        doneIconSpan.classList.add('material-symbols-outlined');

        if(task.deadlineDate || task.deadlineTime)
        {
            let badgeSpan = document.createElement('span');
            badgeSpan.classList.add('deadline-badge');
            
            let today = new Date(Date.now()).toISOString().slice(0,10);
            if(task.deadlineDate === today)
            {
                badgeSpan.innerText = 'Dzisiaj';
            }
            else{
                badgeSpan.innerText = task.deadlineDate;
            }

            badgeSpan.innerText+=` ${task.deadlineTime}`;
            div.appendChild(badgeSpan);
        }
        h6.innerText = task.title;
        div.appendChild(h6);
        wrapperDivLeft.appendChild(div);
        if(task.description.trim().length > 0)
        {
            let p = document.createElement('p');
            p.classList.add('task-info-desc');
            p.innerText = task.description;
            wrapperDivLeft.appendChild(p);
        }
        doneIconSpan.innerText = 'check_circle'
        button.appendChild(doneIconSpan);
        wrapperDivRight.appendChild(button);
        
        li.append(wrapperDivLeft, wrapperDivRight);
        taskList.appendChild(li);
}
}

const addNewTask = (event) => {
    event.preventDefault();

    if (event.target.elements[0].value.trim().length > 2) 
    {
        toggleNewTaskPopup();

        let task = {
            "title": event.target.elements[0].value,
            "description": event.target.elements[1].value,
            "deadlineDate": event.target.elements[2].value,
            "deadlineTime": event.target.elements[3].value,
            "done": false
        };
        tasksTab.push(task);

        generateTaskListDOM(tasksTab);

        console.log(tasksTab);
    }
    else{
        inputErrorsInfo[0].innerText = 'Tytuł powinien zawierać min. 3 znaki.';
        event.target.elements[0].classList.add('is-invalid');
    }


}