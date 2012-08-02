// ----------------------------------------------- //
// Node module which interfaces all incomming data
// and combines their functionality.
// @author: Eric Wilkinson
// ----------------------------------------------- //

var SOM = require('./SOM');
var SOMData = require('./SOMData');
var SOMLearning = require('./SOMLearning');
var SOMGeo = require('./SOMGeo');
var SOMOut = require('./SOMOut');

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
 * Whether the SOM has at least initialized
 * {boolean}
 */
var hasInit = false;

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

    hasInit = true;
    if (immediate === false) return;

    var runCount = 0;
    while (!SOM.isDead() && ++runCount < maxEpochs) {

        var radius = SOMGeo.calcRadius(SOM.getTime());
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
            var radius = SOMGeo.calcRadius(SOM.getTime());
            SOMLearning.learn(SOMData.next(), radius);

            SOM.stepTime();

            SOM.isDead() ? SOMOut.emitFinishEvent() : SOMOut.emitEpochEvent();
        }
    }

    return !SOM.isDead();
}

/**
 * Throw as RunEvent on completion
 * @param {Array<Array>|Array<Object>} input The input vector. Can be array of arrays or of feature objects
 * @return {Array<Object>} output An array of BMU for each input vector along with supplimentary information
 */

function run(input) {
    if (!hasInit) throw new Error('Must train SOM before running');
    SOMData.consume(input);
    var output = [];
    var len = SOMData.getDataLength();
    for (var i = 0; i < len; i++) {
        output.push(SOMLearning.run(SOMData.nextLinear()));
    }
    return output;    
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

// Public Methods
module.exports = {
    train: train,
    stepTrain: stepTrain,
    config: config,
    loadMap: loadJSONMap,
    run : run
}
