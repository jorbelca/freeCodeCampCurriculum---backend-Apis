// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req,res) => { 
  const {date}= req.params
    //console.log('A',/[0-9]/.test(date))
  
   if(!date){
  const date = Date.now()
  const json = new Date(date).toJSON()
  const UTC = new Date(json).toUTCString()
   res.json({unix: date,
           utc:UTC});
  }else if(!/[0-9]/.test(date)){
    res.json({error:'Invalid Date'});
  }else if(!/\D/.test(date)){
  const UTC = new Date(+date).toUTCString()
  res.json({unix: +date,
           utc:UTC });
  } else{
  const unix = Date.parse(new Date(date))
  const json = new Date(date).toJSON()
  const UTC = new Date(json).toUTCString()

  res.json({unix: unix,
           utc:UTC })
  }
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
