var fs        = require('fs');
var Gateblu   = require('./index');

var CONFIG_PATH = './meshblu.json';
var DEFAULT_OPTIONS = {
  server:          'meshblu.octoblu.com',
  port:            '80',
  devicePath:      'devices',
  tmpPath:         'tmp'
};

var GatebluCommand = function(){
  var self, gateblu;
  self = this;

  self.getOptions = function(){
    if(!fs.existsSync(CONFIG_PATH)){
      self.saveOptions(DEFAULT_OPTIONS);
    }

    return require(CONFIG_PATH);
  };

  self.run = function(){
    var options = self.getOptions();

    gateblu = new Gateblu(options);
    gateblu.on('gateblu:config', self.saveOptions);

    process.on('exit',              gateblu.cleanup);
    process.on('SIGINT',            gateblu.cleanup);
    process.on('uncaughtException', gateblu.cleanup);
  };

  self.saveOptions = function(options){
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(options, null, 2));
    console.log("Saved config to meshblu.json");
  }
};

var gatebluCommand  = new GatebluCommand();
gatebluCommand.run();
