"use strict";

var globalVars = {};

globalVars.resizeTimer;

globalVars.initalFonts = {
	font1: "Times", //"Times New Roman", "Times", "Palatino Linotype", "Book Antiqua", "MS Serif", serif;
	font2: "Lucida Grande" //"Lucida Sans Unicode", "Lucida Grande", "Verdana", "Geneva", "Segoe UI", "Arial", "Arial Unicode MS", sans-serif;
};
//globalVars.OS = { UserAgent: navigator.userAgent};

globalVars.OS = {
	userAgent: navigator.userAgent,
	Type: {
		Mac: /(OS X|Mac|iPad|iPhone|iPod)/g.test( navigator.userAgent ),
		iOS: /(iOS|iPad|iPhone|iPod)/g.test( navigator.userAgent ),
	},
	Device: {
		iPhonePod: /(iPhone|iPod)/g.test( navigator.userAgent )
		//iPod: /(iPod)/g.test( navigator.userAgent )
	},
	Browser: {	}
};
console.log(globalVars.OS.userAgent);

globalVars.preset_zoom = 1;
// INITIAL FONTS FOR OTHER SYSTEMS / OS
if(globalVars.OS.Type.iOS) {
	globalVars.initalFonts.font1 = "Georgia";
	globalVars.initalFonts.font2 = "Marion-Regular";
}
else if (!globalVars.OS.Type.Mac) { // Win, Linux, ....
	globalVars.initalFonts.font1 = "Times New Roman";
	globalVars.initalFonts.font2 = "Verdana";
	// better would be to specify fallbackfonts / or lets call them copies, or clones ^^ e.g. Lucida and Lucida Unicode
	// + a list of inital Fontpairs, and if either of them is not available got to the next pair
};


globalVars.Texts = {
	Text1: $(".font1.comparetext .wrap").html(),
	Text2: $(".myReadingRegular_frame>.readingtext.font1>.content").html(),
	Text3: $(".myChars_frame>.text.font1>.content").html()
}

globalVars.fontlistinitiated = false;

globalVars.activeFonts = [];

globalVars.justifiedFontCombinations = [];
globalVars.justifiedTexts = {};

globalVars.debugging = false;
//globalVars.activeWritingScript = {latin: {lowercase: {} }};

globalVars.activeLanguage = "english";

globalVars.activeScript = {
	writingSystem: "latin",
	scriptStyle: "lowercase",
	//scriptsubstyle = "smallcaps"
	fontStyle: false
};

globalVars.myReadingFontsize = {
	size: "12 arcmin", //cm //mm // pt (space is important)
	min: 7 //(is pixel); //cm //mm // pt (space is important) //min arcmin is also interesting for crazy zoom preferences or non-native high resolutions
}

globalVars.myConsultationFontsize = {
	size: "5 arcmin", //cm //mm // pt (space is important)
	min: 5
}

globalVars.myCharsFontsize = {
	size: "18 arcmin", //cm //mm // pt (space is important)
	min: 18
}

globalVars.myRealsizeFontsize = {
	size: "20 mm", //cm //mm // pt (space is important)
	min: 3
}

globalVars.uiFontsize = {
	size: "7.5 arcmin", //cm //mm // pt (space is important)
	max: "1.4 vu",
	min: "6 px, 0.7 mm"//,
	// spacing: "0.5 arcmin",
	// spacing_max: "0.05 tem",
	// spacing_min: "-0.01 tem"
}



//console.log(Object.keys(globalVars.activeWritingScript)[0]);

//globalVars.activewritingscript = ["latin", "lowercase"]; //"latin uppercase smallcaps"

//http://stackoverflow.com/questions/4329092/multi-dimensional-associative-arrays-in-javascript


globalVars.languages = ["german", "english", "greek", "chinese", "japanese", "persic", "syric"]; // …


globalVars.writingScripts  = {
	standard: {
		subSystem: ["math", "interpunction", "numerals"],
		lang: "parentname",
		typographicMeasurement: {
			overshoot: true,
			overshoot_max: 0.1
		}
	},
	latin: {
		lang: ["german", "english", "czech", "french", "italian", "dutch", "polish"],
		averageheight: 0.5,
		scriptStyle: {
			lowercase: {
				typographicMeasurement: {
					averageheight: 0.5, //em related to technical size
					overshoot_max: 0.020, //26, // absolute! not relative yet //relative would be better, but is difficult
					//overshoot_average: 0.01, // absolute! not relative yet
					overshoot: true,
					string: "x",//"x",
					alternativestrings: "e",//["o", "c"],
					averagestring: "neox", //for scripts.. ? // or reading in the metainfos
					checkfontsstring: "x"
				}
			},
			uppercase: {
				typographicMeasurement: {
					averageheight: 0.7, //em related to technical size
					string: "H" //H//o
				},
				scriptStyle: ["normal", "smallcaps"]
			}
		}, //lowercase === regular === normal



		 //smallcaps === uppercase basic shape //italic === lowercase basic shape
		//not latin, cause latin is already in the name of the writingsystem
	},
	cyrilic: {
		lang: ["russian", "serbian", "macedonian"],
		scriptStyle: {
			lowercase: {
				scriptStyle: ["normal", "cursive_russian", "cursive_serbian"],
				//cursive a few letters seem to be totally different: https://de.wikipedia.org/wiki/Kyrillisches_Alphabet
				typographicMeasurement: {
					averageheight: 0.5, //em related to technical size
					string: "x", // H
					checkfontsstring: "ҡжилддшюя"
				}
			},
			uppercase: {
				typographicMeasurement: {
					averageheight: 0.7,
					string: "H",
				}
			}
		}
	},
	greek: {

		averageheight: 0.5,
		scriptStyle: {
			lowercase: {
				typographicMeasurement: {
					averageheight: 0.5, //em related to technical size
					overshoot_max: 0.020,
					overshoot: true,
					string: "ο", //Η
					checkfontsstring: "φειλταις"
				}
			},
			uppercase: {
				typographicMeasurement: {
					averageheight: 0.7, //em related to technical size
					string: "Σ", //Η
					checkfontsstring: "ΦΕΙΛΤΑΙΣ"
				}
			}
		},
	},
	hebrew: {
		averageheight: 0.5,
		scriptStyle: {
			normal: {
				typographicMeasurement: {
					averageheight: 0.5, //em related to technical size
					string: "א",
					overshoot_max: 0.040,
					overshoot: true,
					checkfontsstring: "שקלולמשפח"
				}
			},
			cursive: {}
		},
	},
	japanese: { //scriptStyle: []; //lang: "japanese";
		subSystems: ["kanji", "katakana", "hiragana", "latin"]
	},
	chinese: { //lang: ["chinese"]
		scriptStyle: ["simplified", "traditional"],
		subSystems: ["numerals_chinese", "zhuyin", "latin" ] //japanese, korean //"normal",
		//zhuyin: []  //!== same meaning   /// Zhuyin === Bopomofo // they are mostly used within
	},
	hangul: {
		lang: ["korean"]
	},
	hanja: {
		lang: ["korean"] //childscript of korean cause normaly they are not used together!
	},

	arabic: {
		averageheight: 0.08,
		lang: ["persian"],
		subSystems: ["numerals_arabic"],
		scriptStyle: {
			normal: {
				typographicMeasurement: {
						averageheight: 0.08, //em related to technical size
						string: "ــ", //"ـمـ", //""></div> <!--ـعـ  ـمـ عـ  ه
						overshoot_max: 0.1, // 0.2,
						overshoot: false,
						alternativestring: ["ـ"],
						alternativestring_averageheight: 0.07,
						checkfontsstring: "عععع" //خصوصيةمقارنة   مقارنة ـمـ   ه
				}
			}
		}
	},
	syrian: {},
	thai:  {},
	brahmi: { devanagari: [], bengalian: [], gujarati: [], marathi: []  },
	 //Brāhmī
	tibetian:  {
		lang: ["mongolian"]
	},
	devanagari:  {},
	thaana: {}, //arabic related! // or brahmi related?
	khymer: {},
	georgian: {},
	math: {},
	numerals: {},
	gotic: {}
	};



