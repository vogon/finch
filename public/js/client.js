var canvas = $("#world canvas")[0],
    draw = canvas.getContext("2d"),
    Life = life.Life;

var displayW = canvas.offsetWidth,
    displayH = canvas.offsetHeight;

canvas.width = displayW;
canvas.height = displayH;
canvas.style.width = displayW + 'px';
canvas.style.height = displayH + 'px';

var world = new Life(displayW, displayH);

var glider = new Int32Array(9);
glider[1] = glider[5] = glider[6] = glider[7] = glider[8] = 0xffffffff;

function paint() {
  // clear
  draw.fillStyle = 'white';
  draw.fillRect(0, 0, displayW, displayH);

  // draw live cells
  for (var y = 0; y < displayH; y++) {
    for (var x = 0; x < displayW; x++) {
      if (world.cellAt(x, y) != 0) {
        draw.fillStyle = 'black';
        draw.fillRect(x, y, 1, 1);
      }
    }
  }

  // blit a new glider in
  var blitX = Math.floor(Math.random() * displayW),
      blitY = Math.floor(Math.random() * displayH);

  world.blit(glider, 3, 3, blitX, blitY);

  // update
  world.next();
  window.requestAnimationFrame(paint);
}

window.requestAnimationFrame(paint);
