// ----------------------------------------------- //
// Module which generates random and linear color sets
// @author: Eric Wilkinson
// ----------------------------------------------- //

/**
 * Enum for generate types
 * @enum {string}
 */

var genTypes = {
    RANDOM: "random",
    GRADIENT: "gradient"
};

/**
 * Enum for color types
 * @enum {string}
 */

var colorTypes = {
    GRAYSCALE: 'grayscale',
    COLOR: 'color'
}

/**
 * Checks to see if provided generate type is a defined type
 * @param {string} type 
 * @return {boolean}
 */

function isGenType(type) {
    for (var i in genTypes) {
        if (genTypes[i] === type) return true;
    }
    return false;
}

/**
 * Checks to see if provided color type is a defined color type
 * @param {string} colorType 
 * @return {boolean}
 */

function isColorType(colorType) {
    for (var i in colorTypes) {
        if (colorTypes[i] === colorType) return true;
    }
    return false;
}

/**
 * Generates a RGB data set of type, colortype, and number provided
 * @param {number} num  Number of points in the dataset
 * @param {string=} type From GENTYPES enum. Defaults to RANDOM  
 * @param {string=} colorType From COLORTYPES enum. Defaults to COLOR
 */

function generate(num, colorType, type) {
    if (typeof num !== 'number') throw new Error('Must input how many data points to generate');
    if (colorType && !isColorType(colorType)) throw new Error('Incorrect color type')
    if (type && !isGenType(type)) throw new Error('Incorrect type');

    if (!colorType) colorType = colorTypes.COLOR;
    if (!type) type = genTypes.RANDOM;

    if (!colorType || colorType === colorTypes.COLOR) {
        return generateColorData(type, num);
    }

    if (colorType === colorTypes.GRAYSCALE) {
        return generateGrayData(type, num);
    }
}

/**
 * Generates a data set of gray points
 * @param {string} type
 * @param {number} num 
 */

function generateGrayData(type, num) {
    var data = [];
    var grayValue;
    if (type === genTypes.RANDOM) {
        for (var i = 0; i < num; i++) {
            grayValue = Math.random();
            data.push(new RGB(grayValue, grayValue, grayValue));
        }
        return data;
    }

    if (type === genTypes.GRADIENT) {
        for (var i = 0; i < num; i++) {
            grayValue = i / num;
            data.push(new RGB(grayValue, grayValue, grayValue));
        }
        return data;
    }
}

/**
 * Generates a data set of gray points
 * @param {string} type
 * @param {number} num 
 */

function generateColorData(type, num) {
    var data = [];
    if (type === genTypes.RANDOM) {
        for (var i = 0; i < num; i++) {
            data.push(new RGB(Math.random(), Math.random(), Math.random()));
        }
        return data;
    }

    if (type === genTypes.GRADIENT) {
        for (var i = 0; i < num; i++) {
            colorValue = i / num;
            data.push(new RGB(0.5, colorValue, colorValue));
        }
        return data;
    }
}

/**
 * A RGB constructor
 * @constructor
 */

function RGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

function dummySOM(num) {
    var data = generate(num*num);
    var dummy = [];
    for (var i = 0; i < num; i++) {
        dummy[i] = [];
        for (var j = 0; j < num; j++) {
            dummy[i][j] = data[i * num + j];
        }
    }
    return dummy;
}

//Public Methods
module.exports = {
    GENTYPES: genTypes,
    COLORTYPES: colorTypes,
    generate: generate,
    dummySOM: dummySOM
}
