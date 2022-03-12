var LZUTF8 = require('lzutf8');

var fs = require('fs');
var s = '';

function loadFromJsonFile(jsonFilePath) {
    fs.readFile(jsonFilePath, 'utf8', (err, chunk) => {
        if (err) throw err;
        if (chunk)
            s += chunk
        console.log('s')
    });
}

loadFromJsonFile('F:/BlockChain/Projects/feedback-dapp/client/src/assets/Sec-12.png')
console.log(s)

