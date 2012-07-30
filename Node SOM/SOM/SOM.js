// ----------------------------------------------- //
// SOM Module which contains the most base information
// to be shared with the other modules
// @author: Eric Wilkinson
// ----------------------------------------------- //

var __ = require('underscore');
/**
 * The SOM
 * {Array}
 */
var SOM = [];

/**
 * One dimensional internal representation of the SOM
 * {Array<Node>}
 */
var _SOM = [];

/**
 * The dimension of the SOM
 * {number}
 */
var SOMdims = [0];

/**
 * The current epoch
 * {number}
 */
var epoch = 0;

/**
 * The activity state of the SOM
 * {boolean}
 */
var dead = 0;

/**
 * If provided, the names features of the data
 * {Array<string>|Array<number>}
 */
var features = [];

function getSOM() {
    return SOM;
}

function setSOM(som) {
    SOM = som;
    _SOM = __.flatten(SOM);
}

function getLIN() {
    return _SOM
}

/**
 * Retrieves a node based off any geometry supplied
 * @returns {Node} node 
 */

function getNode(location) {
    var node;
    if (Array.isArray(location)) arguments = location;
    if (arguments.length) {
        node = SOM[arguments[0]] || _SOM[arguments[0]];
        for (var i = 1; i < arguments.length; i++) {
            node = node[arguments[i]];
        }
    } else {
        throw Error('Inproper location input');
    }
    return node;
}

function stepTime() {
    epoch++;
}

function getTime() {
    return epoch;
}

function getFeatures() {
    return features;
}

function setFeatures(fs) {
    features = fs;
}

/**
 * Tells if SOM is considers itself finished
 * return {boolean}
 */

function isDead() {
    return dead;
}

/**
 * Kills the SOM
 */

function kill() {
    dead = 1;
}

/**
 * Restarts the SOM
 */

function resurrect() {
    epoch = 0;
    dead = 0;
}

module.exports = {
    getSOM: getSOM,
    setSOM: setSOM,
    getLINSOM: getLIN,
    dimensions: SOMdims,
    getNode: getNode,
    stepTime: stepTime,
    getTime: getTime,
    getFeatures: getFeatures,
    setFeatures: setFeatures,
    isDead: isDead,
    kill: kill,
    resurrect: resurrect
}
