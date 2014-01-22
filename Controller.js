// This is a Controller mixin to add methods for generating Swagger data.

// __Dependencies__
var mongoose = require('mongoose');
var BaucisSchemaGenerator = require('./BaucisSchemaGenerator');

// __Private Members__

// A method for capitalizing the first letter of a string
function capitalize(s) {
    if (!s) return s;
    if (s.length === 1) return s.toUpperCase();
    return s[0].toUpperCase() + s.substring(1);
}


// __Module Definition__
var decorator = module.exports = function () {
    var controller = this;

    // __Private Instance Members__
    var generator = new BaucisSchemaGenerator(controller);


    // A method used to generate a Swagger model definition for a controller
     function generateModelDefinition() {
        var definition = {};
        var schema = controller.get('schema');

        var definition = generator.generate(schema);

        definition.id = capitalize(controller.get('singular'));

        return definition;
    };





    // A method used to generate a Swagger API definition for the controller
    function generateGformRestDefinition() {
        var modelName = capitalize(controller.get('singular'));

        var resource = { };

        // Model
        resource.name = modelName;
        resource.schema = generateModelDefinition();

        // Instance route
        resource.url = '/' + controller.get('plural') + '/{id}';
        resource.collectionUrl = '/' + controller.get('plural');



        return resource;
    };

    controller.gformResource = generateGformRestDefinition();


    return controller;
};
