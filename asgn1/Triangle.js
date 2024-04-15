class Triangle {

  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.mine = 0;
  }
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the position of a point to a_Position variable
    // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // pass size of point to u size
    gl.uniform1f(u_Size, size);

    // Draw
    // gl.drawArrays(gl.POINTS, 0, 1);

    var d = this.size/200.0;
    if (this.mine == 1) {
      rgba = [1, 0.5, 0, 1];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
      // head
      drawTriangle([-175/200, 38/200, -140/200, 75/200, -140/200, 0]);
      // body
      drawTriangle([-140/200, 0, -140/200, 75/200, 50/200, 38/200]);
      // fins
      drawTriangle([-0.435, 0.30, -0.25, 0.285, -0.25, 0.41])
      drawTriangle([-0.42, 0.065, -0.26, 0.1, -0.27, -0.03])
      // tail
      drawTriangle([0.17, 0.205, 0.25, 0.37, 0.245, 0.185])
      drawTriangle([0.17, 0.205, 0.25, 0.01, 0.245, 0.185])

      // change to brown
      rgba = [0.81, 0.7, 0.44, 1];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
      // sand
      // let nums;
      // nums = [-200, -200, -400/3, -160, -200/3, -200];
      // drawTriangle([nums[0]/200, nums[1]/200, nums[2]/200, nums[3]/200, nums[4]/200, nums[5]/200]);
      drawTriangle([1, -1, 0.75, -0.80, 0.5, -1])
      drawTriangle([0, -1, 0.25, -0.80, 0.5, -1])
      drawTriangle([-1, -1, -0.75, -0.80, -0.5, -1])
      drawTriangle([0, -1, -0.25, -0.80, -0.5, -1])

      // seaweed
      rgba = [0.13, 0.77, 0.57, 1];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
      let x, y, d;
      x = -0.5;
      y = -1;
      d = 0.15;
      // first batch
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+(d/2);
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+d;
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);

      // second batch
      x = 0.5;
      y = -1;
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+(d/2);
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+d;
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);

      // third batch
      x = 0.5-d;
      y = -1;
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+(d/2);
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+d;
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);

      // fourth batch
      x = -0.5 + d;
      y = -1;
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+(d/2);
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);
      y = -1+d;
      drawTriangle([x, y, x+d, y, x + (d/2), y+ (d/2)]);

    }
    else {
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
    }

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
