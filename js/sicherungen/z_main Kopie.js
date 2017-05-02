/*Globale Variablen*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
var debugging = true;


var ppi, ppcm;

var quickdebug = "";

var diagonale_cm = false;
var diagonale_inch = false;
var long_cm = false,
    long_inch = false;


reading_distance_cm = 50; //80; //cm


//Groß er Bildschirm
diagonale_inch = 22;
diagonale_cm = 55.8;
long_cm = 47.35;

//Mein Mac
diagonale_inch = 13.3;
diagonale_cm = 33.7;
long_cm = 28.65;

// check if the window is on another monitor: http://stackoverflow.com/questions/16363474/window-open-on-a-multi-monitor-dual-monitor-system-where-does-window-pop-up

var supportsMixBlendMode = window.getComputedStyle(document.body).mixBlendMode;

var supportsBackgroundBlendMode = window.getComputedStyle(document.body).backgroundBlendMode;




myUnitSystem = "metric";


function myRound(number, digits) {
    precission = Math.pow(10, digits);
    return Math.round(number * precission) / precission;

}

// CONVERSION MATH
function px2pt(px, ppi) {
    pt = 0;
    return pt;
}



function getppi(px, inch) {
    pt = px / inch;
    return pt;
}

function getppcm(px, ppi) {
    pt = 0;
    return pt;
}



var myWindow = {
    viewport_width: document.documentElement.clientWidth, // (same but faster)  $('body').innerWidth(); //
    viewport_height: document.documentElement.clientHeight, //$(window).height(); //
    screen_width: window.screen.width || window.innerWidth, //window.screen.availWidth,
    screen_height: window.screen.height || window.innerHeight, // window.screen.availHeight,
};

myWindow.screen_diagonal = Math.sqrt(Math.pow(myWindow.screen_width, 2) + Math.pow(myWindow.screen_height, 2));


///C o n v e r t U n i t s
var myUnits = {
    vw2px: myWindow.viewport_width,
    vh2px: myWindow.viewport_height,
    px2vw: 1 / myWindow.viewport_width,
    px2vh: 1 / myWindow.viewport_height,
    //cssvmax: myWindow.viewport_height/100,
    px2pt: 1.5,
    px2inch: 1,
    px2mm: 1,
    px2cm: 1,
    pt2px: 1,
    mm2px: 1,

    in2pt: 72,
    pt2in: 1 / 72,
    in2cm: 2.54,
    cm2in: 1 / 2.54,

    mm2pt: 1,
    pt2mm: 1,
    pt2vu: 1,
    mm2vu: 1,
    vucm2pt: 0.00824565,
    vucm2cm: 0.0002908882,
    vucm2mm: 0.002908882
};

// Großer Bildschirm


//input
function setPpiByDiagonal(inch) {
    ppi = myRound((myWindow.screen_diagonal / inch), 3);
}

function setPpiByLongSide(inch) {

    if (myWindow.screen_width > myWindow.screen_height) {
        ppi = myRound((myWindow.screen_width / inch), 3); //Math.round((myWindow.screen_width / inch) * 100) / 100;
    } else {
        ppi = myRound((myWindow.screen_height / inch), 3);
    }
}

function setPpcmByDiagonal(cm) {
    ppcm = myRound((myWindow.screen_diagonal / cm), 3);
}

function setPpcmByLongSide(cm) {

    if (myWindow.screen_width > myWindow.screen_height) {
        ppcm = myRound((myWindow.screen_width / cm), 3); //Math.round((myWindow.screen_width / inch) * 100) / 100;
    } else {
        ppcm = myRound((myWindow.screen_height / cm), 3);
    }
}



switch (myUnitSystem) {
    case "metric":
        if (diagonale_cm) {
            setPpcmByDiagonal(diagonale_cm);
            setPpiByDiagonal(diagonale_cm * myUnits.cm2in);
        } else if (long_cm) {
            setPpcmByLongSide(long_cm);
            setPpiByLongSide(long_cm * myUnits.cm2in);
        } else {
            setPpiByDiagonal(diagonale_inch);
            setPpcmByDiagonal(diagonale_inch * myUnits.in2cm);
            //setPpcmByA4();
        }

        break;
    case "mix":
        if (diagonale_inch) {
            setPpiByDiagonal(diagonale_inch);
            setPpcmByDiagonal(diagonale_inch * myUnits.in2cm);
        } else {
            setPpcmByLongSide(long_cm);
            setPpiByLongSide(long_cm * myUnits.cm2in);
        }

        break;
    case "non-metric":
        if (diagonale_inch) {
            setPpiByDiagonal(diagonale_inch);
            setPpcmByDiagonal(diagonale_inch * myUnits.in2cm);
        } else {
            setPpiByLongSide(long_inch);
            setPpcmByLongSide(long_inch * myUnits.in2cm);
        }
        break;
}

myUnits.px2pt = myRound(1 / ppi * myUnits.in2pt, 3);
myUnits.pt2px = myRound(1 / myUnits.px2pt, 3);
myUnits.px2mm = myRound(1 / ppcm * 10, 3);
myUnits.mm2px = myRound(1 / myUnits.px2mm, 3);
myUnits.vu2pt = myRound(myUnits.vucm2pt * reading_distance_cm, 6);
myUnits.vu2px = myRound(myUnits.vucm2pt * reading_distance_cm * myUnits.pt2px, 6);
myUnits.px2vu = 1 / myUnits.vu2px;
quickdebug += "1vu = " + myUnits.vu2pt + "pt <br/>";
quickdebug += "1vu = " + myUnits.vu2px + "px <br/>";

quickdebug += myWindow.screen_width + " x " + myWindow.screen_height + "" + "<br/>";
quickdebug += ppi + " ppi <br/>";
quickdebug += ppcm + " ppcm <br/>";
quickdebug += "1pt = " + myUnits.pt2px + "px <br/>";
quickdebug += "1px = " + myUnits.px2pt + "pt <br/>";
// quickdebug += "1pt = " + myUnits.pt2px + "px <br/>";
// quickdebug += "1mm = " + myUnits.mm2px + "px <br/>";

//quickdebug += "<br/>" + 200 * myUnits.px2mm; // Rundungsfehler!! Aber Warum??

/*Funktionen*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/


mypt = myUnits.pt2px;
mymm = myUnits.mm2px;
myvu = myUnits.vu2px;
cssvh = myUnits.vh2px / 100;
cssvw = myUnits.vw2px / 100;

/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
var myReadingRegular = {};
var myCompareDefault = {};
var frequency = {};
var show = {};
show.measurements = {};
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/



myCompareDefault.size = 4 * cssvw; //100 * 0.9 * myvu;
myReadingRegular.lineheight = "1em";


myReadingRegular.size = 13 * 0.9 * myvu;
myReadingRegular.lineheight = "3em";


enableTypographicEm = true;
correctBaselineShift = true;


split_words = false;
split_characters = true;


show.measurements.font_size = true;
show.measurements.asc_desc = false;
show.measurements.char_width = true;


//frequency.en = "etaoinsrhldcumfpgwybvkxjqz".split("");
/*
for (var i = 0; i < frequency.en.length; i++) {
    Things[i]
};
*/





