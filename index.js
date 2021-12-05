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

app.post('/getTransactionID', function(req, res){
    console.log(req.body);
    pool.query(`
        CREATE TABLE IF NOT EXISTS polygonTable (
            id int PRIMARY KEY,
            wallet VARCHAR NOT NULL
        );
    `).then(rtn=>{
        //console.log(rtn)
        pool.query(`
            SELECT COUNT(*) FROM polygonTable
        `)
        .then(count => {
            id = Number(count.rows[0].count)+1;
            str = `INSERT INTO polygonTable (id,wallet) VALUES (`+id+`,'`+req.body.account+`');`;
            console.log(str);
            pool.query(str)
            .then(rtn => {
                //console.log(rtn);
                res.send(rtn.rows);
            })
        })

    });

})

app.post('/confirm', function(req, res){
    console.log("------------------------------------------");
    console.log(req.body);

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
            if(event.returnValues.transactionId === '1')
                console.log(event);
        })
        .on('changed', changed => console.log(changed))
        .on('error', err => err)
        .on('connected', str => {
            // console.log("connected => subscription id: " + str);
        })

    // revenueContract.events.BYOPillMinted(options)
    //     .on('data', event => console.log(event))
    //     .on('changed', changed => console.log(changed))
    //     .on('error', err => err)
    //     .on('connected', str => console.log(str))
    
    // revenueContract.events.MysterItemMinted(options)
    //     .on('data', event => console.log(event))
    //     .on('changed', changed => console.log(changed))
    //     .on('error', err => err)
    //     .on('connected', str => console.log(str))

    // pool.query('Select * from test')
	// 	.then(testData => {
	// 		console.log(testData);
	// 		res.send(testData.rows);
	// 	})

  })
  

// Require the Routes API
// Create a Server and run it on the port 3333
const server = app.listen(3333, function () {
	let host = server.address().address
	let port = server.address().port
	console.log("Starting the Server at the port 3333");
})
