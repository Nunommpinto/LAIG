function DSXOmni(id,enabled) {
	this.id=id;
	this.enabled = parseInt(enabled);
	
	this.location = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        w: 0.0
    };
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

    this.print = function() {
    	console.log("omni " + this.id + " " + this.enabled + ":");
    	console.log("location: " + this.location.x + " " + this.location.y + " " + this.location.z + " " + this.location.w);
        console.log("ambient: " + printColour(this.ambient));
        console.log("diffuse: " + printColour(this.diffuse));
        console.log("specular: " + printColour(this.specular));
    };
}