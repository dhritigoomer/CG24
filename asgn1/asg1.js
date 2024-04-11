// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;

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
}

function handleColorSelection() {
  var r = document.getElementById('red').value;
  var g = document.getElementById('green').value;
  var b = document.getElementById('blue').value;
  console.log(r);
  console.log(g);
  console.log(b);
  // ctx.strokeStyle = 'rgb(r, g, b)';

  var size = document.getElementById('size').value;
  var count = document.getElementById('count').value;
}
//

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  void main() { 
    gl_Position = a_Position;
    gl_PointSize = 20.0;
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
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
function click(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // Store the coordinates to g_points array
  g_points.push([x, y]);
  // Store the coordinates to g_points array
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}








function drawVector(v, color) {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = color;
  let cx = canvas.width/2;
  let cy = canvas.height/2;

  ctx.beginPath(); // begins the path
  ctx.moveTo(cx,cy); // moves to the middle
  ctx.lineTo(cx + (v.elements[0]*20), cy - (v.elements[1]*20));
  ctx.stroke();
}
function handleDrawEvent() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var v1x = document.getElementById('v1x').value;
  var v1y = document.getElementById('v1y').value;
  let v1 = new Vector3([v1x, v1y, 0]);
  var v2x = document.getElementById('v2x').value;
  var v2y = document.getElementById('v2y').value;
  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v1, "red");
  drawVector(v2, "blue");
}

function angleBetween(v1, v2) {
  var dot = Vector3.dot(v1, v2);
  // Compute magnitudes of v1 and v2
  var magnitudeV1 = v1.magnitude();
  var magnitudeV2 = v2.magnitude();

  // Compute angle in radians
  var angle = Math.acos(dot / (magnitudeV1 * magnitudeV2));

  // Convert angle from radians to degrees
  var angleDegrees = angle * (180 / Math.PI);

  return angleDegrees;

}
function areaTriangle(v1, v2) {
    // Calculate the cross product of v1 and v2
    var crossProduct = Vector3.cross(v1, v2);

    // Calculate the magnitude of the cross product
    var magnitudeCrossProduct = crossProduct.magnitude();

    // Calculate the area of the triangle (half the magnitude of the cross product)
    var area = magnitudeCrossProduct / 2;

    return area;
}


function handleDrawOperationEvent() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var v1x = document.getElementById('v1x').value;
  var v1y = document.getElementById('v1y').value;
  let v1 = new Vector3([v1x, v1y, 0]);
  var v2x = document.getElementById('v2x').value;
  var v2y = document.getElementById('v2y').value;
  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v1, "red");
  drawVector(v2, "blue");
  var selector = document.getElementById('operation').value;
  var scalar = document.getElementById('scalar').value;
  let v3 = new Vector3([0, 0, 0]);
  let v4 = new Vector3([0, 0, 0]);

  switch (selector) {
    case 'add':
      v3 = v1.add(v2);
      break;
    case 'sub':
      v3 = v1.sub(v2);
      break;
    case 'mul':
      v3 = v1.mul(scalar);
      v4 = v2.mul(scalar);
      break;
    case 'div':
      v3 = v1.div(scalar);
      v4 = v2.div(scalar);
      break;
    case 'magnitude':
      console.log("Magnitude v1: " + v1.magnitude());
      console.log("Magnitude v2: " + v2.magnitude());
      break;
    case 'normalize':
      v3 = v1.normalize();
      v4 = v2.normalize();
      break;
    case 'angle_between':
      var angle = angleBetween(v1, v2);
      console.log("Angle: " + angle);
      break;
    case 'area':
      var area = areaTriangle(v1, v2);
      console.log("Area of the Triangle: " + area);
      break;
  }

  drawVector(v3, "green");
  drawVector(v4, "green");

}

// window.onload = main;
