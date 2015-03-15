// This is a Controller mixin to add methods for generating Swagger data.


// __Module Definition__
var RefUtils = module.exports = function (basePath, schemaBasePath) {
    this.basePath = basePath;
    this.schemaBasePath = schemaBasePath;
};

RefUtils.prototype.getResourceUrl = function (model) {
    return this.basePath + "/" + model.plural() +"/";
}

RefUtils.prototype.getSchemaUrl = function (model) {
    return this.schemaBasePath + "/" + model.plural();
}

