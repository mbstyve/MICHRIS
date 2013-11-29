
public class Deal {
	public Deck deck;
	private Hand playerOneHand = new Hand();
	private Hand playerTwoHand = new Hand();
	private Hand playerThreeHand = new Hand();
	private Hand playerFourHand = new Hand();

	public Deal() {
		super();
		Deck originalDeck = new Deck();
		
		//originalDeck.ShuffleDeck();
		deck = originalDeck;
		deck.ShuffleDeck();
		dealHands();
	}

	private void dealHands(){
		for(int i = 0; i < 36; i++){
			if(i % 4 == 0){
				playerOneHand.addCard(deck.getCard(i));
			}
			if(i % 4 == 1){
				playerTwoHand.addCard(deck.getCard(i));
			}
			if(i % 4 == 2){
				playerThreeHand.addCard(deck.getCard(i));
			}
			if(i % 4 == 3){
				playerFourHand.addCard(deck.getCard(i));
			}
		}

	}
	

	public Deck getDeck() {
		return deck;
	}

	public void setDeck(Deck deck) {
		this.deck = deck;
	}

	public Hand getPlayerOneHand() {
		return playerOneHand;
	}

	public void setPlayerOneHand(Hand playerOneHand) {
		this.playerOneHand = playerOneHand;
	}

	public Hand getPlayerTwoHand() {
		return playerTwoHand;
	}

	public void setPlayerTwoHand(Hand playerTwoHand) {
		this.playerTwoHand = playerTwoHand;
	}

	public Hand getPlayerThreeHand() {
		return playerThreeHand;
	}

	public void setPlayerThreeHand(Hand playerThreeHand) {
		this.playerThreeHand = playerThreeHand;
	}

	public Hand getPlayerFourHand() {
		return playerFourHand;
	}

	public void setPlayerFourHand(Hand playerFourHand) {
		this.playerFourHand = playerFourHand;
	}
	
}
