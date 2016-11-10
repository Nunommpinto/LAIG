var deg2rad = Math.PI / 180;

function XMLscene(myInterface) {
    CGFscene.call(this);
    this.myInterface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    
    this.persps = [];
    this.textures = [];
    this.materials = [];
    this.primitives = [];
    this.objects = [];
    
    var idx=0;
    this.material_count=0;
    this.persp_count=0;
    this.laux = [];
	this.axis = new CGFaxis(this);
};


XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 400, vec3.fromValues(110, 50, 110), vec3.fromValues(-10, 0, -10));
};

/**
 * Sets the default scene appearance based on an material named "default"
 * if it is present in the .lsx scene file
 */
XMLscene.prototype.setDefaultAppearance = function () {
	this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};


/**
* Function called by a {XMLParser} once it is done parsing
* a scene in .dsx format
*/
XMLscene.prototype.onGraphLoaded = function () 
{
	this.axis = new CGFaxis(this, this.graph.scene_axis);
    
	//Illumination
	this.gl.clearColor(this.graph.illumination.background.r,this.graph.illumination.background.g,this.graph.illumination.background.b,this.graph.illumination.background.a);
	this.setGlobalAmbientLight(this.graph.illumination.ambient.r,this.graph.illumination.ambient.g,this.graph.illumination.ambient.b,this.graph.illumination.ambient.a);
	
	//Perspectives
	this.initPerspectives();
	//this.updatePerspective();
    
	/*
     * Lights
     */
    this.initLights();
    
    /*
     * Textures
     */
    if(this.graph.textures.length > 0)
    	this.enableTextures(true);
    
    var text = this.graph.textures;
    for (var i = 0 ; i < text.length ; i++) {
    	var aux = new SceneTexture(this, text[i].id, text[i].file, text[i].lengths, text[i].lengtht);
    	
    	this.textures.push(aux);
    }
    
    /*
     * Materials
     */
    var mat = this.graph.materials;
    for ( i = 0 ; i < mat.length ; i++) {
    	aux = new SceneMaterial(this, mat[i].id);
    	aux.setAmbient(mat[i].ambient.r, mat[i].ambient.g, mat[i].ambient.b, mat[i].ambient.a);
    	aux.setDiffuse(mat[i].diffuse.r, mat[i].diffuse.g, mat[i].diffuse.b, mat[i].diffuse.a);
    	aux.setSpecular(mat[i].specular.r, mat[i].specular.g, mat[i].specular.b, mat[i].specular.a);
    	aux.setEmission(mat[i].emission.r, mat[i].emission.g, mat[i].emission.b, mat[i].emission.a);
    	aux.setShininess(mat[i].shininess);
    	
    	this.materials.push(aux);
    }
    
    //Primitives
    this.initPrimitives();
    
    // Components
    this.initComponents();
    
    
    this.graph.loadedOk = true;
};

XMLscene.prototype.display = function () {
	this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
		
	
	if (this.graph.loadedOk)
	{	
		this.axis.display();
		this.setDefaultAppearance();
		
		//this.updatePerspective();
		this.updateLights();
		
		// Draw Objects to scene (nodes with leaves)
        for (i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            obj.draw(this);
        }
        
	};
	this.shader.unbind();
	
};


// ------------------------------------------------------------



XMLscene.prototype.updatePerspective = function () {
    this.camera = this.persps[this.persp_count];
    this.interface.setActiveCamera(this.persps[this.persp_count]);

    this.persp_count = (++this.persp_count) % this.persps.length;
};

XMLscene.prototype.updateLights = function () {

	var idx = 0;
	for (var i = 0; i < this.graph.omnis.length; i++) {
        var o = this.graph.omnis[i];
		if(o.enabled)
        	this.lights[idx].enable();
        else
        	this.lights[idx].disable();

        this.lights[idx].update();
        idx++;
    }
	
	for (var j = 0; j < this.graph.spots.length; j++) {
        var s = this.graph.spots[j];
       	if(s.enabled)
          	this.lights[idx].enable();
        else
           	this.lights[idx].disable();
        this.lights[idx].update();
        idx++;
    }
};


XMLscene.prototype.initPerspectives = function () {
	var persp = this.graph.perspectives;
	
	for ( var i = 0 ; i < persp.length ; i++) {
		this.persps.push(new CGFcamera( (persp[i].angle * this.deg2rad), persp[i].near, persp[i].far, vec3.fromValues(persp[i].from.x, persp[i].from.y, persp[i].from.z), vec3.fromValues(persp[i].to.x, persp[i].to.y, persp[i].to.z)));
	}
};


