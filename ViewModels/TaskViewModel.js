"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var ipc = require("electron").ipcRenderer;
function generateTaskView(task) {
    var div = $("#Task");
    var divForm = document.createElement("form");
    var title = document.createElement("input");
    title.type = "text";
    title.value = task.name;
    var hour = document.createElement("input");
    hour.type = "date";
    hour.value = task.time.toDateString();
    var lenght = document.createElement("input");
    lenght.type = "text";
    lenght.value = task.lenght.toString();
    var submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "update";
    divForm.appendChild(title);
    divForm.appendChild(hour);
    divForm.appendChild(lenght);
    divForm.appendChild(submitButton);
}
;
ipc.on("prepare", function (task) {
    console.log(task);
    if (task !== null) {
        generateTaskView(task);
    }
});
//# sourceMappingURL=TaskViewModel.js.map