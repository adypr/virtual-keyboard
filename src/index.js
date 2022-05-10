/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
import '@babel/polyfill';
import 'normalize.css';
import './styles/index.scss';
import './js/head';

import {
  domElem, domList, addEvent, create,
} from './js/base';

import keys from './js/keys';
import Key from './js/Key';
import Keyboard from './js/Keyboard';
import { addTitle, addDescription } from './js/textblocks';

let storageLang = 'en';
const keyboard = new Keyboard();
const servKeys = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'BracketLeft', 'BracketRight', 'Backslash', 'Semicolon', 'Quote', 'Comma', 'Period', 'Slash'];

function generateRow(parent, arr, begin, end) {
  const row = create('div');
  row.classList.add('keyboard__row');
  for (let i = begin; i <= end; i += 1) {
    const keyButton = new Key(arr[i]);
    row.append(keyButton.renderKey(storageLang));
  }
  parent.append(row);
}

function renderKeys(parent) {
  const keyList = domList('.key');
  if (keyList.length === 0) {
    generateRow(parent, keys, 0, 13);
    generateRow(parent, keys, 14, 28);
    generateRow(parent, keys, 29, 41);
    generateRow(parent, keys, 42, 54);
    generateRow(parent, keys, 55, 63);
  } else {
    storageLang = storageLang === 'en' ? 'ru' : 'en';
    /* eslint-disable-next-line */
    for (let key of keyList) {

      if (key.dataset[storageLang] && key.dataset[storageLang].length > 1) {
        key.dataset.shiftletter = key.dataset[storageLang][0];
        key.textContent = key.dataset[storageLang][1];
      } else if (key.dataset[storageLang]) key.textContent = storageLang === 'en' ? key.dataset.en : key.dataset.ru;
    }
  }
}

function buildKeyboard() {
  keyboard.renderPrintArea('keyboard__textarea');
  keyboard.renderKeysArea('keyboard__keys');

  document.body.prepend(keyboard.renderKeyboard('keyboard'));
}

function setLocalStorageLang() {
  localStorage.setItem('storageLang', storageLang);
}

window.addEventListener('beforeunload', setLocalStorageLang);

function getLocalStorageLang() {
  if (localStorage.getItem('storageLang')) {
    storageLang = localStorage.getItem('storageLang');
  }
}

function toggleCapsLock(tag) {
  const toggle = () => {
    tag.classList.toggle('active');
    const letters = domList('[data-en]');
    letters.forEach((elem) => elem.classList.toggle('uppercase'));
  };

  addEvent(tag, 'click', () => {
    toggle();
  });
  addEvent(document, 'keydown', (e) => {
    if (e.code === 'CapsLock') toggle();
  });
}

// Printing

function printText(keysArea, textArea) {
  addEvent(keysArea, 'click', (e) => {
    if (e.target.dataset.en) {
      textArea.focus();
      let resStr = e.target.dataset[storageLang] ? (e.target.dataset[storageLang].length > 1 ? e.target.dataset[storageLang][1] : e.target.dataset[storageLang]) : '';
      let position = textArea.selectionStart;
      textArea.selectionEnd = position;

      if (!e.target.dataset.code.match('Key') && e.shiftKey) resStr = e.target.dataset.shiftletter;
      if (!resStr) resStr = e.target.dataset[storageLang];
      resStr = resStr !== undefined && resStr.length > 1 ? resStr[1] : resStr;
      if (domElem("[data-code='CapsLock']").classList.contains('active') && e.shiftKey) resStr = e.target.dataset[storageLang] ? (e.target.dataset[storageLang].length > 1 ? e.target.dataset[storageLang][0] : e.target.dataset[storageLang]) : '';
      else if (domElem("[data-code='CapsLock']").classList.contains('active') || e.shiftKey) resStr = resStr.toUpperCase();

      e.preventDefault();

      textArea.value = textArea.value.slice(0, position) + resStr + textArea.value.slice(position);
      position += 1;
      textArea.selectionStart = position;
      textArea.selectionEnd = position;
    }
    if (e.target.dataset.code === 'Enter') {
      textArea.focus();
      let position = textArea.selectionStart;
      textArea.selectionEnd = position;
      const resStr = '\n';
      e.preventDefault();

      textArea.value = textArea.value.slice(0, position) + resStr + textArea.value.slice(position);
      position += 1;
      textArea.selectionStart = position;
      textArea.selectionEnd = position;
    }
  });
  addEvent(keysArea, 'mousedown', (e) => {
    e.preventDefault();
  });
}

