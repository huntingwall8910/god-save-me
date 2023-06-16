function gen() {
    document.getElementById("rand").innerHTML = Math.floor(Math.random() * 10000000)
  }
function peniscumballsacks() {
    name = document.getElementById("name").value
    alert("Your name is " + name)
  }

function change() {
  document.body.style.backgroundColor = document.getElementById("color").value;
  document.getElementById("changebtn").style.color = document.getElementById("color").value;
}
document.addEventListener("DOMContentLoaded", function() {
  var draggableDivs = document.getElementsByClassName("draggable");
  var isDragging = false;
  var currentDraggableDiv = null;

  for (var i = 0; i < draggableDivs.length; i++) {
    draggableDivs[i].addEventListener("mousedown", function(event) {
      isDragging = true;
      currentDraggableDiv = event.target;
    });

    draggableDivs[i].addEventListener("dragstart", function(event) {
      event.dataTransfer.setData("text/plain", event.target.id);
    });
  }

  document.addEventListener("mousemove", function(event) {
    if (isDragging && currentDraggableDiv) {
      currentDraggableDiv.style.left = event.clientX + "px";
      currentDraggableDiv.style.top = event.clientY + "px";
    }
  });

  document.addEventListener("mouseup", function(event) {
    isDragging = false;
    currentDraggableDiv = null;
  });
});
function updateTime() {
  var currentTime = new Date();
  var options = { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  var time = currentTime.toLocaleTimeString(undefined, options);
  document.getElementById('time').innerHTML = time;
}
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  window.location.replace("mobile.html")
} else {
  //no action
}
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("sn");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
includeHTML()includeHTML()