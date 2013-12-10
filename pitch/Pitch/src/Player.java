import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Scanner;

public class Player {
	private Hand hand;
	private int bid;
	public String name = "";
	public int playerNum;
	public boolean isDealer = false;
	public int teamPoints = 0;
	public int handPoints = 0;

	public Player(String Name, int playerNumber) {
		super();
		hand = new Hand();
		bid = 0;
		this.name = Name;
		this.playerNum = playerNumber;
	}

	public boolean canPlay(int suit) {
		for (Card card : hand.getHand()) {
			if (card.getSuit() == suit) {
				return true;
			} else if (card.offJack(suit)) {
				return true;
			}
		}
		return false;
	}

	public ArrayList<Card> getHand() {
		return hand.getHand();
	}

	public void setHand(Hand hand) {
		this.hand = hand;
		// this.hand.orderHand();
	}

	public int getBid() {
		return bid;
	}

	public void setBid(int bid) {
		this.bid = bid;
	}

	public void showHand() {
		System.out.println(this.name);
		hand.displayHand();
		System.out.println("");
	}

	public void removeToSize() {
		Scanner penis = new Scanner(System.in);
		int removeCount = 0;
		ArrayList<Card> removed = new ArrayList<Card>();
		while (this.getHand().size() > 6) {
			// prompt remove card
			System.out.println("Select card to remove():");
			this.showHandIt();
			int cardToBeRemoved = penis.nextInt();

			if (cardToBeRemoved < this.getHand().size() && cardToBeRemoved >= 0) {
				removed.add(this.getHand().get(cardToBeRemoved));
				removeCount++;
				this.getHand().remove(cardToBeRemoved);

			}
			if (removeCount > 0) {
				System.out.println((removeCount) + " removed.");
				for (int j = 0; j < removed.size(); j++) {
					System.out.print(removed.get(j).toString());
				}
			}
		}
	}

	public void fillBidderHand(Deck deck, int suitIdx) {
		ArrayList<Card> temp = new ArrayList<Card>();
		int i = 0;

		while (deck.getIterator() < 54) {
			Card next = deck.nextCard();
			if (next.getSuit() == suitIdx || next.offJack(suitIdx)
					|| next.getSuitName().equals("Joker")) {
				hand.addCard(next);
			} else {
				temp.add(next);
			}
		}
		while (this.getHand().size() < 6) {
			hand.addCard(temp.get(i));
			i++;
		}
	}

	public void showHandIt() {
		hand.displayHandWithInterator();
	}

	public void addToHand(Card card) {
		hand.addCard(card);
	}

	public int cardsNeeded(int suit) {
		int needed = -3;
		Collection<Card> iteratedHand = new ArrayList<Card>();
		iteratedHand.addAll(getHand());
		for (Card card : iteratedHand) {
			if (card.getSuit() != suit) {
				if (!card.offJack(suit)) {
					hand.removeCard(card);
					needed++;
				}
			}
		}
		return needed;
	}

	public Card playCard(int suit) {
		Scanner play = new Scanner(System.in);
		int cardPlayedIdx = 0;
		Card cardPlayed;
		do {
			do {
				System.out.println(this.name + " select a card:");
				this.showHandIt();
				cardPlayedIdx = play.nextInt();
			} while (cardPlayedIdx < 0 || cardPlayedIdx > this.getHand().size()
					|| this.getHand().size() <= 0);
			cardPlayed = hand.getHand().get(cardPlayedIdx);
		} while (!playableCard(cardPlayed, suit));
		hand.getHand().remove(cardPlayedIdx);
		return cardPlayed;

	}

	private boolean playableCard(Card card, int suit) {
		if (card.getSuit() == suit || card.offJack(suit)
				|| card.getSuitName().equals("Joker"))
			return true;
		for (Card c : this.getHand()) {
			if (c.getSuit() == suit || c.offJack(suit)
					|| card.getSuitName().equals("Joker")) {
				return false;
			}
		}
		return false;
	}

}
