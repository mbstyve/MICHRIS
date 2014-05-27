var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , express = require('express')
  , url = require('url')
 var expressApp = express();

app.listen(8080);

expressApp.use(express.static(__dirname));

function handler (req, res) {
	var pathname = url.parse(req.url).pathname; 
	var url_parts = url.parse(req.url, true);
	var param = url_parts.params;
	//console.log("Request for " + pathname + " received.");
	var params = pathname.split("/");
	//console.log(params);

	if(pathname == "/cards/"+params[2])
	{
		fs.readFile(__dirname + '/cards/'+params[2],
		function (err, data) {
	    	if (err) {
	      		res.writeHead(500);
	      		return res.end('Error loading index.html');
	    	}

	    	res.setHeader("Content-Type", "Image/png");
	    	res.writeHead(200);
	    	res.end(data);
	  	});
	}else if(pathname == "/bid/"){
		fs.readFile(__dirname + '/bid.js', params,
		function (err, data) {
	    	if (err) {
	      		res.writeHead(500);
	      		return res.end('Error loading index.html');
	    	}

	    	res.setHeader("Content-Type", "Image/png");
	    	res.writeHead(200);
	    	res.end(data);
	  	});
	}
	else if(pathname = '/')
	{
		fs.readFile(__dirname + '/index.html',
		function (err, data) {
	    	if (err) {
	      		res.writeHead(500);
	      		return res.end('Error loading index.html');
	    	}

	    res.writeHead(200);
	    res.end(data);
	  });
	} 
	//console.log(pathname)
 	
}

console.log("Server Running...");

io.set('log level', 1); 
 
io.sockets.on('connection', function(socket){
  //send data to client
  // setInterval(function(){
  //   socket.emit('date', {'date': new Date()});
  // }, 1000);

  // setInterval(function(){
  //   io.sockets.in('T0').emit('beginBid', bidInfo)}, 1000);

  // setInterval(function(){
  //   io.sockets.in('T0').emit('game', gameInfo)}, 5000);
 
  // //recieve client data
  // socket.on('client_data', function(data){
  //   process.stdout.write(data.letter);
  // });

  socket.on('add_Player', function(name){
    if(status.tablesFull){
      addTable();
    }

    socket.join(status.numTables-1);
    var player = createPlayer(name, socket.id);
  	
    console.log("player added id: "+player.id);

  	socket.emit('player', player);

    if(status.tablesFull){
      for(var i = 0; i < 4; i++){
        console.log(tables[status.numTables-1].players[i].roomID+" distributing...");

        io.sockets.sockets[tables[status.numTables-1].players[i].roomID].emit('hand', tables[status.numTables-1].players[i].hand);
        
        console.log(tables[status.numTables-1].players[i].roomID+" distributed");
      
      }
      
      console.log("Emitting bidInfo to all clients");

      var table = tables[status.numTables-1];
      io.sockets.emit('bid', table.bidInfo); //sockets.sockets[table.players[(table.dealer+1)%4].roomID]
    }

  });


  // socket.on('deal', function(id){
  //  	socket.emit('hand', table.players[id].hand);
  //  	console.log(table.players[id].hand);
  // });


   socket.on('bid', function(bidPacket){
    //var table = tables[bidPacket.table];

    tables[bidPacket.table].bidcounter++;
    tables[bidPacket.table].bidInfo.curBidder= (tables[bidPacket.table].bidInfo.curBidder+1)%4;

   	if(bidPacket.bid > tables[bidPacket.table].bidInfo.highBid && bidPacket.bid <= 10){
   		tables[bidPacket.table].bidInfo.highBid = bidPacket.bid;
   		tables[bidPacket.table].bidInfo.highBidder = bidPacket.id;
   	}
    if(tables[bidPacket.table].bidcounter >= 4){
      console.log("Player "+tables[bidPacket.table].bidInfo.highBidder+" won the bid");
      tables[bidPacket.table].bidInfo.bidWinner = tables[bidPacket.table].bidInfo.highBidder;
      tables[bidPacket.table].gameInfo.turn= tables[bidPacket.table].bidInfo.highBidder;
      tables[bidPacket.table].gameInfo.startedHand = tables[bidPacket.table].bidInfo.highBidder;
    }
    io.sockets.emit('bid', tables[bidPacket.table].bidInfo);
  });

   socket.on('suit', function(suitPacket){

    console.log("**********The Suit is "+suitPacket.suit+"***********");

    //table = tables[suitPacket.table];
    tables[suitPacket.table].bidInfo.suit = suitPacket.suit;
    tables[suitPacket.table].bidInfo.suitId = suitPacket.suitId;
    tables[suitPacket.table].gameInfo.turn = tables[suitPacket.table].bidInfo.bidWinner;

    console.log("Turn "+tables[suitPacket.table].gameInfo.turn);

    tables[suitPacket.table].gameInfo.startedHand = tables[suitPacket.table].bidInfo.bidWinner;

    console.log("Started Hand "+tables[suitPacket.table].gameInfo.startedHand);

    io.sockets.emit('bid', tables[suitPacket.table].bidInfo); //TODO: for multiple tablesio.sockets.in('table').emit('suit', bidInfo);

    console.log("Dealing Rvier");

    callRiverDeal(tables[suitPacket.table]);

    io.sockets.emit('game', tables[suitPacket.table].gameInfo);

  });

   socket.on('cardPlayed', function(playPacket){

    console.log("Card Recieved "+playPacket.card);

    updateGameInfo(playPacket.table, playPacket.card);
    io.sockets.emit('game', tables[playPacket.table].gameInfo);

   })
});