// globalVars.writingScriptsarray = [
// 		["lowercase", "uppercase"],
// 		["kanji", "katakana", "hiragana"],
// ];





// globalVars.writingScripts = [{
// 			name: "latin",
// 			styles: [{
// 				name: "lowercase"
// 			}, {
// 				name: "uppercase",
// 				styles: ["normal", "smallcaps"]
// 			}]
// 		}]


globalVars.measuredFonts = {};

globalVars.preset = { // preset if nothing else gets detected!
	diagonal: 33.78, //33.78(13.3) 58.62, //23,//68.58, //27, //width: 27, //348, //143
	unit : "cm", //"cm", //"inch", //"cm", 2,54
	distance: 60, //900//430
	csspixel: 1 //not unit-related
};

globalVars.initial = {};

globalVars.emulation_multiplicator = 1;

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

globalVars.measure_fontsize = 1000 //500; // should be 1000 !!!! -> currently it is displaying an x on about 500 units (0.5em)
globalVars.average_measure_em = 0.5; //should be average height of measured glyph/size  e.g.  x -> 0.5, H -> 0.7, …
globalVars.display_em = 1;
globalVars.size_em_adjust = globalVars.display_em / globalVars.average_measure_em ;

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
	"px",
	"ppi",
	"ppcm"
];
globalVars.chars =  {
	latin_basic: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
	noCSS: " ,;.:-–—_#+*'" + "”'‘’“”´`?^@//1234567890"
}
globalVars.basicShapes = {
	lowercase: "acemnorsuvwxz",
	ascenders: "bdfhikltj",
	descenders: "gpqyj",
	caps: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
};


globalVars.UIList = [{
	divId: "mainForm", // Main Navigation / UI
	content: [{
		name: "New Typographic Size",// Neue Typografische Größenbehandlung //"Typographic Sizing", // Title/Name of this UI Field
		id: "typographicsizing", // id of the field
		initFunc: "toggle", // Func to be run on init, determines what kind of field ( must be in ManusComperator.prototype.GetUI )
		changeFunc: "normalizeFonts", // Func to be run when something in the field is changed ( must be in ManusComperator.prototype.GetUIFunc )
		//
		changeVar: "normalizeFonts",
		"default": true
	},  {
		name: "Overlay", ////"Overlay", Überlagern
		id: "mode_overlay",
		initFunc: "toggle",
		changeFunc: "doWhenOverlay", //toggle means to append a class to the body
		"default": false
	},
	{
		name : "FontSelect",
		id : "fontselect1",
		initFunc : "selectfonts",
		changeId : "font1"
	},
	{
		name : "FontSelect",
		id : "fontselect2", //> fontselect2_select < does not work, cause its not there yet! -> init.js (badly coded, should not be there)
		initFunc : "selectfonts",
		changeId : "font2"
	}
]
},
{ divId: "moreOptions", // Main Navigation / UI
	content: [
	{
		name: "Highlight Typographic Size", // Title/Name of this UI Field
		id: "show_typographicsize", // id of the field
		initFunc: "toggle" // Func to be run on init, determines what kind of field ( must be in ManusComperator.prototype.GetUI )
	},
	{
		name: "Show Technical Sizes", // Title/Name of this UI Field
		id: "show_technicalsizes", // id of the field
		initFunc: "toggle", // Func to be run on init, determines what kind of field ( must be in ManusComperator.prototype.GetUI )
		changeFunc: "updateTechnicalsizes",
		"default": false
	},
	{
		name: "Round Technical Sizes", ////"Overlay", Überlagern
		id: "round_fontsize_id",
		initFunc: "toggle", //toggle means to append a class to the body
		changeFunc: "doRoundFontsize", //somehow it gets executed right away
		"default": false
	},
	{
		name: "Rendering: Greyscale", ////"Overlay", Überlagern
		id: "turnoffsubpixelrendring",
		initFunc: "toggle", //toggle means to append a class to the body
	},
	{
		name: "Rendering: Bitmap", ////"Overlay", Überlagern
		id: "bitmapstylerendering",
		initFunc: "toggle", //toggle means to append a class to the body
	},
	{
		name: "Rendering: Invert Colors",//"Justify", //Zeichen/Wörter zentrieren
		id: "invert_colors",
		initFunc: "toggle"//, //toggle means to append a class to the body
		//changeFunc: "doInvertColor"
	},
	{
		name: "Outline",
		id: "show_outline",
		initFunc: "toggle", //toggle means to append a class to the body
		"default": false

	},
	// {	//Canvas cant do that -> render div on canvas: //http://html2canvas.hertzen.com/ // library is only 91KB :)
	// 	name: "Smallcaps",
	// 	id: "script_smallcaps",
	// 	initFunc: "toggle",// //toggle means to append a class to the body
	// 	changeFunc: "doSmallcaps",
	// 	"default": false
	// },
	{
		name: "Justify Characters/Words",//"Justify", //Zeichen/Wörter zentrieren
		id: "justify",
		initFunc: "toggle", //toggle means to append a class to the body
		changeFunc: "doJustify",
		changeVar: "isSplit",
		"default": false
	},
	{
		name: "Frequency (en)",
		id: "show_frequency", //english
		initFunc: "toggle", //toggle means to append a class to the body
		changeFunc: "doFrequency",
		changeVar: "isSplit",
		"default": false

	},
	{
		name: "Flip Glyphs", // Title/Name of this UI Field
		id: "flipchars", // id of the field
		initFunc: "toggle", // Func to be run on init, determines what kind of field ( must be in ManusComperator.prototype.GetUI )
		changeFunc: "doFlipChars",
		changeVar: "isSplit",
		"default": false
	},
	{
	    name: "Monospace",
	    id: "monospace",
	    initFunc: "toggle", //toggle means to append a class to the body
	    changeFunc: "doMonospace",
	    changeVar: "isSplit",
	    "default": false
	},
	{
		name: "Show Arcmin Ruler", // Title/Name of this UI Field
		id: "showruler", // id of the field
		initFunc: "toggle", // Func to be run on init, determines what kind of field ( must be in ManusComperator.prototype.GetUI )
	},
	{
		name: "Uppercase Mode",
		id: "script_uppercase",
		initFunc: "toggle", //toggle means to append a class to the body
		changeFunc: "doUppercase",
		"default": false

	}
	]},

{
	divId: "measureInput", // Main Navigation / UI
	content: [ {
		name: "<i class='fa fa-expand'></i>",
		id: "screensize",
		title: "Enter your real diagonal screensize",
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
		title: "Calculated pixel density / Enter other values to simulate another density",
		initFunc: "textinput",
		changeFunc: "enterPPI",
		units: ["ppi", "ppcm"],
		//editable: false,
		inputs: [{
			name: "",
			id: "resolution"
		}],
	}, {
		name: "<i class='fa fa-eye' title='Reading Distance'></i>",
		id: "readingdistance",
		title: "Enter your reading distance",
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
			drawNth: 20
		}
	],
}];

