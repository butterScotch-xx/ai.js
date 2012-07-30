var ai = require('./SOM/SOMIn');
var ColorData = require('./Data/ColorData');

var fs = require('fs');

try {
    var currentDirectory = process.argv[1];
    var numColors = parseInt(process.argv[3],10) || 7;
    var numNodes = parseInt(process.argv[2],10) || 500;
    var colorType = process.argv[4] || 'color';
    var fileName = process.argv[5] || 'stand.json';
    var dataset = process.argv[6] || 'new';

    console.log('Number of Colors : ' + numColors);
    console.log('Nodes : ' + numNodes);
    console.log('Color Type: ' + colorType);
    console.log('Save File : ' + fileName);

    var data;
    if(dataset === 'saved') {
        data = fs.readFileSync('./Saved_Maps/tempData.json');
        data = JSON.parse(data);
    } else {
        data = ColorData.generate(numColors, colorType);
    }
    var count = 0;

    // ai.addEpochListener(function(EpochEvent){
    //     //console.log(EpochEvent);
    // });

    ai.addFinishListener(function(FinishEvent){
        //console.log(FinishEvent);

        console.log('Writing file : ' + fileName);
        fs.writeFileSync('./Saved_Maps/' + fileName, JSON.stringify(FinishEvent));
        fs.writeFileSync('./Saved_Maps/tempData.json', JSON.stringify(data));

        console.log('Dimensions: ' + FinishEvent.dimensions);
        console.log('Epochs : ' + FinishEvent.epochs);

        var end = new Date().getTime();
        console.log('Complete : ' + (end-start) + ' ms' );
    })
    ai.config({
        nodes: numNodes,
        radialDecay: 'exponential',
        lr : 1
    });

    var start = new Date().getTime();
    ai.train(data);

} catch (e) {
    console.error(e.message);
    console.error(e.stack);
}
