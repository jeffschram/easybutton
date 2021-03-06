/* global.js
--------------------------------------------------------------------

  Javascript for Easy Button

----------------------------------------------------------------- */



/* jQuery on document ready
----------------------------------------------------------------- */

$(document).ready(function(){


  /* Overlays
  ----------------------------------------------------------------- */
  overlays = [];

  if (localStorage.getItem("ezbtnOverlays")) {
    overlays = $.parseJSON(localStorage.getItem("ezbtnOverlays"));

    $.each(overlays, function(i, item) {
      var filename = overlays[i].overlayFilename,
          filedata = overlays[i].overlayFiledata;
      $("#overlay").append("<li class='overlay-option'><a href=''><img src='" + filedata + "'> " + filename + "</a><a data-overlay-option-key='" + i + "' class='delete-overlay-option'>x</a></li>");
    });
  }



  /* Notes
  ----------------------------------------------------------------- */
  if (localStorage.getItem("ezbtnNotes")) {
    $("#note").text(localStorage.getItem("ezbtnNotes"));
  }
  function saveNoteContents() {
    localStorage.setItem("ezbtnNotes", $("#note").text());
  }
  $("#note").on("blur", function(){
    saveNoteContents();
  });





  /* Visited URLS
  ----------------------------------------------------------------- */
  visitedURLs = [];

  if (localStorage.getItem("ezbtnVisitedURLs")) {

    visitedURLs = $.parseJSON(localStorage.getItem("ezbtnVisitedURLs"));
    $.each(visitedURLs, function(i, item) {
      var visitedURL = visitedURLs[i].visitedURL;
      $("#viewport-urls").append("<a href='"+visitedURL+"'>"+visitedURL+"</a>");
    });
  }



  /* Viewport & URLs
  ----------------------------------------------------------------- */
  // Submitting form
  $("#viewport-url-form").submit(function(event) {
    event.preventDefault();
    thisURL = $("#viewport-url").val();
    // If thisURL doesn't start with http://, add it
    console.log(thisURL.substr(0, 7));
    if (thisURL.substr(0, 7) != "http://" ) {
      thisURL = "http://" + thisURL;
      console.log(thisURL);
    }
    // Update the viewport iframe
    $("#viewport-iframe").attr("src", thisURL);
    // Update hash
    window.location.hash = "url="+thisURL;
    // Save as the latest URL
    localStorage.setItem("ezbtnLatestURL", thisURL);
    // If thisURL is not in visitedURLs, do some shit
    var newURL = true;
    $.each(visitedURLs, function(i, item) {
      if(thisURL == visitedURLs[i].visitedURL) {
        newURL = false;
      }
    });
    if (newURL == true) {
      // Add it to Array
      visitedURLs.push({"visitedURL": thisURL});
      // Update localStorage
      localStorage.setItem("ezbtnVisitedURLs", JSON.stringify(visitedURLs));
      // Append this to the url options
      $("#viewport-urls").append("<a href='"+thisURL+"'>"+thisURL+"</a>");
    }
    setTimeout(function(){ $("#viewport-urls").removeClass("shown"); }, 500);
  });

  // Showing/Hiding Viewed URLs list
  $("#viewport-url").on("focus keyup", function(event){
    // if pressing up, down, or enter
    var key = event.which;
    if (key === 38){
      // up arrow
      $("#viewport-urls a.active").removeClass("active").prev("a.shown").addClass("active");
      $("#viewport-url").val($("#viewport-urls a.active").attr("href"));
    }
    else if (key === 40){
      // down arrow
      $("#viewport-urls a.active").removeClass("active").next("a.shown").addClass("active");
      $("#viewport-url").val($("#viewport-urls a.active").attr("href"));
    }
    else if (key === 13){
      // no need
    }
    else {
      $("#viewport-urls").addClass("shown");
      $("#viewport-urls a").removeClass("shown active");
      $("#viewport-urls a[href*='"+$(this).val()+"']").addClass("shown");
      $("#viewport-urls a[href*='"+$(this).val()+"']").eq(0).addClass("active")
    }
  });
  $("#viewport-url").on("focus", function(){
  	$(this).attr("data-original-value", $(this).val());
  });
  $("#viewport-url").on("blur", function(){
    setTimeout(function(){ $("#viewport-urls").removeClass("shown"); }, 500);
  });


  // Clicking on a Viewed URL
  $("body").delegate("#viewport-urls a", "click", function(event){
    console.log("urls a clicked");
    event.preventDefault();
    $("#viewport-url").val($(this).attr("href"));
    $("#viewport-url-form").submit();
  });


  // Mouseleave URLS hides it
  $("#viewport-urls").mouseleave(function(){
    $(this).removeClass("shown");
  });


  // Onload, if latest url is stored, let's use that
  if (localStorage.getItem("ezbtnLatestURL")) {
    latestURL = localStorage.getItem("ezbtnLatestURL");
    $("#viewport-url").attr("value", latestURL);
    $("#viewport-iframe").attr("src", latestURL);
  }

  /// Viewport refresh button
  $("#viewport-refresh").on("click", function(event) {
    event.preventDefault();
    $("#viewport-iframe").attr("src", "");
    $("#viewport-iframe").attr("src", $("#viewport-url").val());
  });






  /* Keyup Indicator
  ----------------------------------------------------------------- */
  $(document).on("keyup", function(event) {
    $("#keypress-section").show();
    $("#keypress").text(event.which);
    setTimeout(function() {
      $("#keypress-section").fadeOut();
    }, 500);
  });





  /* Resize Viewport
  ----------------------------------------------------------------- */
  function resizeViewport(settingName, settingWidth, settingHeight) {
    var settingHeight,
        settingWidth;

    if (settingName == "iPhone 5 Portrait") {
      settingHeight = 568;
      settingWidth = 320;
    }

    if (settingName == "iPhone 5 Landscape") {
      settingHeight = 320;
      settingWidth = 568;
    }

    if (settingName == "iPad Portrait") {
      settingHeight = 1024;
      settingWidth = 768;
    }

    if (settingName == "iPad Landscape") {
      settingHeight = 768;
      settingWidth = 1024;
    }

    $("#viewport-iframe-wrap")
      .attr("data-setting-name", settingName.replace(/\s+/g, '-').toLowerCase())
      .removeClass("is-showing-overlay")
      .animate({
        height: settingHeight,
        width: settingWidth
      }, 500, function() {
        updateViewportDimensions();
      });

    $("#overlay-image").fadeOut();
    $("#viewport-iframe").attr("scrolling", "auto").animate({"opacity": 1});
    $("#viewport").addClass("viewport-resized");
    $("#toggle-chrome").fadeIn();
    $("#viewport-title").fadeIn().find("span").text(settingName);
  };





  /* Resize Viewport To Match Overlays
  ----------------------------------------------------------------- */
  function resizeViewportToMatchOverlay() {
    $("#overlay-image").show();
    var $img = $("#overlay-image");
    var wrapHeight = $(window).height() - 109;
    $("#viewport-iframe").attr("scrolling", "no");
    $("#viewport").addClass("viewport-resized");
    $("#toggle-chrome").fadeOut();
    $("#viewport-iframe-wrap")
      .removeClass("is-showing-chrome")
      .addClass("is-showing-overlay")
      .animate({"width": $img.width(), "height": $img.height()}, 500, function(){
        updateViewportDimensions();
      });
    var activeOverlayFilename = "Matching " + $(".overlay-option .active").text();
    $("#viewport-title").fadeIn().find("span").text(activeOverlayFilename);
  }





  /* Toggle Chrome
  ----------------------------------------------------------------- */
  $("#toggle-chrome").on("click", function(e){
    e.preventDefault();
    var el = $(this);
    el.toggleClass("is-active");
    $("#viewport-iframe-wrap").toggleClass("is-showing-chrome");
  });





  /* Dimension Options
  ----------------------------------------------------------------- */

  // Clicking Dimension Option
  $(".dimension-option").on("click", function(event) {
    var $this;
    event.preventDefault();
    $this = $(this);
    resizeViewport($this.data('dimension-option-name'), $this.data('dimension-option-width'), $this.data('dimension-option-height'));
  });


  // Clicking Dimension Normal
  $(".dimension-normal").on("click", function(event) {
    event.preventDefault();
    $("#viewport-title").fadeOut(function() {
      $("#viewport").removeClass("viewport-resized");
      var calculatedWindowHeight = $(window).height() - ( $("#controls").height() + $("#controls-secondary").height() );
      $("#viewport-iframe-wrap").attr("data-setting-name", "reset").removeClass("is-showing-chrome").animate({
        height: calculatedWindowHeight,
        width: '100%'
      }, function() {
        ;
        updateViewportDimensions();
      });
    });
  });


  // Clicking Match Overlay Size
  $(".dimension-resize-to-match-overlay").on("click", function(event) {
    event.preventDefault();
    resizeViewportToMatchOverlay();
  });





  /* Overlay Functionality
  ----------------------------------------------------------------- */

  // Clicking Delete Overlay
  $(".delete-overlay-option").on("click", function(event) {
    var i;
    event.preventDefault();
    $(this).parent().remove();
    i = $(this).data("overlay-option-key");
    overlays.splice(i, 1);
    localStorage.setItem("ezbtnOverlays", JSON.stringify(overlays));
  });


  // Choosing Overlay Option
  $("body").delegate(".overlay-option a", "click", function(event) {
    var imgSrc;
    event.preventDefault();
    if ($("#overlay-image").length) {
      $("#overlay-image").remove();
    }
    imgSrc = $(this).find("img").attr("src");
    // REMOVE ACTIVE CLASS
    $(".overlay-option .active").removeClass("active");
    // ADD ACTIVE CLASS TO THIS A
    $(this).addClass("active");
    // Add Draggable overlay
    $("#viewport-iframe-wrap").prepend($("<img draggable='true' id='overlay-image' src='" + imgSrc + "'>"));
    $("#overlay-image").draggable();
    // ACTIVATE OVERLAY CONTROLS
    $(".overlay-control").addClass("active");
    // RESIZE VIEWPORT TO MATCH
    setTimeout(function(){resizeViewportToMatchOverlay();}, 500);
    // SET OPACITY TO 50
    $("#overlay-file-opacity").attr("value", 50).css("background", "-webkit-gradient(linear, left top, right top, color-stop(50%,#fff), color-stop(50%,#DFDFDF), color-stop(0%,#fff))");
    $("#viewport-iframe").css("opacity", .5);
    // ENABLE MATCH OVERLAY VIEWPORT
    $("#resize-match-overlay").show();

  });


  // Overlay File Opacity
  $("#overlay-file-opacity").on("change", function() {
    var percentage = $(this).val();
    $(this).css({
      "background": "-webkit-gradient(linear, left top, right top, color-stop("+percentage+"%,#fff), color-stop("+percentage+"%,#DFDFDF), color-stop(0%,#fff))"
    });
    // CHANGE IFRAME'S OPACITY
    // We want the percentage of how much to reduce the opacity of the iframe, so we go for the inverse number
    var iframePercentage = 100 - percentage;
    $("#viewport-iframe").css({
      opacity: iframePercentage / 100
    });
  });


  /* Toggle overlay active state (Move Button)
  ----------------------------------------------------------------- */
  $(document).on("click", "#overlay-toggle-active", function(event) {
    event.preventDefault();
    $("#overlay-image, #overlay-toggle-active, #viewport-iframe").toggleClass("active");
  });





  /* Update Viewport Dimensions
  ----------------------------------------------------------------- */
  function updateViewportDimensions() {
    var desktop, laptop, phone, rI, tablet, wI, wW, win;
    win = $("#viewport-iframe");
    wW = win.width();
    phone = "&#x1F4F1;";
    tablet = "&#xEA01;";
    laptop = "&#xEA00;";
    desktop = "&#x1F4BB;";
    wI = phone;
    rI = false;
    if (wW > 320) {
      wI = phone;
      rI = true;
    }
    if (wW > 568) {
      wI = tablet;
      rI = false;
    }
    if (wW > 768) {
      wI = tablet;
      rI = true;
    }
    if (wW > 1024) {
      wI = laptop;
      rI = false;
    }
    if (wW > 1400) {
      wI = desktop;
      rI = false;
    }
    $(".icon-window-width").html(wI);
    if (rI) {
      $(".icon-window-width").addClass("rotated");
    } else {
      $(".icon-window-width").removeClass("rotated");
    }
    $("#window-width").html(wW);
    $("#window-height").html(win.height());
  };





  /* Update Monitor Resolution
  ----------------------------------------------------------------- */
  function updateMonitorResolution() {
    var monitorResolution = window.devicePixelRatio;
    $("#resolution").html("Pixel Density " + monitorResolution);
    if (monitorResolution > 1) {
      $(".icon-resolution").html("&#xE9A0;");
    }
    else {
      $(".icon-resolution").html("&#xE9A3;");
    }
  };





  /* Update Browser Info
  ----------------------------------------------------------------- */
  function updateBrowserInfo() {
    $("#browser-info").html(BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS);
  };





  /* Bind functions to Window
  ----------------------------------------------------------------- */
  $(window).bind("resize load", function() {
    updateViewportDimensions();

  });
  $(window).bind("load", function() {
    updateMonitorResolution();
    updateBrowserInfo();
  });





  /* Button Toggler Helper
  ----------------------------------------------------------------- */
  $("a[data-toggle]").on("click", function(event) {
    var $buttonGroup, $this;
    console.log('toggler clicked');
    event.preventDefault();
    $this = $(this);
    $buttonGroup = $this.parents(".button-group");
    if ($this.hasClass("active")) {
      $buttonGroup.find("a[data-toggle].active").removeClass("active");
      $buttonGroup.find(".button-options.active").hide().removeClass("active");
    } else {
      $buttonGroup.find("a[data-toggle].active").removeClass("active");
      $buttonGroup.find(".button-options.active").hide().removeClass("active");
      $this.addClass("active");
      $("#" + $this.data("toggle")).show().addClass("active");
    }
  });


}); // End dom ready






/* Non jQuery Functions
--------------------------------------------------------------------
----------------------------------------------------------------- */



/* BROWSER DETECT
------------------------------------------------------------------- */
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},

	searchString: function (data) {

		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return false;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();




/* READ URL
----------------------------------------------------------------- */
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var filedata = e.target.result;
      var filename = $("#overlay-file-selector").val().replace("C:\\fakepath\\", "");
      var selectorParent = $("#overlay-file-selector").parent();
      var selectorClone = $("#overlay-file-selector").clone();
      $("#overlay-file-selector").remove();
      selectorClone.appendTo(selectorParent);
      $("#overlay").append("<li class='overlay-option'><a href=''><img src='"+filedata+"'> "+filename+"</a><a class='delete-overlay-option'>x</a></li>");
      // PUSH TO OVERLAYS JSON OBJECT
      overlays.push({"overlayFilename": filename, "overlayFiledata": filedata});
      localStorage.setItem("ezbtnOverlays", JSON.stringify(overlays));
    };
    reader.readAsDataURL(input.files[0]);
  }
}