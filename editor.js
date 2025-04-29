/*
    TODO:
        syntax highlighting
        mobile css
        more customization
        ip tracking
        unskippable ads
        anti ad block
        adding a really long line to the block comment to distract people from the other stuff in the list
*/
const editor = document.getElementById("editor")
const lines = document.getElementById("lines")
const open = document.getElementById("open")
const save = document.getElementById("save")
const saveAs = document.getElementById("save-as")
const nav = document.querySelector("nav")
const footer = document.querySelector("footer")
const modal = document.getElementById("modal")
const settings = document.getElementById("settings")

//line counter
let l = []
function lineCounter(){
    lines.textContent = "1";
    l =  editor.innerText.split(/\r?\n/)
    //ensure that enter doesnt create two lines
    for (let i = 0; i < l.length; i++){
        if (l[i] == "" && l[i + 1] == ""){
            l.splice(i+1,1)
        }
    }
    const lineCount = l.length
    for (let i = 2; i <= lineCount; i++) {
        lines.textContent += `\n${i}`;
    }
}
//ensure that it doesnt remove lines
function fileLineCounter(){
    lines.textContent = "1";
    l =  editor.innerText.split(/\r?\n/)
    const lineCount = l.length
    for (let i = 2; i <= lineCount; i++) {
        lines.textContent += `\n${i}`;
    }
}
editor.addEventListener("input",lineCounter)
lineCounter()

//dark colors preset
let colors = {
    textbg:"#000000",
    text:"#ffffff",
    linesbg:"#303030",
    navbg:"#303030",
    navborder:"#000000",
    buttonsbg:"#000000",
    buttonsborder:"#000000",
    footerbg:"#202020",
    modalbg:"#000000",
    modalborder:"#ffffff"
}
if (localStorage.getItem("colors")){
    colors = JSON.parse(localStorage.getItem("colors"))
}
function updColors(){
    //im not making a better way to do this
    editor.style.backgroundColor = colors.textbg
    lines.style.backgroundColor = colors.linesbg
    nav.style.backgroundColor = colors.navbg
    nav.style.borderColor = colors.navborder
    footer.style.backgroundColor = colors.footerbg
    modal.style.backgroundColor = colors.modalbg
    modal.style.borderColor = colors.modalborder
    buttons = document.querySelectorAll("button")
    buttons.forEach(button => {
        button.style.backgroundColor = colors.buttonsbg
        button.style.borderColor = colors.buttonsborder
    });
    elements = document.querySelectorAll("*")
    elements.forEach(element => {
        element.style.color = colors.text
    });
}
updColors()
function saveColors(){
    localStorage.setItem("colors", JSON.stringify(colors))
}
function resetColors(){
    colors = {textbg:"#000000",text:"#ffffff",linesbg:"#303030",navbg:"#303030",navborder:"#000000",buttonsbg:"#000000",buttonsborder:"#000000",footerbg:"#202020",modalbg:"#000000",modalborder:"#ffffff"}
    document.querySelectorAll('input[type="color"]').forEach(input => {
        input.value = colors[input.id]
    });
    updColors()
}
document.querySelectorAll('input[type="color"]').forEach(input => {
    input.value = colors[input.id]
    input.addEventListener('input', (e) => {
        colors[input.id] = e.target.value;
        updColors()
    });
});
document.getElementById("save-colors").addEventListener("click", saveColors)
document.getElementById("reset-colors").addEventListener("click", resetColors)

//files
let file;
let data;
async function openFile(){
    [file] = await window.showOpenFilePicker()
    data = await file.getFile()
    footer.textContent = data.name
    let text = await data.text()
    editor.innerText = text
    fileLineCounter()
}
open.addEventListener("click",openFile)
async function saveFile() {
    let prompt = await file.createWritable()
    await prompt.write(editor.innerText)
    await prompt.close()
    footer.textContent = `${data.name} Saved: ${Date().toString().split('GMT')[0]}`
}
save.addEventListener("click", saveFile)
async function saveNew(){
    file = await window.showSaveFilePicker()
    data = await file.getFile();
    saveFile()
}
saveAs.addEventListener("click",saveNew)

settings.addEventListener("click", () => {
    modal.style.display = modal.style.display == "none" ? "block" : "none"
})