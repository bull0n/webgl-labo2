class Sphere {
    get rayon() { return 3; }
    get subdivision() { return 2; }
    get X() { return 0.525731112119133696; }
    get Z() { return 0.850650808352039932; }

    constructor(center_x, center_y, center_z) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.center_z = center_z;
        this.indexCnt = 0;
        this.vertices = [];
        this.icosahedron_vertex();
        this.triangles = [];
        this.icosahedron_triangle();

        //implémenter la boucle for !
        //implémenter forOneToFourTriangles(...)
    }

    icosahedron_vertex() {
        //console.log(this.X);
        //console.log(this.center_x);
        var x = this.center_x + this.X;
        var y = this.center_y;
        var z = this.center_y + this.Z;

        this.vertices.push(-x, y, z);
        this.vertices.push(x, y, z);
        this.vertices.push(-x, y, -z);
        this.vertices.push(x, y, -z);
        this.vertices.push(y, z, x);
        this.vertices.push(y, z, -x);
        this.vertices.push(y, -z, x);
        this.vertices.push(y, -z, -x);
        this.vertices.push(z, x, y);
        this.vertices.push(-z, x, y);
        this.vertices.push(z, -x, y);
        this.vertices.push(-z, -x, y);
    }

    icosahedron_triangle() {
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

    /*static fromOneToFourTriangles(v1, v2, v3, depth){
        var v12 = [];   var v23 = [];   var v31 = [];   var i;

        if (depth == 0) {
            this.vertices.push( v1[0], v1[1], v1[2] );
            colors.push( vertexColor[0], vertexColor[1], vertexColor[2], vertexColor[3] );
            vertices.push( v2[0], v2[1], v2[2] );
            colors.push( vertexColor[0], vertexColor[1], vertexColor[2], vertexColor[3] );
            vertices.push( v3[0], v3[1], v3[2] );
            colors.push( vertexColor[0], vertexColor[1], vertexColor[2], vertexColor[3] );

            indices.push( indexCnt, indexCnt+1, indexCnt+1, indexCnt+2, indexCnt+2, indexCnt );
            indexCnt += 3;
        }else{
            for (i = 0; i < 3; i++) {
                v12.push( (v1[i]+v2[i])/2.0 );
                v23.push( (v2[i]+v3[i])/2.0 );
                v31.push( (v3[i]+v1[i])/2.0 );
            }
            v12 = Normalize(v12);
            v23 = Normalize(v23);
            v31 = Normalize(v31);

            fromOneToFourTriangles(  v1, v12, v31, depth-1);
            fromOneToFourTriangles(  v2, v23, v12, depth-1);
            fromOneToFourTriangles(  v3, v31, v23, depth-1);
            fromOneToFourTriangles( v12, v23, v31, depth-1);
        }
    }*/
}