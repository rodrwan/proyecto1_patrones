var _ = require('underscore');
var readFile = require('./readfile');
var DecisionTree = require('./id3');
var data = require('./array');


var src = './data-set/letter.data';
var dst = "./data-set/process.data";

function shuffle(o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

var db = new readFile(src, dst);
var dbSamples = db.dbSamples;
var className = db.className;
var features = db.features;

// var training_ids = data.training_ids;
// var training_data = _.filter(dbSamples, function(sample) {
//     return _.contains(training_ids, sample.id);
// });
// var testing_ids = data.testing_ids;
// var testing_data = _.filter(dbSamples, function(sample) {
//     return _.contains(testing_ids, sample.id);
// });

var samples = db.randomSamples(db.dbSamples, 0.7);

training_data = samples[0];

var dt = new DecisionTree(training_data, className, features);

testing_data = samples[1];

console.log("Success rate: %d%", (dt.evaluate(testing_data)*100).toFixed(2));


