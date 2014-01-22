// This is a Controller mixin to add methods for generating Swagger data.

// __Dependencies__
var BaucisPropertyFilter = require('mongoose-schema/BaucisPropertyFilter');
var GformSchemaGenerator = require('mongoose-schema').GformSchemaGenerator;

// __Private Members__


// __Module Definition__
var BaucisSchemaGenerator = module.exports = function (controller) {
    this.propertyFilter = new BaucisPropertyFilter(controller);
};

BaucisSchemaGenerator.prototype = new GformSchemaGenerator();


