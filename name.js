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
  var draggableDiv = document.getElementById("draggable");
  var isDragging = false;

  draggableDiv.addEventListener("mousedown", function(event) {
    isDragging = true;
  });

  draggableDiv.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  });

  document.addEventListener("mousemove", function(event) {
    if (isDragging) {
      draggableDiv.style.left = event.clientX + "px";
      draggableDiv.style.top = event.clientY + "px";
    }
  });

  document.addEventListener("mouseup", function(event) {
    isDragging = false;
  });

  document.addEventListener("dragover", function(event) {
    event.preventDefault();
  });

  document.addEventListener("drop", function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text/plain");
    var draggableElement = document.getElementById(data);
    var dropzone = event.target;

    if (dropzone.id === "draggableDiv") {
      return;
    }

    dropzone.appendChild(draggableElement);
  });
}):
function updateTime() {
  var currentTime = new Date();
  var options = { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  var time = currentTime.toLocaleTimeString(undefined, options);
  document.getElementById('time').innerHTML = time;
}