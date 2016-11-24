function DSXTransformation(id) {
	this.id=id;
	
	this.matrix = mat4.create();
	
	
	this.print = function(){
		console.log("transformation " + this.id + ":");
		console.log("matrix " + this.matrix);
	};
}