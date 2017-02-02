const cluster = require('cluster');
const num_processes = require('os').cpus().length;
//const stickySession = require('sticky-session');
const net = require('net');

if (cluster.isMaster) {
    
    var workers = [];

    // Helper function for spawning worker at index 'i'.
    var spawn = function(i) {
        workers[i] = cluster.fork();

        // Optional: Restart worker on exit
        workers[i].on('exit', function(code, signal) {
            console.log('respawning worker', i);
            spawn(i);
        });
    };

    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    // Helper function for getting a worker index based on IP address.
    // This is a hot path so it should be really fast. The way it works
    // is by converting the IP address to a number by removing non numeric
    // characters, then compressing it to the number of slots we have.
    //
    // Compared against "real" hashing (from the sticky-session code) and
    // "real" IP number conversion, this function is on par in terms of
    // worker index distribution only much faster.
    var worker_index = function(ip, len) {
        var s = '';
        for (var i = 0, _len = ip.length; i < _len; i++) {
            if (!isNaN(ip[i])) {
                s += ip[i];
            }
        }

        return Number(s) % len;
    };

    // Create the outside facing server listening on our port.
    var server = net.createServer({ pauseOnConnect: true }, function(connection) {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        //console.dir(connection);
        var worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    }).listen(3000);

} else {
    const server = require('./http')
    server.listen(0, function(){
        console.log('listening on *:3000');
    });
       // Listen to messages sent from the master. Ignore everything else.
    process.on('message', function(message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }

        // Emulate a connection event on the server by emitting the
        // event with the connection the master sent us.
        server.emit('connection', connection);

        connection.resume();
    });
}
