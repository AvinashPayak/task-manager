
const addTaskBtn = document.querySelector('.add-task button');
const createBtn = document.querySelector('.modal button');
const closeModalBtn = document.querySelector('.btn.danger');
const closeModalBtn2 = document.querySelector('.edit-modal .btn.danger');
const tasksSection = document.querySelector('.tasks');
const completedTasksSection = document.querySelector('.completed-tasks');
const logoutBtn = document.querySelector('.logout');
const error = document.querySelector('.error');

let editBtns, deleteBtns, checkboxes;

const fetchTasks = async () => {
    if(!localStorage.getItem('token')){
        window.location.href = 'http://127.0.0.1:5500/public/login.html'
    }
    else {
        const response = await axios.get('http://localhost:8080/tasks', 
    {
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if(response.status != 200) {
        console.log("Unable to fetch posts");
    }
    else {
        const tasks = response.data.tasks;

        let sortedTasks =  tasks.sort((a,b) =>{return a.priority - b.priority });  
        for(let i = 0;i<sortedTasks.length;i++){
            let task = document.createElement('div');
            task.classList.add('task');
            task.setAttribute('taskId', tasks[i].taskId.toString());

            let taskContent = document.createElement('div');
            taskContent.classList.add('task-content');

            let taskContentHeader = document.createElement('div');
            taskContentHeader.classList.add('task-content__header');

            let deadline = document.createElement('span');
            deadline.classList.add('deadline');
            const deadlineDate = returnDate(tasks[i].deadline);
            deadline.innerHTML = `<span class="due">Due:</span> ${deadlineDate}`;

            let category = document.createElement('span');
            category.classList.add('category');
            let diff = returnCategory(tasks[i].deadline);
            console.log(diff);
            let categoryData;
            if(diff<=-1){
                console.log(diff);
                categoryData = `Overdue by ${Math.floor(Math.abs(diff))} day(s)`;
                category.classList.add('danger');    
            }
            else if(diff>0){
                console.log(diff);
                categoryData = `due in ${Math.floor(Math.abs(diff))} day(s)`;
                category.classList.add('success'); 
            }
            else {
                categoryData = `due today`;
                category.classList.add('warning'); 
            }
            if(tasks[i].checked == 1){
                categoryData = `Completed!`;
                category.classList.remove('danger','warning','success');
                category.classList.add('success'); 
            }
            category.innerHTML = categoryData;

            let priority = document.createElement('span');
            priority.classList.add('priority');
            priority.innerHTML = `${tasks[i].priority}`;

            taskContentHeader.appendChild(deadline);
            let categoryPriority = document.createElement('div');
            categoryPriority.classList.add('category-priority');
            categoryPriority.appendChild(category);
            categoryPriority.appendChild(priority);
            taskContentHeader.appendChild(categoryPriority);

            let taskContentMain = document.createElement('div');
            taskContentMain.classList.add('task-content__main');

            let contentDiv = document.createElement('div');
            let content = document.createElement('p');
            content.innerText = tasks[i].content;
            if(tasks[i].checked == 1) content.classList.add('crossed');
            let editBtn = document.createElement('button');
            editBtn.innerText = 'Edit';
            editBtn.classList.add('btn','warning','edit');
            let deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.classList.add('btn','danger','delete');
            contentDiv.appendChild(content);
            contentDiv.appendChild(editBtn);
            contentDiv.appendChild(deleteBtn);

            let taskCheckbox = document.createElement('div');
            taskCheckbox.classList.add('task-checkbox');
            let checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.checked = tasks[i].checked==1?true:false;
            checkBox.classList.add('checkbox');
            checkBox.name = 'checked';
            taskCheckbox.appendChild(checkBox);

            taskContentMain.appendChild(contentDiv);
            taskContentMain.appendChild(taskCheckbox);

            let taskContentFooter = document.createElement('div');
            taskContentFooter.classList.add('task-content__footer');
            let footerContent = document.createElement('p');
            let footerDate = returnDate(tasks[i].creationDate);
            footerContent.innerHTML = `<span class="created">Created On:</span> ${footerDate}`;
            taskContentFooter.appendChild(footerContent);

            taskContent.appendChild(taskContentHeader);
            taskContent.appendChild(taskContentMain);
            taskContent.appendChild(taskContentFooter);

            task.appendChild(taskContent);

            if(tasks[i].checked==1) completedTasksSection.appendChild(task);
            else tasksSection.appendChild(task);
        }
        editBtns = document.querySelectorAll('.edit');
        editBtns.forEach(editBtn => {
            editBtn.addEventListener('click',event => {
                let val = sortedTasks.filter((task)=>{ 
                    let el = event.target.parentElement;
                    while(!el.classList.contains('task')){
                        el = el.parentElement;
                    } 
                    return el.getAttribute('taskid') == task.taskId 
                });
                displayModal2();
                const task = document.querySelector('.edit-modal input[type="text"]');
                const date = document.querySelector('.edit-modal input[type="date"]');
                const priority = document.querySelector('.edit-modal input[type="number"]');
                const updateBtn = document.querySelector('.edit-modal button');
                task.value = val[0].content;
                let datVal = val[0].deadline.split('T')[0];
                date.value = datVal;
                priority.value = val[0].priority;
                let taskId = val[0].taskId;
                let userId = val[0].userId;

                updateBtn.onclick = async ()=>{
                    const dueDate = document.querySelector('.edit-modal input[name = "date"]');
                    const task = document.querySelector('.edit-modal input[name="task"]');
                    const priority = document.querySelector('.edit-modal input[name="priority"]');
                    const checked = document.querySelector('.task input[name="checked"]')
                    if(dueDate.value.length == 0 || task.value.length == 0 || priority.value.length == 0){
                        error.classList.toggle('error-active');
                        return;
                    }
                    const response = await axios.put('http://localhost:8080/task', {
                        task: task.value,
                        dueDate: dueDate.value,
                        priority: priority.value,
                        userId: userId,
                        taskId:taskId,
                        checked: checked.value
                    },
                    {
                        headers : {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    displayModal2();
                    if(response.status!=200){
                    }
                    else{
                        tasksSection.innerHTML = '';
                        completedTasksSection.innerHTML = '';
                        fetchTasks();
                    }
                }
                 
            });
        });

        deleteBtns = document.querySelectorAll('.delete');
        deleteBtns.forEach(deleteBtn => {
            deleteBtn.onclick = async (event) => {
                let val = sortedTasks.filter((task)=>{ 
                    let el = event.target.parentElement;
                    while(!el.classList.contains('task')){
                        el = el.parentElement;
                    } 
                    return el.getAttribute('taskid') == task.taskId;
                });
                const taskId = val[0].taskId;
                const response = await axios.delete('http://localhost:8080/task', {data:{
                    taskId:taskId,
                }},
                {
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(response.status!=200){
                    console.log("not deleted from database");
                }
                else{
                    tasksSection.innerHTML = '';
                    completedTasksSection.innerHTML = '';
                    fetchTasks();
                }
            }
        });

        checkboxes = document.querySelectorAll('.checkbox');
        checkboxes.forEach(checkBox => {
            checkBox.onclick = async (event)=>{
                let val = sortedTasks.filter((task)=>{
                    let el = event.target.parentElement;
                    while(!el.classList.contains('task')){
                        el = el.parentElement;
                    } 
                    return el.getAttribute('taskid') == task.taskId 
                });
                const taskId = val[0].taskId;
                const checked = val[0].checked == 1?0:1;
                const userId = val[0].userId;
                const deadline = val[0].deadline;
                const priority = val[0].priority;
                const content = val[0].content;
                const response = await axios.put('http://localhost:8080/task', {
                    task: content,
                    dueDate: deadline,
                    priority: priority,
                    userId: userId,
                    taskId:taskId,
                    checked: checked
                },
                {
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(response.status!=200){
                    console.log("not updated in database");
                }
                else{
                    tasksSection.innerHTML = '';
                    completedTasksSection.innerHTML = '';
                    fetchTasks();
                }
            }
        })
    }
    } 
}

const createTask = async () => {
    const dueDate = document.querySelector('.modal input[name = "date"]');
    const task = document.querySelector('.modal input[name="task"]');
    const priority = document.querySelector('.modal input[name="priority"]');
    if(task.value.length == 0 || dueDate.value == 0 || priority.value == 0){
        error.classList.add('error-active');
        return;
    }
    const response = await axios.post('http://localhost:8080/task', {
        task: task.value,
        dueDate: dueDate.value,
        priority: priority.value,
        userId: localStorage.getItem('userId')
    },
    {
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    displayModal();
    if(response.status!=200){
        console.log("not added to database");
    }
    else{
        tasksSection.innerHTML = '';
        completedTasksSection.innerHTML = '';
        fetchTasks();
    }
}
const displayModal = ()=>{
    const modalBg = document.querySelector('.modal-bg');
    modalBg.classList.toggle('bg-active');
    error.classList.remove('error-active');
}

const displayModal2 = ()=>{
    const modalBg = document.querySelector('.modal-bg-2');
    modalBg.classList.toggle('bg-active');
    error.classList.remove('error-active');
}

closeModalBtn.addEventListener('click', displayModal);
closeModalBtn2.addEventListener('click', displayModal2);
createBtn.addEventListener('click', createTask)
addTaskBtn.addEventListener('click', displayModal)
logoutBtn.addEventListener('click', (event)=>{
    localStorage.clear();
});

const returnDate = (value)=>{
    let day,month,year;
    let fullDate = new Date(value);
    day = fullDate.getDate();
    month = fullDate.getMonth()+1;
    year =  fullDate.getFullYear();
    return `${day}-${month}-${year}`;
}

const returnCategory = (date1)=>{
    date1 = new Date(date1);
    let date2 = new Date();
    let diff = (date1-date2)/(1000*3600*24);
    return diff;
}
fetchTasks();
