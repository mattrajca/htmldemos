const WIDTH = 400;
const HEIGHT = 320;

const GRID_INTERVAL = 40;
const CENTER_Y = HEIGHT / 2;
const CENTER_X = WIDTH / 2;

const SCALE_X = 40;
const SCALE_Y = 40;

var ctx;
var canvas;
var currFunction = 0;

var timer;
var time = -CENTER_X;

var deriv = new Array();
var drawing = false;
var actualDeriv = new Array();

function loaded() {
	canvas = document.getElementById("main");
	ctx = canvas.getContext("2d");
	
	if (window.devicePixelRatio) {
		canvas.setAttribute("width", WIDTH * window.devicePixelRatio);
		canvas.setAttribute("height", HEIGHT * window.devicePixelRatio);
		
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
	
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseOut, false);
	
	canvas.addEventListener("touchstart", mouseDown, false);
	canvas.addEventListener("touchmove", mouseMove, false);
	canvas.addEventListener("touchend", mouseUp, false);
	
	redraw();
}

function getCursorPosition (e) {
	var x;
	var y;
	
	if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
	}
	else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	return [x, y];
}

function pushDeriv (event, move) {
	var coords = getCursorPosition (event);
	deriv.push ( { 'x': coords[0], 'y': coords[1], 'move': move } );
}

function mouseDown (event) {
	event.preventDefault();
	
	pushDeriv (event, true);
	drawing = true;
	redraw();
}

function mouseMove (event) {
	if (!drawing)
		return;
	
	event.preventDefault();
	
	pushDeriv (event, false);
	redraw();
}

function mouseUp (event) {
	event.preventDefault();
	
	drawing = false;
	redraw();
}

function mouseOut (event) {
	mouseUp (event);
}

function erase() {
	deriv = new Array();
	redraw();
}

function graph() {
	time = -CENTER_X;
	
	timer = setInterval(function() {
		
		var y = CENTER_Y - currentDerivativeValueForX (time / SCALE_X);
		var x = CENTER_X + time;
		
		actualDeriv.push ( { 'x': x, 'y': y, 'move': false } );
		
		time += 2;
		
		redraw();
		
		if (time > CENTER_X) {
			clearInterval(timer);
			timer = null;
		}
		
	}, 1.0 / 30);
}

function next() {
	if (currFunction == functions.length - 1) {
		alert("No more equations - add some to script.js!");
		return;
	}
	
	erase();
	actualDeriv = new Array();
	
	currFunction++;
	redraw();
}

function redraw() {
	ctx.clearRect (0, 0, WIDTH, HEIGHT);
	
	drawGrid();
	drawAxis();
	drawCurrentFunction();
	drawUserDerivative();
	drawActualDerivative();
}

function drawGrid() {
	ctx.beginPath();
	
	for (var n = GRID_INTERVAL; n < WIDTH; n += GRID_INTERVAL) {
		if (n == CENTER_X)
			continue;
		
		ctx.moveTo(n, 0);
		ctx.lineTo(n, HEIGHT);
	}
	
	for (var n = GRID_INTERVAL; n < HEIGHT; n += GRID_INTERVAL) {
		if (n == CENTER_Y)
			continue;
		
		ctx.moveTo(0, n);
		ctx.lineTo(WIDTH, n);
	}
	
	ctx.strokeStyle = "#acb5a0";
	ctx.lineWidth = 1.0;
	ctx.stroke();
}

function drawAxis() {
	ctx.beginPath();
	
	ctx.moveTo(CENTER_X, 0);
	ctx.lineTo(CENTER_X, HEIGHT);
	
	ctx.moveTo(0, CENTER_Y);
	ctx.lineTo(WIDTH, CENTER_Y);
	
	ctx.strokeStyle = "#78836c";
	ctx.lineWidth = 1.0;
	ctx.stroke();
}

function drawCurrentFunction() {
	ctx.beginPath();
	
	for (var x = -CENTER_X; x < CENTER_X; x++) {
		y = CENTER_Y - currentFunctionValueForX (x / SCALE_X);
		var nx = CENTER_X + x;
		
		if (x == 0)
			ctx.moveTo(nx, y);
		
		ctx.lineTo(nx, y);
	}
	
	ctx.strokeStyle = "red";
	ctx.stroke();
}

function drawUserDerivative() {
	ctx.beginPath();
	
	for (var n = 0; n < deriv.length; n++) {
		var item = deriv[n];
		
		var x = item['x'];
		var y = item['y'];
		var move = item['move'];
		
		if (move) {
			ctx.moveTo(x, y);
		}
		
		ctx.lineTo(x, y);
	}
	
	ctx.strokeStyle = "green";
	ctx.stroke();
}

function drawActualDerivative() {
	ctx.beginPath();
	
	for (var n = 0; n < actualDeriv.length; n++) {
		var item = actualDeriv[n];
		
		var x = item['x'];
		var y = item['y'];
		var move = item['move'];
		
		if (move)
			ctx.moveTo(x, y);
		
		ctx.lineTo(x, y);
	}
	
	ctx.strokeStyle = "blue";
	ctx.stroke();
}

function currentFunctionValueForX (x) {
	return functions[currFunction]['a'](x) * SCALE_Y;
}

function currentDerivativeValueForX (x) {
	return functions[currFunction]['d'](x) * SCALE_Y;
}

var functions = [
	{
		'a': function (x) { return Math.pow(x, 3) - 3 * Math.pow(x, 2); },
		'd': function (x) { return 3 * Math.pow(x, 2) - 6 * x; }
	},
	{
		'a': function (x) { return 2; },
		'd': function (x) { return 0; }
	},
	{
		'a': function (x) { return Math.pow(x, 3) * Math.pow(x - 2, 2); },
		'd': function (x) { return 5 * Math.pow(x, 4) - 16 * Math.pow(x, 3) + 12 * Math.pow(x, 2); }
	},
];
