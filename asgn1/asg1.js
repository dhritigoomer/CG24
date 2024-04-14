// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function clearCanvas() {
  // var canvas = document.getElementById('webgl');
  // var ctx = canvas.getContext('2d');
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // g_points = [];
}

// function handleColorSelection() {
//   var r = document.getElementById('red').value;
//   var g = document.getElementById('green').value;
//   var b = document.getElementById('blue').value;
//   console.log(r);
//   console.log(g);
//   console.log(b);
//   // ctx.strokeStyle = 'rgb(r, g, b)';
//
//   var size = document.getElementById('size').value;
//   var count = document.getElementById('count').value;
// }
//

// ColoredPoint.js (c) 2012 matsuda
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

function addActionsForHtmlUI(){
  // button events: shape type
  document.getElementById('green-button').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red-button').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };

  // slider events!
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = (this.value)/100;   });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = (this.value)/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = (this.value)/100;  });

  document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegments = this.value;  });

  // size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });

  //set clear button
  document.getElementById('clear-button').onclick = function () { g_shapesList = []; renderAllShapes(); };

  // set shape selector buttons
  document.getElementById('square-button').onclick = function() { g_selectedType = POINT; };
  document.getElementById('triangle-button').onclick = function() { g_selectedType = TRIANGLE; };
  document.getElementById('circle-button').onclick = function() { g_selectedType = CIRCLE; };

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

  var g_shapesList = [];

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



// window.onload = main;
