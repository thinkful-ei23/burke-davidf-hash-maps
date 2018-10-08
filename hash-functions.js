'use strict';
function hashString(string) {
  let hash = 5381;
  for (let i=0; i<string.length; i++) {
    // dog hash = 5381 (1010100000101 << 5) turns into 101010000010100000 + 5831 + 100 
    hash = (hash << 5) + hash + string.charCodeAt(i);
    hash = hash & hash; // why are we doing this? it should return the same number, right?
  } // do we have any decimals we need to truncate?
  return hash >>> 0;
}

console.log(hashString('dog'));
// 3 through 10
// console.log(-9 >>> 2);
// console.log(10001001 >>> 0);
// 10001001