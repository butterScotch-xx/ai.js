// ----------------------------------------------- //
// Learning module which handles all learning capabilities
// and constants
// @author: Eric Wilkinson
// ----------------------------------------------- //

var SOM = require('./SOM');
var __ = require('underscore');

/**
 * @enum
 */
var decayFuncs = {
    exponential: exponentialDecay
}

/**
 * Initial learning rate
 * {number}
 */
var iLR = 0.5;

/**
 * Learning rate
 * {number}
 */
var LR;

/**
 * The time constant for the learning equations
 * {number}
 */
var timeConst = 100.0;

/**
 * The comparison function between input vector and nodes
 * {string}
 */
var VCF = 'euclidean';

/**
 * The decay function for learning rate
 * {string}
 */
var LRF = 'exponential';

/**
 * The function which updates weights
 * {string}
 */
var WUF = 'standard';

/**
 * Configures constants used for geometry.
 * @options {Object} options The configuration options
 */

function config(options) {
    LR = iLR = options.learningRate || iLR;
    timeConst = options.timeConst || timeConst;
    VCF = options.vectorComparison || VCF;
    LRF = options.learningDecay || LRF;
    WUF = options.weightsUpdate || WUF;
}

/**
 * Sets the map radius according to the decay specified
 * @param {number} time The current time step
 * @param {string} decayFunc The decay function specified
 * @return {number} LR The new learning rate
 */

function shrinkLearningRate(time, decayFunc) {
    if (!decayFuncs[decayFunc]) throw new Error('Decay function not found');
    return LR = decayFuncs[decayFunc](time);
}

// ---------------- DECAY FUNCTIONS ----------------- //
/** 
 * Decays time exponentially 
 * @param {number} time The current time step
 * @return {number} the decay due to time
 */

function exponentialDecay(time) {
    return iLR * Math.exp(-time / timeConst);
}

/** 
 * Decays according to distance
 * @param {number} dist The distance between nodes
 * @param {number} radius Twice the radius of the MapRadius for that time step
 * @return {number} distCoef The decay due to distance
 */

function distanceDecay(dist, diameter) {
    return Math.exp(-(dist * dist) / (2 * diameter * diameter))
}

/** 
 * Returns the best matching node and value
 * @param {Array<number>} vector Input feature vector from the data
 * @param {string} compareFunc Compare function type avaliable in SOMNode.js
 * @return {Object} BMU Returns an object of form {node: , value: , index: }
 */

function findBMU(vector, compareFunc) {
    var index = 0;
    return SOM.getLINSOM().reduce(function(best, node) {
        var sim = node.similarity(vector, compareFunc);

        if (index === 0) {
            node = (sim < best.similarity(vector, compareFunc)) ? node : best;
            return {
                node: node,
                match: sim,
                index: (node === best) ? index++ : ++index //stupid but sexy
            };
        }

        index++;
        return (sim < best.match) ? {
            node: node,
            match: sim,
            index: index
        } : best;
    });
}

/**
 * Returns an array of all nodes in radius and their distances
 * @param {Node} originNode The center node to search around
 * @param {number} radius The radial distance to search
 * @return {Array.<{node : Node, distance: number}>} The array of nodes within the distance
 */

function nodesInRadius(originNode, radius) {
    return __(SOM.getLINSOM()).map(makeObject).filter(function(n) {
        n.distance = originNode.distance(n.node);
        return n.distance < radius;
    });
}

/**
 * Converts the array of nodes into objects
 * @param {Node} n The node from SOM
 * @return {Object{node: Node}}
 */

function makeObject(n) {
    return {
        node: n
    }
}

/**
 * Calculates the inputObj which accompanies the filter to the updateWeights method
 * @param radius The map radius
 * @param {Array.<{node : Node, distance : number}>} filter A list of nodes and their distances from the BMU
 * @returns {Object} ip The weight update input parameters
 */

function weightUpdateParameters(filter, radius) {
    if (WUF === 'standard') {
        return __(filter).map(function(e) {
            return {
                distanceDecay: distanceDecay(e.distance, radius * 2)
            };
        })
    }
}

/**
 * Update weights of all nodes in radius
 * @param {Array.<number>} vector The input vector
 * @param {Array.<{node : Node, distance : number}>} filter A list of nodes and their distances from the BMU
 * @param {Object} ip The input parameters required for the current WUF
 */

function updateWeights(vector, filter, ip) {
    filter.forEach(function(e, index) {
        e.node.update(vector, LR, ip[index], WUF);
    });
}


/** 
 * Returns the best matching node and value
 * @param {Array<number>} vector Input feature vector from the data
 * @param {number} radius The mapRadius for the current epoch
 * @return {Object} BMU Returns an object of form {node: , value: , index: }
 */

