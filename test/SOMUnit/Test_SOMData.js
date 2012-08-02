var SOMData = require('../../lib/SOM/SOMData');
var ColorData = require('../../lib/Data/ColorData');


var numColors = 9;
var colorType = 'color';

module.exports = {
    setUp: function(callback) {
        this.data = ColorData.generate(numColors, colorType);
        callback();
    },

    tearDown: function(callback) {
        callback();
    },

    testSOMData : function(test) {
    	SOMData.consume(this.data);

    	var vector = SOMData.nextLinear();
    	test.equals(vector[0],this.data[0].r,'Did not return the first element : ' + vector);

    	vector = SOMData.nextLinear();
    	test.equals(vector[0],this.data[1].r,'Did not return the second element : ' + vector);

    	vector = SOMData.next();
    	test.notEqual(vector,undefined,'Did not find random element: ' + vector);

    	var len = SOMData.getDataLength();
    	test.equals(len,numColors, 'Did not consume all data : ' + len + " : " + numColors);


    	test.done();
    }

}