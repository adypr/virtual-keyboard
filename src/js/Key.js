import { create } from './base';

class Key {
  constructor({ code, location, title }) {
    this.code = code;
    this.location = location;
    this.title = title;
  }

  renderKey(lang) {
    let key = create('div');
    key.classList.add('key');
    key.dataset.code = this.code;
    if (this.location) {
      key.dataset.en = this.location.en;
      key.dataset.ru = this.location.ru;
      if (this.location[lang].length > 1) {
        key.dataset.shiftletter = this.location[lang][0];
        key.textContent = this.location[lang][1];
      } else key.textContent = this.location[lang];
    }
    if (this.title) key.textContent = this.title;
    return key;
  }
}

export default Key;
