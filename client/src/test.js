const fs = require("fs");
path = "/home/kishan/Pictures/Screenshot from 2022-03-12 15-14-49.png";

const contents = fs.readFileSync(path, { encoding: "base64" });

// console.log(contents);

var LZUTF8 = require('lzutf8');

var output = LZUTF8.compress(contents);

console.log(output);

