"use strict"


/// W R A P    C H A R A C T E R S
//////////////////////////////////////
jQuery.fn.wrapChars= function(myclass)
	{

	 //difficulty to not split htmltags and wordspace ' '
	 var chars = this.html().split(""),
			 openTag_1 = '<span class="',
			 openTag_2 = '">',
			 closeTag = '</span>',
			 i = 0,
			 charstring = "";

		for (i = 0; i < chars.length; i++) {
			 charstring += openTag_1 + myclass + " " + chars[i] + openTag_2 + chars[i] + closeTag;
			 }

	// ', '</span>
	 this.html(charstring)
	 //this.html( openTag + chars.join( closeTag + openTag ) + closeTag );

}

/// W R A P    W O R D S
//////////////////////////////////////
jQuery.fn.wrapWords= function( openTag, closeTag, wspaceTagInput )
	{
	 var wspaceTag = wspaceTagInput || '<span class="wspace"> </span>',
			 words = this.html().split(" ");


	 this.html( openTag + words.join( closeTag + wspaceTag + openTag ) + closeTag );



}

/// W R A P    L I N E S
//////////////////////////////////////
jQuery.fn.wrapLines = function( openTag, closeTag )
	{
		// var dummy = this.clone().css({
		// 				top: -9999,
		// 				left: -9999,
		// 				position: 'absolute',
		// 				width: this.width()
		// 		}).appendTo(this.parent()),
		// text = dummy.text().match(/\S+\s+/g) || dummy.text() ;

		//var words = text.length
		var text,
			lastTopOffset = 0,
			lines = [],
			lineText = '',
			topOffset;

		//span each word
		text = "<span>" + this.html().split(" ").join("</span> <span>") + "</span>";

		this.html(text);

		$('span', this).each(function(i,el) { //much faster than before
		    topOffset = this.offsetTop;
		    if ( topOffset !== lastTopOffset && i !== 0 )
			{
				lines.push( lineText );
				lineText = this.innerHTML + " ";
			} else {
				lineText += this.innerHTML + " "
			};
			lastTopOffset = topOffset;
		});

		lines.push( lineText );


	/*
		for (var i = 0; i < words; ++i ) { // much slower

			dummy.html(
					text.slice(0,i).join('') +
					text[i].replace(/(\S)/, '$1<span/>') +
					text.slice(i+1).join('')
			);

			topOffset = jQuery( 'span', dummy )[0].offsetTop// .offset().top; //
			if ( topOffset !== lastTopOffset && i != 0 )
			{
				lines.push( lineText );
				lineText = text[i];

			} else {
				lineText += text[i];
			};

			lastTopOffset = topOffset;
		}
		lines.push( lineText );
		*/
		//dummy.remove();


		this.html( openTag + lines.join( closeTag + openTag ) + closeTag );
	};

