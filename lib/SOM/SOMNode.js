// ----------------------------------------------- //
// Node module which contains the node constructor
// @author: Eric Wilkinson
// ----------------------------------------------- //

/**
 * List of comparison functions 
 * TODO: Add more comparison funciton. Pearson score
 * @enum {string}
 */
var CompareFunctions = {
    euclidean: euclideanDistance
}

/**
 * List of functions which update wieghts
 * TODO: Add more weight updating functions
 * @enum {string}
 */
var UpdateFunctions = {
    standard: standardUpdate
}

/**
 * Node object for SOM
 * @param {Array} position The position of the node in N space
 * @param {number} numFeatures The number of features represented
 * @constructor
 */

function Node(position, numFeatures) {
    if (!Array.isArray(position) || position.length ===0 || typeof numFeatures !== 'number') throw new Error('Incorrect node constructor input');

    var weights = [];
    for (var i = 0; i < numFeatures; i++) {
        weights.push(Math.random());
    }
    this.getPosition = function() {
        return position;
    }

    /**
     * Returns the distance between this node an another's position
     * @param {Object} n The input node
     * @return {number} distance The distance between nodes
     */
    this.distance = function(n) {
        var pos = n.getPosition();
        var sum = 0;
        pos.forEach(function(e, i){
            sum += (e - position[i])*(e - position[i]);
        });
        return Math.sqrt(sum);
    }

    /**
     * Returns the similarity between feature vectors to be interpreted based on the compareFunc
     * TODO: Make sure to type check all options before they get here
     * @param {Array.<number>} inputs The input vector
     * @param {string=} compareFunc Which comparison function to use. Defaults to euclidean
     * @return {number} similarity The similarity between vectors according to comparison function
     */
    this.similarity = function(inputs, compareFunc) {
        var func = CompareFunctions[compareFunc];
        if (!func){
            func = CompareFunctions.euclidean;
            compareFunc && console.error('Compare function not found. Defaulted to euclidean');
        } 
        return func(weights, inputs);
    }

    /**
     * Converts the node into a feature object
     * @param {Array.<string>} features If supplied, fhe stored understanding of features
     * @return {Array.<number>|Object} The weights in output form
     */
    this.toOutput = function(features) {
        if (typeof features[0] === 'number') return weights;

        var output = {};
        features.forEach(function(feature, i) {
            output[feature] = weights[i];
        });
        return output;
    }

    /**
     * Updates the nodes weights
     * TODO: Make sure to type check all options before they get here
     * @param {Array.<number>} vector The input vector
     * @param {number} LR The learning rate
     * @param {Object} ip An object containing all input parameters for the specificed update func
     * @param {string} updateFunc The name of the update function
     */
    this.update = function(vector, LR, ip, updateFunc) {
        UpdateFunctions[updateFunc](vector, LR, weights, ip);
    }

    /**
     * Returns the weights for the node.
     * @return {Array.<number>} weights
     */
    this.getWeights = function() {
        return weights;
    }
}

/**
 * Standard update using distance and time decay functions
 * @param {Array.<number>} v The input vector
 * @param {Array.<number>} ws The weight array
 * @param {{distanceDecay: number}} ip The input object
 */

function standardUpdate(v, LR, ws, ip) {
    ws.forEach(function(w, i, ws) {
        ws[i] = w + ip.distanceDecay * LR * (v[i] - w);
        if(ws[i]<0) ws[i] = 0;
        if(ws[i]>1) ws[i] = 1;
    });
}

/**
 * Calculates the Euclidean Distance between the weights and the input vector
 * Low scores are high similarity
 * @param {Array.<number>} weights The node weights vector
 * @param {Array.<number>} input The input vector
 */

function euclideanDistance(weights, input) {
    if (!Array.isArray(input)) throw new Error('Input must be of type array');
    if (input.length !== weights.length) throw new Error('Feature lengths do not match');

    var sum = 0;
    weights.forEach(function(e, i, arr) {
        sum += (e - input[i]) * (e - input[i]);
    })
    return Math.sqrt(sum);
}

// Public Constructor
module.exports = Node;
