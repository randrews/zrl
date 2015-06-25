"use strict";

function LogObj(){
    this.elements = [
        document.getElementById("line6"),
        document.getElementById("line5"),
        document.getElementById("line4"),
        document.getElementById("line3"),
        document.getElementById("line2"),
        document.getElementById("line1")
    ];

    this.strings = [];
}

LogObj.prototype.print = function(str){
    this.strings.unshift(str);
    this.strings.splice(this.elements.length);
    var count = Math.min(this.strings.length, this.elements.length);

    for(var n=0; n<count; n++){
        this.elements[n].innerText = this.strings[n];
    }
}
