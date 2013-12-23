var Life = life.Life;

var glider = new Int32Array(9);
glider[1] = glider[5] = glider[6] = glider[7] = glider[8] = 0xffffffff;

var worldCanvas = $("#world canvas")[0],
    testCanvas = $("#workbench-test")[0];

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
var viewer = new drawing.LifeViewer(world);

testCanvas.width = testCanvas.height = 150;
testCanvas.style.width = testCanvas.style.height = '150px';

var testWorld = new Life(150, 150);
var testViewer = new drawing.LifeViewer(testWorld);

function runLife(world, viewer, canvas) {
  var worldW = world.getWidth(), worldH = world.getHeight();
  viewer.drawTo(canvas);

  // blit a new glider in
  var blitX = Math.floor(Math.random() * worldW),
      blitY = Math.floor(Math.random() * worldH);
  var color = 0xff000000 | Math.floor(Math.random() * 0xffffff);

  world.blit(glider, 3, 3, blitX, blitY, color);

  // update
  world.next();
}

(function worldLoop() {
  runLife(world, viewer, worldCanvas);
  window.requestAnimationFrame(worldLoop);
})();

(function testLoop() {
  runLife(testWorld, testViewer, testCanvas);
  window.requestAnimationFrame(testLoop);
})();

// workbench modes

function changeBuildActive(show) {
  var buildForm = $("#workbench-form-build")[0],
      buildButton = $("#workbench-mode-build")[0];

  if (show) {
    $(buildButton).addClass("active");
    $(buildForm).show();
  } else {
    $(buildButton).removeClass("active");
    $(buildForm).hide();
  }
}

function changeTestActive(show) {
  var testForm = $("#workbench-form-test")[0],
      testButton = $("#workbench-mode-test")[0];

  if (show) {
    $(testButton).addClass("active");
    $(testForm).show();
  } else {
    $(testButton).removeClass("active");
    $(testForm).hide();
  }
}

$("#workbench-mode-build").click(function() {
  changeBuildActive(true);
  changeTestActive(false);

  return false;
});

$("#workbench-mode-test").click(function() {
  changeBuildActive(false);
  changeTestActive(true);

  return false;
});

changeBuildActive(true);
changeTestActive(false);