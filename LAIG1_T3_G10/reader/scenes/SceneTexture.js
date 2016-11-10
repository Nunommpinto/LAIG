function SceneTexture(scene, id, file, lengths, lengtht) {
    CGFtexture.call(this, scene, file);
    this.id = id;
    this.lengths = lengths;
    this.lengtht = lengtht;
}

SceneTexture.prototype = Object.create(CGFtexture.prototype);
SceneTexture.prototype.constructor = SceneTexture;
