import { expect } from 'chai';
import * as validate from '../public/js/validate-input.mjs';

describe('Testing the checkUsername function', function() {
    it('returns isValid as true for username with length from 8 to 19, false otherwise', function(done) {
        expect(validate.checkUsername('12345678').isValid).to.equal(true);
        expect(validate.checkUsername('123456').isValid).to.equal(false);
        expect(validate.checkUsername('12345678901234567890').isValid).to.equal(false);
        expect(validate.checkUsername('validUsername').isValid).to.equal(true);
        done();
    });
});

describe('Testing the checkEmail function', function() {
    it('returns isValid as true for valid email, false otherwise', function(done) {
        expect(validate.checkEmail('example@gmail.com').isValid).to.equal(true);
        expect(validate.checkEmail('example@gmail').isValid).to.equal(false);
        expect(validate.checkEmail('example@nyu.edu').isValid).to.equal(true);
        expect(validate.checkEmail('a@@gmail.com').isValid).to.equal(false);
        done();
    });
});

describe('Testing the checkPassword function', function() {
    it('returns isValid as true for valid password, false otherwise', function(done) {
        expect(validate.checkPassword('abcde').isValid).to.equal(false);
        expect(validate.checkPassword('Abcde!123').isValid).to.equal(true);
        expect(validate.checkPassword('Abcde+123').isValid).to.equal(false);
        expect(validate.checkPassword('Abc1!').isValid).to.equal(false);
        done();
    });
});

describe('Testing the checkTitle function', function() {
    it('returns isValid as true for valid title, false otherwise', function(done) {
        expect(validate.checkTitle('a').isValid).to.equal(false);
        expect(validate.checkTitle('Title').isValid).to.equal(true);
        const longTitle = 'LooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooongTitle';
        expect(validate.checkTitle(longTitle).isValid).to.equal(false);
        done();
    });
});

describe('Testing the checkCategory function', function() {
    it('returns isValid as true for valid category, false otherwise', function(done) {
        expect(validate.checkCategory().isValid).to.equal(false);
        expect(validate.checkCategory('someCategory').isValid).to.equal(true);
        done();
    });
});

describe('Testing the checkPrice function', function() {
    it('returns isValid as true for valid price, false otherwise', function(done) {
        expect(validate.checkPrice('abcde').isValid).to.equal(false);
        expect(validate.checkPrice('-123').isValid).to.equal(false);
        expect(validate.checkPrice('123').isValid).to.equal(true);
        expect(validate.checkPrice('9999999999999').isValid).to.equal(false);
        done();
    });
});

describe('Testing the checkDescription function', function() {
    it('returns isValid as true for valid description, false otherwise', function(done) {
        expect(validate.checkDescription('').isValid).to.equal(false);
        expect(validate.checkDescription('asdfdfds').isValid).to.equal(false);
        expect(validate.checkDescription('adskfjklasj dkasjfdlkfsjkl lkadsjfladjskf lkdsajflkdjf dlka').isValid).to.equal(true);
        done();
    });
});