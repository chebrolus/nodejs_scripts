/**
 * Created by ApigeeCorporation on 9/16/15.
 */

request = require('request');
fs = require('fs');
q = require('q');
_ = require('lodash');
client = require('./utils/client');
var loghandler = require("./utils/logger");
var argv = require('optimist')
    .usage('Usage: node appsListProdCheckforGivenDevs.js  --ORG_NAME <ORG_NAME> --PRODUCT_NAME <PRODUCT_NAME> --DEV_LIST_FILE  <DEV_LIST_FILE> --LOG_BASE_PATH <LOG_BASE_PATH>')
    .default('ORG_NAME', 'chebrolu1')
    .default('PRODUCT_NAME', 'Product1')
    .default('DEV_LIST_FILE', 'data/devlist.txt')
    .default('LOG_BASE_PATH', 'logs/appList')
    .argv;

var logger = loghandler.newInstanceLogger('appList.log', argv.LOG_BASE_PATH);
logger.info('Fetching App List');
var file = fs.createWriteStream('data/appList/appList.csv');
var productUsedinApp;
var appNames;

function processForEachLine(developer) {
    // Check if user exist
    var appListAPI = client.mgmtAPI + 'o/' + argv.ORG_NAME + '/developers/' + developer + '/apps?expand=true'
    request.get({ url: appListAPI, auth: client.auth }, function (error, response, body) {
        if (response) {
            if (response.statusCode == "200") {
                result = JSON.parse(body);
                // returns result object with app[]
                // check the app[] for the associated product and filter out if this is enterprise product
                // result.app[].credentials[].apiProducts[].apiproduct
                // find method checks for given product associated with the app. Below statement return 1 in case of find; 0 otherwise
                productUsedinApp = (_.find(result.app, function(app) {
                                        return _.find(app.credentials, function(credential) {
                                            return _.find(credential.apiProducts, {apiproduct:argv.PRODUCT_NAME});
                                        });
                                    }) && 1) || 0;
                appNames = _.pluck(result.app, "name").join(", ");
                if (result.app.length > 0) {
                    file.write(developer + ', ' + result.toString() + '\n');
                    //logger.info(developer + ', ' + appNames + ', ' + productUsedinApp);
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
        //file.end();
    });
