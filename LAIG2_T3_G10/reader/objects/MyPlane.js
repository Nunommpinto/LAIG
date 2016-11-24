function MyPlane(scene, args) {
    this.args = args || [3, 2, 10, 7];
    this.dim_x = this.args[0];
    this.dim_y = this.args[1];
    this.parts_x = this.args[2];
    this.parts_y = this.args[3];

    var nurbsSurface = new CGFnurbsSurface(1, 1, [0, 0, 1, 1], [0, 0, 1, 1], [
        [
            [0.5, 0, -0.5, 1],
            [0.5, 0, 0.5, 1]
        ],
        [
            [-0.5, 0, -0.5, 1],
            [-0.5, 0, 0.5, 1, 1]
        ]
    ]);
    var getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, this.parts_x, this.parts_y);
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.updateTex = function(ampS, ampT) {};
