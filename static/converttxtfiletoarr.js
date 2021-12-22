var readTextFile = require('read-text-file');
 
var contents = readTextFile.readSync('test.txt');

const words=contents.split('\r\n')

module.exports= {words}