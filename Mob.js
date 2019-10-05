function Mob (r, g, b, x, y, size, lifeSpan, foods, shape){
	this.mob = true
	this.food = false
	//Location and Speed
	this.x = x
	this.y = y
	this.size = size
	this.maxSize = size * 2
	this.xSpeed = .0001//random(-4,3)
	this.ySpeed = .0001//random(-4,3)
	this.baseSpeed = random(1,5)
	this.maxXSpeed = this.baseSpeed * 8
	this.maxYSpeed = this.baseSpeed * 8
	
	this.shape = shape
	this.closestFood = {x:this.x, y:this.y}
	this.sector = 0
	this.sectorsAdj = []
	
	//Aging and Growth
	this.frames = ceil(random(0,10))
	this.lifeSpan = lifeSpan
	//How quickly they grow
	this.growth = 2
	
	//Breeding
	this.foundMate = false
	this.canBreed = false
	//cooldown is 30 seconds
	this.breedCoolDown = fr * 30 //30 seconds because of 30 fps
	
	//Color
	this.r = r
	this.g = g
	this.b = b
	this.color = color(r,g,b,this.lifeSpan * 5)
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
		
	this.display = function(){
		push()
		//print("ySpeed: " + this.ySpeed)
		//print("xSpeed: " + this.xSpeed)
		//The mob itself
		stroke(0)
		strokeWeight(1)
		fill(this.color)
		if (this.shape == "circle"){
			ellipse(this.x, this.y, this.size, this.size)
		}else if (this.shape == "square"){
			rect(this.x, this.y, this.size, this.size)
		}else if (this.shape == "triangle"){
			triangle(this.x, this.y, this.x + this.size * .5, this.y - this.size, this.x + this.size, this.y)
		}else {
			ellipse(this.x, this.y, this.size, this.size)
		}
		
		//Label how long the mob has to live in seconds
		stroke(1)
		textAlign(CENTER)
		textSize(this.size * .7)
		if (this.shape == "circle"){
			text(ceil(this.lifeSpan), this.x, this.y - this.size * .6)
		}else if (this.shape == "square"){
			text(ceil(this.lifeSpan), this.x + this.size / 2, this.y - this.size * .4)
		}else if (this.shape == "triangle"){
			text(ceil(this.lifeSpan), this.x + this.size / 3, this.y - this.size * 1.3)
		}else {
			text(ceil(this.lifeSpan), this.x, this.y - this.size * .6)
		}	
		//Every 15 frames after they are born they grow unless they are at the max size
		if(this.frames == 0 && this.size < this.maxSize){
			this.size += this.growth
		}
		//Opacity directly correlates to lifeSpan
		this.color = color(r, g, b, this.lifeSpan * 10)
		//line(this.x, this.y, this.closestFood.x, this.closestFood.y)
		pop()
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.move = function(){
		this.x += this.xSpeed
		this.y += this.ySpeed
		//lifeSpan decreases every 30 frames (1 sec)
		this.lifeSpan -= 1/fr
		this.frames++
		if (this.frames >= 15){
				this.frames = 0
			}
		//Speed Managment
		//If a mob moves faster than the max pixels a frame in the x direction, slow it down to the max
		if(this.xSpeed >= this.maxXSpeed || this.xSpeed <= -this.maxXSpeed){
		   this.xSpeed = this.xSpeed/abs(this.xSpeed) * this.maxXSpeed
		   }
		
		//If a mob moves faster than 10 pixels a frame in the y direction, slow it down to 6
		if (this.ySpeed >= this.maxYSpeed || this.ySpeed <= -this.maxYSpeed){
			this.ySpeed = this.ySpeed/abs(this.ySpeed) * this.maxYSpeed
		}
		//Move towards nearest target (food or mate)
		if(this.x + this.size / 2 > this.closestFood.x - this.closestFood.size / 2 || this.x - this.size / 2 < this.closestFood.x + this.closestFood.size / 2){
			this.xSpeed += -3 * ((1/(this.x - this.closestFood.x + .001)) * abs(this.x - this.closestFood.x))
		}else{
			this.xSpeed += -3 * ((1/(this.x - this.closestFood.x + .001)) * abs(this.x - this.closestFood.x))
		}
		if(this.y  + this.size / 2 > this.closestFood.y - this.closestFood.size / 2 || this.y - this.size / 2  < this.closestFood.y + this.closestFood.size / 2){
			this.ySpeed += -3 * ((1/(this.y - this.closestFood.y + .001)) * abs(this.y - this.closestFood.y))
		}else{
			this.ySpeed += -3 * ((1/(this.y - this.closestFood.y + .001)) * abs(this.y - this.closestFood.y))
		}		
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.breed = function(other){
		if (this.shape == other.shape && dist(this.x, this.y, other.x, other.y) < (this.size/2 + other.size/2)){
			if (abs(this.r - other.r) <= 40 && abs(this.g - other.g) <= 40 && abs(this.b - other.b) <= 40 && this.canBreed && other.canBreed){
			 //Prevent crashing the window through infinite breeding
			 this.canBreed = false
			 //Only allow breeding every x seconds
			 this.breedCoolDown = fr * 30
			 return true
			 this.search(entities, foods)
			}
		}else{
			return false
		}
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.eats = function(food){
		if(dist(this.x, this.y, food.x, food.y) < (this.size/2 + food.size)){
			return true
		}else{
			return false
		}
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.separate = function(){
		// If the mobs get to 90% of their max size allow them to split into two mobs half the size with half the lifespan
		if(this.size > this.maxSize * .9 && this.lifeSpan > 30 || this.lifeSpan > 90){
			entities.push(new Mob(this.r, this.g, this.b, this.x, this.y, this.size * .5, this.lifeSpan * .5, foods, this.shape))
			this.size *= .5
			this.lifeSpan *= .5
		}

	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.search = function(entities, foods){
		this.foundFood = false
		if (foods.length != 0 && foods[0]){
			this.closestFood = {x:foods[0].x, y:foods[0].y}
		}else{
			// If there isnt any food left dont move
			this.closestFood = {x:this.x, y:this.y}
		}
		//Check if there is a mate
		for(var i = 0; i < entities.length; i++){
			if (entities.indexOf(this) != i && this.canBreed && this.shape == entities[i].shape && entities[i].canBreed && abs(entities[i].r - this.r) <= 40 && abs(entities[i].g - this.g) <= 40 && abs(entities[i].b - this.b) <= 40){
				this.foundMate = true
			}
		}
		/*
		//Finding which food is closest
		if(foods[0]){
			for (var i = 0; i < foods.length; i++){
				if (dist(this.x, this.y, foods[i].x, foods[i].y) < dist(this.x, this.y, this.closestFood.x, this.closestFood.y)){
					this.closestFood = {x:foods[i].x, y:foods[i].y}
					this.foundFood = true
				}
			}
		}
		*/
		// There are 8 sectors adjacent to the entity plus the one it is in
		// Looping through each sector adjacent to the entity
		for(var i = -1; i < 2; i++){
			for(var j = -1; j < 2; j++){
				if(this.sector[1] + i >= 0 && this.sector[1] + i < sectors.length &&
				   this.sector[0] + j >= 0 && this.sector[0] + j < sectors[0].length){
					// Then looping through every entity in that sector
					for(var k = 0; k < sectors[this.sector[1] + i][this.sector[0] + j].length; k++){
						
						//x = sectorDimensions[(this.sector[0]) * sectors[0].length + (this.sector[1])]
						//fill(255, 0, 0)
						//rect(x[0] + sectorSize/2, x[2]+ sectorSize/2, 100, 100)
						
						if(sectors[this.sector[1] + i][this.sector[0] + j][k].food){
							if (dist(this.x, this.y, sectors[this.sector[1] + i][this.sector[0] + j][k].x, sectors[this.sector[1] + i][this.sector[0] + j][k].y) < 
								dist(this.x, this.y, this.closestFood.x, this.closestFood.y)){
								
								this.closestFood = {x:sectors[this.sector[1] + i][this.sector[0] + j][k].x, y:sectors[this.sector[1] + i][this.sector[0] + j][k].y}
								this.foundFood = true
							}
							sectors[this.sector[1] + i][this.sector[0] + j][k].color = color(100,0,0)
						// Check all the mobs in the same sector and adjacent sectors
						}else if(sectors[this.sector[1] + i][this.sector[0] + j][k].mob){
							
						}
					}
				}
			}
		}
		
		if (this.lifeSpan > 30 && this.foundMate){
			//Look for breed partner if they have enough health and can breed
			for (var i = 0; i < entities.length; i++){
			if(entities.indexOf(this) != i && abs(this.r - entities[i].r) <= 40 && abs(this.g - entities[i].g) <= 40 && abs(this.b - entities[i].b) <= 40 && entities[i].canBreed && 	dist(this.x, this.y, entities[i].x, entities[i].y) < dist(this.x, this.y, this.closestFood.x, this.closestFood.y)){
				this.closestFood = {x:entities[i].x, y:entities[i].y}
				}
			}
		}
		/*if(this.foundMate{
			return(print("This mob found a mate: " + entities.indexOf(this)))
		}else{
			return
		}*/
		
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.isInside = function(dimensions){
		if(this.x >= dimensions[0] && this.x < dimensions[1] && this.y >= dimensions[2] && this.y < dimensions[3]){
			return true
		}else{
			return false
		}
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
}
