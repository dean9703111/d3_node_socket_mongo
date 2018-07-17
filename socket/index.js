//const Messages = require('../models/Messages');
const Messages = require('../models/d3_data');
//const Messages = require('../models/population');
var MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

class SocketHander {
    constructor() {
        this.db;
    }
    connect() {
        this.db = require('mongoose').connect('mongodb://localhost:27017/d3_test', { useNewUrlParser: true });
        this.db.Promise = global.Promise;
    }
    getMessages() {
        return Messages.find({})
    }
    gethistory() {
        var end_time=new Date(),start_time=end_time.getTime()-1000*10;
        var query = {time: {
            //$gte : start_time,
            $lte : end_time.getTime()
       }}
        return Messages.find(query).limit(50).sort({time:-1})
    }
    getdata() {
        var end_time=new Date(),start_time=end_time.getTime()-1000;
        var query = {time: {
            $gte : start_time,
            $lte : end_time.getTime()
       }}
        return Messages.find(query)
    }
    storeMessages(data) {//儲存隨機資訊
        //console.log(data);
        const newMessages = new Messages({
            value:data,
            time:moment().valueOf(),
        });
        const doc = newMessages.save();
        /*for(var i=0;i<data.length;i++){
            const newMessages = new Messages({
                year:data[i].year,
                age:data[i].age,
                sex:data[i].sex,
                people:data[i].people
            });
            const doc = newMessages.save();
            //console.log(doc)
        }*/
    }
}

module.exports = SocketHander;



/*

//const Messages = require('../models/Messages');
//const Messages = require('../models/d3_data');
const Messages = require('../models/populations');
var MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

class SocketHander {
    constructor() {
        this.db;
    }
    connect() {
        this.db = require('mongoose').connect('mongodb://localhost:27017/d3_test', { useNewUrlParser: true });
        this.db.Promise = global.Promise;
    }
    getMessages() {
        return Messages.findOne({})
    }
    storeMessages(data) {//儲存隨機資訊
        //console.log(data);
        for(var i=0;i<data.length;i++){
            const newMessages = new Messages({
                year:data[i].year,
                age:data[i].age,
                sex:data[i].sex,
                people:data[i].people
            });
            const doc = newMessages.save();
            console.log(doc)
        }
    }
}

module.exports = SocketHander;
*/