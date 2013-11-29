
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.math.*;

/**
 * 
 */

/**
 * @author Michael
 *
 */
public class Deck {

	private ArrayList<Card> deck = new ArrayList<Card>();
	
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
		Random random = new Random();
        for (int i = 0; i < deck.size(); i++)
        {
        	
            int j = random.nextInt(deck.size());
            Card temp = deck.get(i); deck.set(i, deck.get(j)); deck.set(j,temp);
        }
        
	}

	

	public Card nextCard(){
		Card card = deck.get(iterator);
		iterator++;
		return card;
	}
	
	public ArrayList<Card> getDeck() {
		return deck;
	}

	public void setDeck(ArrayList<Card> deck) {
		this.deck = deck;
	}
	
	
	public int getIterator() {
		return iterator;
	}

	public void setIterator(int iterator) {
		this.iterator = iterator;
	}
	
}

