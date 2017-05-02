"use strict";


// Constructor for the Main ManusComperator Object
var ManusComperator = function() {
	var UI = new this.GetUI(this), // Pass this to UI Object, so global Variables can be used
		UIList = globalVars.UIList,
		l = UIList.length,
		c = 0, that = this,

		//Creates all UI Elements and wraps it into a UL
		createInfoBlock = function(block) {
			var blockContent = block.content,
				l = blockContent.length,
				c = 0,
				$blockUl = $('<ul/>'),
				parent = $("#" + block.divId);

			do {
				updaterPush(new UI[blockContent[c].initFunc](blockContent[c], $blockUl));
			} while ((c += 1) < l);

			$blockUl.appendTo(parent);

		},

		updaterPush,
		head = globalVars.head,
		node;

	node = document.createElement('style');
	node.type = 'text/css';
	head.appendChild( node );

	globalVars.CSS = node;
	globalVars.CSSnodes = {};

	globalVars.comperator = this;

	this.fontDrop = this.getFontDrop();

	this.updater = this.GetUpdater();
	updaterPush = this.updater.push;

	this.updateReadingDistance({
		distance: globalVars.preset.distance
	}, "cm");

	// init -> resize, calcPPI
	this.init();
	globalVars.initialized = true;

	do {
		createInfoBlock(UIList[c]);
	} while ((c += 1) < l);

	// Recalculate the Layout
	this.updater.update();


}; // END Basic ManusComperator Constructor

// First time site is loaded or after changing the screen.
ManusComperator.prototype.init = function() {
	var myWindow = globalVars.myWindow;

	myWindow.screen.width = window.screen.width; //window.screen.availWidth,
	myWindow.screen.height = window.screen.height; // window.screen.availHeight,
	myWindow.screen.diagonal = globalVars.myMath.getDiagonal( myWindow.screen.width, myWindow.screen.height );
	globalVars.preset.csspixel = this.getCSSpixel();
	globalVars.initial.csspixel = globalVars.preset.csspixel;

	this.resize = this.getResize(this);
	globalVars.$window.resize(this.resize);

	this.prepareMeasurements();

	this.calcPPI( globalVars.preset, globalVars.preset.unit, globalVars.initial.csspixel);

	this.resize();

	$(".extend_options").on("click", function(event) {
		$(this).next().toggleClass('collapsed');
	});

	this.showBaseline();

	// ManusComperator.prototype.splitWordsChar(".myReadingRegular_frame>.readingtext.font1", ".myReadingRegular_frame>.readingtext.font2", true, false);

	//this.flipHochizontal(".myReadingRegular .font1 .char");
}; // END init

