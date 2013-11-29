import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class Hand {
	private ArrayList<Card> hand = new ArrayList<Card>();

	public void addCard(Card card) {	
		hand.add(card);
	}
	
	public void removeCard(Card card){
		hand.remove(card);
	}

	public Hand() {
		super();
	}
		
	public void orderHand(){
		ArrayList<Card> newHand = new ArrayList<Card>();
		for(int i = 1; i < 5; i++){
			for(int j = 2; j < 15; j++){
				for(Card card : hand){
					if(card.getSuit() == i && card.getValue() == j){
						newHand.add(card);
					}
				}
			}
		}
		hand = newHand;
	}
	
	public void displayHand(){
		for(Card card : hand){
			System.out.println(card.getValueName()+" of "+card.getSuitName());
		}
	}
	
	public void displayHandWithInterator(){
		int i = 0;
		for(Card card : hand){
			System.out.println(i + ": " +card.getValueName()+" of "+card.getSuitName());
			i++;
		}
	}
	
	public ArrayList<Card> getHand(){
		return hand;
	}
}
