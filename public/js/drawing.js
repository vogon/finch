drawing = (function() {
  var exports = {};

  function ScalingCanvas(virtualWidth, virtualHeight) {
    // build canvas to render onto internally
    this._virtualCanvas = document.createElement('canvas');
    //document.body.appendChild(this._virtualCanvas);
    this.width = this._virtualCanvas.width = virtualWidth;
    this.height = this._virtualCanvas.height = virtualHeight;
  }

  ScalingCanvas.prototype.getContext = function (id) {
    return this._virtualCanvas.getContext(id);
  }

  ScalingCanvas.prototype.drawTo = function (canvas) {
    var physContext = canvas.getContext('2d');

    physContext.fillStyle = 'white';
    physContext.fillRect(0, 0, this.width, this.height);

    physContext.imageSmoothingEnabled = false;
    physContext.setTransform(canvas.width / this.width, 0, 0, canvas.height / this.height, 0, 0);
    //physContext.scale(canvas.width / this.width, canvas.height / this.height);

    physContext.drawImage(this._virtualCanvas, 0, 0);
  }

  function LifeViewer(world) {
    this._world = world;
    this._canvas = new ScalingCanvas(world.getWidth(), world.getHeight());
  }

  LifeViewer.prototype.drawTo = function (canvas) {
    function putPixel(imageData, x, y, r, g, b, a) {
      var offset = (y * imageData.width + x) * 4;

      imageData.data[offset] = r;
      imageData.data[offset + 1] = g;
      imageData.data[offset + 2] = b;
      imageData.data[offset + 3] = a;
    }

    var draw = this._canvas.getContext("2d");

    // clear background
    draw.fillStyle = 'white';
    draw.fillRect(0, 0, this._canvas.width, this._canvas.height);

    // draw cells
    img = draw.createImageData(this._canvas.width, this._canvas.height);

    for (var y = 0; y < this._world.getHeight(); y++) {
      for (var x = 0; x < this._world.getWidth(); x++) {
        var color = this._world.cellAt(x, y);
        var r, g, b, a;

        r = color & 0xff;
        g = (color & 0xff00) >>> 8;
        b = (color & 0xff0000) >>> 16;
        a = (color & 0xff000000) >>> 24;

        putPixel(img, x, y, r, g, b, a);
      }
    }

    // draw to scaling canvas
    draw.putImageData(img, 0, 0);

    // draw to physical canvas
    this._canvas.drawTo(canvas);
  }

  exports.LifeViewer = LifeViewer;

  return exports;
})();

