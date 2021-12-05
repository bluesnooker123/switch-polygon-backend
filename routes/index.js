const express = require("express");
let router = express.Router();
const cors = require("cors");

router.use(cors());

const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'polygondb',
	password: 'polygontest123',
	dialect: 'postgres',
	port: 5432
});

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

router.post('/getTransactionID', function(req, res){
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
                if(rtn.rowCount > 0) {  //success
                    response = { id : id };
                    res.send(JSON.stringify(response));
                }
            })
        })

    });
})


module.exports = router;