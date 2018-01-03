"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Task = /** @class */ (function () {
    function Task(time, lenght, name) {
        this.time = time;
        this.lenght = lenght;
        this.name = name;
        this.ends = new Date(time.getTime());
        this.ends.setMinutes(this.ends.getMinutes() + lenght);
    }
    return Task;
}());
exports.Task = Task;
;
//# sourceMappingURL=Task.js.map