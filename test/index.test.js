const chai = require('chai');
const should = chai.should();

describe('test index', function() {
    it('should return true', function() {
        '1'.should.be.a('string');
    })
})