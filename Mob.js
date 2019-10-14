function Mob (r, g, b, x, y, size, lifeSpan, foods, shape){
	this.mob = true
	this.food = false
	//Location and Speed
	this.x = x
	this.y = y
	this.size = size
	this.maxSize = size * 4
	this.minSize = size
	this.xSpeed = .0001//random(-4, 3)
	this.ySpeed = .0001//random(-4, 3)
	this.baseSpeed = random(1, 5)
	this.maxXSpeed = this.baseSpeed * 8
	this.maxYSpeed = this.baseSpeed * 8
	
	this.shape = shape
	this.closestFood = {x:this.x, y:this.y}
	this.sector = 0
	this.sectorsAdj = []
	
	//Aging and Growth
	this.frames = ceil(random(0, 10))
	this.lifeSpan = lifeSpan
	//How quickly they grow
	this.growth = 2
	
	//How long it has been since the mob has fed
	this.feedNeed = 400
	//Breeding
	//How long since the mob has bred
	this.breedNeed = 0
	this.canBreed = false
	//cooldown is 30 seconds
	this.breedCoolDown = fr * 30 //30 seconds because of 30 fps
	
	//Color
	this.r = round(r)
	this.g = round(g)
	this.b = round(b)
	this.color = color(r, g, b, 0)
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
		
	this.display = function(){
		push()
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
		//text("Feed:" + this.feedNeed, this.x, this.y + this.size)
		//text("Breed:" + this.breedNeed, this.x, this.y + this.size * 2)
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
		//Opacity directly correlates to lifeSpan, 0 is clear 255 is solid
		this.color = color(r, g, b, this.lifeSpan * 5)
		//line(this.x, this.y, this.closestFood.x, this.closestFood.y)
		pop()
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.move = function(){
		this.feedNeed += 2
		this.breedNeed += 1
		/*if(this.feedNeed > 300){
			this.feedNeed = 300
		}
		if(this.breedNeed > 300){
			this.breedNeed = 300
		}*/
		if(this.feedNeed < 0){
			this.feedNeed = 0
		}
		if(this.breedNeed < 0){
			this.breedNeed = 0
		}
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
		//If a mob moves faster than the max pixels a frame in the y direction, slow it down to 6
		if (this.ySpeed >= this.maxYSpeed || this.ySpeed <= -this.maxYSpeed){
			this.ySpeed = this.ySpeed/abs(this.ySpeed) * this.maxYSpeed
		}
		if(this.breedNeed <= this.feedNeed || this == this.closestMate){
			//Move towards nearest food
			//Steering towards closest food in the X direction
			if(this.x + this.size / 2 > this.closestFood.x - this.closestFood.size / 2 || this.x - this.size / 2 < this.closestFood.x + this.closestFood.size / 2){
				this.xSpeed += -3 * ((1/(this.x - this.closestFood.x + .001)) * abs(this.x - this.closestFood.x))
			}else{
				this.xSpeed += -3 * ((1/(this.x - this.closestFood.x + .001)) * abs(this.x - this.closestFood.x))
			}
			//Steering towards closest food in the Y direction
			if(this.y  + this.size / 2 > this.closestFood.y - this.closestFood.size / 2 || this.y - this.size / 2  < this.closestFood.y + this.closestFood.size / 2){
				this.ySpeed += -3 * ((1/(this.y - this.closestFood.y + .001)) * abs(this.y - this.closestFood.y))
			}else{
				this.ySpeed += -3 * ((1/(this.y - this.closestFood.y + .001)) * abs(this.y - this.closestFood.y))
			}
		}else if(this.breedNeed > this.feedNeed && this.closestMate != this){
			if(dist(this.x, this.y, this.closestMate.x, this.closestMate.y) < (this.size/2 + this.closestMate.size/2) && this != this.closestMate){
				this.breed(this.closestMate)
			}
			//Move towards nearest mate
			//Steering towards closest mate in the X direction
			if(this.x + this.size / 2 > this.closestMate.x - this.closestMate.size / 2 || this.x - this.size / 2 < this.closestMate.x + this.closestMate.size / 2){
				this.xSpeed += -3 * ((1/(this.x - this.closestMate.x + .001)) * abs(this.x - this.closestMate.x))
			}else{
				this.xSpeed += -3 * ((1/(this.x - this.closestMate.x + .001)) * abs(this.x - this.closestMate.x))
			}
			//Steering towards closest mate in the Y direction
			if(this.y  + this.size / 2 > this.closestMate.y - this.closestMate.size / 2 || this.y - this.size / 2  < this.closestMate.y + this.closestMate.size / 2){
				this.ySpeed += -3 * ((1/(this.y - this.closestMate.y + .001)) * abs(this.y - this.closestMate.y))
			}else{
				this.ySpeed += -3 * ((1/(this.y - this.closestMate.y + .001)) * abs(this.y - this.closestMate.y))
			}
			
		}
		
		
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.breed = function(other){
		this.breedNeed = 0
		other.breedNeed = 0
		childLifespan = this.lifeSpan * .2 + other.lifeSpan * .2
		this.lifeSpan *= .8
		other.lifeSpan *= .8
		entities.push(new Mob(average(this.r, other.r), average(this.g, other.g), average(this.b, other.b), average(this.x, other.x), average(this.y, other.y), average(this.minSize, other.minSize), childLifespan, foods, this.size))
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
		//If the mobs get to 90% of their max size allow them to split into two mobs half the size with half the lifespan
		if(this.size > this.maxSize * .9 && this.lifeSpan > 30 || this.lifeSpan > 90 && this.size >= this.minSize * 2){
			entities.push(new Mob(this.r, this.g, this.b, this.x, this.y, this.minSize, this.minSize/this.size * this.lifeSpan, foods, this.shape))
			this.size -= this.minSize
			this.lifeSpan -= this.minSize/this.size * this.lifeSpan
		}

	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.search = function(entities, foods){
		if(foods.length != 0 && foods[0]){
			this.closestFood = {x:foods[0].x, y:foods[0].y}
		}else{
			//If there isnt any food left dont move
			this.closestFood = {x:this.x, y:this.y}
		}
		if(entities.length != 0 && entities[0]){
		   this.closestMate = entities[0]
		}else{
		   this.closestMate = this
		}
		//There are 8 sectors adjacent to the entity plus the one it is in
		//Looping through each sector adjacent to the entity
		for(var i = -1; i < 2; i++){
			for(var j = -1; j < 2; j++){
				if(this.sector[1] + i >= 0 && this.sector[1] + i < sectors.length &&
				   this.sector[0] + j >= 0 && this.sector[0] + j < sectors[0].length){
					//Then looping through every entity in that sector
					for(var k = 0; k < sectors[this.sector[1] + i][this.sector[0] + j].length; k++){
						other = sectors[this.sector[1] + i][this.sector[0] + j][k]
						//If the entity is a piece of food
						if(other.food){
							//Check the distance between the selected mob and the piece of food
							if (dist(this.x, this.y, other.x, other.y) < dist(this.x, this.y, this.closestFood.x, this.closestFood.y)){
								//If the distance is shorter than the current closest food change the closest food to this one
								this.closestFood = {x:other.x, y:other.y}
							}
						//Check all the mobs in the same sector and adjacent sectors
						}else if(other.mob && other != this){
							//Check to see if the colors are similar
							if(deltaE(rgb2lab([this.r, this.g, this.b]), rgb2lab([other.r, other.g, other.b])) < 20){
								//Check the distance between the selected mob and the possible mate
								if (dist(this.x, this.y, other.x, other.y) < dist(this.x, this.y, this.closestMate.x, this.closestMate.y)){
									//If the distance is shorter than the current closest mate, change the closest mate to this one
									this.closestMate = other
								}
							}
						}
					}
				}
			}
		}
		/*push()
		stroke(30,200,80)
		line(this.x, this.y, this.closestFood.x, this.closestFood.y)
		stroke(400, 70, 80)		
		line(this.x, this.y, this.closestMate.x, this.closestMate.y)
		pop()*/
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
