"use strict";

var globalVars = {};

globalVars.resizeTimer;

globalVars.preset = { // preset if nothing else gets detected!
	diagonal: 33.78, //33.78(13.3) 58.62, //23,//68.58, //27, //width: 27, //348, //143
	unit : "cm", //"cm", //"inch", //"cm", 2,54
	distance: 60//900//430
}

globalVars.layout = {
	minFonSize_px: 5,
	minFonSize_vu: 7,
	minReadingSize_px: 7,
	minReadingSize_vu: 9,
	maxReadingSize: 13,
	minLineHeight: 2,
};
globalVars.myOptions = {
	wordsplit: false
};

globalVars.fontsizeadjusts = {

};

globalVars.textLinesAreSplit = false;

globalVars.measure_fontsize = 500; //
globalVars.measure_em = 1;
globalVars.display_em = 2;
globalVars.oldsize_em_adjust = globalVars.measure_em * globalVars.display_em;

globalVars.fontIds = ( function () {
	var fontCount = 2,
		list = [];

	while( fontCount -- ) {
		list.push( "font" + ( fontCount + 1 ) );
	};

	return list;
} )();


// globalVars.staticValues = {
//	 px2pt: 1.5,
//	 px2inch: 1,
//	 px2mm: 1,
//	 px2cm: 1,
//	 pt2px: 1,
//	 mm2px: 1,

//	 in2pt: 72,
//	 pt2in: 1 / 72,
//	 in2cm: 2.54,
//	 cm2in: 1 / 2.54,

//	 mm2pt: 1,
//	 pt2mm: 1,
//	 pt2vu: 1,
//	 mm2vu: 1,
//	 //vucm2pt: 0.00824565,
//	 vucm2cm: 3.14159265358979 / 10800, // arcmin = pi / (180*60) 0.0002908882,
//	 //vucm2mm: 3.14159265358979 / 10800 * 10,//0.002908882,
//	 cm2vucm: 1 / 0.0002908882,
// };

globalVars.realScreen = {};

globalVars.fromCm = {
	cm: 1,
	inch: 2.54,
	foot: 30.48,
	mm: 0.1,
	m: 100,
	pt: 2.54 / 72, //2.54 / 72,
	arcmin: undefined
};

globalVars.allUnits = [
	"arcmin",
	"cm",
	"mm",
	"m",
	"foot",
	"inch",
	"pt",
	"px"
];
globalVars.chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";//1234567890";
globalVars.basicShapes = {
	lowercase: "acemnorsuvwxz",
	ascenders: "bdfhikltj",
	descenders: "gpqyj",
	caps: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
};


