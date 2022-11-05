const { default: mongoose, Schema } = require("mongoose");


const UsersSchema = new Schema({
  username: { type: String, unique: true, required: true }
});

const exercisesSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, min: 1, required: true },
  date: { type: Date, default: Date.now }
});



const Users = mongoose.model('ExerciseUsers', UsersSchema);

const Exercises = mongoose.model('Exercises', exercisesSchema);

module.exports = { Users, Exercises }