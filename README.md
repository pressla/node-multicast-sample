# node-multicast-sample

Sample code
The sample code below is a proof of concept for the socket based protocol.
The publisher is sending out random commands @100Hz
The Subscriber is listening on the group ip 230.1.1.200
and replys on the 'query' command only on group 1

The protocol frame is binary, and packed by the AMP framegrabber before sending, and upon recieve it is unpacked The frame has a version inside the protocol frame and can carry string and binary data
remember the maximal length is the MTU size, which is typically 1500 bytes on all routers !

the publisher and subscriber can be started on the same machine, and many more machines are for the subscriber. 
