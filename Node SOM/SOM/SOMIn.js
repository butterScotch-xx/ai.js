// ----------------------------------------------- //
// Node module exposes the other modules
// and combines their functionality.
// @author: Eric Wilkinson
// ----------------------------------------------- //

var SOM = require('./SOM');
var SOMOut = require('./SOMOut');
var SOMData = require('./SOMData');
var SOMLearning = require('./SOMLearning');
var SOMGeo = require('./SOMGeo');

/**
 * Max number of interations
 * {number}
 */
var maxEpochs = 5000;

/**
 * Number of nodes
 * {number}
 */
var numNodes;

/**
 * SOM training function. 
 * @param {Array<Array>|Array<Object>} inputData The input data. Can be array of arrays or of feature objects
 * @param {boolean=} immediate Run immediately defaults to true;
 */

function train(inputData, immediate) {
    var featureLength = SOMData.consume(inputData);
    SOMGeo.init({
        nodeCount: numNodes
    }, featureLength);

    if (SOM.isDead()) {
        SOM.resurrect()
    };

    immediate = immediate || true;
    if (!immediate) return;

    var runCount = 0;
    while (!SOM.isDead() && ++runCount < maxEpochs) {

        var radius = SOMGeo.updateRadius(SOM.getTime());
        SOMLearning.learn(SOMData.next(), radius);

        SOM.stepTime();

        SOM.isDead() ? SOMOut.emitFinishEvent() : SOMOut.emitEpochEvent();
    }

}

/**
 * Steps the training function a specified number of steps
 * @param {number=} steps The number of steps to take. Defaults to 1
 * @returns {boolean} Whether the step function can be run again
 */

function stepTrain(steps) {
    steps = steps || 1;

    for (var i = 0; i < steps; i++) {
        if (!SOM.isDead()) {
            var radius = SOMGeo.updateRadius(SOM.getTime());
            SOMLearning.learn(SOMData.next(), radius);

            SOM.stepTime();
            
            SOM.isDead() ? SOMOut.emitFinishEvent() : SOMOut.emitEpochEvent();
        }
    }

    return !SOM.isDead();
}

/**
 * Configures the SOM
 * @param {Object}
 */

function config(options) {
    if (!options.nodes) throw new Error('Must specify node count');

    numNodes = options.nodes;
    maxEpochs = options.maxEpochs || maxEpochs;
    SOMGeo.config({
        radius: options.radius,
        timeConst: options.radiusTimeConst,
        radialDecay: options.radialDecay,
        geoType: options.geoType
    });

    SOMLearning.config({
        learningRate: options.lr,
        timeConst: options.lrTimeConst,
        vectorComparison: options.comparison,
        learningDecay: options.lrDecayFunc,
        weightsUpdate: options.weightsUpdateFunc
    })
}

/**
 * Constructs the SOM from JSON
 * @param {string} JSON The JSON map
 */

function loadJSONMap(JSON) {
    if (typeof JSON !== 'string') throw new Error('Map must be JSON');
    SOMGeo.loadJSONMap(JSON, 'json');
}

function toJSON() {
    return SOMOut.toJSON();
}

// Options
// radius {number}
// distTimeConst {number}
// lr {number}
// lrTimeConst {number}
// comparison {string}
// lrDecayFunc {string}
// weightsUpdateFunc {string}

// Public Methods
module.exports = {
    train: train,
    stepTrain : stepTrain,
    config: config,
    addEpochListener: SOMOut.addEpochListener,
    addFinishListener : SOMOut.addFinishListener,
    loadMap: loadJSONMap,
    toJSON: toJSON
}
