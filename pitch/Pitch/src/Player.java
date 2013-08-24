import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class Player {
	private Hand hand;
	private int bid; 
	
	public Player() {
		super();
		hand = new Hand();
		bid = 0;
	}
	
	public boolean canPlay(int suit){
		for(Card card : hand.getHand()){
			if(card.getSuit() == suit){
				return true;
			}
			else if(card.offJack(suit)){
				return true;
			}
		}
		return false;
	}

	public Collection<Card> getHand() {
		return hand.getHand();
	}

	public void setHand(Hand hand) {
		this.hand = hand;
		//this.hand.orderHand();
	}

	public int getBid() {
		return bid;
	}

	public void setBid(int bid) {
		this.bid = bid;
	}

	public void showHand() {
		hand.displayHand();
	}
	
	public void addToHand(Card card){
		hand.addCard(card);
	}
	
	public int cardsNeeded(int suit){
		int needed = -3;
		Collection<Card> iteratedHand = new ArrayList<Card>();
		iteratedHand.addAll(getHand());
		for(Card card : iteratedHand){
			if(card.getSuit() != suit){
				if(!card.offJack(suit)){
					hand.removeCard(card);
					needed++;
				}
			}
		}
		return needed;
	}
	
	
	
}
