"use strict"


function regExVar(str) {
    return str.replace(/(?=[\/\\^$*+?.()|{}[\]])/g, "\\");
}


ManusComperator.prototype.prepareMeasurements = function () {
	var fontCount = globalVars.fontIds.length,
		fonts = [],

		$container = $('<div/>', {
			id:"measurefonts_main",
			css : {
				"font-size" : globalVars.measure_fontsize
			}
		} ).appendTo( globalVars.$body ),

			$measure = $('<div/>', {
				"class" : "measuring_fonts",
				css : {
					"font-size" : globalVars.display_em / globalVars.average_measure_em + "em"
				}
			}).appendTo( $container ),

			$check = $('<div/>', {
				"class" : "measuring_fonts"
			}).appendTo( $container ),

			$final = $('<div/>', {
				"class" : "measuring_fonts"
			}).appendTo( $container ),

		fonts = [],
		fontIds = globalVars.fontIds,
		l = fontIds.length;

	globalVars.measureArea = {
		$container : $container,
		$measure : $measure,
		$check : $check,
		$final : $final
	};

	while ( l -- ) {
		fonts.push( new this.Font( fontIds[ l ] ) );
	}

	globalVars.fonts = fonts;

}

ManusComperator.prototype.Font = function ( fontId ) {
	var measureArea = globalVars.measureArea,
		character = "x",
		spanClass = { "class" : "measuring_square" },
		body = document.getElementsByTagName("body")[0];

	this.$measureKegel = $("<div/>", {
		"text" : character,
		"class" : fontId + "_before float",
		"id" : "measure"
	}).appendTo( measureArea.$measure );

	this.$measureXHeight = $( "<span/>", spanClass ).appendTo( this.$measureKegel );

	this.$checkKegel =  $("<div/>", {
		"text" : character,
		"class" : fontId + " " + fontId + "_scale float",
		"id" : "check"
	}).appendTo( measureArea.$check );
	this.$checkXHeight = $( "<span/>", spanClass ).appendTo( this.$checkKegel );

	this.$finalKegel =  $("<div/>", {
		"text" : character,
		"class" : fontId + " float",
		"id" : "final"
	}).appendTo( measureArea.$final );
	this.$checkXHeight = $( "<span/>", spanClass ).appendTo( this.$finalKegel );

	this.$font = $('.' + fontId + ':first'),
	this.fontName = this.$font.css("font-family");
	this.fontId = fontId;

	this.$modules = $( ".module_" + this.fontId );

	// this.$measure.css({
	// 	"-webkit-transform": "translate(0px, 0px)"
	// });
	this.$measureCanvas = document.createElement('canvas');
	this.$measureCanvas.width = globalVars.measure_fontsize ; //1000
	this.$measureCanvas.height = globalVars.measure_fontsize * 2; //2000
	this.$measureCanvas.id = "canvas_" + fontId;

	if (!globalVars.debugging) { this.$measureCanvas.style.display = "none";};
	 // hide canvas // debugging
		//var body = document.getElementsByTagName("body")[0];
		body.appendChild(this.$measureCanvas);
	this.canvas_xHeight = [];

	//this.$measureCanvas = $( "<canvas/>", {"id" : ("Canvas_" + fontId), "width": 2000, "height":1000} ).appendTo(body);

	this.$fonts = $( "." + this.fontId ).not( "." + this.fontId + "_scale" );
	this.$compareModuleInfo = $('.compare.module .module_info');
	this.$compareText = this.$fonts.filter( ".comparetext" );
	this.$compareWrap = this.$compareText.find( ".wrap" );
	this.$compareParent = this.$compareText.parent();
	this.$compareText.keyup( this.compareChange( this ) );

	//this.measure();
}

