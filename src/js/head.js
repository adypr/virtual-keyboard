import favicon from '../images/favicon/favicon.ico';
import json from '../images/favicon/site.webmanifest';

const fav = document.querySelector('link[rel="icon"]');
fav.setAttribute('href', favicon);

const manifest = document.querySelector('link[rel="manifest"]');
manifest.setAttribute('href', json);
