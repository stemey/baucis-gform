var expect = require('expect.js');
var request = require('request');
var baucis = require('baucis');

var fixtures = require('./fixtures');

describe('Swagger Resource Listing', function () {
  before(fixtures.vegetable.init);
  beforeEach(fixtures.vegetable.create);
  after(fixtures.vegetable.deinit);

  it('should not generate a listing by default', function (done) {
    var controller = baucis.rest('vegetable');
    var app = baucis();

    expect(app.routes.get).to.be(undefined);
    done();
  });

  it('should generate the correct listing', function (done) {
    var options = {
      url: 'http://127.0.0.1:8012/api/gform',
      json: true
    };
    request.get(options, function (err, response, body) {
      if (err) return done(err);

      expect(response).to.have.property('statusCode', 200);
      expect(body).to.have.property('basePath', 'http://127.0.0.1:8012/api/');
      expect(body).to.have.property('resources');

      // Check the API listing
      expect(body.resources).to.be.an(Array);
      expect(body.resources).to.have.property('length', 2);
      expect(body.resources[0].schemaUrl).to.be('./gform/vegetables');
      expect(body.resources[0].resourceUrl).to.be('./vegetables/');
      expect(body.resources[1].schemaUrl).to.be('./gform/fungi');
      expect(body.resources[1].resourceUrl).to.be('./fungi/');


      done();
    });
  });

  it('should generate the correct API definition', function (done) {
    var options = {
      url: 'http://127.0.0.1:8012/api/gform/vegetables',
      json: true
    };
    request.get(options, function (err, response, body) {
      if (err) return done(err);

      expect(response).to.have.property('statusCode', 200);
      expect(body).to.have.property('id', 'Vegetable');

      var ref = body.attributes[1];
      expect(ref).to.have.property('url', './fungi');
      expect(ref).to.have.property('schemaUrl', './gform/fungi');
      expect(ref).to.have.property('idProperty', '_id');


      done();
    });
  });



});
