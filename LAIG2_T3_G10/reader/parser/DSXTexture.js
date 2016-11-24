function DSXTexture(id, file, lengths, lengtht) {
	this.id = id;
	this.file = file;
	this.lengths = lengths;
	this.lengtht = lengtht;
	
	this.print = function () {
		console.log("texture " + this.id + ": " + this.file + " " + this.lengths + " " + this.lengtht);
	};
}