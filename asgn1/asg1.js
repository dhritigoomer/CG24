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
  gl = getWebGLContext(canvas);
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

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5.0;

function addActionsForHtmlUI(){
  // button events: shape type
  document.getElementById('green-button').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red-button').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };

  // slider events!
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = (this.value)/100;   });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = (this.value)/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = (this.value)/100;  });

  // size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });
}
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  }

  class Point {
    constructor() {
      this.type = 'point';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
  }

  var g_shapesList = [];
  // var g_points = [];  // The array for the position of a mouse press
  // var g_colors = [];  // The array to store the color of a point
  // var g_sizes = [];   // the array to store the size of a point

  function click(ev) {

    [x, y] = convertCoordinatesEventToGL(ev);

    let point = new Point();
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
      // // Store the coordinates to g_points array
    // g_points.push([x, y]);
    // // Store the coordinates to g_points array
    //
    // //store the colors in colors array
    // g_colors.push(g_selectedColor.slice());
    //
    // g_sizes.push(g_selectedSize);


    // if (x >= 0.0 && y >= 0.0) {      // First quadrant
    //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
    // } else if (x < 0.0 && y < 0.0) { // Third quadrant
    //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
    // } else {                         // Others
    //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
    // }

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
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_shapesList.length;
    // var len = g_points.length;
    for(var i = 0; i < len; i++) {
      var xy = g_shapesList[i].position;
      var rgba = g_shapesList[i].color;
      var size = g_shapesList[i].size;
      // var xy = g_points[i];
      // var rgba = g_colors[i];
      // var size = g_sizes[i];

      // Pass the position of a point to a_Position variable
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniform1f(u_Size, size);
      // Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }



// window.onload = main;
