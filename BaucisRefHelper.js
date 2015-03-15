// This is a Controller mixin to add methods for generating Swagger data.


// __Module Definition__
var BaucisRefHelper = module.exports = function (models, refUtils) {
	this.models = models;
	this.refUtils = refUtils;
};

BaucisRefHelper.prototype.getResourceUrl = function (controller) {

}

BaucisRefHelper.prototype.update = function (attribute, schemaId) {
	var model = this.models.filter(function(model) {
		return model.modelName==schemaId;
	})[0];
	attribute.url = this.refUtils.getResourceUrl(model);
	var conf = model.schema.options.gform;
	if (conf.labelAttribute) {
		attribute.searchProperty = model.schema.options.gform.labelAttribute;
	}
	attribute.schemaUrl = this.refUtils.getSchemaUrl(model);
}

