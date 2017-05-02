// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


// Inverts Everything
///
// (function() {
//     // the css we are going to inject
//     var css = 'html {-webkit-filter: invert(100%);' +
//         '-moz-filter: invert(100%);' +
//         '-o-filter: invert(100%);' +
//         '-ms-filter: invert(100%); }',

//         head = document.getElementsByTagName('head')[0],
//         style = document.createElement('style');

//     // a hack, so you can "invert back" clicking the bookmarklet again
//     if (!window.counter) {
//         window.counter = 1;
//     } else {
//         window.counter++;
//         if (window.counter % 2 === 0) {
//             css = 'html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }';
//         }
//     }

//     style.type = 'text/css';
//     if (style.styleSheet) {
//         style.styleSheet.cssText = css;
//     } else {
//         style.appendChild(document.createTextNode(css));
//     }

//     //injecting the css to the head
//     head.appendChild(style);
// }());
