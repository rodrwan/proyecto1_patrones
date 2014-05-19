if (process.argv.length <= 2) {
  throw 'missing arguments';
}

var _ = require('underscore');
var readFile = require('./libs/readfile');
var RandomForest = require('./libs/randomforest');

var src = './data-set/letter.data';
var dst = "./data-set/process.data";

var db = new readFile(src, dst);

var T = process.argv[2]; // size of the forest
var testSize = process.argv[3]; // size of the test set
// var alpha = 189; // mininum number of samples
// var beta = process.argv[4];
console.log("Number of Trees in Forest: %d\n", T);

var rf = new RandomForest(db, T);

console.log("\n> Starting predictions...");
var samples = db.randomSamples(db.dbSamples, testSize);

rf.predict(samples);
