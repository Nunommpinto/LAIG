function SceneObject(id) {
    this.id = id;
    this.materials = [];
    this.anims = [];
    this.texture = null;
    this.matrix = null;
    this.primitive = null;
    this.currAnim = 0;
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
    
    if (this.currAnim < this.anims.length) {
        scene.multMatrix(this.anims[this.currAnim].matrix);
    }
    
    scene.multMatrix(this.matrix);
    this.primitive.display();
    scene.popMatrix();
};

SceneObject.prototype.updateAnims = function(delta) {
    if (this.anims.length == 0 || this.currAnim >= this.anims.length) 
    	return;

    if (this.anims[this.currAnim].done) 
    	++this.currAnim;
    
    if(this.currAnim < this.anims.length) 
    	this.anims[this.currAnim].update(delta);
};