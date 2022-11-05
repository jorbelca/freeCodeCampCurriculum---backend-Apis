const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { Users, Exercises } = require('./schema.js')


app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// FUNCTION TO CLEAN THE DB !!! ONLY FOR TESTING PURPOSES
async function clean() {
  await Users.deleteMany()
  await Exercises.deleteMany()
}

try {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  clean()
} catch (e) {
  console.error(e)
}


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// GET ALL USERS
app.get('/api/users', (req, res) => {
  Users.find({}, '_id, username').then(users => {
    res.send(users)
  })

})

// GET LOGS OF USER

app.get('/api/users/:_id/logs:from?:to?:limit?', (req, res) => {
  const { _id } = req.params
  const { from, to, limit } = req.query

  Users.findById(_id).then(user => {
    if (!user) throw new Error('Unknown user with _id');
    Exercises.find({ userId: _id })
      .limit(+limit).exec()
      .then(log => res.status(200).send({
        _id,
        username: user.username,
        count: log.length,
        log: log.map(o => ({
          description: o.description,
          duration: o.duration,
          date: o.date.toDateString()
        }))
      }))
  })
    .catch(err => {
      console.log(err);
      res.status(500).send(err.message);
    })
})




// POST NEW USER
app.post('/api/users', function (req, res) {
  const { username } = req.body
  if (username === '') {
    return res.json({ error: 'username is required' });
  }

  try {
    Users.findOne({ username }).then(user => {
      if (user) {
        throw new Error('username already taken');

      } else {
        Users.create({ username }).then(user => res.json({
          username: user.username,
          _id: user._id
        }))
      }
    })

  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }

});




// POST NEW EXERCISE
app.post('/api/users/:_id/exercises', (req, res) => {
  let { description, duration, date } = req.body;
  const { _id } = req.params

  duration = +duration

  if (date && date.length > 1) date = new Date(date).toDateString()
  if (!date || date == '') { date = new Date().toDateString() }

  Users.findOne({ _id }).then(user => {
    if (!user) throw new Error('Unknown user');

    return Exercises.create({
      description, duration, date, userId: user._id
    })
      .then(ex => res.status(200).send({
        username: user.username,
        description, duration,
        _id: user._id,
        date
      }))
  })
    .catch(err => {
      console.log(err);
      res.status(500).send(err.message);
    })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
