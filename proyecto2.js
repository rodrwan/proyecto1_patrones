var fs = require('fs');
var _ = require('underscore');
var DecisionTree = require('decision-tree');

// data pre processiong...
var start = new Date();
var hrstart = process.hrtime();

var db = './data-set/letter.data';
var fulldata = fs.readFileSync(db).toString();
var samples = fulldata.split('\n');

samples = samples.slice(0, samples.length-1);

var dbSamples = [];
var i;

_.each(samples, function (data, idx){
  var lSample = data.split('\t');
  var sample = {
    letter: lSample[1]
  }
  var j = 0;
  for (i = 6; i < 134; i++) {
    _idx = 'id'+j;
    sample[_idx.toString()] = lSample[i];
    j++;
  }
  dbSamples.push(sample);

});
var end = new Date() - start,
    hrend = process.hrtime(hrstart);
console.log("Reading and loading file time:");
console.log("Execution time: %dms", end);
console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);

// MAIN
unsortedList = dbSamples.sort(function () { return Math.random() });
var maxItems = unsortedList.length;
var testSize = Math.random();
console.log("Size of the test set: " + parseInt(testSize*100) + "%:");

var init = parseInt(maxItems*testSize);

trainingSet = unsortedList.slice(0, init-1);
testSet = unsortedList.slice(init, maxItems);

var class_name = "letter";
var num = [];
for (i = 0; i < 128; i++) {
  num.push('id'+i);
}
var features = num;

var dt = new DecisionTree(trainingSet, class_name, features);
var predicted_class = dt.predict({
    letter: "d"
});
console.log(predicted_class);
var accuracy = dt.evaluate(testSet);
console.log(accuracy);
