document.getElementById("sitename").innerHTML = window.location.hostname;
function gen() {
    document.getElementById("rand").innerHTML = Math.floor(Math.random() * 10000000)
  }
function peniscumballsacks() {
    name = document.getElementById("name").value
    alert("Your name is " + name)
  }
const slider = document.getElementById("myRange");
const wrapper = document.querySelector(".wrapper");

slider.addEventListener("input", function() {
  wrapper.style.animationDuration = `${this.value}s`;
});
function change() {
  document.body.style.backgroundColor = document.getElementById("color").value;
  document.getElementById("changebtn").style.color = document.getElementById("color").value;
}
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

var isMouseDown,initX,initY,height = draggable.offsetHeight,width = draggable.offsetWidth;

draggable.addEventListener('mousedown', function(e) {
  isMouseDown = true;
  document.body.classList.add('no-select');
  initX = e.offsetX;
  initY = e.offsetY;
})

document.addEventListener('mousemove', function(e) {
  if (isMouseDown) {
    var cx = e.clientX - initX,
        cy = e.clientY - initY;
    if (cx < 0) {
      cx = 0;
    }
    if (cy < 0) {
      cy = 0;
    }
    if (window.innerWidth - e.clientX + initX < width) {
      cx = window.innerWidth - width;
    }
    if (e.clientY > window.innerHeight - height+ initY) {
      cy = window.innerHeight - height;
    }
    draggable.style.left = cx + 'px';
    draggable.style.top = cy + 'px';
  }
})

draggable.addEventListener('mouseup', function() {
  isMouseDown = false;
  document.body.classList.remove('no-select');
})

function updateTime() {
  var currentTime = new Date();
  var options = { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  var time = currentTime.toLocaleTimeString(undefined, options);
  document.getElementById('time').innerHTML = time;
}