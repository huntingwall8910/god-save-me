const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")
canvas.width = screen.width - 6
canvas.height = screen.height - 6
const width = canvas.width
const height = canvas.height
let list = []
function sleep(ms){
	return new Promise(resolve => setTimeout(resolve,ms))
}
function init(){
list = []
for (i=0;i<500;i++){
	list.push(Math.random() * height)
}
}
init()
function isSorted(){
	let sorted = true
	for (i=0;i<list.length;i++){
		if (list[i] > list[i+1]){
			sorted = false
		}
	}
	return sorted
}
function Bar(x,width,color,tall){
    this.x = x
    this.width = width
    this.tall = tall
    this.color = color
    c.beginPath();
    c.fillStyle = this.color
    c.fillRect(this.x,height,this.width,-this.tall)
    c.closePath();
}
function bubble() {
	for (j=0;j<list.length;j++){
		if (list[j] > list[j+1]){
			let temp = list[j]
			list[j] = list[j+1]
			list[j+1] = temp
		}
	}
	
}
function shaker(){
	for (j=0;j<list.length;j++){
		if (list[j] > list[j+1]){
			let temp = list[j]
			list[j] = list[j+1]
			list[j+1] = temp
		}
	}
	for (j=list.length;j>0;j--){
		if (list[j] < list[j-1]){
			let temp = list[j]
			list[j] = list[j-1]
			list[j-1] = temp
		}
	}
}
function oddEven(){
	for (j=1;j<list.length;j+=2){
		if (list[j] > list[j+1]){
			let temp = list[j]
			list[j] = list[j+1]
			list[j+1] = temp
		}
	}
	for (j=0;j<list.length;j+=2){
		if (list[j] > list[j+1]){
			let temp = list[j]
			list[j] = list[j+1]
			list[j+1] = temp
		}
	}
}
function merge(arr, left, mid, right) {
    let arr1 = arr.slice(left, mid + 1);
    let arr2 = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < arr1.length && j < arr2.length) {
        arr[k++] = arr1[i] <= arr2[j] ? arr1[i++] : arr2[j++];
    }
    while (i < arr1.length) arr[k++] = arr1[i++];
    while (j < arr2.length) arr[k++] = arr2[j++];
}
let size = 1
function mergeSort(){
	let n = list.length
	if (size >= n) return false;
	for(i=0;i<n - 1;i+= 2 * size){
		let mid = Math.min(i + size - 1,n-1)
		let right = Math.min(i + 2 * size - 1, n - 1)
		merge(list,i,mid,right)
	}
	size *= 2
	return true;
}
function digit(num,place){
	return Math.floor(num / Math.pow(10,place)) % 10;
}
function countingSort(place){
	let output = new Array(list.length).fill(0)
	let count = new Array(10).fill(0)
	for (let num of list){
		let dig = digit(num,place)
		count[dig]++;
	}
	for (i=1;i<10;i++){
		count[i] += count[i-1]
	}
	for (i=list.length - 1; i >= 0; i--){
		let num = list[i]
		let dig = digit(num,place)
		output[--count[dig]] = num;
	}
	for (i=0;i<list.length;i++){
		list[i] = output[i]
		sleep(100)
	}
}
let place = 0
let maxD = Math.max(...list).toString().length
function radix(){
	if (place >= maxD) return false;
	countingSort(place)
	place++
	return true;
}
function getNextGap(gap)
{
	gap = parseInt((gap*12)/13, 10);
	if (gap < 1)
		return 1;
	return gap;
}
let gp = list.length
function comb()
{
	let n = list.length;
	gp = getNextGap(gp)
	console.log(gp)
		for (let i=0; i<n-gp; i++)
		{
			if (list[i] > list[i+gp])
			{
				let temp = list[i];
				list[i] = list[i+gp];
				list[i+gp] = temp;
			}
		}
}
let pos = 0
function gnome(){
	for (i=0;i<=pos;i++){
	if (pos == 0 || list[pos] >= list[pos-1]){
		pos++
	}
	else{
		let temp = list[pos-1]
		list[pos-1] = list[pos]
		list[pos] = temp
		pos--
	}
	}
}
function reverseBubble() {
	for (j=list.length;j>=0;j--){
		if (list[j] < list[j+1]){
			let temp = list[j]
			list[j] = list[j+1]
			list[j+1] = temp
		}
	}
	
}
let s = 0;
function animate(){
    c.clearRect(0,0,width,height)
    for (i=0;i<list.length;i++){
        Bar(width/list.length * i,width/list.length,`hsl(${list[i]} 100% 50%)`,list[i])
     }
	if (s==1){s = 0;setTimeout(init,250);gp=list.length;size=1;pos=0}
	if (isSorted() == true){s++}
	window.requestAnimationFrame(animate)
}
animate()
let interval = setInterval(console.log('awaiting key'),1)
document.addEventListener("keyup", (event) =>{
	console.log(event.key)
	if (event.key === 'b'){
		clearInterval(interval)
		interval = setInterval(bubble,50)
	}
	else if (event.key === 's'){
		clearInterval(interval)
		interval = setInterval(shaker,50)
	}
	else if (event.key === 'o'){
		clearInterval(interval)
		interval = setInterval(oddEven,50)
	}
	else if (event.key === 'c'){
		clearInterval(interval)
		interval = setInterval(comb,50)
	}
	else if (event.key === 'm'){
		clearInterval(interval)
		interval = setInterval(mergeSort,50)
	}
	else if (event.key === 'g'){
		clearInterval(interval)
		pos = 0;
		interval = setInterval(gnome,50)
	}
	else if (event.key === 'p'){
		clearInterval(interval)
	}
})
document.addEventListener("click", (event) => {console.log(event)})
document.addEventListener("visibilitychange", (event) => {console.log(document.hidden)})