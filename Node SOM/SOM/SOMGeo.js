// ----------------------------------------------- //
// Data module which the creation and iterpretation 
// of the SOM geometry
// @author: Eric Wilkinson
// ----------------------------------------------- //

var SOM = require('./SOM');
var SOMNode = require('./SOMNode');

/**
 * @enum
 */
var geoInit = {
    square: initSquare
};

/**
 * @enum
 */
var decayFuncs = {
    exponential: exponentialDecay,
    linear: linearDecay
}

/**
 * The initial map radius
 * {number}
 */
var iMR = 0.5;

/**
 * The current map radius
 * {number}
 */
var MR;

/**
 * The time constant
 * {number}
 */
var timeConst = 300;

/**
 * The minimum distance between any two nodes in the SOM
 * {number}
 */
var minDistance;

/**
 * Geometry type
 * {string}
 */
var geoType = 'square';

/**
 * Decay function
 * {string}
 */
var radialDecayFunc = 'exponential'

/**
 * Initializes a new square SOM
 * @param {number} numFeatures The number of features for teach node
 * @param {{nodeCount: number}} options Options. Must contain nodeCount
 */

function init(options, numFeatures) {
    if (typeof options.nodeCount !== 'number' || typeof numFeatures !== 'number') throw new Error('Incorrect geomety input');
    if (!geoInit[geoType]) throw new Error('Unrecognized geometry type');
    var init = geoInit[geoType](options, numFeatures)
    SOM.setSOM(init.SOM);
    SOM.dimensions = init.dimensions;
}

/**
 * Configures constants used for geometry.
 * @options {radius: _, timeConst: _, geoType: _} options The configuration options
 */

function config(options) {
    MR = iMR = options.radius || iMR;
    timeConst = options.timeConst || timeConst;
    geoType = options.geoType || geoType;
    radialDecayFunc = options.radialDecay || radialDecayFunc;
}

/**
 * Sets the map radius according to the decay specified
 * @param {number} time The current time step
 * @return {number} MR The new map radius
 */

function shrinkRadius(time) {
    if (!decayFuncs[radialDecayFunc]) throw new Error('Decay function not found');

    MR = decayFuncs[radialDecayFunc](time);

    if (minDistance > MR) SOM.kill();

    return MR;
}

// ---------------- GEOMETRY INITIALIZERS ----------------- //
/**
 * Initializes a new square SOM. Distance is normalized from 0 to 1. Sets the dimension of the SOM to 2
 * Sets the min distance two be the lattice spacing
 * @param {number} numFeatures The number of features for teach node
 * @param {Object} options If supplied, any configurable options
 */

function initSquare(options, numFeatures) {
    var numSide = Math.floor(Math.sqrt(options.nodeCount));
    var normCoef = 1 / numSide;
    var som = [];
    for (var i = 0; i < numSide; i++) {
        som[i] = [];
        for (var j = 0; j < numSide; j++) {
            var _X = normCoef * i;
            var _Y = normCoef * j;
            som[i].push(new SOMNode(_X, _Y, numFeatures));
        }
    }
    minDistance = normCoef;
    return {
        SOM: som,
        dimensions: [numSide, numSide]
    };
}

/**
 * Initializes a new SOM based off JSON provided.
 * @param {number} numFeatures The number of features for teach node
 * @param {Object} options If supplied, any configurable options
 */

function initFromJSON(json) {
    if (typeof json !== 'string') throw new Error('JSON provided is not type string');

    var obj = JSON.parse(json);

    if (!Array.isArray(obj.nodes)) throw new Error('Unable to parse JSON correctly. JSON object must be array');
    if (!Array.isArray(Obj.dimensions)) throw new Error('Dimensions provided are not type array');

    var som
    SOM.setSOM(obj.SOM);
    SOM.dimensions = dimensions;

}

// ---------------- DECAY FUNCTIONS ----------------- //
/** 
 * Decays radius exponentially with time
 * @param {number} time The current time step
 * @return {number} the decay due to time
 */

function exponentialDecay(time) {
    return iMR * Math.exp(-time / timeConst);
}

/**
 * Decays radius linearly with time
 * @param {number} time The current time step
 * @return {number} the decay due to time
 */
function linearDecay(time) {
    return 1 - (time/(0.5*timeConst));
}


// Public Methods
module.exports = {
    init: init,
    loadJSONMap : initFromJSON,
    config: config,
    updateRadius: shrinkRadius,
}
