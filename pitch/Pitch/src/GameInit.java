import java.util.ArrayList;
import java.util.Collection;
import java.util.Scanner;

public class GameInit {

	public GameInit() {
		ArrayList<Player> playerCollection = new ArrayList<Player>();
		ArrayList<Player> tempPlayers = new ArrayList<Player>();
		boolean roundCard = true;
		int dealer = 3;
		Player pOne = new Player("Player 1: ", 0);
		playerCollection.add(pOne);
		Player pTwo = new Player("Player 2: ", 1);
		playerCollection.add(pTwo);
		Player pThree = new Player("Player 3: ", 2);
		playerCollection.add(pThree);
		Player pFour = new Player("Player 4: ", 3);
		playerCollection.add(pFour);

		while (roundCard) {
			Deal deal = new Deal();
			pOne.setHand(deal.getPlayerOneHand());
			pTwo.setHand(deal.getPlayerTwoHand());
			pThree.setHand(deal.getPlayerThreeHand());
			pFour.setHand(deal.getPlayerFourHand());

			for (Player p : playerCollection) {
				p.showHand();
			}

			GameBid.initializeBidSequence(playerCollection);
			int suit = GameBid.getSuitRep();
			int bid = GameBid.getHighBid();
			int bidderIdx = GameBid.getHighestBidIdx();
			int cardsNeeded = pOne.cardsNeeded(suit);

			if (bidderIdx != 0) {
				pOne.removeToSize();
				for (int i = 0; i < cardsNeeded; i++) {
					pOne.addToHand(deal.getDeck().nextCard());
				}
			}

			cardsNeeded = pTwo.cardsNeeded(suit);
			if (bidderIdx != 1) {
				pTwo.removeToSize();
				for (int i = 0; i < cardsNeeded; i++) {
					pTwo.addToHand(deal.getDeck().nextCard());
				}
			}

			cardsNeeded = pThree.cardsNeeded(suit);
			if (bidderIdx != 2) {
				pThree.removeToSize();
				for (int i = 0; i < cardsNeeded; i++) {
					pThree.addToHand(deal.getDeck().nextCard());
				}
			}

			cardsNeeded = pFour.cardsNeeded(suit);
			if (bidderIdx != 3) {
				pFour.removeToSize();
				for (int i = 0; i < cardsNeeded; i++) {
					pFour.addToHand(deal.getDeck().nextCard());
				}
			}

			playerCollection.get(bidderIdx)
					.fillBidderHand(deal.getDeck(), suit);
			playerCollection.get(bidderIdx).removeToSize();

			int tempIdx = bidderIdx;
			playerCollection = rearrangePlayerList(tempIdx, playerCollection);

			for (Player p : playerCollection) {
				p.showHand();
			}
			for (int k = 0; k < 6; k++) {
				ArrayList<Card> cardsOnTable = new ArrayList<Card>();

				int winningCardIdx = 0;
				int handPoints = 0;
				int playerOfTwo = -1;
				int i = 0;
				// prompt all players to play card
				// Add point totals for two teams!!!!
				// Subtraction of points for not making bid!
				for (Player player : playerCollection) {
					System.out.println(cardsOnTable.toString());
					Card cardPlayed = player.playCard();
					cardsOnTable.add(cardPlayed);
					if (cardPlayed.getSuit() == suit
							|| cardPlayed.offJack(suit)) {
						if (cardsOnTable.get(winningCardIdx).getHiearchy() < cardPlayed
								.getHiearchy())
							winningCardIdx = i;
					}

					if (cardPlayed.getValue() == 2) {
						playerOfTwo = i;

					} else {
						handPoints += cardPlayed.getPointVal();
						i++;
					}
				}

				if (playerCollection.get(winningCardIdx).playerNum % 2 == 0) {
					pOne.handPoints += handPoints;
					pThree.handPoints += handPoints;

				} else {
					pTwo.handPoints += handPoints;
					pFour.handPoints += handPoints;
				}
				if (playerOfTwo != -1) {
					if (playerCollection.get(playerOfTwo).playerNum % 2 == 0) {
						pOne.handPoints++;
						pThree.handPoints++;

					}

					if (playerCollection.get(playerOfTwo).playerNum % 2 == 1) {
						pTwo.handPoints++;
						pFour.handPoints++;
					}
				}
				handPoints = 0;
				playerOfTwo = -1;

				playerCollection = rearrangePlayerList(winningCardIdx,
						playerCollection);

				// Check for the winning scores
				// Reset the collectionPlayers for dealer
				if (playerCollection.get(winningCardIdx).playerNum % 2 == 0) {
					pOne.handPoints += handPoints;
					pThree.handPoints += handPoints;

				} else {
					pTwo.handPoints += handPoints;
					pFour.handPoints += handPoints;
				}
				if (playerOfTwo != -1) {
					if (playerCollection.get(playerOfTwo).playerNum % 2 == 0) {
						pOne.handPoints++;
						pThree.handPoints++;

					}

					if (playerCollection.get(playerOfTwo).playerNum % 2 == 1) {
						pTwo.handPoints++;
						pFour.handPoints++;
					}
				}
				System.out.println(playerCollection.get(winningCardIdx).name
						+ "Won hand!");
				System.out.println("Team 1: " + pOne.handPoints);
				System.out.println("Team 2: " + pTwo.handPoints);
			}
			if (playerCollection.get(bidderIdx).handPoints < bid) {
				if (bidderIdx % 2 == 0) {
					pOne.handPoints = -bid;
					pThree.handPoints = -bid;
				}
				if (bidderIdx % 2 == 1) {
					pTwo.handPoints = -bid;
					pFour.handPoints = -bid;
				}
			}
			for (Player p : playerCollection) {
				p.teamPoints += p.handPoints;
				p.handPoints = 0;
			}
			System.out.println("END OF Round:");
			System.out.println("Team 1 :" + pOne.teamPoints);
			System.out.println("Team 2: " + pTwo.teamPoints);
			System.out.println("Continue?(c)");
			Scanner scan = new Scanner(System.in);
			String cont;
			do {
				System.out.println("press 'c' or 'continue'...");
				cont = scan.nextLine();
				if(cont == "c" || cont == "continue") continue;
			} while (cont != "c" || cont != "continue");
		}
	}

	public ArrayList<Player> rearrangePlayerList(int fistPlayer,
			ArrayList<Player> playerCollection) {
		ArrayList<Player> tempPlayers = new ArrayList<Player>();
		for (int i = 0; i < 4; i++) {
			tempPlayers.add(playerCollection.get(fistPlayer % 4));
			fistPlayer++;
		}
		return tempPlayers;
	}
}
