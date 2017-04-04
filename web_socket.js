var WebSocket = function(io,socket) {
	var idstore = {};
	socket.on('disconnect', function(){
		//console.log('User disconnected');
		socket.leave(idstore[socket.id].roomID);
	});

	socket.on('join', function (data) {
		// JOIN時に格納
	    idstore[socket.id] = { 'roomID': data };
        socket.join(data);
	});

	socket.on('taskedit',function(userObj){
		//console.log("runing here####################");
		io.to(userObj.current_process_id).emit('messages', userObj);
	});
};
module.exports = WebSocket;