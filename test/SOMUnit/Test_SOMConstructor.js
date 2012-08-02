var ai = require('../../lib/SOM/SOMConstructor');
var ColorData = require('../../lib/Data/ColorData');

module.exports = {
    setUp: function(callback) {
        this.SOM = new ai.SOM();
        callback();
    },

    tearDown: function(callback) {
        callback();
    },

    testSOMSquare: function(test) {
        var numColors = 7;
        var numNodes = 500;
        var colorType = 'color';
        var root = this;

        console.log('Number of Colors : ' + numColors);
        console.log('Nodes : ' + numNodes);
        console.log('Color Type: ' + colorType);

        var data = ColorData.generate(numColors, colorType);
        var count = 0;

        root.SOM.addEpochListener(function(EpochEvent) {
            test.notEqual(EpochEvent, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.nodes, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.dimensions, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.epochs, undefined, 'Epoch event is undefined');
            count++;
        });

        root.SOM.addFinishListener(function(FinishEvent) {
            //console.log(FinishEvent);
            test.notEqual(count, 0, 'Never fired epoch events');

            test.notEqual(FinishEvent, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.nodes, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.dimensions, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.epochs, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.similarityMap, undefined, 'Finish event is undefined');

            console.log('Dimensions: ' + FinishEvent.dimensions);
            console.log('Epochs : ' + FinishEvent.epochs);

            var end = new Date().getTime();
            console.log('Complete : ' + (end - start) + ' ms');

            var result = root.SOM.run(data);
            test.equals(result.length, numColors, 'Did not return a result for every piece of data');

        })
        root.SOM.config({
            nodes: numNodes,
            radialDecay: 'exponential',
            lr: 0.8
        });

        var start = new Date().getTime();
        root.SOM.train(data);

        test.done();
    },

    testSOMCube: function(test) {
        var numColors = 7;
        var numNodes = 500;
        var colorType = 'color';
        var root = this;

        console.log('Number of Colors : ' + numColors);
        console.log('Nodes : ' + numNodes);
        console.log('Color Type: ' + colorType);

        var data = ColorData.generate(numColors, colorType);
        var count = 0;

        root.SOM.addEpochListener(function(EpochEvent) {
            test.notEqual(EpochEvent, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.nodes, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.dimensions, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.epochs, undefined, 'Epoch event is undefined');
            count++;
        });

        root.SOM.addFinishListener(function(FinishEvent) {
            //console.log(FinishEvent);
            test.notEqual(count, 0, 'Never fired epoch events');

            test.notEqual(FinishEvent, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.nodes, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.dimensions, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.epochs, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.similarityMap, undefined, 'Finish event is undefined');

            console.log('Dimensions: ' + FinishEvent.dimensions);
            console.log('Epochs : ' + FinishEvent.epochs);

            var end = new Date().getTime();
            console.log('Complete : ' + (end - start) + ' ms');

            var result = root.SOM.run(data);
            test.equals(result.length, numColors, 'Did not return a result for every piece of data');

        })
        root.SOM.config({
            nodes: numNodes,
            radialDecay: 'exponential',
            geoType: 'cube',
            lr: 0.8
        });

        var start = new Date().getTime();
        root.SOM.train(data);

        test.done();
    },

    testSOMLine: function(test) {
        var numColors = 7;
        var numNodes = 500;
        var colorType = 'color';
        var root = this;

        console.log('Number of Colors : ' + numColors);
        console.log('Nodes : ' + numNodes);
        console.log('Color Type: ' + colorType);

        var data = ColorData.generate(numColors, colorType);
        var count = 0;

        root.SOM.addEpochListener(function(EpochEvent) {
            test.notEqual(EpochEvent, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.nodes, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.dimensions, undefined, 'Epoch event is undefined');
            test.notEqual(EpochEvent.epochs, undefined, 'Epoch event is undefined');
            count++;
        });

        root.SOM.addFinishListener(function(FinishEvent) {
            //console.log(FinishEvent);
            test.notEqual(count, 0, 'Never fired epoch events');

            test.notEqual(FinishEvent, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.nodes, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.dimensions, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.epochs, undefined, 'Finish event is undefined');
            test.notEqual(FinishEvent.similarityMap, undefined, 'Finish event is undefined');

            console.log('Dimensions: ' + FinishEvent.dimensions);
            console.log('Epochs : ' + FinishEvent.epochs);

            var end = new Date().getTime();
            console.log('Complete : ' + (end - start) + ' ms');

            var result = root.SOM.run(data);
            test.equals(result.length, numColors, 'Did not return a result for every piece of data');

        })
        root.SOM.config({
            nodes: numNodes,
            radialDecay: 'linear',
            geoType: 'line',
            lr: 0.8
        });

        var start = new Date().getTime();
        root.SOM.train(data);

        test.done();
    }

}
