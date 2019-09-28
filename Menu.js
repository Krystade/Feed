function Menu (x, y) {
	// For the button to open the menu
	this.x = x
	this.y = y
	this.size = 30
	// For the menu itself
	this.width = 220
	this.height = 350
	
	this.display = function(){
		stroke(1)
		textAlign(CENTER)
		textSize(20)
		fill(100, 200, 215)
		ellipse(this.x,this.y, this.size, this.size)
		fill(0)
		line(this.x - 10, this.y - 5, this.x + 10, this.y - 5)
		line(this.x - 10, this.y, this.x + 10, this.y)
		line(this.x - 10, this.y + 5, this.x + 10, this.y + 5)
	}
	this.displayBox = function(){
		fill(230)
		// Entire container of the menu
		rect(this.x - this.size/2, this.y + this.size/1.5, this.width, this.height, 12)
		fill(255)
		// Box for Create [ ] Circles
		rect(this.x + 70, this.y + this.size + 55, 50, 20)
		for(var i = 0; i < 3; i++){
			rect(20, this.y + this.size + 30 * i, 10, 10)
		}
		fill(0)
		noStroke()
		textAlign(LEFT)
		
		text("Ungroup",this.x + 20 - this.size/2, this.y + this.size + 10)
		text("Clear",this.x + 20 - this.size/2, this.y + this.size + 40)
		text("Create           Circles", this.x + 20 - this.size/2, this.y + this.size + 70)
		
	}
}