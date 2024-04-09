// DrawRectangle.js
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

  // let v1 = new Vector3([2.25, 2.25, 0]);
  // drawVector(v1, "red");
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
