var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import '../gravity.src.js');

console.log(Environment);

describe('Gravity.Application', function() {
  it('Gravity.Application.getConfig() should return {} if no items are passed in', function() {
    var gravity = new Gravity.Application;
    expect(gravity.getConfig()).to.equal({});
  });
});