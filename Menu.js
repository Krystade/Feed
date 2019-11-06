function Menu (x, y) {
	// For the button to open the menu
	this.x = x
	this.y = y
	// For the menu itself
	this.width = 140
	this.height = 350
	this.size = [50,20]
	
	//Make all the buttons/DOM elements
	menuButton = createButton('Menu')
  	menuButton.position(this.x, this.y)
    menuButton.mousePressed(menuPressed)
	menuButton.size(this.size)
	
	this.display = function(){
		stroke(1)
		textAlign(CENTER)
		textSize(20)
		
		if(menuOpen){
			fill(230)
			// Entire container of the menu
			rect(this.x, this.y + this.size[1] + 10, this.width, this.height, 12)
			fill(255)
			// Box for Create [ ] Circles
			rect(this.x + 70, this.y + this.size + 55, 50, 20)
			for(var i = 0; i < 3; i++){
				rect(20, this.y + this.size + 30 * i, 10, 10)
			}
			//Show all the buttons if the menu is open
			for(var i = 0; i < buttons.length; i++){
				buttons[i].show()
			}
		}else{
			//Hide all the buttons if the menu isn't open
			for(var i = 0; i < buttons.length; i++){
				buttons[i].hide()
			}
			
		}
	}
}
