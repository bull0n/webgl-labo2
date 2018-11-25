// Midpoint

const X = 0;
const Y = 1;
const Z = 2;

class Midpoint
{
   constructor(ax, bx, h, displacement, smooth = 1.0, limit = 0.05, depth = -3.0)
   {
      this.ax = ax;
      this.bx = bx;
      this.h = h;
      this.displacement = displacement;
      this.smooth = smooth;
      this.limit = limit;
      this.depth = depth;

      this.vertices = [];
      this.colors = [];
      this.indices = [];
      this.verticesBuffer = null;
      this.colorsBuffer = null;
      this.indicesBuffer = null;
      this.size = 5;                // Useless, unless we draw points...
   }

   // Create the geometry of the object
   // To call inside initBuffer
   createGeometry()
   {
      this.executeMidpoint();

      // Prepare specifics buffers for WebGL
      this.verticesBuffer = getVertexBufferWithVertices(this.vertices);
      this.colorsBuffer  = getVertexBufferWithVertices(this.colors);
      this.indicesBuffer  = getIndexBufferWithIndices(this.indices);
   }

   // Execute the midpoint algo.
   executeMidpoint()
   {
      let vertices = this.vertices;
      let colors = this.colors;
      let indices = this.indices;

      // Prapare point A and point B of the segment
      let a = [this.ax, this.initializeY(), this.depth];
      let b = [this.bx, this.initializeY(), this.depth];
      let limit = this.limit;

      // Add the point A to the vertices (first to set in the list)
      vertices.push(a[0], a[1], a[2]);
      colors.push(1.0, 0.0, 0.0, 1.0);
      indices.push(this.indices.length);

      // Execute midpoint algo. (recursive)
      this.recursiveCompute(a, b, this.displacement, limit);

      // Add the point B to the vertices (last to set in the list)
      vertices.push(b[0], b[1], b[2]);
      colors.push(1.0, 0.0, 0.0, 1.0);
      indices.push(indices.length);
   }

   // Compute points between two others points (recursively)
   recursiveCompute(a, b, displacement, limit)
   {
      let ax = a[X];
      let bx = b[X];
      let distance = Math.abs(bx - ax) / 2.0;

      if(distance >= limit)
      {
         let cy = this.computeY(a, b, displacement);
         let c = [ax + distance, cy, a[Z]];
         let newDisplacement = displacement * 2**(-this.smooth);

         this.recursiveCompute(a, c, newDisplacement, limit);

         this.vertices.push(c[X], c[Y], c[Z]);
         this.colors.push(1.0, 0.0, 0.0, 1.0);
         this.indices.push(this.indices.length);

         this.recursiveCompute(c, b, newDisplacement, limit);
      }
   }

   // Initialize Y for the two points of each side (A and B)
   initializeY()
   {
      let sign = Math.random() < 0.5 ? -1.0: 1.0;
      return this.h + sign * random(0, this.displacement / 2.0);
   }

   // Compute Y for midpoint algo.
   computeY(a, b, displacement)
   {
      let sign = Math.random() < 0.5 ? -1.0: 1.0;
      let averageY = (a[Y] + b[Y]) / 2.0;
      return averageY + sign * random(0, displacement / 2.0);
   }

   // To call inside initShaderParameters
   setupShader(prg)
   {
      this.prg = prg;

      prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aPoint");
      glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
      prg.colorAttribute = glContext.getAttribLocation(prg, "aPointColor");
      glContext.enableVertexAttribArray(prg.colorAttribute);
      prg.pointSize = glContext.getUniformLocation(prg, "uPointSize");
   }

   // To draw inside drawScene
   render()
   {
      let prg = this.prg;
      let indices = this.indices;
      let pointSize = this.size;

      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.verticesBuffer);
      glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorsBuffer);
      glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      glContext.uniform1f(prg.pointSize, pointSize);
      glContext.drawElements(glContext.LINE_STRIP, indices.length, glContext.UNSIGNED_SHORT,0);
   }
}
