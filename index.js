/**
 * Module dependencies
 */
var fs = require("fs")
  , join = require("path").join;

/**
 * Read and parse .netrc
 *
 * @param {String} file
 * @return {Object}
 * @api public
 */
module.exports = exports = function(file) {
  var file = file || join(process.env.HOME, ".netrc");

  if(!fs.existsSync(file)) return;
  var netrc = fs.readFileSync(file, "UTF-8");
  return exports.parse(netrc);
};

/**
 * Parse netrc
 *
 * @param {String} content
 * @return {Object}
 * @api public
 */
exports.parse = function(content) {
  // Remove comments
  var lines = content.split('\n');
  for (var n in lines) {
    var i = lines[n].indexOf('#');
    if (i > -1) lines[n] = lines[n].substring(0,i);
  }
  content = lines.join('\n');

  var tokens = content.split(/[ \t\n\r]+/)
    , machines = {}
    , m = null
    , key = null;

  for(var i = 0; i < tokens.length; i+=2) {
    var key = tokens[i]
      , value = tokens[i+1];

    // Whitespace
    if(!key || !value) continue;

    // We have a new machine definition
    if(key === "machine") {
      m = {};
      machines[value] = m;
    }
    // key=value
    else {
      m[key] = value;
    }
  }

  return machines
};
