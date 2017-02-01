const app     = require('express')();
const request = require('supertest');
const ioc     = require('socket.io-client');

require('chai').should();

// Create new client
const client = function () {

}

describe('Socket.io chat example', function () {

    it('should connect to server', function(done) {
        ioc('ws://localhost:3000')
        .on('connected', function (msg) {
            console.log(msg);
            done();    
        })
    })

    it('should create 5 connection', function(done) {
        
        done();
    })
})