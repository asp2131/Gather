/* global describe, context, before, beforeEach, afterEach, it */
/* eslint-disable no-unused-expressions */

// these are LIVE TESTS that deal with the actual database!
// as such, they are subject to some unpredictable behavior
// if the testing username actually becomes taken, the tests will fail to function
const request = require('supertest');
const session = require('supertest-session');
const chai = require('chai');
const app = require('../server/server');
const db = require('../server/models');

const { expect } = chai;
let testSession = null;

beforeEach(() => {
  testSession = session(app);
});

const newUser = {
  username: 'abcdefg123',
  password: 'hellothisispassword',
};

describe('signup', () => {

  let authenticatedSession;

  beforeEach((done) => {
    testSession.post('/signup')
      .send(newUser)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }
        authenticatedSession = testSession;
        return done();
      });
  });

  afterEach((done) => {
    db.User.destroy({ username: newUser.username })
      .then(done);
  });

  it('should store a new user in the db with a hashed password', (done) => {
    db.User.findOne({ username: newUser.username })
      .then(foundUser => foundUser.checkPassword(newUser.password, foundUser.password))
      .then((isValidPass) => {
        expect(isValidPass).to.be.true;
        done();
      })
      .catch(err => done(err));
  });

  it('should redirect a user to /signup if their username is already taken', (done) => {
    request(app)
      .post('/signup')
      .send(newUser)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Location', '/signup')
      .end(done);
  });
  it('should assign a session object to the new user on signup', (done) => {

  });
});

context('sessions', () => {

});