globalVars.decimalPlaces = 2;
globalVars.maxDecimalPlaces = 10;

globalVars.$window = $(window);
globalVars.$html = $("html");
//globalVars.$document = $("document");
globalVars.$body = $("body");
globalVars.head = document.head || document.getElementsByTagName('head')[0];
globalVars.$compare = $(".comparetext"); //>.content

globalVars.myWindow = {
	screen: {},
	viewport: {},
	space: {}
};


globalVars.FontLists = { //could be also filtered by iOS version // //http://iosfonts.com/ -> github -> data -> json
		iOS: "AcademyEngravedLetPlain, AlNile-Bold, AlNile, AmericanTypewriter, AmericanTypewriter-Bold, AmericanTypewriter-Condensed, AmericanTypewriter-CondensedBold, AmericanTypewriter-CondensedLight, AmericanTypewriter-Light, AppleColorEmoji, AppleSDGothicNeo-Thin, AppleSDGothicNeo-Light, AppleSDGothicNeo-Regular, AppleSDGothicNeo-Medium, AppleSDGothicNeo-SemiBold, AppleSDGothicNeo-Bold, AppleSDGothicNeo-Medium, ArialMT, Arial-BoldItalicMT, Arial-BoldMT, Arial-ItalicMT, ArialHebrew, ArialHebrew-Bold, ArialHebrew-Light, ArialRoundedMTBold, Avenir-Black, Avenir-BlackOblique, Avenir-Book, Avenir-BookOblique, Avenir-Heavy, Avenir-HeavyOblique, Avenir-Light, Avenir-LightOblique, Avenir-Medium, Avenir-MediumOblique, Avenir-Oblique, Avenir-Roman, AvenirNext-Bold, AvenirNext-BoldItalic, AvenirNext-DemiBold, AvenirNext-DemiBoldItalic, AvenirNext-Heavy, AvenirNext-HeavyItalic, AvenirNext-Italic, AvenirNext-Medium, AvenirNext-MediumItalic, AvenirNext-Regular, AvenirNext-UltraLight, AvenirNext-UltraLightItalic, AvenirNextCondensed-Bold, AvenirNextCondensed-BoldItalic, AvenirNextCondensed-DemiBold, AvenirNextCondensed-DemiBoldItalic, AvenirNextCondensed-Heavy, AvenirNextCondensed-HeavyItalic, AvenirNextCondensed-Italic, AvenirNextCondensed-Medium, AvenirNextCondensed-MediumItalic, AvenirNextCondensed-Regular, AvenirNextCondensed-UltraLight, AvenirNextCondensed-UltraLightItalic, BanglaSangamMN, BanglaSangamMN-Bold, Baskerville, Baskerville-Bold, Baskerville-BoldItalic, Baskerville-Italic, Baskerville-SemiBold, Baskerville-SemiBoldItalic, BodoniOrnamentsITCTT, BodoniSvtyTwoITCTT-Bold, BodoniSvtyTwoITCTT-Book, BodoniSvtyTwoITCTT-BookIta, BodoniSvtyTwoOSITCTT-Bold, BodoniSvtyTwoOSITCTT-Book, BodoniSvtyTwoOSITCTT-BookIt, BodoniSvtyTwoSCITCTT-Book, BradleyHandITCTT-Bold, ChalkboardSE-Bold, ChalkboardSE-Light, ChalkboardSE-Regular, Chalkduster, Cochin, Cochin-Bold, Cochin-BoldItalic, Cochin-Italic, Copperplate, Copperplate-Bold, Copperplate-Light, Courier, Courier-Bold, Courier-BoldOblique, Courier-Oblique, CourierNewPS-BoldItalicMT, CourierNewPS-BoldMT, CourierNewPS-ItalicMT, CourierNewPSMT, DBLCDTempBlack, DINAlternate-Bold, DINCondensed-Bold, DamascusBold, Damascus, DamascusLight, DamascusMedium, DamascusSemiBold, DevanagariSangamMN, DevanagariSangamMN-Bold, Didot, Didot-Bold, Didot-Italic, DiwanMishafi, EuphemiaUCAS, EuphemiaUCAS-Bold, EuphemiaUCAS-Italic, Farah, Futura-CondensedExtraBold, Futura-CondensedMedium, Futura-Medium, Futura-MediumItalic, GeezaPro, GeezaPro-Bold, Georgia, Georgia-Bold, Georgia-BoldItalic, Georgia-Italic, GillSans, GillSans-Bold, GillSans-BoldItalic, GillSans-Italic, GillSans-Light, GillSans-LightItalic, GujaratiSangamMN, GujaratiSangamMN-Bold, GurmukhiMN, GurmukhiMN-Bold, STHeitiSC-Light, STHeitiSC-Medium, STHeitiTC-Light, STHeitiTC-Medium, Helvetica, Helvetica-Bold, Helvetica-BoldOblique, Helvetica-Light, Helvetica-LightOblique, Helvetica-Oblique, HelveticaNeue, HelveticaNeue-Bold, HelveticaNeue-BoldItalic, HelveticaNeue-CondensedBlack, HelveticaNeue-CondensedBold, HelveticaNeue-Italic, HelveticaNeue-Light, HelveticaNeue-LightItalic, HelveticaNeue-Medium, HelveticaNeue-MediumItalic, HelveticaNeue-UltraLight, HelveticaNeue-UltraLightItalic, HelveticaNeue-Thin, HelveticaNeue-ThinItalic, HiraKakuProN-W3, HiraKakuProN-W6, HiraMinProN-W3, HiraMinProN-W6, HoeflerText-Black, HoeflerText-BlackItalic, HoeflerText-Italic, HoeflerText-Regular, IowanOldStyle-Bold, IowanOldStyle-BoldItalic, IowanOldStyle-Italic, IowanOldStyle-Roman, Kailasa, Kailasa-Bold, KannadaSangamMN, KannadaSangamMN-Bold, KhmerSangamMN, KohinoorDevanagari-Book, KohinoorDevanagari-Light, KohinoorDevanagari-Medium, LaoSangamMN, MalayalamSangamMN, MalayalamSangamMN-Bold, Marion-Bold, Marion-Italic, Marion-Regular, Menlo-BoldItalic, Menlo-Regular, Menlo-Bold, Menlo-Italic, MarkerFelt-Thin, MarkerFelt-Wide, Noteworthy-Bold, Noteworthy-Light, Optima-Bold, Optima-BoldItalic, Optima-ExtraBlack, Optima-Italic, Optima-Regular, OriyaSangamMN, OriyaSangamMN-Bold, Palatino-Bold, Palatino-BoldItalic, Palatino-Italic, Palatino-Roman, Papyrus, Papyrus-Condensed, PartyLetPlain, SavoyeLetPlain, SinhalaSangamMN, SinhalaSangamMN-Bold, SnellRoundhand, SnellRoundhand-Black, SnellRoundhand-Bold, Superclarendon-Regular, Superclarendon-BoldItalic, Superclarendon-Light, Superclarendon-BlackItalic, Superclarendon-Italic, Superclarendon-LightItalic, Superclarendon-Bold, Superclarendon-Black, Symbol, TamilSangamMN, TamilSangamMN-Bold, TeluguSangamMN, TeluguSangamMN-Bold, Thonburi, Thonburi-Bold, Thonburi-Light, TimesNewRomanPS-BoldItalicMT, TimesNewRomanPS-BoldMT, TimesNewRomanPS-ItalicMT, TimesNewRomanPSMT, Trebuchet-BoldItalic, TrebuchetMS, TrebuchetMS-Bold, TrebuchetMS-Italic, Verdana, Verdana-Bold, Verdana-BoldItalic, Verdana-Italic, ZapfDingbatsITC, Zapfino",
		iWatch: "SanFranciscoDisplay-Black, SanFranciscoDisplay-Bold, SanFranciscoDisplay-Heavy, SanFranciscoDisplay-Light, SanFranciscoDisplay-Medium, SanFranciscoDisplay-Regular, SanFranciscoDisplay-Semibold, SanFranciscoDisplay-Thin, SanFranciscoDisplay-Ultralight, SanFranciscoRounded-Black, SanFranciscoRounded-Bold, SanFranciscoRounded-Heavy, SanFranciscoRounded-Light, SanFranciscoRounded-Medium, SanFranciscoRounded-Regular, SanFranciscoRounded-Semibold, SanFranciscoRounded-Thin, SanFranciscoRounded-Ultralight, SanFranciscoText-Bold, SanFranciscoText-BoldG1, SanFranciscoText-BoldG2, SanFranciscoText-BoldG3, SanFranciscoText-BoldItalic, SanFranciscoText-BoldItalicG1, SanFranciscoText-BoldItalicG2, SanFranciscoText-BoldItalicG3, SanFranciscoText-Heavy, SanFranciscoText-HeavyItalic, SanFranciscoText-Light, SanFranciscoText-LightItalic, SanFranciscoText-Medium, SanFranciscoText-MediumItalic, SanFranciscoText-Regular, SanFranciscoText-RegularG1, SanFranciscoText-RegularG2, SanFranciscoText-RegularG3, SanFranciscoText-RegularItalic, SanFranciscoText-RegularItalicG1, SanFranciscoText-RegularItalicG2, SanFranciscoText-RegularItalicG3, SanFranciscoText-Semibold, SanFranciscoText-SemiboldItalic, SanFranciscoText-Thin, SanFranciscoText-ThinItalic",
		Fallback: "Times, Times New Roman, Arial, Helvetica, Helvetica Neue, Courier, Charcoal, Comic Sans MS, Lucida Console, Lucida Sans Unicode, Palatino, Palatino Linotype, Book Antiqua, Tahoma, Trebuchet MS, MS Sans Serif, MS Serif, Impact, Andale Mono, Georgia, Verdana", //Symbol, Webdings, Wingdings,
		Win: "Calibri, Cambria, Candara, Consolas, Constantia, Corbel, Segoe UI, Franklin Gothic, Aldhabi, Century Gothic, Copperplate, Calisto MT, Sitka, Sitka Small, Sitka Display", //simple
		OSXMin: "Avenir, Avenir Next, Lucida Grande, Apple Symbols, Thonburi, Courier New, American Typewriter, Geneva, Geeza Pro, Monaco, Hoefler Text, PT Sans, PT Serif, Optima", //Andale Mono // simple
		OSX:"Times, " + "Apple Braille Outline 8 Dot, Apple Braille Outline 6 Dot, Apple Braille Pinpoint 6 Dot, Apple Braille Pinpoint 8 Dot, Apple Braille, Apple Color Emoji, Apple Symbols, Geeza Pro Bold, Geeza Pro, .Keyboard, LastResort, Symbol, Zapf Dingbats, Apple SD Gothic Neo Bold, Apple SD Gothic Neo Regular, Hiragino Mincho ProN W3, Hiragino Mincho ProN W6, Hiragino Kaku Gothic ProN W3, Hiragino Kaku Gothic ProN W6, .Aqua Kana, .Aqua Kana Bold, Avenir Next Condensed Bold, Avenir Next Condensed Bold Italic, Avenir Next Condensed Demi Bold, Avenir Next Condensed Demi Bold Italic, Avenir Next Condensed Italic, Avenir Next Condensed Medium, Avenir Next Condensed Medium Italic, Avenir Next Condensed Regular, Avenir Next Condensed Heavy, Avenir Next Condensed Heavy Italic, Avenir Next Condensed Ultra Light, Avenir Next Condensed Ultra Light Italic, Avenir Next Bold, Avenir Next Bold Italic, Avenir Next Demi Bold, Avenir Next Demi Bold Italic, Avenir Next Italic, Avenir Next Medium, Avenir Next Medium Italic, Avenir Next Regular, Avenir Next Heavy, Avenir Next Heavy Italic, Avenir Next Ultra Light, Avenir Next Ultra Light Italic, Avenir Book, Avenir Book Oblique, Avenir Black, Avenir Black Oblique, Avenir Heavy, Avenir Heavy Oblique, Avenir Light, Avenir Light Oblique, Avenir Medium, Avenir Medium Oblique, Avenir Oblique, Avenir Roman, .Helvetica Neue Desk UI, .Helvetica Neue Desk UI Italic, .Helvetica Neue Desk UI Bold, .Helvetica Neue Desk UI Bold Italic, Lucida Grande, Lucida Grande Bold, System Font Regular, System Font Bold, Marker Felt Thin, Marker Felt Wide, Menlo Regular, Menlo Bold, Menlo Italic, Menlo Bold Italic, Noteworthy Light, Noteworthy Bold, Optima Regular, Optima Bold, Optima Italic, Optima Bold Italic, Optima ExtraBlack, Palatino, Palatino Italic, Palatino Bold, Palatino Bold Italic, Heiti TC Light, Heiti SC Light, Heiti TC Medium, Heiti SC Medium, Thonburi, Thonburi Bold, Thonburi Light, Courier, Courier Bold, Courier Oblique, Courier Bold Oblique, Geneva, Helvetica, Helvetica Bold, Helvetica Oblique, Helvetica Bold Oblique, Helvetica Light, Helvetica Light Oblique, Helvetica Neue, Helvetica Neue Bold, Helvetica Neue Italic, Helvetica Neue Bold Italic, Helvetica Neue Condensed Bold, Helvetica Neue UltraLight, Helvetica Neue UltraLight Italic, Helvetica Neue Light, Helvetica Neue Light Italic, Helvetica Neue Condensed Black, Helvetica Neue Medium, Helvetica Neue Medium Italic, Helvetica Neue Thin, Helvetica Neue Thin Italic, Monaco, Times Roman, Times Bold, Times Italic, Times Bold Italic, .Times LT MM, .Helvetica LT MM, " + "Al Nile, Al Nile Bold, Al Tarikh, American Typewriter, American Typewriter Light, American Typewriter Bold, American Typewriter Condensed, American Typewriter Condensed Bold, American Typewriter Condensed Light, Arial Hebrew, Arial Hebrew Light, Arial Hebrew Bold, Athelas Regular, Athelas Italic, Athelas Bold Italic, Athelas Bold, Bangla MN, Bangla MN Bold, Bangla Sangam MN, Bangla Sangam MN Bold, Baoli SC Regular, Baskerville Bold, Baskerville Bold Italic, Baskerville Italic, Baskerville, Baskerville SemiBold, Baskerville SemiBold Italic, Beirut, Chalkboard, Chalkboard Bold, Chalkboard SE Light, Chalkboard SE Regular, Chalkboard SE Bold, Charter Roman, Charter Italic, Charter Bold Italic, Charter Bold, Charter Black Italic, Charter Black, Cochin, Cochin Bold, Cochin Italic, Cochin Bold Italic, Copperplate, Copperplate Light, Copperplate Bold, Corsiva Hebrew, Corsiva Hebrew Bold, Damascus, Damascus Semi Bold, Damascus Medium, Damascus Bold, Devanagari Sangam MN, Devanagari Sangam MN Bold, Didot, Didot Italic, Didot Bold, Diwan Kufi, Diwan Thuluth, Euphemia UCAS, Euphemia UCAS Bold, Euphemia UCAS Italic, Farah, Farisi, Futura Medium, Futura Medium Italic, Futura Condensed Medium, Futura Condensed ExtraBold, Gill Sans, Gill Sans UltraBold, Gill Sans SemiBold Italic, Gill Sans SemiBold, Gill Sans Light Italic, Gill Sans Light, Gill Sans Italic, Gill Sans Bold Italic, Gill Sans Bold, Gujarati Sangam MN, Gujarati Sangam MN Bold, Gurmukhi MN, Gurmukhi MN Bold, Gurmukhi Sangam MN, Gurmukhi Sangam MN Bold, Hannotate SC Regular, Hannotate TC Regular, Hannotate SC Bold, Hannotate TC Bold, HanziPen SC Regular, HanziPen TC Regular, HanziPen SC Bold, HanziPen TC Bold, Hoefler Text, Hoefler Text Black, Hoefler Text Italic, Hoefler Text Black Italic, Iowan Old Style Black, Iowan Old Style Black Italic, Iowan Old Style Bold, Iowan Old Style Bold Italic, Iowan Old Style Italic, Iowan Old Style Roman, Iowan Old Style Titling, Kaiti SC Black, Kaiti SC Bold, Kaiti TC Bold, Kaiti SC Regular, STKaiti, Kaiti TC Regular, Kannada MN, Kannada MN Bold, Kannada Sangam MN, Kannada Sangam MN Bold, Kefa Regular, Kefa Bold, Khmer MN, Khmer MN Bold, Lantinghei SC Demibold, Lantinghei SC Extralight, Lantinghei SC Heavy, Lantinghei TC Demibold, Lantinghei TC Extralight, Lantinghei TC Heavy, Lao MN, Lao MN Bold, Libian SC Regular, Malayalam MN, Malayalam MN Bold, Malayalam Sangam MN, Malayalam Sangam MN Bold, Marion Regular, Marion Italic, Marion Bold, Diwan Mishafi, Muna, Muna Bold, Muna Black, Myanmar MN, Myanmar MN Bold, NanumGothic, NanumGothic Bold, NanumGothic ExtraBold, NanumMyeongjo, NanumMyeongjo Bold, NanumMyeongjo ExtraBold, Nanum Brush Script, Nanum Pen Script, New Peninim MT, New Peninim MT Inclined, New Peninim MT Bold Inclined, New Peninim MT Bold, Oriya MN, Oriya MN Bold, Oriya Sangam MN, Oriya Sangam MN Bold, Papyrus, Papyrus Condensed, PT Mono Bold, PT Mono, PT Sans, PT Sans Italic, PT Sans Narrow Bold, PT Sans Narrow, PT Sans Caption Bold, PT Sans Caption, PT Sans Bold Italic, PT Sans Bold, PT Serif, PT Serif Italic, PT Serif Bold Italic, PT Serif Bold, PT Serif Caption, PT Serif Caption Italic, Raanana, Raanana Bold, Sana, Savoye LET Plain:1.0, Savoye LET Plain CC. :1.0, Seravek, Seravek Italic, Seravek Medium Italic, Seravek Medium, Seravek Light Italic, Seravek Light, Seravek ExtraLight Italic, Seravek ExtraLight, Seravek Bold Italic, Seravek Bold, Sinhala MN, Sinhala MN Bold, Sinhala Sangam MN, Sinhala Sangam MN Bold, Snell Roundhand, Snell Roundhand Bold, Snell Roundhand Black, Songti SC Black, Songti SC Bold, Songti TC Bold, Songti SC Light, STSong, Songti TC Light, Songti SC Regular, Songti TC Regular, Superclarendon Regular, Superclarendon Italic, Superclarendon Light Italic, Superclarendon Light, Superclarendon Bold Italic, Superclarendon Bold, Superclarendon Black Italic, Superclarendon Black, Tamil MN, Tamil MN Bold, Tamil Sangam MN, Tamil Sangam MN Bold, Telugu MN, Telugu MN Bold, Telugu Sangam MN, Telugu Sangam MN Bold, Waseem, Waseem Light, Xingkai SC Bold, Xingkai SC Light, Yuanti SC Bold, Yuanti SC Light, Yuanti SC Regular, Al Bayan Plain, Al Bayan Bold, Andale Mono, Apple Chancery, Apple LiGothic Medium, Apple LiSung Light, AppleGothic Regular, AppleMyungjo Regular, Arial Black, Arial Bold Italic, Arial Bold, Arial Italic, Arial Narrow Bold Italic, Arial Narrow Bold, Arial Narrow Italic, Arial Narrow, Arial Rounded MT Bold, Arial Unicode MS, Arial, Ayuthaya, Baghdad, BiauKai, Big Caslon Medium, Brush Script MT Italic, Chalkduster, Comic Sans MS Bold, Comic Sans MS, Courier New Bold Italic, Courier New Bold, Courier New Italic, Courier New, DecoType Naskh, Devanagari MT, Devanagari MT Bold, DIN Alternate Bold, DIN Condensed Bold, Georgia Bold Italic, Georgia Bold, Georgia Italic, Georgia, Gujarati MT, Gujarati MT Bold, GungSeo Regular, Gurmukhi MT, HeadLineA Regular, Hei Regular, Herculanum, Hoefler Text Ornaments, Impact, InaiMathi, Kai Regular, Kailasa Regular, Khmer Sangam MN, Kokonor Regular, Krungthep, KufiStandardGK, Lao Sangam MN, Microsoft Sans Serif, Mshtakan Bold, Mshtakan BoldOblique, Mshtakan Oblique, Mshtakan, Myanmar Sangam MN, Nadeem, GB18030 Bitmap, Osaka, Osaka-Mono, PCMyungjo Regular, PilGi Regular, Plantagenet Cherokee, Sathu, Silom, Skia Regular, Tahoma Negreta, Tahoma, Times New Roman Bold Italic, Times New Roman Bold, Times New Roman Italic, Times New Roman, Trebuchet MS Bold Italic, Trebuchet MS Bold, Trebuchet MS Italic, Trebuchet MS, Verdana Bold Italic, Verdana Bold, Verdana Italic, Verdana, Webdings, Wingdings 2, Wingdings 3, Wingdings, Zapfino, LiSong Pro, LiHei Pro, STFangsong, STXihei, STHeiti, Apple SD GothicNeo ExtraBold, Apple SD Gothic Neo Heavy, Apple SD Gothic Neo Light, Apple SD Gothic Neo Medium, Apple SD Gothic Neo SemiBold, Apple SD Gothic Neo Thin, Apple SD Gothic Neo UltraLight, Hiragino Sans GB W3, Hiragino Sans GB W6, STIXGeneral-Regular, STIXGeneral-Bold, STIXGeneral-BoldItalic, STIXGeneral-Italic, STIXIntegralsD-Bold, STIXIntegralsD-Regular, STIXIntegralsSm-Bold, STIXIntegralsSm-Regular, STIXIntegralsUp-Bold, STIXIntegralsUpD-Bold, STIXIntegralsUpD-Regular, STIXIntegralsUp-Regular, STIXIntegralsUpSm-Bold, STIXIntegralsUpSm-Regular, STIXNonUnicode-Regular, STIXNonUnicode-Bold, STIXNonUnicode-BoldItalic, STIXNonUnicode-Italic, STIXSizeFiveSym-Regular, STIXSizeFourSym-Bold, STIXSizeFourSym-Regular, STIXSizeOneSym-Bold, STIXSizeOneSym-Regular, STIXSizeThreeSym-Bold, STIXSizeThreeSym-Regular, STIXSizeTwoSym-Bold, STIXSizeTwoSym-Regular, STIXVariants-Regular, STIXVariants-Bold, Wawati SC Regular, Wawati TC Regular, Weibei SC Bold, Weibei TC Bold, YuGothic Bold, YuGothic Medium, YuMincho Demibold, YuMincho Medium, Yuppy SC Regular, Yuppy TC Regular, Hiragino Maru Gothic Pro W4, Hiragino Maru Gothic ProN W4, Hiragino Mincho Pro W3, Hiragino Mincho Pro W6, Hiragino Kaku Gothic Pro W3, Hiragino Kaku Gothic Pro W6, Hiragino Kaku Gothic Std W8, Hiragino Kaku Gothic StdN W8, Charcoal CY, Geneva CY, Helvetica CY Plain, Helvetica CY Bold, Helvetica CY Oblique, Helvetica CY BoldOblique", //MavericksLibrary Core + normal Library //https://support.apple.com/de-de/HT201375
		Adobe: "Adobe Arabic Italic, Adobe Arabic, Adobe Hebrew Italic, Adobe Hebrew, Adobe Myungjo Std, Kozuka Gothic Pro, Kozuka Mincho Pro, Letter Gothic Std, Minion Pro Italic, Myriad Pro Condensed, Myriad Pro Condensed Italic, Myriad Pro Bold Condensed, Myriad Pro Bold Condensed Italic, Myriad Pro Italic, Myriad Pro, " + "Adobe Caslon Pro Italic, Adobe Caslon Pro, Adobe Fangsong Std, Adobe Heiti Std, Adobe Kaiti Std, Adobe Garamond Pro Italic, Adobe Garamond Pro, Birch Std, Blackoak Std, BrushScript Std, Chaparral Pro Italic, Chaparral Pro, Cooper Std Italic, Cooper Std, Giddyup Std, Hobo Std, Kozuka Gothic Pro, Koz Mincho Pro, Lithos Pro, Mesquite Std, Minion Pro Bold Condensed, Minion Pro Bold Condensed Italic, Minion Pro, Nueva Std Bold Condensed Italic, Nueva Std Condensed, Nueva Std Condensed Italic, OCR A Std, Orator Std, Poplar Std, Prestige Elite Std, Rosewood Std, Stencil Std, Tekton Pro, Trajan Pro" //CS5 // http://www.adobe.com/type/browser/fontinstall/cs5installedfonts.html
}


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

	CSS.appendChild( newChild = document.createTextNode("/*" + styleSheet +  "*/"+ css) );
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


