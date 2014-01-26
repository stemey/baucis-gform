// This is a Controller mixin to add methods for generating Swagger data.


// __Module Definition__
var RefUtils = module.exports = function (basePath, schemaBasePath) {
    this.basePath = basePath;
    this.schemaBasePath = schemaBasePath;
};

RefUtils.prototype.getResourceUrl = function (controller) {
    return this.basePath + "/" + controller.get('plural') ;
}

RefUtils.prototype.getSchemaUrl = function (controller) {
    return this.schemaBasePath + "/" + controller.get('plural');
}

