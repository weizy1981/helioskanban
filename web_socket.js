var WebSocket = function(io,socket) {
	socket.on('disconnect', function(){
		//console.log('User disconnected');
	});

	socket.on('group1', function (data) {
        socket.join('group1');
	});

	socket.on('taskedit',function(userObj){
		io.sockets.emit('messages', userObj);
	});
};
module.exports = WebSocket;