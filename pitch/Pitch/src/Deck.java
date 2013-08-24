
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 
 */

/**
 * @author Michael
 *
 */
public class Deck {

	private List<Card> deck = new ArrayList<Card>();
	private int iterator;
	/**
	 * 
	 */
	public Deck() {
		for(int i = 0; i < 4; i++){
			for(int j = 0; j < 13; j++){
				Card card = new Card(i, j);
				deck.add(card);
			}
		}
		for(int i = 0; i < 2; i++){
			Card card = new Card(i);
			deck.add(card);
		}
		iterator = 36;
	}
		
	public Card getCard(int i){
		return deck.get(i);
	}
	public void ShuffleDeck(){
		Collections.shuffle(deck);
	}

	public List<Card> getDeck() {
		return deck;
	}

	public void setDeck(List<Card> deck) {
		this.deck = deck;
	}

	public Card nextCard(){
		Card card = deck.get(iterator);
		iterator++;
		return card;
	}
	
	public static void main(String args[]){
		Deck deck = new Deck();
		for(int i = 0; i < 54; i++){
			Card card = deck.getCard(i);
			System.out.println("Suit: "+card.getSuit()+"Val: "+card.getValue());
		}
		
	}
}