globalVars.UIList = [{
	divId: "mainForm", // Main Navigation / UI
	content: [{
		name: "Neue Typografische Größenbehandlung",//"Typographic Sizing", // Title/Name of this UI Field
		id: "typographicsizing", // id of the field
		initFunc: "toggle", // Func to be run on init, determines what kind of field ( must be in ManusComperator.prototype.GetUI )
		changeFunc: "normalizeFonts", // Func to be run when something in the field is changed ( must be in ManusComperator.prototype.GetUIFunc )
		//
		changeVar: "normalizeFonts",
		"default": true
	},  {
		name: "Überlagern", ////"Overlay",
		id: "mode_overlay",
		initFunc: "toggle",
		changeFunc: "doWhenOverlay", //toggle means to append a class to the body
		"default": false
	}, {
		name: "Zeichen/Wörter zentrieren",//"Justify",
		id: "justify",
		initFunc: "toggle", //toggle means to append a class to the body
		changeFunc: "doJustify",
		changeVar: "isSplit",
		"default": false
	},
	// {
	//     name: "Monospace",
	//     id: "monospace",
	//     initFunc: "toggle", //toggle means to append a class to the body
	//     changeFunc: "doMonospace",
	//     changeVar: "isSplit",
	//     "default": false
	// },
	// {
	// 	name: "Outline",
	// 	id: "show_outline",
	// 	initFunc: "toggle", //toggle means to append a class to the body
	// 	"default": false

	// },
	// {
	// 	name: "Frequency",
	// 	id: "show_frequency", //english
	// 	initFunc: "toggle", //toggle means to append a class to the body
	// 	changeFunc: "doFrequency",
	// 	changeVar: "isSplit",
	// 	"default": false

	// },
	// {
	// 	name: "Flip Chars", // Title/Name of this UI Field
	// 	id: "flipchars", // id of the field
	// 	initFunc: "toggle", // Func to be run on init, determines what kind of field ( must be in ManusComperator.prototype.GetUI )
	// 	changeFunc: "doFlipChars",
	// 	changeVar: "isSplit",
	// 	"default": false
	// },
	{
		name : "FontSelect",
		id : "fontselect1",
		initFunc : "selectfonts",
		changeId : "font1"
	},
	{
		name : "FontSelect",
		id : "fontselect2",
		initFunc : "selectfonts",
		changeId : "font2"
	}
]
}, {
	divId: "measureInput", // Main Navigation / UI
	content: [ {
		name: "<i class='fa fa-expand'></i>",
		id: "screensize",
		initFunc: "textinput",
		changeFunc: "calcPPI",
		inputs: [{
			name: "Width",
			id: "width"
		}, {
			name: "Height",
			id: "height"
		}, {
			name: "",
			id: "diagonal"
		}, ], // Values that can be input, id might have to match global-values that should be changed
		units: [
			"inch",
			"cm"
		], // Units to be selectable for this field

	}, {
		name: "",
		id: "screenresolution",
		initFunc: "textinput",
		units: ["ppi", "ppcm"],
		editable: false,
		inputs: [{
			name: "",
			id: "resolution"
		}],
	}, {
		name: "<i class='fa fa-eye' title='Reading Distance'></i>",
		id: "readingdistance",
		initFunc: "textinput",
		changeFunc: "updateReadingDistance",
		inputs: [{
			name: "", //label
			id: "distance"
		}],
		units: [
			"cm",
			"m",
			"inch"
		]
	}, ]
},
{
	divId: "firstInfoTest", // Output Sizes
	content: [{
			name: "Test",
			initFunc: "textinput",
			editable: false,
			inputs: [{
				name: "Width",
				id: "width"
			}, {
				name: "Height",
				id: "height"
			}, {
				name: "Diagonal",
				id: "diagonal"
			}, {
				name: "Viewport-Width",
				id: "viewportWidth"
			}, {
				name: "Viewport-Height",
				id: "viewportHeight"
			}, {
				name: "Viewport-Diagonal",
				id: "viewportDiagonal"
			}, {
				name: "Distance",
				id: "distance"
			}],
			units: globalVars.allUnits
		},

	]
},
{
	divId: "ruler",
	content: [
		// {
		//	 name: "Ruler Cm",
		//	 initFunc: "ruler",
		//	 unit: "cm",
		//	 drawNth: 1
		// }, {
		//	 name: "Ruler Inch",
		//	 initFunc: "ruler",
		//	 unit: "inch",
		//	 drawNth: 1
		// },
		{
			name: "Ruler Arcmin",
			initFunc: "ruler",
			unit: "arcmin",
			drawNth: 50
		}
	],
}];

globalVars.decimalPlaces = 2;
globalVars.maxDecimalPlaces = 10;

globalVars.$window = $(window);
globalVars.$body = $("body");
globalVars.head = document.head || document.getElementsByTagName('head')[0];
globalVars.$compare = $(".comparetext");

globalVars.myWindow = {
	screen: {},
	viewport: {},
	space: {}
};

globalVars.round = function(i, d) {
	var places = d === undefined ? globalVars.decimalPlaces : d,
		dec = Math.pow(10, places),
		fin = Math.round(i * dec) / dec;

	return (fin === 0 && places < globalVars.maxDecimalPlaces) ? globalVars.round(i, places + 1) : fin;
};

globalVars.myMath = {
	getDiagonal: function(a, b) {
		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
	},

	decimal: globalVars.round,

	toCm: function(i, u) {
		return i * globalVars.fromCm[u];
	},

	fromCm: function(i, u) {
		return i / globalVars.fromCm[u];
	}
}; // END Math

globalVars.setCSS = function( styleSheet, css ) {
	var CSS = globalVars.CSS,
		newChild;

	if( globalVars.CSSnodes[ styleSheet ] ) {
		CSS.removeChild( globalVars.CSSnodes[ styleSheet ] );
	}

	// console.log( styleSheet, css );

	CSS.appendChild( newChild = document.createTextNode(css) );
	globalVars.CSSnodes[ styleSheet ] = newChild;
}



// color handling
//http://jsfiddle.net/Mottie/xcqpF/1/light/
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

/*
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
*/

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex, alphaInput) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex),
	alpha = alphaInput || 1;
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
		a: parseFloat(alpha, 10)
	} : null;
}

function hexToRgbString(hex, alphaInput) {
	var rgba = hexToRgb(hex, alphaInput);
	return "rgba(" + [rgba.r,rgba.g,rgba.b,rgba.a].join(',') +")";
}

//http://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}


function populateFontList(fontArr) {
	//gets called by flashfile (only online)
	//saved from http://hasseg.org/stuff/fontList/example.html
	//!!!actionscript needs: flash.system.Security.allowDomain('http://localhost'); //to work locally (didnt got it workin)
	// wonderfl.net (was down)

	var str = '', my_list;

	for(var i = 0; i < fontArr.length; i++)
		str += '<option value="'+fontArr[i]+'" />';

	my_list = document.getElementById("active_fonts");
	my_list.innerHTML = str;

	//my_list.options.length  // my_list.options[5].value);
	}

//remove element
//http://stackoverflow.com/questions/3387427/javascript-remove-element-by-id

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


