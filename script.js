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

    const $ancientsItem = document.querySelectorAll('.ancients__item');
    activateElementOnClick($ancientsItem, 'ancients__item_active');

    const $difficultiesButton = document.querySelectorAll('.difficulties__button');
    activateElementOnClick($difficultiesButton, 'difficulties__button_active');

    const shakeButton = document.querySelector('.shake-button');
    shakeButton.addEventListener('click', shake);

}

function shake() {
    let cardsCopyShuffled = structuredClone(cards);
    for (let key in cardsCopyShuffled) {
        shuffle (cardsCopyShuffled[key]);
    }

    if (!this.classList.contains('shake-button_disabled')) {
        const difficult = document.querySelector('.difficulties__button_active').value;

        let greenCardsNeedCount = 0;
        let brownCardsNeedCount = 0;
        let blueCardsNeedCount = 0;

        let greenCardsNeed = [];
        let brownCardsNeed = [];
        let blueCardsNeed = [];

        for (let key in ancientActiveData) {
            greenCardsNeedCount += ancientActiveData[key]['greenCards'];
            brownCardsNeedCount += ancientActiveData[key]['brownCards'];
            blueCardsNeedCount += ancientActiveData[key]['blueCards'];
        }

        let cardsCopyColor = {};

        switch (difficult) {
            case 'easy':
                needCardsByDifficult(cardsCopyShuffled, cardsCopyColor, 'hard');

                choseCards(cardsCopyColor['greenCards'], greenCardsNeedCount, greenCardsNeed);
                choseCards(cardsCopyColor['brownCards'], brownCardsNeedCount, brownCardsNeed);
                choseCards(cardsCopyColor['blueCards'], blueCardsNeedCount, blueCardsNeed);

                break;
            case 'normal':
                cardsCopyColor = structuredClone(cardsCopyShuffled);

                choseCards(cardsCopyColor['greenCards'], greenCardsNeedCount, greenCardsNeed);
                choseCards(cardsCopyColor['brownCards'], brownCardsNeedCount, brownCardsNeed);
                choseCards(cardsCopyColor['blueCards'], blueCardsNeedCount, blueCardsNeed);
            break;
            case 'hard':
                needCardsByDifficult(cardsCopyShuffled, cardsCopyColor, 'easy');

                choseCards(cardsCopyColor['greenCards'], greenCardsNeedCount, greenCardsNeed);
                choseCards(cardsCopyColor['brownCards'], brownCardsNeedCount, brownCardsNeed);
                choseCards(cardsCopyColor['blueCards'], blueCardsNeedCount, blueCardsNeed);
            break;
        
            default:
                break;
        }

        let cardsNeed = {};
        cardsNeed['greenCards'] = greenCardsNeed;
        cardsNeed['brownCards'] = brownCardsNeed;
        cardsNeed['blueCards'] = blueCardsNeed;

        sortСardsByStages(cardsNeed, ancientActiveData);

    }
}

function sortСardsByStages(cards, ancientActiveData) {
    
    const stackOfCardsResult = {};
    stackOfCardsResult['thirdStage'] = [];
    stackOfCardsResult['secondStage'] = [];
    stackOfCardsResult['firstStage'] = [];

    for (let key in ancientActiveData) { 
        for (let key_2 in ancientActiveData[key]) {          
            for (let i = 0; i < ancientActiveData[key][key_2]; i++) {
                stackOfCardsResult[key].push(cards[key_2][i]);
            }
        }
    }
    
    const stackOfCardsResultShuffled = structuredClone(stackOfCardsResult);
    for (let key in stackOfCardsResultShuffled) {
        shuffle(stackOfCardsResultShuffled[key]);
    }

    layOutTheСards(stackOfCardsResultShuffled);
}

function layOutTheСards(cardsForLayOut) {
    console.log(cardsForLayOut);
    const wrapperBottom = document.querySelector('.wrapper__bottom');
    wrapperBottom.innerHTML = '';

    const stagesDiv = document.createElement('div');
    stagesDiv.classList.add('cards-by-stages');

    wrapperBottom.appendChild(stagesDiv);

    for (let key in cardsForLayOut) {

        const stageStackDiv = document.createElement('div');
        stageStackDiv.classList.add(key);
        stageStackDiv.classList.add('cards-by-stages__stages');
        stageStackDiv.setAttribute('data-stage', key);

        cardsForLayOut[key].forEach(function(item){
            const card = document.createElement('span');
            card.classList.add('cards-by-stages__item');
            card.classList.add(`${key}__item`);
            card.setAttribute('data-card_color', `${item['color']}Cards`);
            card.setAttribute('data-card_id', item['id']);
            card.setAttribute('data-background_url', item['cardFace']);
            // card.style.background = `url(${item['cardFace']}) no-repeat center`;
            card.style.background = `url(assets/mythicCardBackground.png) no-repeat center`;
            card.style.backgroundSize = `100%`;
            stageStackDiv.appendChild(card);
        });

        stagesDiv.appendChild(stageStackDiv);
    }

    cardStackClickListener();
}

function cardStackClickListener() {
    const cardItem = document.querySelectorAll('.cards-by-stages__item');
    const $wrapperBottom = document.querySelector('.wrapper__bottom');

    const showedCardContainer = document.createElement('div');
    showedCardContainer.classList.add('showed-card-container');

    $wrapperBottom.appendChild(showedCardContainer);


    cardItem.forEach(function(item) {
        item.addEventListener('click', function () {
            if (!this.classList.contains('moved')) {
                
                const stack = document.querySelector('.cards-by-stages');
                const lastInStack = stack.lastChild.firstChild;

                console.log(lastInStack);

                const $showedCardContainer = document.querySelector('.showed-card-container');

                const lastInStackBack = lastInStack.getAttribute('data-background_url');
                lastInStack.style.background = `url(${lastInStackBack}) no-repeat`;
                lastInStack.style.backgroundSize = `100%`;
                lastInStack.classList.add('moved');

                $showedCardContainer.appendChild(lastInStack);

                const stage = stack.lastChild.getAttribute('data-stage');
                const cardColor = lastInStack.getAttribute('data-card_color');

                const $stageColorCardsItem = document.querySelector(`.color-cards__item[data-stage='${stage}'][data-order='${cardColor}']`);
                
                let count = +$stageColorCardsItem.textContent;

                $stageColorCardsItem.textContent = count - 1;


                if (stack.lastChild.childNodes.length == 0) {
                    stack.removeChild(stack.lastChild);
                }

                stack.lastChild.removeChild(lastInStack);

            }
        })
    });
}

function needCardsByDifficult(cardsCopyShuffled,cardsCopyColor, noNeedDifficult) {
    for (let key in cardsCopyShuffled) {
        cardsCopyColor[key] = [];
        cardsCopyShuffled[key].forEach(function(item) {
            if (item['difficulty'] !== noNeedDifficult) {
                cardsCopyColor[key].push(item);
            }
        });
    }
}

function choseCards(cardsCopyColor, cardsNeedCount, cardsNeed) {
    let i = cardsNeedCount - 1;
    while (i >= 0) {
        cardsNeed.push(cardsCopyColor[i]);
        i--;
    }

}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
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

    const difficultAndStages = document.createElement('div');
    difficultAndStages.classList.add('difficults-and-stages')

    $wrapper.appendChild(difficultAndStages);

    const difficultiesWrapper = document.createElement('div');
    difficultiesWrapper.classList.add('difficulties__wrapper');

    difficultAndStages.appendChild(difficultiesWrapper);

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
    const $difficultAndStages = document.querySelector('.difficults-and-stages');

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

    $difficultAndStages.appendChild(stagesDiv);
}