XMLscene.prototype.initLights = function () {	
	var lix = 0;
	
	for (var i = 0; i < this.graph.omnis.length; i++, lix++) {
        var o = this.graph.omnis[i];

        this.lights[lix].setPosition(o.location.x, o.location.y, o.location.z, o.location.w);
        this.lights[lix].setAmbient(o.ambient.r, o.ambient.g, o.ambient.b, o.ambient.a);
        this.lights[lix].setDiffuse(o.diffuse.r, o.diffuse.g, o.diffuse.b, o.diffuse.a);
        this.lights[lix].setSpecular(o.specular.r, o.specular.g, o.specular.b, o.specular.a);
        
        this.laux[lix] = o.enabled;
        console.log(this.laux[lix]);
        this.myInterface.addLight(lix,o.id);
        
        if(o.enabled == '0')
        	this.lights[lix].enable();
        else
        	this.lights[lix].disable();
        
        this.lights[lix].setVisible(true);
        this.lights[lix].update();
    }
	
	for (var j = 0; j < this.graph.spots.length; j++, lix++) {
        var s = this.graph.spots[j];
        
        this.lights[lix].setSpotExponent(s.exponent);
        this.lights[lix].id = s.id;
        
        this.lights[lix].setSpotDirection(s.target.x, s.target.y, s.target.z); // CORRIGIR
        this.lights[lix].setPosition(s.location.x, s.location.y, s.location.z);
        this.lights[lix].setAmbient(s.ambient.r, s.ambient.g, s.ambient.b, s.ambient.a);
        this.lights[lix].setDiffuse(s.diffuse.r, s.diffuse.g, s.diffuse.b, s.diffuse.a);
        this.lights[lix].setSpecular(s.specular.r, s.specular.g, s.specular.b, s.specular.a);     
        
        this.laux[lix] = s.enabled;
        this.myInterface.addLight(lix,s.id);
        
        if(s.enabled)
          	this.lights[lix].enable();
        else
           	this.lights[lix].disable();
        
        this.lights[lix].setVisible(true);
        this.lights[lix].update();
    }
	//this.myInterface.addLight(this.laux);
};


/**
 * Adds primitives
 */
XMLscene.prototype.initPrimitives = function() {
	
	for( var i = 0; i < this.graph.primitives.length; i++) {
		var primitive = this.graph.primitives[i];
		switch(primitive.type) {
		case "rectangle":
			var obj = new MyQuad(this, primitive.args);
			obj.id = primitive.id;
			this.primitives.push(obj);
			break;
		case "triangle":
			var obj = new MyTriangle(this, primitive.args);
			obj.id = primitive.id;
			this.primitives.push(obj);
			break;
		case "cylinder":
			var obj = new MyFullCylinder(this, primitive.args);
			obj.id = primitive.id;
			this.primitives.push(obj);
			break;
		case "sphere":
			var obj = new MySphere(this, primitive.args);
			obj.id = primitive.id;
			this.primitives.push(obj);
			break; 
		case "torus":
			var obj = new MyTorus(this, primitive.args);
			obj.id = primitive.id;
			this.primitives.push(obj);
			break;
		/*case "diamond":
			var obj = new MyDiamond(this, primitive.args);
			obj.id = primitive.id;
			this.primitives.push(obj);
			break;*/
		}
	}
};


XMLscene.prototype.initComponents = function() {
    var components_list = this.graph.components;
    
    var root_node = this.graph.findComponent(this.graph.scene_root);

    this.DFS(root_node, root_node.materials , root_node.texture, root_node.matrix);
};



XMLscene.prototype.DFS = function(component, currMaterial, currTexture, currMatrix) {
	var nextMat = component.materials;
	if(component.materials == null)
		nextMat = currMaterial;
	for(var j = 0 ; j < component.materials.length ; j++ ) {
		if (component.materials[j] == "inherit") 
		nextMat = currMaterial;
	}
	
    var nextTex = component.texture;
    if (component.texture == "inherit") 
    	nextTex = currTexture;
    else if (component.texture == "none") 
    	nexTex = null;
	

    var nextMatrix = mat4.create();
    /*console.log("nextMatrix:"+nextMatrix);
    console.log("currMatrix:"+ currMatrix);*/
    mat4.multiply(nextMatrix, currMatrix, component.matrix);

    for (var i = 0; i < component.relat.length; i++) {
        var nextcomponent = this.graph.findComponent(component.relat[i]);

        if (nextcomponent == null) {
        	var aux = new SceneObject(component.relat[i]);
            aux.materials = this.getMaterial(nextMat);
            aux.texture = this.getTexture(nextTex);
            aux.matrix = nextMatrix;
            aux.isSon = true;
            for (var j = 0; j < this.primitives.length; j++) {
                if (this.primitives[j].id == aux.id) {
                    aux.primitive = this.primitives[j];
                    break;
                }
            }
            this.objects.push(aux);
            continue;
        }

        this.DFS(nextcomponent, nextMat, nextTex, nextMatrix);
    }
};



/**
 * @returns {SceneMaterial} with the {string} id specified
 */
XMLscene.prototype.getMaterial = function(list) {
    if (list == null) 
    	return null;
    
    this.aux = [];
    
    for (var i = 0; i < this.materials.length; i++) {
        for ( var j = 0 ; j < list.length ; j++) {
        	if(list[j] == this.materials[i].id)
        		this.aux.push(this.materials[i])
        }
    }

    return this.aux;
};

/**
 * @returns {SceneTexture} with the {string} id specified
 */
XMLscene.prototype.getTexture = function(id) {
    if (id == null) 
    	return null;

    for (var i = 0; i < this.textures.length; i++)
        if (id == this.textures[i].id) 
        	return this.textures[i];

    return null;
};