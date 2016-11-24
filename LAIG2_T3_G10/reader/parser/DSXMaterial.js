function DSXMaterial(id) {
    this.id = id;
    this.shininess = 0.0;
    this.ambient = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.diffuse = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.specular = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.emission = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };

    this.print = function() {
    	console.log("material " + this.id);
    	console.log("emission: " + printColour(this.emission));
    	console.log("ambient: " + printColour(this.ambient));
    	console.log("diffuse: " + printColour(this.diffuse));
    	console.log("specular: " + printColour(this.specular));
        console.log("shininess: " + this.shininess);
    };
}
