var WebSocket = function(io,socket) {
	socket.on('comment', function(msgObj){
		//console.log(msgObj);
		io.emit('messages', msgObj);//To all including self
		//socket.broadcast.emit('messages',msgObj);//To all excluding self
	});
	socket.on('disconnect', function(){
		console.log('User disconnected');
	});
	socket.on('taskedit',function(userObj){
		io.emit('messages', userObj);
	});
};
module.exports = WebSocket;