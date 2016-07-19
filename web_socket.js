var WebSocket = function(io,socket) {
	socket.on('disconnect', function(){
		//console.log('User disconnected');
	});
	socket.on('taskedit',function(userObj){
		io.emit('messages', userObj);
	});
};
module.exports = WebSocket;