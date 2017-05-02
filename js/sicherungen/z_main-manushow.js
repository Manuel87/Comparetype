"use strict";

var test = function ( args ) {
        var name = args.name || "Default",
            numbers = args.numbers,
            end = args.end || ".",
            l = numbers.length,
            total = 0;

        while ( l -- ) {
            total += numbers[ l ];
            numbers[ l ] += 1;
        }

        return name + ": " + total + end;
    },
    obj1 = {
        name : "Manu",
        numbers : [ 1, 3, 4 ],
        end : "?"
    },
    obj2 = obj1,


    var1 = [1],
    var2 = var1;

// fest();

// console.log( test( obj1 ) );
// console.log( test( obj2 ) );

// obj2.name = "Marcus";

// console.log( test( obj1 ) );
// console.log( test( obj2 ) );

console.log( var1 );
console.log( var2 );

var2[0] = 2;

console.log( var1 );
console.log( var2 );


// –--------
var Compare = function () {
        this.value = Math.random();
        this.init();
    },
    CompareBetter = function() {
        this.value = 3;
        this.init();
    };

Compare.prototype.value2 = Math.random();

Compare.prototype.init = function () {
    console.log( this.value, this.value2 );
};

CompareBetter.prototype.value2 = Math.random();

CompareBetter.prototype = new Compare();

new Compare();
new Compare();
new CompareBetter();

Compare.prototype.value2 += 1;

new Compare();
new Compare();
new CompareBetter();