const mongoose = require('mongoose');

const d3_dataSchema = mongoose.Schema({
    value: String,
    time: Number,
});

module.exports = mongoose.model('d3_data', d3_dataSchema);