//game code
var status = new Object();
status.numTables=0;
status.tablesFull=true;
status.clients;

var tables = [];
// var clients;
// var tablesFull = false;
// var tableNum = 0;

function addTable(){

  console.log("Creating new table");

  var table = new Object();
  table.num_players = 0;
  table.id =0;
  table.deck = shuffleDeck(); 
  table.players = [];
  table.dealer = 0;
  table.bidcounter = 0;
  
  var bidInfo = new Object();
  bidInfo.curBidder=1;
  bidInfo.highBid=3;
  bidInfo.highBidder=-1;
  bidInfo.suit=-1;
  bidInfo.suitId = -1;
  bidInfo.bidWinner=-1;

  var gameInfo = new Object();
  gameInfo.gameInit = 0;
  gameInfo.turn = -1;
  gameInfo.curPlayed = [];
  gameInfo.startedHand;
  gameInfo.team1HandPoints =0;
  gameInfo.team2HandPoints =0;
  gameInfo.team1GamePoints =0;
  gameInfo.team2GamePoints =0;
  gameInfo.handOver =0;
  gameInfo.gameOver = 0;
  gameInfo.winningTeam =-1;


  table.bidInfo=bidInfo;
  table.gameInfo= gameInfo;
  tables.push(table);

  status.tablesFull = false;
  status.numTables++;


}

// var bidcounter = 3;

// var bidInfo = new Object();
// bidInfo.curBidder=1;
// bidInfo.highBid=3;
// bidInfo.highBidder=;
// bidInfo.suit=-1;
// bidInfo.bidWinner = -1;

var gameInfo = new Object();
gameInfo.gameInit = 0;
gameInfo.turn = -1;
gameInfo.curPlayed = [];


function createPlayer(name, id){
    var player = new Object();
    player.id = tables[status.numTables-1].num_players;
    player.hand = [];
    player.points = 0;
    player.roomID = id; //For full version table.num_players
    player.table = status.numTables-1;

    console.log("num_players= "+tables[status.numTables-1].num_players);

    tables[status.numTables-1].players.push(player);
    tables[status.numTables-1].num_players++;

    if(tables[status.numTables-1].num_players == 4){
      status.tablesFull = true;
      distrib(tables[status.numTables-1]);
    }

    console.log("Created new player: "+player.roomID);

    return player;
}

function deal(tableIdx){
    tables[tableIdx].deck = shuffleDeck(tables[tableIdx].deck);

    distrib(tables[tablesio].deck);

    for(var i = 0; i < 4; i++){
    console.log(tables[tableIdx].players[i].roomID+" distributing...");

    io.sockets.sockets[tables[tableIdx].players[i].roomID].emit('hand', tables[tableIdx].players[i].hand);
    
    console.log(tables[tableIdx].players[i].roomID+" distributed");
  
  }
  
  console.log("Emitting bidInfo to all clients");

  var table = tables[tableIdx];
  io.sockets.emit('bid', table.bidInfo); //sockets.sockets[table.players[(table.dealer+1)%4].roomID]
}

