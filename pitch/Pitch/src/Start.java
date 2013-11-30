import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;


public class Start extends JFrame implements ActionListener {
	
    private JButton jbtnHit = new JButton("Hit");
    private JButton jbtnStay = new JButton("Stay");
    private JButton jbtnDeal = new JButton("Deal");

    private JLabel gameStatus = new JLabel(" ", JLabel.CENTER);

    JPanel tablePanel = new JPanel();
    JPanel playerPanel = new JPanel();
    JPanel statusPanel = new JPanel();
	
	Start(){
		 JFrame gameFrame = new JFrame("Pitch");
	        gameFrame.setIconImage(Toolkit.getDefaultToolkit().getImage("cards/10.png"));
	        gameFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

	        statusPanel.add(gameStatus);

	        jbtnHit.addActionListener(this);
	        jbtnStay.addActionListener(this);
	        jbtnDeal.addActionListener(this);

	        jbtnHit.setEnabled(false);
	        jbtnStay.setEnabled(false);

	        tablePanel.setBackground(Color.GREEN);
	        playerPanel.setBackground(Color.GREEN);
	        statusPanel.setBackground(Color.GREEN);

	        gameFrame.setLayout(new BorderLayout());
	        gameFrame.add(tablePanel, BorderLayout.NORTH);
	        gameFrame.add(playerPanel, BorderLayout.CENTER);
	        gameFrame.add(statusPanel, BorderLayout.EAST);
	        gameFrame.repaint();
	        gameFrame.setSize(450, 350);
	        gameFrame.setVisible(true);
	}
	
	public static void main(String args[]){
		new Start();
		new GameInit();
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		
	}
}
