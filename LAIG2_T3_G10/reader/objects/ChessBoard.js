function ChessBoard(scene, args){
	 CGFobject.call(this,scene);
	 this.initBuffers();
	
	 this.args = args;
	 this.du = args[0];
	 this.dv = args[1];
	 this.texture = new CGFtexture(scene, this.args[2]);
	 this.su = args[3];
	 this.sv = args[4];
	 this.c1 = args[5];
	 this.c2 = args[6];
	 this.cs = args[7];
	
	 this.mat = new CGFappearance(scene);
	 this.mat.setTexture(null);
	
	 var dimension = 3;
	 var offX = dimension/this.du;
	 var offY = dimension/this.dv;
	
	
	 this.boardShader = new CGFshader(this.scene.gl,"shaders/chessb.vert", "shaders/chessb.frag");
	 this.boardShader.setUniformsValues({uSampler: 1});
	
	 this.boardShader.setUniformsValues({c1: [this.c1[0], this.c1[1], this.c1[2], this.c1[3]]});
	 this.boardShader.setUniformsValues({c2: [this.c2[0], this.c2[1], this.c2[2], this.c2[3]]});
	 this.boardShader.setUniformsValues({cs: [this.cs[0], this.cs[1], this.cs[2], this.cs[3]]});
	 this.boardShader.setUniformsValues({distX: offX});
	 this.boardShader.setUniformsValues({distY: offY});
	 this.boardShader.setUniformsValues({su: this.su});
	 this.boardShader.setUniformsValues({sv: this.sv});
	 this.boardShader.setUniformsValues({du: this.du});
	 this.boardShader.setUniformsValues({dv: this.dv});
	
	 this.plane = new MyPlane(this.scene, dimension, dimension, this.du * 10 , this.dv * 10);

};

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.display = function(){
	
	this.mat.apply();
    this.scene.setActiveShader(this.boardShader);
    this.texture.bind(1);
    this.plane.display();
    this.texture.unbind(1);
    this.scene.setActiveShader(this.scene.defaultShader);
};

ChessBoard.prototype.updateTex = function(S, T) {

};