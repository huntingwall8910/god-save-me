document.getElementById("sitename").innerHTML = window.location.hostname;
function gen() {
    document.getElementById("rand").innerHTML = Math.floor(Math.random() * 10000000)
  }
function peniscumballsacks() {
    name = document.getElementById("name").value
    alert("Your name is " + name)
  }
var coll = document.getElementsByClassName("collapsible");
var i;
  
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}