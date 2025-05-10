/* 
is this module necessary?
no
*/
export let mouseX = 0;
export let mouseY = 0;
window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});