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
    this._deleted = 0;
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
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + 1 + this._deleted) / this._capacity; // will the new value put us over our load ratio?
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      // if so, resize the capacity times 3
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }
    // then find a slot for the key
    const index = this._findSlot(key);

    if (this._slots[index]) {
      this.slots[index].value.insertLast({key, value});
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
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity; // let's say this gives us 3

    for (let i = start; i < start + this._capacity; i++) {
      // this goes through the whole array we iterate through 3 to 13
      const index = i % this._capacity; // if starting at 3. it goes through 3 through 10 and then 0, 1, 2
      const slot = this._slots[index]; // checks whether it's empty or it matches what we're looking for (used for set and find)
      if (slot === undefined || (slot.key === key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size; // = the new size
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._slots = [];
    this._deleted = 0;

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value); // this process adds the length back
      }
    }
  }
}
function main() {
  const lor = new HashMap(3);
  lor.set('Hobbit', 'Bilbo');
  lor.set('Maiar', 'Sauron');
  console.log(JSON.stringify(lor, null, 2));
}

main();