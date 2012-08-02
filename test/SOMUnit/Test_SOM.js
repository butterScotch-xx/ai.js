var SOM = require('../../lib/SOM/SOM');

module.exports = {
    setUp: function(callback) {
        callback();
    },

    tearDown: function(callback) {
        callback();
    },

    testSOM : function(test) {
        test.equals(0,SOM.getTime(),'SOM did not start out at time 0');
        
        SOM.stepTime();
        test.equals(1,SOM.getTime(), 'SOM did not step time properly: ' + SOM.getTime());

        test.ok(!SOM.isDead(),'SOM is dead when it should be alive');
        SOM.kill();
        test.ok(SOM.isDead(),'SOM is alive when it should be dead');
        SOM.resurrect();
        test.ok(!SOM.isDead(),'SOM is still dead after resurrection');
        test.ok(!SOM.getTime(),'SOM did not reset time after resurrection');

    	test.done();
    }

}