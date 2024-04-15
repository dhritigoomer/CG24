// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
var g_shapesList = [];
let g_game = false;
let vx = 0;
let vy = 0;

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5.0;
let g_selectedType = POINT;
let g_selectedSegments = 10;

// ColoredPoint.js (c) 2012 matsuda
// Crediting Professor James Davis for functionality in the file

// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer:true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    // get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

function addActionsForHtmlUI(){
  // button events: shape type
  // document.getElementById('green-button').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById('red-button').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };

  // slider events!
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = (this.value)/100;   });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = (this.value)/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = (this.value)/100;  });

  document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegments = this.value;  });

  // size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });

  //set clear button
  document.getElementById('clear-button').onclick = function () { g_shapesList = []; gl.clearColor(0.0, 0.0, 0.0, 1.0); renderAllShapes(); };

  // set shape selector buttons
  document.getElementById('square-button').onclick = function() { g_selectedType = POINT; };
  document.getElementById('triangle-button').onclick = function() { g_selectedType = TRIANGLE; };
  document.getElementById('circle-button').onclick = function() { g_selectedType = CIRCLE; };

  //my drawing
  document.getElementById('my-drawing').onclick = function() { g_shapesList = []; buildDrawing(); renderAllShapes();};

  // my Game
  document.getElementById('my-game-start').onclick = function() { g_game = true; main(); g_shapesList = []; gl.clearColor(0.0, 0.0, 0.0, 1.0); renderAllShapes();};
  document.getElementById('my-game-stop').onclick = function() { g_shapesList = []; gl.clearColor(0.0, 0.0, 0.0, 1.0); g_game = false; main();};

}

function click(ev) {

  [x, y] = convertCoordinatesEventToGL(ev);

  let point;

  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    point = new Circle();
    point.segments = g_selectedSegments;
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);
  // create and store new point
  // let point = new Point();
  // point.position = [x,y];
  // point.color = g_selectedColor.slice();
  // point.size = g_selectedSize;
  // g_shapesList.push(point);

  // this.type = 'triangle';
  // this.position = [0.0, 0.0, 0.0];
  // this.color = [1.0, 1.0, 1.0, 1.0];
  // this.size = 5.0;

  renderAllShapes();
}

function catEvent(ev) {
  [x1, y1] = convertCoordinatesEventToGL(ev);

  let catFace = new Circle();
  catFace.position = [x1, y1];
  catFace.color = [1, 0.5, 0, 1];
  catFace.size = 17;
  catFace.segments = 30;
  g_shapesList.push(catFace);

  var d = (catFace.size)/200;

  let x = catFace.position[0];
  let y = catFace.position[1];

  let ear1 = new drawMy();
  let ear2 = new drawMy();

  ear1.color = [1, 0.5, 0, 1];
  ear2.color = [1, 0.5, 0, 1];

  ear1.vertices = ([x, y, x - (d/2), y + (3/2)*d, x - d, y])
  ear2.vertices = ([x, y, x + (d/2), y + (3/2)*d, x + d, y])

  g_shapesList.push(ear1);
  g_shapesList.push(ear2);

  renderAllShapes();

}
function catdraw (vx, vy) {
  let catFace = new Circle();
  catFace.position = [vx, vy];
  catFace.color = [1, 0.5, 0, 1];
  catFace.size = 17;
  catFace.segments = 30;
  g_shapesList.push(catFace);

  var d = (catFace.size)/200;

  let x = catFace.position[1];
  let y = catFace.position[0];

  let ear1 = new drawMy();
  let ear2 = new drawMy();

  ear1.color = [1, 0.5, 0, 1];
  ear2.color = [1, 0.5, 0, 1];

  ear1.vertices = ([x, y, x - (d/2), y + (3/2)*d, x - d, y])
  ear2.vertices = ([x, y, x + (d/2), y + (3/2)*d, x + d, y])

  g_shapesList.push(ear1);
  g_shapesList.push(ear2);

  renderAllShapes();


}

