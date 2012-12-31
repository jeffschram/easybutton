$(document).ready(function(){

 overlays = [];

  if (localStorage.getItem("ezbtnOverlays")) {
    overlays = $.parseJSON(localStorage.getItem("ezbtnOverlays"));
    // console.log('overlays.length', overlays.length);
    $.each(overlays, function(i, item) {
      var filedata, filename;
      filename = overlays[i].overlayFilename;
      filedata = overlays[i].overlayFiledata;
      return $("#overlay").append("<li class='overlay-option'><a href=''><img src='" + filedata + "'> " + filename + "</a><a data-overlay-option-key='" + i + "' class='delete-overlay-option'>x</a></li>");
    });
  }
});



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
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
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