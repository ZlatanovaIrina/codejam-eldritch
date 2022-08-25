import ancients from "./assets/Ancients/index.js";
import difficulties from './data/difficulties.js';

document.addEventListener('DOMContentLoaded', main);

function main() {

    createAncientsDiv();
    addDifficultiesButtons();
    action();

}

function action() {
    
}

function createAncientsDiv() {
    const $wrapper = document.querySelector('.wrapper__header');

    const ancientsDiv = document.createElement('div');
    ancientsDiv.classList.add('ancients');

    for (let key in ancients) {
        const ancientsItem = document.createElement('span');
        ancientsItem.style.background = `url(${ancients[key]}) no-repeat`;
        ancientsItem.style.backgroundSize = `100%`;
        ancientsItem.classList.add('ancients__item');
        
        ancientsDiv.appendChild(ancientsItem);
    }

    $wrapper.appendChild(ancientsDiv);
}

function addDifficultiesButtons() {
    const $wrapper = document.querySelector('.wrapper__header');

    const difficultiesWrapper = document.createElement('div');
    difficultiesWrapper.classList.add('difficulties__wrapper');

    $wrapper.appendChild(difficultiesWrapper);

    const difficultiesDiv = document.createElement('div');
    difficultiesDiv.classList.add('difficulties');

    difficulties.forEach(function (obj) {
        const difficultiesItem = document.createElement('button');
        difficultiesItem.classList.add('difficulties__button');

        difficultiesItem.value = obj['id'];
        difficultiesItem.innerText = obj['name'];
        difficultiesDiv.appendChild(difficultiesItem);
    });

    const shake = document.createElement('button');
    shake.classList.add('difficulties__button');
    shake.classList.add('difficulties__shake-button');
    shake.innerText = 'Замешать колоду';

    difficultiesWrapper.appendChild(difficultiesDiv);

    difficultiesWrapper.appendChild(shake);
}
