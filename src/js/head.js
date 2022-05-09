import favicon from '../images/favicon/favicon.ico';
import json from '../images/favicon/site.webmanifest';

let fav = document.querySelector('link[rel="icon"]');
fav.setAttribute('href', favicon);

let manifest = document.querySelector('link[rel="manifest"]');
manifest.setAttribute('href', json);
