const cluster = require('cluster');
const cpus = require('os').cpus().length;

if(cluster.isMaster) {
    
    for(let i = 0; i < cpus; ++i) {
        cluster.fork();
    }

} else {
    require('./http').listen(3000, function(){
        console.log('listening on *:3000');
    });
}
