"use strict"

let addNewTaskButton;
let newTaskPopup;
let mainWrapper;
let taskListWrapper;
let taskList;
let newTaskPopupForm;
let hideNewTaskPopupBtn;
let inputErrorsInfo;
let tasksTab = [];
let taskListPlaceholderEmpty, taskListPlaceholderDone;

document.addEventListener('DOMContentLoaded', () => {


    mainWrapper = document.getElementById('mainWrapper');
    mainWrapper.style.height = `${window.innerHeight}px`;
    window.addEventListener('resize', ()=>{mainWrapper.style.height = `${window.innerHeight}px`;});
    window.addEventListener('orientationchange', ()=>{mainWrapper.style.height = `${window.innerHeight}px`;});

    addNewTaskButton = document.getElementById('addNewTaskButton');
    newTaskPopup = document.getElementById('newTaskPopup');
    taskListWrapper = document.getElementById('taskListWrapper');
    newTaskPopupForm = document.getElementById('newTaskPopupForm');
    hideNewTaskPopupBtn = document.getElementById('hideNewTaskPopupBtn');
    inputErrorsInfo = document.getElementsByClassName('input-error-info');
    taskList = document.getElementById('taskList');
    taskListPlaceholderEmpty = document.getElementById('taskListPlaceholderEmpty');
    taskListPlaceholderDone = document.getElementById('taskListPlaceholderDone');

    addNewTaskButton.addEventListener('click', toggleNewTaskPopup);
    newTaskPopupForm.addEventListener('submit', addNewTask);
    newTaskPopupForm.elements[0].addEventListener('click', toggleNewTaskPopup);

    initializeTasksTab();

    // console.log((60 - new Date().getSeconds()) * 1000);
    // setTimeout(()=>{ //to trzeba zrobić asynchronicznie!
    //     findExpiredTasks(tasksTab);
    //     setInterval(()=>{
    //         findExpiredTasks(tasksTab);
    //     }, 60010)
    // }, (60 - new Date().getSeconds()) * 1000);
});

const initializeTasksTab = ()=> {
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
}

