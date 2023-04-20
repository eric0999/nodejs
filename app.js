const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/',(req, res) => {
	res.render('index')
})

server = app.listen(process.env.PORT || 5000)
let connections = [];
const io = require("socket.io")(server,{
	cors: {
		origin: '*',
	}
	})
io.on('connection',  (socket) => {
	let userConnected = socket.handshake.query.user;
	let userIdConnected = socket.handshake.query.userId;
    connections.push(socket.handshake);
	console.log(`user connected : ${userConnected} `);
	socket.on(`req`, (callback)=>{
		console.log('sharepoint')
		callback = typeof callback == "function" ? callback : () => {};
		socket.broadcast.emit(`request_data`, {user:userConnected, userId:userIdConnected})
	})
	socket.on('send_data', (data)=>{
		console.log(data)
		socket.broadcast.emit(`send`, {data:data})
	})

	socket.on(`dashboard_req`, (callback)=>{
		console.log('sharepoint')
		callback = typeof callback == "function" ? callback : () => {};
		socket.broadcast.emit(`dashboard_data`, {user:userConnected, userId:userIdConnected})
	})

	socket.on('send_data_to_dashboard', (data)=>{
		console.log(data)
		socket.broadcast.emit(`send_to_dashboard`, {data:data})
	})
	
})