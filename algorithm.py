"""
  En este script se define el algoritmo para fuzzy SLIQ
"""

def decision_tree_contruction(L):
  if L.isHead():
  else:

  for node in L:

def evaluate_gini_index(a, sp_val):
  for val in a:
    fuzzy_membership(val, sp_val, 'left')
    fuzzy_membership(val, sp_val, 'right')

def fuzzy_membership(a, v, pos):
  alpha = 0.1
  beta = 1
  omega = dev(a)
  if pos == 'left':
    for val in a:
      lw = 0.0
      rw = alpha*omega
      lp = v - beta
      rp = v + beta
      if v < lp
        fuzzy_val = (lw/(lp+lw-v))
      elif lp <= v and v <= rp:
        fuzzy_val = 1.0
      elif v > rp:
        fuzzy_val = (rw/(v-rp+rw))
    return fuzzy_val
  if pos == 'right':
    for val in a:
      lw = alpha*omega
      rw = 0.0
      lp = v - beta
      rp = v + beta
      if v < lp
        fuzzy_val = (lw/(lp+lw-v))
      elif lp <= v and v <= rp:
        fuzzy_val = 1.0
      elif v > rp:
        fuzzy_val = (rw/(v-rp+rw))
    return fuzzy_val