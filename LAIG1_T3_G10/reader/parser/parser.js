function DSXParser(filename, scene) {
    this.loadedOK = null;

    this.scene = scene;
    scene.graph = this;

    this.reader = new CGFXMLreader();
    
	console.log("DSXParser for " + filename + ".");
    this.reader.open('scenes/' + filename, this);
	
	//Data
	this.loadedOK;
	
	this.views = [];
	this.perspectives = [];
    this.illumination = new DSXIllumination();
    this.lights = [];
	this.omnis = [];
	this.spots = [];
	this.textures = [];
	this.materials = [];
	this.transfs = [];
	this.primitives = [];
	this.components = [];
}

DSXParser.prototype.onXMLReady = function() {
    console.log("DSX loaded successfully.");

    var mainElement = this.reader.xmlDoc.documentElement;

	console.log("---------Scene----------");

    var error = this.parseScene(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Views----------");

    var error = this.parseViews(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Illumination----------");

    error = this.parseIllumination(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Lights----------");

    error = this.parseLights(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }
    
    console.log("---------Textures----------");

    error = this.parseTextures(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }
    
    console.log("---------Materials----------");

    error = this.parseMaterials(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }
    
    console.log("---------Transformations----------");

    error = this.parseTransformation(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }
    
    console.log("---------Primitives----------");

    error = this.parsePrimitives(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }
    
    console.log("---------Components----------");

    error = this.parseComponents(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    } 
	
	console.log("-------------------");
	/*console.log("WARNING");
	console.log(this.components.length;*/
    this.loadedOK = true;
    this.scene.onGraphLoaded();
};

DSXParser.prototype.onXMLError = function(message) {
    console.error("DSX loading error: " + message);
    this.loadedOK = false;
};



DSXParser.prototype.parseScene = function(mainElement){									// --------------- FEITO ---------------
	var scene_list = mainElement.getElementsByTagName('scene')[0];
    if (scene_list == null) 
		return "<scene> is missing.";
    
    var scene = mainElement.getElementsByTagName('scene');
	
    this.scene_root = this.reader.getString(scene_list, 'root');
	this.scene_axis = this.reader.getFloat(scene_list, 'axis_length');
	
    console.log("scene root: " + this.scene_root + " axis_length: " + this.scene_axis);
	
	return null;
};


DSXParser.prototype.parseViews = function(mainElement){									// --------------- FEITO ---------------
	var view_list = mainElement.getElementsByTagName('views')[0];
    if (view_list == null) 
		return "<views> is missing.";

	this.views_default = this.reader.getString(view_list, 'default');
	console.log("views default: " + this.views_default);
	
	var perspectives = view_list.getElementsByTagName('perspective');
	
	for(i=0; i < perspectives.length ; i++) {
		var perspective = new DSXPerspective(perspectives[i].getAttribute('id'), perspectives[i].getAttribute('near'), perspectives[i].getAttribute('far'), perspectives[i].getAttribute('angle'));
		
		//From
		var aux = perspectives[i].getElementsByTagName('from')[0];
		perspective.from.x = this.reader.getFloat(aux, 'x');
		perspective.from.y = this.reader.getFloat(aux, 'y');
		perspective.from.z = this.reader.getFloat(aux, 'z');
		
		//To
		var aux2 = perspectives[i].getElementsByTagName('to')[0];
		perspective.to.x = this.reader.getFloat(aux2, 'x');
		perspective.to.y = this.reader.getFloat(aux2, 'y');
		perspective.to.z = this.reader.getFloat(aux2, 'z');
	
		perspective.print();
		this.perspectives.push(perspective);
	}
	
	return null;
};

DSXParser.prototype.parseIllumination = function(mainElement) { 							// ------------- FEITO -----------
	var illumination_list = mainElement.getElementsByTagName('illumination')[0];
    if (illumination_list == null || illumination_list.length == 0)
        return "<illumination> is missing.";
    
    //Args
	this.illumi_dside = this.reader.getBoolean(illumination_list, 'doublesided');
	this.illumi_local = this.reader.getBoolean(illumination_list, 'local');
	
    console.log("illumination doublesided: " + this.illumi_dside + " local: " + this.illumi_local);
	
    //Ambient
    var ambient = illumination_list.getElementsByTagName('ambient')[0];
    if (ambient == null) 
    	return "<ambient> is missing";

    this.illumination.ambient = this.parseColour(ambient);

    //Background
    var background = illumination_list.getElementsByTagName('background')[0];
    if (background == null) 
    	return "<background> is missing";

    this.illumination.background = this.parseColour(background);

    this.illumination.print();

    return null;
};

DSXParser.prototype.parseLights = function(mainElement) {				
    var lights_list = mainElement.getElementsByTagName('lights')[0];
    if (lights_list == null) 
		return "<lights> is missing.";
    
    this.lights = [];

	
	//OMNI
    var omnis = lights_list.getElementsByTagName('omni');
    for (i = 0; i < omnis.length; i++) {
        var omn = new DSXOmni(omnis[i].getAttribute('id'), omnis[i].getAttribute('enabled'));
		
        //Location
		var aux = omnis[i].getElementsByTagName('location')[0];
        omn.location.x = this.reader.getFloat(aux, 'x');
        omn.location.y = this.reader.getFloat(aux, 'y');
        omn.location.z = this.reader.getFloat(aux, 'z');
        omn.location.w = this.reader.getFloat(aux, 'w');
        
        //Other properties
		omn.ambient = this.parseColour(omnis[i].getElementsByTagName('ambient')[0]);
        omn.diffuse = this.parseColour(omnis[i].getElementsByTagName('diffuse')[0]);
        omn.specular = this.parseColour(omnis[i].getElementsByTagName('specular')[0]);

        omn.print();
        this.omnis.push(omn);
    }
    
    //SPOT
    var spots = lights_list.getElementsByTagName('spot');
    for (i = 0; i < spots.length; i++) {
        var spot = new DSXSpot(spots[i].getAttribute('id'), spots[i].getAttribute('enabled'), spots[i].getAttribute('angle'), spots[i].getAttribute('exponent'));
		
        //Target
        var aux2 = spots[i].getElementsByTagName('target')[0];
        spot.target.x = this.reader.getFloat(aux2, 'x');
        spot.target.y = this.reader.getFloat(aux2, 'y');
        spot.target.z = this.reader.getFloat(aux2, 'z');
        
        //Location
		var aux = spots[i].getElementsByTagName('location')[0];
        spot.location.x = this.reader.getFloat(aux, 'x');
        spot.location.y = this.reader.getFloat(aux, 'y');
        spot.location.z = this.reader.getFloat(aux, 'z');
        
        //Other properties
		spot.ambient = this.parseColour(omnis[i].getElementsByTagName('ambient')[0]);
        spot.diffuse = this.parseColour(omnis[i].getElementsByTagName('diffuse')[0]);
        spot.specular = this.parseColour(omnis[i].getElementsByTagName('specular')[0]);

        spot.print();
        this.spots.push(spot);
    }

   return null;
};


DSXParser.prototype.parseTextures = function(mainElement){	
	var textures_list = mainElement.getElementsByTagName('textures')[0];
    if (textures_list == null) 
    	return "<textures> is missing.";
    
    var textures = textures_list.getElementsByTagName('texture');
    
    for (i = 0; i < textures.length; i++) {
    
	    var texture = new DSXTexture(textures[i].getAttribute('id'), textures[i].getAttribute('file'), textures[i].getAttribute('length_s'), textures[i].getAttribute('length_t'));
	    
	    texture.print();
	    this.textures.push(texture);
    }
    
    return null;
};

DSXParser.prototype.parseMaterials = function(mainElement) {
    var materials_list = mainElement.getElementsByTagName('materials')[0];
    if (materials_list == null) 
    	return "<materials> is missing.";

    var materials = materials_list.getElementsByTagName('material');
    for (i = 0; i < materials.length; i++) {
        var mat = new DSXMaterial(materials[i].getAttribute('id'));
        
        //Properties
        mat.emission = this.parseColour(materials[i].getElementsByTagName('emission')[0]);
        mat.ambient = this.parseColour(materials[i].getElementsByTagName('ambient')[0]);
        mat.diffuse = this.parseColour(materials[i].getElementsByTagName('diffuse')[0]);
        mat.specular = this.parseColour(materials[i].getElementsByTagName('specular')[0]);
        mat.shininess = this.reader.getFloat(materials[i].getElementsByTagName('shininess')[0], 'value');

        mat.print();
        this.materials.push(mat);
    }

    return null;
};

DSXParser.prototype.parseTransformation = function(mainElement) {
	var transf_list = mainElement.getElementsByTagName('transformations')[0];
	if (transf_list == null)
		return "<transformations> is missing.";
	
	var transfs = transf_list.getElementsByTagName('transformation');
	for(i = 0; i < transfs.length; i++) {
		var transform = new DSXTransformation(transfs[i].getAttribute('id'));
		
        var children = transfs[i].children;
        for (j = 0; j < children.length; j++) {
            switch (children[j].tagName) {
                case "translate":
                    var trans = [];
                    trans.push(this.reader.getFloat(children[j], "x"));
                    trans.push(this.reader.getFloat(children[j], "y"));
                    trans.push(this.reader.getFloat(children[j], "z"));
                    
                    mat4.translate(transform.matrix, transform.matrix, trans);
                    break;
                case "scale":
                    var scale = [];
                    scale.push(this.reader.getFloat(children[j], "x"));
                    scale.push(this.reader.getFloat(children[j], "y"));
                    scale.push(this.reader.getFloat(children[j], "z"));
                    
                    mat4.scale(transform.matrix, transform.matrix, scale);
                    break;
                case "rotate":
                    var axis = this.reader.getItem(children[j], "axis", ["x", "y", "z"]);
                    var angle = this.reader.getFloat(children[j], "angle") * deg2rad;
                    var rot = [0, 0, 0];

                    rot[["x", "y", "z"].indexOf(axis)] = 1;
                    mat4.rotate(transform.matrix, transform.matrix, angle, rot);
                    break;
            }
        }
        
        transform.print();
        this.transfs.push(transform);
	}
	
	return null;
};

DSXParser.prototype.parsePrimitives = function (mainElement) {
	var primitives_list = mainElement.getElementsByTagName('primitives')[0];
	if (primitives_list == null)
		return "<primitives> is missing.";
	
	var primitives = primitives_list.getElementsByTagName('primitive');
	
	for(i = 0; i < primitives.length; i++) {
		
		var primit = new DSXPrimitive(primitives[i].getAttribute('id'));
		
		//ID
		this.prim_id = this.reader.getString(primitives[i], 'id');
		
		//Vars for different primitives
		var rect = primitives[i].getElementsByTagName('rectangle')[0];
		var trian = primitives[i].getElementsByTagName('triangle')[0];
		var cylin = primitives[i].getElementsByTagName('cylinder')[0];
		var sphe = primitives[i].getElementsByTagName('sphere')[0];
		var tor = primitives[i].getElementsByTagName('torus')[0];
		//var diam = primitives[i].getElementsByTagName('diamond')[0];
		
		//Rectangle
		if(rect != null) {
			this.rectangle_x1 = this.reader.getFloat(rect, 'x1');
	        this.rectangle_y1 = this.reader.getFloat(rect, 'y1');
	        this.rectangle_x2 = this.reader.getFloat(rect, 'x2');
	        this.rectangle_y2 = this.reader.getFloat(rect, 'y2');
	        
	        primit.args.push(this.rectangle_x1, this.rectangle_y1, this.rectangle_x2, this.rectangle_y2);
	        
	        primit.type = "rectangle";
	        this.primitives.push(primit);
	        console.log("rectangle " + this.prim_id + ": " + this.rectangle_x1 + " " + this.rectangle_y1 + " " + this.rectangle_x2 + " " + this.rectangle_y2);
		}
		
		//Triangle
		else if(trian != null) {
			this.triangle_x1 = this.reader.getFloat(trian, 'x1');
	        this.triangle_y1 = this.reader.getFloat(trian, 'y1');
	        this.triangle_z1 = this.reader.getFloat(trian, 'z1');
	        
	        this.triangle_x2 = this.reader.getFloat(trian, 'x2');
	        this.triangle_y2 = this.reader.getFloat(trian, 'y2');
	        this.triangle_z2 = this.reader.getFloat(trian, 'z2');
	        
	        this.triangle_x3 = this.reader.getFloat(trian, 'x3');
	        this.triangle_y3 = this.reader.getFloat(trian, 'y3');
	        this.triangle_z3 = this.reader.getFloat(trian, 'z3');
	        
	        primit.type = "triangle";
	        primit.args.push(this.triangle_x1,this.triangle_y1,this.triangle_z1,this.triangle_x2,this.triangle_y2,this.triangle_z2,this.triangle_x3,this.triangle_y3,this.triangle_z3);
	        		
	        this.primitives.push(primit);
	        console.log("triangle " + this.prim_id + ": " + this.triangle_x1 + " " + this.triangle_y1 + " " + this.triangle_z1 + " " + this.triangle_x2 + " " + this.triangle_y2 + " " + this.triangle_z2 + " " + this.triangle_x3 + " " + this.triangle_y3 + " " + this.triangle_z3);
		}
		
		//Cylinder
		else if(cylin != null) {
			this.cylinder_base = this.reader.getFloat(cylin, 'base');
	        this.cylinder_top = this.reader.getFloat(cylin, 'top');
	        this.cylinder_height = this.reader.getFloat(cylin, 'height');
	        this.cylinder_slices = this.reader.getInteger(cylin, 'slices');
	        this.cylinder_stacks = this.reader.getInteger(cylin, 'stacks');
	        
	        primit.type = "cylinder";
	        primit.args.push(this.cylinder_base, this.cylinder_top, this.cylinder_height, this.cylinder_slices, this.cylinder_stacks);
	        
	        this.primitives.push(primit);
	        console.log("cylinder " + this.prim_id + ": " + this.cylinder_base + " " + this.cylinder_top + " " + this.cylinder_height + " " + this.cylinder_slices + " " + this.cylinder_stacks);
		}
		
		//Sphere
		else if(sphe != null) {
			this.sphere_radius = this.reader.getFloat(sphe, 'radius');
	        this.sphere_slices = this.reader.getInteger(sphe, 'slices');
	        this.sphere_stacks = this.reader.getInteger(sphe, 'stacks');
	        
	        primit.type = "sphere";
	        primit.args.push(this.sphere_radius, this.sphere_slices, this.sphere_stacks);
	        
	        this.primitives.push(primit);
	        console.log("sphere " + this.prim_id + ": " + this.sphere_radius + " " + this.sphere_slices + " " + this.sphere_stacks);
		}
		
		//Torus
		else if(tor != null) {
			this.torus_inner = this.reader.getFloat(tor, 'inner');
	        this.torus_outer = this.reader.getFloat(tor, 'outer');
	        this.torus_slices = this.reader.getInteger(tor, 'slices');
	        this.torus_loops = this.reader.getInteger(tor, 'loops');
	        
	        primit.type = "torus";
	        primit.args.push(this.torus_inner, this.torus_outer, this.torus_slices, this.torus_loops);
	        		
	        this.primitives.push(primit);
	        console.log("torus " + this.prim_id + ": " + this.torus_inner + " " + this.torus_outer + " " + this.torus_slices + " " + this.torus_loop);
		}
		
		/*else if(diam != null) {
			this.diamond_slices = this.reader.getInteger(diam, 'slices');
			
			primit.type = "diamond";
			primit.args.push(this.diamond_slices);
			
			this.primitives.push(primit);
			console.log("diamond " + this.prim_id + ": " + this.diamond_slices);
		}*/
		
		else
			return "rectangle, triangle, cylinder, sphere or torus are missing.";
	} 
	
	return null;
};

DSXParser.prototype.parseComponents = function(mainElement) {
	var comps_list = mainElement.getElementsByTagName('components')[0];
    if(comps_list == null) 
        return "<components> is missing.";
    
    var components = comps_list.getElementsByTagName('component');
    
    var comps = comps_list.getElementsByTagName('component')[0];
    
    for(i = 0 ; i < components.length ; i++) {
    	console.log("-_-_-_-_-_-_");
    	var component = new DSXComponent(components[i].getAttribute('id'));
    	
    	//ID
    	this.comp_id = this.reader.getString(components[i], 'id');
    	
    	//Transformation
    	var transform_list = components[i].getElementsByTagName('transformation')[0];
    	if(transform_list == null)
    		return "<transformation> missing.";
    
    	var transform_ref = transform_list.getElementsByTagName('transformationref')[0];
    	if(transform_ref != null) {
    		this.tref_id = transform_ref.getAttribute('id');
    		DSXTransformation(this.tref_id);
    	}
    	else {
    		//console.log("entrou");
    		var children = transform_list.children; //updated 
    		console.log(children);
            for (j = 0; j < children.length; j++) {
                switch (children[j].tagName) {
                    case "translate":
                        var trans = [];
                        trans.push(this.reader.getFloat(children[j], "x"));
                        trans.push(this.reader.getFloat(children[j], "y"));
                        trans.push(this.reader.getFloat(children[j], "z"));
                        
                        //console.log("trans: " + trans);
                        mat4.translate(component.matrix, component.matrix, trans);
                        break;
                    case "scale":
                        var scale = [];
                        scale.push(this.reader.getFloat(children[j], "x"));
                        scale.push(this.reader.getFloat(children[j], "y"));
                        scale.push(this.reader.getFloat(children[j], "z"));
                        
                        //console.log("scale: " + scale);
                        mat4.scale(component.matrix, component.matrix, scale);
                        break;
                    case "rotate":
                        var axis = this.reader.getItem(children[j], "axis", ["x", "y", "z"]);
                        var angle = this.reader.getFloat(children[j], "angle") * deg2rad;
                        var rot = [0, 0, 0];

                        //console.log("rot: " + axis + " " + angle + " ");
                        rot[["x", "y", "z"].indexOf(axis)] = 1;
                        mat4.rotate(component.matrix, component.matrix, angle, rot);
                        break;
                }
            }
    	}
    	
    	//Materials
    	var mater = components[i].getElementsByTagName('materials')[0];
        if (mater == null) 
        	return "<materials> missing";
        
        var material = mater.getElementsByTagName('material');
        
        if (material.length < 1)
        	return "<material> needed.";
        
        for(q = 0 ; q < material.length ;  q++) {
        	component.materials.push(material[q].getAttribute('id'));
        }
    	
    	//Texture
    	component.texture = this.reader.getString(components[i].getElementsByTagName('texture')[0], 'id');
    	
    	//Children
    	var child = components[i].getElementsByTagName('children')[0];
        if (child == null) 
        	return "<children> missing";
       
    	
        var comp_ref = child.getElementsByTagName('componentref');
        var prim_ref = child.getElementsByTagName('primitiveref');
        
        if ( comp_ref.length < 1 && prim_ref < 1) 
        	return "need at least 1 ref";
        
        if(comp_ref.length > 0)
        	for (j = 0; j < comp_ref.length; j++)
        		component.relat.push(comp_ref[j].getAttribute('id'));
        
        if(prim_ref.length > 0)
        	for (k = 0; k < prim_ref.length; k++) {
        		component.relat.push(prim_ref[k].getAttribute('id'));
        	}
        
        component.print();
        this.components.push(component);
    }
	
	return null;
};


/*
 * Data structures
 */

DSXParser.prototype.parseColour = function(element) {
    var colour = {};
    colour.r = this.reader.getFloat(element, 'r');
    colour.g = this.reader.getFloat(element, 'g');
    colour.b = this.reader.getFloat(element, 'b');
    colour.a = this.reader.getFloat(element, 'a');
    
	return colour;
};

function printColour(c) {
    return "(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
}

DSXParser.prototype.findComponent = function(id) {
    for (i = 0; i < this.components.length; i++)
        if (this.components[i].id == id) 
        	return this.components[i];

    return null;
};