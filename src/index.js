const gameData = {
  name: 'Dino cards',
  cards: [
    'img/dino1.png',
    'img/dino2.png',
    'img/dino3.png',
    'img/dino4.png'
  ],
  back: 'img/gear.png',
  columns: 4
};

var DisableClicks = false;
var LastCard = null;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createCard(imgSrc, backSrc) {
  let html = `<div class="card-inner">
      <div class="card-front">
        <img src="${backSrc}">
      </div>
      <div class="card-back">
        <img src="${imgSrc}">
      </div>
    </div>`;
  let card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = html;
  let area = document.getElementById('area');
  area.appendChild(card);
  return html;
}

function createGame(data) {
  let listCards = []
  for (let i = data.cards.length - 1; i >= 0; i--) {
    listCards.push(data.cards[i]);
    listCards.push(data.cards[i]);
  }
  listCards = shuffle(listCards);
  listCards.sort(function() {return Math.random() - 0.5});
  for (let i = listCards.length - 1; i >= 0; i--) {
    createCard(listCards[i], data.back);
  }
  if (data.columns) {
    let columnsStyle = 'auto '.padEnd('auto '.length * data.columns, 'auto ').slice(0, -1);
    document.getElementById('area').style.gridTemplateColumns = columnsStyle;
  }
  document.querySelector('content h1').innerHTML = data.name; 
}

function setMessage(message) {
  document.querySelector('content h2').innerHTML = message;
}

function FlipCard(card, callback) {
  card.classList.add('card-flipped');
  setTimeout(callback, 900);
}

function unFlipCards(firstCard, secondCard, callback) {
  firstCard.classList.remove('card-flipped');
  if(secondCard) {
    secondCard.classList.remove('card-flipped');
  }
  setTimeout(callback, 900);
}

function getReference(card) {
  let inner = card.children[0];
  let back  = inner.children[1];
  let img   = back.children[0];
  return img.src;
}

function isMatch(firstCard, secondCard) {
  return getReference(firstCard) == getReference(secondCard);
}

function CardClick() {
  if (DisableClicks) return;
  var _currentCard = this;
  if (LastCard && LastCard == _currentCard) {
    return;
  }
  DisableClicks = true;
  FlipCard(_currentCard, () => {
    let matched = false;
    if (LastCard) {
      if (isMatch(_currentCard, LastCard)) {
        matched = true;
        hiddenCouples--;
        _currentCard.removeEventListener('click', CardClick);
        LastCard.removeEventListener('click', CardClick);
        if (hiddenCouples == 0) {
          setMessage('Game Complete!!!');
        }
        else {
          DisableClicks = false;
        }
      }
      else {
        unFlipCards(_currentCard, LastCard, () => DisableClicks = false);
      }
      LastCard = null;
    }
    else {
      DisableClicks = false;
      LastCard = _currentCard;
    }
  });
}
createGame(gameData)
const cards = document.querySelectorAll('.card');
var hiddenCouples = cards.length / 2;
cards.forEach( card => card.addEventListener('click', CardClick));

let reload = document.getElementById('reload');
reload.addEventListener('click', ()=> location.reload())