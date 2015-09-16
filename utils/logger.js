/**
 * Created by ApigeeCorporation on 9/16/15.
 */

var winston = require('winston');

var defautlDirectoryPath='/tmp/processEDGEUser',
    defaultDatePattern='_yyyy-MM-dd',
    defaultRotationSize=524288000,
    DIR_SEPARATOR = "/";

//
// Change levels on the default winston logger
//
winston.setLevels(winston.config.syslog.levels);

var newLogger = function(fullPath){
    var lastIndex = fullPath.lastIndexOf('/');
    if (lastIndex < 0) {
        return newInstanceLogger(fullPath);
    } else {
        var dirPath = fullPath.substring(0, lastIndex);
        var fileName = fullPath.substring(lastIndex + 1);
        return  newInstanceLogger(fileName, dirPath);
    }
};


var newInstanceLogger = function(logFileName,directoryPath,rotationSize,datePattern){
    //Initialize  directory, filename , datePattern & rotationPolicy
    try {
        if(typeof directoryPath === 'undefined') {
            directoryPath=defautlDirectoryPath;
        }
        if(typeof datePattern === 'undefined') {
            datePattern=defaultDatePattern;
        }
        if(typeof rotationSize === 'undefined') {
            rotationSize=defaultRotationSize;
        }

        if(typeof  logFileName === 'undefined'){
            throw  "File Name is Required";
        }

        require('child_process').exec('mkdir -p '+directoryPath);

        return new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({ colorize: false, timestamp: true , level : 'info',handleExceptions: true}),
                new winston.transports.File({ filename: directoryPath + DIR_SEPARATOR + logFileName ,
                    level: 'info',
                    colorize: false,
                    datePattern: datePattern,
                    handleExceptions: true,
                    maxsize: rotationSize
                })
            ],
            exitOnError: false
        });
    } catch (err){
        console.error("oops!! logger having an issue"+ err.message);
    }

};

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(
            {
                level: "debug",
                colorize: true,
                timestamp: true,
                handleExceptions: true
            })
    ]
});

module.exports = {
    newInstanceLogger: newInstanceLogger,
    newLogger: newLogger,
    logger: logger
};