const saveTasksTabToLocalStorage = ()=> {
    localStorage.setItem('todoList', JSON.stringify(tasksTab));
}

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
        setTimeout(()=>{
            addNewTaskButton.style.transform = 'translateX(9999px)';}
            , 400);
    }
    else {
        [...newTaskPopupForm.elements].forEach((elem)=>
        {
            elem.tabIndex = "-1";
            //elem.blur();
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

    if(tasksTab.length)
    {
        tasksTab.forEach((task, index) =>
        {
            taskListPlaceholderDone.style.display = 'none';

            let li = document.createElement('li');
            let wrapperDivLeft = document.createElement('div');
            let div1 = document.createElement('div');
            let div2 = document.createElement('div');
            let badgeSpan = document.createElement('span');
            let h6 = document.createElement('h6');
            let p = document.createElement('p');
            let wrapperDivRight = document.createElement('div');
            let button = document.createElement('button');
            

            li.classList.add('task');
            li.dataset.taskId = index;        
            wrapperDivLeft.classList.add('task-info-wrapper');
            wrapperDivRight.classList.add('task-done-btn-wrapper');
            div1.classList.add('task-info-title-wrapper');
            div2.classList.add('task-info-desc-wrapper');
            h6.classList.add('task-info-title');
            button.classList.add('task-done-btn');
            button.innerHTML = `
                                <svg viewBox="-5 -5 66.7 67">
                                <defs>
                                    <linearGradient id='g1' y2='1'>
                                    <stop stop-color='#667eea'/>
                                    <stop offset='1' stop-color='#764ba2'/>
                                    </linearGradient>
                                </defs>
                                <path class="retract" fill="none" stroke="url(#g1)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                M36,6.3c5.7,2.1,10.2,6.2,12.9,11.1"/>
                                <path fill="none" stroke="url(#g1)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="
                                M48.9,17.4c3.1,5.8,3.9,12.9,1.4,19.7c-4.6,12.4-18.4,18.8-30.8,14.3S0.7,33,5.2,20.5S23.6,1.7,36,6.3"/>
                                
                                <polyline class="tick" fill="none" stroke="url(#g1)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="
                                20.3,25.4 28.6,33.9 46.7,8.3 "/>
                                </svg>`;
            button.addEventListener('click', toggleTaskIsDone);

            if(task.deadlineDate || task.deadlineTime)
            {

                
                badgeSpan.classList.add('deadline-badge');
                
                let today = new Date(Date.now()).toISOString().slice(0,10);
                let tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
                if(task.deadlineDate === today) //tu jest problem prawdopodobnie kwestia strefy czasowej today np. o 1:01 zawiera datę dzień przed
                {
                    
                    badgeSpan.innerText = 'Dzisiaj';
                }
                else if(task.deadlineDate === tomorrow)
                {
                    badgeSpan.innerText = 'Jutro';
                }
                else{
                    if(task.deadlineDate) badgeSpan.innerText = convertDateToDDMMYYY(task.deadlineDate);
                }

                badgeSpan.innerText+=` ${task.deadlineTime}`;
                if(task.expired)
                {
                    badgeSpan.classList.add('deadline-badge-expired');
                    li.style.color = '#dc3545';
                }
            }
            h6.innerText = task.title;

            if(task.done) 
            {
                // div1.style.textDecoration = 'line-through';
                // p.style.textDecoration = 'line-through';

                wrapperDivLeft.classList.add('done-task-info-wrapper');

                let rmvbutton = document.createElement('button');
                let rmvspan = document.createElement('span');
                rmvbutton.classList.add('task-done-btn');
                rmvspan.classList.add('material-symbols-outlined');
                rmvspan.innerText = 'delete';
                rmvspan.style.color = '#dc3545';
                
                rmvbutton.addEventListener('click', removeTask);
                if(task.animate === true)
                {
                    rmvspan.classList.add('material-symbols-outlined-fade-in');
                    button.classList.add('open');
                    h6.classList.add('done');
                    p.classList.add('done'); 
                    if(task.deadlineDate || task.deadlineTime) badgeSpan.classList.add('deadline-badge-done', 'done');
                }
                else{
                    button.classList.add('show');
                    h6.classList.add('donenoanimate');
                    p.classList.add('donenoanimate'); 
                    if(task.deadlineDate || task.deadlineTime) badgeSpan.classList.add('deadline-badge-done', 'donenoanimate');
                }
                rmvbutton.appendChild(rmvspan);
                wrapperDivRight.appendChild(rmvbutton);
            }

            if(task.deadlineDate || task.deadlineTime) div1.appendChild(badgeSpan);
            div1.appendChild(h6);
            if(task.description.trim().length > 0)
            {
                p.classList.add('task-info-desc');
                if(task.done) {
                    p.innerText = task.oneLineDescription;
                    p.style.maxHeight = '1.5em';
                }
                else 
                {
                    p.innerText = task.description;
                }
                
                div2.appendChild(p);
            }
            wrapperDivLeft.append(div1, div2);

            
            wrapperDivRight.appendChild(button);
            li.append(wrapperDivLeft, wrapperDivRight);
            taskList.appendChild(li);       
        })
    }
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
            "done": false,
            "animate": true,
            "expired": false,
            "ISODeadline": '3000-12-31T23:59',
            "oneLineDescription": event.target.elements[2].value.replaceAll('\n', ' ')
        };
        task.description = replaceStartingFromNOccur(task.description, 3, '\n', ' ');
        tasksTab.push(task);
        if(event.target.elements[3].value && event.target.elements[4].value)
        {
            task.ISODeadline = event.target.elements[3].value + 'T' + event.target.elements[4].value;
        }
        else if(event.target.elements[3].value || event.target.elements[4].value)
        {
            if(event.target.elements[3].value) 
            {
                task.ISODeadline = event.target.elements[3].value + 'T' + '23:59';
            }
            else if(event.target.elements[4].value)
            {
                task.ISODeadline = new Date().toISOString().slice(0,10) + 'T' + event.target.elements[4].value;
            }
        }
        saveTasksTabToLocalStorage();
        
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
        generateTaskListDOM(tasksTab);
        tasksTab[index].animate = false;
   }
   else{
        tasksTab[index].done = false;
        generateTaskListDOM(tasksTab);
        tasksTab[index].animate = true;
   }
   saveTasksTabToLocalStorage();
}

