var baucis = require('baucis');

var meta = {controllers: []};

var releaseDecorator = function (options) {

	meta.controllers.push(options);
}
baucis.Controller.decorators(releaseDecorator);

module.exports = meta;
