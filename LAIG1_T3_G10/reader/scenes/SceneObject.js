function SceneObject(id) {
    this.id = id;
    this.materials = [];
    this.texture = null;
    this.matrix = null;
    this.primitive = null;
}

SceneObject.prototype.updateTex = function() {
	for ( var i = 0 ; i < this.materials.length ; i++) {
		this.materials[i].setTexture(this.texture);
	}
	
    if (this.texture == null) return;

    this.primitive.updateTex(this.texture.lengths, this.texture.lengtht);
};

SceneObject.prototype.draw = function(scene) {
    scene.pushMatrix();
    this.updateTex();
    
    for( var i=0 ; i < this.materials.length ; i++) {
    	this.materials[i].apply();
    }
    
    scene.multMatrix(this.matrix);
    this.primitive.display();
    scene.popMatrix();
};