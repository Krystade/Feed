function Mob (r, g, b, x, y, size, lifeSpan){
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
	//this.baseSpeed = random(1, 5)
	this.baseSpeed = (300/this.minSize) + 18 + random(0,3)
	this.maxXSpeed = this.baseSpeed
	this.maxYSpeed = this.baseSpeed
	
	// Aging and Growth
	this.frames = ceil(random(0, 10))
	this.lifeSpan = lifeSpan
	// Time when mob was created
	this.created = getTime()
	// How quickly they grow
	this.growth = 2 * growthRate
	
	//How long it has been since the mob has fed
	this.feedNeed = random(400, 4000)
	//Breeding
	// Maximum number of offspring that can be had at once
	this.litterSize = int(random(1,8))
	//How long since the mob has bred
	this.breedNeed = 0
	// Cap number of offspring created at once to 5
	this.maxBreedNeed = this.feedNeed * this.litterSize
	this.canBreed = false
	// How many generations in the mob is
	this.generation = 0
	// Array of all ancestors
	this.tree = []
	// How many children the mob has had
	this.numChildren = 0
	// Cooldown is 30 seconds
	//this.breedCoolDown = fr * 30
	
	
	this.highlighted = false
	this.prevSector = [-1, -1]
	this.sector = [0,0]
	this.sectorsAdj = []
	this.target = undefined
	
	//Color
	this.r = round(r)
	if(!(this.r <= 0 || this.r > 0)){
		this.r = 0
	}
	this.g = round(g)
	if(!(this.g <= 0 || this.g > 0)){
		this.g = 0
	}
	this.b = round(b)
	if(!(this.b <= 0 || this.b > 0)){
		this.b = 0
	}
	this.rgb = [this.r,this.g,this.b]
	this.color = color(this.r,this.g,this.b, 0)
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.update = function(){
		//lifeSpan decreases every 30 frames (1 sec)
		this.lifeSpan -= 1/fr
		this.frames++
		if (this.frames >= 15){
			this.frames = 0
		}
		/*this.baseSpeed = (300/this.minSize) + 20
		this.maxXSpeed = this.baseSpeed
		this.maxYSpeed = this.baseSpeed*/
		this.move()

		this.display()
		//this.separate()
		if(this.maxBreedNeed > this.breedNeed){
			this.breedNeed++
		}
		// If the mob is targetting another mob and is close enough, breed
		if(typeof(this.target) != "undefined" && this.target.mob && dist(this.x, this.y, this.target.x, this.target.y) < (this.size/2 + this.target.size/2)){
			this.breed(this.target)
		}
		
		// If the mob moves to a different sector
		if((this.sector[0] != this.prevSector[0]) || (this.sector[1] != this.prevSector[1])){
			secX = this.sector[0]
			secY = this.sector[1]
			sectors[secX][secY].push(this)
			// Check if the previous sector the mob was in was valid and if so
			// Loop through the sector that the mob is in and remove it from the array when found
			if(this.prevSector[0] != -1 && this.prevSector[1] != -1){
				for(var j = 0; j < sectors[this.prevSector[0]][this.prevSector[1]].length; j++){
					if(this == entities[j]){
						sectors[this.prevSector[0]][this.prevSector[1]].splice(j,1)
						//print("moved from " + this.prevSector + " to " + this.sector)
						break
					}
				}
			}
		}
				// Update entities sector
				this.prevSector = this.sector
				// Finding and assigning the entities sector
				this.sector = calcSector(this.x, this.y)
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.display = function(){
		push()
		//The mob itself
		if(this.highlighted){
			stroke(250, 50, 50)
			strokeWeight(20)
			noFill()
			ellipse(this.x, this.y, this.size + 20)
		}
		stroke(0)
		strokeWeight(1)
		fill(this.color)
		if (this.shape == "circle"){
			ellipse(this.x, this.y, this.size)
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
		this.color = color(this.r, this.g, this.b, this.lifeSpan * 5)
		pop()
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.move = function(){
		this.x += this.xSpeed
		this.y += this.ySpeed

		//Speed Managment
		//If a mob moves faster than the max pixels a frame in the x direction, slow it down to the max
		if(this.xSpeed >= this.maxXSpeed || this.xSpeed <= -this.maxXSpeed){
		   this.xSpeed = this.xSpeed/abs(this.xSpeed) * this.maxXSpeed
		   }
		//If a mob moves faster than the max pixels a frame in the y direction, slow it down to 6
		if (this.ySpeed >= this.maxYSpeed || this.ySpeed <= -this.maxYSpeed){
			this.ySpeed = this.ySpeed/abs(this.ySpeed) * this.maxYSpeed
		}
		// Steer if there is a target or don't move
		if(typeof(this.target) == "undefined"){
			this.xSpeed = 0
			this.ySpeed = 0
			return undefined
		}else{
			// Steering in the X direction
			if(this.x + this.size / 2 > this.target.x - this.target.size / 2 || this.x - this.size / 2 < this.target.x + this.target.size / 2){
				this.xSpeed += -3 * ((1/(this.x - this.target.x + .001)) * abs(this.x - this.target.x))
			}else{
				this.xSpeed += -3 * ((1/(this.x - this.target.x + .001)) * abs(this.x - this.target.x))
			}
			// Steering in the Y direction
			if(this.y  + this.size / 2 > this.target.y - this.target.size / 2 || this.y - this.size / 2  < this.target.y + this.target.size / 2){
				this.ySpeed += -3 * ((1/(this.y - this.target.y + .001)) * abs(this.y - this.target.y))
			}else{
				this.ySpeed += -3 * ((1/(this.y - this.target.y + .001)) * abs(this.y - this.target.y))
			}
		}
	}
	
	
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.findTarget = function(entityList){
		if(this.breedNeed > this.feedNeed && this.lifeSpan > 30){
			if(this.findValidMates(entities).length > 0){
				this.target = this.findMate(this.findValidMates(entities))
				//print("\n", this, "Targeting", this.target)
			}else{
				//this.breedNeed = 0
				this.target = this.findFood()
			}
		}else{
			this.target = this.findFood()
		}
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	// Returns an array of mobs that can be bred with
	this.findValidMates = function(){
		var matched = []
		// Loop through all mobs on the map
		for(var i = 0; i < entities.length; i++){
			// Check if the mobs being compared are not the same mob and can breed before comparing colors
			if(entities[i] != this && this.canBreed ){//&& entities[i].canBreed){
				// Check if mob is close enough of an rgb value
				if(compareRgb(this.rgb, entities[i].rgb) < 20){
					matched.push(entities[i])
				}
			}
		}
		// Return array of all valid mates on map
		//print("matched: ", matched)
		return matched
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.findMate = function(entityList){
		if(!entityList[0]){
			// No valid mates
			print("no valid mates for", this)
			return undefined
		}else{
			var closest = entityList[0]
			// Compare all the breedable mobs and find the closest one
			for(var i = 1; i < entityList.length; i++){
				if(dist(this.x, this.y, entityList[i].x, entityList[i].y) < dist(this.x, this.y, closest.x, closest.y)){
					closest = entityList[i]
				}
			}
			// Return closest valid mate
			return (closest)
		}
		// vv I don't think this ones necessary vv
		// No valid mates
		print("no valid mates for", this)
		return undefined
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
		this.findFood = function(){
		if(typeof(foods[0]) == "undefined"){
			return undefined
		}else{
			var closest = foods[0]
			for(var i = 0; i < foods.length; i++){
				if(dist(this.x, this.y, foods[i].x, foods[i].y) < dist(this.x, this.y, closest.x, closest.y)){
					closest = foods[i]
				}
			}
			//Return closest food
		return(closest)
		}
	}
	
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	this.breed = function(other){
		this.breedNeed -= this.feedNeed
		this.canBreed = false
		//other.breedNeed -= other.feedNeed
		//other.canBreed = false
		childLifespan = this.lifeSpan * .2 + other.lifeSpan * .2
		var rand = [this, other]
		childSize = mutate(rand[round(random(0,1))].minSize, [40, 80 + .2*this.minSize])
		//childMaxSpeed = mutate(rand[round(random(0,1))].maxXSpeed, [8, 40 + .2*this.maxXSpeed])
		childFeedNeed = mutate(rand[round(random(0,1))].feedNeed, [800, 2000 + .2*this.feedNeed])
		this.lifeSpan *= .8
		//other.lifeSpan *= .8
		child = new Mob(mutate(average(this.r, other.r), [0, 255]), mutate(average(this.g, other.g), [0,255]), mutate(average(this.b, other.b), [0,255]), average(this.x, other.x), average(this.y, other.y), childSize, childLifespan)
		
		//child.maxXSpeed = childMaxSpeed
		//child.maxYSpeed = childMaxSpeed
		child.feedNeed = childFeedNeed
		child.maxBreedNeed = child.feedNeed*5
		if(this.generation > other.generation){
			child.generation = this.generation + 1
		}else{
			child.generation = other.generation + 1
		}
		child.litterSize = mutate(rand[round(random(0,1))].litterSize, [1, int(8 + this.litterSize*.2)])
		child.tree = this.tree
		child.tree.push([this, other])
		entities.push(child)
		this.numChildren += 1
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
			entities.push(new Mob(this.r, this.g, this.b, this.x, this.y, this.minSize, this.minSize/this.size * this.lifeSpan))
			this.size -= this.minSize
			this.lifeSpan -= this.minSize/this.size * this.lifeSpan
		}

	}	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.search = function(entities, foods){
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
							if(compareRgb(this.rgb, other.rgb)
							< 20){
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
}
