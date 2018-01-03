"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Day_1 = require("./Day");
var Additional_1 = require("../Additional");
var Month = /** @class */ (function () {
    function Month(date) {
        this.monthName = Additional_1.months[date.getMonth()];
        this.amountOfDays = Additional_1.amountOfMonthDays[this.monthName];
        this.dateFormat = new Date(date.getTime());
        this.dateFormat.setDate(1);
        this.days = [];
        this.generateDays();
    }
    Month.prototype.generateDays = function () {
        var position = new Date(this.dateFormat.getTime());
        for (var i = 1; i <= this.amountOfDays; i++) {
            position.setDate(i);
            var nextDay = new Day_1.Day(position);
            this.days.push(nextDay);
        }
    };
    return Month;
}());
exports.Month = Month;
;
//# sourceMappingURL=Month.js.map