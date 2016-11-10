function DSXIllumination() {
	this.illumi_dside = 1;
	this.ambient = {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
    };
    this.background = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 1.0
    };

    this.print = function() {
        console.log("ambient: " + printColour(this.ambient));
        console.log("background: " + printColour(this.background));
    };
}