ManusComperator.prototype.myAlign = function (originalInput, copyInput, MonospaceWidthInput) {
	// equalize Wordwidth (should be a function)

		/////////////////////////////////
		var $myOriginal = $(originalInput),
				$myCopy = $(copyInput),
				mycolor,
				mywidth,
				myCopywidth,
				newWidth,
				monoWidth = MonospaceWidthInput || false,
				doEachCharOnce = false,
				fontSize,
				centeradjust,
				wordspace,
				myClassname,
				myCSS = "",
				mySelectors,
				//fontName1 = $(".font1:eq(0)").css("font-family"),
				//fontName2 = $(".font2:eq(0)").css("font-family"), //.split(",")[0]
				//OriginalWidthsObject = globalVars.measuredFonts[fontName1].WidthsObject,
				//CopyWidthsObject = globalVars.measuredFonts[fontName2].WidthsObject, //would be nice if each word is only measured once on the entire page // but could be also imprecise
				OriginalWidthsObject = {},
				CopyWidthsObject = {},
				style,
				i = $myOriginal.length,
				str = 'aaa', //countable / increamentable string, like number: 000
				abcNumber = str,
				CSSConformName = {},
				myCSSClassname,
				key,
				technicalFontSizeOrig = parseFloat($myOriginal.css("font-size"),10),
				technicalFontSizeCopy = parseFloat($myCopy.css("font-size"),10),
				script = globalVars.activeScript.writingSystem, // latin
				scriptStyle = globalVars.activeScript.scriptStyle,
				averageheight = globalVars.writingScripts[script].scriptStyle[scriptStyle].typographicMeasurement.averageheight;
				//


					// console.log("doalign",originalInput, i, monoWidth);
					// FUTURE 1
					// if($myOriginal.eq(0).hasClass('char')) {
					// 	doEachCharOnce = true;

					// }
					//

				fontSize = parseFloat($myOriginal.closest(".textframe").css("font-size"),10);

				if(monoWidth) {




					centeradjust = (monoWidth*2 * fontSize);
					style = {
								//"color": mycolor,
								"width": (monoWidth *  fontSize) + centeradjust + "px",
								"margin-left": - centeradjust /2 - 1 + "px",
								"margin-right": - centeradjust / 2 - 1 + "px",
								"text-align": "center",
								// "position" : "absolute",
								"overflow" : "visible",
								// "left" : "50%",
								// "-webkit-transform": "translateY(0%) translateX(-50%)"
												 };

						$myOriginal.css(style);
						$myCopy.css(style);
						// position: absolute; //left: 50%;//top: 50%; //-webkit-transform: translateY(-50%) translateX(-50%);

				} else {



						$myOriginal.each(function(i,el) { //much faster than before
							myClassname = this.innerText || this.textContent;
							myCSSClassname = myClassname;
							if (!OriginalWidthsObject[myClassname]) {
								OriginalWidthsObject[myClassname] = this.clientWidth / fontSize;

							}
							if ( !/^[a-zA-Z]*$/.test(myClassname) && !CSSConformName[myClassname]) { //not yLetters  || myClassname.match(" ")
									str= ((parseInt(str, 36)+1).toString(36)).replace(/0/g,'a');
									abcNumber = '' + str;
									//if(myClassname.match(" ")) { abcNumber = "space";}
									CSSConformName[myClassname] = "alias_" + abcNumber;
								}
							if(CSSConformName[myClassname]) {
								myCSSClassname = CSSConformName[myClassname];
							} else {
								CSSConformName[myClassname] = myCSSClassname;
							}

							this.className = this.className + " w_" + myCSSClassname;
						});
						//globalVars.measuredFonts[fontName1].WidthsObject = OriginalWidthsObject;

						///^[a-zA-Z\-_ ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]$/.test(myString) //http://stackoverflow.com/questions/2013451/test-if-string-contains-only-letters-a-z-%C3%A9-%C3%BC-%C3%B6-%C3%AA-%C3%A5-%C3%B8-etc

						$myCopy.each(function(i,el) {
							myClassname = this.innerText || this.textContent;
							if (!CopyWidthsObject[myClassname]) {
								CopyWidthsObject[myClassname] = this.clientWidth / fontSize;
							}
							this.className = this.className + " w_" +  CSSConformName[myClassname];
						});
						//globalVars.measuredFonts[fontName2].WidthsObject = CopyWidthsObject;
						//var i = Object.getthelength(OriginalWidthsObject); //function in global.js


						for (key in CSSConformName) {
						        if (CSSConformName.hasOwnProperty(key)) {
						        		newWidth = (CopyWidthsObject[key] > OriginalWidthsObject[key]) ? CopyWidthsObject[key] : OriginalWidthsObject[key];

										myCSS += ".font1 .w_" + CSSConformName[key] + "{ width:" + newWidth / globalVars.fonts[0].fontsizeadjust * averageheight + "em;" + " } "; //originalInput +
										myCSS += ".font2 .w_" + CSSConformName[key] + "{ width:" + newWidth / globalVars.fonts[1].fontsizeadjust * averageheight + "em;" + " } "; //copyInput
						        } //size++;
						 }

						// myCSS += ".font1 .word.char.wspace " + "{ width:" + 0.4 * globalVars.fonts[1].fontsizeadjust * averageheight + "em;" + " } "; //originalInput +
						// myCSS += ".font2 .word.char.wspace " + "{ width:" + 0.4 * globalVars.fonts[0].fontsizeadjust * averageheight + "em;" + " } ";

						// while(i--) {

						// }


		    				//mywidth =
		    				//myCopywidth = $myCopy[i].width; //.eq(i)



		    				//$myCopy[i].className = this.className;

		    				//




						globalVars.setCSS( "styleJustifiedText" + originalInput.split(" ").join(""), myCSS + " .word {text-align: center;}");

		    			/*
						var cells = myTable.rows[0].children;

						for ( var i = 0; i < cells.length; i++ ){
						   cells[i].style.width = cells[i].offsetWidth + "px";
						}
		    			*/


/*
						while (i--) {

							// FUTURE 1
							//if $myOriginal.eq(i).hasClass(match )
							// nur jedes erste Zeichen messen -> (im Font, in % (oder original gelesene Größe?)) speichern ->
							// dann in dieser whileschleife nur wert zu weisen und nicht mehr ausmessen

							$myOriginal.eq(i);
							$myCopy.eq(i);
							mywidth = $myOriginal.eq(i).width();
							myCopywidth = $myCopy.eq(i).width();

							newWidth = (myCopywidth > mywidth) ? myCopywidth : mywidth;

							// in CSSHeader schreiben !!!
							style = {
								//"color": mycolor,
								"width": newWidth + "px",
								"text-align": "center"
												 };

							$myCopy.eq(i).css(style);
							$myOriginal.eq(i).css(style);

							//console.log(mywidth, "width", originalInput, "=", newWidth);


						} */



			}

}




