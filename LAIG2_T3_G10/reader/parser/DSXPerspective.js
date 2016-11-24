function DSXPerspective(id,near,far,angle) {
	this.id=id;
	this.near = parseFloat(near);
	this.far = parseFloat(far);
	this.angle = parseFloat(angle);
	
	this.from = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	};
	
	this.to = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	};
	
	this.print = function () {
		console.log("from: " + this.from.x + " " + this.from.y + " " + this.from.z);
		console.log("to: " + this.to.x + " " + this.to.y + " " + this.to.z);
	};
	
}