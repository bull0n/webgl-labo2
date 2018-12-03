// Midpoint

const X = 0;
const Y = 1;
const Z = 2;

/**
 * Return if two numbers are equal using a precision factor
 * @param {float} a any float value
 * @param {float} b any float value
 * @param {float} epsilon precision the result
 */
function doubleEqual(a, b, epsilon = 0.01)
{
	return Math.abs(a - b) <= epsilon;
}

class AnimatedMidpoint
{
   /**
    * Constructor of the MidpointAlgorithm class
    * @param {float} ax position of A on X axis
    * @param {float} bx position of B on X axis
    * @param {float} h high of the points (general value)
    * @param {float} displacement value of displacement
    * @param {int} spheresCount how many sphere to show (2,3,5,9,17,33, etc... )
    * @param {float} smooth smoothness of the midpoint algo.
    * @param {float} depth depth of all the points (Z Axis)
    */
   constructor(ax, bx, h, displacement, spheresCount = 4,  smooth = 1.0, depth = -3.0)
   {
      this.ax = ax;
      this.bx = bx;
      this.h = h;
      this.displacement = displacement;
      this.smooth = smooth;
      this.limit = this.computeLimit(spheresCount);
      this.depth = depth;
      this.color = [1.0,0.0,0.0,1.0];

      this.initializeArrays();
   }

   /**
    * Initialize all arrays and buffers
    */
   initializeArrays()
   {
      this.vertices = [];
      this.colors = [];
      this.indices = [];
      this.normals = [];
      this.target = null;
      this.verticesBuffer = null;
      this.colorsBuffer = null;
      this.indicesBuffer = null;
      this.normalsBuffer = null;
   }

   /**
    * Set the number of sphere (ie number of point) for the midpoint algorithm
    * @param {int} spheresCount 
    */
   setSpheresCount(spheresCount)
   {
      this.limit = this.computeLimit(spheresCount);
      this.createGeometry();
   }

   /**
    * Compute the minimum limit between two sphere using the length of the midpoint a and b point
    * @param {int} spheresCount 
    */
   computeLimit(spheresCount)
   {
      return Math.abs(this.ax - this.bx) / (1.0 * spheresCount - 1.0);  // 1.0 * ... -> force cast to double/float
   }

   /**
    * Create the geometry of the object
    * To call inside initBuffer
    */
   createGeometry()
   {
      let points = this.executeMidpoint();
      this.pushPointsIntoVertices(points);

      // Prepare specifics buffers for WebGL
      this.getBufferWithVertices();
   }

   /**
    * Get buffer with vertices
    */
   getBufferWithVertices()
   {
      this.verticesBuffer = getVertexBufferWithVertices(this.vertices);
      this.colorsBuffer  = getVertexBufferWithVertices(this.colors);
      this.indicesBuffer  = getIndexBufferWithIndices(this.indices);
      this.normalsBuffer = getVertexBufferWithVertices(this.normals);
   }

   /**
    * push all points into vertices, colors, normals and indices
    * @param {Array} points 
    */
   pushPointsIntoVertices(points)
   {
      this.vertices = [];
      this.colors = [];
      this.normales = [];
      this.indices = [];

      for(let i = 0; i < points.length; i += 3)
      {
         this.vertices.push(points[i]);
         this.vertices.push(points[i+1]);
         this.vertices.push(points[i+2]);

         // colors and normales are always the same
         this.colors.push(this.color[0], this.color[1], this.color[2], 1.0);
         this.normals.push(0.0,0.0,0.0);
         this.indices.push(this.indices.length);
      }
   }

   /**
    * set a new target to reach, new random midpoint
    */
   setNewTarget()
   {
      this.target = this.executeMidpoint();
   }

