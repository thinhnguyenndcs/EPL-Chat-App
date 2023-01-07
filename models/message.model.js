const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      message: {
        type: String,
        required: true,
      },
      room: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        required: true,
      },
      sendingTime: {
        type: Date,
        default: new Date(),
      },
    },
    {
      timestamps: true,
    }
  )
);