/*
/// Hide all Fonts that dont support that specific script
function CheckAvailableFonts(testString) {
//var testString = "الألمانية",


var d = new Detector(),
my_list = document.getElementById("active_fonts"),
myFontname = "", controlString = "", str = "", FontListArray;


//myFontname = "Lucida Grande";
//if(d.detect(myFontname, testString)) {
//	str += '<option value="'+ myFontname +'" />';
//}




FontListArray = my_list.options;

for (var index in FontListArray) {
		myFontname = FontListArray[index].innerHTML;
		if(d.detect(myFontname, testString)) {
			str += '<option value="'+ myFontname +'" />';
		}
	}

my_list.innerHTML = str;
$('#fontselect1 select').innerHTML = str;
$('#fontselect2 select').innerHTML = str;
// console.log("detected fonts: "  + str);
};
//CheckAvailableFonts(document.getElementById("testcharactersinfont").innerHTML); //mmmmmmmmmmlli
*/



function setFontlist(FontsStr) {
	var str = "", myFontname = "", Fonts = FontsStr || false;
	var testString = document.getElementById("testcharactersinfont").textContent; //innerHTML;
	var d = new Detector();

	if(Fonts) {
		Fonts = Fonts.split(", ");
		str += "<select name='active_fonts'>";
		for (var index in Fonts) {
				myFontname = Fonts[index];

				if(testString === "nocheck") {
					str += '<option value="'+ myFontname +'">' + myFontname + '</option>';
				} else if(d.detect(myFontname, testString)) {
					str += '<option value="'+ myFontname +'">' + myFontname + '</option>'; //same??
					}
				}
		str += "</select>";
		globalVars.pushFontlist(str);
		$('#active_fonts').html(str);
	}
};


