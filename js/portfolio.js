$('#windows-start-button').click(function () {
    
    $('.start-bar').show();

});

function openWindow(idWindow, idButtonFromTaskbarToShow) {
  
  $(idWindow).show();
  $(idButtonFromTaskbarToShow).show();
  $(idWindow).css("z-index", "10000");

}

function minimizeWindow(idWindowToMinimize) {
  
  $(idWindowToMinimize).hide();

}

function maximizeWindow(idWindow, idBtnMaximize, idBtnRestore) {

  if($('#'+idBtnMaximize).length){

    $('#'+idBtnMaximize).attr('aria-label', 'Restore');

    $('#' + idBtnMaximize).attr('id', idBtnRestore);

    $('#' + idWindow).css("width", "100%");

    $('#' + idWindow).css("height", "96%");
    
    $('#' + idWindow).css("position", "fixed");

    $('#' + idWindow).css("top", "0px");

    $('#' + idWindow).css("left", "0px");

    if (idBtnMaximize === "maximize") {

      $("#photo").css("width", "60em");
      $("#photo").css("height", "77em");
    }

    if (idBtnMaximize === "maximize-about-me") {
      
      $("textarea").css("height", "78em");
    }

    if (idBtnMaximize === "maximize-internet-explorer") {
      
      $("iframe").css("height", "1000px");
    }
  }

  else {

    $('#' + idWindow).css("width", "40%");
    
    $('#'+idWindow).css("height", "auto");

    $('#'+idBtnRestore).attr('aria-label', 'Maximize');

    $('#' + idBtnRestore).attr('id', idBtnMaximize);
    
    if (idBtnMaximize === "maximize") {

      $("#photo").css("width", "400px");
      $("#photo").css("height", "auto");
    }

    if (idBtnMaximize === "maximize-about-me") {
      
      $("textarea").css("height", "auto");
    }

    if (idBtnMaximize === "maximize-internet-explorer") {
      
      $("iframe").css("height", "500px");
    }
    

  }

}


function closeWindow(idWindowToClose, idButtonFromTaskbarToClose) {
  
  $(idWindowToClose).hide();

  $(idButtonFromTaskbarToClose).hide();
}

function btnShowOrHideWindow(idWindowToShowOrHide) {

  if ($(idWindowToShowOrHide).hasClass("showed")) {
    
    $(idWindowToShowOrHide).toggleClass("showed").addClass("hidded");

    $(idWindowToShowOrHide).hide();

    }

    else{

      $(idWindowToShowOrHide).show();
      $(idWindowToShowOrHide).addClass("showed");

    }

}

function moveElementWithMouse(id, idBtnMaximize, idBtnRestore) {
  
  var mousePosition;
  var offset = [0,0];
  var w;
  var isDown = false;
  var windows;

  var counter = 1;
      
  w = document.getElementById(id);
  windows = document.getElementsByClassName('window');

  w.addEventListener('mousedown', function (e) {

    for(var i =0, il = windows.length;i<il;i++){
      windows[i].style.zIndex = 0;
    }

    w.style.zIndex = ++counter;
    isDown = true;
      offset = [
          w.offsetLeft - e.clientX,
          w.offsetTop - e.clientY
    ];
   
    
  }, true);
  
  document.addEventListener('mouseup', function () {
    isDown = false;
  }, true);
  
  document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    
    if (isDown) {

      if ($('#' + idBtnRestore).length) {
      
        $('#' + id).css("width", "40%");
    
        $('#'+id).css("height", "auto");

        $('#'+idBtnRestore).attr('aria-label', 'Maximize');

        $('#' + idBtnRestore).attr('id', idBtnMaximize);
        
        if (idBtnMaximize === "maximize") {

          $("#photo").css("width", "400px");
          $("#photo").css("height", "auto");
        }

        if (idBtnMaximize === "maximize-about-me") {
          
          $("textarea").css("height", "auto");
        }

        if (idBtnMaximize === "maximize-internet-explorer") {
          
          $("iframe").css("height", "500px");
        }

      }

      mousePosition = {
  
          x : event.clientX,
          y : event.clientY
  
    };

    w.style.left = (mousePosition.x + offset[0]) + 'px';
    w.style.top = (mousePosition.y + offset[1]) + 'px';
          
    }

  }, true);

}

function startTime() {

  var time = new Date();

  $(".time").css("margin", "0px");
  
  $(".time").html(time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
  
  setTimeout(startTime, 1000);
  
}

  $('#window-technologies li').click(function () {

    openWindow("#window-technologie-info", null);

    $(".web-lenguage").attr("href", $(this).children().attr("data-url"));

    $(".icon-lenguage").attr("src", $(this).children().attr("src"));
      
     $(".time-experiencie").html($(this).children().attr("data-year") + "" + " years");
    
  });
  





  
