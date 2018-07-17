const mongoose = require('mongoose');

const populationSchema = mongoose.Schema({
    year:String,
    age:String,
    sex:String,
    people:String
});

module.exports = mongoose.model('population', populationSchema);