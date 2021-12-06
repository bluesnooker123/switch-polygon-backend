// Entry Point of the API Server

const express = require('express');
const http = require("http");
var cors = require("cors");
const socketIo = require("socket.io");

/* Creates an Express application.
The express() function is a top-level
function exported by the express module.
*/
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(cors());

/* To handle the HTTP Methods Body Parser
is used, Generally used to extract the
entire body portion of an incoming
request stream and exposes it on req.body
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

const index = require("./routes/index");
app.use(index);

io.on('connection', (socket) => {
    try{
        socket.on('listenEvent', function (message) {
            console.log('socket.Id: ' + socket.id);
            console.log(message);

            const Web3 = require('web3');
            const NODE_URL = "wss://speedy-nodes-nyc.moralis.io/4d4d3f866566390af4c30378/polygon/mumbai/ws";    
            const web3 = new Web3(NODE_URL);
        
            const CONTRACT_ABI = require('./LootBox_ABI.json');
            const CONTRACT_ADDRESS = "0xE761ecECb8BC319B82550814fb00712E967B578c";  //address of LootBox
            const revenueContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            
            let options = {
                filter: {
                    value: [],
                },
                fromBlock: 0
            };
            
            revenueContract.events.WeaponMinted(options)
                .on('data', event => {
                    if(event.returnValues.transactionId === message.transactionId.toString()){
                        console.log("--------------------------------");
                        console.log(event.returnValues);
                        console.log("--------------------------------");
                        socket.emit('listeningEvent', event.returnValues);
                    }
                        
                })
                .on('changed', changed => console.log(changed))
                .on('error', err => err)
                .on('connected', str => {
                    // console.log("connected => subscription id: " + str);
                })
        
            revenueContract.events.BYOPillMinted(options)
                .on('data', event => {
                    if(event.returnValues.transactionId === message.transactionId.toString()){
                        console.log("--------------------------------");
                        console.log(event.returnValues);
                        console.log("--------------------------------");
                        socket.emit('listeningEvent', event.returnValues);
                    }
                        
                })
                .on('changed', changed => console.log(changed))
                .on('error', err => err)
                .on('connected', str => {
                    // console.log("connected => subscription id: " + str);
                })
            revenueContract.events.MysterItemMinted(options)
                .on('data', event => {
                    if(event.returnValues.transactionId === message.transactionId.toString()){
                        console.log("--------------------------------");
                        console.log(event.returnValues);
                        console.log("--------------------------------");
                        socket.emit('listeningEvent', event.returnValues);
                    }
                        
                })
                .on('changed', changed => console.log(changed))
                .on('error', err => err)
                .on('connected', str => {
                    // console.log("connected => subscription id: " + str);
                })
        });
    }catch(ex)
    {
        console.log(ex);
    }
});


server.listen(3333, function () {
	let host = server.address().address
	let port = server.address().port
	console.log("Starting the Server at the port 3333");
})