// Print tab

function printTab(tag, input) {
  const addTab = () => {
    const resStr = '    ';
    let position = input.selectionStart;
    input.selectionEnd = position;
    input.value = input.value.slice(0, position) + resStr + input.value.slice(position);
    position += 4;
    input.selectionStart = position;
    input.selectionEnd = position;
  };
  addEvent(tag, 'click', () => {
    addTab();
  });
  addEvent(document, 'keydown', (e) => {
    if (e.code === 'Tab') addTab();
  });
}

// Deletion

function deleteText(event, input) {
  input.setRangeText('');
  if (input.selectionStart === input.selectionEnd) {
    let start; let end;
    switch (event.target.dataset.code) {
      case 'Backspace':
        start = input.selectionStart - 1;
        end = input.selectionStart;
        break;
      case 'Delete':
        start = input.selectionStart;
        end = input.selectionStart + 1;
        break;
      default:
        break;
    }
    if (start >= 0) input.setRangeText('', start, end);
  }
}

// Arrows

function arrowLeft(textarea, tag) {
  addEvent(tag, 'click', () => {
    if (textarea.selectionStart > 0) {
      textarea.selectionStart -= 1;
      textarea.selectionEnd = textarea.selectionStart;
    }
  });
}

function arrowRight(textarea, tag) {
  addEvent(tag, 'click', () => {
    if (textarea.selectionStart >= 0) {
      textarea.selectionStart += 1;
      textarea.selectionEnd = textarea.selectionStart;
    }
  });
}

function arrowUp(textarea, tag) {
  addEvent(tag, 'click', () => {
    textarea.focus();
    const start = textarea.selectionStart;
    const arr = textarea.value.split('\n');
    let rowsBefore = 0;
    let sum = 0;
    let i = 0;
    while (rowsBefore < arr.length) {
      if (sum + arr[i].length + 1 > start) break;
      sum += arr[i].length + 1;
      rowsBefore += 1;
      i += 1;
    }
    if (rowsBefore > 0) {
      const position = start - sum;
      const newPosition = arr[rowsBefore - 1].length < position ? sum - 1
        : sum - arr[rowsBefore - 1].length - 1 + position;
      textarea.selectionStart = newPosition;
      textarea.selectionEnd = newPosition;
    }
  });
}

function arrowDown(textarea, tag) {
  addEvent(tag, 'click', () => {
    textarea.focus();
    const start = textarea.selectionStart;
    const arr = textarea.value.split('\n');
    let rowsBefore = 0;
    let sum = 0;
    let i = 0;
    while (rowsBefore < arr.length) {
      if (sum + arr[i].length + 1 > start) break;
      sum += arr[i].length + 1;
      rowsBefore += 1;
      i += 1;
    }

    const position = start - sum;
    if (rowsBefore + 1 < arr.length) {
      const newPosition = arr[rowsBefore + 1].length < position
        ? sum + arr[rowsBefore].length + arr[rowsBefore + 1].length + 1
        : sum + arr[rowsBefore].length + 1 + position;
      textarea.selectionStart = newPosition;
      textarea.selectionEnd = newPosition;
    }
  });
}

function deletionHandler(inputArea, tag1, tag2) {
  addEvent(tag1, 'click', (e) => deleteText(e, inputArea));
  addEvent(tag2, 'click', (e) => deleteText(e, inputArea));
}

function clickKeys() {
  const clickedArea = domElem('.keyboard__keys');
  addEvent(clickedArea, 'mousedown', (e) => {
    const tag = e.target.classList;
    if (tag.contains('key') && e.target.dataset.code !== 'CapsLock') tag.add('active');
    if (e.target.textContent === 'Shift') {
      const letters = domList('[data-en]');
      letters.forEach((element) => {
        element.classList.add('digits', 'uppercase');
        if (domElem('[data-code="CapsLock"]').classList.contains('active')) {
          element.classList.remove('uppercase');
        }
      });
    }
  });
  addEvent(clickedArea, 'mouseup', (e) => {
    const tag = e.target.classList;
    if (tag.contains('key') && e.target.dataset.code !== 'CapsLock') tag.remove('active');
    if (e.target.textContent === 'Shift') {
      const letters = domList('[data-en]');
      letters.forEach((element) => {
        element.classList.remove('digits', 'uppercase');
        if (domElem('[data-code="CapsLock"]').classList.contains('active')) {
          element.classList.add('uppercase');
        }
      });
    }
  });
}

