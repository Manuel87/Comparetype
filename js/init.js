new ManusComperator();

//ctrl // ⌘ // ⌃
jwerty.key('ctrl+R', function () {
     $('body').toggleClass("showruler");
 });

jwerty.key('ctrl+1', function () {
  console.log("adjust");
     ManusComperator.prototype.adjustLayout();
 });

var view_left = true,
content_width = $("#container_main").width(),
$scrollelement = $("#container_wrapper"); //globalVars.$body

jwerty.key('ctrl+O', function () {
   //$("html, body").animate({ scrollLeft: $(document).width() }, "slow");
  //return false;

//$(".fixedbottom").css({"top": window_height - $(".fixedbottom").height() + "px"});

if($scrollelement.scrollLeft()) {
     $scrollelement.scrollLeft(0);
  } else {
     $scrollelement.scrollLeft(content_width);
  }

  //globalVars.$html.scrollLeft = document.width;

  //$("html, body").scrollLeft($(document).width());
 });


$("#singlemode_switchfonts_button_left").click(function() {

     $scrollelement.scrollLeft(0);
});



$("#singlemode_switchfonts_button_right").click(function() {

     $scrollelement.scrollLeft(content_width);

});


$(document).ready(function(){
  guessScreensize();

//$(".font1.comparetext .wrap").get(0).select();

  if(!globalVars.fontlistinitiated) {

    if(globalVars.OS.Type.iOS) {

      setFontlist(globalVars.FontLists.iOS);
    }
    else if(globalVars.OS.Type.Mac) {
      setFontlist(globalVars.FontLists.Fallback + globalVars.FontLists.OSXMin + globalVars.FontLists.Adobe );
    }
    else {
      setFontlist(globalVars.FontLists.Fallback + globalVars.FontLists.Win + globalVars.FontLists.Adobe );
      globalVars.pushFontlist($('#active_fonts').html());
    };
    globalVars.fontlistinitiated = true;








      //$("#fontselect1 select").val(globalVars.initalFonts.font1);
     // $("#fontselect2 select").val(globalVars.initalFonts.font2);

      //globalVars.setCSS( "font1" + "Style", "." + "font1" + " {font-family: '" + globalVars.initalFonts.font1 + "', 'Blank';}" );
      //globalVars.setCSS( "font2" + "Style", "." + "font2" + " {font-family: '" + globalVars.initalFonts.font2 + "', 'Blank';}" );





     //setiOS7_Fontlist();

     //append Edit-CSS-Button Fontadjust

     var cssEditContentButton = [],
     cssEditContentStyle = [],
     mySelectorArray = [".font1_adjust", ".font2_adjust"];
     $fontselectdiv = $(".fontselectdiv");
     $fontselectdiv.addClass("css_edit");
     for (i = 0; i < mySelectorArray.length; i++) {
        cssEditContentButton[i] = '<i class="fa fa-cog"></i>';
        cssEditContentStyle[i] = '' + //'<style contenteditable="true" ' + '>' +
          mySelectorArray[i] +' {' + '\n' +
          '\n' +
          '  word-spacing:   0.00em;' + '\n' +
          '  letter-spacing: 0.00em;' + '\n' +
          '  font-size:      1.00em;' + '\n' +
          '  transform: translate(0,0.0em);' + '\n' +
          '  font-weight:    normal;' + '\n' + //font-style
          '  font-style:     normal;' + '\n' + //font-style
          '\n' +
          '}' + '\n';// +
         // '</style>';

           newdiv = $('<button class="openbutton morebutton button noborder no-print" >');
            newdiv.html(cssEditContentButton[i]);
            newdiv.appendTo('#fontselect' + (i + 1) + '');

            newdiv = $('<style contenteditable="true">');
            newdiv.html(cssEditContentStyle[i]);
            newdiv.appendTo('#fontselect' + (i + 1) + '');
     }





    $(".chooseFontsContainer button.morebutton ").on("click", function(event) {
        $(this).next("style").toggleClass("open");
    });

   }

setTimeout(function(){globalVars.placeCaretAtEnd( $('.font1.comparetext .content')[0])},4000); //document.getElementById("fuckup")

// ManusComperator.prototype.UpdateLayoutFontsizes(".myReadingRegular", "arcmin", 10 );
 });


var checkifChromeonMac = function() {
	var Mac = /(Mac)/g.test( navigator.userAgent ),
   Chrome = /(Chrome)/g.test( navigator.userAgent ),
   $notchromeonmac = $('#notchromeonmac'); //test if "Mac" is in the useragent var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

   if ( !(Mac && Chrome)) {

   		$notchromeonmac.show();
   		$notchromeonmac.mouseup(function(event) {
   			/* Act on the event */
   			$notchromeonmac.hide();
   		});
   };
}();


// document.onmousemove = handleMouseMove;
  //  function handleMouseMove(event) {   }

var watched_events = ['mousemove', 'touchmove', 'keypress'];
//'click',
//'touchstart', 'gesturestart', 'gestureend', gesturechange'
//'mouseover', 'mousedown', 'mouseenter', 'mouseout', 'mouseleave', 'mouseup', 'touchend', 'touchcancel'


var idleTime = 0,
$document = $(document);
$document.ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 1000); // 1 sec minute

    //Zero the idle timer on mouse movement.
 //   $(this)
 $document.on(watched_events.join(' '), function(event){
       idleTime = 0;
          $("#header").fadeIn();
          console.log("klj");
});

/*    $document.mousemove(function (e) {
      console.log("mou");
        idleTime = 0;
          $("#header").fadeIn();
    });
    //$(this)
    $document.keypress(function (e) {
        idleTime = 0;
        $("#header").fadeIn();
    }); */
});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 60) { // 5 seconds
        //window.location.reload();
        $("#header").fadeOut();
    }
}


//$(".char.e").on("mouseover", function () {
     //stuff to do on mouseover
//});





//http://www.javascriptkeycode.com/
//R=82 / 1=49

// var map = []; // Or you could call it "key"
// onkeydown = onkeydown = function(e){
//     e = e || event; // to deal with IE
//     map[e.keyCode] = e.type == 'keydown';
//     /*insert conditional here*/
//     if(map[91] && map[16] && map[82]){ // CTRL+SHIFT+R //A(65) //CMD = 91 // ctrl = 17
//
//     };
// }


// $(document).keydown(function(e) {
	// if (e.keyCode == 49) {
	// 	//alert("R pressed");
	// 	$('#ruler').toggle();
	// 	//return false;
	// }


// else if(map[17] && map[16] && map[66]){ // CTRL+SHIFT+B
//     alert('Control Shift B');
// }else if(map[17] && map[16] && map[67]){ // CTRL+SHIFT+C
//     alert('Control Shift C');
// }
// });
