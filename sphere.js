class Sphere {
    get rayon() { return 3; }
    get subdivision() { return 2; }
    get X() { return 0.525731112119133696; }
    get Z() { return 0.850650808352039932; }

    constructor(center) {
        this.center = center;
        this.indexCnt = 0;
        this.vertex = [];
        this.icosahedron_vertex();
        this.triangles = [];
        this.icosahedron_triangle();
        this.vertices = [];
        this.indices = [];
        this.vertexColor = [];
        this.vertexColor.push(0.3, 0.3, 0.3, 1.0);
        this.colors =[];
        this.generate_vertex();

        this.translate_to(center);
    }

    icosahedron_vertex() {
        var x = this.X;
        var y = 0;
        var z = this.Z;

        this.vertex.push(-x, y, z);
        this.vertex.push(x, y, z);
        this.vertex.push(-x, y, -z);
        this.vertex.push(x, y, -z);
        this.vertex.push(y, z, x);
        this.vertex.push(y, z, -x);
        this.vertex.push(y, -z, x);
        this.vertex.push(y, -z, -x);
        this.vertex.push(z, x, y);
        this.vertex.push(-z, x, y);
        this.vertex.push(z, -x, y);
        this.vertex.push(-z, -x, y);
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

    generate_vertex() {
        var i;
        for (i = 0; i < this.triangles.length; i+=3){
            var v1 = [];
            var v2 = [];
            var v3 = [];
            var vertexIndexStart = this.triangles[i] * 3;
            v1.push(this.vertex[vertexIndexStart],
                this.vertex[vertexIndexStart + 1],
                this.vertex[vertexIndexStart + 2]);
            vertexIndexStart = this.triangles[i+1] * 3;
            v2.push(this.vertex[vertexIndexStart],
                this.vertex[vertexIndexStart + 1],
                this.vertex[vertexIndexStart + 2]);
            vertexIndexStart = this.triangles[i+2] * 3;
            v3.push(this.vertex[vertexIndexStart],
                this.vertex[vertexIndexStart + 1],
                this.vertex[vertexIndexStart + 2]);
            Sphere.fromOneToFourTriangles(this, v1, v2, v3, this.subdivision);
        }
    }

    static fromOneToFourTriangles(sphere, v1, v2, v3, depth) {
        var v12 = [];   var v23 = [];   var v31 = [];   var i;
        if(depth == 0) {
            sphere.vertices.push(v1[0], v1[1], v1[2]);
            sphere.colors.push(sphere.vertexColor[0], sphere.vertexColor[1], sphere.vertexColor[2], sphere.vertexColor[3]);
            sphere.vertices.push(v2[0], v2[1], v2[2]);
            sphere.colors.push(sphere.vertexColor[0], sphere.vertexColor[1], sphere.vertexColor[2], sphere.vertexColor[3]);
            sphere.vertices.push(v3[0], v3[1], v3[2]);
            sphere.colors.push(sphere.vertexColor[0], sphere.vertexColor[1], sphere.vertexColor[2], sphere.vertexColor[3]);
        
            sphere.indices.push(sphere.indexCnt, sphere.indexCnt+1, sphere.indexCnt+1, sphere.indexCnt+2, sphere.indexCnt+2, sphere.indexCnt);
            sphere.indexCnt += 3;
        } else {
            for (i = 0; i < 3; i++) {
                v12.push( (v1[i]+v2[i])/2.0 );
                v23.push( (v2[i]+v3[i])/2.0 );
                v31.push( (v3[i]+v1[i])/2.0 );
            }
            v12 = Sphere.normalize(v12);
            v23 = Sphere.normalize(v23);
            v31 = Sphere.normalize(v31);

            Sphere.fromOneToFourTriangles(sphere, v1, v12, v31, depth-1);
            Sphere.fromOneToFourTriangles(sphere, v2, v23, v12, depth-1);
            Sphere.fromOneToFourTriangles(sphere, v3, v31, v23, depth-1);
            Sphere.fromOneToFourTriangles(sphere, v12, v23, v31, depth-1);
        }
    }

    static normalize(v) {
        var d = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        if (d!=0.0) {
            v[0]/=d;
            v[1]/=d;
            v[2]/=d;
        }
        return v;
    }

    translate_to(v) {
        var i;
        for(i=0; i < this.vertices.length; i+=3) {
            this.vertices[i] += v[0];
            this.vertices[i+1] += v[1];
            this.vertices[i+2] += v[2];
        }
    }

    static getAllVertices(spheres) {
        let all_vertices = [];
        spheres.forEach(sph => {
            all_vertices = all_vertices.concat(sph.vertices);
        });
        return all_vertices;
    }

    static getAllIndices(spheres) {
        let all_indices = [];
        var len = 0;
        spheres.forEach(sph => {
            all_indices = all_indices.concat(sph.indices.map(x => x + len));
            len += sph.vertices.length;
        });
        return all_indices;
    }

    static getAllColors(spheres) {
        let all_colors = [];
        spheres.forEach(sph => {
            all_colors = all_colors.concat(sph.colors);
        });
        return all_colors;
    }
}