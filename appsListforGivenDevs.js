/**
 * Created by ApigeeCorporation on 9/16/15.
 */

request = require('request');
fs = require('fs');
q = require('q');
client = require('./utils/client');
var loghandler = require("./utils/logger");
var argv = require('optimist')
    .usage('Usage: node appsListforGivenDev.js  --ORG_NAME <ORG_NAME> --DEV_LIST_FILE  <DEV_LIST_FILE> --LOG_BASE_PATH <LOG_BASE_PATH>')
    .default('ORG_NAME', 'chebrolu1')
    .default('DEV_LIST_FILE', 'data/devlist.txt')
    .default('LOG_BASE_PATH', 'logs/appList')
    .argv;

var logger = loghandler.newInstanceLogger('appList.log', argv.LOG_BASE_PATH);
logger.info('Fetching App List');
var file = fs.createWriteStream('data/appList/appList.csv');

function processForEachLine(developer) {
    // Check if user exist
    var appListAPI = client.mgmtAPI + 'o/' + argv.ORG_NAME + '/developers/' + developer + '/apps'
    request.get({ url: appListAPI, auth: client.auth }, function (error, response, body) {
        if (response) {
            if (response.statusCode == "200") {
                result = JSON.parse(body);
                if (result.length > 0) {
                    file.write(developer + ', ' + result.toString() + '\n');
                    //logger.info(developer + ', ' + result.toString());
                } else {
                    file.write(developer + ',\n');
                    //logger.info(developer + ', No Apps for this Dev');
                }
            } else {
                logger.error('ERROR: ' + response.statusCode + ' Message: ' + error + ' for developer: ' + developer);
            }
        } else {
            logger.error('ERROR - no response object');
        }
    });
}


client.processFile(argv.DEV_LIST_FILE,
    processForEachLine,
    function() {
        logger.info('Done');
        file.end();
    });
