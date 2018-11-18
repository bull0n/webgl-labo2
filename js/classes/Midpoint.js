// Midpoint

class Midpoint
{
   constructor()
   {
      this.vertices = [];
      this.colors = [];
      this.indices = [];
      this.verticesBuffer = null;
      this.colorsBuffer = null;
      this.indicesBuffer = null;
      this.size = 5;
   }

   // To call inside initBuffer
   createGeometry()
   {
      let vertices = this.vertices;
      let colors = this.colors;
      let indices = this.indices;

      // Test
      let index = 0;
      for(let i = -1.0;i <= 1.0; i += 0.2, index++)
      {
         vertices.push(i,0,-3.0);
         colors.push(1.0,0.0,0.0,1.0);
         indices.push(index);
      }

      this.verticesBuffer = getVertexBufferWithVertices(vertices);
      this.colorsBuffer  = getVertexBufferWithVertices(colors);
      this.indicesBuffer  = getIndexBufferWithIndices(indices);
   }

/*
   computeRecursive(a, b, limit)
   {
      let ax = a[0];
      let bx = b[0];
      let cx = bx - ax;

      if(cx > limit)
      {
         let mid = a[0] + cx/2.0;
         this.computeRecursive(ax, mid, limit);
         this.computeRecursive(mid, bx, limit);
      }
   }
   */

   getVerticesBuffer()
   {
      return this.verticesBuffer;
   }

   getColorsBuffer()
   {
      return this.colorsBuffer;
   }

   getIndicesBuffer()
   {
      return this.indicesBuffer;
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
      glContext.drawElements(glContext.POINTS, indices.length, glContext.UNSIGNED_SHORT,0);
   }
}
