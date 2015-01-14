var commands = [
	'switch',
	'query',
	'set',
	'set_group',
	'set_scene',
	'init'

];

var Message 	= require('amp-message');
var dgram 		= require('dgram'); 
var pub 		= dgram.createSocket("udp4"); 
var multicastID = '230.1.1.200';
var targetPort	= 61088;

pub.bind(12344,function() {			//useless, but I need to set the number of hops to maxx
	pub.setMulticastTTL(255);
});

pub.on('message', function (buf, rinfo) {   
  	var msg = new Message(buf);
  	msg.args.unshift('message');
  	msg.args.push(rinfo);
  	console.log('Query received :'+msg.args);
  	
});






setInterval(function(){
	var r = Math.floor(Math.random()*commands.length);
	var b = Math.floor(Math.random()*100);
	send(commands[r], 'G'+r.toString(), b);	
    console.log("Sent " + commands[r] + " to the wire...");
}, 10);


function send () {
  var args = [].slice.call(arguments);
  var fn = typeof args[args.length - 1] == 'function' ? args.pop() : null;

  var msg = new Message(args);
  var buf = msg.toBuffer();
  console.log(msg);
  pub.send(buf, 0, buf.length, targetPort, multicastID, fn);
};

