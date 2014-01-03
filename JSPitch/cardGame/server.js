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
    var table = tables[bidPacket.table];

    table.bidcounter++;
    table.bidInfo.curBidder= (table.bidInfo.curBidder+1)%4;

   	if(bidPacket.bid > table.bidInfo.highBid && bidPacket.bid <= 10){
   		table.bidInfo.highBid = bidPacket.bid;
   		table.bidInfo.highBidder = bidPacket.id;
   	}
    if(table.bidcounter >= 4){
      console.log("Player "+table.bidInfo.highBidder+" won the bid");
      table.bidInfo.bidWinner = table.bidInfo.highBidder;
    }
    io.sockets.emit('bid', table.bidInfo);
  });

   socket.on('suit', function(suitPacket){

    console.log("**********The Suit is "+suitPacket.suit+"***********");

    table = tables[suitPacket.table];
    table.bidInfo.suit = suitPacket.suit;
    table.bidInfo.suitId = suitPacket.id;
    table.gameInfo.turn = table.bidInfo.bidWinner;
    io.sockets.emit('bid', table.bidInfo); //TODO: for multiple tablesio.sockets.in('table').emit('suit', bidInfo);

    callRiverDeal(table);
  });

  //  socket.on('cardPlayed', function(card){
  //   gameInfo.curPlayed.push(card);
  //  })
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
    if(playerIdx == table.bidInfo.bidWinner) continue;
    cardIdx = 0;
    num_needed=-3;
    tempHand = table.players[playerIdx].hand;
    for(var i = 0; i<9; i++){

      card = table.players[playerIdx].hand[cardIdx];

      console.log("Rearranging player: "+playerIdx+" card: "+cardIdx);
      console.log(card.suit);
      console.log(table.bidInfo.suitId);
      if(card.suit!=table.bidInfo.suitId && card.suit!=5){ //if NOT apart of Suit or Joker
        if(card.val!=10){ //if NOT jack
          num_needed++;
          table.players[playerIdx].hand.splice(cardIdx,1);
          console.log("card removed "+card.suit);
        } else{
          if(card.suit+table.bidInfo.suitId!=1&&card.suit+table.bidInfo.suitId!=5){ //if NOT offJack (pretty cool way I must say)
            num_needed++;
            table.players[playerIdx].hand.splice(cardIdx,1);
            console.log("card removed "+card.suit);
          } else cardIdx++;
        }
      } else cardIdx++;
    }
    if(num_needed>=0){
      for(var i = 0; i < num_needed; i++){
        card = table.deck.pop();
        table.players[playerIdx].hand.push(card);
      }
    } else{
    //TODO: remove excess cards
    }
  }

  //redistrib new hands
  for(var i = 0; i < 4; i++){
    console.log(table.players[i].roomID+" REdistributing...");

    io.sockets.sockets[table.players[i].roomID].emit('hand', table.players[i].hand);
    
    console.log(table.players[i].roomID+" REdistributed");
  
  }

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