function buildDrawing() {
    gl.clearColor(0.52, 0.91, 0.92, 1);// background light blue
    let t1 = new drawMy(); // body
    t1.color = [1, 0.5, 0, 1];
    t1.vertices = [-140/200, 0, -140/200, 75/200, 50/200, 38/200];
    g_shapesList.push(t1);

    let t2 = new drawMy(); // head
    t2.color = [1, 0.5, 0, 1];
    t2.vertices = [-175/200, 38/200, -140/200, 75/200, -140/200, 0];
    g_shapesList.push(t2);

    let t3 = new drawMy(); // fin 1
    t3.color = [1, 0.5, 0, 1];
    t3.vertices = [-0.435, 0.30, -0.25, 0.285, -0.25, 0.41];
    g_shapesList.push(t3);

    let t4 = new drawMy(); // fin 2
    t4.color = [1, 0.5, 0, 1];
    t4.vertices = [-0.42, 0.065, -0.26, 0.1, -0.27, -0.03];
    g_shapesList.push(t4);

    let t5 = new drawMy(); // tail 1
    t5.color = [1, 0.5, 0, 1];
    t5.vertices = [0.17, 0.205, 0.25, 0.37, 0.245, 0.185];
    g_shapesList.push(t5);

    let t6 = new drawMy(); // tail 1
    t6.color = [1, 0.5, 0, 1];
    t6.vertices = [0.17, 0.205, 0.25, 0.01, 0.245, 0.185];
    g_shapesList.push(t6);

    let t7 = new drawMy(); // sand 1
    t7.color = [0.81, 0.7, 0.44, 1];
    t7.vertices = [1, -1, 0.75, -0.80, 0.5, -1];
    g_shapesList.push(t7);

    let t8 = new drawMy(); // sand 2s
    t8.color = [0.81, 0.7, 0.44, 1];
    t8.vertices = [0, -1, 0.25, -0.80, 0.5, -1];
    g_shapesList.push(t8);

    let t9 = new drawMy(); // sand 3
    t9.color = [0.81, 0.7, 0.44, 1];
    t9.vertices = [-1, -1, -0.75, -0.80, -0.5, -1];
    g_shapesList.push(t9);

    let t10 = new drawMy(); // sand 4
    t10.color = [0.81, 0.7, 0.44, 1];
    t10.vertices = ([0, -1, -0.25, -0.80, -0.5, -1]);
    g_shapesList.push(t10);

    let x, y, d;
    d = 0.15;
    x = -0.5;
    y = -1;

    let t23 = new drawMy(); // seaweed 1.1
    t23.color = [0.13, 0.77, 0.57, 1];
    t23.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];

    y = -1+(d/2);
    let t24 = new drawMy(); // seaweed 1.2
    t24.color = [0.13, 0.77, 0.57, 1];
    t24.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];

    y = -1+d;
    let t25 = new drawMy(); // seaweed 1.3
    t25.color = [0.13, 0.77, 0.57, 1];
    t25.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];

    x = 0.5;
    y = -1;

    let t11 = new drawMy(); // seaweed 1.1
    t11.color = [0.13, 0.77, 0.57, 1];
    t11.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];

    y = -1+(d/2);
    let t12 = new drawMy(); // seaweed 1.2
    t12.color = [0.13, 0.77, 0.57, 1];
    t12.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];

    y = -1+d;
    let t13 = new drawMy(); // seaweed 1.3
    t13.color = [0.13, 0.77, 0.57, 1];
    t13.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];


    let t14 = new drawMy(); // seaweed 2.1
    t14.color = [0.13, 0.77, 0.57, 1];
    t14.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];

    y = -1+(d/2);
    let t15 = new drawMy(); // seaweed 2.2
    t15.color = [0.13, 0.77, 0.57, 1];
    t15.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];

    y = -1+d;
    let t16 = new drawMy(); // seaweed 2.3
    t16.color = [0.13, 0.77, 0.57, 1];
    t16.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];


    x = 0.5-d;
    y = -1;
    let t17 = new drawMy(); // seaweed 3.1
    t17.color = [0.13, 0.77, 0.57, 1];
    t17.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];
    y = -1+(d/2);
    let t18 = new drawMy(); // seaweed 3.2
    t18.color = [0.13, 0.77, 0.57, 1];
    t18.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];
    y = -1+d;
    let t19 = new drawMy(); // seaweed 3.3
    t19.color = [0.13, 0.77, 0.57, 1];
    t19.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];


    x = -0.5 + d;
    y = -1;
    let t20 = new drawMy(); // seaweed 4.1
    t20.color = [0.13, 0.77, 0.57, 1];
    t20.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];
    y = -1+(d/2);
    let t21 = new drawMy(); // seaweed 4.2
    t21.color = [0.13, 0.77, 0.57, 1];
    t21.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];
    y = -1+d;
    let t22 = new drawMy(); // seaweed 4.3
    t22.color = [0.13, 0.77, 0.57, 1];
    t22.vertices = [x, y, x+d, y, x + (d/2), y+ (d/2)];


    g_shapesList.push(t11);
    g_shapesList.push(t12);
    g_shapesList.push(t13);

    g_shapesList.push(t14);
    g_shapesList.push(t15);
    g_shapesList.push(t16);

    g_shapesList.push(t17);
    g_shapesList.push(t18);
    g_shapesList.push(t19);

    g_shapesList.push(t20);
    g_shapesList.push(t21);
    g_shapesList.push(t22);

    g_shapesList.push(t23);
    g_shapesList.push(t24);
    g_shapesList.push(t25);

    renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {
  var startTime = performance.now();
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  var len = g_shapesList.length;
  // var len = g_points.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();

  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");


}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from html");
    return;
  }
  htmlElm.innerHTML = text;
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  if (g_game == true) {
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = catEvent;
    // canvas.onmousemove = click;
    canvas.onmousemove = function(ev) { catEvent; g_shapesList = []; renderAllShapes();}
    //function(ev) { g_shapesList = []; renderAllShapes(); catEvent;}
    // canvas.onmousemove = catEvent();
    // console.log("enter")
  }
  else {
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    // canvas.onmousemove = click;
    canvas.onmousemove = function(ev) {if (ev.buttons == 1) { click(ev)}}
    // canvas.onmousemove = catEvent();
  }
  console.log("run")
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

}
