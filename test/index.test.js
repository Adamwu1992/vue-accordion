const chai = require('chai');
const should = chai.should();

describe('it is a test', function() {
    it('should return true', function() {
        '1'.should.be.a('string');
    })
})