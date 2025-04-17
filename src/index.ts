import * as _ from 'lodash';
import './style.css';
import logo from './assets/logo.svg';

function helloComponent() {
    const element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // img element, if i need to use an image
    // const myLogo = new Image();
    // myLogo.src = logo;
    // element.appendChild(myLogo);

    return element;
}

document.body.appendChild(helloComponent());