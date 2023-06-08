document.getElementById("sitename").innerHTML = window.location.hostname;
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