function callRiverDeal(table){
  console.log(table.players[0].hand);
  console.log(table.players[1].hand);
  console.log(table.players[2].hand);
  console.log(table.players[3].hand);

  var num_needed=0;
  var num_to_remove = 0;
  var card;
  var idxToRemove = [];
  var tempHand;
  var cardToRemove;
  var cardIdx;

  for(var playerIdx = 0; playerIdx < 4; playerIdx++){
    cardIdx = 0;
    num_needed=-3;
    //tempHand = table.players[playerIdx].hand;
    for(var i = 0; i<9; i++){

      card = table.players[playerIdx].hand[cardIdx];

      console.log("Rearranging player: "+playerIdx+" card: "+cardIdx);
      //console.log(card.suit);
      //console.log(table.bidInfo.suitId);
      if(card.suit!=table.bidInfo.suitId && card.suit!=4){ //if NOT apart of Suit or Joker
        if(card.val!=10){ //if NOT jack
          console.log("Not of suit or Joker");
          num_needed++;
          table.players[playerIdx].hand.splice(cardIdx,1);
          //console.log("card removed "+card.suit);
        } else{
          if(card.suit+table.bidInfo.suitId!=1&&card.suit+table.bidInfo.suitId!=5){ //if NOT offJack (pretty cool way I must say)
            console.log("Not Off Jack");
            num_needed++;
            table.players[playerIdx].hand.splice(cardIdx,1);
           // console.log("card removed "+card.suit);
          } else cardIdx++;
        }
      } else cardIdx++;
    }

    if(playerIdx == table.bidInfo.bidWinner) continue;

    console.log("Player "+playerIdx+" needs "+num_needed);

    if(num_needed>=0){
      for(var i = 0; i < num_needed; i++){
        card = table.deck.pop();
        table.players[playerIdx].hand.push(card);
        console.log("Adding Card to player "+playerIdx+" card "+i);
      }
    } else{
    //TODO: remove excess cards
    }
  }

  //Give Bid winner the rest of deck
  //num_needed = 6-tables[tableIdx].players[table.bidInfo.bidWinner].hand.length;
  var temp = [];
  var card;
  for(var j = 0; j < table.deck.length;j++){
    card = table.deck.pop();
    if(card.suit == table.bidInfo.suitId || card.suit==5 ||
      (card.val==11 && 
        (card.suit+table.bidInfo.suitId==1||
          card.suit+table.bidInfo.suitId==5))){
    table.players[table.bidInfo.bidWinner].hand.push(card);
    //num_needed--;
    } else {
      temp.push(card);
    }
  }

  while(table.players[table.bidInfo.bidWinner].hand.length < 6){
    card = temp.pop();
    table.players[table.bidInfo.bidWinner].hand.push(card);
  }

  //order Hanfs
  sortHands(table);

  //redistrib new hands
  for(var i = 0; i < 4; i++){
    console.log(table.players[i].roomID+" REdistributing...");

    io.sockets.sockets[table.players[i].roomID].emit('hand', table.players[i].hand);
    
    console.log(table.players[i].roomID+" REdistributed");

    console.log("Begin Play!!!");

  }

}



