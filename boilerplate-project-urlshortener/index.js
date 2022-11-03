require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;
let db = {}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = { all: true }

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});



app.post('/api/shorturl', function (req, res) {
  const { url } = req.body
  let length = objectLength(db)
  console.log(/http*/gm.test(url))
  if (!/http*/gm.test(url)) {
    return res.json({ error: 'invalid url' })
  }
  let hostname = String(url.match(/www.*/gm))
  hostname = hostname.split('').slice(4).join('')
  console.log(hostname)
  dns.lookup(hostname, options, (err, adress) => {
    console.log(err, adress)
    if (err) {
      res.json({ error: 'invalid url' })
    } else {
      db[length] = url
      console.log(db)
      res.json({
        original_url: url,
        short_url: length
      });
    }
  });
})

app.get('/api/shorturl/:shorturl?', function (req, res) {
  const { shorturl } = req.params

  let url = db[shorturl]
  res.redirect(url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});




const objectLength = obj => Object.entries(obj).length;