function DSXSpot(id,enabled,angle,exponent) {
	this.id=id;
	this.enabled = enabled;
	this.angle=angle;
	this.exponent=exponent;
	
	this.target = {
			x: 0.0,
	        y: 0.0,
	        z: 0.0
	};
	
	this.location = {
	        x: 0.0,
	        y: 0.0,
	        z: 0.0
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
		console.log("spot " + this.id + ":");
		console.log("target: " + this.target.x + " " + this.target.y + " " + this.target.z);
		console.log("location: " + this.location.x + " " + this.location.y + " " + this.location.z);
		console.log("ambient: " + printColour(this.ambient));
		console.log("diffuse: " + printColour(this.diffuse));
		console.log("specular: " + printColour(this.specular));
	};
}