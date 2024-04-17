const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const platformSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        },
        image_id: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const platform = mongoose.model("Platform", platformSchema);

module.exports = platform;
