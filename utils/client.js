/**
 * Created by ApigeeCorporation on 9/16/15.
 */

fs = require('fs');

var mgmtAPI = (process.env.MGMTAPI || 'https://api.enterprise.apigee.com/v1/');
var USER = (process.env.USERID || 'schebrolu@apigee.com');
var PASSWORD = (process.env.USERPASSWORD || '');

var auth = { username: USER, password: PASSWORD, sendImmediately: false };

function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
    });
}

function processFile(file, processFunc, callback) {
    var inputStream = fs.createReadStream(file);
    readLines(inputStream, processFunc, callback);
}


module.exports = {
    processFile: processFile,
    mgmtAPI: mgmtAPI,
    auth: auth
};