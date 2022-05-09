import { create } from './base';

class Keyboard {
  constructor() {
    this.printArea = '';
    this.keysArea = '';
  }

  renderKeyboard(...classes) {
    let newK = create('div');
    newK.classList.add(...classes);
    newK.append(this.printArea);
    newK.append(this.keysArea);
    return newK;
  }

  renderPrintArea(...classes) {
    let printArea = create('textarea');
    printArea.classList.add(...classes);
    printArea.setAttribute('rows', '5');
    this.printArea = printArea;
  }

  renderKeysArea(...classes) {
    let keysArea = create('div');
    keysArea.classList.add(...classes);
    this.keysArea = keysArea;
  }
}

export default Keyboard;