ManusComperator.prototype.splitWordsChar = function (originalInput, copyInput, doLinesInput, doWordsCharsInput, monospaceInput, softLinebreaks, doChars, preserveSpans) {
var $target = $(originalInput),//.myReadingRegular_frame>.readingtext.font1,
	$copy = $(copyInput), //.font2.comparetext .wrap //
	$words, $lines,
	charArray = globalVars.chars.latin_basic.split(""),
	$currentChar,
	l,
	doLines = doLinesInput  || false,
	softLinebreaks = softLinebreaks || false,
	doWordsChars = doWordsCharsInput || false,
	doChars = doChars || monospaceInput || false, //somehow it is not true if doLines is true e.g. MyRegular
	monospace = monospaceInput || false,
	preserveSpans = preserveSpans || false,
	linewrapPseudoWordSpacing = monospace ? (monospace * 0.3) : 0.05,
	WordSpacing = monospace ? monospace : 0.35, //0.5ex
	Text2;
//console.log(monospace + " m " + linewrapPseudoWordSpacing);
	/*pseudo wordspacingonly for line detection not the actual word-spacing*/


	$target.css({"word-spacing": linewrapPseudoWordSpacing + "em"})


	if($target.find(".word:first")) {
		Text2 = $target.text();
		$target.text(Text2);
		$copy.text(Text2);
	}




	 if(doLines) {

			 if(softLinebreaks) {

			 	$target.wrapLines( '', '<wbr>' ); // one word is missing ... ?
			 	globalVars.textLinesAreSplit = false;
			 } else {
			 	$target.wrapLines( '<span class="line">', '</span><br />' ); // one word is missing ... ?
			 	globalVars.textLinesAreSplit = true;
			 }



	}



	$target.css({"word-spacing": ""})

	if(doWordsChars) {
		globalVars.isSplitWords = true;
		$lines = $('.line', $target);

		$lines = $lines.length ? $lines : $target;
		l = $lines.length
//"width": (monoWidth *  fontSize) + centeradjust + "px",
var fontSize = parseFloat($target.closest(".textframe").css("font-size"),10);
//centeradjust = (monoWidth*2 * fontSize);

		while (l--) {
				$lines.eq(l).html($lines.eq(l).text());
				$lines.eq(l).wrapWords( '<span class="word">', '</span>', '<span class="word char wspace"'  + '> </span>')
				// ' style="width:' + (WordSpacing * fontSize) + 'px"'align
				// in CSS-Header schreiben
		}; //invisible unicode space (osx: alt+ctrl+space)


		//wrap Characters
		if(doChars) {
			$words = $(".word", $target);
			l = $words.length;
			while (l--) {
						$words.eq(l).wrapChars('char');
			};
		};

	 } else {

	 	globalVars.isSplitWords = false;
	 }



	 $copy.html($target.html());


	 globalVars.textLinesAreSplit = true;
	 globalVars.isSplit = true;

	 l = charArray.length;
	 // console.log("hover", charArray, l, charArray[0], 'hover_' + charArray[0] );
	 while (l--) {
	 	//$currentChar = ;
	 	//$currentChar.char = charArray[l];
			 $(".char." + charArray[l] ).on({
		    mouseenter: function () {

		        //stuff to do on mouse enter
		        globalVars.$html.addClass('hover_' + this.innerHTML ); //$body
		    },
		    mouseleave: function () {
		        //stuff to do on mouse leave

		        globalVars.$html.removeClass('hover_' + this.innerHTML);
		    }
			});
	 }

}



// .myReadingRegular_frame>.readingtext.font1,
// .font2.comparetext .wrap //

//ManusComperator.prototype.splitWordsChar(".font1.comparetext .wrap", ".font2.comparetext .wrap");
//ManusComperator.prototype.myAlign('.module_font1 .word', '.module_font2 .word');
//ManusComperator.prototype.alignChars();

