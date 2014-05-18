class Node:
  def __init__(self, val):
    self.val = val
    self.left = None
    self.right = None


class BiTree:
  def __init__(self):
    self.root = None

  def addNode(self, val):
    return Node(val)

  def insert(self, root, data):
    if root is None:
      return self.addNode(data)
    else:
      if data >= root.val:
        root.left = self.insert(root.left, data)
      else:
        root.right = self.insert(root.right, data)
      return root

  def printTree(self, root, level=0):
    # prints the tree path
    if root == None:
      pass
    else:
      self.printTree(root.left, level+1)
      print '  ' * level + str(root.val)
      self.printTree(root.right, level+1)





btree = BiTree()

root = btree.addNode(10)

btree.insert(root, 1)
btree.insert(root, 3)
btree.printTree(root)
print
btree.insert(root, 2)
btree.insert(root, 6)
btree.printTree(root)
print
btree.insert(root, 4)
btree.insert(root, 5)
btree.printTree(root)
print
btree.insert(root, 7)
btree.insert(root, 8)
btree.printTree(root)
print
btree.insert(root, 9)
btree.insert(root, 0)
btree.printTree(root)
print
