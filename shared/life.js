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
  var current = cellInView(view, x, y, w, h);
  var r = 0, g = 0, b = 0, count = 0;

  for (var ny = y - 1; ny <= y + 1; ny++) {
    for (var nx = x - 1; nx <= x + 1; nx++) {
      // don't count this cell
      if (nx == x && ny == y) continue;

      var neighbor = cellInView(view, nx, ny, w, h);

      if (isAlive(neighbor)) {
        count++;
        // ABGR color format
        r += (neighbor & 0xff) / 3;
        g += ((neighbor & 0xff00) >>> 8) / 3;
        b += ((neighbor & 0xff0000) >>> 16) / 3;
      }

      // check for overcrowding
      if (count > 3) return 0x0;
    }
  }

  if (count < 2) {
    // cell is lonely and dies
    return 0x0;
  } else if (count == 2) {
    // currently-living cells retain their color; currently-dead cells stay dead
    return current;
  } else /* if (count == 3) */ {
    if (isAlive(current)) {
      // currently-living cells retain their color
      return current;
    } else {
      // currently-dead cells are born and get the average color of their living "parents"
      var color = 0xff000000 | (Math.floor(b) << 16) | (Math.floor(g) << 8) | Math.floor(r);
      return color;
    }
  }
}

function Life(w, h) {
  this._w = w;
  this._h = h;

  this._view1 = new view(w * h);
  this._view2 = new view(w * h);

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

Life.prototype.blit = function(sprite, spriteW, spriteH, x, y, tint) {
  for (var sy = 0; sy < spriteH; sy++) {
    for (var sx = 0; sx < spriteW; sx++) {
      var wx = x + sx, wy = y + sy;

      if (isAlive(sprite[coords2Offset(sx, sy, spriteW, spriteH)])) {
        this._front[coords2Offset(wx, wy, this._w, this._h)] = tint;
      } else {
        this._front[coords2Offset(wx, wy, this._w, this._h)] = 0x0;
      }
    }
  }
}

Life.prototype.getWidth = function() {
  return this._w;
}

Life.prototype.getHeight = function() {
  return this._h;
}

Life.prototype.cellAt = function(x, y) {
  return cellInView(this._front, x, y, this._w, this._h);
}

exports.Life = Life;

})(typeof exports === 'undefined' ? this['life'] = {} : exports);