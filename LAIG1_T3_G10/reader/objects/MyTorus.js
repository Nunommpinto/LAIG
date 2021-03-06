/**
 * MyTorus
 * @constructor
 */
function MyTorus(scene, args) {
    CGFobject.call(this, scene);
    
    this.args = args || [1.0, 2, 8, 10];
    
    this.inner = this.args[0];
    this.outer = this.args[1];
    this.slices = this.args[2];
    this.stacks = this.args[3];

    this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.initBuffers = function() {

	var ang_0 = 360 * deg2rad / this.slices;
    var ang_1 = 180 * deg2rad / this.stacks;
    
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var stack = 0; stack <= this.stacks; stack++) {
        var theta = stack * 2 * Math.PI / this.stacks;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var slice = 0; slice <= this.slices; slice++) {
            var phi = slice * 2 * Math.PI / this.slices;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = (this.outer + (this.inner * cosTheta)) * cosPhi;
            var y = (this.outer + (this.inner * cosTheta)) * sinPhi
            var z = this.inner * sinTheta;
            var s = 1 - (stack / this.stacks);
            var t = 1 - (slice / this.slices);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(s, t);
        }
    }

    for (var stack = 0; stack < this.stacks; stack++) {
        for (var slice = 0; slice < this.slices; slice++) {
            var first = (stack * (this.slices + 1)) + slice;
            var second = first + this.slices + 1;

            this.indices.push(first, second + 1, second);
            this.indices.push(first, first + 1, second + 1);
        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyTorus.prototype.updateTex = function(S, T) {
};