function updateGameInfo(tableIdx, card){
  console.log("Updating Game Status...");
  console.log("Card suit= "+card.suit);
  console.log("Card val= "+card.val);
  //var table = tables[tableIdx];
  //var gameInfo  = table.gameInfo
  var winningIdx;

  

  for(var i = 0, len = tables[tableIdx].players[tables[tableIdx].gameInfo.turn].hand.length; i < len; i++) {
    if (tables[tableIdx].players[tables[tableIdx].gameInfo.turn].hand.card === card) {
        tables[tableIdx].players[tables[tableIdx].gameInfo.turn].hand.splice(i,1);
    }
}

  tables[tableIdx].gameInfo.turn = (tables[tableIdx].gameInfo.turn+1)%4; //change player turn

  tables[tableIdx].gameInfo.curPlayed.push(card);

    //check to see if current turn is the player who started the hand
  if(tables[tableIdx].gameInfo.curPlayed.length ==4){
    //find winnter
    console.log("hand fin");
    //find winning card index and distribute points
    winningIdx = getWinningIndex(tables[tableIdx]);

    tables[tableIdx].gameInfo.curPlayed.length = 0;

    console.log("Hand Winner is Player "+winningIdx);

     return;
  }

  if(tables[tableIdx].gameInfo.curPlayed.length <4){
    return;
  }

  //check to see if the players are out of cards
  if(tables[tableIdx].players[gameInfo.turn].hand.length ==0){
    //end of hand
    console.log("Hand Over");
    

    //add points
    if(tables[tableIdx].bidInfo.bidWinner%2==0){
      if(tables[table[tableIdx]].gameInfo.team1HandPoints > tables[tableIdx].bidInfo.highBid){
        //add handpoints to game score
        tables[tableIdx].gameInfo.team1GamePoints+=tables[tableIdx].gameInfo.team1HandPoints;
      } else tables[tableIdx].gameInfo.team1GamePoints-=tables[tableIdx].bidInfo.highBid;
      tables[tableIdx].gameInfo.team2GamePoints+=tables[tableIdx].gameInfo.team2HandPoints;
    } else {
      if(tables[table[tableIdx]].gameInfo.team2HandPoints > tables[tableIdx].bidInfo.highBid){
        //add handpoints to game score
        tables[tableIdx].gameInfo.team2GamePoints+=tables[tableIdx].gameInfo.team1HandPoints;
      } else tables[tableIdx].gameInfo.team2GamePoints-=tables[tableIdx].bidInfo.highBid;
      tables[tableIdx].gameInfo.team1GamePoints+=tables[tableIdx].gameInfo.team1HandPoints;
    }

    //check to see if a team has won
    if(tables[tableIdx].gameInfo.team1GamePoints>=32 || tables[tableIdx].gameInfo.team2GamePoints>=32){
      tables[tableIdx].gameInfo.gameOver ==1;
      if(tables[tableIdx].gameInfo.team1GamePoints>tables[tableIdx].gameInfo.team2GamePoints>=32){
        tables[tableIdx].gameInfo.winningTeam=0;
      } else tables[tableIdx].gameInfo.winningTeam=1;
      console.log("Team "+tables[tableIdx].gameInfo.winningTeam+" Won the Game !!");
    } else {
      //play another hand;
     // shuffleDeck(table[tableIdx].deck);
     deal(tableIdx);
    }

  
  }
}


function getWinningIndex(table){
  console.log("Num Players "+table.num_players);
  console.log("CurPlayer.length= "+table.gameInfo.curPlayed.length);
  var highCard =0;
  var highCardVal =0;
  var pointsWon;
  var cards = table.gameInfo.curPlayed;

  for(var i = 0; i < 4; i++){
    console.log(highCard);
    console.log(highCardVal);
    var card = table.gameInfo.curPlayed[i];
    console.log("Suit is "+card.suit)
    if(card.suit == table.bidInfo.suitId || card.suit==4 ||
      (card.val==10 && 
        (card.suit+table.bidInfo.suitId==1||
          card.suit+table.bidInfo.suitId==5))){
      //card is valid
      console.log("Card is valid");
      if(card.val > highCardVal){
        highCard = i;
        highCardVal = card.val;
      } else if(card.val == highCardVal){
        //2 jacks were played
        if(card.suit==table.bidInfo.suitId){
          //select the one that is of suit
          highCard = i;
          highCardVal = card.val;
        }
      }

      //add the point values
      switch (card.val){
        case 8:
        case 9:
        case 10:
        case 11:
        case 14:
          pointsWon ++;
          break;
        case 3:
          pointsWon +=3;
          break;
        case 2:
          if((table.gameInfo.startedHand+i)%4 == 0){
            table.gameInfo.team1HandPoints++;
          } else table.gameInfo.team2HandPoints++;
          break;
      }
    }else console.log("Card is invalid");
  }

  //add points to the correct team
  if((table.gameInfo.startedHand+highCard)%4 == 0){
            table.gameInfo.team1HandPoints = pointsWon;
  } else table.gameInfo.team2HandPoints = pointsWon;

  console.log("Winning index is "+highCard);
  table.gameInfo.turn = highCard;
  table.gameInfo.startedHand = highCard;
  return highCard;
}



 function shuffleDeck(){
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
       card.img = 'cards/'+card.suit+card.val+'.png';
       deck.push(card)
     }

     return shuffle(deck);
    }

function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

function distrib(table){

 console.log("Table "+(status.numTables-1)+" is full, distributing cards now...");
  
 for(var i = 0; i < 36; i++){
   var card = table.deck.pop();
   table.players[i%4].hand.push(card);
 }
 sortHands(table);

 console.log("P0"+table.players[0].hand);
 console.log("P1"+table.players[1].hand);
 console.log("P2"+table.players[2].hand);
 console.log("P3"+table.players[3].hand);

}

function sortHands(table){
 for(var i = 0; i < 4; i++){
   table.players[i].hand.sort(compare);
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