function Food (x,y){
	this.food = true
	this.mob = false
	this.x = x
	this.y = y
	this.size = 50
	this.value = 5
	this.color = color(20, 200, 40)
	
	
	this.xSpeed = 0
	this.ySpeed = 0
	
	this.sector = calcSector(this.x, this.y)
	sectors[this.sector[0]][this.sector[1]].push(this)
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	this.update = function(){
		this.display()
		this.move()
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.display = function(){
		//Check if the food is on screen before displaying it
		if(this.x + this.size/2 > -trans[0] && this.x - this.size/2 < windowWidth/scaleNum - trans[0] && this.y + this.size/2 > -trans[1] && this.y - this.size/2 < windowWidth/scaleNum - trans[1]){
			push()
			noStroke()
			textAlign(CENTER)
			textSize(20)
			fill(this.color)
			ellipse(this.x,this.y, this.size, this.size)
			pop()
		}
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.move = function(){
		this.x += this.xSpeed
		this.y += this.ySpeed
		
		this.xSpeed *= .95
		this.ySpeed *= .95
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
}