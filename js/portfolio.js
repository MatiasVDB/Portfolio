const HASHTAG = '#';
const WINDOW = 'window';
const ABOUT_ME = 'window-about-me';
const INTERNET_EXPLORER = 'window-internet-explorer';
let savedPositionTop = '';
let savedPositionLeft = '';
let idBtnRestore = '';

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
  savedPositionTop = $(HASHTAG + window).css("top");
  savedPositionLeft = $(HASHTAG + window).css("left");

  $(obj).attr('aria-label', "Restore");

  $(HASHTAG + window).css("width", "100%");

  $(HASHTAG + window).css("position", "fixed");

  $(HASHTAG + window).css("top", "0px");

  $(HASHTAG + window).css("left", "0px");

  $(HASHTAG + window).css("transform", "none");

  switch (window) {
    case WINDOW:
      $("#photo").css("width", "60em");
      $("#photo").css("height", "90.5vh");
      break;
    case ABOUT_ME:
      $("textarea").css("height", "85.5vh");
      break;
    case INTERNET_EXPLORER:
      $("iframe").css("height", "90vh");
      break;

    default:
      $(HASHTAG + window).css("height", "95.2vh");
  }
}

function restoreWindow(window, obj) {

  $(obj).attr('aria-label', 'Maximize');

  $(HASHTAG + window).css("width", "40%");

  $(HASHTAG + window).css("top", savedPositionTop);

  $(HASHTAG + window).css("left", savedPositionLeft);

  $(HASHTAG + window).css("transform", "translate(-50%, -50%)");

  switch (window) {
    case WINDOW:
      $("#photo").css("width", "400px");
      $("#photo").css("height", "auto");
      $(HASHTAG + window).css("transform", "none");
      break;
    case ABOUT_ME:
      $("textarea").css("height", "auto");
      $(HASHTAG + window).css("transform", "none");
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

    // if ($("#window-technologie-info").hasClass("showed")) {

    //   console.log("boke");

    // $("#window-technologies").css('z-index', 1);

    //   $("#window-technologie-info").css('z-index', ++counter);

    // }

}

  else {

    $(obj).css('z-index', ++counter);

  }

}

function moveElementWithMouse(obj) {

  let mousePosition;
  let offset = [0, 0];
  let elementToMove;
  let isDown = false;
  elementToMove = obj;
  windows = document.getElementsByClassName('window');

  $(HASHTAG + $(obj).attr('id') + '> .title-bar').mousedown(function (e) {

    putElementInFront(elementToMove);

    isDown = true;
    offset = [
      elementToMove.offsetLeft - e.clientX,
      elementToMove.offsetTop - e.clientY
    ];

  });

  document.addEventListener('mouseup', function () {
    isDown = false;
  }, true);

  document.addEventListener('mousemove', function (event) {
    event.preventDefault();

    if (isDown) {

      if ($(idBtnRestore).attr('aria-label') === 'Restore') {

        if ($(obj).attr('id') !== 'window-technologie-info') {

          restoreWindow($(obj).attr('id'), idBtnRestore);

        }
      }   
      mousePosition = {

        x: event.clientX,
        y: event.clientY

      };

      elementToMove.style.left = (mousePosition.x + offset[0]) + 'px';
      elementToMove.style.top = (mousePosition.y + offset[1]) + 'px';

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