var guessScreensize = function() {
	var Mac = globalVars.OS.Type.Mac,
   	iOS = globalVars.OS.Type.iOS,
   	iPhone = globalVars.OS.Device.iPhonePod; //test if "Mac" is in the useragent var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

   	//screensize repositry: http://dpi.lv/

   //only macs will currenty get the right initinal diagonal (most of the time, hopefully all)

//Method 1: fastest for every device would be to start in the middle and then cut it to half, and again and again: eg  <1024 -> <512 -> <254...
//Method 2: fastest for small devices, cause they are generally slower
//-> Method 2




  // if(Mac) {
      var myCSSpixel = globalVars.comperator.getCSSpixel(),
      myWidth = window.screen.width, //globalVars.myWindow.screen.width / myCSSpixel, //(somehow that is the reall pixel with csspixel)
      myHeight = window.screen.height, //globalVars.myWindow.screen.height / myCSSpixel,
      newDiagonal = 0;

console.log(myWidth, myHeight);
    //my ¿awful? written conditions

    if (myWidth <= 320 && myHeight <= 320) {
    	newDiagonal = 3.1 // Blackberry Q10, Q5
        //iPod Nano: 240-by-432-pixel resolution at 202 pixels per inch // 2.5inch
	}
    else if (myWidth <= 480 && myHeight <= 480) {
		newDiagonal = 3.5; // HTC Desire C, ZTE Open
		if(iPhone) { ////http://de.wikipedia.org/wiki/IPhone
		newDiagonal = 3.543; //320 x 480 2csspixel Iphone 4 // 3.5inch //90mm!(gemessen) // 3,5 Zoll (8,89 cm) 326 bzw. 163
		}
    }
    else if (myWidth <= 568 && myHeight <= 568) {
    	newDiagonal = 4; //320 x 568 1136-by-640 Iphone5 – 4 inch // or Ipod.. //4 Zoll (10,16 cm) 326
    	//if(myWidth === 533 || myHeight === 533) {
    	//	newDiagonal = 4; //Samsung Galaxy S 1.5CSSPIXEL+ some Nokia Lumia
    	//}
    	//newDiagonal = 3.7; //HTC Desire, One
	}
	else if (myWidth <= 667 && myHeight <= 667) {
		newDiagonal = 4.7; //375px x 667px Iphone 6 // 2 csspixel //4.6Inch //4,7 Zoll (11,94 cm) 326
		//640 HTC ONE // 640 Google Nexus 5 (4.95)
		if (myWidth === 360 || myHeight === 360) {
			newDiagonal = 4.8; // Samsung Galaxy SIII 640x360
			if(myCSSpixel === 3) {newDiagonal = 5;}//Samsung Galaxy S4 640x360 3csspixel -> S5 -> 5.1
			// //5.7 Samsung Galaxy Note 3
		}
		else if (myWidth === 384 || myHeight === 384) {
			newDiagonal = 4.5; // NokiaLumina ->  strange csspixel!
			globalVars.preset.csspixel = globalVars.initial.csspixel = 768/460; //could work, but not tested
		}
	}
	else if (myWidth <= 736 && myHeight <= 736) {
		newDiagonal = 5.5; //414 736px   -  5,5 Zoll (13,94 cm) 401 ppi

		if(iPhone) {
			globalVars.preset.csspixel = globalVars.initial.csspixel = 1080/414; //iphone6 plus // 2.6 csspixel (3 downscaled  by 1.15)
		}
	}
	else if (myWidth <= 800 && myHeight <= 800) {
		if (myWidth === 480 || myHeight === 480) {
			newDiagonal = 7; //AMazon  Fire 7
		}
	}
	else if (myWidth <= 1024 && myHeight <= 1024) {
		//newDiagonal = 9.7;// IPAD 1024x768 // 7.9 Ipad Mini
          newDiagonal = 9.7;// Ipad

          if (myWidth <= 600 || myHeight <= 600) {
          	newDiagonal = 7; //Samsung Tab, Amazon Kindle Fire, Blackberry Playbook
          }
          else if(myCSSpixel > 1 && myCSSpixel <= 2) {
          	newDiagonal = 7.9;// Ipad Mini

          	if (Mac && !iOS && myCSSpixel === 2) {
          		//could be also 13" Macbook Pro Retina and there is n known way to differenciate
          		//also applies for scaled Macbook 12 Retina :(
				newDiagonal = 15.4; //15.4 Macbook Pro Retina, "bigger text"
				//here I could 	actually increase the fontsize // but need a good implementation for that, should be similar to what would happen, when the browser zoom is increased
				globalVars.preset_zoom = 1440/1024;
				globalVars.emulation_multiplicator = 1440/1024; //1440/1024
				globalVars.initial.csspixel = globalVars.initial.csspixel * globalVars.emulation_multiplicator;
			}
          }
	}
	else if (myWidth <= 1280 && myHeight <= 1280) {
		newDiagonal = 13.3; //33.78cm; // 1280x800 ->  MacBook +  Pro (Regular + Retina)
		if(myCSSpixel > 1) {
			newDiagonal = 10; // Samsung Galaxy Tab // most 1.5csspixel
			if (myWidth <= 720 || myHeight <= 720) {
				newDiagonal = 10.6; //720 Microsoft surface Pro 1.5Csspixel
			} else if (Mac && !iOS && myCSSpixel === 2) {

				//newDiagonal = 13.3; //more likely, as it is native resolution of Macbook Pro Retina
				//also applies for scaled Macbook 12 Retina :(
				//##################################################################
				//also applies for scaled 15.4 macbook pro Retina
				//newDiagonal = 15.4; //15.4 Macbook Pro Retina, slightly "bigger text"

				//globalVars.preset_zoom = 1440/1280;
				//globalVars.emulation_multiplicator = 1440/1280; //1440/1024 //not yet perfect!!! // to font is not increasing
				//globalVars.initial.csspixel = globalVars.initial.csspixel * globalVars.emulation_multiplicator;
			}
		}
	 	if(myWidth === 1152 && myHeight === 720) { //2304
        	newDiagonal = 12;// Macbook 12 Retina (2015), also scaled macbook air 13.3
        }
        if (myHeight === 1024) { //2304
        	newDiagonal = 19;//
        }
	}
	else if (myWidth <= 1366 && myHeight <= 1366) {
		//newDiagonal = 10.6; //720 Microsoft surface Pro 1.5Csspixel
		//http://www.rapidtables.com/web/dev/screen-resolution-statistics.html
		//14'' Notebook / 15.6'' Laptop / 18.5'' monitor
		newDiagonal = 13.3; // Lenovo ideapad U310
		if(Mac && myWidth <= 768 || myHeight <= 768) {
			newDiagonal = 11.6;//33.78; Macbook Air 11.6, 1366x768 + 1344x756, 1280x720, 1152x720, 1024x640, 1024x768, 800x600
		}
	}
	else if (myWidth <= 1440 && myHeight <= 1440) {
		newDiagonal = 15.4;// Macbook 15.4 normal and Retina, native //19'' monitor
		//also applies for scaled Macbook 12 Retina :(
		 //and for Macbook Pro 13 //highest standard resolution // More Space (Mehr Flaeche)
		if(myCSSpixel > 1 && myCSSpixel < 2) {
            newDiagonal = 13.3;// Macbook Air 13.3 // 1440 by 900 (native), 1280 by 800, 1152 by 720, and 1024 by 640 pixels at 16:10 aspect ratio and 1024 by 768 and 800 by 600 pixels at 4:3 aspect ratio
        }

	}
	else if (myWidth <= 1680 && myHeight <= 1680) {

		 newDiagonal = 15.4; // 19,5 1600x900 //old Macbook 15.4 hires + New, with bit "more space" // or 20.1 Apple Cinema Display
		////could be also 13" Macbook Pro Retina and there is n known way to differenciate
		 if (Mac && !iOS && myCSSpixel === 2) {
		 	globalVars.preset_zoom = 1440/1680;
		 	globalVars.emulation_multiplicator = 1440/1680; //1440/1024 //not yet perfect!!! // to font is not increasing
			globalVars.initial.csspixel = globalVars.initial.csspixel * globalVars.emulation_multiplicator;
		 }
		 if (myWidth === 1200 || myHeight === 1200) {
		 	newDiagonal = 19;
		 }
		//if(myHeight === 1050) {
        //  newDiagonal = 15.4; //Macbook 15.4 hires // or 20.1 Apple Cinema Display
        //}
	}
	else if (myWidth <= 1920 && myHeight <= 1920) {
		 newDiagonal = 21.5; //iMac  //21.5,  23,   23.5 (EIZO), 23.6, 23.8(EIZO) 24, 27
		 if (myWidth === 1200 || myHeight === 1200) {
		 	newDiagonal = 24; //just a bit more likely //1920 X 1200  24
		 	if (Mac && !iOS && myCSSpixel === 2) {
		 		newDiagonal = 15.4; //Macbook Pro //highest standard resolution // More Space (Mehr Flaeche)
			 	globalVars.preset_zoom = 1440/1920; //needs a min arcmin
			 	globalVars.emulation_multiplicator = 1440/1920; //1440/1024 //not yet perfect!!! // to font is not increasing
				globalVars.initial.csspixel = globalVars.initial.csspixel * globalVars.emulation_multiplicator;
		 	}
		 }

	}
	else if (myWidth <= 2560 && myHeight <= 2560) {
		newDiagonal = 27; // newDiagonal = 27; //iMac 1440x2560 // Thunderbolt Display / EIZO / ..
		//2560 x 1440 27 acer 25zoll
        //Samsung S27A850D LED-Monitor 68.58 cm ( 27" ) 2560 x 1440 300 cd/m2

		if(Mac && myHeight === 1600) { //1600
          newDiagonal = 13.3;//33.78cm; // MacBook +  Pro (Retina, volle Auflösung)
        }

        if(myHeight === 1080) {
        	newDiagonal = 29; //2560 x 1080 29 (asu)s
        	 //hilips Brilliance 298P4QJEB LED-Monitor 73 cm ( 29" ) 2560 x 1080
          //NEC MultiSync EA294WMi LED-Monitor 73.7 cm ( 29" ) 2560 x 1080
        }
	}
	else if (myWidth <= 2880 && myHeight <= 2880) {
			newDiagonal = 29;
			if(myHeight === 1800 && myCSSpixel < 2) {
				newDiagonal = 15.4;// Macbook 15.4 Retina auf voller Auflösung
			}

	}
	else if (myWidth <= 5000 && myHeight <= 5000) {
		newDiagonal = 34;
		// 3440 x 1440 34 LG
        // 3840 x 2160 4K 31.5  SAMSUNG
        //LG 31MU97-B LED-Monitor 79 cm ( 31" ) 4096 x 2160 4K
        //LG 34UC87-B LED-Monitor gebogen 87 cm ( 34" ) 3440 x 1440
        //LG 34UM95-P LED-Monitor 87 cm ( 34" ) 3440 x 1440 QHD AH-IPS
        //https://en.wikipedia.org/wiki/List_of_common_resolutions
	}


        globalVars.preset.diagonal = newDiagonal || 13.3 ;



      	if(newDiagonal < 6) {
		    globalVars.preset.distance = 35;
		}
		else if (newDiagonal < 10) {
			globalVars.preset.distance = 45;
		}
		else if (newDiagonal < 18) {
			globalVars.preset.distance = 60;
		}
		else if (newDiagonal < 30) {
			globalVars.preset.distance = 70;
		}


        //Update (not so nice! ?)

      globalVars.comperator.calcPPI(globalVars.preset, "inch",  globalVars.initial.csspixel);
      globalVars.comperator.updateReadingDistance({distance: globalVars.preset.distance}, "cm");
      globalVars.comperator.updater.update();


      //Alternative
        // $('#diagonal').val(31);
        // $('#distance').val(100);
      // But how to add detection, that a value got changed like that??

   //}
};

