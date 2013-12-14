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
	console.log("Request for " + pathname + " received.");
	var params = pathname.split("/");
	console.log(params);

	if(pathname == "/cards/"+params[2])
	{
		console.log("WOOOOOOOOO")
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
	console.log(pathname)
 	
}

console.log("Code Running...");

io.set('log level', 1); 
 
io.sockets.on('connection', function(socket){
  //send data to client
  setInterval(function(){
    socket.emit('date', {'date': new Date()});
  }, 1000);
 
  //recieve client data
  socket.on('client_data', function(data){
    process.stdout.write(data.letter);
  });

  socket.on('player_name', function(name){
  	console.log('in server...');
  	var result = addPlayerToTable(name);
  	if (result == -1){
  		console.log("table full");
  	}
  	else {
  		console.log("player added id: "+result);
  		socket.emit('player', result.id);
  	}
  });
   socket.on('deal', function(id){
   	socket.emit('hand', table.players[id].hand);
   	console.log(table.players[id].hand);
  });
   socket.on('bid', function(id, bid){
   	bidcounter++;
   	if(bid > highBid && bid <= 10){
   		bidInfo.highBid = bid;
   		bidInfo.highBidder = id;
   	}
   	socket.emit('bid', table.players[id].hand);
   	console.log(table.players[id].hand);
  });


});

//game code
//var tables [];
var tablesFull = false;

var table = new Object();
table.num_players = 0;
table.id =0;
table.deck = shuffleDeck(); 
table.players = [];

var bidcounter = 0;

var bidInfo = new Object();
bidInfo.highBid=3;
bidInfo.highBidder=0;
bidInfo.suit=0;

for(var i = 0; i < 3; i++){
	var player = new Object();
    player.id = table.num_players;
    player.hand = [];
    player.points = 0;
    table.players.push(player);
    table.num_players++;
}

function addPlayer(name){
    var player = new Object();
    player.id = table.num_players;
    player.hand = [];
    player.points = 0;
    table.players.push(player);
    return player;
}

function addPlayerToTable(name){
	console.log("adding player...");
	if(table.num_players == 4){
		return -1;
	}
	var player = addPlayer(name);
	table.players.push(player);
	table.num_players++;
	if(table.num_players == 4){
		tablesFull == true;
		distrib();
	}
	return player;
}



 function shuffleDeck(){
     var x = -1;
     var temp;
     deck = [];
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

     //distrib();
     // for (var l = 0; l<54; l++) {
     //   addTheImage(players[0].hand[l]);
     // };
    }

function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

function distrib(){
 for(var i = 0; i < 54; i++){
   var card = deck.pop();
   table.players[i%4].hand.push(card);
 }
 sortHands();
}

function sortHands(){
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