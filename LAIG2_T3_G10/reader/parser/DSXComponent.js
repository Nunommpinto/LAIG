function DSXComponent(id) {
	this.id = id;
    this.materials = [];
    this.anims =[];
    this.texture = null;
    this.relat = [];
    this.matrix = mat4.create();
    
    
    this.print = function() {
        console.log("component :" + this.id);
        console.log("transformation :" + this.matrix);
        console.log("animation :"+ this.animations);
        console.log("material :" + this.material);
        console.log("texture :" + this.texture);
        console.log("children: " + this.relat);
    };
}