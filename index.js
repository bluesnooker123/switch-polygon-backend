// Entry Point of the API Server

const express = require('express');
var cors = require("cors");

/* Creates an Express application.
The express() function is a top-level
function exported by the express module.
*/
const app = express();
const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'polygondb',
	password: 'polygontest123',
	dialect: 'postgres',
	port: 5432
});


/* To handle the HTTP Methods Body Parser
is used, Generally used to extract the
entire body portion of an incoming
request stream and exposes it on req.body
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


pool.connect((err, client, release) => {
	if (err) {
		return console.error(
			'Error acquiring client', err.stack)
	}
	client.query('SELECT NOW()', (err, result) => {
		release()
		if (err) {
			return console.error(
				'Error executing query', err.stack)
		}
		console.log("Connected to Database !")
	})
})

// app.get('/confirm', (req, res, next) => {
// 	console.log("Confirm button pressed!");
// 	// pool.query('Select * from test')
// 	// 	.then(testData => {
// 	// 		console.log(testData);
// 	// 		res.send(testData.rows);
// 	// 	})
// })

app.post('/confirm', function(req, res){
    console.log(req.body);

    const Web3 = require('web3');
    const NODE_URL = "wss://speedy-nodes-nyc.moralis.io/4d4d3f866566390af4c30378/polygon/mumbai/ws";    
    const web3 = new Web3(NODE_URL);

    const CONTRACT_ADDRESS = "0x3702f4c46785bbd947d59a2516ac1ea30f2babf2";
    const revenueContract = new web3.eth.Contract([{ "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }], CONTRACT_ADDRESS);
    
    revenueContract.methods.balanceOf("111111", 1)
    // revenueContract.methods.getRandNum4LootBox().call()
    // .then(function(){
    //   //revenueContract.methods.openLootBox()
    // })
  
    // fs.appendFile('public/OrderCheckerLog.txt', req.body.logdata + '\r\n', function (err) {
    //   if (err) 
    //     return console.log(err);
    //   response = { status : "successed" };
    //   res.end(JSON.stringify(response));
    // });
  })
  

// Require the Routes API
// Create a Server and run it on the port 3333
const server = app.listen(3333, function () {
	let host = server.address().address
	let port = server.address().port
	console.log("Starting the Server at the port 3333");
})
