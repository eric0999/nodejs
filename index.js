const express = require('express')
const app = express()
let tempData = [];
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/',(req, res) => {
	res.render('index')
})

app.get("/api/inv", (req, res) => {
	res.send(tempData);
  });

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
	// socket.on(`req`, (callback)=>{
	// 	callback = typeof callback == "function" ? callback : () => {};
	// 	socket.broadcast.emit(`request_data`, {user:userConnected, userId:userIdConnected})
	// })
	socket.on('updateLineItem',(data)=>{
		socket.broadcast.emit(`postLineItem`,{
			Amount:data.Amount,
            CostCredit:data.CostCredit,
            DocNum:data.DocNum_,
            ID:data.ID,
            Id:data.Id,
		})
	})
	socket.on('updateLineItemData',(data)=>{
		socket.broadcast.emit(`postLineItemData`,{
			Amount:data.Amount,
            CostCredit:data.CostCredit,
            DocNum:data.DocNum_,
            ID:data.ID,
            Id:data.Id,
		})
	})

	socket.on(`req`, (msg, callback)=>{
		socket.broadcast.emit(`user_enter`, {user:userConnected, userId:userIdConnected})
		console.log('sharepoint',msg);
		if(tempData.length > 0){
			callback(tempData);
		}else{
			socket.broadcast.emit(`request_data`,{user:userConnected, userId:userIdConnected});
		}
		})
	
	socket.on('connectToCloud', (data)=>{
		tempData = []
	})
	socket.on('checkConnection', (msg, callback)=>{
		console.log(msg)
		callback('connected to cloud')
	})
	socket.on('send_data', (data)=>{
		tempData.push(data)
	})

	socket.on('openItem', (data)=>{
		socket.broadcast.emit(`userOpenItem`, {user:data.user, DocNum:data.docNum})
	})


	socket.on(`dashboard_req`, (data)=>{
		console.log('sharepoint')
		console.log(data.daterange)
		socket.broadcast.emit(`dashboard_data`, {user:userConnected, userId:userIdConnected, daterange:data.daterange})
	})

	socket.on('send_data_to_dashboard', (data)=>{
		//console.log(data)
		socket.broadcast.emit(`send_to_dashboard`, {data:data})
	})
	
})