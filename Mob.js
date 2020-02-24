function Mob (r, g, b, x, y, size, lifeSpan){
	this.mob = true
	this.food = false
	//Location and Speed
	this.x = x
	this.y = y
	//Current size of the mob
	this.size = size
	//Max size the mob will be
	this.maxSize = size * 4
	//Starting size, Minimum size the mob will be
	this.minSize = size
	this.xSpeed = .0001//random(-4, 3)
	this.ySpeed = .0001//random(-4, 3)
	this.speed = sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed)
	//How quickly a mob can accelerate in any given direction
	//this.acc = random(1,10)
	this.speedGene = random(0,3)
	this.baseSpeed = (1500 - this.size)*.05 + this.speedGene
	this.maxXSpeed = this.baseSpeed
	this.maxYSpeed = this.baseSpeed
	this.maxSpeed = sqrt(this.maxXSpeed * this.maxXSpeed + this.maxYSpeed * this.maxYSpeed)
	
	//Aging and Growth
	this.frames = ceil(random(0, 10))
	this.lifeSpan = lifeSpan
	//Time when mob was created
	this.created = getTime(frameCount)
	//How old the mob is in frames
	this.age = 0
	this.timeAlive = 0
	//Id of mob created
	this.id = currentId
	currentId++
	//How quickly they grow
	this.growth = growthRate
	
	//How long it has been since the mob has fed
	this.feedNeed = random(400, 4000)
	//Breeding
	//Maximum number of offspring that can be had at once
	this.litterSize = int(random(1,8))
	//Percent of current lifespan given to offspring
	this.childLife = random(.05, .9)
	//this.childLife = .2
	//How long since the mob has bred
	this.breedNeed = 0
	//Cap number of offspring created at once to 5
	this.maxBreedNeed = this.feedNeed * this.litterSize
	//If the mob is ready to breed
	this.canBreed = false
	//The minimum amount of life before searching for a mate
	this.matingLifespanThreshold = random(10, 80)
	//If the mob has enough life to search for a mate
	this.canSearch = false
	//How many generations in the mob is
	this.generation = 1
	//Array of all ancestors
	this.tree = []
	//How many children the mob has had
	this.numChildren = 0
	//How many times a mob has split
	this.timesSplit = 0
	//Cooldown is 30 seconds
	//this.breedCoolDown = fr * 30
	
	this.visionRange = 4
	
	this.highlighted = false
	this.prevSector = [-1, -1]
	this.sector = [0,0]
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
		//Mob ages every frame
		this.age++
		//If the mob is a the max age, kill it
		if(this.age > 30 * 60 * 60){
			this.die()
		}
		this.timeAlive = getTime(this.age)
		//Update base and max speeds
		if(this.size < this.maxSize){
			this.baseSpeed = (1500 - this.size)*.02 + this.speedGene
			this.maxXSpeed = this.baseSpeed
			this.maxYSpeed = this.baseSpeed
		}
		//Check if breed cooldown has completed before being able to breed
		if(this.breedNeed >= this.feedNeed){
			this.canBreed = true
		}
		//Move the mob
		this.move()
		
		//Check if the mob is on screen before displaying it
		if(this.x + this.size/2 > -trans[0] && this.x - this.size/2 < windowWidth/scaleNum - trans[0] && this.y + this.size/2 > -trans[1] && this.y - this.size/2 < windowWidth/scaleNum - trans[1]){
			this.display()
		}
		//this.split()
		if(this.maxBreedNeed > this.breedNeed){
			this.breedNeed++
		}
		//If the mob is targetting another mob and is close enough, breed
		if(typeof(this.target) != "undefined" && this.target.mob && dist(this.x, this.y, this.target.x, this.target.y) < (this.size/2 + this.target.size/2)){
			this.breed(this.target)
		}
		
		//If the mob moves to a different sector
		if((this.sector[0] != this.prevSector[0]) || (this.sector[1] != this.prevSector[1])){
			secX = this.sector[0]
			secY = this.sector[1]
			sectors[secX][secY].push(this)
			//Check if the previous sector the mob was in was valid and if so
			//Loop through the sector that the mob was in and remove it from the array when found
			if(this.prevSector[0] != -1 && this.prevSector[1] != -1){
				for(var j = 0; j < sectors[this.prevSector[0]][this.prevSector[1]].length; j++){
					if(this == sectors[this.prevSector[0]][this.prevSector[1]][j]){
						sectors[this.prevSector[0]][this.prevSector[1]].splice(j,1)
						//print("moved from " + this.prevSector + " to " + this.sector)
						break
					}
				}
			}
		}
		//Need this at the end so newly created mobs get added to the right sector automatically
		//Update entities sector
		//Not sure if doing this is a waste or not. Think its the exact same as this.prevSector = this.sector
		this.prevSector[0] = this.sector[0]
		this.prevSector[1] = this.sector[1]
		//Finding and assigning the entities sector
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
		stroke(0)
		strokeWeight(2)
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
		//Opacity directly correlates to lifeSpan, 0 is clear 255 is solid
		this.color = color(this.r, this.g, this.b, this.lifeSpan * 5)
		pop()
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.move = function(){
		debug = false
		if(debug){
			start = millis()
		}
		this.x += this.xSpeed
		this.y += this.ySpeed
		
		//Steer if there is a target or don't move
		if(typeof(this.target) == "undefined"){
			this.xSpeed /= 1.025
			this.ySpeed /= 1.025
			return undefined
		}else{
			this.xDir = (this.target.x - this.x)/abs(this.target.x - this.x + .0001)
			//Steering in the X direction
			//If the mob is accelerating the same direction it is moving it wont exceed its max x speed by more than 3
			if(abs(this.xSpeed + (3*this.xDir)) <= this.maxXSpeed){
				this.xSpeed += 3*this.xDir
			}else{}
			this.yDir = (this.target.y - this.y)/abs(this.target.y - this.y + .0001)
			//Steering in the Y direction
			//If the mob is accelerating the same direction it is moving it wont exceed its max y speed by more than 2
			if(abs(this.ySpeed + (3*this.yDir)) <= this.maxYSpeed){
				this.ySpeed += 3*this.yDir
			}
			//Calculating current speed and max speed
			this.speed = sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed)
			//Max speed is changing until the mob is fully grown
			this.maxSpeed = sqrt(this.maxXSpeed * this.maxXSpeed + this.maxYSpeed * this.maxYSpeed)
		}
		if(debug){
			print("move took " + (millis() - start) + "ms")
		}
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.findTarget = function(){
		debug = true
		if(debug){
			start = millis()
		}
		foodList = []
		mobList = []
		for(var row = -this.visionRange; row <= this.visionRange; row++){
			//Make sure not to check any sectors outside of the spawning range
			if(this.sector[0] + row >=0 && this.sector[0] + row < aWidth/sectorSize){
				for(var column = -this.visionRange; column <= this.visionRange; column++){
					//Make sure not to check any sectors outside of the spawning range
					if(this.sector[1] + column >=0 && this.sector[1] + column < aHeight/sectorSize){
						for(var i = 0; i < sectors[this.sector[0] + row][this.sector[1] + column].length; i++){
							if(sectors[this.sector[0] + row][this.sector[1] + column][i].food){
								foodList.push(sectors[this.sector[0] + row][this.sector[1] + column][i])
							}else{
								mobList.push(sectors[this.sector[0] + row][this.sector[1] + column][i])
							}
						}
					}
				}
			}
		}
		//Only stop the mob from searching if it drops below the threshold
		if(this.lifeSpan < this.matingLifespanThreshold){
			this.canSearch = false
		//Once it has a decent buffer to allow for travel time, then search for a mate
		}else if(this.lifeSpan > this.matingLifespanThreshold + 15){
			this.canSearch = true
		}else{}
		
		if(this.breedNeed > this.feedNeed && (this.lifeSpan > 45 || this.canSearch)){
			//Switch entities for mobList to limit breeding to those in vision range
			if(this.findValidMates(mobList).length > 0){
				this.target = this.findMate(this.findValidMates(mobList))
				//print("\n", this, "Targeting", this.target)
			}else{
				//this.breedNeed = 0
				this.target = this.findFood(foodList)
			}
		}else{
			this.target = this.findFood(foodList)
		}
		if(debug){
			print("findTarget took " + (millis() - start) + "ms")
		}
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	//Returns an array of mobs that can be bred with
	this.findValidMates = function(){
		debug = false
		if(debug){
			start = millis()
		}
		var matched = []
		//Loop through all mobs on the map
		for(var i = 0; i < entities.length; i++){
			//Check if the mobs being compared are not the same mob and can breed before comparing colors
			if(entities[i] != this && this.canBreed ){//&& entities[i].canBreed){
				//Check if mob is close enough of an rgb value
				if(compareRgb(this.rgb, entities[i].rgb) < 20){
					matched.push(entities[i])
				}
			}
		}
	if(debug){
		print("findValidMates took " + (millis() - start) + "ms")
	}
		//Return array of all valid mates on map
		return matched
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.findMate = function(entityList){
		debug = false
		if(debug){
			start = millis()
		}
		var closest = entityList[0]
		//Compare all the breedable mobs and find the closest one
		for(var i = 1; i < entityList.length; i++){
			if(dist(this.x, this.y, entityList[i].x, entityList[i].y) < dist(this.x, this.y, closest.x, closest.y)){
				closest = entityList[i]
			}
		}
		//Return closest valid mate
		if(debug){
			print("findMate took " + (millis() - start) + "ms")
		}
		return (closest)
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.findFood = function(foodList){
		debug = false
		if(debug){
			start = millis()
		}
		if(typeof(foodList[0]) == "undefined"){
			return undefined
		}
		var closest = foodList[0]
		for(var i = 0; i < foodList.length; i++){
			if(dist(this.x, this.y, foodList[i].x, foodList[i].y) < dist(this.x, this.y, closest.x, closest.y)){
				closest = foodList[i]
			}
		}
		//Return closest food
		if(debug){
			print("findFood took " + (millis() - start) + "ms")
		}
			return(closest)
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.breed = function(other){
		debug = false
		if(debug){
			start = millis()
		}
		this.breedNeed -= this.feedNeed
		this.canBreed = false
		childLifespan = this.lifeSpan * this.childLife
		this.lifeSpan *= 1 - this.childLife
		
		var rand = [this, other]
		childSize = mutate(rand[round(random(0,1))].minSize, [40, 80 + .2*this.minSize])
		
		child = new Mob(mutate(average(this.r, other.r), [0, 255]), mutate(average(this.g, other.g), [0,255]), mutate(average(this.b, other.b), [0,255]), average(this.x, other.x), average(this.y, other.y), childSize, childLifespan)
		
		child.childLife = mutate(rand[round(random(0,1))].childLife, [.0001, .99])
		child.matingLifespanThreshold = mutate(rand[round(random(0,1))].matingLifespanThreshold, [10, 80])
		child.feedNeed = mutate(rand[round(random(0,1))].feedNeed, [100, 4000 + this.feedNeed*.2])
		child.litterSize = mutate(rand[round(random(0,1))].litterSize, [1.1, (8 + this.litterSize*.2)])
		child.maxBreedNeed = child.feedNeed * child.litterSize
		child.speedGene = mutate(rand[round(random(0,1))].speedGene, [0, 5])
		for(var i = 0; i < this.tree.length; i++){
			child.tree.push([this.tree[i][0],this.tree[i][1]])
		}
		child.tree.push([this, other])
		/*if(this.generation > other.generation){
			child.generation = this.generation + 1
		}else{
			child.generation = other.generation + 1
		}*/
		child.generation = child.tree.length
		entities.push(child)
		this.numChildren += 1
		if(debug){
			print("breed took " + (millis() - start) + "ms")
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
	
	this.split = function(){
		this.timesSplit++
		//If the mobs have enough lifespan they will split into two identical halves
		//Lose a considerable amount of lifespan but guarantees a possible mate
		if(this.lifeSpan >= 500){
			this.lifeSpan *= .70
			this.breedNeed = 0
			copy = new Mob(this.r, this.g, this.b, this.x, this.y, this.size/2, this.lifeSpan/2)
			
			copy.minSize = this.minSize
			copy.maxSize = this.maxSize
			copy.feedNeed = this.feedNeed
			copy.litterSize = this.litterSize
			copy.maxBreedNeed = this.maxBreedNeed
			copy.matingLifespanThreshold = this.matingLifespanThreshold
			copy.childLife = this.childLife
			copy.speedGene = this.speedGene
			copy.generation = this.generation
			for(var i = 0; i < this.tree.length; i++){
				copy.tree.push([this.tree[i][0],this.tree[i][1]])
			}
			
			entities.push(copy)
			this.size /= 2
			this.lifeSpan /= 2
		}
	}
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.die = function(){
		//Lose 40% of lifespan before turning into food
		this.lifeSpan *= .60
		while(this.lifeSpan > 0){
			var newFood = new Food(this.x + random(this.size * -2, this.size * 2), this.y + random(this.size * -2, this.size * 2))
			//var newFood = new Food(this.x, this.y)
			newFood.color = color(255,215,0)
			if(this.lifeSpan > 10){
				var randPercent = random(0, .2)
				newFood.value = this.lifeSpan * randPercent
				this.lifeSpan *= 1 - randPercent
			}else{
				newFood.value = this.lifeSpan
				this.lifeSpan = 0
				this.xSpeed = 0
				this.ySpeed = 0
			}
			newFood.xSpeed = random(-100, 100)
			newFood.ySpeed = random(-100, 100)
			foods.push(newFood)
		}
	}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
}