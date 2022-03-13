var taskIdCounter = 0;
var formEl = document.querySelector("#task-form")
var pageContentEl = document.querySelector("#page-content"); //this selects the main area where the 3 lists containers are
var tasksToDoEl = document.querySelector("#tasks-to-do");


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
    
    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
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

    // add the entire list item to the ul
    tasksToDoEl.appendChild(listItemEl);

    // increase the task counter for the next uique id
    taskIdCounter++;
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

    var statusChoices = ["To Do", "In Progress", "Completed"];

    //for loop to generate the three different options for the <select> element
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to the <select> element
        statusSelectEl.appendChild(statusOptionEl);
    }


    //append the newly created dropdown menu to the actionContainerEl
    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};


formEl.addEventListener("submit", taskFormHandler); //this targets the submit action of the forms button 

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
    if (targetEl.matches(".delete-btn")) {
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
};



// this targets the main area where the 3 lists are contained
pageContentEl.addEventListener("click", taskButtonHandler);