function learn(vector, radius) {
    shrinkLearningRate(SOM.getTime(), LRF);

    var BMU = findBMU(vector, VCF);
    var filter = nodesInRadius(BMU.node, radius);
    var ip = weightUpdateParameters(filter, radius);
    updateWeights(vector, filter, ip);
    return BMU;
}

/**
 * Finds the best matching unit in the SOM and returns the node, the location, and the match
 * @return {Object} The return object (should return BMU node location, node itself, and similarity w/ node)
 */

function run(vector) {
    var BMU = findBMU(vector, VCF);
    BMU.node = {
        weights: BMU.node.getWeights(),
        pos: BMU.node.getPosition()
    }
    if (SOM.dimensions.length === 1) {
        return BMU;
    }
    if (SOM.dimensions.length === 2) {
        var dim1 = Math.floor(BMU.index / SOM.dimensions[1]);
        var dim2 = BMU.index - dim1 * SOM.dimensions[1];
        BMU.index = [dim1, dim2];
        return BMU;
    }
    if (SOM.dimensions.length === 3) {
        var dim1 = Math.floor(BMU.index / (SOM.dimensions[2] * SOM.dimensions[1]));
        var dim2 = Math.floor((BMU.index - dim1 * SOM.dimensions[2] * SOM.dimensions[1]) / SOM.dimensions[1]);
        var dim3 = BMU.index - dim1 * SOM.dimensions[2] * SOM.dimensions[1] - dim2 * SOM.dimensions[1];
        BMU.index = [dim1, dim2, dim3];
        return BMU;
    }
}

/**
 * Returns a similarity map containing the average difference between each node to its neighbors.
 * @returns {Array} similarityMap
 */

function mapSimilarity() {
    var dms = SOM.dimensions;
    var mapSim = [];
    var i, j, neighbors;
    var som = SOM.getSOM();
    if (dms.length === 1) {
        for (var i = 0; i < dms[0]; i++) {
            neighbors = [];
            if (som[i + 1]) {
                neighbors.push(som[i].similarity(som[i + 1].getWeights(), 'euclidean'));
            }
            if (som[i - 1]) {
                neighbors.push(som[i].similarity(som[i - 1].getWeights(), 'euclidean'));
            }
            mapSim[i] = neighbors.reduce(function(a, b) {
                return a + b;
            }) / neighbors.length;
        }
    }
    if (dms.length === 2) {
        for (var i = 0; i < dms[0]; i++) {
            mapSim[i] = [];
            for (var j = 0; j < dms[1]; j++) {
                neighbors = [];

                if (som[i + 1]) {
                    neighbors.push(som[i][j].similarity(som[i + 1][j].getWeights(), 'euclidean'));
                }
                if (som[i - 1]) {
                    neighbors.push(som[i][j].similarity(som[i - 1][j].getWeights(), 'euclidean'));
                }
                if (som[i][j + 1]) {
                    neighbors.push(som[i][j].similarity(som[i][j + 1].getWeights(), 'euclidean'));
                }
                if (som[i][j - 1]) {
                    neighbors.push(som[i][j].similarity(som[i][j - 1].getWeights(), 'euclidean'));
                }

                mapSim[i][j] = neighbors.reduce(function(a, b) {
                    return a + b;
                }) / neighbors.length;
            }
        }
    }
    if (dms.length === 3) {
        for (var i = 0; i < dms[0]; i++) {
            mapSim[i] = [];
            for (var j = 0; j < dms[1]; j++) {
                mapSim[i][j] = [];
                for(var k = 0; k < dms[2]; k++){
                neighbors = [];

                if (som[i + 1]) {
                    if(som[i+1][j+1]) neighbors.push(som[i][j][k].similarity(som[i + 1][j+1][k].getWeights(), 'euclidean'));
                    if(som[i+1][j-1]) neighbors.push(som[i][j][k].similarity(som[i + 1][j-1][k].getWeights(), 'euclidean'));
                }
                if (som[i - 1]) {
                    if(som[i-1][j+1]) neighbors.push(som[i][j][k].similarity(som[i - 1][j+1][k].getWeights(), 'euclidean'));
                    if(som[i-1][j-1]) neighbors.push(som[i][j][k].similarity(som[i - 1][j-1][k].getWeights(), 'euclidean'));
                }
                if (som[i][j][k+1]) {
                    neighbors.push(som[i][j][k].similarity(som[i][j][k+1].getWeights(), 'euclidean'));
                }
                if (som[i][j][k-1]) {
                    neighbors.push(som[i][j][k].similarity(som[i][j][k-1].getWeights(), 'euclidean'));
                }

                mapSim[i][j] = neighbors.reduce(function(a, b) {
                    return a + b;
                }) / neighbors.length;
                }
                
            }
        }
    }
    return mapSim;
}

// Public Methods
module.exports = {
    config: config,
    learn: learn,
    mapSimilarity: mapSimilarity,
    run: run
}