addEvent(document, 'DOMContentLoaded', () => {
  window.onload = () => {
    getLocalStorageLang();
    buildKeyboard();
    renderKeys(keyboard.keysArea);
    domElem('.keyboard').before(addTitle());
    domElem('.keyboard').after(addDescription());

    toggleCapsLock(domElem("[data-code='CapsLock']"));
    printText(domElem('.keyboard__keys'), domElem('.keyboard__textarea'));
    printTab(domElem('[data-code="Tab"]'), domElem('.keyboard__textarea'));
    clickKeys();
    arrowLeft(domElem('.keyboard__textarea'), domElem('[data-code="ArrowLeft"]'));
    arrowRight(domElem('.keyboard__textarea'), domElem('[data-code="ArrowRight"]'));
    arrowUp(domElem('.keyboard__textarea'), domElem('[data-code="ArrowUp"]'));
    arrowDown(domElem('.keyboard__textarea'), domElem('[data-code="ArrowDown"]'));
    deletionHandler(domElem('.keyboard__textarea'), domElem("[data-code='Backspace']"), domElem("[data-code='Delete']"));
  };
});

addEvent(document, 'keydown', (e) => {
  if (e.code === 'Tab' || e.altKey) {
    e.preventDefault();
  }
  if (e.altKey && e.ctrlKey) {
    renderKeys(keyboard);
  }

  if (e.key === 'Shift') {
    const letters = domList('[data-en]');
    letters.forEach((element) => {
      element.classList.add('digits', 'uppercase');
      if (domElem('[data-code="CapsLock"]').classList.contains('active')) {
        element.classList.remove('uppercase');
      }
    });
  }

  if (e.code !== 'CapsLock') domElem(`[data-code="${e.code}"]`).classList.add('active');
  // Redefining physical keys
  const textArea = domElem('.keyboard__textarea');
  if (e.code.match('Key') || servKeys.includes(e.code)) {
    e.preventDefault();
    const button = domElem(`[data-code="${e.code}"]`);
    let resStr = button.dataset[storageLang];
    if (servKeys.includes(e.code) && (domElem("[data-code='ShiftLeft']").classList.contains('active') || domElem("[data-code='ShiftRight']").classList.contains('active'))) resStr = button.dataset[storageLang][0];
    if (servKeys.includes(e.code) && !(domElem("[data-code='ShiftLeft']").classList.contains('active') || domElem("[data-code='ShiftRight']").classList.contains('active'))) resStr = resStr.length > 1 ? resStr[1] : resStr;
    let position = textArea.selectionStart;
    textArea.selectionEnd = position;
    const isCaps = domElem("[data-code='CapsLock']").classList.contains('active');
    if (isCaps && (e.shiftKey || domElem("[data-code='ShiftLeft']").classList.contains('active') || domElem("[data-code='ShiftRight']").classList.contains('active'))) resStr = resStr.toLowerCase();
    else if (isCaps || e.shiftKey || domElem("[data-code='ShiftLeft']").classList.contains('active') || domElem("[data-code='ShiftRight']").classList.contains('active')) resStr = resStr.toUpperCase();
    textArea.value = textArea.value.slice(0, position) + resStr + textArea.value.slice(position);
    position += 1;
    textArea.selectionStart = position;
    textArea.selectionEnd = position;
  }
  // End of redefining

  textArea.focus();
});

addEvent(document, 'keyup', (e) => {
  if (e.code !== 'CapsLock') domElem(`[data-code="${e.code}"]`).classList.remove('active');

  if (e.key === 'Shift') {
    const letters = domList('[data-en]');
    letters.forEach((element) => {
      element.classList.remove('digits', 'uppercase');
      if (domElem('[data-code="CapsLock"]').classList.contains('active')) element.classList.add('uppercase');
    });
  }
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    domElem('[data-code="ShiftLeft"]').classList.remove('active');
    domElem('[data-code="ShiftRight"]').classList.remove('active');
  }
});
