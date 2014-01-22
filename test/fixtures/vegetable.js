// __Dependencies__
var mongoose = require('mongoose');
var express = require('express');
var async = require('async');
var baucis = require('baucis');
var config = require('./config');
var plugin = require('../..');

// __Private Module Members__
var app;
var server;

// __Module Definition__
var fixture = module.exports = {
  init: function(done) {
    var Schema = mongoose.Schema;

    mongoose.connect(config.mongo.url);

    var Vegetable = new Schema({
      name: { type: String, required: true },
      diseases: { type: [ String ], select: false },
      species: { type: String, default: 'n/a', select: false },
      related: { type: Schema.ObjectId, ref: 'vegetable' }
    });

    var Fungus = new Schema({ 'hyphenated-field-name': String });
    var Stuffing = new Schema({ bread: Boolean });
    var Goose = new Schema({ cooked: Boolean, stuffed: [Stuffing] });

    if (!mongoose.models['vegetable']) mongoose.model('vegetable', Vegetable);
    if (!mongoose.models['fungus']) mongoose.model('fungus', Fungus);
    if (!mongoose.models['goose']) mongoose.model('goose', Goose);

    fixture.controller = baucis.rest({
      singular: 'vegetable',
      relations: true,
      'allow hints': true,
      'allow comments': true
    });

    baucis.rest({
      singular: 'fungus',
      plural: 'fungi',
      select: '-hyphenated-field-name'
    });

    baucis.rest({
      singular: 'goose',
      plural: 'geese'
    });

    app = express();
    app.use('/api', baucis());

    app.use(function (error, request, response, next) {
      if (error) return response.send(500, error.toString());
      next();
    });

    server = app.listen(8012);

    done();
  },
  deinit: function(done) {
    server.close();
    mongoose.disconnect();
    done();
  },
  create: function (done) {
    var Vegetable = mongoose.model('vegetable');
    var vegetableNames = [ 'Turnip', 'Spinach', 'Pea', 'Shitake', 'Lima Bean', 'Carrot', 'Zucchini', 'Radicchio' ];
    var vegetables = vegetableNames.map(function (name) {
      return new Vegetable({ name: name });
    });
    var deferred = [
      Vegetable.remove.bind(Vegetable)
    ];

    deferred = deferred.concat(vegetables.map(function (vegetable) {
      return vegetable.save.bind(vegetable);
    }));

    async.series(deferred, done);
  }
};
