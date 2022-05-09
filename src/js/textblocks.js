import { create } from './base';

export const addTitle = () => {
  const title = create('h1');
  title.classList.add('h1');
  title.textContent = 'RSS Виртуальная клавиатура';
  return title;
};

export const addDescription = () => {
  const description = create('div');
  description.classList.add('description');
  description.innerHTML = '<p>Клавиатура создана в операционной системе Windows</p><p>Для переключения языка комбинация: левыe ctrl + alt</p>';
  return description;
};
