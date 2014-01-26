// __Dependencies__
var baucis = require('baucis');
var deco = require('deco');
var decorators = deco.require(__dirname, [  'Release' ]).hash;

baucis.Release.decorators(decorators.Release);
