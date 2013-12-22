var Life = life.Life;

var glider = new Int32Array(9);
glider[1] = glider[5] = glider[6] = glider[7] = glider[8] = 0xffffffff;

function runLife(world, canvas) {
  var worldW = world.getWidth(), worldH = world.getHeight();
  repaintLife(world, canvas);

  // blit a new glider in
  var blitX = Math.floor(Math.random() * worldW),
      blitY = Math.floor(Math.random() * worldH);
  var color = 0x7f000000 | Math.floor(Math.random() * 0xffffff);

  world.blit(glider, 3, 3, blitX, blitY, color);

  // update
  world.next();
}

var worldCanvas = $("#world canvas")[0];

var layoutW = worldCanvas.offsetWidth,
    layoutH = worldCanvas.offsetHeight;

var worldW = Math.floor(layoutW / 2),
    worldH = Math.floor(layoutH / 2);

var displayW = worldW * 2, displayH = worldH * 2;

worldCanvas.width = displayW;
worldCanvas.height = displayH;
worldCanvas.style.width = displayW + 'px';
worldCanvas.style.height = displayH + 'px';

var world = new Life(worldW, worldH);

(function worldLoop() {
  runLife(world, worldCanvas);
  window.requestAnimationFrame(worldLoop);
})();
