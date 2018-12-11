var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
chai.use(chaiHttp);
var agent = chai.request.agent(server);

var User = require('../models/user');

it('should return 401 if user not registered', (done) => {
    agent
        .post('/login', { email: "fake@nope.com", password: "no" })
        .end((err, res) => {
            res.status.should.be.equal(401);
            done();
        });

});

// signup
it('should be able to signup', (done) => {
    User.findOneAndRemove({ username: "testone" }, () => {
        agent
            .post('/signup')
            .send({ username: "testone", password: "password" })
            .end((err, res) => {
                console.log(res.body)
                res.should.have.status(200);
                res.should.have.cookie("nToken");
                done();
            });
    });
})

it('should be able to logout', (done) => {
    agent
        .get('/logout')
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.not.have.cookie("nToken");
            done();
        });
});

// login
it('should be able to login', (done) => {
    agent
        .post('/login')
        .send({ email: "username", password: "password" })
        .end((err, res) => {
            res.should.have.status(200);
            res.should.have.cookie("nToken");
            done();
        });
});