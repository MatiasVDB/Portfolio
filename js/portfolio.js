const HASHTAG = '#';
const WINDOW = 'window';
const ABOUT_ME = 'window-about-me';
const INTERNET_EXPLORER = 'window-internet-explorer';
var screenHeight = $(document).height();
var taskbarHeight = parseInt($("footer").css("height"));
let savedPositionTop = '';
let savedPositionLeft = '';
let idBtnRestore = '';
let mousePosition;
let offset = [0, 0];

function openWindow(idWindow, idButtonFromTaskbarToShow) {

  $(idWindow).show();
  $(idWindow).removeClass("hidded").addClass("showed");
  $(idButtonFromTaskbarToShow).show();
  putElementInFront(idWindow);

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

  if ($(HASHTAG + window).hasClass("restored")) {

    $(HASHTAG + window).removeClass("restored");
  }

  savedPositionTop = $(HASHTAG + window).css("top");
  savedPositionLeft = $(HASHTAG + window).css("left");

  $(idBtnRestore).attr('aria-label', "Restore");

  $(HASHTAG + window).css("width", "100%");

  $(HASHTAG + window).css("position", "fixed");

  $(HASHTAG + window).css("top", "0px");

  $(HASHTAG + window).css("left", "0px");

  $(HASHTAG + window).css("transform", "none");

  switch (window) {

    case ABOUT_ME:
      $("textarea").css("height", (screenHeight - taskbarHeight - 100) + "px");
      $(HASHTAG + window).css("height", (screenHeight - taskbarHeight) + "px");
      break;
    case INTERNET_EXPLORER:
      $("iframe").css("height", (screenHeight - taskbarHeight) + "px");
      break;

    default:
      $(HASHTAG + window).css("height", (screenHeight - taskbarHeight) + "px");
  }
}

function restoreWindow(window, obj) {

  $(HASHTAG + window).addClass("restored");

  $(obj).attr('aria-label', 'Maximize');

  $(HASHTAG + window).css("width", "40%");

  $(HASHTAG + window).css("top", savedPositionTop);

  $(HASHTAG + window).css("left", savedPositionLeft);

  switch (window) {
    case ABOUT_ME:
      $("textarea").css("height", "auto");
      $(HASHTAG + window).css("height", "auto");
      break;
    case INTERNET_EXPLORER:
      $("iframe").css("height", "500px");
      break;
    default:
      $(HASHTAG + window).css("height", "auto");
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
    putElementInFront(idWindowToShowOrHide);

  }

}

function putElementInFront(obj) {

  let windows;
  let counter = 1;
  windows = document.getElementsByClassName('window');

  for (var i = 0, il = windows.length; i < il; i++) {
    windows[i].style.zIndex = 0;
  }


  if ($(obj).attr('id') === 'window-technologies') {
    
    $("#window-technologie-info").css('z-index', 3);

  }

  else {

    $(obj).css('z-index', ++counter);

  }

}

function moveElementWithMouse(obj) {

  putElementInFront(obj);
  const element = $(obj).find("[aria-label='Maximize']")[0];

  $(obj).draggable({ containment: "body", scroll: false }, { handle: ".title-bar" },
    { scroll: true, scrollSensitivity: 100 },
    { cancel: ".window-body, #notepad-navbar, .window.title-bar" }, {
    start: function () {
      if (!$(obj).hasClass("restored")) {

        restoreWindow(obj.id, element);
      }

      }
  });
  $(".title-bar").disableSelection();

}

function startTime() {

  var time = new Date();

  $(".time").css("margin", "0px");

  $(".time").html(time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

  setTimeout(startTime, 1000);

}

$('#window-technologies li').click(function () {

  var hasNumber = /\d/;

  openWindow('#window-technologie-info', null);

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