// Measuring SMallest: "7-8px" / "7su"  // 5px/5su) //3 * mypt //"5.5px" // smallest -> 7px (~6.5-7)
/*------------------------------------------------------------------------*/


/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/
/*------------------------------------------------------------------------*/

quickdebug += "mypt = " + mypt + " <br/>";
//// D o c u m e n t – R e a d y
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
$(document).ready(function() {
    /* $(".type_detail").css({
        "font-size": "100px" //8 * mypt
    }); */


    $(".myReadingRegular").css({
        "font-size": myReadingRegular.size //
    });

    $(".myCompareDefault").css({
        "font-size": myCompareDefault.size
    });

    $(".type.consultation").css({
        "font-size": 6
    });





    $('.navbar li button').on('click', function() {
        //$('li a.current').removeClass('current');
        $("body").toggleClass('mode_overlay');
    });



    initial_height = $(window).height();
    // S I Z E S
    /////
    ppi = 96;
    //myWindow.screen_width;



    // Real Typographic Font Size
    /////////////////////////////////////////////
    //////////  R E S I Z I N G     E M
    /////////////////////////////////////
    if (enableTypographicEm) {
        typographicSize_em = 1.0;

        // Get all Fontsizes
        type_detail_fontsize = parseInt($(".measuring_fonts").css("font-size"), 10);

        //
        height_1 = $(".font1 .measuring_square").height() / type_detail_fontsize; // below 8px x-height its getting werid -> (5px ex -> 7,5(15px) best to measure, not bigger!)
        height_2 = $(".font2 .measuring_square").height() / type_detail_fontsize;


        new_x_height = type_detail_fontsize * typographicSize_em;
        fontsizeadjust_1 = typographicSize_em / height_1;
        fontsizeadjust_2 = typographicSize_em / height_2;

        quickdebug += "font1 x" + fontsizeadjust_1 + "% <br/>";
        quickdebug += "font2 x" + fontsizeadjust_2 + "% <br/>";

        $("#report").html("xH_1 = " + height_1 + " | xH_2 = " + height_2 + "<br/><br/><br/>Normalize… xH => " + typographicSize_em);

        $(".font2").css({
            "font-size": fontsizeadjust_2 * 100 + "%",

        });
        $(".font1").css({
            "font-size": fontsizeadjust_1 * 100 + "%"
        });


        ////////
        ////correct basline-height;
        //position = $(".font1_before .measuring_square").offset().top;
        //quickdebug += position;
        font1_offsetTop = $(".font1 .measuring_square").offset().top;
        font2_offsetTop = $(".font2 .measuring_square").offset().top;
        font1_height = $(".font1 .measuring_square").height();
        font2_height = $(".font2 .measuring_square").height();

        baseline_offset = (font1_offsetTop + font1_height) - (font2_offsetTop + font2_height);
        baseline_offset = baseline_offset / type_detail_fontsize;
        //baseline_offset = (($(".font1_before .measuring_square").offset().top / type_detail_fontsize) + height_1) - (($(".font2_before .measuring_square").offset().top / type_detail_fontsize) + height_2);



        if (split_words) {
            if (correctBaselineShift) {

                $(".font2").each(function() {
                    actualfontsize = parseInt($(this).parent().css("font-size"), 10);

                    quickdebug += actualfontsize + "<br/>";
                    $(this).css({
                        "margin-top": -baseline_offset * actualfontsize + "px",

                    });
                });
            }
        } else {

            $(".font1, .font2").prepend('<span class="fixbaseline">.</span>');
            $(".font1 .fixbaseline").css({
                'font-size': 1 / fontsizeadjust_1 * fontsizeadjust_2 + "em",
                'font-family': $('.font2').css('font-family')
            });
            $(".font2 .fixbaseline").css({
                'font-size': 1 / fontsizeadjust_2 * fontsizeadjust_1 + "em",
                'font-family': $('.font1').css('font-family')
            });
        }



    } else {
        $(".font2").css({
            "font-size": 200 + "%",

        });
        $(".font1").css({
            "font-size": 200 + "%"
        });

    }

    letters = "";

    if (split_words) {
        if (split_characters) {

            // letters = '<span class="char">' + $(".comparetext").html().split("").join('</span><span class="char">') + "</span>";
            letters_array = $(".comparetext").html().split("");

            for (var i = 0; i < letters_array.length; i++) {
                letters += '<span class="char ' + letters_array[i] + '">' + letters_array[i] + "</span>";
            }
            // letters += "</span>";

            //letters = '<span class="words">' + letters;
            words = letters.split('<span class="char  "> </span>').join('</span><span class="char space"> </span><span class="words">');

            $(".comparetext").html('<span class="words">' + words + '</span>');




            letters_array = $(".readingtext").html().split("");
            letters = "";
            for (var j = 0; j < letters_array.length; j++) {
                letters += '<span class="char ' + letters_array[j] + '">' + letters_array[j] + "</span>";
            }



            //letters = '<span class="words">' + letters;
            words = letters.split('<span class="char  "> </span>').join('</span><span class="char space"> </span><span class="words">');
            //words = letters.split('<span class="char"> </span>').join('</span> <span class="words">');

            $(".readingtext").html('<span class="words">' + words + '</span>');





            if (show.measurements.font_size) {
                $('.show_measurements .words').prepend('<span class="typographicsize"></span>'); //after
                $(".show_measurements .words .typographicsize").css({
                    "height": myReadingRegular.size //        SMallest: "7-8px" / "7su"  // 5px/5su) //3 * mypt //"5.5px" // smallest -> 7px (~6.5-7)
                });
                $(".show_measurements .char").css({
                    "top": "-1em" //        SMallest: "7-8px" / "7su"  // 5px/5su) //3 * mypt //"5.5px" // smallest -> 7px (~6.5-7)
                });

            }

            if (show.measurements.asc_desc) {
                $('.show_measurements .words').prepend('<span class="asc_desc "></span>'); //after
                $(".show_measurements .words .asc_desc").css({
                    "height": myReadingRegular.size * 2
                });
                $(".show_measurements .typographicsize").css({
                    "top": "-2em" //        SMallest: "7-8px" / "7su"  // 5px/5su) //3 * mypt //"5.5px" // smallest -> 7px (~6.5-7)
                });
                $(".show_measurements .char").css({
                    "top": "-2em" //        SMallest: "7-8px" / "7su"  // 5px/5su) //3 * mypt //"5.5px" // smallest -> 7px (~6.5-7)
                });
            }

            if (show.measurements.char_width) {

            } else {
                $(".show_measurements .char").css({
                    "border-color": "transparent"
                });
            }

        }
    }


    /*
    $('.show_measurements .words').append('<span class="myafter "></span>'); //after
*/
    $('.module_info').html('<span>' + myRound(myReadingRegular.size * myUnits.px2vu, 2) + "vu (" + myRound(myReadingRegular.size, 2) + 'px / ' + myRound(myReadingRegular.size * myUnits.px2mm, 2) + 'mm / ' + myRound(myReadingRegular.size * myUnits.px2pt, 2) + 'pt) </span>');


    $('.compare .module_info').html('<span>maximum (' + myRound(myCompareDefault.size * myUnits.px2vw, 4) + "window width / " + myRound(myCompareDefault.size * myUnits.px2vu, 2) + "vu / " + myRound(myCompareDefault.size, 2) + 'px / ' + myRound(myCompareDefault.size * myUnits.px2mm, 2) + 'mm / ' + myRound(myCompareDefault.size * myUnits.px2pt, 2) + 'pt) </span>');




    /// Show Measurements

    $(".type_detail").append('<div class="measurement">' + type_detail_fontsize * myUnits.px2pt + " " + type_detail_fontsize + 'px</div>');
    // ( Divide by 2 as a fallback for browsers wich don’t read the 'ex' out of a font ) )

    quickdebug += "supportsMixBlendMode = " + supportsMixBlendMode;

    // DEBUGG
    if (debugging) {
        $('.debugging').append('<span>' + quickdebug +

            '</span>');
    }


});


//-----------------------------------------------------
// E N D  —  Document on ready




/// W i n d o w - R e s i z e
//--------------------------------------------

resizeTimer = 0;

$(window).resize(function() {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {

        container_width = $("#container").width();
        height = $(window).height();

        //MyResize(container_width, height)},500);
    });
});
// E N D - Window Resize


/*
function getBrowserWith() {
    if (($.browser.msie == true && $.browser.version == '9.0') || $.browser.webkit == true || $.browser.mozilla == true)
        return window.innerWidth;
    else if (($.browser.msie == true) && ($.browser.version == '7.0' || $.browser.version == '8.0'))
        return document.documentElement.clientWidth;
    else
        return screen.width;
}*/
