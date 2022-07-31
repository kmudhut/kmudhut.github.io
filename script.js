"use strict"

let addNewTaskButton;
let newTaskPopup;
let taskListWrapper;
let taskList;
let newTaskPopupForm;
let hideNewTaskPopupBtn;
let inputErrorsInfo;
let tasksTab = [];
let taskListPlaceholderEmpty, taskListPlaceholderDone;

document.addEventListener('DOMContentLoaded', () => {


    document.getElementsByClassName('main-wrapper')[0].style.height = `${window.innerHeight}px`;
    window.addEventListener('resize', ()=>{document.getElementsByClassName('main-wrapper')[0].style.height = `${window.innerHeight}px`;})
    window.addEventListener('orientationchange', ()=>{document.getElementsByClassName('main-wrapper')[0].style.height = `${window.innerHeight}px`;})
    addNewTaskButton = document.getElementById('addNewTaskButton');
    newTaskPopup = document.getElementById('newTaskPopup');
    taskListWrapper = document.getElementById('taskListWrapper');
    newTaskPopupForm = document.getElementById('newTaskPopupForm');
    hideNewTaskPopupBtn = document.getElementById('hideNewTaskPopupBtn');
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
    newTaskPopupForm.elements[0].addEventListener('click', toggleNewTaskPopup);

});

const toggleNewTaskPopup = () => {
        
    if (addNewTaskButton.style.opacity !== '0') {
        setTimeout(()=>{ //newTaskPopupForm.elements[1].focus();
            [...newTaskPopupForm.elements].forEach((elem)=>
            {
                elem.tabIndex = "0";
            })
        
        }, 500);
        newTaskPopup.style.transform = 'translateY(0px)';
        hideNewTaskPopupBtn.style.opacity = '1';
        taskListWrapper.style.height = 'calc(93% - 350px)';
        addNewTaskButton.style.opacity = '0';
        setTimeout(()=>{addNewTaskButton.style.transform = 'translateX(9999px)';}, 400)
        
    }
    else {
        [...newTaskPopupForm.elements].forEach((elem)=>
        {
            elem.tabIndex = "-1";
            elem.blur();
        })
        newTaskPopup.style.transform = 'translateY(400px)';
        hideNewTaskPopupBtn.style.opacity = '0';
        taskListWrapper.style.height = '93%';
        addNewTaskButton.style.opacity = '1';
        addNewTaskButton.style.transform = 'translateX(0px)';
        setTimeout(resetForm, 500);
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
        button.innerHTML = `
            <svg viewBox="-5 -5 66.7 67">
            <path class="retract" fill="none" stroke="cornflowerblue" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M36,6.3c5.7,2.1,10.2,6.2,12.9,11.1"/>
            <path fill="none" stroke="cornflowerblue" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="
            M48.9,17.4c3.1,5.8,3.9,12.9,1.4,19.7c-4.6,12.4-18.4,18.8-30.8,14.3S0.7,33,5.2,20.5S23.6,1.7,36,6.3"/>
            
            <polyline class="tick" fill="none" stroke="cornflowerblue" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="
            20.3,25.4 28.6,33.9 46.7,8.3 "/>
            </svg>
        `;
        button.addEventListener('click', toggleTaskIsDone, true);
        //doneIconSpan.classList.add('material-symbols-outlined');

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
        //doneIconSpan.innerText = 'circle';
        
        if(task.done) 
        {
            div.style.textDecoration = 'line-through';
            p.style.textDecoration = 'line-through';
            if(task.deadlineDate || task.deadlineTime) badgeSpan.classList.add('deadline-badge-done');
            div.style.color = 'gray';
            p.style.color = 'gray';

            //doneIconSpan.innerText = 'task_alt';
            button.classList.add('open');
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

        //button.appendChild(doneIconSpan);
  
        wrapperDivRight.appendChild(button);
        li.append(wrapperDivLeft, wrapperDivRight);
        taskList.appendChild(li);
        localStorage.setItem('todoList', JSON.stringify(tasksTab));
})
}

const addNewTask = (event) => {
    event.preventDefault();

    if (event.target.elements[1].value.trim().length > 2) 
    {

        toggleNewTaskPopup();
        let task = {
            "title": event.target.elements[1].value,
            "description": event.target.elements[2].value,
            "deadlineDate": event.target.elements[3].value,
            "deadlineTime": event.target.elements[4].value,
            "done": false
        };
        tasksTab.push(task);

        generateTaskListDOM(tasksTab);
        setTimeout(resetForm, 500);
        


    }
    else{
        inputErrorsInfo[0].innerText = 'Tytuł powinien zawierać min. 3 znaki.';
        event.target.elements[1].classList.add('is-invalid');
    }
}

const toggleTaskIsDone = (event) =>
{
   let index = event.currentTarget.parentElement.parentElement.dataset.taskId;
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
