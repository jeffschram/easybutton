# EZBTN BOOKMARKLET LOADER
# V 0
# BY JEFF SCHRAM AKA IAMFRANZ
# -------------------------------------------------------
# THIS SCRIPT DOES THE FOLLOWING
# 1) LOAD THE CURRENT VERSION OF THE EZBTN BOOKMARKLET



# LOAD THE BOOKMARKLET
(->
  # DEFINE GLOBAL VARIABLES
  window.EZBTNBookmarklet = {}
  EZBTNBookmarklet.version = "0"
  EZBTNBookmarklet.baseURL = "http://0.0.0.0:4567"
  EZBTNBookmarklet.accountToken = document.getElementById("ezbtn-bookmarklet-script-loader").getAttribute("data-account")

  EZBTNBookmarkletScript = document.createElement("script")
  EZBTNBookmarkletScript.setAttribute "id", "ezbtn-bookmarklet-script"
  EZBTNBookmarkletScript.setAttribute "src", "/javascripts/ezbtn-bookmarklet-v"+EZBTNBookmarklet.version+".js"
  document.body.appendChild EZBTNBookmarkletScript
)()