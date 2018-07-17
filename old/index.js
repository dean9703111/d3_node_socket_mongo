const noteroutes = require('./note_routes');

module.exports = function(app,db)
{
    noteroutes(app,db);

};