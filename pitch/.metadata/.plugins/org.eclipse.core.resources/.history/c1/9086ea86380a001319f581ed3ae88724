import java.util.ArrayList;
import java.util.Collection;



public class GameInit {
	
	private GameInit(){
		Collection<Player> playerCollection= new ArrayList<Player>();
		Player pOne = new Player();
		playerCollection.add(pOne);
		Player pTwo = new Player();
		playerCollection.add(pTwo);
		Player pThree = new Player();
		playerCollection.add(pThree);
		Player pFour = new Player();
		playerCollection.add(pFour);
		Deal deal = new Deal();
		pOne.setHand(deal.getPlayerOneHand());
		pTwo.setHand(deal.getPlayerTwoHand());
		pThree.setHand(deal.getPlayerThreeHand());
		pFour.setHand(deal.getPlayerFourHand());
		
		System.out.println("Player 1 hand"); 
		pOne.showHand();
		System.out.println();
		
		System.out.println("Player 2 hand"); 
		pTwo.showHand();
		System.out.println();
		
		System.out.println("Player 3 hand"); 
		pThree.showHand();
		System.out.println();
		
		System.out.println("Player 4 hand"); 
		pFour.showHand();
		System.out.println();
	}
	public static void main(String args[]){
		Collection<Player> playerCollection= new ArrayList<Player>();
		Player pOne = new Player();
		playerCollection.add(pOne);
		Player pTwo = new Player();
		playerCollection.add(pTwo);
		Player pThree = new Player();
		playerCollection.add(pThree);
		Player pFour = new Player();
		playerCollection.add(pFour);
		Deal deal = new Deal();
		pOne.setHand(deal.getPlayerOneHand());
		pTwo.setHand(deal.getPlayerTwoHand());
		pThree.setHand(deal.getPlayerThreeHand());
		pFour.setHand(deal.getPlayerFourHand());
		
		System.out.println("Player 1 hand"); 
		pOne.showHand();
		System.out.println();
		
		System.out.println("Player 2 hand"); 
		pTwo.showHand();
		System.out.println();
		
		System.out.println("Player 3 hand"); 
		pThree.showHand();
		System.out.println();
		
		System.out.println("Player 4 hand"); 
		pFour.showHand();
		System.out.println();

		GameBid.initializeBidSequence(playerCollection);
		int suit = GameBid.getSuitRep();
		int bid = GameBid.getHighBid();
		int bidderIdx = GameBid.getHighestBidIdx();
		
		int cardsNeeded = pOne.cardsNeeded(suit);
		if(bidderIdx != 0){
			for(int i = 0; i < cardsNeeded; i++){
				pOne.addToHand(deal.getDeck().nextCard());
			}
		}
		
		cardsNeeded = pTwo.cardsNeeded(suit);
		if(bidderIdx != 1){
			for(int i = 0; i < cardsNeeded; i++){
				pTwo.addToHand(deal.getDeck().nextCard());
			}
		}
		
		cardsNeeded = pThree.cardsNeeded(suit);
		if(bidderIdx != 2){
			for(int i = 0; i < cardsNeeded; i++){
				pThree.addToHand(deal.getDeck().nextCard());
			}
		}
		
		cardsNeeded = pFour.cardsNeeded(suit);
		if(bidderIdx != 3){		
			for(int i = 0; i < cardsNeeded; i++){
				pFour.addToHand(deal.getDeck().nextCard());
			}
		}
	}
}

