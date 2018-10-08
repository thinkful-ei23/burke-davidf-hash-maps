'use strict';

class _Node {
  constructor(value, next) {
    this.value=value;
    this.next=next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(value) {
    this.head = new _Node(value, this.head);
  }
  // O(1)

  insertBefore(valueToInsert, valueToFind) {
    if (!this.head) {
      return null;
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode.value !== valueToFind) {
        previousNode = tempNode; 
        tempNode = tempNode.next; 
      }
      if (tempNode.next === null) {
        console.log('Item not found');
        return;
      }
      // a b
      // a.next = new Node
      // new Node.next = b
      previousNode.next = new _Node(valueToInsert, tempNode);
    }
  }
  // O(n)

  insertAfter(valueToInsert, valueToFind) {
    if (!this.head) {
      return null;
    } else {
      let tempNode = this.head;
      let afterNode = tempNode.next;
      while (tempNode.value !== valueToFind) {
        tempNode = tempNode.next; 
        // check if this works
        afterNode = tempNode.next;
      }
      if (tempNode.next === null) {
        console.log('Item not found');
        return;
      }
      // a b
      // a.next = new Node
      // new Node.next = b
      tempNode.next = new _Node(valueToInsert, afterNode);
    }
  }
  // O(n)

  insertLast(value) {
    if (this.head === null) {
      this.insertFirst(value);
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode !== null) {
        previousNode = tempNode; 
        tempNode = tempNode.next; 
      }
      previousNode.next = new _Node(value, tempNode);
    }
  }
  // O(n)

  insertAt(value, whereToInsert) {
    if (whereToInsert === 1) {
      this.insertFirst(value);
    } else {
      let tempNode = this.head;
      let count = 1;
      let previousNode = tempNode;
      while (count !== whereToInsert) {
        previousNode = tempNode; 
        tempNode = tempNode.next; 
        count++;
      }
      previousNode.next = new _Node(value, tempNode);
    }
  }
  // O(n)

  find(value) {
    // traverse the list, checking each item if it's that value
    let currentNode = this.head;
    if (!this.head){
      return null;
    }
    while (currentNode.value !== value) {
      if (currentNode.next === null) {
        return null;
      } else {
        currentNode = currentNode.next;
      }
    }
    return currentNode;
  }
  // O(n)

  deleteFirst() {
    if (!this.head) {
      return null;
    } else {
      this.head = this.head.next;
    }
  }
  // O(1)

  deleteEnd() {
    if (!this.head) {
      return null;
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode !== null) {
        previousNode = tempNode; 
        tempNode = tempNode.next;
      }
      previousNode.next = null;
    }
  }
  // O(n)

  deleteItem(value) {
    if (!this.head){
      return null;
    }
    if (this.head.value === value) {
      this.deleteFirst();
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode !== null && tempNode.value !== value) {
        previousNode = tempNode; 
        tempNode = tempNode.next; 
      }
      if(tempNode === null){
        console.log('Item not found');
        return;
      }
      previousNode.next = tempNode.next;
    }
  }
}
// O(n)

function display(LL, currentNode=LL.head) {
  if (currentNode.next === null) {
    return currentNode.value;
  } else {
    return currentNode.value + ' '  + display(LL, currentNode.next);
  }
}
// O(n)


class HashMap {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash; // keep it to 32 bits
    }
    return hash >>> 0; // make sure it's positive
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    let currentNode = this._slots[index].head;
    if (currentNode !== null && currentNode.value.key === key) {
      return currentNode;
    }
    while (currentNode.next !== null) {
      if (currentNode.next.value.key === key) {
        return currentNode.next;
      }
      currentNode = currentNode.next;
    }

    throw new Error('key error');
  }

  set(key, value) {
    const loadRatio = (this.length + 1) / this._capacity; // will the new value put us over our load ratio?
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }
    // then find a slot for the key
    const index = this._findSlot(key);

    if (this._slots[index]) {
      if (this._slots[index].head.value.key === key) {
        this.remove(key);
        this._slots[index].insertFirst({key, value});
      } else {
        this._slots[index].insertLast({key, value});
      }
    } else {
      const newLinkedList = new LinkedList();
      newLinkedList.insertFirst({
        key,
        value,
      });
      this._slots[index] = newLinkedList;
    }
    // does length need to change?
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    let currentNode = this._slots[index].head;

    if (currentNode.next === null && currentNode.value.key === key) {
      this._slots[index].deleteItem(currentNode.value);
    }

    while (currentNode.next !== null) {
      if (currentNode.value.key === key) {
        this._slots[index].deleteItem(currentNode.value);
      }
      currentNode = currentNode.next;
    }

    this.length--;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const index = hash % this._capacity; // let's say this gives us 3
    return index;
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size; // = the new size
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._slots = [];
    this._deleted = 0;

    for (const slot of oldSlots) {
      if (slot !== undefined) {
        let currentNode = slot.head;
        let previousNode = slot.head;
        while (currentNode !== null) {
          previousNode = currentNode;
          this.set(previousNode.value.key, previousNode.value.value);
          currentNode = currentNode.next;
        }
      }
    }
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function main() {
  const lor = new HashMap(4);
  lor.set('Hobbit', 'Bilbo');
  lor.set('Hobbit', 'Frodo');
  lor.set('Wizard', 'Gandolf');
  lor.set('Human', 'Aragorn');
  lor.set('Maiar', 'Necromancer');
  lor.set('Maiar', 'Sauron');
  lor.set('Ringbearer', 'Gollum');
  lor.set('LadyofLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 'Treebeard');
  // console.log(lor.get('LadyofLight'));
  console.log(JSON.stringify(lor, null, 2));
}

main();
