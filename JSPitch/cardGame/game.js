var deck = [];
var players = [];
var cardOnTable = [];
var highBid = 0;
var highBidder = 0;

for(var i = 0; i < 4;i++){
	var player = new Object();
	player.ident = i;
	player.hand = [];
	players.push(player)
}

function alert (){
	alert("hey");
}

function createDeck(){
	var x = -1;
	var temp;
	var deck = [];
	//create cards and add to deck
	for(var i = 0; i < 54; i++){		
		temp = i%13;
		if (temp==0){
			x= x+1;
		}
		var card = new Object();
		card.suit = x;
		card.val = i%13;
		card.img = "cards/"+card.suit+card.val+".png";
		deck.push(card)
	}
	return deck;
}

function shuffleDeck(deck){
	deck = shuffle(deck);
	distrib();
	// for (var l = 0; l<54; l++) {
	// 	addTheImage(players[0].hand[l]);
	// };
  // var i = 54, j, tempi, tempj;
  // if (i === 0) return false;
  // while (--i) {
  //    j = Math.floor(Math.random() * (i + 1));
  //    tempi = deck[i];
  //    tempj = deck[j];
  //    deck[i] = tempj;
  //    deck[j] = tempi;
  //  }
  return deck;
}


function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function addTheImage(card) {
    var img = document.createElement('img');
    img.id = "elem";
    img.src = card.img;
    img.onclick = function() { selectCard(card); };
    document.body.appendChild(img);
}

function selectCard(card){
	var x;
	var r=confirm("You selected "+getName(card));
	if (r==true)
  	{
  		x="You pressed OK!";
  	}
	else
  	{
  		x="You pressed Cancel!";
  	}
document.getElementById("card").innerHTML=x;
}

function getName(card){
	var suitName = "nothing";
	var valName = "nothing";

	if(card.suit == 0){
		suitName = "clubs";
	}
	if(card.suit == 1){
		suitName = "spades";
	}
	if(card.suit == 2){
		suitName = "hearts";
	}
	if(card.suit == 3){
		suitName = "diamonds";
	}
	if(card.suit== 4){
		suitName = "Joker";
		if(card.val == 0){
			valName = "low";
		} else valName = "high";
		return valName + " " + suitName
	}
	if(card.val < 9){
		valName = card.val;
	}
	if(card.val == 9){
		valName = "Jack";
	}
	if(card.val == 10){
		valName = "Queen";
	}
	if(card.val == 11){
		valName = "King";
	}
	if(card.val==12){
		valName = "Ace";
	}
	return valName+" of "+suitName;
}



function distrib(){
	for(var i = 0; i < 36; i++){
		var card = deck.pop();
		players[i%4].hand.push(card);
	}
	sortHands();
}

function sortHands(){
	for(var i = 0; i < 4; i++){
		players[i].hand.sort(compare);
	}
}

function compare(a,b) {
  if (a.suit < b.suit)
     return -1;
  if (a.suit > b.suit)
    return 1;
  if(a.val < b.val)
  	return -1;
  if(a.val > b.val)
  	return 1;
  return 0;
}

function draw(deck, amount, hand, initial) {
  var cards = new Array();
  cards = deck.slice(0, amount);

  deck.splice(0, amount);

  if (!initial) {
    hand.push.apply(hand, cards);
  }

  return cards;
}

function playCard(amount, hand, index) {
  hand.splice(index, amount)
  return hand;
}

function bid(){
	var x;

	var bid=prompt("Please enter your bid",highBid+1);

	if (bid!=null){
  		if(bid > highBid){
  			highBid = bid;
  		}
  		x="Your bid is " + bid;
  		document.getElementById("cards").innerHTML=x;
 	}
}

exports.createDeck = createDeck;
exports.shuffleDeck = shuffleDeck;
exports.draw = draw;
exports.playCard = playCard;