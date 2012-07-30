// ----------------------------------------------- //
// SOMOut module handles the output interaction functionality
// for all SOM activity
// @author: Eric Wilkinson
// ----------------------------------------------- //

var SOM = require('./SOM');
var SOMLearning = require('./SOMLearning');
var __ = require('underscore');

// TODO: Extend this to handle errors
var EventSystem = (function(emitter) {
    var events = {};

    // Subscribe to Events with a specific name and callback function 
    emitter.addEventListener = function(event, func) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push({
            func: func
        });
        return this; // Should return the emitter object for method chaining
    }

    emitter.removeEventListener = function(event, func) {
        if (!events[event]) {
            return this;
        }
        var index = events[event].indexOf(func);
        (index === -1) ? 0 : events[event].splice(index, 1);
        return this;
    }

    emitter.emit = function(event, eventObj) {
        if (!events[event]) {
            return this;
        }
        var listeners = events[event];
        var len = listeners ? listeners.length : 0;

        while (len--) {
            listeners[len].func(eventObj);
        }

        return this;
    };
});

var EventManager = {};
EventSystem(EventManager);

/**
 * Tells whether or not an epoch listener has been attached so we aren't constructing 
 * events needlessly 
 * {boolean}
 */
var isEpochListener = false;

/**
 * Event listener which fires after each epoch
 * @param {function} func Callback function
 */

function addEpochListener(func) {
    EventManager.addEventListener('onEpoch', func);
    isEpochListener = true;
}

/**
 * Event listener which fires when SOM has finished training
 * @param {function} func Callback function
 */

function addFinishListener(func) {
    EventManager.addEventListener('onFinish', func);
}

/**
 * Emits an onEpoch event
 * @emit {EpochEvent}
 */

function emitEpochEvent() {
    if(!isEpochListener) return;

    var outNodes = convertNodesToOutput(SOM.getLINSOM(), SOM.getFeatures());
    var epochEvent = {
        nodes: outNodes,
        dimensions: SOM.dimensions,
        epochs: SOM.getTime()
    }
    EventManager.emit('onEpoch', epochEvent);
}

/**
 * Emits an inFinish event
 * @emit {FinishEvent}
 */

function emitFinishEvent() {
    var outNodes = convertNodesToOutput(SOM.getLINSOM(), SOM.getFeatures());
    var finishEvent = {
        nodes: outNodes,
        epochs: SOM.getTime(),
        dimensions: SOM.dimensions,
        similarityMap: SOMLearning.mapSimilarity()
    }
    EventManager.emit('onFinish', finishEvent);
}

/**
 * Converts the internal nodes array to the output original given by the training data
 * @param {Array.<Nodes>} Nodes The internal nodes array
 * @param {Array.<string>} features The feature names originally given by the training data
 */

function convertNodesToOutput(Nodes, features) {
    var out = __(Nodes).map(function(n) {
        return n.toOutput(features);
    });
    return dimensionalize(SOM.dimensions, out);
}

/**
 * Returns an array of given dimensions from a one dimensional array
 * @param {Array.<number>} dm The dimensions desired
 * @param {Array} input The array to dimensionalize
 * @return {Array} out And array of arrays with content from provided array
 */

function dimensionalize(dm, input) {
    if (__(dm).reduce(function(a, b) {
        return a * b;
    }) !== input.length) throw new Error('Dimensions do not match');

    if (dm.length === 1) return input;

    var a = [];
    if (dm.length === 2) {
        for (var i = 0; i < dm[0]; i++) {
            a[i] = [];
            for (var j = 0; j < dm[1]; j++) {
                a[i].push(input[(dm[1] * i + j)]);
            }
        }
        return a;
    }

    if (dm.length === 3) {
        for (var i = 0; i < dm[0]; i++) {
            a[i] = [];
            for (var j = 0; j < dm[1]; j++) {
                a[i][j] = [];
                for (var k = 0; k < dm[2]; k++) {
                    a[i][j].push(input[(dm[1] * i + dm[2] * j + k)]);
                }
            }
        }
        return a;
    }
}

/**
 * Stringifies the SOM to JSON
 * @return {string} JSON
 */

function toJSON() {
	var json = {};
    json.nodes = convertNodesToOutput(SOM.getLINSOM(), SOM.getFeatures());
    json.dimensions = SOM.dimensions;
    json.epochs = SOM.getTime();
    return JSON.stringify(json);
}

module.exports = {
    addEpochListener: addEpochListener,
    addFinishListener: addFinishListener,
    emitEpochEvent: emitEpochEvent,
    emitFinishEvent: emitFinishEvent,
    toJSON: toJSON 
}