globalVars.pushFontlist = function(mySelect) {
      var content = mySelect || $('#active_fonts').html(),
      $divContainerArray = [],
      fontName = "",
      isContainer = $(".chooseFontsContainer label.select").length || false,
      fonts_array = [1,2];

      for(var l = 0; l < fonts_array.length; l++) {
        if(!isContainer) {

          $divContainerArray[l] = $("<label class='select' id='fontselect" + (l + 1) +"_select'>");
          $divContainerArray[l].appendTo('#fontselect' + (l + 1));

        } else {
          $divContainerArray[l] = $(".chooseFontsContainer label.select#fontselect" + (l + 1) +"_select" )
        }



        $divContainerArray[l].html(content);
        fontName = globalVars.initalFonts["font" + (l + 1)];

        $("#fontselect" + (l + 1) +" select").val(fontName);
        globalVars.setCSS( "font" + (l + 1) + "Style", "." + "font" + (l + 1) + " {font-family: '" + fontName + "', 'Blank';}" );
      }
      ManusComperator.prototype.normalizeFonts();
      ManusComperator.prototype.updateCompare();
      globalVars.fontlistinitiated  = true;

 }

globalVars.placeCaretAtEnd = function(el) {
//function placeCaretAtEnd(el) {  //http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
//http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function populateFontList(fontArr) { //populateFontListdelayed() // flash detection
	//var fontArr = globalVars.flashFontlist;

	//gets called by flashfile (only online)
	//saved from http://hasseg.org/stuff/fontList/example.html
	//!!!actionscript needs: flash.system.Security.allowDomain('http://localhost'); //to work locally (didnt got it workin)
	// wonderfl.net (was down)
	//fontArr = ["Lucida Grande"].concat(fontArr);
	//fontArr = ["monospace"].concat(fontArr);

	// fontArr = ["Lucida Grande"].concat(fontArr);
	// fontArr = ["Amman Serif Arabic"].concat(fontArr);
	// fontArr = ["sans-serif"].concat(fontArr);
	fontArr = ["Unidentified Fallback"].concat(fontArr); //None, Unidentified Fallback
	//fontArr = ["None"].concat(fontArr);
	//fontArr = ["Geeza Pro"].concat(fontArr); //None, Unidentified Fallback

	// console.log("populateFontList");

	var testString = document.getElementById("testcharactersinfont").textContent; //innerHTML;

	var d = new Detector();
	var str = '', my_list;

	str += "<select name='active_fonts'>";
	str += '<option value="Blank" >None</option>'; // Fallback -> Blank
	for(var i = 0; i < fontArr.length; i++) {
		if(testString === "nocheck") {
			str += '<option value="'+fontArr[i]+'" >' + fontArr[i] +'</option>';
		} else if(d.detect(fontArr[i], testString)) {
			str += '<option value="'+fontArr[i]+'" >' + fontArr[i] +'</option>'; //same ??
			}
		}

	str += "</select>";


	globalVars.pushFontlist(str);
	$('#active_fonts').html(str);

	globalVars.flashfontlistinitiated = true;


	//$("#fontselect1 select").html(str)
	//$("#fontselect2 select").html(str)

	//$("#fontselect1 select").val(globalVars.initalFonts.font1 || $("#fontselect1 select option:first").val()); //
	//$("#fontselect2 select").val(globalVars.initalFonts.font2 || $("#fontselect1 select option:eq(1)").val()); //


}

//remove element
//http://stackoverflow.com/questions/3387427/javascript-remove-element-by-id

//var populateFontListTimeOut;

// function populateFontList(fontArr) {
// globalVars.flashFontlist = fontArr;
// clearTimeout(populateFontListTimeOut);
//     populateFontListTimeOut = setTimeout(populateFontListdelayed, 0); //wait for "Blank" Font
// };


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


Object.getthelength = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// Get the size of an object
//var size = Object.getthelength(myArray);

//http://stackoverflow.com/questions/5223/length-of-a-javascript-object-that-is-associative-array
//newer: Object.keys(obj).length


