
public class Card {
	private String suitName;
	private String valueName;
	private int suit;
	private int value;
	public int pointVal = 0;
	public int hiearchy;
	
	public Card() {
		// TODO Auto-generated constructor stub
	}
	
	public Card(int s, int val) {
		suit = s;
		value = val;
		if(s == 0)  	suitName = "Spades";
		if(s == 1) 		suitName = "Diamonds";
		if(s == 2) 		suitName = "Clubs";
		if(s == 3) 		suitName = "Hearts";
		for(int i =2; i <= 10; i++){
			if(val+2 == i) valueName = Integer.toString(i);
			if(val+2 == 3) pointVal = 3;
			if(val+2 == 10) pointVal = 1;
			hiearchy = i;
		}
		if(val == 9){
			valueName = "Jack";
			pointVal = 1;
			hiearchy = 14;
		}
		if(val == 10){
			valueName = "Queen";
			hiearchy = 15;
		}
		if(val == 11){
			valueName = "King";
			hiearchy = 16;
		}
		if(val == 12){
			valueName = "Ace";
			pointVal = 1;
			hiearchy = 17;
		}
	}
	
	public Card(int H) {
		if(H == 0){
			suitName = "Joker";
			valueName= "Low";
			pointVal = 1;
			hiearchy = 11;
		} else if(H ==1){
			suitName = "Joker";
			valueName= "High";
			pointVal = 1;
			hiearchy = 12;
		}
		
	}

	public String getSuitName() {
		return suitName;
	}

	public void setSuitName(String suitName) {
		this.suitName = suitName;
	}

	public String getValueName() {
		return valueName;
	}

	public void setValueName(String valueName) {
		this.valueName = valueName;
	}

	public int getSuit() {
		return suit;
	}

	public void setSuit(int suit) {
		this.suit = suit;
	}

	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	public int getPointVal() {
		return pointVal;
	}

	public void setPointVal(int pointVal) {
		this.pointVal = pointVal;
	}
	
	public int getHiearchy() {
		return hiearchy;
	}

	public void setHiearchy(int hiearchy) {
		this.hiearchy = hiearchy;
	}

	public boolean offJack(int suit){
		switch (suit) {
			case 0:{
				if(this.suit == 2 && value == 9){
					this.hiearchy = 13;
					return true;
				}
				else return false;
			}
			case 1:{
				if(this.suit == 3 && value == 9){
					this.hiearchy = 13;
					return true;
				}
				else return false;
			}
			case 2:{
				if(this.suit == 0 && value == 9){
					this.hiearchy = 13;
					return true;
				}
				else return false;
			}
			case 3:{
				if(this.suit == 1 && value == 9){
					this.hiearchy = 13;
					return true;
				}
				else return false;
			}
			default: return false;
		}
	}
	
	public String toString(){
		String resp = this.valueName + " of " + this.suitName;
		return resp;
	}
	
}
