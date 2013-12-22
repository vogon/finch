function putPixel(imageData, x, y, r, g, b, a) {
  var offset = (y * imageData.width + x) * 4;

  imageData.data[offset] = r;
  imageData.data[offset + 1] = g;
  imageData.data[offset + 2] = b;
  imageData.data[offset + 3] = a;
}

function repaintLife(world, canvas) {
  var worldW = world.getWidth(), worldH = world.getHeight();
  var displayW = canvas.width, displayH = canvas.height;
  var draw = canvas.getContext("2d");

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
}
