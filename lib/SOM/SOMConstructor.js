var SOMOut = require('./SOMOut');
var SOMIn = require('./SOMIn');

function SOMConstructor () {

	// Methods from SOMOut.js
	this.addEpochListener = SOMOut.addEpochListener;
    this.addFinishListener = SOMOut.addFinishListener;
    this.toJSON = SOMOut.toJSON;

    // Methods from SOMIn.js
    this.train = SOMIn.train;
    this.stepTrain = SOMIn.stepTrain;
    this.config = SOMIn.config;
    this.loadMap = SOMIn.loadMap;
    this.run = SOMIn.run;

}


module.exports = {
	SOM : SOMConstructor
}