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
					"font-size" : globalVars.oldsize_em_adjust + "em"
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
		spanClass = { "class" : "measuring_square" };

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

	this.$fonts = $( "." + this.fontId ).not( "." + this.fontId + "_scale" );
	this.$compareModuleInfo = $('.compare.module .module_info');
	this.$compareText = this.$fonts.filter( ".comparetext" );
	this.$compareWrap = this.$compareText.find( ".wrap" );
	this.$compareParent = this.$compareText.parent();
	this.$compareText.keyup( this.compareChange( this ) );

	this.measure();
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

				console.log("ESCAPE", thisFont.$compareWrap.find("span").length);

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

	this.fontName = this.$font.css("font-family");
	this.$measureKegel.css({"font-family": this.fontName});

	this.fontsizeadjust =  globalVars.measure_fontsize / this.$measureXHeight.height();

	// console.log("fontsizeadjust", this.fontName, this.fontsizeadjust)
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
		typographicfontsize,
		newFontEm = globalVars.normalizeFonts ? this.fontsizeadjust * globalVars.display_em : globalVars.oldsize_em_adjust;


	this.$compareText.css ({
			"-webkit-transition": "font .3s ease-in"
		});

	globalVars.setCSS( globalVars.styleNormalize, "." + this.fontId + " { " +
		"font-size:" + newFontEm + "em;" +
		"} "
	);



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
	}
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
		thisFontSize,
		arcpx = this.getinPx(1, "arcmin"),
		cmpx = this.getinPx(1, "cm"),
		mmpx = this.getinPx(1, "mm"),
		ptpx = this.getinPx(1, "pt");
		//re = new RegExp("^\\/" + "[" + globalVars.basicShapes.normal + "]" + "\\/\\d+$");
//regExVar(
	//re = new RegExp('\\['+globalVars.basicShapes.normal+'\\]');

	while( l -- ) {
		thisFont = fonts[l];

		thisFont.$compareText.css ({
			"-webkit-transition": "none"
		});

		thisFont.$compareParent.css({
			"font-size" : 10
		});

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
			thisFontSize = 10 * ratio;
			thisFont.$compareParent.css({  //Ascenders
				"font-size" : ( 10 * ratio ) +"px",
				"margin-top" : (-3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( -4 * ratio ) + "px"
			})
			if(reDescenders.test(thisText)) { //Descenders

			thisFont.$compareParent.css({
				"font-size" : ( 10 * ratio )+"px",
				"margin-top" : ( -3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( -2 * ratio ) + "px"
			})
			//
				//"padding-bottom" : ( 10 * ratio ) + "px",
			}
			if(reAscenders.test(thisText) && reDescenders.test(thisText)) { //Asc + Desc
			thisFont.$compareParent.css({
				"font-size" : ( 10 * ratio )+"px",
				"margin-top" : ( -3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( 0 * ratio ) + "px"

			})
			//

			}
		} else {
			if((10*ratio) > (vh / 3 *1.3)) {
				ratio = (vh / 3 * 1.3) / 10;
			}
			thisFontSize = 10 * ratio;
			thisFont.$compareParent.css({ /// normal
				//////////
				// "font-size" : ( 10 * ratio ),
				// "margin-top" : ( -2 * ratio ) + "px",
				// "line-height": ( 12 * ratio ) + "px",
				// "margin-bottom" : ( -2 * ratio ) + "px"
				"font-size" : ( 10 * ratio ),
				"margin-top" : (-3 * ratio ) + "px",
				"line-height": ( 25 * ratio ) + "px",
				"margin-bottom" : ( -4 * ratio ) + "px"
			})
		} //"padding-bottom" : ( 1 * ratio ) + "px",

		// console.log("startsplitandalign");
		//






		thisFont.$compareParent.css("font-size");
		thisFont.$compareModuleInfo.html('<span>maximum (' + myRound(thisFontSize/arcpx,1) + "vu / " + myRound(thisFontSize,0) + 'px / ' + myRound(thisFontSize/mmpx,1) + 'mm / ' + myRound(thisFontSize/ptpx,1) + 'pt) </span>');

	}
}
