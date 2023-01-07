const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Room",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }],
    },
    {
      timestamps: true,
    }
  )
);