ManusComperator.prototype.Font.prototype.compareChange = function ( font ) {
	var fontId = this.fontId, $span, $lines;
	// $(".font1.comparetext .wrap").text($(".font1.comparetext .wrap").text() )
	// $(".font2.comparetext .wrap").text($(".font1.comparetext .wrap").text() )
	// $(".font1.comparetext .wrap").text($(".font2.comparetext .wrap").text() )

	return function () {
		var fonts = globalVars.fonts,
			l = fonts.length,
			thisFont;

		while( l -- ) {
			thisFont = fonts[ l ];
			//$span = font.$compareWrap.find(">.span");
			if( fontId !== thisFont.fontId ) {

				//console.log("ESCAPE", thisFont.$compareWrap.find("span").length, fontId, thisFont.fontId);

				if(thisFont.$compareWrap.find("span").length) {
					thisFont.$compareWrap.text(font.$compareWrap.text() );
					font.$compareWrap.text( font.$compareWrap.text() );
				} else {
					thisFont.$compareWrap.html( font.$compareWrap.html() ) //html;

				}


				// if($span.length) {
				// 	$lines = font.$compareWrap.find(".line")
				// 	if ($lines.length) {
				// 		$lines.text($lines.text());
				// 		font.$compareWrap.html(font.$compareWrap.html()); //html;
				// 	}
				// 	else {
				// 		font.$compareWrap.text(font.$compareWrap.text());
				// 	}
				// }
			}
		}

		globalVars.comperator.updateCompare();

	}

}




ManusComperator.prototype.Font.prototype.measure = function () {
	var script = globalVars.activeScript.writingSystem, // latin
	scriptStyle = globalVars.activeScript.scriptStyle, //upper lowercase
	fontStyle = this.fontStyle = globalVars.activeScript.fontStyle || "normal", //smallcaps // italic
	myChar = this.myChar = globalVars.writingScripts[script].scriptStyle[scriptStyle].typographicMeasurement.string,
	measured_Glyph,
	average_measure_em,
	measure_fontsize = globalVars.measure_fontsize,
	CanvasFont;
	this.fontName = this.$font.css("font-family");
	this.characters = this.characters || [];
	globalVars.measuredFonts[this.fontName] = globalVars.measuredFonts[this.fontName] || {};
	globalVars.measuredFonts[this.fontName].WidthsObject = {};
	globalVars.measuredFonts[this.fontName][myChar] = globalVars.measuredFonts[this.fontName][myChar] || {};

	measured_Glyph = globalVars.measuredFonts[this.fontName][myChar][fontStyle] || false;
	average_measure_em = globalVars.average_measure_em = globalVars.writingScripts[script].scriptStyle[scriptStyle].typographicMeasurement.averageheight;


	if( measured_Glyph ) { //this.canvas_xHeight[this.fontName]) {
		this.fontsizeadjust = measure_fontsize / measured_Glyph.height * average_measure_em ;

	} else {
		CanvasFont = this.MeasureFontOnCanvas(this.fontName, myChar, "block", measure_fontsize, fontStyle);
		measured_Glyph = globalVars.measuredFonts[this.fontName][myChar][fontStyle];
		this.fontsizeadjust = measure_fontsize / measured_Glyph.height * average_measure_em;

	}


	ManusComperator.prototype.adjustLayout();

	// this.baseline_offset = ( ( this.$measureXHeight.offset().top -  this.$measureKegel.offset().top ) / globalVars.measure_fontsize ) * this.fontsizeadjust;
	// this.baseline_offset = ( ( this.$checkXHeight.offset().top -  this.$checkKegel.offset().top ) / globalVars.measure_fontsize )

	if( globalVars.initialized ) { this.style(); }
};

ManusComperator.prototype.Font.prototype.normBaseline = function () {
	if($(".fixbaseline.font1").length < 1) {
	$(".font1, .font2").before('<span class="fixbaseline font1">.</span><span class="fixbaseline font2">.</span>');

	}
            // $(".font1 .fixbaseline").css({
            //     //'font-size': 1 / fontsizeadjust_1 * fontsizeadjust_2 + "em",
            //     'font-family': $('.font2').css('font-family')
            // });
            // $(".font2 .fixbaseline").css({
            //    // 'font-size': 1 / fontsizeadjust_2 * fontsizeadjust_1 + "em",
            //     'font-family': $('.font1').css('font-family')
            // });
};


