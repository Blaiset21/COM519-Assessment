const mongoose = require("mongoose");
const { Schema } = mongoose;

const armySchema = new Schema(
  {
    name: {type: String, required: [true, 'Army name is Required'], minlength: [3, 'Army name is too short, it must be 3 chars long']},
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Username",
    },
    faction: {type: String},
    points: {type: Number, required: [true, 'points value is Required'], min: [500, 'Armies cannot be smaller than 500 points']},
    wins:{type: Number, default: 0},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Army", armySchema);
