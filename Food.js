function Food (x,y){
	this.food = true
	this.mob = false
	this.x = x
	this.y = y
	this.size = 50
	this.value = 5
	this.color = color(20, 200, 40)
	this.sector = [-1, -1]
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.display = function(){
		if(this.sector[0] == -1){
			// Assign the correct sector
			this.sector = calcSector(this.x, this.y)
			// Push food into sector array
			sectors[this.sector[0]][this.sector[1]].push(this)
		}
		push()
		noStroke()
		textAlign(CENTER)
		textSize(20)
		fill(20, 200, 40)
		ellipse(this.x,this.y, this.size, this.size)
		pop()
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
}
