const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(root) {
    this.root = root;
  }

  insertRec(current, value) {
    if (current === null) {
      return new Node(value);
    } else if (value < current.value) {
      current.left = this.insertRec(current.left, value);
    } else if (value > current.value) {
      current.right = this.insertRec(current.right, value);
    }

    return current;
  }

  insert(value) {
    this.insertRec(this.root, value);
  }

  minValue(current) {
    while (current.left) {
      current = current.left;
    }
    return current.value;
  }

  removeRec(current, value) {
    if (current === null) {
      return current;
    }

    if (value < current.value) {
      current.left = this.removeRec(current.left, value);
    } else if (value > current.value) {
      current.right = this.removeRec(current.right, value);
    } else {
      if (current.left == null) {
        return current.right;
      } else if (current.right == null) {
        return current.left;
      }

      current.value = this.minValue(current.right);
      current.right = this.removeRec(current.right, current.value);
    }

    return current;
  }

  remove(value) {
    this.removeRec(this.root, value);
  }

  findRec(current, value) {
    if (current.value == value) {
      return current;
    }
    if (value < current.value && current.left) {
      return this.findRec(current.left, value);
    }
    if (value > current.value && current.right) {
      return this.findRec(current.right, value);
    }
    return "Not in tree";
  }

  find(value) {
    return this.findRec(this.root, value);
  }

  levelOrder(callback) {
    let queue = [this.root];
    let returned = [];
    while (queue[0]) {
      if (queue[0].left != null) {
        queue.push(queue[0].left);
      }
      if (queue[0].right != null) {
        queue.push(queue[0].right);
      }
      if (callback) {
        callback(queue.shift());
      } else {
        returned.push(queue.shift().value);
      }
    }
    if (callback) {
      return;
    }
    return returned;
  }

  inOrder(callback, returned = [], current = this.root) {
    if (current.left) {
      this.inOrder(callback, returned, current.left);
    }
    if (callback) {
      callback(current);
    } else {
      returned.push(current.value);
    }
    if (current.right) {
      this.inOrder(callback, returned, current.right);
    }
    if (callback) {
      return;
    }
    return returned;
  }

  preOrder(callback, returned = [], current = this.root) {
    if (callback) {
      callback(current);
    } else {
      returned.push(current.value);
    }
    if (current.left) {
      this.preOrder(callback, returned, current.left);
    }
    if (current.right) {
      this.preOrder(callback, returned, current.right);
    }
    if (callback) {
      return;
    }
    return returned;
  }

  postOrder(callback, returned = [], current = this.root) {
    if (current.left) {
      this.postOrder(callback, returned, current.left);
    }
    if (current.right) {
      this.postOrder(callback, returned, current.right);
    }
    if (callback) {
      callback(current);
    } else {
      returned.push(current.value);
    }
    if (callback) {
      return;
    }
    return returned;
  }

  height(node) {
    if (!node) {
      return 0;
    }
    return Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  depth(node, ret = 0, current = this.root) {
    if (!node) {
      return "Not in tree";
    }
    if (this.find(node.value) == "Not in tree") {
      return "Not in tree";
    }
    if (node.value == current.value) {
      return ret;
    }
    if (node.value < current.value) {
      return this.depth(node, ret + 1, current.left);
    }
    if (node.value > current.value) {
      return this.depth(node, ret + 1, current.right);
    }
  }

  isBalanced(current = this.root) {
    if (!current) {
      return true;
    }
    let lh = this.height(current.left);
    let rh = this.height(current.right);
    if (
      Math.abs(lh - rh) < 1 &&
      this.isBalanced(current.left) &&
      this.isBalanced(current.right)
    ) {
      return true;
    }
    return false;
  }

  reBalance() {
    let newArr = this.inOrder();
    let array = [...new Set(newArr.sort((a, b) => a - b))];
    tree = new Tree(buildTree(array, 0, array.length - 1));
  }
}

function buildTree(array, start, end) {
  if (start > end) {
    return null;
  }

  let mid = Math.floor((start + end) / 2);

  let node = new Node(array[mid]);
  node.left = buildTree(array, start, mid - 1);
  node.right = buildTree(array, mid + 1, end);

  return node;
}

let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let array = [...new Set(arr.sort((a, b) => a - b))];

let tree = new Tree(buildTree(array, 0, array.length - 1));

prettyPrint(tree.root);