ManusComperator.prototype.Font.prototype.style = function () {
	var adjustedfontsize,
		typographicfontsize,//														// here is somthing wrong -> 0.5 shouldn’t
		//														be there -> have a look at: globalVars.measure_fontsize
		//														probably because fontsizeadjust is 2 x x-Height... ?
		newFontEm = globalVars.normalizeFonts ? this.fontsizeadjust * globalVars.display_em / globalVars.average_measure_em : globalVars.display_em / globalVars.average_measure_em;



	this.$compareText.css ({
			// "-webkit-transition": "font .3s ease-in"
		});

	globalVars.setCSS( "styleNormalize" + this.fontId, "." + this.fontId + " { " +
		"font-size:" + newFontEm + "em;" +
		"} "
	);

	//show technical sizes
	$(".chooseFontsContainer .module_" + this.fontId).attr("data-height", this.myChar + "-height: " + globalVars.measuredFonts[this.fontName][this.myChar][this.fontStyle].height / 1000 + "em"); //this.characters[this.myChar].height


	//console.log(this.fontId + " " + this.fontsizeadjust / 2);
	// this.$fonts.each(function() {
	// 	adjustedfontsize = parseFloat( $(this).css("font-size"), 10 );
	// 	typographicfontsize = parseFloat( $(this).parent().css("font-size"), 10 );

	// 	$(this).css({
	// 		"margin-top": ( -this.baseline_offset * typographicfontsize ) + "px",
	// 		color: "#0f0",
	// 	});
	// });
	this.normBaseline();
};

ManusComperator.prototype.normalizeFonts = function() {
	var fonts = globalVars.fonts,
		l = fonts.length;

		while( l -- ) {
			fonts[ l ].measure(); //style();

			globalVars.activeFonts[l] = fonts[ l ].$font.css("font-family");
		}

		if( globalVars.$html.hasClass("round_fontsize_id")) {	RoundFontsize.prototype.update(); };

		//if( globalVars.$html.hasClass("show_technicalsizes")) {
			ManusComperator.prototype.updateTechnicalsizes();// };

		/*
		if(!globalVars.isSplitWords) { //isSplit
		ManusComperator.prototype.splitWordsChar(".myReadingRegular_frame>.readingtext.font1>.content", ".myReadingRegular_frame>.readingtext.font2>.content", true, false, false, true); //last is for softLinebreaks
		}; */

		// ManusComperator.prototype.adjustLayout();
		//console.log("####### Normalize Fonts ####")

};

ManusComperator.prototype.measureFonts = function () {
	var fonts = globalVars.fonts,
		l = fonts.length;

	while( l -- ) {
		fonts[ l ].measure();
	}
}

