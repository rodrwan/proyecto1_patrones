var _ = require('underscore');

function ID3(_s, target, features) {
  this.data = _s;
  this.target = target;
  this.features = features;
  this.model = createTree(_s, target, features);
}

ID3.prototype.predict = function (sample) {
  var root = this.model;
  debugger
  while (root.type != 'result') {
    var attr = root.name;
    var sampleVal = sample[attr];
    var childNode = _.detect(root.vals, function (x) {
      return x.name === sampleVal
    });
    if (typeof childNode === 'undefined') return 0;
    root = childNode.child;
  }
  return root.val;
};

var createTree = function (_s, target, features) {
  var targets = _.uniq(_.pluck(_s, target));
  // console.log(targets.length)
  // if the tree only have one leaf
  if (targets.length === 1) {
    // console.log("end node! "+targets[0]);
    return {
      type: 'result',
      val: targets[0],
      name: targets[0]
    };
  }

  if (features.length === 0) {
    // console.log("returning the most dominate feature!!!");
    var topTarget = mostCommon(targets);
    return {
      type: 'result',
      val: topTarget,
      name: topTarget
    };
  }

  // select the best option of the features
  var bestFeature = maxGain(_s, target, features);
  // save others features.
  var remainingFeatures = _.without(features, bestFeature);
  // select the unique values of best feature
  var posibleValues = _.uniq(_.pluck(_s, bestFeature));
  // create a node
  var node = {
    name: bestFeature
  };
  node.type = 'feature';

  // create an array with unused features.
  node.vals = _.map(posibleValues, function (v) {
    var _newS = _s.filter(function (x) {
      return x[bestFeature] == v
    });

    var childNode = {
      name: v,
      type: 'feature_value'
    };
    childNode.child = createTree(_newS, target, remainingFeatures);
    // debugger
    return childNode;
  });
  return node;
};

/* private methods */

var log2 = function (n) {
  return Math.log(n)/Math.log(2);
};

var prob = function (val, vals) {
  var instances = _.filter(vals, function (x) {
    return x === val
  }).length;
  var total = vals.length;
  return instances/total;
};

var entropy = function (vals) {
  var uniqueVals = _.uniq(vals);
  var probs = uniqueVals.map(function (x) { return prob(x, vals) });
  var logVals = probs.map(function (p) { return -p*log2(p) });
  return logVals.reduce(function (a, b) { return a+b }, 0);
};

var gain = function (_s, target, feature) {
  var attrVals = _.uniq(_.pluck(_s, feature));
  var setEntropy = entropy(_.pluck(_s, target));
  var setSize = _.size(_s);
  // save the other side of the equation.
  var entropies = attrVals.map(function (n) {
    var subset = _s.filter(function (x) {
      return x[feature] === n;
    });
    return (subset.length/setSize)*entropy(_.pluck(subset, target));
  });
  var sumOfEntropies = entropies.reduce(function (a,b) { return a+b }, 0);
  return setEntropy - sumOfEntropies;
};

var maxGain = function (_s, target, features) {
  return _.max(features, function (e) {
    return gain(_s, target, e)
  });
};

var mostCommon = function (l) {
  return _.sortBy(l, function (a) {
    return count(a, l);
  }).reverse()[0];
};

var count = function (a, l) {
  return _.filter(l, function (b) { return b === a}).length;
};

module.exports = ID3;