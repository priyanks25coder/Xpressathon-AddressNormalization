var readTextFile = require('read-text-file');
 
var contents = readTextFile.readSync('./static/words.txt');

const words=contents.split('\r\n')

module.exports= {words}