function Interface() {
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/**
 * Initializes interface
 * @param {CGFapplication} application
 */
Interface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();
	
	this.lights_group = this.gui.addFolder("Lights");
    this.lights_group.open();
    
    return true; 
};

Interface.prototype.addLight = function(i, id) {
	
	this.lights_group.add(this.scene.laux, i, this.scene.laux[i]).name(id);
};


Interface.prototype.processKeyDown = function(event) {
    switch (event.keyCode) {
        case (86):
        case (118): //V
            this.scene.updateView();
            break;
        case (77):
        case (109): //M
            this.scene.updateMaterial();
            break;
    };
};