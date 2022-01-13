const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'bztamfabtjpccecyifuw-mysql.services.clever-cloud.com',
    user: 'unr0yfejtt3vdg1v',
    database: 'bztamfabtjpccecyifuw',
    password: 'Y02AJGXVRUimqw8dKERJ'
});

module.exports = pool.promise();