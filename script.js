"use strict"

let addNewTaskButton;
let newTaskPopup;
let taskListWrapper;
let newTaskPopupForm;
let inputErrorsInfo;
let tasksTab = [];

document.addEventListener('DOMContentLoaded', () => {

    addNewTaskButton = document.getElementById('addNewTaskButton');
    newTaskPopup = document.getElementById('newTaskPopup');
    taskListWrapper = document.getElementById('taskListWrapper');
    newTaskPopupForm = document.getElementById('newTaskPopupForm');
    inputErrorsInfo = document.getElementsByClassName('inputErrorInfo');

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
        console.log(tasksTab);
    }
    else{
        inputErrorsInfo[0].innerText = 'Tytuł powinien zawierać min. 3 znaki.';
        event.target.elements[0].classList.add('is-invalid');
    }

   



}