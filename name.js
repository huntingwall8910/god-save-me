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
window.onload = function() {
  var currentTimeElement = document.getElementById('current-time');
  function updateCurrentTime() {
    var currentTime = new Date();
    var options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    var formattedTime = currentTime.toLocaleString('en-US', options);
    currentTimeElement.textContent = formattedTime;
  }
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
};