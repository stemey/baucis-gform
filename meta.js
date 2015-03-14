var baucis = require('baucis');

var meta = {controllers: []};

var releaseDecorator = function (options) {

	meta.controllers = options.controllers;
}
baucis.Release.decorators(releaseDecorator);

module.exports = meta;
