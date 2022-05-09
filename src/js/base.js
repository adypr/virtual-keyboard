export const domElem = (selector) => document.querySelector(selector);
export const domList = (selector) => document.querySelectorAll(selector);

export const addEvent = (...args) => args[0].addEventListener(...args.slice(1));

export const create = (element) => document.createElement(element);
