'use strict';

function store(input) {
  console.log('does something');
  chrome.storage.sync.set({
    results: input.value
  });
}

// TODO: extends
// if (localStorage.results) {
//
// }

var inputs = document.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
  if (inputs[i].type === 'radio') {
    inputs[i].addEventListener('change', store(inputs[i]));
  }
}
