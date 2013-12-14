var game = require("./game");

var deck = game.createDeck();  
var mydeck = game.shuffleDeck(deck);  
console.log("Size of deck before draw: " + mydeck.length);  
console.log("Drawing 5 cards.");  
var hand = game.draw(mydeck, 5, '', true);  
console.log("Size of deck after draw: " + mydeck.length);  
console.log("Cards in hand:");  
console.log(hand);  
console.log();  
console.log("Now I'll draw a card");  
var draw = game.draw(mydeck, 1, hand, false);  
console.log(draw);  
console.log("Size of deck after drawing one card: " + mydeck.length);  
console.log("So all cards in my hand are: ");  
console.log(hand);  
//////
console.log();  
console.log("Now I'll draw 3 cards");  
var draw = game.draw(mydeck, 3, hand, false);  
console.log(draw);  
console.log("Size of deck after drawing 3 cards: " + mydeck.length);  
console.log("So all cards in my hand are: ");  
console.log(hand);  
console.log();  
console.log("I'll play one card now, dropping the last card.");  
console.log()  
var lastCard = hand.length-1;  
console.log("Last card's index: " + lastCard);  
var newHand = game.playCard(1, hand, lastCard);  
console.log("Cards in my new hand are:");  
console.log(newHand);  
console.log();  
console.log("I'll play the third card:");  
var thirdCard = 2; //index of 3rd card is 2  
console.log("Index of the third card: " + thirdCard);  
var evenNewerHand = game.playCard(1, newHand, thirdCard);  
console.log("Cards now in my hand hand are:");  
console.log(evenNewerHand);  
console.log();  
console.log("Size of deck should not change: " + mydeck.length);  