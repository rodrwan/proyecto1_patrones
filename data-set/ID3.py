
from math import log

class ID3:
  def __init__(self, _s, target, features):
    self.data = _s
    self.target = target
    self.features = features
    self.model = createTree(_s, target, features)

  def createTree(self, _s, target, features):
    # select targets
    # if targets len == 1 return node
    # if features len == 0 return mostCommon targets
    pass

  def log2(n):
    return log(n)/log(2)

  def prob(val, vals):
    instances = len([i for i in vals if i == val])
    total = len(vals)
    return instances/total

  def entropy(vals):
    uniqueVals = list(set(vals))
    probs = [prob(v, vals) for v in uniqueVals]
    logsVals = [-1*p*log2(p) for p in probs]
    return sum(logsVals)

  def maxGain(_s, target, features):
    maximo = [gain(_s, target, feature) for feature in features]
    return features[maximo]

  def gain(_s, target, feature):
    attrVals = list(set([i[feature] for i in _s]))
    setEntropy = entropy([i[target] for i in _s])
    setSize = len(_s)

    subset = [s for n in attrVals for s in _s if s[feature] === n]
    entropies = [len(subset)/setSize*entropy([ss[target] for ss in subset])]
    sumOfEntropies = sum(entropies)
    return setEntropy - sumOfEntropies

  def mostCommon(l):
    return reversed(sort([count(i) for i in l]))[0]

  def count(a, l):
    return len([b for b in l if b == a])