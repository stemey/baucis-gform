// This is a Controller mixin to add methods for generating Swagger data.

// __Dependencies__
var BaucisPropertyFilter = require('mongoose-schema/BaucisPropertyFilter');
var BaucisRefHelper = require('./BaucisRefHelper');
var GformSchemaGenerator = require('mongoose-schema').GformSchemaGenerator;

// __Private Members__


// __Module Definition__
var BaucisSchemaGenerator = module.exports = function (model, models, basePath, schemaBasePath) {
    this.propertyFilter = new BaucisPropertyFilter(model);
    this.model=model;
	this.models=models;
    this.refHelper = new BaucisRefHelper(models, basePath);
};

BaucisSchemaGenerator.prototype = new GformSchemaGenerator();


// A method used to generate a Swagger model definition for a controller
BaucisSchemaGenerator.prototype.generateModelDefinition = function () {
    var definition = {};
    var schema = this.model.schema;

    var definition = this.generate(schema);

    definition.id = this.capitalize(this.model.singular());

    return definition;
};





