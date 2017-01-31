const app     = require('express')();
const request = require('supertest');
const ioc     = require('socket.io-client');

require('chai').should();

describe('Socket.io chat example', function () {

    it('should connect to server', function(done) {
        ioc('ws://localhost:3000')
        .on('connected', function (msg) {
            done();    
        })
    })

    it('should create 5 connection', function(done) {
        
    })
})