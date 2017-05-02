"use strict";
// RoundFontsize // No Jquery
// Mode I: 		round specific Classes
// Mode II: 	get all Decimal Fontsizes -> and Round everything !!! NOT YET
// General Process
/*
	Site loaded / resize -> INIT
	INIT
	-> check if roundCSS -> if -> remove roundCSS (Mode II: + get the selectors)
	-> check classes (Mode II: eveything )
	-> if Decimal -> Round (Mode I: -> could round always)
	-> Push CSS to Header



*/




var roundVars = {};

var RoundFontsize = function(selectors, button, highlight, recalculateAlways, roundto) {
	roundVars.selectors = selectors || "body";
	roundVars.highlight = highlight || false; // highlightning
	roundVars.enabled = false;
	roundVars.recalculateAlways = recalculateAlways || false;
	roundVars.styleSheet = "roundedFontsize";
	roundVars.head = document.head || document.getElementsByTagName('head')[0];
	roundVars.CSS = document.createElement('style');
	roundVars.CSSnodes = {};
	roundVars.CSS.type = 'text/css';
	roundVars.head.appendChild( roundVars.CSS );
	roundVars.myCSS = "";
	roundVars.roundto = roundto || 1;
	roundVars.id;

	addEvent(window, "resize", this.resize)
	// addEvent(window, "mouseup", this.resize)
	// addEvent(window, "keyup", this.resize)


	if (button) {
		roundVars.button = document.getElementById(button);
		roundVars.button.onclick = function fun() {
			RoundFontsize.prototype.toggleCSS();
		};
	};
	//this.init();
};

RoundFontsize.prototype.resize = function() {
	clearTimeout(roundVars.id);
    roundVars.id = setTimeout(RoundFontsize.prototype.resized, 500);
}


RoundFontsize.prototype.resized = function() {
	RoundFontsize.prototype.update(); //this.update();
	//roundVars.setCSS( roundVars.styleSheet, roundVars.myCSS);
};


RoundFontsize.prototype.update = function() {
	//console.log("round");
	var myArray, Fontsize, newFontsize, element, Lineheight, newLineHeight,
	index = 0, myclass, elements = [], element;

	//check for already added stylsheet

	//reset css

	roundVars.myCSS = "";
	roundVars.setCSS( roundVars.styleSheet,"");

	myArray = roundVars.selectors.split(",");

    for (index in myArray) {
    		element = document.querySelectorAll(myArray[index])[0];

			//get font size
			if (element) {
				Fontsize = parseFloat(getStyle(element, 'font-size'), 10); //jquery//element.css("font-size");
				Lineheight = parseFloat(getStyle(element, 'line-height'), 10);
			}
			//check if decimal -> round  // 23.5 % 1 = 0.5
			//if(Fontsize % 1 != 0) {
				newFontsize = Math.round(Fontsize / roundVars.roundto) * roundVars.roundto;
				newLineHeight = Math.round(Lineheight / roundVars.roundto) * roundVars.roundto;

			roundVars.myCSS += myArray[index] + " { " +
				"font-size:" + newFontsize + "px!important;" + //important-hack cause somehow the css is not on last position (header)
				"line-height:" + newLineHeight + "px;"; // +
				// "letter-spacing:" + "0;"

			if(roundVars.highlight) {roundVars.myCSS += "color:" + roundVars.highlight + "!important;"}

			roundVars.myCSS += "}";

	}
		if(roundVars.enabled) {
			roundVars.setCSS( roundVars.styleSheet, roundVars.myCSS);

		}
}


RoundFontsize.prototype.toggleCSS = function() {
	if(roundVars.enabled === false) {
		roundVars.enabled = true;
		if( roundVars.myCSS === "" || roundVars.recalculateAlways) {
			this.update();
		}
		console.log("integrer")
		roundVars.setCSS( roundVars.styleSheet, roundVars.myCSS);
		addClass(document.html || document.getElementsByTagName('html')[0], "fontsize-rounded");

	} else {
		console.log("decimal")
		roundVars.setCSS( roundVars.styleSheet,"/**/");
		roundVars.enabled = false;
		removeClass(document.html || document.getElementsByTagName('html')[0], "fontsize-rounded");
	}
}


roundVars.setCSS = function( styleSheet, css ) {
	var CSS = roundVars.CSS,
		newChild;

	if( roundVars.CSSnodes[ styleSheet ] ) {
		CSS.removeChild( roundVars.CSSnodes[ styleSheet ] );
	}

	// console.log( styleSheet, css );

	CSS.appendChild( newChild = document.createTextNode(css) );
	roundVars.CSSnodes[ styleSheet ] = newChild;
}


//http://stackoverflow.com/questions/1955048/get-computed-font-size-for-dom-element-in-js
//IE? -> http://filamentgroup.github.io/shoestring/dist/docs/dom/css/getComputedStyle.js.html
function getStyle(el,styleProp) {
  var camelize = function (str) {
    return str.replace(/\-(\w)/g, function(str, letter){
      return letter.toUpperCase();
    });
  };

  if (el.currentStyle) {
    return el.currentStyle[camelize(styleProp)];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(el,null)
                               .getPropertyValue(styleProp);

  } else {
    return el.style[camelize(styleProp)];
  }
}

function addEvent(elem, type, eventHandle) {
	if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};

function addClass(el, myClass){
    el.className += ' '+myClass;
}

function removeClass(el, myClass){
    var elClass = ' '+el.className+' ';
    while(elClass.indexOf(' '+myClass+' ') != -1)
         elClass = elClass.replace(' '+myClass+' ', '');
    el.className = elClass;
}


//use within HTML -> onclick="RoundFontsize.prototype.toggleCSS()"
//
