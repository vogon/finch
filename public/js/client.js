var canvas = $("#world canvas")[0],
    draw = canvas.getContext("2d"),
    Life = life.Life;

var layoutW = canvas.offsetWidth,
    layoutH = canvas.offsetHeight;

var worldW = Math.floor(layoutW / 2),
    worldH = Math.floor(layoutH / 2);

var displayW = worldW * 2, displayH = worldH * 2;

canvas.width = displayW;
canvas.height = displayH;
canvas.style.width = displayW + 'px';
canvas.style.height = displayH + 'px';

var world = new Life(worldW, worldH);

var glider = new Int32Array(9);
glider[1] = glider[5] = glider[6] = glider[7] = glider[8] = 0xffffffff;

function putPixel(imageData, x, y, r, g, b, a) {
  var offset = (y * imageData.width + x) * 4;

  imageData.data[offset] = r;
  imageData.data[offset + 1] = g;
  imageData.data[offset + 2] = b;
  imageData.data[offset + 3] = a;
}

function paint() {
  // clear
  draw.fillStyle = 'white';
  draw.fillRect(0, 0, displayW, displayH);

  // draw live cells
  img = draw.createImageData(displayW, displayH);

  for (var y = 0; y < worldH; y++) {
    for (var x = 0; x < worldW; x++) {
      var r, g, b, a, color = world.cellAt(x, y);

      if (color != 0) {
        //debugger;
      }

      r = color & 0xff;
      g = (color & 0xff00) >>> 8;
      b = (color & 0xff0000) >>> 16;
      a = (color & 0xff000000) >>> 24;

      putPixel(img, x * 2, y * 2, r, g, b, a);
      putPixel(img, x * 2 + 1, y * 2, r, g, b, a);
      putPixel(img, x * 2, y * 2 + 1, r, g, b, a);
      putPixel(img, x * 2 + 1, y * 2 + 1, r, g, b, a);
    }
  }

  draw.putImageData(img, 0, 0);

  // blit a new glider in
  var blitX = Math.floor(Math.random() * worldW),
      blitY = Math.floor(Math.random() * worldH);
  var color = 0x7f000000 | Math.floor(Math.random() * 0xffffff);

  world.blit(glider, 3, 3, blitX, blitY, color);

  // update
  world.next();
  window.requestAnimationFrame(paint);
}

window.requestAnimationFrame(paint);
