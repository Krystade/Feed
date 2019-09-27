function Mob (r, g, b, x, y, size, lifeSpan, foods, shape){
	//Location and Speed
	this.x = x
	this.y = y
	this.size= size
	this.maxSize = 300
	this.xSpeed = .0001//random(-4,3)
	this.ySpeed = .0001//random(-4,3)
	this.baseSpeed = random(0,2)
	this.shape = shape
	
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
		
	//If there isn't any food, don't move
	if (foods.length <= 0){
		this.closest = {x:this.x, y:this.y}
	}else{
		this.closest = {x:-width, y:-height}
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
		
	this.display = function(){
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
		//line(this.x, this.y, this.closest.x, this.closest.y)
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.move = function(){
		this.x += this.xSpeed
		this.y += this.ySpeed
		//lifeSpan decreases every 30 frames (1 sec)
		this.lifeSpan -= 1/30
		this.frames++
		if (this.frames >= 15){
				this.frames = 0
			}
		//Speed Managment
		//If a mob moves faster than 10 pixels a frame in the x direction, slow it down to 6
		if(this.xSpeed >= 10 || this.xSpeed <= -10){
		   this.xSpeed = this.xSpeed/abs(this.xSpeed) * 10
		   }
		
		//If a mob moves faster than 10 pixels a frame in the y direction, slow it down to 6
		if (this.ySpeed >= 10 || this.ySpeed <= -10){
			this.ySpeed = this.ySpeed/abs(this.ySpeed) * 10
		}
		//Move towards nearest target (food or mate)
		if(this.x + this.size / 2 > this.closest.x - this.closest.size / 2 || this.x - this.size / 2 < this.closest.x + this.closest.size / 2){
			this.xSpeed += -3 * ((1/(this.x - this.closest.x + .001)) * abs(this.x - this.closest.x))
		}else{
			this.xSpeed += -3 * ((1/(this.x - this.closest.x + .001)) * abs(this.x - this.closest.x))
		}
		if(this.y  + this.size / 2 > this.closest.y - this.closest.size / 2 || this.y - this.size / 2  < this.closest.y + this.closest.size / 2){
			this.ySpeed += -3 * ((1/(this.y - this.closest.y + .001)) * abs(this.y - this.closest.y))
		}else{
			this.ySpeed += -3 * ((1/(this.y - this.closest.y + .001)) * abs(this.y - this.closest.y))
		}
		/*
		//Make sure they don't leave the window
		if(this.x > width - 25){
			this.xSpeed = -abs(this.xSpeed)
		}
		else if(this.x < 25){
			this.xSpeed = abs(this.xSpeed)
		}
		if(this.y < 25){
			this.ySpeed = abs(this.ySpeed)
		}
		else if(this.y > height - 25){
			this.ySpeed = -abs(this.ySpeed)
		}
		*/
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.breed = function(other){
		if (this.shape == other.shape && dist(this.x, this.y, other.x, other.y) < (this.size/2 + other.size/2)){
			if (abs(this.r - other.r) <= 40 && abs(this.g - other.g) <= 40 && abs(this.b - other.b) <= 40 && this.canBreed && other.canBreed){
			 //Prevent crashing the window through infinite breeding
			 this.canBreed = false
			 //Only allow breeding every x frames
			 this.breedCoolDown = 30 * 30
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
			this.closest = {x:foods[0].x,y:foods[0].y}

		}else{
			this.closest = {x:width / 2, y:height / 2}
		}
		//Check if there is a mate
		for (var i = 0; i < entities.length; i++){
			if (entities.indexOf(this) != i && this.canBreed && this.shape == entities[i].shape && entities[i].canBreed && abs(entities[i].r - this.r) <= 40 && abs(entities[i].g - this.g) <= 40 && abs(entities[i].b - this.b) <= 40){
				this.foundMate = true
			}
		}
		//Finding which food is closest
		if(foods[0] != undefined){
			if(foods.length != 0){
				for (var i = 0; i < foods.length; i++){
					if (dist(this.x, this.y, foods[i].x, foods[i].y) < dist(this.x, this.y, this.closest.x, this.closest.y)){
						this.closest = {x:foods[i].x, y:foods[i].y}
						this.foundFood = true
					}
				}
			}
		}
		if (this.lifeSpan > 30 && this.foundMate){
			//Look for breed partner if they have enough health and can breed
			for (var i = 0; i < entities.length; i++){
			if(entities.indexOf(this) != i && abs(this.r - entities[i].r) <= 40 && abs(this.g - entities[i].g) <= 40 && abs(this.b - entities[i].b) <= 40 && entities[i].canBreed && 	dist(this.x, this.y, entities[i].x, entities[i].y) < dist(this.x, this.y, this.closest.x, this.closest.y)){
				this.closest = {x:entities[i].x, y:entities[i].y}
				}
			}
		}
		/*if(this.foundMate{
			return(print("This mob found a mate: " + entities.indexOf(this)))
		}else{
			return
		}*/
	}
}
