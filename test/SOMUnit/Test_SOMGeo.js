var SOMGeo = require('../../lib/SOM/SOMGeo');
var SOM = require('../../lib/SOM/SOM');


var configOptions = {geoType : 'square', radialDecay : 'exponential', timeConst : 30, radius : 0.8};
var numFeatures = 10;

var options = {nodeCount : 100};

module.exports = {
    setUp: function(callback) {
        SOMGeo.config(configOptions);
        callback();
    },

    tearDown: function(callback) {
        callback();
    },

    testSOMGeo : function(test) {

        SOMGeo.init(options, numFeatures);

        var oldRadius = SOMGeo.calcRadius(0);

        test.equals(oldRadius,configOptions.radius,'Radius not equal to set value ' + oldRadius + " : " + configOptions.radius);

        var newRadius = SOMGeo.calcRadius(10);
        test.notEqual(newRadius,oldRadius, 'Radius did not update');

        var mapSize = SOM.getLINSOM().length;
        test.equals(mapSize,options.nodeCount,'Maps size was not generated appropriately');
    	test.done();
    }

}