'use strict';

class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i=0; i<string.length; i++) {
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
    if (loadRatio > HashMap.MAX_LOAD_RATIO) { // if so, resize the capacity times 3
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }
    // then find a slot for the key
    const index = this._findSlot(key);
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
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

    for (let i=start; i<start + this._capacity; i++) { // this goes through the whole array we iterate through 3 to 13
      const index = i % this._capacity; // if starting at 3. it goes through 3 through 10 and then 0, 1, 2 
      const slot = this._slots[index]; // checks whether it's empty or it matches what we're looking for (used for set and find)
      if (slot === undefined || slot.key === key && !slot.deleted) {
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

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;