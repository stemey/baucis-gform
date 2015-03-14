var url = require('url');
var BaucisSchemaGenerator = require('./BaucisSchemaGenerator');
var RefUtils = require('./RefUtils');
var baucis = require('baucis');
var meta = require('./meta');


var Gform = function (conf) {
	this.conf = conf || {};
	this.basePath = conf.basePath || "."
	this.gformPath = conf.gformPath || "/gform"
	this.refUtils = new RefUtils(this.basePath, this.basePath + this.gformPath);

}

Gform.prototype.getBase = function (request, extra) {
	var parts = request.originalUrl.split('/');
	// Remove extra path parts.
	parts.splice(-extra, extra);
	return request.protocol + '://' + request.headers.host + parts.join('/');
};


Gform.prototype.start = function (app) {

	this.controllers = meta.controllers;
	var release = this;

	var resources = [];
	this.controllers.forEach(function (controller) {
		var route = url.resolve('/', controller.get('plural'));
		var resource = {};
		resource.schemaUrl = this.refUtils.getSchemaUrl(controller);
		resource.resourceUrl = this.refUtils.getResourceUrl(controller);
		resource.collectionUrl = this.refUtils.getResourceUrl(controller);
		resource.name = controller.get('singular');
		resources.push(resource);
	}, this);

	var me = this;

	// Activate Swagger resource listing.
	app.get(this.basePath + this.gformPath, function (request, response, next) {
		response.set('X-Powered-By', 'Baucis');
		response.json({
			version: this.release,
			resources: resources,
			basePath: me.getBase(request, 1) + "/"
		});
	});

	// Add routes for the controller's Swagger API definitions.
	this.controllers.forEach(function (controller) {
		var route = url.resolve('/', controller.get('plural'));

		var GeneratorClass = controller.gformGeneratorClass || this.conf.GeneratorClass || BaucisSchemaGenerator;
		var generator = controller.gformGenerator || this.conf.generator || new GeneratorClass(controller, this.controllers, this.refUtils);
		var generatorProps = controller.gformGeneratorProps || this.conf.generatorProps;
		if (generatorProps) {
			Object.keys(generatorProps).forEach(function (key) {
				generator[key] = generatorProps[key];
			})
		}

		var resource = generator.generateModelDefinition();
		controller.gformResource = resource;

		app.get(this.basePath + this.gformPath + route, function (request, response, next) {
			response.set('X-Powered-By', 'Baucis');
			response.json(controller.gformResource);
		});
	}, this);

	return release;
};


module.exports = Gform;
