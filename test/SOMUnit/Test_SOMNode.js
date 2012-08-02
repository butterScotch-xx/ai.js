var Node = require('../../lib/SOM/SOMNode');

var pos1 = [2];
var pos1_ = [1];
var pos2 = [1, 1];
var pos2_ = [1, 0];
var pos3 = [0.5, 4, 1];
var pos3_ = [0.5, 3, 1];

module.exports = {
    setUp: function(callback) {
        this.Node_1 = new Node(pos1, 4);
        this.Node_2 = new Node(pos2, 3);
        this.Node_3 = new Node(pos3, 2);
        this.Node_1_ = new Node(pos1_, 4);
        this.Node_2_ = new Node(pos2_, 3);
        this.Node_3_ = new Node(pos3_, 2);
        callback();
    },

    tearDown: function(callback) {
        callback();
    },

    testSOM1: function(test) {
        var p1 = this.Node_1.getPosition();
        var p2 = this.Node_1_.getPosition();
        test.notEqual(p1[0], p2[0], "Same position value : " + p1[0] + " : " + p2[0]);
        test.equal(p1[0], pos1[0], "Position not equal to constructor position: " + p1[0]);

        var distance = this.Node_1.distance(this.Node_1_);
        test.equal(1, distance, "Distance not equal to 1 : " + distance);
        test.ok(this.Node_1.getWeights().length === 4, "Feature length incorrect");
        test.ok(this.Node_1.similarity(this.Node_1.getWeights()) === 0, "Node not similar with itself");
        test.done();
    },

    testSOM2: function(test) {
        var p1 = this.Node_2.getPosition();
        var p2 = this.Node_2_.getPosition();
        test.equal(p1[0], pos2[0], "Position not equal to constructor position: " + p1[0]);

        var distance = this.Node_2.distance(this.Node_2_);
        test.equal(1, distance, "Distance not equal to 1 : " + distance);
        test.ok(this.Node_2.getWeights().length === 3, "Feature length incorrect");
        test.ok(this.Node_2.similarity(this.Node_2.getWeights()) === 0, "Node not similar with itself");
        test.done();
    },

    testSOM3: function(test) {
        var p1 = this.Node_3.getPosition();
        var p2 = this.Node_3_.getPosition();
        test.equal(p1[0], pos3[0], "Position not equal to constructor position: " + p1[0]);

        var distance = this.Node_3.distance(this.Node_3_);
        test.equal(1, distance, "Distance not equal to 1 : " + distance);
        test.ok(this.Node_3.getWeights().length === 2, "Feature length incorrect");
        test.ok(this.Node_3.similarity(this.Node_3.getWeights()) === 0, "Node not similar with itself");
        test.done();
    },

    testUpdateWeights: function(test) {
        var oldWeights = this.Node_1.getWeights();
        var ows = [];
        oldWeights.forEach(function(e,i){
        	ows.push(e);
        })
        this.Node_1.update([0.5, 0.5, 0.5, 0.5], 0.5, {
            distanceDecay: 0.5
        }, 'standard');
        
        var newWeights = this.Node_1.getWeights();

        for (var i = 0; i < oldWeights.length; i++) {
            test.notEqual(ows[i], newWeights[i], 'Weights did not update on index : ' + i);
        }

        test.done();
    }
}
