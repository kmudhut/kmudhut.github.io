"use strict"

let addNewTaskButton;
let newTaskPopup;
let taskListWrapper;
let taskList;
let newTaskPopupForm;
let inputErrorsInfo;
let tasksTab = [];
let taskListPlaceholderEmpty, taskListPlaceholderDone;

document.addEventListener('DOMContentLoaded', () => {

    addNewTaskButton = document.getElementById('addNewTaskButton');
    newTaskPopup = document.getElementById('newTaskPopup');
    taskListWrapper = document.getElementById('taskListWrapper');
    newTaskPopupForm = document.getElementById('newTaskPopupForm');
    inputErrorsInfo = document.getElementsByClassName('inputErrorInfo');
    taskList = document.getElementById('taskList');
    taskListPlaceholderEmpty = document.getElementById('taskListPlaceholderEmpty');
    taskListPlaceholderDone = document.getElementById('taskListPlaceholderDone');

    if(localStorage.getItem('todoList'))
    {
        if(JSON.parse(localStorage.getItem('todoList')).length > 0)
        {
            tasksTab = JSON.parse(localStorage.getItem('todoList'));
            taskListPlaceholderEmpty.style.display = 'none';
            generateTaskListDOM(tasksTab);
        }
    }
    else{
        tasksTab = [];
    }
    

    addNewTaskButton.addEventListener('click', toggleNewTaskPopup);
    newTaskPopupForm.addEventListener('submit', addNewTask);

});

const toggleNewTaskPopup = () => {
        
    if (addNewTaskButton.style.opacity !== '0') {
        setTimeout(()=>{ //newTaskPopupForm.elements[0].focus();
            [...newTaskPopupForm.elements].forEach((elem)=>
            {
                elem.tabIndex = "0";
            })
        
        }, 400);
        newTaskPopup.style.transform = 'translateY(0px)';
        taskListWrapper.style.height = 'calc(90% - 350px)';
        addNewTaskButton.style.opacity = '0';
        addNewTaskButton.disabled = true;
    }
    else {
        [...newTaskPopupForm.elements].forEach((elem)=>
        {
            elem.tabIndex = "-1";
            elem.blur();
        })
        newTaskPopup.style.transform = 'translateY(350px)';
        taskListWrapper.style.height = '90%';
        addNewTaskButton.style.opacity = '1';
        addNewTaskButton.disabled = false;
    }
}

const generateTaskListDOM = (tasksTab)=> //podobno lepiej zamiast takiego inner HTML używać createElement i na piechotę - do sprawdzenia
{

    [...taskList.getElementsByTagName('button')].forEach((elem)=>{
        elem.removeEventListener('click',removeTask);
        elem.removeEventListener('click',toggleTaskIsDone);
    });
    [...taskList.getElementsByTagName('li')].forEach((elem)=>{
        elem.remove();
    });
    taskListPlaceholderEmpty.style.display = 'none';
    taskListPlaceholderDone.style.display = 'none';
    taskListPlaceholderDone.style.opacity = '0';
    //taskList.innerHTML = '';
    
    
    tasksTab.forEach((task, index) =>
    {
        let li = document.createElement('li');
        let wrapperDivLeft = document.createElement('div');
        let div = document.createElement('div');
        let h6 = document.createElement('h6');
        let p = document.createElement('p');
        let wrapperDivRight = document.createElement('div');
        let button = document.createElement('button');
        let doneIconSpan = document.createElement('span');
        let badgeSpan = document.createElement('span');

        

        li.classList.add('task');
        li.dataset.taskId = index;
        wrapperDivLeft.classList.add('task-info-wrapper');
        wrapperDivRight.classList.add('task-done-btn-wrapper');
        div.classList.add('task-info-tittle-wrapper');
        h6.classList.add('task-info-tittle');
        button.classList.add('task-done-btn');
        button.addEventListener('click', toggleTaskIsDone);
        doneIconSpan.classList.add('material-symbols-outlined');

        if(task.deadlineDate || task.deadlineTime)
        {
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
        doneIconSpan.innerText = 'circle';
        if(task.done) 
        {
            div.style.textDecoration = 'line-through';
            p.style.textDecoration = 'line-through';
            if(task.deadlineDate || task.deadlineTime) badgeSpan.classList.add('deadline-badge-done');
            div.style.color = 'gray';
            p.style.color = 'gray';

            doneIconSpan.innerText = 'task_alt';
            let rmvbutton = document.createElement('button');
            let rmvspan = document.createElement('span');
            rmvbutton.classList.add('task-done-btn');
            rmvspan.classList.add('material-symbols-outlined');
            rmvspan.innerText = 'delete';
            rmvspan.style.color = '#dc3545';
            rmvbutton.addEventListener('click', removeTask);
            rmvbutton.appendChild(rmvspan);
            wrapperDivRight.appendChild(rmvbutton);
            wrapperDivLeft.classList.add('done-task-info-wrapper');
        }
        wrapperDivLeft.appendChild(div);
        if(task.description.trim().length > 0)
        {
            p.classList.add('task-info-desc');
            p.innerText = task.description;
            wrapperDivLeft.appendChild(p);
        }

        button.appendChild(doneIconSpan);
  
        wrapperDivRight.appendChild(button);
        li.append(wrapperDivLeft, wrapperDivRight);
        taskList.appendChild(li);
        localStorage.setItem('todoList', JSON.stringify(tasksTab));
})
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
        setTimeout(resetForm, 400);
        


    }
    else{
        inputErrorsInfo[0].innerText = 'Tytuł powinien zawierać min. 3 znaki.';
        event.target.elements[0].classList.add('is-invalid');
    }
}

const toggleTaskIsDone = (event) =>
{
   let index = event.target.parentElement.parentElement.parentElement.dataset.taskId;
   if(tasksTab[index].done == false)
   {
    tasksTab[index].done = true;
   }
   else{
    tasksTab[index].done = false;
   }
   generateTaskListDOM(tasksTab);
}

const removeTask = (event) =>
{
    let index = event.target.parentElement.parentElement.parentElement.dataset.taskId;
    event.target.parentElement.parentElement.parentElement.addEventListener('transitionend', ()=>
    {
        tasksTab.splice(index,1);
        generateTaskListDOM(tasksTab);
        if(tasksTab.length === 0)
        {
            localStorage.setItem('todoList', JSON.stringify(tasksTab));
            taskListPlaceholderDone.style.display = 'flex';
            setTimeout(()=>{
                taskListPlaceholderDone.style.opacity = '1';
            }, 10);

            // let div = document.createElement('div');
            // let img = document.createElement('img');
            // let h2 = document.createElement('h2');
            // let h6 = document.createElement('h6');

            // div.classList.add('task-list-placeholder-done');
            // img.src = './images/sunbathing.png';
            // h2.innerText = 'Wszystko zrobione!';
            // h6.innerText = 'Odpocznij trochę.';

            // div.append(img,h2,h6);
            // taskList.appendChild(div);
        }  
    });
    event.target.parentElement.parentElement.parentElement.style.opacity = '0';
}

const resetForm = () =>
{
    [...newTaskPopupForm.elements].forEach((elem)=>{
        elem.value = '';
        elem.classList.remove('is-invalid');
        console.log(elem.tagName.toLowerCase())
    });
    ;
    [...document.getElementsByClassName('inputErrorInfo')].forEach((elem)=>{
        elem.innerText='';
    });
} 
