var _ = require('underscore');
var DecisionTree = require('./id3');

// online random forest
var poisson = function (lambda) {
  if (lambda === undefined) {
    lambda = 1;
  }
  var l = Math.exp(-lambda),
    k = 0,
    p = 1.0;
  do {
    k++;
    p *= Math.random();
  } while (p > l);

  return k - 1;
};

/***********************************

    RANDOM FOREST IMPLEMENTATION

************************************/
function RF(_s, T) {
  this.data = _s;
  this.T = T;
  this.testSet = [];
  this.root = createForest(_s, T);
}

var createForest = function (_s, T) {
  var className = _s.className;
  var features = _s.features;
  var randomForest = [];
  var i, k;
  console.log('>>> Creating forest...\n');
  var start = new Date();
  for (i = 0; i < T; i++) {
    var rnd = Math.random().toFixed(1);
    var samples = _s.randomSamples(_s.dbSamples, rnd);
    var trainingSet = samples[0];

    // console.log('>> Creating tree <<');
    var start = new Date();
    var dt = new DecisionTree(trainingSet, className, features);
    var end = new Date() - start;
    console.log("Building tree time: %ds", (end/1000).toFixed(2));
    randomForest.push(dt);
    // console.log('Tree creation complete.\n');
  }
  var end = new Date() - start;
  console.log('\nBuilding forest time: %ds', (end/1000).toFixed(2));
  return randomForest;
};

RF.prototype.predict = function (testSet) {
  var rfLength = this.root.length;
  var i, j;
  trainingSet = testSet[0];
  testSet = testSet[1];
  // console.log('Training set size: %d', trainingSet.length);
  console.log('Test set size: %d samples' , testSet.length);
  var bestFit = [];
  var bestMatrix = [];
  var confMatrix = new Array(26);

  var alphabet = {
    'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7, 'i': 8, 'j': 9, 'k': 10, 'l': 11,
    'm': 12, 'n': 13, 'o': 14, 'p': 15, 'q': 16, 'r': 17, 's': 18, 't': 19, 'u': 20, 'v': 21,
    'w': 22, 'x': 23, 'y': 24, 'z': 25
  };

  var idx, idy;
  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  for (idx = 0; idx < 26; idx++) {
    confMatrix[idx] = new Array(26);
    for (idy = 0; idy < 26; idy++) {
      confMatrix[idx][idy] = 0;
    }
  }

  var bestAcc = [];
  for (i = 0; i < rfLength; i++) {
    var dt = this.root[i];
    var acc = dt.evaluate(testSet);
    bestAcc.push(acc);
  };

  var avg       = average(bestAcc);
  var mean      = avg.mean;
  var deviation = avg.deviation;

  var bestTrees = [];
  for (i = 0; i < bestAcc.length; i++) {
    if ((mean-deviation) < bestAcc[i]) {
      bestTrees.push(this.root[i]);
    }
  }
  if (bestTrees.length === 0) bestTrees = this.root;

  console.log("Used trees: " + bestTrees.length);
  var assertion = 0;
  for (index in testSet) {
    var votes = [];
    var badAssert = 0;
    var countByLetter = {};
    var realLetter = testSet[index].letter;

    for (i = 0; i < letters.length; i++) {
      votes[i] = 0;
    }

    for (i = 0; i < bestTrees.length; i++) {
      var dt = bestTrees[i];
      var letter = dt.predict(testSet[index]);
      votes[alphabet[letter]] += 1;
    }

    var bestOption = votes.indexOf(_.max(votes));
    var selectedletter = letters[bestOption];

    if (realLetter === selectedletter) {
      assertion++;
      confMatrix[alphabet[realLetter]][alphabet[letter]] += 1;
    } else {
      confMatrix[alphabet[realLetter]][alphabet[letter]] += 1;
    }
  }

  console.log("Accuracy: %d%", ((assertion/testSet.length)*100).toFixed(2));
  var maximo = _.max(bestFit);
  var pos = bestFit.indexOf(maximo)+1;
  console.log('  \ta\tb\tc\td\te\tf\tg\th\ti\tj\tk\tl\tm\tn\to\tp\tq\tr\ts\tt\tu\tv\tw\tx\ty\tz');

  var txt = '';
  var x, y;

  for (i in letters) {
    txt += letters[i] + '\t';
    x = alphabet[letters[i]]
    for (j in letters) {
      y = alphabet[letters[j]]
      txt += confMatrix[x][y] + '\t';
    }
    txt += '\n';
  }
  console.log(txt);
};

var average = function(a) {
  var r = {
    mean: 0,
    variance: 0,
    deviation: 0
  }, t = a.length;

  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}

withinStd = function(mean, dev, val, stdev) {
   var low = mean-(stdev*dev);
   var hi = mean+(stdev*dev);
   return (val > low) && (val < hi);
}

module.exports = RF;