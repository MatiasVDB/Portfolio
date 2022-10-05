const hashtag = '#';
var savedPositionTop = '';
var savedPositionLeft = '';
var idBtnRestore = '';

function openWindow(idWindow, idButtonFromTaskbarToShow) {

  $(idWindow).show();
  $(idButtonFromTaskbarToShow).show();
  $(idWindow).css("z-index", "10000");

}

function minimizeWindow(idWindowToMinimize) {

  $(idWindowToMinimize).hide();

  $(idWindowToMinimize).removeClass("showed").addClass("hidded");

}

function selectorSizeWindow(window, e) {

  if ($(e).attr('aria-label') === 'Maximize') {

    maximizeWindow(window, e);

  }

  else {

    restoreWindow(window, e);
  }
}

function maximizeWindow(window, obj) {

  idBtnRestore = obj;
  savedPositionTop = $(hashtag + window).css("top");
  savedPositionLeft = $(hashtag + window).css("left");

  $(obj).attr('aria-label', "Restore");

  $(hashtag + window).css("width", "100%");

  $(hashtag + window).css("position", "fixed");

  $(hashtag + window).css("top", "0px");

  $(hashtag + window).css("left", "0px");

  $(hashtag + window).css("transform", "none");

  switch (window) {
    case 'window':
      $("#photo").css("width", "60em");
      $("#photo").css("height", "77em");
      break;
    case 'window-about-me':
      $("textarea").css("height", "78em");
      break;
    case 'window-internet-explorer':
      $("iframe").css("height", "1000px");
      break;
    default:
      $(hashtag + window).css("height", "96%");
  }
}

function restoreWindow(window, obj) {

  $(obj).attr('aria-label', 'Maximize');

  $(hashtag + window).css("width", "40%");

  $(hashtag + window).css("top", savedPositionTop);

  $(hashtag + window).css("left", savedPositionLeft);

  $(hashtag + window).css("transform", "translate(-50%, -50%)");

  switch (window) {
    case 'window':
      $("#photo").css("width", "400px");
      $("#photo").css("height", "auto");
      $(hashtag + window).css("transform", "none");
      break;
    case 'window-about-me':
      $("textarea").css("height", "auto");
      $(hashtag + window).css("transform", "none");
      break;
    case 'window-internet-explorer':
      $("iframe").css("height", "500px");
      break;
    default:
      $(hashtag + window).css("height", "auto");
  }
}


function closeWindow(idWindowToClose, idButtonFromTaskbarToClose) {

  $(idWindowToClose).hide();

  $(idButtonFromTaskbarToClose).hide();
}

function btnShowOrHideWindow(idWindowToShowOrHide) {

  if ($(idWindowToShowOrHide).hasClass("showed")) {

    $(idWindowToShowOrHide).hide();
    $(idWindowToShowOrHide).removeClass("showed").addClass("hidded");

  }

  else {

    $(idWindowToShowOrHide).show();
    $(idWindowToShowOrHide).removeClass("hidded").addClass("showed");
    $(idWindowToShowOrHide).css("z-index", "10000");

  }

}

function moveElementWithMouse(id) {

  var mousePosition;
  var offset = [0, 0];
  var w;
  var isDown = false;
  var windows;
  var counter = 1;

  w = document.getElementById(id);

  windows = document.getElementsByClassName('window');

  w.addEventListener('mousedown', function (e) {

    for (var i = 0, il = windows.length; i < il; i++) {
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

  document.addEventListener('mousemove', function (event) {
    event.preventDefault();

    if (isDown) {

      if ($(idBtnRestore).attr('aria-label') === 'Restore') {

        if (id !== 'window-technologie-info') {

          restoreWindow(id, idBtnRestore);

        }
      }   
      mousePosition = {

        x: event.clientX,
        y: event.clientY

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

  var hasNumber = /\d/;

  openWindow("#window-technologie-info", null);

  $(".web-lenguage").attr("href", $(this).children().attr("data-url"));

  $(".icon-lenguage").attr("src", $(this).children().attr("src"));

  if ($(this).children().attr("data-year").includes("1")) {

    $(".time-experiencie").html($(this).children().attr("data-year") + "" + " year");

  }

  else {

    if (!hasNumber.test($(this).children().attr("data-year"))) {

      $(".time-experiencie").html($(this).children().attr("data-year"));
    }

    else {

      $(".time-experiencie").html($(this).children().attr("data-year") + "" + " years");

    }

  }

});







