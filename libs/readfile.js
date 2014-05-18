var fs = require('fs');
var _ = require('underscore');
// data pre processiong...

function readFile(src, dst) {
  this.className = "letter";
  var num = [];
  for (i = 0; i < 128; i++) {
    num.push('px'+i);
  }
  this.features = num;
  this.dbSamples = main(src, dst);
  var start = new Date();
}

var main = function (src, dst, porcentage) {
  var dbSamples = [];
  var start = new Date();

  if (!fs.existsSync(dst)) {
    console.log('Writing file..');
    var fulldata = fs.readFileSync(src).toString();
    var samples = fulldata.split('\n');
    samples = samples.slice(0, samples.length-1);

    var i;

    _.each(samples, function (data, idx) {
      var lSample = data.split('\t');
      var sample = {
        id: lSample[0],
        letter: lSample[1]
      }
      var j = 0;
      for (i = 6; i < 134; i++) {
        _idx = 'px'+j;
        pixel = parseInt(lSample[i].replace(/[\n\t\r]/g, ''));
        sample[_idx.toString()] = (pixel === 0 ? false : true);
        j++;
      }
      dbSamples.push(sample);
    });
    fs.appendFileSync(dst, JSON.stringify(dbSamples), {encoding: 'utf8', flag: 'w'});
    console.log("Writing time: %ds", (end/1000).toFixed(2));
  } else {
    console.log('Reading file..');
    dbSamples = JSON.parse(fs.readFileSync(dst).toString());
    var end = new Date() - start;
    console.log("Reading time: %ds", (end/1000).toFixed(2));
  }
  return dbSamples;
};

readFile.prototype.randomSamples = function (dbSamples, trainingPorcetage) {
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  var min = 100000000000;
  var trainingSet = [];
  var testSet = [];
  var start = new Date();
  _.each(alphabet, function (letter, idx) {
    var countLetter = 0
    for (sample in dbSamples) {
      if (dbSamples[sample].letter === letter) {
        countLetter++;
      }
    }
    min = (countLetter < min ? countLetter: min);
  });

  _.each(alphabet, function (letter, idx) {
    var countLetter = 0
    var arrByLetter = [];
    for (sample in dbSamples) {
      if (dbSamples[sample].letter === letter) {
        arrByLetter.push(dbSamples[sample])
        countLetter++;
      }
    }
    var trainingSize = parseInt(min*trainingPorcetage);

    var arrShuffled = shuffle(arrByLetter);
    var arrByLetterTraining = arrShuffled.slice(0, trainingSize);
    var arrByLetterTest = arrShuffled.slice(trainingSize, min);

    for (idLetter in arrByLetterTraining) {
      trainingSet.push(arrByLetter[idLetter]);
    }
    for (idLetter in arrByLetterTest) {
      testSet.push(arrByLetter[idLetter]);
    }
  });

  end = new Date() - start;
  // console.log("Randomize time: %ds", (end/1000).toFixed(2));
  // console.log("Size of the training set: " + parseInt(trainingPorcetage*100) + "%:");
  // console.log(trainingSet.toString() === testSet.toString());
  return [
    trainingSet,
    testSet
  ];
};
function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

module.exports = readFile;