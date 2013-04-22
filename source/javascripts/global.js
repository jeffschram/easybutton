/* global.js
--------------------------------------------------------------------

  Javascript for Easy Button
  
----------------------------------------------------------------- */








/* jQuery on document ready
--------------------------------------------------------------------
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
  // Todo: Add "Show all" button to form field
  
  
  // Submitting form
  $("#viewport-url-form").submit(function(event) {
    event.preventDefault();
    thisURL = $("#viewport-url").val();        
    // Update the viewport iframe
    $("#viewport-iframe").attr("src", thisURL);
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
  
  /*
  $("#viewport-url").on("blur", function(){
    $("#viewport-urls").removeClass("shown"); 
    $("#viewport-url").val($("#viewport-url").attr("data-original-value"));
  });
  */

  // Clicking on a Viewed URL
  $("body").delegate("#viewport-urls a", "click", function(event){
    console.log("urls a clicked");
    event.preventDefault();
    $("#viewport-url").val($(this).attr("href"));
    $("#viewport-url-form").submit();
    setTimeout(function(){ $("#viewport-urls").removeClass("shown"); }, 500);
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
    $("#keypress-section").fadeIn();
    $("#keypress").text(event.which);
    setTimeout(function() {
      $("#keypress-section").fadeOut();
    }, 1000);
  });
      
  
  
  
  
  /* Resize Viewport
  ----------------------------------------------------------------- */  
  function resizeViewport(settingName, settingWidth, settingHeight) {
    $("#viewport-iframe-wrap").animate({
      height: settingHeight,
      width: settingWidth
    }, 500, function() {
      updateViewportDimensions();
    });
    $("#viewport").addClass("viewport-resized");
    $("#viewport-title").text(settingName).fadeIn();
  };
  
  $(".dimension-option").on("click", function(event) {
    var $this;
    event.preventDefault();
    $this = $(this);
    resizeViewport($this.data('dimension-option-name'), $this.data('dimension-option-width'), $this.data('dimension-option-height'));
  });
  
  $(".dimension-normal").on("click", function(event) {
    event.preventDefault();
    $("#viewport-title").fadeOut(function() {
      $("#viewport").removeClass("viewport-resized");
      $("#viewport-iframe-wrap").animate({
        height: '9000px',
        width: '100%'
      }, function() {
        ;
        updateViewportDimensions();
      });
    });
  });
  
  $(".dimension-resize-to-match-overlay").on("click", function(event) {
    var $img;
    event.preventDefault();
    $img = $("#overlay-image");
    $img.removeClass("fixed").addClass("active").css({
      top: 0,
      left: 0
    });
    resizeViewport("", $img.width(), $img.height());
  });
  
  $(".delete-overlay-option").on("click", function(event) {
    var i;
    event.preventDefault();
    $(this).parent().remove();
    i = $(this).data("overlay-option-key");
    overlays.splice(i, 1);
    localStorage.setItem("ezbtnOverlays", JSON.stringify(overlays));
  });
  
  $("body").delegate(".overlay-option a", "click", function(event) {
    var imgSrc;
    event.preventDefault();
    if ($("#overlay-image").length) {
      $("#overlay-image").remove();
    }
    imgSrc = $(this).find("img").attr("src");
    $("#viewport-iframe-wrap").prepend($("<img draggable='true' class='active' id='overlay-image' src='" + imgSrc + "'>"));
    $("#overlay-image").draggable();
  });
  
  $("#overlay-file-opacity").on("change", function() {
    $("#overlay-image").css({
      opacity: $(this).val() / 100
    });
  });
      
  
  
  
  
  /* Toggle overlay active state
  ----------------------------------------------------------------- */
  $(document).keypress(function(event) {
    var key;
    key = event.which;
    if (key === 97) {
      $("#overlay-image").toggleClass("active");
      console.log('toggle active');
    }
    if (key === 102) {
      $("#overlay-image").toggleClass("fixed");
      console.log('toggle fixed');
    }
  });
      
  
  
  
  
  /* Grid Stuff: On it's way out of this app
  ----------------------------------------------------------------- */
  $("#overlay-grid-toggle").click(function() {
    $(this).toggleClass("active");
    $("#overlay-grid").toggle();
  });
  
  $("#overlay-rhythm-toggle").click(function() {
    $(this).toggleClass("active");
    $("#overlay-rhythm").toggle();
  });
  var i = 0;
  while (i < 1000) {
    $("#overlay-rhythm .container").prepend("<div class='rhythm-row'/>");
    i++;
  }
  
  
  
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
    var monitorResolution;
    monitorResolution = window.devicePixelRatio;
    $("#resolution").html("Pixel Ratio " + monitorResolution);
    if (monitorResolution > 1) {
      $(".icon-resolution").html("&#xE9A0;");
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
  

  
  
});


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
					data[i].identity;
			}
			else if (dataProp)
				data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
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