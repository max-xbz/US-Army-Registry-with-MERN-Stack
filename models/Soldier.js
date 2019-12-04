const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const soldierSchema = new Schema({
    name: String,
    rank: String,
    sex: String,
    startDate: Date,
    phone: String,
    email: String,
    superior: { type: Schema.Types.ObjectId },
    children: [{ type: Schema.Types.ObjectId }],
    image: String,
    createdAt: Date
});

module.exports = mongoose.model('Soldier', soldierSchema);