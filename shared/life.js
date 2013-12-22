(function (exports) {

var cellSize = 4;
var view = Int32Array;

function cellInView(view, x, y, w, h) {
  return view[coords2Offset(x, y, w, h)];
}

function isAlive(cell) {
  return cell != 0;
}

function coords2Offset(x, y, w, h) {
  // do the wraparound
  if (x < 0) x += w;
  if (y < 0) y += h;
  if (x >= w) x -= w;
  if (y >= h) y -= h;

  return y * w + x;
}

function nextCellInView(view, x, y, w, h) {
  var current = isAlive(cellInView(view, x, y, w, h));
  var count =
    isAlive(cellInView(view, x - 1, y - 1, w, h)) +
    isAlive(cellInView(view, x,     y - 1, w, h)) +
    isAlive(cellInView(view, x + 1, y - 1, w, h)) +
    isAlive(cellInView(view, x - 1, y,     w, h)) +
    isAlive(cellInView(view, x + 1, y,     w, h)) +
    isAlive(cellInView(view, x - 1, y + 1, w, h)) +
    isAlive(cellInView(view, x,     y + 1, w, h)) +
    isAlive(cellInView(view, x + 1, y + 1, w, h));

  if (current) {
    return (count == 2 || count == 3) ? 0xffffffff : 0x0;
  } else {
    return (count == 3) ? 0xffffffff : 0x0;
  }
}

function Life(w, h) {
  this._w = w;
  this._h = h;

  this._buffer1 = new ArrayBuffer(w * h * cellSize);
  this._view1 = new view(this._buffer1);

  this._buffer2 = new ArrayBuffer(w * h * cellSize);
  this._view2 = new view(this._buffer2);

  this._front = this._view1;
  this._back = this._view2;
}

Life.prototype.next = function() {
  var wasFront = this._front, wasBack = this._back;
  var w = this._w, h = this._h;

  // update cells
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      wasBack[coords2Offset(x, y, w, h)] = nextCellInView(wasFront, x, y, w, h);
    }
  }

  // swap buffers
  this._front = wasBack;
  this._back = wasFront;
}

Life.prototype.blit = function(sprite, spriteW, spriteH, x, y) {
  for (var sy = 0; sy < spriteH; sy++) {
    for (var sx = 0; sx < spriteW; sx++) {
      var wx = x + sx, wy = y + sy;
      this._front[coords2Offset(wx, wy, this._w, this._h)] = sprite[coords2Offset(sx, sy, spriteW, spriteH)];
    }
  }
}

Life.prototype.cellAt = function(x, y) {
  return cellInView(this._front, x, y, this._w, this._h);
}

exports.Life = Life;

})(typeof exports === 'undefined' ? this['life'] = {} : exports);