ManusComperator.prototype.getCSSpixel = function() {
	var csspixel = window.getComputedStyle(
		document.querySelector('#retinadetection'), ':after'
	).getPropertyValue('content').replace(/"/g, '').replace(/'/g, ''); //need to replace the quotes cause parsefloat wont work if there are quotes within a string
	return parseFloat(csspixel, 10);
}

// When changing the PPI, or after changing the screen or after first load
ManusComperator.prototype.calcPPI = function(size, unit, csspixel) {

	var myWindow = globalVars.myWindow,
		inchToCm = unit !== "cm" ? true : false,
		input = size,
		ratio = myWindow.screen.width / myWindow.screen.height,
		units = ["cm", "inch"],
		csspixel = csspixel || globalVars.initial.csspixel || 1.0,
		//csspixel = 1.0,
		l = units.length;



	// Get Width, Height & Diagonal from what you have
	(function(input, getDiagonal) {
		if (input.diagonal) {
			input.height = Math.sqrt(Math.pow(input.diagonal, 2) / (1 + Math.pow(ratio, 2)));
			input.width = input.height * ratio;
		} else if (input.width) {
			input.height = input.width / ratio;
			input.diagonal = getDiagonal(input.height, input.width);
		} else if (input.height) {
			input.width = input.height * ratio;
			input.diagonal = getDiagonal(input.height, input.width);
		} else {
			//alert("No Value entered");
		}
	})(input, globalVars.myMath.getDiagonal);


	this.addAndConvertToRealScreen(input, inchToCm ? "inch" : "cm", "px");

	// or should I assign this somehwere outside this function?
	// shouldn't realScreen be within the globalVars???
	globalVars.realScreen.px = {}; //myWindow.screen;

	globalVars.realScreen.px.width = myWindow.screen.width * csspixel;
	globalVars.realScreen.px.height = myWindow.screen.height * csspixel;
	globalVars.realScreen.px.diagonal = myWindow.screen.diagonal * csspixel;


	globalVars.realScreen.ppi = {
		resolution: globalVars.realScreen.px.width / globalVars.realScreen.inch.width
	};

	globalVars.realScreen.ppcm = {
		resolution: globalVars.realScreen.px.width / globalVars.realScreen.cm.width
	};

	globalVars.fromCm.px = globalVars.realScreen.cm.width / globalVars.realScreen.px.width; //myWindow.screen.width;

	globalVars.emulation_multiplicator = 1;
	globalVars.preset.csspixel = globalVars.initial.csspixel;


	//////


	this.adjustLayout();



}; // END calcPPI

ManusComperator.prototype.enterPPI = function( size, unit ) {
	var entered_resolution_ppi = unit === "ppi" ? size.resolution : (size.resolution * globalVars.fromCm.inch),
		units = globalVars.allUnits,
		l = units.length;



	globalVars.emulation_multiplicator = (globalVars.emulation_multiplicator !== 1) || globalVars.round(entered_resolution_ppi / globalVars.realScreen["ppi"].resolution,4);
	globalVars.fromCm.px = globalVars.realScreen.cm.width / globalVars.realScreen.px.width / globalVars.emulation_multiplicator;

	globalVars.preset.csspixel = globalVars.initial.csspixel * globalVars.emulation_multiplicator;


	this.adjustLayout();
	globalVars.comperator.updateCompare();

}; // END reading distance



ManusComperator.prototype.doWhenOverlay = function (Button) {
	//if(!globalVars.isSplit) {

	if( Button.state ) {
		$(".myReadingRegular_frame>.readingtext.font1>.content *").removeAttr('style')
		globalVars.Texts.Text2 = $(".myReadingRegular_frame>.readingtext.font1>.content").html().replace(/<p>/g,'').replace(/<\/p>/g,' '); // more or less working -> detect font-weight -> delete style -> convert tag into b-tag or strong-tag and so on // http://stackoverflow.com/questions/11935487/contenteditable-ctrl-b-ctrl-i-and-saving
		//globalVars.isSplit = true;
		//ManusComperator.prototype.mySplitSomething(false,false,false,true);
	ManusComperator.prototype.splitWordsChar(".myReadingRegular_frame>.readingtext.font1>.content", ".myReadingRegular_frame>.readingtext.font2>.content", true, false, false, false, false, false); //last is for softlinebreaks
	//};
	} else {
		$(".myReadingRegular_frame>.readingtext>.content").html(globalVars.Texts.Text2);
	}
	globalVars.comperator.updateCompare();

}

ManusComperator.prototype.updateReadingDistance = function( size, unit ) {
	var M = globalVars.myMath,
		dist_cm = unit === "cm" ? size.distance : size.distance * globalVars.fromCm[unit],
		units = globalVars.allUnits,
		l = units.length;


	globalVars.fromCm.arcmin = 3.14159265358979 / 10800 * dist_cm;

	while (l--) {
		if (!globalVars.realScreen[units[l]]) {
			globalVars.realScreen[units[l]] = {};
		}

		if (units[l] != "px") {
			globalVars.realScreen[units[l]].distance = M.fromCm(dist_cm, units[l]);
		}
	};
	//somehow the ppi resets if anything is done in the distancefield therefore we need this as a bugfix
	///////////////////////////////////////////
	globalVars.emulation_multiplicator = 1;
	globalVars.preset.csspixel = globalVars.initial.csspixel;
	globalVars.fromCm.px = globalVars.realScreen.cm.width / globalVars.realScreen.px.width;
	///////////////////////////////////////////

	this.adjustLayout();

}; // END reading distance


// ManusComperator.prototype.flipHochizontal = function (mySelector) {

//     } */
//     console.log(globalVars.styleLinesWordsChars);
//     globalVars.setCSS( globalVars.styleLinesWordsChars, mySelector + " { " +

//       "-moz-transform: scale(-1, 1); " +
//     "-webkit-transform: scale(-1, 1); " +
//     "-o-transform: scale(-1, 1); " +
//     "-ms-transform: scale(-1, 1); " +
//     "transform: scale(-1, 1); " +
//     "}"
//  )

// } --> css

ManusComperator.prototype.adjustLayout = function() {
	var space = globalVars.realScreen.arcmin.spaceWidth,
		myReadingRegular = '.myReadingRegular',
		selectZoom,
		myReadingFontsize,
		myReadingLineHeight,
		myReadingLetterSpacing,
		myReadingLetterSpacingString,

		myConsultation = '.consultation',
		myConsultationText = '.consultation .text', //font1 / font2
		myConsultationFontsize,
		myConsultationLineHeight,

		myRealsize = '.realsize',
		myRealsizeText = '.realsize .text', //font1 / font2
		myRealsizeFontsize,
		myRealsizeLineHeight,



		myChars = '.myChars',
		myCharsFontsize,
		myCharsLineHeight,

		myUiSelector = "body, .ui_font", //"#header, .module_control, .measurements_in_numbers, #beta
		myUiFontsize,
		myUiLetterSpacing,
		unit,
		arcpx = this.getinPx(1, "arcmin"),
		cmpx = this.getinPx(1, "cm"),
		mmpx = this.getinPx(1, "mm"),
		ptpx = this.getinPx(1, "pt"),
		distanceAdjust = 1,
		readingDistance = globalVars.realScreen.cm.distance,
		csspixel = globalVars.preset.csspixel,
		myRound = globalVars.round,
		myCss,
		gapCenter = 0.03 * space * arcpx * globalVars.emulation_multiplicator, //0.05
		gapOuter =  0.003 * space * arcpx * globalVars.emulation_multiplicator,
		minLineHeight = 2.4, //globalVars.layout.minLineHeight * 1.2,
		tem,
		oldsize_adjustement = 2.0,
		vw = globalVars.realScreen.px.width / 100 * globalVars.emulation_multiplicator,
		increase_size = 1.0;


		// FONTSIZE INITIAL
		distanceAdjust = 1;

		myUiFontsize = 7.5 * arcpx; // 6.5 * distanceAdjust;



		if(globalVars.preset_zoom > 1.0) {
			increase_size = globalVars.preset_zoom; //a min arcmin would be better I think
		}


		if (globalVars.myReadingFontsize.size.split(" ")[1] === "arcmin") {unit = arcpx}

		myReadingFontsize = parseFloat(globalVars.myReadingFontsize.size) * increase_size * unit;// 7.5 * unit;

		//myRound(7 * arcpx,0); // 10 * distanceAdjust; // * (1 - (0.0005 * readingDistance)); //13.5 * arcpx


		if (globalVars.myConsultationFontsize.size.split(" ")[1] === "arcmin") {unit = arcpx}

		myConsultationFontsize = parseFloat(globalVars.myConsultationFontsize.size) * increase_size * unit; //5 * arcpx;  // * distanceAdjust;


		if (globalVars.myCharsFontsize.size.split(" ")[1] === "arcmin") {unit = arcpx}

		myCharsFontsize = parseFloat(globalVars.myCharsFontsize.size)  * increase_size  *  unit; //5 * arcpx;  // * distanceAdjust;


		if (globalVars.myRealsizeFontsize.size.split(" ")[1] === "mm") {unit = mmpx}

		myRealsizeFontsize = parseFloat(globalVars.myRealsizeFontsize.size) * unit; //5 * arcpx;  // * distanceAdjust;



		// = 10 * arcpx; //myReadingFontsize;


	if (space > 2000) {

	} else if (space > 1000) {

	} else if (space < 1000) {

	}


//	if(myUiFontsize < 6) { //px
	//	myUiFontsize = 6;
	//}

/*
	if(readingDistance > 41 ) {
		myReadingFontsize = 14 * arcpx * distanceAdjust;
	}

	if(readingDistance > 60 ) {
		myReadingFontsize = 11 * arcpx * distanceAdjust;
	}

	if(readingDistance > 80 ) {
		myReadingFontsize = 8 * arcpx * distanceAdjust;
		myUiFontsize = 4 * arcpx ;
	}

	if(readingDistance > 100 ) {
		myReadingFontsize = 6 * arcpx * distanceAdjust;
		myUiFontsize = 4 * arcpx ;
	}

	if(readingDistance >= 200 ) {
		myReadingFontsize = 5 * arcpx * distanceAdjust;
		myUiFontsize = 3.5 * arcpx ;
	}


	if(readingDistance >= 300 ) {
		myReadingFontsize = 4 * arcpx * distanceAdjust; //4 am kleinen laptop

		//if(myUiFontsize < 3) {
		myUiFontsize = 3.5 * arcpx ;

		//myReadingFontsize = myRound(myReadingFontsize,0);
		// console.log("myUiFontsize", myUiFontsize, myReadingFontsize)
	//}

	}




	if(readingDistance >= 400 ) {
		myReadingFontsize = 8 * arcpx * distanceAdjust; //8 -> good on HDbeamer // 143cm Width / 430cm distance

		//if(myUiFontsize < 3) {
		myUiFontsize = 3.5 * arcpx ;

		//myReadingFontsize = myRound(myReadingFontsize,0);

	//}


	}*/








	if(myCharsFontsize < globalVars.myCharsFontsize.min) {
		myCharsFontsize = globalVars.myCharsFontsize.min || 10;
	}



//	console.log(myReadingFontsize/arcpx, myReadingFontsize, arcpx);


	if((myReadingFontsize/arcpx)<7) {
		//myReadingLetterSpacing = 0.5 * arcpx;
	} else {
		myReadingLetterSpacing = 0;
	}

	//myUiLetterSpacing = 1 * arcpx;
	// if((myUiFontsize/arcpx)<10) {
	// 	myUiLetterSpacing = 0.5 * arcpx;
	// } else {
	// 	myUiLetterSpacing = 0;
	// }

	/// Max UI
	/////////////////////////////////////


	//maximum fontsize relative to the screenwidth


	if(myUiFontsize > ( 1.4 * vw / oldsize_adjustement)) { //globalVars.myWindow.screen.width
		myUiFontsize = 1.4 * vw / oldsize_adjustement;
		myUiLetterSpacing = 0;

	};



		/// Min PIXEL // Real Pixel
	/////////////////////////////////////

	if(myReadingFontsize < globalVars.myReadingFontsize.min) { // 7 globalVars.layout.minReadingSize_px
		myReadingFontsize = globalVars.myReadingFontsize.min || 7;
	}

	if(myConsultationFontsize < globalVars.myConsultationFontsize.min) { //globalVars.layout.minFonSize_px
		myConsultationFontsize = globalVars.myConsultationFontsize.min || 5; //6; //globalVars.layout.minFonSize_px;
	}

	if(myUiFontsize < (5 * globalVars.emulation_multiplicator)) { // real screen px
		myUiFontsize = 5 * globalVars.emulation_multiplicator;
	}

	if(myUiFontsize < 0.7 * mmpx) { // px
		myUiFontsize = 0.7 * mmpx;
	}

	if(myRealsizeFontsize < globalVars.myRealsizeFontsize.min) { //globalVars.layout.minFonSize_px
		myRealsizeFontsize = globalVars.myRealsizeFontsize.min || 3; //6; //globalVars.layout.minFonSize_px;
	}

	//oldsize adjustement
	myUiFontsize = myUiFontsize * oldsize_adjustement;
	//




	/// Line Height
					///em FrameWidth
	//myReadingLineHeight = 0.050 * $(myReadingRegular + " .textframe").width() / myReadingFontsize; //em
	myReadingLineHeight = 3.2;//3 * 2 // dont;//(myReadingLineHeight < minLineHeight) ? minLineHeight :  myReadingLineHeight;

	myConsultationLineHeight = 3.2;
	myCharsLineHeight = 3.2;


	// adjust checkboxsize coresponding to the uiFontsize
	selectZoom = (myUiFontsize / globalVars.emulation_multiplicator) / 12  ;
	//verhältnis entschärfen ->
	selectZoom = (selectZoom + 7) / 8;


	//(12 * oldsize_adjustement); // (6.5 * arcpx * 2); ///24; // 100%
	//	alert(selectZoom)
	//if (selectZoom <= 0.9) { selectZoom = 1;};
	//alert(selectZoom);






	globalVars.setCSS( "styleAdjust",

		//"input[type=checkbox] { zoom:" + selectZoom + ";" + // myUiFontsize/12
		//"} " +

		//"select { zoom:" + selectZoom + ";" + "} " +

		myReadingRegular + "{ " +
		"font-size:" + myReadingFontsize / csspixel  + "px;" +
		"line-height:" + myReadingLineHeight * myReadingFontsize / csspixel+ "px!important;" + //+ "ex!important;" +
		"letter-spacing:" + myReadingLetterSpacing / csspixel + "px;" +
		"} " +

		myConsultation + "{ " +
		"font-size:" + myConsultationFontsize / csspixel + "px;" +
		//"line-height:" + myConsultationLineHeight * myConsultationFontsize / csspixel + "px!important;" + //+ myConsultationLineHeight + "em!important;" +

		" } " +

		// myConsultationText + "{ " +
		// "line-height:" + myConsultationLineHeight * myConsultationFontsize / csspixel + "px!important;" + //+
		// " } " +


		myChars + "{ " +
		"font-size:" + myCharsFontsize / csspixel+ "px;" +
		"line-height:" + myCharsLineHeight * myCharsFontsize / csspixel + "px!important;" +
		" } " +



		myRealsize + "{ " +
		"font-size:" + myRealsizeFontsize / csspixel + "px;" +
		//"line-height:" + myConsultationLineHeight * myConsultationFontsize / csspixel + "px!important;" + //+ myConsultationLineHeight + "em!important;" +

		" } " +


		myUiSelector + "{ " +
		"font-size:" + myUiFontsize / csspixel + "px;" +
		"letter-spacing: 0.03ex" + //myUiLetterSpacing / csspixel + "px;" +
		"}" +

		".module_left,.module_right, .module_font1, .module_font2"  +
		 " { " +
		"padding: " + gapOuter / csspixel + "px;" +
		"}" +

		".module_left, .module_font1 {" +
			"padding-right:" + gapCenter  / csspixel + "px;" +
		"}" +

		".module_right, .module_font2 {" +
		"padding-left:" + gapCenter / csspixel + "px;" +
		"}" +

		".mode_overlay #container_main .module_left,.mode_overlay #container_main .module_right, .mode_overlay #container_main .module_font1, .mode_overlay #container_main .module_font2 {"  +
		"padding-left: " + (gapOuter + gapCenter) / csspixel  + "px;" +
		"padding-right:" +  0 + "px;" +
		"}" +

		".mode_overlay .myCompareDefault .module_font2, .mode_overlay .myCompareDefault .module_font1 {" +
		"padding: 0px;" +
		"}"

		// ".mode_overlay .chooseFontsContainer .module_font1,.mode_overlay .chooseFontsContainer .module_font2"  +
		//  " { " +
		// "padding: " + gapOuter / csspixel  + "px;" +
		// "}"





		);

// ".module_type .myCompareDefault_frame .comparetext span { " +
// 		//"color: f00;" +
// 		//"border-right: #f00 solid 1px;" +
// 		//"margin-right: -1px;" +

// 	"-webkit-box-sizing: border-box;" +
// 		" box-sizing: border-box;" +
// 		"overflow: visible;" +
// 		"} " +
// 		"#ruler { display:none;} " +

	//tem = myReadingFontsize

	myReadingLetterSpacingString = (myReadingLetterSpacing > 0) ? "LS: +" + myRound(myReadingLetterSpacing/myReadingFontsize) + "tem" : "";



	var FontsizeField = '<input size="5" type="text" name="fontsize" class="fontsize_input" value="' + myRound((myReadingFontsize / arcpx), 1) + '" style="width:auto;  display:inline-block; text-align: right; font-size:inherit; padding:0; font-family: inherit; padding-right: 0.2ex;">';


// autowidth: http://stackoverflow.com/questions/4622086/widthauto-for-input-fields


//maybe container and then to 100%width mit



	 $(".module.reading .module_info").html('<span>' + FontsizeField + "arcmin (" + myRound(myReadingFontsize,1) + 'px / ' + myRound(myReadingFontsize/mmpx,1) + 'mm / ' + myRound(myReadingFontsize/ptpx,1) + 'pt) ' + myReadingLetterSpacingString);


	  $('input[name=fontsize]').on('input',function(e){
			//ManusComperator.prototype.UpdateLayoutFontsizes(".myReadingRegular", "arcmin", $(this).val());
		});


	$(".module.consultation .module_info").html('<span>' + myRound(myConsultationFontsize/arcpx,1) + "arcmin (" + myRound(myConsultationFontsize,1) + 'px / ' + myRound(myConsultationFontsize/mmpx,1) + 'mm / ' + myRound(myConsultationFontsize/ptpx,1) + 'pt) ');


	$(".module.charset .module_info").html('<span>' + myRound(myCharsFontsize/arcpx,1) + "arcmin (" + myRound(myCharsFontsize,1) + 'px / ' + myRound(myCharsFontsize/mmpx,1) + 'mm / ' + myRound(myCharsFontsize/ptpx,1) + 'pt) ' + myReadingLetterSpacingString);


	$(".module.realsize .module_info").html('<span>' + myRound(myRealsizeFontsize/mmpx,1) + "mm (" +  myRound(myRealsizeFontsize/arcpx,1) + "arcmin / " + myRound(myRealsizeFontsize,1) + 'px / ' + myRound(myRealsizeFontsize/ptpx,1) + 'pt) ');



	var css_string = "@media print { "
		+ myReadingRegular + " { "
		+ "font-size:" + myReadingFontsize/ptpx + "pt!important"
		+ "} "
		+ myConsultation + " { "
		+ "font-size:" + myConsultationFontsize/ptpx + "pt!important"
		+ "} "

		+ myChars + " { "
		+ "font-size:" + myConsultationFontsize/ptpx + "pt!important"
		+ "} "

		+ myRealsize + " { "
		+ "font-size:" + myConsultationFontsize/ptpx + "pt!important"
		+ "} "
		+ myUiSelector + "{ "
		+ "font-size:" + myUiFontsize/ptpx + "px;"
		+ "}"
		+ "}";

	globalVars.setCSS( "stylePrint", css_string);

};

ManusComperator.prototype.UpdateLayoutFontsizes = function (selector, unit, fontsize_input, lineheight, letterspacing) {
		var unitpx = this.getinPx(1, "arcmin"),
			arcpx = this.getinPx(1, "arcmin"),
			cmpx = this.getinPx(1, "cm"),
			mmpx = this.getinPx(1, "mm"),
			ptpx = this.getinPx(1, "pt"),
			myRound = globalVars.round,
			csspixel = globalVars.preset.csspixel,
			cssString = "",
			fontsizepx = (fontsize_input * unitpx),
			fontsizeCss = fontsizepx / csspixel,
			lineheightCss = (lineheight * fontsizepx / csspixel) || "inherit",
			letterspacingCss = letterspacing  / csspixel || "inherit";

		cssString =  selector + "{ " +
		"font-size:" + fontsizeCss  + "px;" +
		"line-height:" + lineheightCss + "px" + //!important;" + //+ "ex!important;" +
		"letter-spacing:" + letterspacingCss + "px;" +
		"} "

		globalVars.setCSS( "styleAdjustNew", cssString);

///--––————————————
		var FontsizeField = '<input size="5" type="text" name="fontsize" class="fontsize_input" value="' + fontsizepx/arcpx + '" style="width:auto;  display:inline-block; text-align: right; font-size:inherit; padding:0; font-family: inherit; padding-right: 0.2ex;">';


// autowidth: http://stackoverflow.com/questions/4622086/widthauto-for-input-fields


//maybe container and then to 100%width mit

	 $(".module.reading .module_info").html('<span>' + FontsizeField + "arcmin (" + myRound(fontsizepx,1) + 'px / ' + myRound(fontsizepx/mmpx,1) + 'mm / ' + myRound(fontsizepx/ptpx,1) + 'pt) ');


	 // $('input[name=fontsize]').change(function() { ManusComperator.prototype.UpdateLayoutFontsizes(".myReadingRegular", "arcmin", 12 ) });

	 $('input[name=fontsize]').on('input',function(e){
			//ManusComperator.prototype.UpdateLayoutFontsizes(".myReadingRegular", "arcmin", $(this).val());
		});
	}






ManusComperator.prototype.showBaseline = function() {
//var $textframes = $('textframe')//$('.textframe'),
	//	i, j;

	//	$('<div class="baseline" style="top:' + 1 +'em"></div>').appendTo($('#measurefonts_main'))

	// for (i = 0; i < $textframes.length; i++) {
	// 	for (j = 0; j < 2; j++) {
	// 		$('<div class="baseline" style="top:' + (1 * j) +'em"></div>').appendTo($textframes.eq(i));
	// 	}
	// }

}

// After resizing the window, or after changing the PPI
ManusComperator.prototype.getResize = function() {
	var myWindow = globalVars.myWindow, Text1, Text2, $CompareTextObject, $ReadingTextObject, $justify,
		that = this;

	return function() {


			var pixel = {}, arcmin = {}, arcpx = ManusComperator.prototype.getinPx(1, "arcmin"), csspixel = globalVars.initial.csspixel;

			pixel.viewportWidth = (document.documentElement.clientWidth || window.innerWidth) * csspixel; // (same but faster)  $('body').innerWidth(); //
			pixel.viewportHeight = (document.documentElement.clientHeight || window.innerHeight) * csspixel; //$(window).height(); //
			pixel.viewportDiagonal = globalVars.myMath.getDiagonal(pixel.viewportWidth, pixel.viewportHeight);

			pixel.spaceWidth = $('#container_main').outerWidth() * csspixel; // (same but faster)

			that.addAndConvertToRealScreen(pixel, "px");


			//not nice
			//arcmin.spaceWidth = $('#container_main').outerWidth() * csspixel / arcpx; // (same but faster)
			//arcmin.viewportWidth = document.documentElement.clientWidth * csspixel / arcpx || window.innerWidth * csspixel / arcpx; // (same but faster)  $('body').
			//that.addAndConvertToRealScreen(arcmin, "arcmin");

			that.updater.update();

			that.adjustLayout();

		clearTimeout(globalVars.resizeTimer); //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
		globalVars.resizeTimer = setTimeout(function() {

			that.updateCompare();
			if(!globalVars.textLinesAreSplit) {
			//ManusComperator.prototype.splitWordsChar(".myReadingRegular_frame>.readingtext.font1", ".myReadingRegular_frame>.readingtext.font2", true, false);
			}

		},300);

		if(globalVars.isSplit) {

				$CompareTextObject = $(".comparetext>.content .wrap");
				$ReadingTextObject = $(".readingtext>.content");
				Text1 = $CompareTextObject.eq(1).text();
				Text2 = $ReadingTextObject.eq(1).text();
				//if($ReadingTextObject.find(".word:first")) {
						$CompareTextObject.text(Text1);
						$ReadingTextObject.text(Text2);
				//};
				globalVars.textLinesAreSplit = false;
				globalVars.isSplit = false;

				//console.log(globalVars.UI, $blockUl, globalVars.$blockUl);
				$justify = $("#justify");
				$justify.removeAttr("checked");
				$justify.parent().removeClass("active");
				globalVars.$html.removeClass($justify.name); //$body

			}

			//globalVars.realScreen.cm.distance.update(function(){

			//});

	}
}; // END resize

// Updates all Fields, Texts and Layouts when something has changed.
ManusComperator.prototype.GetUpdater = function() {
	var that = this,
		list = [];

	return {
		update: function(ignore, ignoreParent) {
			var l = list.length,
				current;

			while (l--) {
				if (list[l].update) {
					list[l].update(ignore, ignoreParent);
				}
			}
		},

		push: function(obj) {
			if (obj) {
				list.push(obj);
			}
		}
	}
}; // END get Updater


ManusComperator.prototype.doRoundFontsize = function(Button) {

	if(globalVars.doRoundFontsize_secondtime) { // HACK // I don't know why it gets executed right away
	  RoundFontsize.prototype.toggleCSS();
	}
	globalVars.doRoundFontsize_secondtime = true;
	ManusComperator.prototype.updateTechnicalsizes();
}


ManusComperator.prototype.mySplitSomething = function(monospaceInput, alignInput, splitChars, overlay) {
	var Text1, Text2, Text3,
	monospace = monospaceInput || false,
	doAlign = (alignInput === false) ? false : true; //1.0;
	splitChars = splitChars || false;
	// grausam -> unbedingt aufräumen und skalierbar machen
	// console.log("dosplit")
	Text1 = $(".font1.comparetext .wrap").text()//globalVars.Texts.Text1;
	Text2 = $(".myReadingRegular_frame>.readingtext.font1>.content").text();//globalVars.Texts.Text2;//
	Text3 = globalVars.Texts.Text3; //$(".myChars_frame>.text.font1>.content").html();
	overlay = overlay || false;


	if(globalVars.isSplit) {
		//console.log(globalVars.justifiedFontCombinations[0]);
			if(!overlay) {
				ManusComperator.prototype.splitWordsChar(".font1.comparetext .wrap", ".font2.comparetext .wrap", false, true, monospace, false, true);
				if(doAlign) {
					ManusComperator.prototype.myAlign('.font1.comparetext .char', '.font2.comparetext .char', monospace);
				}
			}
			///#####################


			///#####################

			$(".myReadingRegular_frame>.readingtext.font1>.content").html(Text2);
			$(".myReadingRegular_frame>.readingtext.font2>.content").html(Text2);



			if(overlay) {
				ManusComperator.prototype.splitWordsChar(".myReadingRegular_frame>.readingtext.font1>.content", ".myReadingRegular_frame>.readingtext.font2>.content", true, false, monospace, false, splitChars);
			} else {
				ManusComperator.prototype.splitWordsChar(".myReadingRegular_frame>.readingtext.font1>.content", ".myReadingRegular_frame>.readingtext.font2>.content", true, true, monospace, false, splitChars);
			}

			if(monospace) {

				ManusComperator.prototype.myAlign('.myReadingRegular_frame>.readingtext.font1 .word .char', '.myReadingRegular_frame>.readingtext.font2 .word .char', monospace);
			} else if(doAlign) {
				ManusComperator.prototype.myAlign('.myReadingRegular_frame>.readingtext.font1 .word', '.myReadingRegular_frame>.readingtext.font2 .word');

			}

			//#######################################
	  		globalVars.justifiedTexts.Text1 = $(".font1.comparetext .wrap").html();
	  		globalVars.justifiedTexts.Text2 = $(".myReadingRegular_frame>.readingtext.font1>.content").html();

			//############
			if (globalVars.justifiedFontCombinations[0] !== globalVars.activeFonts.toString()) {
				// does not yet work, when you change the text afterwards --> cause this needs a new justification
				  //split and align charset // does not work cause it should preserve spans within
				if(!overlay) {
		    	ManusComperator.prototype.splitWordsChar(".myChars_frame>.text.font1>.content", ".myChars_frame>.text.font2>.content", false, true, false, false, false, false);
		  		ManusComperator.prototype.myAlign('.myChars_frame>.text.font1 .word', '.myChars_frame>.text.font2 .word', 1.25);

		  		globalVars.justifiedTexts.Text3 = $(".myChars_frame>.text.font1>.content").html();

		  		globalVars.justifiedFontCombinations[0] = globalVars.activeFonts.toString(); //push();
		  		}
	  		} else {
	  			//$(".font1.comparetext .wrap, .font2.comparetext .wrap").html(globalVars.justifiedTexts.Text1);
				//$(".myReadingRegular_frame>.readingtext.font1>.content, .myReadingRegular_frame>.readingtext.font2>.content").html(globalVars.justifiedTexts.Text2);
				$(".myChars_frame>.text>.content").html(globalVars.justifiedTexts.Text3);
	  		}


	} else {
		if($(".font1.comparetext .wrap span:first")) {
			$(".comparetext .wrap").html(Text1);
		}
		///#####################
		if($(".myReadingRegular_frame>.readingtext.font1 .word:first")) {
			$(".myReadingRegular_frame>.readingtext>.content").html(Text2);
		}

		///#####################
		if($(".myChars_frame>.text.font1 .word:first")) {
			$(".myChars_frame>.text>.content").html(Text3);
		}
	}

}

ManusComperator.prototype.doJustify = function(Button) {
	var $frequency,$monospace;

	if( Button.state ) { //TODO: change into radiobox if directly conencted
		$frequency = $("#show_frequency");
		$frequency.removeAttr("checked");
		$frequency.parent().removeClass("active");
		globalVars.$body.removeClass("show_frequency");

		$monospace = $("#monospace");
		$monospace.removeAttr("checked");
		$monospace.parent().removeClass("active");
		globalVars.$body.removeClass("monospace");
	}

	ManusComperator.prototype.mySplitSomething(false,true);
};

ManusComperator.prototype.doUppercase = function(Button) {
	//globalVars.activeScript.scriptStyleBefore = globalVars..scriptStyleBefore; || globalVars.activeScript.scriptStyle; //sets only on first attempt
	//if (!stateBefore) { stateBefore = };

	//console.log(globalVars.writingScripts + "[" + globalVars.activeScript.writingSystem + "].scriptStyle[" + globalVars.activeScript.writingSystem.scriptStyle + "]");
	//better would be that the whole button is not displayed when the writingscript does not have a certain scriptStyle
	if(globalVars.writingScripts[globalVars.activeScript.writingSystem].scriptStyle["uppercase"]) {

		if(Button.state) {
			globalVars.activeScript.scriptStyle = "uppercase";
		} else if(globalVars.activeScript.scriptStyle === "uppercase") {
			globalVars.activeScript.scriptStyle = "lowercase";
		}
		ManusComperator.prototype.normalizeFonts();

	}
};
/*
ManusComperator.prototype.doInvertColor = function(Button) {
var css;

	if() { }

	if(Button.state) { //!globalVars.enableInvertColor

	css = 'html {-webkit-filter: invert(100%);' +
    '-moz-filter: invert(100%);' +
    '-o-filter: invert(100%);' +
    '-ms-filter: invert(100%); }';


	globalVars.enableInvertColor = true;

} else {
	css = 'html {-webkit-filter: invert(0%);' +
    '-moz-filter: invert(0%);' +
    '-o-filter: invert(0%);' +
    '-ms-filter: invert(0%); }';


	globalVars.enableInvertColor = false;
}

    globalVars.setCSS( "styleInvert", css);
}
*/
ManusComperator.prototype.doSmallcaps = function(Button) {
	if(Button.state) {
		globalVars.activeScript.fontStyle = "smallcaps";
	} else {
		globalVars.activeScript.fontStyle = false;
	}
		ManusComperator.prototype.normalizeFonts();
};



ManusComperator.prototype.doMonospace = function(Button) {
	var $justify,$frequency;

	if(Button.state) { //TODO: change into radiobox if directly conencted
		$justify = $("#justify");
		$justify.removeAttr("checked");
		$justify.parent().removeClass("active");
		globalVars.$body.removeClass("justify");

		$frequency = $("#show_frequency");
		$frequency.removeAttr("checked");
		$frequency.parent().removeClass("active");
		globalVars.$body.removeClass("show_frequency");
	}
	ManusComperator.prototype.mySplitSomething(1.25,true);
	};

ManusComperator.prototype.doFrequency = function(Button) {
	var $justify,$monospace;

	if(Button.state) { //TODO: change into radiobox if directly conencted
		$justify = $("#justify");
		$justify.removeAttr("checked");
		$justify.parent().removeClass("active");
		globalVars.$body.removeClass("justify");

		$monospace = $("#monospace");
		$monospace.removeAttr("checked");
		$monospace.parent().removeClass("active");
		globalVars.$body.removeClass("monospace");

	}
	ManusComperator.prototype.mySplitSomething(false,false,true);

	};

ManusComperator.prototype.doFlipChars = function(Button) {
	var $justify,$monospace;

	ManusComperator.prototype.mySplitSomething(false,false,true);
	};


ManusComperator.prototype.updateTechnicalsizes = function(Button) {

	var selectors = ".font1.text, .font2.text", i = 0, j = 0, $objects, fontsize, csspixelstring, ptSize;
	selectors = selectors.split(", ");

	for (i in selectors) {
		$(selectors[i]).each(function() {
			if (globalVars.preset.csspixel !== 1) {
			//fontsize = parseFloat($(this).css("font-size")) * globalVars.preset.csspixel + "px (native)";
			fontsize = $(this).css("font-size") + " (CSS-Pixel) ";
			csspixelstring = " (CSS-Pixel)";

		} else {
			csspixelstring = "";
			fontsize = $(this).css("font-size");
		}
		ptSize = globalVars.round((parseFloat(fontsize) * globalVars.preset.csspixel) / ManusComperator.prototype.getinPx(1, "pt"),1);

      		$(this).prop('title', "Technical Size: ~" + globalVars.round(parseFloat(fontsize),1) + "px" + csspixelstring  + " / ~" + ptSize + "pt");
      		$(this).attr('data-content', fontsize + " / ~" + ptSize + "pt");
    });

	}



	//document.querySelectorAll(".module.reading .font1.readingtext")[0].title = "Technical Size: " + $(".module.reading .font1").css("font-size");
	//$(".module.reading .font1").prop('title', "Technical Size: " + $(".module.reading .font1").css("font-size"));
	//$(".module.reading .font2.readingtext").prop('title', "Technical Size: " + $(".module.reading .font2").css("font-size"));

};

ManusComperator.prototype.addAndConvertToRealScreen = function(obj, unitInput, ignore) {
	var realScreen = globalVars.realScreen,
		isCm = unitInput === "cm",
		isPx = unitInput === "px",
		cm = isCm ? obj : {},
		prop,
		allUnits = globalVars.allUnits,
		unitLength = allUnits.length,
		unitName,
		currentUnit,
		convert,
		converter = globalVars.fromCm;

	//if (isPx) {

		//}

	if (!isCm) {
		(function() {
			var convert = globalVars.fromCm[unitInput], // get From Inch to cm/ cm to Inch
				prop;

			for (prop in obj) {
				cm[prop] = obj[prop] * convert;
			}
		})();
	}

	while (unitLength--) {
		unitName = allUnits[unitLength];

		if (unitName !== ignore) {

			if (!globalVars.realScreen[unitName]) {
				globalVars.realScreen[unitName] = {}
			}
			currentUnit = globalVars.realScreen[unitName];
			convert = converter[unitName];

			for (prop in cm) {
				currentUnit[prop] = cm[prop] / convert;
			}
		}

	}

}; // END add and comvert

ManusComperator.prototype.getinPx = function(v, u) {
	return v * globalVars.fromCm[u] / globalVars.fromCm.px;
}

ManusComperator.prototype.GetUI = function(comperator) {
	var $body = globalVars.$body,
		$html = globalVars.$html,
		decimal = globalVars.myMath.decimal,
		UI = this,
		UIFunc = new comperator.GetUIFunc(comperator);


	this.selectfonts = function ( button, $blockUl ) {
		var $select = $( "#" + button.id ), //unfortunately > + " .select" < does not work, cause its not there yet!
			$input = $select.find( "inputs" ),
			input = $input[0],
			fontname,
			l = button.id.match(/\d+/)[0] - 1; //get number, first //valueOf(); //parseInt(button.id, 10); //.toInt()

	//	$select.trigger('click');

		$select.change(function() {//$select.on( "input", function () { //did not work in safari??

			fontname = $select.find( "select" ).val()

			//Helvetica Neue', Blank;
			if(!globalVars.activeFonts.toString().match(fontname + "', Blank;") ) { //so it does not get executed while editing the style tag
				//globalVars.setCSS( button.changeId + "Style", "." + button.changeId + " {font-family: '" + input.value + "', 'Blank';}" );

				console.log("setCSS");
				globalVars.setCSS( button.changeId + "Style", "." + button.changeId + " {font-family: '" + $select.find( "select" ).val() + "', 'Blank';}" );

				comperator.normalizeFonts();
				comperator.updateCompare();
			}

		} )
	},

	this.toggle = function(button, $blockUl) {
		var state = button.default,
			changeFunc = button.changeFunc,
			name = button.id,
			that = this,

			$li = $('<li/>', {
				text: button.name
			}).appendTo($blockUl),

			$checkBox = $('<input>', {
				type: 'checkbox',
				name: name,
				id: name
				//,
				//state: state
			}).prependTo($li);

		this.name = name;
		this.state = state;
		this.changeFunc = changeFunc;
		this.func = UIFunc.toggle;
		this.$checkBox = $checkBox;
		this.$li = $li;
		this.changeVar = button.changeVar;
		this.submitchangeFunc = button.submitchangeFunc;

		$li.on("click", function(event) {
			that.func();
		});

		if (this.func) {
			this.func( true );
		} // Check State to give body id etc. on start-up

		return false;
	}; // END UI.toggle

	// Function for creating a new Textfield
	this.textinput = function(button, $blockUl) {
		var $li = $('<li/>').appendTo($blockUl),
			button_title = button.title || "",
			$fieldset = $('<fieldset id="' +   button.id + '_fieldset" title="' + button_title + '" ><legend>' + button.name + '</legend></fieldset>').appendTo($li),
			$ul = $('<ul/>').appendTo($fieldset),

			inputs = button.inputs,

			units = button.units,
			$unitSelect, $label,

			l = inputs.length,
			c = 0,

			thisTextblock = this;

		this.currentUnit = units ? units[0] : false;
		this.func = UIFunc.changeTextfield;
		this.changeFunc = button.changeFunc;
		this.fields = [];
		this.updater = comperator.updater.update;

		// Add Textfields
		do {
			this.fields.push(this.setupTextfield(inputs[c], $ul, button.id))
		} while ((c += 1) < l);

		// Add Unit Selector if necesary
		if (units && units.length) {
			l = units.length;
			c = 0;
			$label = $('<label class="select"/>').appendTo($ul); //.appendTo($('<li/>'))
			$unitSelect = $('<select/>').appendTo($label);//'<li/>').appendTo($ul);
			do {
				$('<option/>', {
					text: units[c]
				}).appendTo($unitSelect);
			} while ((c += 1) < l);

			$unitSelect.on('change', function(event) {
				thisTextblock.currentUnit = $unitSelect.val();
				comperator.updater.update();
			});
		}

		return this;
	} // END UI.textinput


	// Function for creating a new Textfield inside a Block
	this.textinput.prototype.setupTextfield = function(input, $ul, parentId) {
		var name = input.name,
			id = input.id,
			value = input.value,
			$li = $('<li/>').appendTo($ul),

			$label = $('<label/>', {
				"for": id,
				text: name
			}).appendTo($li),

			$input = $('<input type="number"/>', {
				type: "text",
				id: id,
				name: name,
				value: value
			}).appendTo($li);

		$input.keyup(this.getChangeTextfield($input, id, parentId, this));

		return {
			$obj: $li,
			$input: $input,
			name: name,
			id: id,
			partentId: parentId,
			value: value
		}
	}; // END UI.textinput setupTextfield

	this.textinput.prototype.update = function(ignore, ignoreParent) {
		var fields = this.fields,
			l,
			current;

		if (fields) {
			l = fields.length;

			while (l--) {
				current = fields[l];

				if (ignore !== current.id || ignoreParent !== current.partentId) {
					current.$input.val(decimal(globalVars.realScreen[this.currentUnit][current.id]));
				}
			}
		}
	}; // END UI.textinput update

	// Function when something in a textfield is changed
	this.textinput.prototype.getChangeTextfield = function($input, id, parentId, that) {
		return function() {

			var value = this.value,
				numberValue = parseFloat(value),
				correctString = !isNaN(numberValue) || value === "",
				entered = {};

			//$input.css("color", correctString ? "#000" : "#F00");

			if (correctString) {
				entered = {};
				entered[id] = numberValue;
				if (that.changeFunc) {
					comperator[that.changeFunc](entered, that.currentUnit);
				}
			}

			that.editing = false;
			that.updater(id, parentId);
		}
	}; // END UI.textinput getChangeTextfield

	this.ruler = function(button, $blockUl) {
		var lines = [];

		this.$li = $('<li/>', {
			text: button.name,
			css: {
				"display": "block",
				"clear": "both",
				"position": "relative"
			}
		}).appendTo($blockUl);

		this.$ul = $('<ul/>').appendTo(this.$li);
		this.unit = button.unit;
		this.drawNth = button.drawNth;
		this.update = UIFunc.rulerUpdate;
	} // END ruler

}; // END UI

ManusComperator.prototype.GetUIFunc = function(comperator) {
	var $body = globalVars.$body,
		$html = globalVars.$html,
		decimal = globalVars.myMath.decimal,
		UIFunc = this;

	this.toggle = function( first ) {
		this.state = first ? this.state : !this.state;
		if (this.state) {
			this.$checkBox.prop("checked", true); //"checked"
			this.$li.addClass("active");
			$html.addClass(this.name); //$body
		} else {
			this.$checkBox.removeAttr("checked");
			this.$li.removeClass("active");
			$html.removeClass(this.name); //$body
		}

		globalVars[ this.changeVar ] = this.state;

		if (this.changeFunc) {
			comperator[this.changeFunc](this, this.submitchangeFunc);
		};
	};

	this.rulerUpdate = function() {
		var unitpx = comperator.getinPx(1, this.unit),
			l = globalVars.realScreen.arcmin.viewportWidth, //Math.floor(this.$li.width() / unitpx),
			c = 1,
			drawNth = this.drawNth,
			strokeWidth = 1,
			string ="",
			csspixel = globalVars.preset.csspixel;

		this.$ul.empty();

		while ((c += drawNth) < l) {
			if ((c % (drawNth * 20)) === 1) {
				strokeWidth = 5 * unitpx; //4
			} else if ((c % (drawNth * 10)) === 1) {
				strokeWidth = 5 * unitpx; //3
			} else if ((c % (drawNth * 5)) === 1) {
				strokeWidth = 5 * unitpx; //2
			} else {
				strokeWidth = 1 * unitpx;
			}


			if (c === 200 + 1) {
				string = " (5 " + this.unit + ")";
			} else if (c === 200 + drawNth + 1) {
				strokeWidth = 6 * unitpx;
				string = " (6 " + this.unit + ")";
			} else if (c === 200 + drawNth*2 + 1) {
				strokeWidth = 7 * unitpx;
				string = " (7 " + this.unit + ")";
			} else if (c === 200 + drawNth*3 + 1) {
				strokeWidth = 8 * unitpx;
				string = " (8 " + this.unit + ")";
			} else if (c === 200 + drawNth*4 + 1) {
				strokeWidth = 9 * unitpx;
				string = " (9 " + this.unit + ")";
			} else if (c === 200 + drawNth*5 + 1) {
				strokeWidth = 10 * unitpx;
				string = " (10 " + this.unit + ")";
			} else {
				string = "";
			}

			strokeWidth = strokeWidth * (1 / csspixel ); //Retina quickfix //not nice! don’t know yet, where the error is



			$('<li/>', {
				text: c - 1,
				css: {
					"position": "fixed",
					"display": "block",
					"top": 0,
					"left": (c - unitpx) * unitpx, //(c - strokeWidth) * unitpx,
					"height": globalVars.realScreen.px.height - 10, //globalVars.realScreen.px.viewportHeight - 10,
					"width": 0, //unitpx - strokeWidth,
					"border-left-width": 1 * unitpx + "px"//strokeWidth
				}
			}).appendTo(this.$ul)
			$('<li/>', {
				text: c - 1 + string,
				css: {
					"position": "fixed",
					"display": "block",
					"top": (c - strokeWidth) * unitpx,
					"left": 0,
					"height": unitpx - strokeWidth,
					"width":  globalVars.realScreen.px.width - 10, //globalVars.realScreen.px.viewportWidth - 10,
					"border-top-width": strokeWidth + "px"
				}
			}).appendTo(this.$ul)
		}
	}

} // END UIFunc



ManusComperator.prototype.ChangeColorFg = function(MyColorInput) {
	var myColor = MyColorInput, //toBackgroundColor
  myColorSelection = hexToRgbString(myColor, 0.05),
  toColorText = "body, button, .button, ul li, #mainForm>ul>li, input, option, select, #fontselect1>input, #fontselect2>input, label.select:after, input",
  toColorBorder = "",

  toColorBorderSpecial = "button, .button, ul li, #mainForm>ul>li, .button-group, .btn-primary, #fontselect1 > input, #fontselect2 > input, .select select, #measureInput select, #moreOptionsContainer.open ul, div.css_edit style.open",



  toColorTextShadow = ".show_outline .module_type, .show_outline .outline", //.poster3d, //works on big and small
  toColorTextStroke = ".show_outline .module_type, .show_outline .outline", // actually better for small text
	outline_stroke_width_2 = 0.2,
	outline_stroke_width_1 = 0,
	outline_stroke_width_45_2 = 1.0,
	outline_shadow_right_2 = outline_stroke_width_2 + "px ",
	outline_shadow_right_1=  outline_stroke_width_1 + "px ",
	outline_shadow_left_2 = "-" + outline_stroke_width_2 + "px ",
	outline_shadow_left_1=  "-" + outline_stroke_width_1 +"px ",
	outline_shadow_top_2 =  "-" + outline_stroke_width_2 +"px ",
	outline_shadow_top_1=   "-" + outline_stroke_width_1 + "px ",
	outline_shadow_bottom_2 = outline_stroke_width_2 + "px ",
	outline_shadow_bottom_1= outline_stroke_width_1 +"px ",
	outline_shadow_right_45_2 = outline_stroke_width_45_2 + "px ",
	outline_shadow_left_45_2 = "-" + outline_stroke_width_45_2 + "px ",
	outline_shadow_top_45_2 =  "-" + outline_stroke_width_45_2 +"px ",
	outline_shadow_bottom_45_2 = outline_stroke_width_45_2 + "px "
	;


  globalVars.setCSS( "styleColor",
  	toColorText + " { " +
	"color:" + myColor + ";" +
	"} " +


	toColorBorder + " { " +
	"border-color:" + myColor + ";" +
	"} "+

	 toColorBorderSpecial + " { " +
	"border-color:" + hexToRgbString(myColor, 0.4) + ";" + //{ border-right: 1px solid lighten($Color_Type, 80%);
	"} "+


	toColorTextStroke + " { " +
	"-webkit-text-stroke-color:" + myColor + ";" +
	"} " +
	toColorTextStroke + " { " +
	"text-stroke-color:" + myColor + ";" +
	"} " +

	toColorTextShadow + " { " +

	"-webkit-text-stroke: 1px " + myColor + ";" +
	"text-stroke: 1px " + myColor + ";" +

	/*"text-shadow: " +
	//45 °
	//rechts  unten 2
	outline_shadow_right_45_2 + outline_shadow_bottom_45_2 + "0 " + myColor + ", " +
	 //links  oben
	  outline_shadow_left_45_2 + outline_shadow_top_45_2 + "0 " + myColor + ", " +
	 //links  unten
	 outline_shadow_left_45_2 + outline_shadow_bottom_45_2 + "0 " + myColor + ", " +
	 //rechts oben
	 outline_shadow_right_45_2 + outline_shadow_top_45_2 +"0 " + myColor + ", " +

	//
	//unten
	"0px " + outline_shadow_bottom_2 + "0 " + myColor + ", " +
	//oben
	"0px " + outline_shadow_top_2 + "0 " + myColor + ", " +
	//links
	outline_shadow_left_2 + "0px " + "0 " + myColor + ", " +
	//rechts
	outline_shadow_right_2 + "0px " + "0 " + myColor + ", " +



	// ~22°
	 //rechts unten
	 outline_shadow_right_1 + outline_shadow_bottom_2 + "0 " + myColor + ", " +
	 //links  unten
	 outline_shadow_left_1 + outline_shadow_bottom_2 + "0 " + myColor + ", " +
	 //rechts oben
	 outline_shadow_right_1 + outline_shadow_top_2 + "0 " + myColor + ", " +
	 //links  oben
	 outline_shadow_left_1 + outline_shadow_top_2 + "0 " + myColor + ", " +


	 //correction

	// //links
	 "-2px 0px 0 " + myColor + ", " +
	// //rechts
	 "2px 0px 0 " + myColor + ", " +
	 //unten
	"0px 2px 0 " + myColor + ", " +
	//oben
	"0px -2px 0 " + myColor + ";" +


	"opacity: " + 0.8 + ";" +
	*/
	"} "  +
	"/* Mozilla based browsers  select,*/ ::-moz-selection { background-color:" + myColorSelection + ";}" +
	"/* Works in Safari  select,*/ ::selection { background-color: " + myColorSelection + "; }"
  );

  // $body.css('color', myColor);
  // $('button, .button, ul li, input, option, select').css('color', myColor);
  // $('button, .button, .button-group, .btn-primary').css('border-color', myColor);
}


ManusComperator.prototype.ChangeColorBg = function(MyColorInput) {
	var toColorText = "", //.show_outline .outline, .show_outline .outline_big, .poster3d, .show_outline .module_type",
	toColorBg = "body, button, .button, #mainForm>ul>li, .button-group, #moreOptionsContainer.open ul, input, .select select, div.css_edit style.open",
	toColorGradient = ".navbar",
	myColor = MyColorInput;


	  globalVars.setCSS( "styleBgColor",
	  	toColorText + " { " +
		"color: " + myColor + ";" +
		"-webkit-text-fill-color: " + myColor + ";" +
		"text-fill-color: " + myColor + ";" +
		"} " +

	  	toColorBg + " { " +
	  	"background-color: " + myColor + ";}" +


		toColorGradient + " { " +
		//"background: none;"

		"background-size: 100%;" +
  "background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, " + hexToRgbString(myColor, 0.95) + "), color-stop(60%, " + hexToRgbString(myColor, 0.95) + "), color-stop(70%, " + hexToRgbString(myColor, 0.8) + "), color-stop(100%, " + hexToRgbString(myColor, 0.1) + "));" +
  "background-image: -moz-linear-gradient(top, " + hexToRgbString(myColor, 0.95) + " 0%, " + hexToRgbString(myColor, 0.95) + " 60%, " + hexToRgbString(myColor, 0.8) + " 70%, " + hexToRgbString(myColor, 0.1) + ");" +
  "background-image: -webkit-linear-gradient(top, " + hexToRgbString(myColor, 0.95) + " 0%, " + hexToRgbString(myColor, 0.95) + " 60%, " + hexToRgbString(myColor, 0.8) + " 70%, " + hexToRgbString(myColor, 0.1) + ");" +
  "background-image: linear-gradient(to bottom, " + hexToRgbString(myColor, 0.95) + " 0%, " + hexToRgbString(myColor, 0.95) + " 60%, " + hexToRgbString(myColor, 0.8) + " 70%, " + hexToRgbString(myColor, 0.1) + ");" +
		"} "
	  )
}

// Change Color
/////////////////////////////////////////////
////////////////////////////////////////////////

$("#color_fg").change(function(){

   ManusComperator.prototype.ChangeColorFg($(this).val());

});

$("#color_bg").change(function(){

	ManusComperator.prototype.ChangeColorBg($(this).val());

});

$("#color_invert").on("click", function(event) { //Color Switch
	var $colorFg = $("#color_fg"),
	 $colorBg = $("#color_bg"),
	 colorFg = $colorFg.val(),
	 colorBg = $colorBg.val(),
	 css;

	 $colorFg.val(colorBg);
	 $colorBg.val(colorFg);

	 ManusComperator.prototype.ChangeColorFg(colorBg);
	 ManusComperator.prototype.ChangeColorBg(colorFg);



});


// $(".module_type.type_myCompareDefault").fitText();
