"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Month_1 = require("../Models/Month");
var Task_1 = require("../Models/Task");
var Additional_1 = require("../Additional");
var ipc = require("electron").ipcRenderer;
var $ = require("jquery");
var taskMemory = {};
var positionOfNextMount = 0;
var currentMonth = null;

function generateMonthView(month) {
    var tableDiv = document.getElementById("month_view");
    var monthTable = renderMonth(month);
    tableDiv.appendChild(monthTable);
}

function renderMonth(month) {
    var monthTable = document.createElement("table");
    monthTable.setAttribute("class", "center");
    var headerSpace = document.getElementById("month_header");
    var h4 = document.createElement("h4");
    h4.innerHTML = Additional_1.months[month.dateFormat.getMonth()];
    headerSpace.appendChild(h4);
    headerSpace = document.getElementById("year_panel");
    h4 = document.createElement("h4");
    h4.innerHTML = month.dateFormat.getFullYear().toString();
    headerSpace.appendChild(h4);
    var header = document.createElement("tr");
    Additional_1.daysOfTheWeek.forEach(function(item) {
        var element = document.createElement("td");
        element.textContent = item;
        header.appendChild(element);
    });
    monthTable.appendChild(header);
    var firstDay = month.dateFormat.getDay();
    var row = document.createElement("tr");
    for (var i = 0; i < firstDay; i++) {
        row.appendChild(renderSingleDay(null));
    }
    for (var i = 0; i < month.amountOfDays; i++) {
        row.appendChild(renderSingleDay(month.days[i]));
        if (month.days[i].date.getDay() === 6) {
            monthTable.appendChild(row);
            row = document.createElement("tr");
        }
    }
    monthTable.appendChild(row);
    return monthTable;
}

function renderSingleDay(day) {
    var td = document.createElement("td");
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    var contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "card-block");
    if (day !== null) {
        var h4 = document.createElement("h4");
        h4.innerHTML = day.date.getDate().toString();
        contentDiv.appendChild(h4);
        var key = day.date.getDate().toString() + day.date.getMonth().toString() + day.date.getFullYear().toString();
        if (key in taskMemory) {
            day.tasks = taskMemory[key];
        }
        var taskAccordion = renderTasks(day.tasks);
        contentDiv.appendChild(taskAccordion);
        div.appendChild(contentDiv);
        var butt = document.createElement("button");
        butt.id = day.date.getDate().toString();
        butt.addEventListener("click", addTask);
        butt.innerHTML = "Add task";
        td.appendChild(butt);
        td.appendChild(div);
    }
    return td;
}

function nextMonth() {
    var nextMonthDate = new Date(currentMonth.dateFormat.getTime());
    nextMonthDate.setMonth(currentMonth.dateFormat.getMonth() + 1);
    currentMonth = new Month_1.Month(nextMonthDate);
    clean();
    generateMonthView(currentMonth);
}

function previousMonth() {
    var prevMonth = new Date(currentMonth.dateFormat.getTime());
    prevMonth.setMonth(currentMonth.dateFormat.getMonth() - 1);
    currentMonth = new Month_1.Month(prevMonth);
    clean();
    generateMonthView(currentMonth);
}

function renderTasks(tasks) {
    var list = document.createElement("div");
    list.setAttribute("class", "list-group");
    tasks.forEach(function(m, index) {
        var anchor = document.createElement("a");
        anchor.setAttribute("href", "#");
        anchor.setAttribute("class", "list-group-item list-group-item-action flex-column align-items-start active");
        var headerDiv = document.createElement("div");
        headerDiv.setAttribute("class", "justify-content-between");
        var header = document.createElement("h6");
        header.setAttribute("class", "mb-1");
        header.innerHTML = m.name;
        headerDiv.appendChild(header);
        anchor.appendChild(headerDiv);
        var paragraphStarts = document.createElement("p");
        paragraphStarts.setAttribute("class", "mb-1");
        paragraphStarts.innerHTML = "Begins at: " + m.time.getHours().toString() + ":" + m.time.getMinutes().toString();
        var paragraphLasts = document.createElement("p");
        paragraphLasts.setAttribute("class", "mb-1");
        paragraphLasts.innerHTML = "For: " + m.lenght.toString() + " minutes";
        anchor.appendChild(paragraphStarts);
        anchor.appendChild(paragraphLasts);
        list.appendChild(anchor);
    });
    return list;
}

function addTask(e) {
    var day = parseInt(e.srcElement.id);
    var dayobject = currentMonth.days[day];
    ipc.send("showTaskCreationWindow");
}

function checkIfTaskCollides(task, day) {
    for (var i = 0; i < day.tasks.length; i++) {
        var element = day.tasks[i];
        if (task.time.getTime() < element.time.getTime()) {
            console.log("starts before");
            if (task.ends.getTime() > element.time.getTime()) {
                console.log("it ends after another starts");
                return false;
            }
            if (task.ends.getTime() > element.ends.getTime()) {
                console.log("is inside");
                return false;
            }
        }
        if (task.time.getTime() > element.time.getTime()) {
            console.log("starts after");
            if (task.ends.getTime() < element.ends.getTime()) {
                console.log("but ends before other ends(subtask)");
                return false;
            }
            if (task.ends.getTime() < element.time.getTime()) {
                console.log("but ends after other starts");
                return false;
            }
        }
        if (task.time.getTime() === element.time.getTime())
            return false;
    }
    return true;
}
ipc.on("taskCreatedAndReady", function(event, task) {
    var taskerro = JSON.parse(task);
    var taskerinho = new Task_1.Task(new Date(taskerro.time), taskerro.lenght, taskerro.name);
    var dayo = currentMonth.days[taskerinho.time.getDate() - 1];
    if (checkIfTaskCollides(taskerinho, dayo)) {
        addTaskToMemory(dayo, taskerinho);
        clean();
        generateMonthView(currentMonth);
    }
});

function addTaskToMemory(day, task) {
    var key = day.date.getDate().toString() + day.date.getMonth().toString() + day.date.getFullYear().toString();
    if (key in taskMemory) {
        taskMemory[key].push(task);
    } else {
        taskMemory[key] = [task];
    }
}

function clean() {
    document.getElementById("month_header").innerHTML = '';
    document.getElementById("month_view").innerHTML = '';
    document.getElementById("year_panel").children[0].remove();
}
$(document).ready(function() {
    var date = new Date(Date.now());
    currentMonth = new Month_1.Month(date);
    generateMonthView(currentMonth);
    document.getElementById("next-month").addEventListener("click", nextMonth);
    document.getElementById("previous-month").addEventListener("click", previousMonth);
});
//# sourceMappingURL=MainViewModel.js.map