


/**
 * Class Sphere
 * Reprensente a sphere using subdivision for WebGL.
 */
class Sphere {
    get X() { return 0.525731112119133696; }
    get Z() { return 0.850650808352039932; }

    /**
     * Constructor of a sphere
     * @param {*} center where the sphere is placed. Default value: [0.0, 0.0, 0.0]
     * @param {*} subdivision times the sphere will be precise
     */
    constructor(center = [0.0, 0.0, 0.0], subdivision = 0.0)
    {
        this.center = center;
        this.subdivision = subdivision;

        this.initializeArrays();
    }

    /**
     * Reset all the sphere parameters
     */
    initializeArrays()
    {
        this.triangles = [];    // used for icosahedron points generation
        this.icosahedronvertex = [];       // used for icosahedron points generation
        this.indexCnt = 0;      // used for vertices generation
        this.vertices = [];
        this.indices = [];
        this.colors =[];
        this.normals = [];
        this.vertexColor = [];
        this.vertexColor.push(0.7, 0.7, 0.0, 1.0);

        if(this.verticesBuffer)
        {
          glContext.deleteBuffer(this.verticesBuffer);
        }

        if(this.indicesBuffer)
        {
          glContext.deleteBuffer(this.indicesBuffer);
        }

        if(this.normalsBuffer)
        {
          glContext.deleteBuffer(this.normalsBuffer);
        }

        if(this.colorsBuffer)
        {
          glContext.deleteBuffer(this.colorsBuffer);
        }

        this.verticesBuffer = null;
        this.colorsBuffer = null;
        this.indicesBuffer = null;
        this.normalsBuffer = null;
    }

    /**
     * Set the subdivision argument for later build the geometry of the sphere
     * @param {int} subdivision subdivision recursion level
     */
    setSubdivision(subdivision)
    {
      this.initializeArrays();
      this.subdivision = subdivision;
      this.createGeometry();
    }

    /**
     * Push the points of the icosahedron
     */
    icosahedron_vertex()
    {
        var x = this.X;
        var z = this.Z;

        this.icosahedronvertex.push(-x, 0.0, z);
        this.icosahedronvertex.push(x, 0.0, z);
        this.icosahedronvertex.push(-x, 0.0, -z);
        this.icosahedronvertex.push(x, 0.0, -z);
        this.icosahedronvertex.push(0.0, z, x);
        this.icosahedronvertex.push(0.0, z, -x);
        this.icosahedronvertex.push(0.0, -z, x);
        this.icosahedronvertex.push(0.0, -z, -x);
        this.icosahedronvertex.push(z, x, 0.0);
        this.icosahedronvertex.push(-z, x, 0.0);
        this.icosahedronvertex.push(z, -x, 0.0);
        this.icosahedronvertex.push(-z, -x, 0.0);
    }

    /**
     * Construct the triangles using the indicies of the icosahedron
     */
    icosahedron_triangle()
    {
        this.triangles.push(1,4,0);
        this.triangles.push(4,9,0);
        this.triangles.push(4,5,9);
        this.triangles.push(8,5,4);
        this.triangles.push(1,8,4);
        this.triangles.push(1,10,8);
        this.triangles.push(10,3,8);
        this.triangles.push(8,3,5);
        this.triangles.push(3,2,5);
        this.triangles.push(3,7,2);
        this.triangles.push(3,10,7);
        this.triangles.push(10,6,7);
        this.triangles.push(6,11,7);
        this.triangles.push(6,0,11);
        this.triangles.push(6,1,0);
        this.triangles.push(10,1,6);
        this.triangles.push(11,0,9);
        this.triangles.push(2,11,9);
        this.triangles.push(5,2,9);
        this.triangles.push(11,2,7);
    }

    /**
     * Generate all vertex and indices with subdivision
     */
    generate_vertex()
    {
        for (let i = 0; i < this.triangles.length; i+=3){
            var v1 = [];
            var v2 = [];
            var v3 = [];
            var vertexIndexStart = this.triangles[i] * 3;
            v1.push(this.icosahedronvertex[vertexIndexStart],
                this.icosahedronvertex[vertexIndexStart + 1],
                this.icosahedronvertex[vertexIndexStart + 2]);

            vertexIndexStart = this.triangles[i+1] * 3;
            v2.push(this.icosahedronvertex[vertexIndexStart],
                this.icosahedronvertex[vertexIndexStart + 1],
                this.icosahedronvertex[vertexIndexStart + 2]);

            vertexIndexStart = this.triangles[i+2] * 3;
            v3.push(this.icosahedronvertex[vertexIndexStart],
                this.icosahedronvertex[vertexIndexStart + 1],
                this.icosahedronvertex[vertexIndexStart + 2]);

            this.fromOneToFourTriangles(v1, v2, v3, this.subdivision);
        }
    }

