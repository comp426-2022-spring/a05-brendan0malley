// Place your server entry point code here
//Require Minimist
const args = require('minimist')(process.argv.slice(2))

//Require Express
var express = require("express")
var app = express()

//Require fs
const fs = require('fs')

//Require morgan
const morgan = require('morgan')

//Require database file
const db = require('./database.js')

//Express use parser
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Make port
const port = args.port || args.p || 5555

//Start up server
const server = app.listen(port, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",port))
});

app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

if (args.log == 'false') {
    console.log("NOTICE: not creating file access.log")
}else{
    const accessLog = fs.createWriteStream('access.log', { flags: 'a'})
    app.use(morgan('combined', {stream: accessLog}))
}

// Create help text
const help = (`
server.js [options]
--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help, -h	Return this message and exit.
`)
// If --help, echo help text and exit
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}

// Log to database
app.use((req, res, next) => {
    let logData = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referrer: req.headers['referer'],
        useragent: req.headers['user-agent']
    };
    console.log(logData)
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logData.remoteaddr, logData.remoteuser, logData.time, logData.method, logData.url, logData.protocol, logData.httpversion, logData.status, logData.referrer, logData.useragent)
    next();
})

if (args.debug || args.d) {
    app.get('/app/log/access/', (req, res, next) => {
        const stmt = db.prepare("SELECT * FROM accesslog").all();
	    res.status(200).json(stmt);
    })

    app.get('/app/error/', (req, res, next) => {
        throw new Error('Error test works.')
    })
}

//Coin Functions
function coinFlip() {
    return(Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
  }
  
function coinFlips(flips) {
    let array = [];
    for (var i = 0; i < flips; i++){
      let flip = coinFlip();
      array[i] = flip;
    }
    return array;
  }

function countFlips(array) {
    let h_count = 0;
    let t_count = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i] == 'heads') {
        h_count ++;
      } else if (array[i] == 'tails') {
        t_count ++;
      }
    }
    if (h_count == 0) {
      return {"tails": t_count};
    }
    else if (t_count == 0) {
      return {"heads": h_count};
    }
    return {"heads": h_count, "tails": t_count};
  }
  
function flipACoin(call) {
    let c_flip = coinFlip();
    let final_result = "";
    if (c_flip = call){
      final_result = "win";
    }else if(c_flip != call){
      final_result = "lose";
    }
    return {"call": call, "flip": c_flip, "result": final_result};
  }

