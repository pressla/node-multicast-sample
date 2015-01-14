//sub2.js

var Emitter		= require('events').EventEmitter;
var Message 	= require('amp-message');
var dgram 		= require('dgram');
var sub 		= dgram.createSocket('udp4');
var multicastID = '230.1.1.200';
var targetPort	= 61088;
var Relay		= new Emitter();

sub.bind(targetPort, function() {
	sub.addMembership(multicastID);		//listen to this group
});

sub.on('listening', function () {
    var address = sub.address();
    console.log('UDP sub listening on ' + address.address + ":" + address.port);
});

sub.on('message', function (buf, rinfo) {   
  	var msg = new Message(buf);
  	msg.args.unshift('message');
  	msg.args.push(rinfo);
  	//console.log(msg.args);
  	Relay.emit(msg.args[1], msg.args);	//Fire the event for each command

});


//here are the commands executed:

Relay.on('switch', function(msg) {
    console.log('From: ' + msg[4].address + ':' + msg[4].port +' - ' + 'switch '+msg[2]+':'+msg[3]);

});

Relay.on('query', function(msg) {
    console.log('From: ' + msg[4].address + ':' + msg[4].port +' - ' + 'query '+msg[2]+':'+msg[3]);
    if (msg[2] == 'G1') {
    	send('query','G1', msg[3], ['G2','G4','G7'], msg[4]);
    }
});
    
function send () {
  var args = [].slice.call(arguments);
  var fn = typeof args[args.length - 1] == 'function' ? args.pop() : null;
  var port = args[4].port;
  var address = args[4].address;
  var msg = new Message(args);
  var buf = msg.toBuffer();
  console.log(msg);
  sub.send(buf, 0, buf.length, port, address, fn);
};