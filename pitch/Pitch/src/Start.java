import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;


public class Start extends JFrame implements ActionListener {
	Deck deck = new Deck();
	
    private JLabel team1Status = new JLabel(" ");
    private JLabel team2Status = new JLabel(" ");
   
    JPanel tablePanel = new JPanel();
    JPanel playerPanel = new JPanel();
    JPanel buttonsPanel = new JPanel();
    JPanel statusPanel = new JPanel();
    
    JButton playerCard1 = new JButton();
    JButton playerCard2 = new JButton();
    JButton playerCard3 = new JButton();
    JButton playerCard4 = new JButton();
    JButton playerCard5 = new JButton();
    JButton playerCard6 = new JButton();
    JButton playerCard7 = new JButton();
    JButton playerCard8 = new JButton();
    JButton playerCard9 = new JButton();
    String path = "cards/";
    
    JButton jbtnDeal = new JButton("Deal");
    JFrame bidFrame = new JFrame("Bid Window");
    
	ArrayList<Player> playerCollection = new ArrayList<Player>();
	
	boolean roundCard = true;
	int dealer = 3;
	Player pOne = new Player("Player 1: ", 0);
	Player pTwo = new Player("Player 2: ", 1);
	Player pThree = new Player("Player 3: ", 2);
	Player pFour = new Player("Player 4: ", 3);    
    
	
	Start(){
		 JFrame gameFrame = new JFrame("Pitch");
	        gameFrame.setIconImage(Toolkit.getDefaultToolkit().getImage("cards/10.png"));
	        gameFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	        
	        buttonsPanel.add(jbtnDeal);
	        
	        jbtnDeal.addActionListener(this);
	        
	        statusPanel.add(team1Status);
	        statusPanel.add(team2Status);
	        
	        tablePanel.setBackground(Color.GREEN);
	        playerPanel.setBackground(Color.GREEN);
	        statusPanel.setBackground(Color.GREEN);
	        buttonsPanel.setBackground(Color.GREEN);
	        

	        gameFrame.setLayout(new BorderLayout());
	        gameFrame.add(tablePanel, BorderLayout.NORTH);
	        gameFrame.add(playerPanel, BorderLayout.CENTER);
	        gameFrame.add(statusPanel, BorderLayout.EAST);
	        gameFrame.add(buttonsPanel, BorderLayout.SOUTH);
	        gameFrame.repaint();
	        gameFrame.setSize(450, 350);
	        gameFrame.setVisible(true);
	        
	    	playerCollection.add(pOne);
	    	playerCollection.add(pTwo);
	    	playerCollection.add(pThree);
	    	playerCollection.add(pFour);
	}
	
	public static void main(String args[]){
		new Start();
		GameInit game = new GameInit();
	}

	@Override
	public void actionPerformed(ActionEvent e) {
        if (e.getSource() == jbtnDeal) {
        	deck.ShuffleDeck();
        	playerCollection = deck.deal(playerCollection);
            File file;
            BufferedImage image;
            String newPath;
        	for(Card card : playerCollection.get(0).getHand()){
        		playerPanel.add(new JButton(card.toString()));
        		/*				newPath = path + card.getSuit() + card.getHiearchy() + ".png";
				file = new File(newPath);
				System.out.println(newPath);
				try {
					image = ImageIO.read(file);
					playerPanel.add(new JLabel(new ImageIcon(image)));
				} catch (IOException e1) {
					e1.printStackTrace();
					System.out
							.println("Shit Didnt work: image could not be read: "
									+ newPath);
				}*/
        	}
            team1Status.setText("Team 1: " + pOne.teamPoints);
            team2Status.setText("Team 2: " + pTwo.teamPoints);
            jbtnDeal.setEnabled(false);
        }
        
        
	}
}
