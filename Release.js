// __Dependencies__
var url = require('url');
var BaucisSchemaGenerator = require('./BaucisSchemaGenerator');
var RefUtils = require('./RefUtils');

var conf = require('./conf');

// __Private Module Members__

// Figure out the basePath for Swagger API definition
function getBase(request, extra) {
    var parts = request.originalUrl.split('/');
    // Remove extra path parts.
    parts.splice(-extra, extra);
    return request.protocol + '://' + request.headers.host + parts.join('/');
};

var refUtils = new RefUtils(".", "./gform");


// A method for generating a Swagger resource listing
function generateGformListing(options) {
    var resources = [];
    options.controllers.forEach(function (controller) {
        var resource = {};
        resource.idProperty = "_id";
        resource.resourceUrl = refUtils.getResourceUrl(controller);
        resource.schemaUrl = refUtils.getSchemaUrl(controller);
    });
    var listing = {
        basePath: options.basePath,
        resources: resource
    };

    return listing;
}

// __Module Definition__
var decorator = module.exports = function (options) {
    var release = this;

    var resources = [];
    options.controllers.forEach(function (controller) {
        var route = url.resolve('/', controller.get('plural'));
        var resource = {};
        resource.schemaUrl = refUtils.getSchemaUrl(controller);
        resource.resourceUrl = refUtils.getResourceUrl(controller);
        resource.collectionUrl = refUtils.getResourceUrl(controller);
        resource.name = controller.get('singular');
        resources.push(resource);
    });

    // Activate Swagger resource listing.
    release.get('/gform', function (request, response, next) {
        response.set('X-Powered-By', 'Baucis');
        response.json({
            version: options.release,
            resources: resources,
            basePath: getBase(request, 1) + "/"
        });
    });

    // Add routes for the controller's Swagger API definitions.
    options.controllers.forEach(function (controller) {
        var route = url.resolve('/', controller.get('plural'));

        var GeneratorClass = controller.gformGeneratorClass || conf.GeneratorClass || BaucisSchemaGenerator;
        var generator = controller.gformGenerator || conf.generator || new GeneratorClass(controller, options.controllers, refUtils);
        var generatorProps = controller.gformGeneratorProps || conf.generatorProps;
        if (generatorProps) {
            Object.keys(generatorProps).forEach(function (key) {
                generator[key] = generatorProps[key];
            })
        }

        var resource = generator.generateModelDefinition();
        controller.gformResource = resource;

        release.get('/gform' + route, function (request, response, next) {
            response.set('X-Powered-By', 'Baucis');
            response.json(controller.gformResource);
        });
    });

    return release;
};
