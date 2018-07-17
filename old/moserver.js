const MongoClient = require('mongodb');
const url = 'mongodb://localhost:27017/mymondb';
var db;
MongoClient.connect(url, (error, database) => {
  if (error) return process.exit(1);
  console.log('Connection is okay');

  db = database.db('mymondb');
  
  set()
});

function set(){
  set='123'
  insertDocuments(db,set, () => {
    console.log('Insert successful');
  });
}

const insertDocuments = (db,set, callback) => {
  const collection = db.collection('test');

  collection.insert(
    [{ name: 'Bob' }, { name: set }, { name: 'Peter' }],
    (error, result) => {
      if (error) return process.exit(1);
      callback(result);
    }
  );
};