    /**
     * Subdivise a triangle in four smaller triangles and recursivliy
     * @param {Sphere} sphere
     * @param {Array} v1 Vertex v1
     * @param {Array} v2 Vertex v2
     * @param {Array} v3 Vertex v3
     * @param {int} depth remaining subdivisons step
     */
    fromOneToFourTriangles(v1, v2, v3, depth)
    {
        var v12 = [];   var v23 = [];   var v31 = []; var n;
        if(depth == 0) {
            this.vertices.push(v1[0], v1[1], v1[2]);
            this.vertices.push(v2[0], v2[1], v2[2]);
            this.vertices.push(v3[0], v3[1], v3[2]);
            n = Sphere.findNormalofTriangle(v1, v2, v3);

            for(let i = 0; i < 3; i++) {    // foreach vertex
                // Add color
                this.colors.push(sphere.vertexColor[0], sphere.vertexColor[1], sphere.vertexColor[2], sphere.vertexColor[3]);
                // Add Normal
                this.normals.push(n[0], n[1], n[2]);
            }

            this.indices.push(sphere.indexCnt, sphere.indexCnt+1, sphere.indexCnt+1, sphere.indexCnt+2, sphere.indexCnt+2, this.indexCnt);
            this.indexCnt += 3;
        } else {
            for (let i = 0; i < 3; i++) {
                v12.push( (v1[i]+v2[i])/2.0 );
                v23.push( (v2[i]+v3[i])/2.0 );
                v31.push( (v3[i]+v1[i])/2.0 );
            }
            v12 = Sphere.normalize(v12);
            v23 = Sphere.normalize(v23);
            v31 = Sphere.normalize(v31);

            this.fromOneToFourTriangles(v1, v12, v31, depth-1);
            this.fromOneToFourTriangles(v2, v23, v12, depth-1);
            this.fromOneToFourTriangles(v3, v31, v23, depth-1);
            this.fromOneToFourTriangles(v12, v23, v31, depth-1);
        }
    }

    /**
     * Normalize a vector using the size ratio of a sphere
     * @param {Array} base_vector Vector to normalize
     */
    static normalize(vector)
    {
        var d = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2]);
        if (d != 0.0) {
            vector[0] /= d;
            vector[1] /= d;
            vector[2] /= d;
        }
        return vector;
    }

    /**
     * Compute the normal vector of a triangle
     * @param {Array} V1 vertex 1
     * @param {Array} V2 vertex 2
     * @param {Array} V3 vertex 3
     */
    static findNormalofTriangle(V1, V2, V3)
    {
        var N = [0.0, 0.0, 0.0];
        N[0] = (V2[1]-V1[1])*(V3[2]-V1[2]) - (V2[2]-V1[2])*(V3[1]-V1[1]);
        N[1] = (V2[2]-V1[2])*(V3[0]-V1[0]) - (V2[0]-V1[0])*(V3[2]-V1[2]);
        N[2] = (V2[0]-V1[0])*(V3[1]-V1[1]) - (V2[1]-V1[1])*(V3[0]-V1[0]);

        var norme = Math.sqrt(N[0]*N[0] + N[1]*N[1] + N[2]*N[2]);

        if (norme > 0.0) {
            N[0] /= norme; N[1] /= norme; N[2] /= norme;
        } else {
            console.info("Null vector");
        }
        return N;
    }

    /**
     * Diplace the sphere to a destination point.
     * @param {Array} vertex Destination vertex as array with 3 components
     */
    translate_to(vertex)
    {
        for(let i=0; i < this.vertices.length; i+=3) {
            this.vertices[i] += vertex[0];
            this.vertices[i+1] += vertex[1];
            this.vertices[i+2] += vertex[2];
        }
    }

    /**
    * Create the geometry of the object
    * To call inside initBuffer
    */
    createGeometry()
    {
        this.icosahedron_vertex();
        this.icosahedron_triangle();
        this.generate_vertex();
        this.translate_to(this.center);

        this.verticesBuffer = getVertexBufferWithVertices(this.vertices);
        this.colorsBuffer  = getVertexBufferWithVertices(this.colors);
        this.indicesBuffer  = getIndexBufferWithIndices(this.indices);
        this.normalsBuffer = getVertexBufferWithVertices(this.normals);
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

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.normalsBuffer);
        glContext.vertexAttribPointer(prg.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.verticesBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorsBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        glContext.drawElements(glContext.TRIANGLE_STRIP, indices.length, glContext.UNSIGNED_SHORT,0);
    }
}
