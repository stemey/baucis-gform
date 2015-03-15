var url = require('url');
var BaucisSchemaGenerator = require('./BaucisSchemaGenerator');
var RefUtils = require('./RefUtils');
var baucis = require('baucis');
var meta = require('./meta');
var mongoose = require('mongoose');


var Gform = function (conf) {
	this.conf = conf || {};
	this.basePath = conf.basePath || "."
	this.gformPath = conf.gformPath || "/gform"
	this.refUtils = new RefUtils(this.basePath, this.basePath + this.gformPath);
	this.controllers = meta.controllers;

}

Gform.prototype._getBase = function (request, extra) {
	var parts = request.originalUrl.split('/');
	// Remove extra path parts.
	parts.splice(-extra, extra);
	return request.protocol + '://' + request.headers.host + parts.join('/');
};


Gform.prototype.start = function (app) {

	var resources = [];
	var models = [];
	this.controllers.forEach(function(key) {
		var model = mongoose.models[key];
		models.push(model);
		var resource = {};
		resource.schemaUrl = this.refUtils.getSchemaUrl(model);
		resource.resourceUrl = this.refUtils.getResourceUrl(model);
		resource.collectionUrl = this.refUtils.getResourceUrl(model);
		resource.name = model.singular();
		resources.push(resource);
	}, this);

	var me = this;

	// Activate Swagger resource listing.
	app.get(this.basePath + this.gformPath, function (request, response, next) {
		response.set('X-Powered-By', 'Baucis');
		response.json({
			version: this.release,
			resources: resources,
			basePath: me._getBase(request, 1) + "/"
		});
	});

	this.controllers.forEach(function(key) {
		var model = mongoose.models[key];
		var route = url.resolve('/', model.plural());
		var controller = {};
		var GeneratorClass = controller.gformGeneratorClass || this.conf.GeneratorClass || BaucisSchemaGenerator;
		var generator = controller.gformGenerator || this.conf.generator || new GeneratorClass(model, models, this.refUtils);
		var generatorProps = controller.gformGeneratorProps || this.conf.generatorProps;
		if (generatorProps) {
			Object.keys(generatorProps).forEach(function (key) {
				generator[key] = generatorProps[key];
			})
		}

		var resource = generator.generateModelDefinition();
		var gformResource = resource;

		app.get(this.basePath + this.gformPath + route, function (request, response, next) {
			response.set('X-Powered-By', 'Baucis');
			response.json(gformResource);
		});
	}, this);


};


module.exports = Gform;
