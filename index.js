var http = require('http'),
    faye = require('faye');

var log4js = require("log4js");
var log4js_config = require("./log4js.json");
log4js.configure(log4js_config);

var LogFile = log4js.getLogger('log_date');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({ mount: '/' });

var serverAuth = {
    incoming: function(message, request, callback) {
        if (!message.channel.match(/^\/photoframe\/\d{1,}/)) {
            return callback(message);
        }
        LogFile.info(request.headers.origin, JSON.stringify(message));
        // msgToken = message.ext.authToken;
        // if (msgToken !== 111) {
        //     console.log('error');
        //     message.error = 'error';
        // }
        callback(message);
    }
};

bayeux.addExtension(serverAuth);

bayeux.attach(server);
server.listen(8000);
