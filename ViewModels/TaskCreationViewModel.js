"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Task_1 = require("../Models/Task");
var $ = require("jquery");
var ipc = require("electron").ipcRenderer;
function processFormData(e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var date = document.getElementById("date").value;
    var lenght = document.getElementById("lenght").value;
    var time = document.getElementById("time").value;
    console.log(name);
    console.log(date);
    console.log(lenght);
    var minHour = time.split(":");
    var dateASDate = new Date(date);
    dateASDate.setHours(parseInt(minHour[0]));
    dateASDate.setMinutes(parseInt(minHour[1]));
    var queue = "TaskCreation";
    var task = new Task_1.Task(dateASDate, parseInt(lenght), name);
    ipc.send("taskCreated", JSON.stringify(task));
}
$(document).ready(function () {
    $("#taskCreationForm").submit(processFormData);
});
//# sourceMappingURL=TaskCreationViewModel.js.map