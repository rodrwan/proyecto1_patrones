var _ = require('underscore');
var readFile = require('./libs/readfile');
var DecisionTree = require('./libs/id3');

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

var samples = db.randomSamples(db.dbSamples, 0.3);

var training_data = samples[0];

var dt = new DecisionTree(training_data, className, features);

var testing_data = samples[1];

var assertion = 0;

for (index in testing_data) {
  var letter = dt.predict(testing_data[index]);
  if (testing_data[index].letter === letter) {
    assertion++;
  } else {
    console.log("Real letter: %s. Predicted Letter: %s", testing_data[index].letter, letter);
  }
}
console.log("Accuracy: %d%", ((assertion/testing_data.length)*100).toFixed(2));
