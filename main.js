//index your number will be
function gen() {
    document.getElementById("rand").innerHTML = Math.floor(Math.random() * 10000000)
  }
// name generator
function peniscumballsacks() {
    name = document.getElementById("name").value
    alert("Your name is " + name)
  }
//colors project
function change() {
  document.body.style.backgroundColor = document.getElementById("color").value;
  document.getElementById("changebtn").style.color = document.getElementById("color").value;
}
//wait until page loads
document.addEventListener("DOMContentLoaded", function() {
  //snippet loader
  fetch('nav.html')
  .then(response => response.text())
  .then(data => {
    // Insert the fetched HTML snippet into the snippet-container
    document.getElementById('snippet-container').innerHTML = data;
  })
  .catch(error => console.log('Error:', error));
  //draggable divs
  var draggableDivs = document.getElementsByClassName("draggable");
  var isDragging = false;
  var currentDraggableDiv = null;

  for (var i = 0; i < draggableDivs.length; i++) {
    draggableDivs[i].addEventListener("mousedown", function(event) {
      isDragging = true;
      currentDraggableDiv = event.target;
    });

    draggableDivs[i].addEventListener("dragstart", function(event) {
      event.dataTransfer.setData("text/html", event.target.id);
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
//time
function updateTime() {
  var currentTime = new Date();
  var options = { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  var time = currentTime.toLocaleTimeString(undefined, options);
  document.getElementById('time').innerHTML = time;
}
//kick user if on mobile
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  window.location.replace("mobile.html")
} else {
  // No action
}
