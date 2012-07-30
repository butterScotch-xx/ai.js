// ----------------------------------------------- //
// Data module which handles the importing of data
// and input data retrieval for SOM
// @author: Eric Wilkinson
// ----------------------------------------------- //

var SOM = require('./SOM');	
/**
 * The internal representation of the data
 * {Array<Array>}
 */
var SOMdata = [];

/**
 * The index of the last vector returned
 * {number}
 */
var currentIndex = -1;

/**
 * {number}
 */
var dataLength;

/**
 * Imports the data into this module which can then be accessed by SOM.js
 * @param {Array<Array>|Array<Object>} data The input data. Can be array of arrays or of feature objects
 * @return {number} featureLength The length of the feature vector
 */
function consume(data) {
    return scrub(data);
}

/**
 * Type checks the data and keeps try of the feature names
 * @param {Array<Array>|Array<Object>} data The input data. Can be array of arrays or of feature objects
 */
function scrub(data) {
    if (!Array.isArray(data)) throw new Error('Data must be of type array');

    var features = [];

    if (Array.isArray(data[0])){
        data[0].forEach(function(e,i){features.push(i)});
        SOM.setFeatures(features);
        return features.length;
    } 

    // Store the feature names
    for (var feature in data[0]) {
        features.push(feature);
    }

    // Put each feature vector into SOMdata as an array
    data.forEach(function(vector, index) {
        SOMdata[index] = [];
        features.forEach(function(feature, j) {
            SOMdata[index].push(vector[feature]);
        });
    });

    dataLength = SOMdata.length;
    SOM.setFeatures(features);

    return features.length;
}

/**
 * Returns the next element in SOMdata. If at the end of the data set, it returns to the begining
 * @return {Array<number>} vector
 */
function nextLinear() {
	currentIndex++;
	if(currentIndex === dataLength) currentIndex -= dataLength;
	return SOMdata[currentIndex];
}

/** 
 * The default next operation returns a random vector from the data store
 * @return {Array<number>} vector
 */
function next() {
	return SOMdata[Math.floor(Math.random()*dataLength)];
}

//Public Methods
module.exports = {
	consume : consume,
	nextLinear : nextLinear,
	next : next,
}
