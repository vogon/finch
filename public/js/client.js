var canvas = $("#world canvas")[0],
    draw = canvas.getContext("2d");

var displayW = canvas.offsetWidth,
    displayH = canvas.offsetHeight;

canvas.width = displayW;
canvas.height = displayH;
canvas.style.width = displayW + 'px';
canvas.style.height = displayH + 'px';

draw.fillStyle = 'magenta';
draw.fillRect(0, 0, displayW, displayH);
