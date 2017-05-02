/** fontdetect.js
 * JavaScript code to detect available availability of a
 * particular font in a browser using JavaScript and CSS.
 *
 * Author : Lalit Patel
 * Website: http://www.lalit.org/lab/javascript-css-font-detect/
 * License: Apache Software License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Version: 0.15 (21 Sep 2009)
 *          Changed comparision font to default from sans-default-default,
 *          as in FF3.0 font of child element didn't fallback
 *          to parent element if the font is missing.
 * Version: 0.2 (04 Mar 2012)
 *          Comparing font against all the 3 generic font families ie,
 *          'monospace', 'sans-serif' and 'sans'. If it doesn't match all 3
 *          then that font is 100% not available in the system
 * Version: 0.3 (24 Mar 2012)
 *          Replaced sans with serif in the list of baseFonts
 * Version: 0.4 (Jan 2012)
            Several Updates by Manuel von Gebhardi
 */

/**
 * Usage: d = new Detector();
 *        d.detect('font name');
 */
var Detector = function() {
    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    var baseFonts = ['"Blank"']; //'none', 'sans-serif', 'serif']; //, 'sans-serif', 'serif' 'monospace', 'fantasy', 'cursive' is throwing an error in arabic
    //'Verdana', DejaVu Sans Mono

    //we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    //var testString = testString || "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = '100px';

    var h = document.getElementsByTagName("body")[0];

    // create a SPAN in the document to get the width of the text we use to test
    var s = document.createElement("span");
    s.setAttribute("id", "fontcheckid");


    function detect(font, testString) {
        var detected = false;
        testString = testString || "الألمانية";
        var defaultWidth = {};
        s.style.fontSize = testSize;
        s.innerHTML = testString;
        var matched = false;

        for (var index in baseFonts) {
            //get the default width for the three base fonts
            s.style.fontFamily = baseFonts[index]; // + ", 'Blank'";
            h.appendChild(s);
            defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font

            // console.log("Teststring: " + testString );
            // console.log("Basefont: " + s.style.fontFamily );
           // console.log("basefont_defaultWidth: " + defaultWidth[baseFonts[index]] );
            h.removeChild(s);
        }
        for (var index in baseFonts) {
            s.style.fontFamily = '"' + font + '" , ' + baseFonts[index]; // name of the font along with the base font for fallback.
            h.appendChild(s);
            matched += (s.offsetWidth == defaultWidth[baseFonts[index]]);
            // console.log("FontWidth: " + s.offsetWidth );

            //s.offsetWidth != defaultWidth[baseFonts[index]];
            // if(!matched) {console.log(s.style.fontFamily + " " + s.offsetWidth + " " + defaultWidth[baseFonts[index]]);
            // };
            h.removeChild(s);

        }
        if(!matched) {
           // baseFonts.push(font); // bad performance!
        }
        //console.log(!matched);
        detected = detected || !matched;

        //new since blank font
        // if(s.offsetWidth !== defaultWidth[baseFonts[index]]) {
        //     return true;
        // }

        return detected;
    }

    this.detect = detect;
};
