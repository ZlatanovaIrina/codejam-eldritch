import ancients from "./assets/Ancients/index.js";
import difficulties from './data/difficulties.js';
import ancientsData from './data/ancients.js';
import stages from './data/stages.js';
import cards from './data/mythicCards/index.js';

let ancientActiveData = {};
document.addEventListener('DOMContentLoaded', main);

function main() {

    createAncientsDiv();
    addDifficultiesButtons();

    addStagesDiv();
    action();

}

function action() {
    // const $ancientsItem = document.querySelectorAll('.ancients__item');

    // $ancientsItem.forEach(item => clickListener(item));

    // function clickListener(el) {
    //     el.addEventListener('click', function(event) {

    //         $ancientsItem.forEach(function(item) {
    //             item.classList.remove('ancients__item_active');
    //         });

    //         const card = event.target;
    //         card.classList.add('ancients__item_active');
            
    //         fillStages(card);

    //     });
    // }

    // const $difficultiesButton = document.querySelectorAll('.difficulties__button');

    // $difficultiesButton.forEach(item => clickListener(item));

    // function clickListener(el) {
    //     el.addEventListener('click', function(event) {

    //         $difficultiesButton.forEach(function(item) {
    //             item.classList.remove('difficulties__button_active');
    //         });

    //         const card = event.target;
    //         card.classList.add('difficulties__button_active');
            
    //         fillStages(card);

    //     });
    // }



    const $ancientsItem = document.querySelectorAll('.ancients__item');
    activateElementOnClick($ancientsItem, 'ancients__item_active');

    const $difficultiesButton = document.querySelectorAll('.difficulties__button');
    activateElementOnClick($difficultiesButton, 'difficulties__button_active');

    const shakeButton = document.querySelector('.shake-button');
    shakeButton.addEventListener('click', shake);

    
}

function shake() {
    if (!this.classList.contains('shake-button_disabled')) {
        const difficult = document.querySelector('.difficulties__button_active').value;

        console.log(difficult);
        console.log(cards['brownCards']);
        console.log(ancientActiveData);

        let greenCardsNeedCount = 0;
        let brownCardsNeedCount = 0;
        let blueCardsNeedCount = 0;

        for (let key in ancientActiveData) {
            greenCardsNeedCount += ancientActiveData[key]['greenCards'];
            brownCardsNeedCount += ancientActiveData[key]['brownCards'];
            blueCardsNeedCount += ancientActiveData[key]['blueCards'];
        }

        let greenCardsNeed = {};
        let brownCardsNeed = {};
        let blueCardsNeed = {};
    }

}

function activateElementOnClick(collection, classForAdd) {

    collection.forEach(item => clickListener(item));

    function clickListener(el) {
        el.addEventListener('click', function(event) {

            const card = event.target;

            if (card.classList.contains('ancients__item')) {
                const shakeButton = document.querySelector('.shake-button');
                shakeButton.classList.remove('shake-button_disabled');
            }

            collection.forEach(function(item) {
                item.classList.remove(classForAdd);
            });

            
            card.classList.add(classForAdd);
            
            fillStages(card);

        });
    }
    
}

function fillStages(card) {
    const ancientNeed = card.getAttribute('data-ancient');

    ancientsData.forEach (function(ancient) {
        if (ancient['id'] === ancientNeed) {
            ancientActiveData['firstStage'] =  ancient['firstStage'];
            ancientActiveData['secondStage'] =  ancient['secondStage'];
            ancientActiveData['thirdStage'] =  ancient['thirdStage'];
        }
    });

    for (let key in ancientActiveData) {
        for (let key_2 in ancientActiveData[key]) {
            const $colorCardsSpan = document.querySelectorAll('.color-cards__item');

            $colorCardsSpan.forEach(colorCard => {
                const dataStage = colorCard.getAttribute('data-stage');
                const dataOrder = colorCard.getAttribute('data-order');

                if ((dataStage === key) && (dataOrder === key_2)) {
                    colorCard.textContent = ancientActiveData[key][key_2];
                }
            })
        }
    }
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
        ancientsItem.setAttribute('data-ancient', key);
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
        if (obj['id'] === 'easy') {
            difficultiesItem.classList.add('difficulties__button_active');
        }

        difficultiesItem.value = obj['id'];
        difficultiesItem.innerText = obj['name'];
        difficultiesDiv.appendChild(difficultiesItem);
    });

    const shake = document.createElement('button');
    shake.classList.add('shake-button');
    shake.classList.add('shake-button_disabled');
    shake.innerText = 'Замешать колоду';

    difficultiesWrapper.appendChild(difficultiesDiv);

    difficultiesWrapper.appendChild(shake);
}

function addStagesDiv() {
    const $wrapper = document.querySelector('.wrapper__header');

    const stagesDiv = document.createElement('div');
    stagesDiv.classList.add('stages');

    stages.forEach(function (obj) {

        const stageContent = document.createElement('div');
        stageContent.classList.add('stages__content');
        stageContent.classList.add(`stages__${obj['id']}`);

        const stageItem = document.createElement('div');
        stageItem.classList.add('stages__item');
        
        stageItem.textContent = obj['name'];

        const colorCards = document.createElement('div');
        colorCards.classList.add('stages__color-cards');

        const firstColorCardsSpan = document.createElement('span');
        firstColorCardsSpan.classList.add('color-cards__item');
        firstColorCardsSpan.classList.add('color-cards__first');
        firstColorCardsSpan.setAttribute('data-stage', obj['id']);
        firstColorCardsSpan.setAttribute('data-order', 'greenCards');
        firstColorCardsSpan.textContent = '0';

        const secondColorCardsSpan = document.createElement('span');
        secondColorCardsSpan.classList.add('color-cards__item');
        secondColorCardsSpan.classList.add('color-cards__second');
        secondColorCardsSpan.setAttribute('data-stage', obj['id']);
        secondColorCardsSpan.setAttribute('data-order', 'brownCards');
        secondColorCardsSpan.textContent = '0';

        const thirdColorCardsSpan = document.createElement('span');
        thirdColorCardsSpan.classList.add('color-cards__item');
        thirdColorCardsSpan.classList.add('color-cards__third');
        thirdColorCardsSpan.setAttribute('data-stage', obj['id']);
        thirdColorCardsSpan.setAttribute('data-order', 'blueCards');
        thirdColorCardsSpan.textContent = '0';

        colorCards.appendChild(firstColorCardsSpan);
        colorCards.appendChild(secondColorCardsSpan);
        colorCards.appendChild(thirdColorCardsSpan);


        stageContent.appendChild(stageItem);
        stageContent.appendChild(colorCards);

        stagesDiv.appendChild(stageContent);
    })

    $wrapper.appendChild(stagesDiv);
}