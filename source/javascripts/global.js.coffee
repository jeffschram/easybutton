$(document).ready ->

  # ADJUST HEIGHT OF VIEWPORT
  adjustViewportHeight = ->
    # trying out making iframe super tall
    # unless $("#viewport").hasClass "viewport-resized"
      # viewportHeight = $(window).outerHeight() - ( $("#controls").outerHeight() + $("#controls-secondary").outerHeight() )
      # $("#viewport-iframe").css
        # height: viewportHeight
        # width: '100%'


  # RESIZE THE VIEWPORT
  resizeViewport = (settingName, settingWidth, settingHeight)->
    $("#viewport-iframe-wrap").animate
      height: settingHeight
      width: settingWidth,
      500,
      ->
        updateViewportDimensions()
    $("#viewport").addClass "viewport-resized"
    $("#viewport-title").text(settingName).fadeIn()
    updateViewportDimensions()


  # BIND DIMENSION OPTION LINKS TO CHANGE VIEWPORT
  $(".dimension-option").on "click", (e)->
    e.preventDefault()
    $this = $(this)
    resizeViewport $this.data('dimension-option-name'), $this.data('dimension-option-width'), $this.data('dimension-option-height')


  # RESET DIMENSIONS TO NORMAL
  $(".dimension-normal").on "click", (e)->
    $("#viewport-title").fadeOut ->
      $("#viewport").removeClass "viewport-resized"
      e.preventDefault()
      adjustViewportHeight()
      updateViewportDimensions()


  # MATCH CURRENT OVERLAY
  $(".dimension-resize-to-match-overlay").on "click", (e)->
    e.preventDefault()
    $img = $("#overlay-image")
    $img.removeClass("fixed").addClass("active").css
      top: 0
      left: 0
    resizeViewport "", $img.width(), $img.height()



  # OVERLAY OPTIONS
  # DELETE
  $(".delete-overlay-option").click (e) ->
    e.preventDefault()
    $(this).parent().remove()
    i = $(this).data("overlay-option-key")
    overlays.splice i, 1
    localStorage.setItem "ezbtnOverlays", JSON.stringify(overlays)
  # SELECT FROM OPTIONS LIST
  $(".overlay-option a").on "click", (e) ->
    e.preventDefault()
    $("#overlay-image").remove()  if $("#overlay-image").length
    imgSrc = $(this).find("img").attr("src")
    $("#viewport-iframe-wrap").prepend $("<img draggable='true' class='active' id='overlay-image' src='" + imgSrc + "'>")
    $("#overlay-image").draggable()
  # CHANGE OPACITY
  $("#overlay-file-opacity").on "change", ->
    $("#overlay-image").css opacity: $(this).val() / 100
  # CHANGE ACTIVE
  $(document).keypress (e)->
    key = e.which
    if key == 97
      $("#overlay-image").toggleClass "active"
      console.log 'toggle active'
    if key == 102
      $("#overlay-image").toggleClass "fixed"
      console.log 'toggle fixed'


  # UPDATE VALUES FOR WINDOW DIMENSIONS
  updateViewportDimensions = ->
    win = $("#viewport-iframe")
    wW = win.width()
    phone  = "&#x1F4F1;"
    tablet = "&#xEA01;"
    laptop = "&#xEA00;"
    desktop = "&#x1F4BB;"
    wI = phone
    rI = false
    if wW > 320
      wI = phone
      rI = true
    if wW > 568
      wI = tablet
      rI = false
    if wW > 768
      wI = tablet
      rI = true
    if wW > 1024
      wI = laptop
      rI = false
    if wW > 1400
      wI = desktop
      rI = false
    $(".icon-window-width").html wI
    if rI
      $(".icon-window-width").addClass "rotated"
    else
      $(".icon-window-width").removeClass "rotated"
    $("#window-width").html wW
    $("#window-height").html win.height()



  # UPDATE VALUES FOR MONITOR RESOLUTION
  updateMonitorResolution = ->
    monitorResolution = window.devicePixelRatio
    $("#resolution").html "Pixel Ratio "+monitorResolution
    if monitorResolution > 1
      $(".icon-resolution").html "&#xE9A0;"


  # UPDATE BROWSER INFO
  updateBrowserInfo = ->
    $("#browser-info").html BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS


  # THINGS TO DO ON LOAD AND ON WINDOW RESIZE
  $(window).bind "resize load", ->
    adjustViewportHeight()
    updateViewportDimensions()

  $(window).bind "load", ->
    updateMonitorResolution()
    updateBrowserInfo()


  # A HELPER FOR BUTTON WITH OPTIONS
  $("a[data-toggle]").click (e)->
    e.preventDefault()
    $this = $(this)
    $buttonGroup = $this.parents(".button-group")
    # console.log 'buttonGroup class', $buttonGroup.attr("class")
    if $this.hasClass "active"
      # make active panel and toggle not active
      $buttonGroup.find("a[data-toggle].active").removeClass "active"
      $buttonGroup.find(".button-options.active").hide().removeClass "active"
    else
      # make active panel and toggle not active
      $buttonGroup.find("a[data-toggle].active").removeClass "active"
      $buttonGroup.find(".button-options.active").hide().removeClass "active"
      # close any active panel and then make this one active
      $this.addClass "active"
      $("#"+$this.data("toggle")).show().addClass("active")