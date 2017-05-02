/*
 * font dragr v1.5
 * http://www.thecssninja.com/javascript/font-dragr
 * Copyright (c) 2010 Ryan Seddon
 * released under the MIT License
 */
ManusComperator.prototype.getFontDrop =  function() {
	var dropContainer, dropContainer2,
		dropListing,
		displayContainer, displayContainer2,
		domElements,
		fontPreviewFragment = document.createDocumentFragment(),
		styleSheet,
		fontFaceStyle,
		persistantStorage = window.localStorage || false,
		webappCache = window.applicationCache || window,
		contentStorageTimer,
		TCNDDF = {},
		comporator = this;

	TCNDDF.setup = function() {
		dropListing = document.getElementById("fonts");
		dropContainer = document.getElementById("dropcontainer");

		dropContainer2 = document.getElementById("dropcontainer2");
		displayContainer = document.getElementById("custom");
		displayContainer2 = document.getElementById("custom2");
		styleSheet = document.styleSheets[0];

		dropListing.addEventListener("click", TCNDDF.handleFontChange, false);

		/* LocalStorage events */
		// if (persistantStorage) {
		// 	displayContainer.addEventListener("keyup", function() {
		// 		contentStorageTimer = setTimeout("TCNDDF.writeContentEdits('mainContent')", 1000);
		// 	}, false);
		// 	displayContainer.addEventListener("keydown", function() {
		// 		clearTimeout(contentStorageTimer);
		// 	}, false);

		// 	// Restore changed data
		// 	TCNDDF.readContentEdits("mainContent");
		// }

		/* DnD event listeners */
		dropContainer.addEventListener("dragenter", function(event) {
			TCNDDF.preventActions(event);
		}, false);
		dropContainer.addEventListener("dragover", function(event) {
			TCNDDF.preventActions(event);
		}, false);
		dropContainer.addEventListener("drop", TCNDDF.handleDrop, false);

		//////

		dropContainer2.addEventListener("dragenter", function(event) {
			TCNDDF.preventActions(event);
		}, false);
		dropContainer2.addEventListener("dragover", function(event) {
			TCNDDF.preventActions(event);
		}, false);
		dropContainer2.addEventListener("drop", TCNDDF.handleDrop, false);


		////

		/* Offline event listeners */
		webappCache.addEventListener("updateready", TCNDDF.updateCache, false);
		webappCache.addEventListener("error", TCNDDF.errorCache, false);
	};

	TCNDDF.handleDrop = function(evt, dropcontainerInput) {
		var dt = evt.dataTransfer,
			files = dt.files || false,
			count = files.length,
			acceptedFileExtensions = /^.*\.(ttf|otf|woff)$/i;

		TCNDDF.preventActions(evt);

		for (var i = 0; i < count; i++) {
			var file = files[i],
				droppedFullFileName = file.name,
				droppedFileName,
				droppedFileSize;

			if (droppedFullFileName.match(acceptedFileExtensions)) {
				droppedFileName = droppedFullFileName.replace(/\..+$/, ""); // Removes file extension from name
				droppedFileName = droppedFileName.replace(/\W+/g, "-"); // Replace any non alpha numeric characters with -
				droppedFileSize = Math.round(file.size / 1024) + "kb";

				TCNDDF.processData(file, droppedFileName, droppedFileSize);
			} else {
				alert("Invalid file extension. Will only accept ttf, otf or woff font files");
			}
		}
	};

	TCNDDF.processData = function(file, name, size) {
		var reader = new FileReader();
		reader.name = name;
		reader.size = size;

		/*
Chrome 6 dev can't do DOM2 event based listeners on the FileReader object so fallback to DOM0
http://code.google.com/p/chromium/issues/detail?id=48367
reader.addEventListener("loadend", TCNDDF.buildFontListItem, false);
*/
		reader.onloadend = function(event) {
			TCNDDF.buildFontListItem(event);
		}
		reader.readAsDataURL(file);
	};

	TCNDDF.buildFontListItem = function(event) {
		domElements = [
			document.createElement('li'),
			document.createElement('span'),
			document.createElement('span')
		];

		var name = event.target.name,
			size = event.target.size,
			data = event.target.result;

		// Dodgy fork because Chrome 6 dev doesn't add media type to base64 string when a dropped file(s) type isn't known
		// http://code.google.com/p/chromium/issues/detail?id=48368
		var dataURL = data.split("base64");

		if (dataURL[0].indexOf("application/octet-stream") == -1) {
			dataURL[0] = "data:application/octet-stream;base64"

			data = dataURL[0] + dataURL[1];
		}

		// Get font file and prepend it to stylsheet using @font-face rule
		fontFaceStyle = "@font-face{font-family: " + name + "; src:url(" + data + ");}";
		styleSheet.insertRule(fontFaceStyle, 0);

		domElements[2].appendChild(document.createTextNode(size));
		domElements[1].appendChild(document.createTextNode(name));
		domElements[0].className = "active";
		domElements[0].title = name;
		domElements[0].style.fontFamily = name;
		domElements[0].appendChild(domElements[1]);
		domElements[0].appendChild(domElements[2]);

		fontPreviewFragment.appendChild(domElements[0]);

		dropListing.appendChild(fontPreviewFragment);
		TCNDDF.updateActiveFont(domElements[0]);
		displayContainer.style.fontFamily = name;

		///hardcoded manu
		//////////////////////////
		$('.font2_before, .font2').css({
			"font-family": name + ""
		});
		console.log()
		comporator.measureFonts();
		//ManusComperator.prototype.normalizeFonts(true, true);
	};

	/* Control changing of fonts in drop list  */
	TCNDDF.handleFontChange = function(evt) {
		var clickTarget = evt.target || window.event.srcElement;

		if (clickTarget.nodeName.toLowerCase() === 'span') {
			clickTarget = clickTarget.parentNode;
			TCNDDF.updateActiveFont(clickTarget);
		} else {
			TCNDDF.updateActiveFont(clickTarget);
		}
	};
	TCNDDF.updateActiveFont = function(target) {
		var getFontFamily = target.title,
			dropListItem = dropListing.getElementsByTagName("li");

		displayContainer.style.fontFamily = getFontFamily;

		for (var i = 0, len = dropListItem.length; i < len; i++) {
			dropListItem[i].className = "";
		}
		target.className = "active";
	};

	/* localStorage methods */
	TCNDDF.readContentEdits = function(storageKey) {
		var editedContent = persistantStorage.getItem(storageKey);

		if ( !! editedContent && editedContent !== "undefined") {
			displayContainer.innerHTML = editedContent;
		}
	};
	TCNDDF.writeContentEdits = function(storageKey) {
		var content = displayContainer.innerHTML;

		persistantStorage.setItem(storageKey, content);
	};

	/* Offline cache methods */
	TCNDDF.updateCache = function() {
		webappCache.swapCache();
		console.log("Cache has been updated due to a change found in the manifest");
	};
	TCNDDF.errorCache = function() {
		console.log("You're either offline or something has gone horribly wrong.");
	};

	/* Util functions */
	TCNDDF.preventActions = function(evt) {
		if (evt.stopPropagation && evt.preventDefault) {
			evt.stopPropagation();
			evt.preventDefault();
		} else {
			evt.cancelBubble = true;
			evt.returnValue = false;
		}
	};

	window.addEventListener("load", TCNDDF.setup, false);

	return TCNDDF
};