const removeTask = (event) =>
{
    let index = event.currentTarget.parentElement.parentElement.dataset.taskId;
    event.currentTarget.parentElement.parentElement.classList.add('fadeOut');
    
    tasksTab.splice(index,1);
    saveTasksTabToLocalStorage();
    setTimeout(()=>{ 
        
        if(tasksTab.length === 0)
        {
            taskListPlaceholderDone.style.display = 'flex';
        }
        generateTaskListDOM(tasksTab);       
    
    },400);
}

const resetForm = () =>
{
    [...newTaskPopupForm.elements].forEach((elem)=>{
        elem.value = '';
        elem.classList.remove('is-invalid');
    });
    ;
    [...document.getElementsByClassName('input-error-info')].forEach((elem)=>{
        elem.innerText='';
    });
} 


const convertDateToDDMMYYY = (date)=>
{
    return date.slice(8,10) + '-' + date.slice(5,7) + '-' + date.slice(0,4);
}

// // const convertDateFromDDMMYYYYToISO = (date)=>
// // {
// //     return date.slice(6,10) + '-' + date.slice(3,5) + '-' + date.slice(0,2);
// // }

// const getDateByZone = (zone) => {
//     return fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${zone}`)
//            .then( (resp) => { return resp.json();})
//            .then( data => {
//                 return data.dateTime;
//             });
// }

// const isTaskExpired = async (task)=>
// {
//     let todayDate = await getDateByZone('Europe/Warsaw');
//     let nowUnixTime = Date.parse(todayDate.slice(0,16));
    
//     if(task.deadlineDate && task.deadlineTime) 
//     {
//         console.log(nowUnixTime > Date.parse(task.deadlineDate+'T'+task.deadlineTime));
//         return (nowUnixTime > Date.parse(task.deadlineDate+'T'+task.deadlineTime))
//     }
//     else if(task.deadlineDate)
//     {
//         return (nowUnixTime > Date.parse(task.deadlineDate+'T23:59'))
//     }
//     else if (task.deadlineTime)
//     {
//         return (nowUnixTime > Date.parse(new Date().toISOString().split('T')[0]+'T'+task.deadlineTime))
//     }
//     else return false;
// }

// const findExpiredTasks = async (tab) =>
// {
//     let expiredTasks = false;
//     for(let task of tab){
//         if(await isTaskExpired(task))
//         {
//             task.expired = true;
//             expiredTasks = true;
//         } 
//     }
//     if(expiredTasks) generateTaskListDOM(tasksTab);
// }

// const sortTasksByDeadline = (tab)=>
// {
//     tab.sort((a,b) => Date.parse(b.ISODeadline) - Date.parse(a.ISODeadline));
// }

const replaceStartingFromNOccur = (str, n, char, rplcwith)=>
{
	let indexesOfChar = [];
    let tmpStr = [...str];

    for(let i = 0; i<tmpStr.length; i++)
    {
        if(tmpStr[i] == char)
        {
            indexesOfChar.push(i);
            if(indexesOfChar.length >= n)
            { 
                console.log(tmpStr);
                tmpStr[i] = rplcwith; 
                console.log(tmpStr);
            }	
        }
    }
    return tmpStr.join('');
}