ManusComperator.prototype.updateCompare = function () {
	var fonts = globalVars.fonts,
		myRound = globalVars.round,
		selector = ".myCompareDefault_frame.textframe.modul_1, .myCompareDefault_frame.textframe.modul_1",
		cssString = "",
		l = fonts.length,
		biggest = 0,
		bigestFontSize,
		thisFont,
		thisSize,
		maxWidth = globalVars.$compare.width() - 20,
		ratio,
		thisText,
		reNormal = new RegExp("["+ globalVars.basicShapes.lowercase + "]"),
		reAscenders = new RegExp("["+globalVars.basicShapes.ascenders + "]"),
		reDescenders = new RegExp("["+globalVars.basicShapes.descenders + "]"),
		reCaps = new RegExp("["+globalVars.basicShapes.caps + "]"),
		reExceptNormal = new RegExp("["+globalVars.basicShapes.caps + globalVars.basicShapes.ascenders + globalVars.basicShapes.descenders + "]"),
		vh = globalVars.realScreen.px.viewportHeight,
		thisFontSizeCSS,
		thisFontSize,
		arcpx = this.getinPx(1, "arcmin"),
		cmpx = this.getinPx(1, "cm"),
		mmpx = this.getinPx(1, "mm"),
		ptpx = this.getinPx(1, "pt"),
		csspixel = globalVars.preset.csspixel;




		//re = new RegExp("^\\/" + "[" + globalVars.basicShapes.normal + "]" + "\\/\\d+$");
//regExVar(
	//re = new RegExp('\\['+globalVars.basicShapes.normal+'\\]');

	while( l -- ) {
		thisFont = fonts[l];

		// thisFont.$compareText.css ({
		// 	"-webkit-transition": "none"
		// });

		thisFont.$compareParent.css({
			"font-size" : 10
		});

		// cssString =  selector + "{ " +
		// 	"font-size:" + 10  + "px;"
		// "} ";
		// globalVars.setCSS( "styleAdjustMaxSize", cssString);
		thisSize = thisFont.$compareWrap.width();
		thisText = thisFont.$compareWrap.text();




		if( biggest < thisSize ) {
			biggest = thisSize;
		};
	}

	ratio = maxWidth / biggest;


	l = fonts.length;

	while( l -- ) {
		thisFont = fonts[l];
		//console.log(thisText, reNormal.test(thisText), reExceptNormal);
		//console.log(/[ABCDEFGHIJKLMNOPQRSTUVWXYZbdfhikltjgpqyj]/.test(thisText));
		if(reExceptNormal.test(thisText)) {
			if((10*ratio) > (vh / 3 *1.3)) {
				ratio = (vh / 3 *1.3) / 10;
			}
			thisFontSizeCSS = 10 * ratio;
			thisFont.$compareParent.css({  //Ascenders
				"font-size" : thisFontSizeCSS +"px",
				"margin-top" : (-3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( -4 * ratio ) + "px"
			});
			// cssString =  selector + "{ " +
			// 	"font-size:" + ( 10 * ratio )  + "px;" +
			// 	"margin-top" + (-3 * ratio ) + "px",
			// 	"line-height:" + ( 25 * ratio ) + "px" + //important;" + //+ "ex!important;" +
			// 	"margin-bottom" + ( -4 * ratio ) + "px"
			// "} ";
			if(reDescenders.test(thisText)) { //Descenders

			thisFont.$compareParent.css({
				"font-size" : ( 10 * ratio )+"px",
				"margin-top" : ( -3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( -2 * ratio ) + "px"
			});
			// cssString =  selector + "{ " +
			// 	"font-size:" + ( 10 * ratio )  + "px;" +
			// 	"margin-top" + (-3 * ratio ) + "px" +
			// 	"line-height:" + ( 25 * ratio ) + "px" + //important;" + //+ "ex!important;" +
			// 	"margin-bottom" + ( -2 * ratio ) + "px"
			// "} ";
			//
				//"padding-bottom" : ( 10 * ratio ) + "px",
			}
			if(reAscenders.test(thisText) && reDescenders.test(thisText)) { //Asc + Desc
			thisFont.$compareParent.css({
				"font-size" : ( 10 * ratio )+"px",
				"margin-top" : ( -3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( 0 * ratio ) + "px"

			});
			// cssString =  selector + "{ " +
			// 	"font-size:" + ( 10 * ratio )  + "px;" +
			// 	"margin-top" + (-3 * ratio ) + "px" +
			// 	"line-height:" + ( 25 * ratio ) + "px" + //important;" + //+ "ex!important;" +
			// 	"margin-bottom" + ( 0 * ratio ) + "px"
			// "} ";
			//

			}
		} else {
			if((10*ratio) > (vh / 3 *1.3)) {
				ratio = (vh / 3 * 1.3) / 10;
			}
			thisFontSizeCSS = 10 * ratio;
			thisFont.$compareParent.css({ /// normal
				//////////
				// "font-size" : ( 10 * ratio ),
				// "margin-top" : ( -2 * ratio ) + "px",
				// "line-height": ( 12 * ratio ) + "px",
				// "margin-bottom" : ( -2 * ratio ) + "px"
				"font-size" : thisFontSizeCSS + "px",
				"margin-top" : (-3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( -4 * ratio ) + "px"
			})
		// 	cssString =  selector + "{ " +
		// 	"font-size:" + ( 10 * ratio )  + "px;" +
		// 	"margin-top" + (-3 * ratio ) + "px" +
		// 	"line-height:" + ( 25 * ratio ) + "px" + //important;" + //+ "ex!important;" +
		// 	"margin-bottom" + ( -4 * ratio ) + "px"
		// 	"} ";
		} //"padding-bottom" : ( 1 * ratio ) + "px",

		// console.log("startsplitandalign");
		//
		thisFontSize = thisFontSizeCSS * csspixel; //real pixel fontsize

		//thisFont.$compareParent.css("font-size");
		thisFont.$compareModuleInfo.html('<span>max (' + myRound(thisFontSize/arcpx,1) + "arcmin / " + myRound(thisFontSize,0) + 'px / ' + myRound(thisFontSize/mmpx,1) + 'mm / ' + myRound(thisFontSize/ptpx,1) + 'pt) </span>');

		//thisFont.$compareParent.attr("style", thisFont.$compareParent.attr("style") + " @media print { font-size: 5pt!important;}")

		//console.log("style= " + thisFont.$compareParent.attr("style"));

		cssString =  "@media print { " + selector + "{ " +
			"font-size:" + myRound(thisFontSize / ptpx, 1)  + "pt!important;" +
			"margin-top" + myRound((-3 * ratio * csspixel) / ptpx, 1) + "pt!important; " +
			"line-height:" + myRound(( 25 * ratio * csspixel ) / ptpx, 1) + "pt!important; " + //important;" + //+ "ex!important;" +
			"margin-bottom" + myRound(( -4 * ratio * csspixel ) / ptpx, 1) + "pt!important; " +
			"} " +
			"} ";


		// Set CSS
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		globalVars.setCSS( "styleAdjustMaxSizePrint", cssString);
		////////////////////////////////////////////////////


		// globalVars.setCSS( "stylePrintBig", "@media print { " +
		// 	".myCompareDefault { " +
		// 	"font-size:" + thisFontSize/ptpx + "pt !important;" +
		// 	"} " +
		// 	"}"
		// );
	}
}

// ManusComperator.prototype.Font.prototype.prepareMeasureFontOnCanvas = function() {
// 	fontIds = globalVars.fontIds,
// 		l = fontIds.length;

// 		var canvas = document.createElement('canvas');
// 		canvas.width = sizeKegel || 1000; //1000
// 		canvas.height = sizeKegel*2 || 2000; //2000
// 		canvas.id = "measure_canvas";
// }

		//// ¿better? Alternative could be using: http://pomax.nihongoresources.com/pages/Font.js/
ManusComperator.prototype.Font.prototype.MeasureFontOnCanvas = function(FontFamily, Char, display, sizeKegel, fontStyle) {
		var canvas = this.$measureCanvas; //document.getElementById("Canvas_" + this.fontId); // || {};
		this.characters = this.characters || [];
		fontStyle = fontStyle || "normal";
		//var canvas = document.createElement('canvas');
		//canvas.width = sizeKegel || 1000; //1000
		//canvas.height = sizeKegel*2 || 2000; //2000
		//canvas.id = "measure_canvas";
		//canvas.style.display = display || "none";

		//var body = document.getElementsByTagName("body")[0];
		//body.appendChild(canvas);

		var Font = {}, //"Minion Pro",
		//canvas = document.getElementById('measure_canvas'),
		canvasWidth  = canvas.width,
		canvasHeight = canvas.height,
		yMin = canvasHeight,
		yMax = 0,
		xMin = canvasWidth,
		xMax = 0,
		CharSmallCap = false,
		CharRendered = "",
		sizeKegel = sizeKegel || 1000;

		Font.family = FontFamily; //"Minion Pro"; //"Times";  //"BurgGroteskBeta", //"Maurea-RegularLf", //"Calibri", //"Brandon Grotesque", //"Arnhem", //"Akkurat-Mono", //"Helvetica Neue", //"Minion Pro",
		Font.weight = "400 "; //lighter bolder bold 100 — 900
		Font.style = ""; //normal italic oblique
		Font.variant = "";
		if (fontStyle === "italic") { Font.style = "italic ";} else { Font.style = ""; }
		if (fontStyle === "smallcaps") { Font.variant = "small-caps "; CharSmallCap = Char.toLowerCase();
		//css font-variant-caps: all-small-caps
		//real small caps seem not possible nowadays
		//-> Workaround: "Render HTML ELEMENT TO CANVAS" or "opentype.js" (but I really don’t know if they support smallcaps /OT-Features yet)
		//http://stackoverflow.com/questions/12652769/rendering-html-elements-to-canvas
		//http://stackoverflow.com/questions/2732488/how-can-i-convert-an-html-element-to-a-canvas-element
		//https://github.com/miohtama/Krusovice/blob/master/src/tools/html2svg2canvas.js
		//http://html2canvas.hertzen.com/ ! // http://html2canvas.hertzen.com/examples.html // appart from subpixels everything looks great!! (and subpixels we wont need) // library is only 91KB :)
			//html2canvas(document.body, {
			//   onrendered: function(canvas) {
			//     document.body.appendChild(canvas);
			//   }
			// });
	} else { Font.variant = ""; }

		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		var EmptyImageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
		//JS-Syntax: context.font="italic small-caps bold 12px arial";
		ctx.font = Font.style + Font.variant + Font.weight + sizeKegel + "px " + Font.family;

		CharRendered = CharSmallCap || Char;
		ctx.fillText(CharRendered, 0, sizeKegel);


		//console.log("fontStyle = " + fontStyle + " (" + Char + ")" + CharRendered);

		var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
		var data = imageData.data;

		var MyReadImage = function(xMinInput, xMaxInput, yMinInput, yMaxInput) {
		};

		// Get Bounds
		for (var y = 0; y < canvasHeight; ++y) {
			for (var x = 0; x < canvasWidth; ++x) {
				var index = (y * canvasWidth + x) * 4;
				//check Alpha
				if(data[index+3] > 0) {

					if(y <= yMin ) { yMin = y; }
		 			else if (y >= yMax ) { yMax = y; };

					if(x <= xMin ) { xMin = x; }
		 			else if (x >= xMax ) { xMax = x; };

		 			//only to visualize, what got measured
					var value = x * y / 20 & 255; //0xff
					data[index]   = value;	// red
					data[++index] = 0;		// green
					data[++index] = 0;		// blue
					data[++index] = 255;	// alpha


				}
			}
		}
		this.characters[Char] = {};
		Font[Char] = {};
		Font[Char].height = yMax + 1 - yMin;
		Font[Char].width = xMax + 1 - xMin;
		Font[Char].overshoot = yMax - (sizeKegel-1);
		Font[Char].boundleft = xMin;
		Font[Char].boundtop = yMax;

		var MeasureStrokeWidthX = parseInt(xMax + 1 - Font[Char].width/2);
		var MeasureStrokeWidthY = parseInt(yMax + 1 - Font[Char].height/2) + 30; //20

		// Get vertical Strokewidth
		yMax = -500;
		yMin = 5000;
		xMax = -500;
		xMin = 5000;

		for (var y = MeasureStrokeWidthY; y < (MeasureStrokeWidthY + 1); ++y) {
			for (var x = 0; x < Font[Char].boundleft + Font[Char].width/2; ++x) {
				var index = (y * canvasWidth + x) * 4;
				//check Alpha
				if(data[index+3] > 0) {

					if(y <= yMin ) { yMin = y; }
		 			if (y >= yMax ) { yMax = y; };

					if(x <= xMin ) { xMin = x; }
		 			if (x >= xMax ) { xMax = x; };

		 			//only to visualize, what got measured
					var value = 255; //0xff
					data[index]   = 0;	// red
					data[++index] = value;		// green
					data[++index] = 0;		// blue
					data[++index] = 255;	// alpha
				}
			}
		}

		Font[Char].strokeWidth = xMax + 1 - xMin;


		// Get horizontal Strokewidth
		yMax = 0;
		yMin = sizeKegel * 2 ;
		xMax = 0;
		xMin = sizeKegel * 2;

		for (var y = 0; y < (Font[Char].boundtop - Font[Char].height/2 + 20); ++y) {
			for (var x = MeasureStrokeWidthX; x < (MeasureStrokeWidthX + 1); ++x) {
				var index = (y * canvasWidth + x) * 4;
				//check Alpha
				if(data[index+3] > 0) {

					if(y <= yMin ) { yMin = y; }
		 			else if (y >= yMax ) { yMax = y; };

					if(x <= xMin ) { xMin = x; }
		 			else if (x >= xMax ) { xMax = x; };

		 			//only to visualize, what got measured
					var value = 255; //0xff
					data[index]   = 0;	// red
					data[++index] = value;		// green
					data[++index] = value;		// blue
					data[++index] = 255;	// alpha
				}
			}
		}


		Font[Char].strokeWidthX = yMax + 1 - yMin;

		ctx.putImageData(imageData, 0, 0);


		// Show Basline
		ctx.beginPath();
		ctx.moveTo(Font[Char].boundleft, 999.5);
		ctx.lineTo(Font[Char].boundleft + Font[Char].width, 999.5);
		ctx.lineWidth = 1;
		ctx.stroke();


		// Show Info
		var InfoLineHeight = 20, InfoYPos = 0;
		ctx.font = "15px Helvetica";

		ctx.fillText(Char +" — " + Font.family + ", " + Font.weight + ", " + Font.style, 20, InfoYPos += InfoLineHeight);
		ctx.fillText("Height: " + (Font[Char].height - Font[Char].overshoot*2) + "‰ (" + Font[Char].height + ")", 20, InfoYPos += InfoLineHeight);

		if(Char === "o" || Char === "O") {


			ctx.fillText("Overshoot: " + Font[Char].overshoot + "‰ -> Height: " + (Font[Char].height - Font[Char].overshoot*2) + "‰ ", 20, InfoYPos += InfoLineHeight);
			// set new height without overshoot
		} else {
			ctx.fillText("Overshoot: " + Font[Char].overshoot + "‰ ", 20, InfoYPos += InfoLineHeight);
		}
		ctx.fillText("Width: " + Font[Char].width + "‰", 20, InfoYPos += InfoLineHeight);
		ctx.fillText("StrokeWidth: " + Font[Char].strokeWidth + "‰", 20, InfoYPos += InfoLineHeight);
		ctx.fillText("StrokeWidthX: " + Font[Char].strokeWidthX + "‰", 20, InfoYPos += InfoLineHeight);

		//console.log("### maxOversthoot =" + (globalVars.writingScripts[globalVars.activeScript.writingSystem].scriptStyle[globalVars.activeScript.scriptStyle].typographicMeasurement.overshoot_max * sizeKegel) + " Char = " + Font[Char].overshoot)
		// minus Overshoot
		this.canvas_xHeight[this.fontName]  = Font[Char].height;
		if (globalVars.writingScripts[globalVars.activeScript.writingSystem].scriptStyle[globalVars.activeScript.scriptStyle].typographicMeasurement.overshoot) {
			//var relative_overshoot = Font[Char].overshoot
			if(Font[Char].overshoot > 0 && Font[Char].overshoot < (globalVars.writingScripts[globalVars.activeScript.writingSystem].scriptStyle[globalVars.activeScript.scriptStyle].typographicMeasurement.overshoot_max * sizeKegel) ) {

			Font[Char].height = (Font[Char].height - Font[Char].overshoot*2);
			}
		};
		//clear canvas
		//ctx.putImageData(EmptyImageData, 0, 0); //canvas.remove();
		//canvas.remove();
		if(Char === "x" || Char === "ο" ||  Char === "א" ) { //||  Char === "ـمـ"
		this.canvas_xHeight[this.fontName] = Font[Char].height;
		this.characters[Char].height = Font[Char].height;

		}


		globalVars.measuredFonts[this.fontName] = globalVars.measuredFonts[this.fontName] || {};
		globalVars.measuredFonts[this.fontName][Char] = globalVars.measuredFonts[this.fontName][Char] || {};
		globalVars.measuredFonts[this.fontName][Char][fontStyle] = globalVars.measuredFonts[this.fontName][Char][fontStyle] || {};
		globalVars.measuredFonts[this.fontName][Char][fontStyle].height = Font[Char].height;

		return Font;
	}; // End MeasureFont
