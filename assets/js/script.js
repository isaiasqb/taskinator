var taskIdCounter = 0;

var formEl = document.querySelector("#task-form")
var pageContentEl = document.querySelector("#page-content"); //this selects the main area where the 3 lists containers are
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// an array to hold tasks for saving
var tasks = [];


var taskFormHandler = function (event){
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    // if we are editing an existing tag. it has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, means we are creating a new task
    else {
        // package up data collected from the form inputs as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        // send object data as a parameter to the function that creates the list element
        createTaskEl(taskDataObj);
    }
};

var completeEditTask = function (taskName, taskType, taskId) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" +taskId+ "']");

    //set new values 
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    // saves data inside localStorage
    saveTasks();

    alert("Task Updated!");

    // reset the form by removing the task id and changing the button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};


var createTaskEl = function(taskDataObj) {
    // create a list item and style it with a class name
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add it inside of list item, give it a class
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3>" + "<span class='task-type'>"+ taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // this variable holds the creation of the "div" that contains the task actions 
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    
    switch (taskDataObj.status) {
        case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
            break;
        default:
            console.log("something went wrong");
    };

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    //saves the data onto the localStorage
    saveTasks();

    // increase the task counter for the next uique id
    taskIdCounter++;
    console.log(taskDataObj);
    console.log(taskDataObj.status)
};


var createTaskActions = function(taskId) {
    // create a new div element to contain the actions for each task and assign custom class
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create a button for editing the task & append it to the actionContainerEl
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);
    // create a button for deleting the task & append it to the actionContainerEl
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    // create a dropdown menu for changing the status of the task 
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);
    // create status options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    //for loop to generate the three different options for the <select> element
    for (var i = 0; i < statusChoices.length; i++) {
        // create the <option> elements to go inside the <select> element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to the <select> element
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};


// function to be triggered by clicking the main content area only if the element clicked on is a button from an individual task
var taskButtonHandler = function(event) {
    // get the target element from event
    var targetEl = event.target

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        // get element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId); 
    }
};

var editTask = function (taskId) {
    //variable that references the entire <li> element. ets the <li> data-task-id value from the taskButtonHandler function
    var taskSelected = document.querySelector(".task-item[data-task-id='" +taskId+"']");

    //get the content from task-name <h3> element.
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);
    //get the content from task-type <h3> element.
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // reload the form with the information gathered form the list element
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // change the message on the save button
    document.querySelector("#save-task").textContent = "Save Task"; 

    // add the taskId form the <li> to a data-task-id attribute on the form itself.
    formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
    //gets the <li> data-task-id value from the taskButtonHandler function and deletes the entire task
    var taskSelected = document.querySelector(" .task-item[data-task-id='" +taskId+ "'] ");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through cyurrent tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id does not match the value of taskId, let's keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        } 
    }

    //reasign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    // saves data inside localStorage
    saveTasks();
};

var taskStatusChangeHandler = function (event){
    // console.log(event.target); // logs the object that triggered the "change", in this case the <select> element
    // console.log(event.target.getAttribute("data-task-id")); //logs the value of the task-id form the changed task

    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the current selected status' value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" +taskId+ "']");
    
    //change the location of the task based on the status selected
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
        console.log(tasks);
    }

    // saves data inside localStorage
    saveTasks();
};


// saving tasks to localStorage, function will every time we add, update, or delete any tasks.
var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTask = function () {
    
    var savedTasks = localStorage.getItem('tasks');

    if (!savedTasks){
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        //pass each task object into the 'createTaskEl()' function
        createTaskEl(savedTasks[i]);
    }
};


//creates a ner task, this targets the submit action of the forms button 
formEl.addEventListener("submit", taskFormHandler); 

// this targets the main area where the 3 lists are contained
pageContentEl.addEventListener("click", taskButtonHandler);

// tracks any changes on the form, for example, when you change the status of the <select> item
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTask();