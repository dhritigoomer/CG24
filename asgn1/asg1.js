// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
var g_shapesList = [];

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

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5.0;
let g_selectedType = POINT;
let g_selectedSegments = 10;
// let g_myDrawing = 0;

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

}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousemove = function(ev) {if (ev.buttons == 1) { click(ev)}}

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

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

  function buildDrawing() {
      gl.clearColor(0.52, 0.91, 0.92, 1);
      let triangle1 = new Triangle();
      triangle1.position=[-0.335, 0.1];
      triangle1.color = [1.0, 1.0, 1.0, 1.0];
      triangle1.size = 20.0;
      triangle1.mine = 1;
      // drawTriangle(triangle1);
      // g_shapesList.push(triangle1);
      // console.log(g_shapesList)
      // renderAllShapes();
      // drawTriangle([0, 0, 1/200, 1/200, 4/200, 4/200]);
      // drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
      g_shapesList.push(triangle1);

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



// window.onload = main;
