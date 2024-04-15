class drawMy {

  constructor() {
    // this.type = 'drawmy';
    this.vertices = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
  }
  render() {
    var xy = this.vertices;
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // var d = this.size/200;
    drawTriangle([xy[0], xy[1], xy[2], xy[3], xy[4], xy[5]]);
  }
}

function drawTriangle(vertices) {

  var n = 3; // The number of vertices

  // create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log ('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array (vertices), gl.DYNAMIC_DRAW);
  //gl.bufferData(gL.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // var a_Position = gl.getAttribLocation(gl.program,'a_Position');
  // if (a_Position < 0) {
  //   console. log('Failed to get the storage location of a_Position');
  //   return -1;
  // }

  // Assign the buffer object to a Position variable
  gl.vertexAttribPointer (a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n) ;

}
