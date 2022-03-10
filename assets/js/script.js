var formEl = document.querySelector("#task-form")
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function (event){
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // create a list item and style it with a class name
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //create div to hold task info and add it inside of list item, give it a class
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    // add html content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3>"+
                            "<span class='task-type'>"+ taskTypeInput + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // add the entire list item to the ul
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);