// This is a Controller mixin to add methods for generating Swagger data.


// __Module Definition__
var BaucisRefHelper = module.exports = function (controllers, refUtils) {
    this.controllers = controllers;
    this.refUtils = refUtils;
};

BaucisRefHelper.prototype.getResourceUrl= function(controller) {

}

BaucisRefHelper.prototype.update = function (attribute, schemaId) {
    var refControllers = this.controllers.filter(function (c) {
        return c.get('singular') == schemaId;
    });
    if (refControllers.length != 1) {
        //throw new Error("cannot find unique controller for reference " + schemaId);
    } else {
        var controller = refControllers[0];
        attribute.url = this.refUtils.getResourceUrl(controller);
        attribute.schemaUrl = this.refUtils.getSchemaUrl(controller);
    }
}