   /**
    * call on every tick to reach the target
    * @param {float} deltaY 
    */
   tick(deltaY = 0.005)
   {
      // adjust every points Y coordinate if a target is set
      for(let i = 1; i < this.vertices.length && this.target !== null; i += 3)
      {
         let y = this.vertices[i];
         let targetY = this.target[i];
         let deltaYTemp = deltaY;

         // if equal, do not change point, otherwise adjust Y
         if(!doubleEqual(y, targetY, deltaY*2))
         {
            // if ball has to get lower
            if(y > targetY)
            {
            deltaYTemp *= -1.0;
            }

            y += deltaYTemp;

            this.vertices[i] = y;
         }
      }

      this.verticesBuffer = getVertexBufferWithVertices(this.vertices);
   }

   /**
    * Execute the midpoint algo
    */
   executeMidpoint()
   {
      let points = [];

      // Prepare point A and point B of the segment
      let a = [this.ax, this.initializeY(), this.depth];
      let b = [this.bx, this.initializeY(), this.depth];

      // Add the point A to the vertices (first to set in the list)
      points.push(a[X], a[Y], a[Z]);

      // Execute midpoint algo. (recursive)
      this.recursiveCompute(a, b, this.displacement, points);

      points.push(b[X], b[Y], b[Z]);

      return points;
   }

   /**
    * Compute points between two others points
    * @param {Array} a position A (3D)
    * @param {Array} b position B (3D)
    * @param {float} displacement 
    * @param {Array} points Array of all points
    */
   recursiveCompute(a, b, displacement, points)
   {
      let ax = a[X];
      let bx = b[X];
      let distance = Math.abs(bx - ax) / 2.0;
      let limit = this.limit;

      // if the distance is still larger than the limit, we continue the recursion (continue the subdivision)
      // otherwise, the subdivision is over
      if(distance >= limit)
      {
         // prepare data relative to the new point between A and B
         let cy = this.computeY(a, b, displacement);
         let c = [ax + distance, cy, a[Z]];
         let newDisplacement = displacement * 2**(-this.smooth);

         // execute the recursion between A and the new point (C)
         this.recursiveCompute(a, c, newDisplacement, points);

         // add the new point in the list
         points.push(c[X], c[Y], c[Z]);

         // execute the recursion between C (new point) and B
         this.recursiveCompute(c, b, newDisplacement, points);
      }
   }

   /**
    * Initialize Y for the two points of each side (A and B)
    */
   initializeY()
   {
      let sign = Math.random() < 0.5 ? -1.0: 1.0;

      return this.h + sign * random(0, this.displacement / 2.0);
   }

   /**
    * Compute Y for midpoint algo
    * @param {Array} a 
    * @param {Array} b 
    * @param {float} displacement 
    */
   computeY(a, b, displacement)
   {
      let sign = Math.random() < 0.5 ? -1.0: 1.0;
      let averageY = (a[Y] + b[Y]) / 2.0;

      return averageY + sign * random(0, displacement / 2.0);
   }

   /**
    * To call inside initShaderParameters
    * @param {Program} prg Program
    */
   setupShader(prg)
   {
      this.prg = prg;

      prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
      glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
      prg.colorAttribute = glContext.getAttribLocation(prg, "aVertexColor");
      glContext.enableVertexAttribArray(prg.colorAttribute);
      prg.pointSize = glContext.getUniformLocation(prg, "uPointSize");

      prg.vertexNormalAttribute = glContext.getAttribLocation(prg, "aVertexNormal");
	   glContext.enableVertexAttribArray(prg.vertexNormalAttribute);
   }

   /**
    * To draw inside drawScene
    */
   render()
   {
      let prg = this.prg;
      let indices = this.indices;
      let pointSize = this.size;

      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.normalsBuffer);
      glContext.vertexAttribPointer(prg.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);

      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.verticesBuffer);
      glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorsBuffer);
      glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      glContext.uniform1f(prg.pointSize, pointSize);
      glContext.drawElements(glContext.LINE_STRIP, indices.length, glContext.UNSIGNED_SHORT,0);
   }
}
