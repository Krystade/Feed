//************FIXED************
// Ungrouping now works with larger game areas (width and height)


/*
** TO FIX
** 
** Text looks bad on different computers not sure if i fixed it
** BREEDING NOT WORKING
**
** Different shapes attract to each other
** Handling/steering, go straight at target -- not have a fixed speed to increase/decrease
** 
*/

/*
** TO DO
**
** DROP DOWN MENU - fill out the menu with more options. maybe change growth rate and food rate.
**
** Display which colors are the most dominante. maybe top 3 colors that have the highest populations
**
** Adjust the times that mobs are able to split rather than breed
**
** "collision" for multiple shapes
** Zooming in on mouse cursor not 0,0
** fighting?
** Collision between mobs
**
**
** GENES
** make an ai control each mob
** give them the ability to split whenever
** have a penalty for splitting, maybe only keep 80% of the lifespan or something
** maybe have combined lifespan count as score or most circles on the screen for the longest time. a mix of both would be good. give a multiplier of something like 1.1 or something for each aditional entity of the same color
*/

// Variable used to retain how much scaling should occur
// zoom has to be log(1) so the scale is 1
var zoom = Math.log(1)
// Variable used to retain how much translation should occur
var trans = [0,0]
// How quickly entities grow
var growthTimer = 0	
// How quickly food spawns
var foodRate = .5	
// Frame rate cap. number of frames per second
var fr = 30

var entities = []
var foods = []
var pressed = 0
var menuPressed = false


function setup() {	
	createCanvas(windowWidth, windowHeight)
	frameRate(fr)
	// Setting the area that food is allowed to spawn in
	aWidth = 10000
	aHeight = 10000
	
	menu = new Menu(30, 90)

	
	for(var i = 0; i < 10; i++){		
		//entities.push(new Mob(5, 25, 2, 0, 0, 20, 10, foods, "circle"))
		//entities.push(new Mob(5, 25, 2, 0, 0, 20, 10, foods, "square"))
		//entities.push(new Mob(5, 25, 2, 0, 0, 20, 10, foods, "triangle"))
		entities.push(new Mob(random(0,255), random(0,255), random(0,255), 0, 0, 60, 10, foods, "circle"))
	}
	entities.push(new Mob(104, 40, 186, 0, 0, 60, 10, foods, "circle"))
	for(var i = 0; i < 50; i++){
		foods.push(new Food(ceil(random(30,aWidth)),ceil(random(30,aHeight))))
	}
	ungroup()
}

function draw() {
	push()
	// Controls adjusting growth rate
	if (entities.length > 0){
		growth = entities[0].growth
	}else{
		growth = 2
	}
	// Set the background color
	background (200)
	// Number to scale the canvas by
	scaleNum = Math.pow(10, zoom)	

	// Scale and translate all entities to simulate zooming and moving
	scale(scaleNum)
	translate(trans[0], trans[1])

	// Move all entities right simulating the view moving left
	if (keyIsDown(LEFT_ARROW)){
		trans[0] = trans[0] + 50
		print("Left")
    }	
	// Move view up
	if (keyIsDown(UP_ARROW)){
		trans[1] = trans[1] + 50
    }
	// Move view right
	if (keyIsDown(RIGHT_ARROW)){
		trans[0] = trans[0] - 50
    }
	// Move view down
	if (keyIsDown(DOWN_ARROW)){
		trans[1] = trans[1] - 50
    }
	
	//Detect if the mouse is being held down to make a mob every 3 frames
	if (mouseIsPressed){
		pressed++
		if(pressed % 2 == 0 && pressed > 10){
			entities.push(new Mob(random(0,255), random(0,255), random(0,255), mouseX * (1/scaleNum) - trans[0],  mouseY * (1/scaleNum) - trans[1], 20, 10, foods, "circle"))
		}
	}else{
		pressed = 0
	}
	
	//(foodRate) foods are spawned each frame
	if (foodRate < 1 && foodRate > 0 && frameCount % (1/foodRate) == 0){
		foods.push(new Food(random(30,aWidth),random(30,aHeight)))
	}else if (foodRate >= 1){
		for (var i = 0; i < foodRate; i++){
			foods.push(new Food(random(30,aWidth),random(30,aHeight)))
		}
	}else{
	//Don't spawn food if food rate is negative
	}
	//Display food
	for(var i = 0; i < foods.length; i++){
		foods[i].display()
	}
	for(var i = 0; i < entities.length; i++){
		if(entities[i].lifeSpan <= 0){
			if(i == 0){
				entities.shift()
			}else{
				entities.splice(i,1)
				i--
			}
		}
		if (entities[i]){
			entities[i].search(entities, foods)
			entities[i].display()
			entities[i].move()
			entities[i].separate()
			for(var j = i + 1; j < entities.length; j++){
				if(entities[i].breed(entities[j])){
					entities[i].canBreed = false
					entities[j].canBreed = false
					entities[i].foundMate = false
					entities[j].foundMate = false
					entities.push(new Mob((entities[i].r + entities[j].r)/2, (entities[i].g + entities[j].g)/2, (entities[i].b + entities[j].b)/2, (entities[i].x + entities[j].x)/2, (entities[i].y + entities[j].y)/2, 50, 10, foods, entities[i].shape))
					entities[entities.length -1].search(entities, foods)
					entities[i].lifeSpan -= 5
					entities[j].lifeSpan -= 5
				}
			}

			for(var j = 0; j < foods.length; j++){
			//Check if the mob exists and if it is within range of food
				if(foods[j]){
					if(entities[i].eats(foods[j])){
						//If it does remove the food and lengthen the mob's life
						if(j == 0){
							foods.shift()
						}else{
							foods.splice(j,1)
							j--
						}  
						entities[i].lifeSpan += 2
					}
				}
			}

			//Keep track of breed ability as time goes on
			if (entities[i].breedCoolDown > 0){
				entities[i].breedCoolDown -= 1
			}else{
				entities[i].canBreed = true
			}
		}
		
	}
	// push() at start of draw so the text stays in view
	pop()
	// push() to keep the menu button in the top right corner
	tempTrans = [trans[0], trans[1]]
	push()
	scale(1)
	trans = [0,0]
	// Drawing the menu button and all the menu details
	menu.display()
	if(menuPressed == true){
		menu.displayBox()
	}else{}

	pop()
	
	trans = [tempTrans[0], tempTrans[1]]
	//Time and Population
	fill(0)
	strokeWeight(0)
	textSize(20)
	textAlign(LEFT)
	time = frameCount / fr
	minutes = Math.floor(time / 60)
	time = floor(time - minutes * 60)
	text("Time:  " + minutes + ":" + time, 20, 45)
	text("Population: " + entities.length, 20, 65)
	//Instructions
	textAlign(CENTER)
	text("Click to create 1 circle, hold for many", windowWidth / 2, 25)
	//Growth Rate
	fill(35, 224, 67)
	strokeWeight(1.5)
	textSize(30)
	textAlign(RIGHT)
	//Only have the Growth Rate displayed for a few seconds
	if (growthTimer > 0){
		growthTimer--
		text ("Growth Rate: " + growth, windowWidth - 60, 100)
	}
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function ungroup(){
	var section = {aWidth:aWidth / ceil(sqrt(entities.length)), aHeight:aHeight / ceil(sqrt(entities.length))}
	var m = 0
	for (var i = 0; i < sqrt(entities.length); i++){
		for (var j = 0; j < sqrt(entities.length); j++){
			entities[m].x = section.aWidth * i + .5 * section.aWidth
			entities[m].y = section.aHeight * j + .5 * section.aHeight
			m++
			if (m == entities.length){
				break
			}
		}
		if (m == entities.length){
			break
		}
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mousePressed() {
	if(dist(mouseX, mouseY, menu.x, menu.y) < menu.size/2){
		if (menuPressed == false){
			menuPressed = true
		}else{
			menuPressed = false
		}
		print("Menu clicked", menuPressed)
	// First item in menu
	}else if(menuPressed &&
			mouseX > menu.x - menu.size/2 && 
			mouseX < menu.x - menu.size/2 + menu.width &&
			mouseY > menu.y + menu.size/1.5 && 
			mouseY < menu.y + menu.size/1.5 + 30){
		print("Item 1")
		ungroup()
	// Second item in menu
	}else if(menuPressed &&
			mouseX > menu.x - menu.size/2 && 
			mouseX < menu.x - menu.size/2 + menu.width &&
			mouseY > menu.y + menu.size/1.5 && 
			mouseY < menu.y + menu.size/1.5 + 60){
		print("Item 2")
		entities = []
	// Third item in menu
	}else if(menuPressed &&
			mouseX > menu.x - menu.size/2 && 
			mouseX < menu.x - menu.size/2 + menu.width &&
			mouseY > menu.y + menu.size/1.5 && 
			mouseY < menu.y + menu.size/1.5 + 90){
		print("Item 3")
		if(mouseX > menu.x + 70 &&
		   mouseX < menu.x + 120 &&
		   mouseY > menu.y + menu.size + 55 &&
		   mouseY < menu.y + menu.size + 75){
			print("Wait for input for how many circles should be made")
		}
	}else{
		entities.push(new Mob(random(0,255), random(0,255), random(0,255), mouseX * (1/scaleNum) - trans[0],  mouseY * (1/scaleNum) - trans[1], 50, 10, foods, "circle"))
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function keyPressed() {
	//keyCode 85 is u
	if (keyCode == 85){
		ungroup()
		}
	//keyCode 67 is c
	if (keyCode == 67){
		entities.splice(0,entities.length)
		}
	//keycode 187 is = or +
	if (keyCode == 187){
		for(var i = 0; i < entities.length; i++){
			//Multiply number by 10 then round and divide by 10 to get it rounded to first decimal
			entities[i].growth = Math.round((entities[i].growth + .2) * 10) / 10
		}
		growthTimer = 30
	}
	//keyCode 189 is - or _
	if (keyCode == 189){
		for(var i = 0; i < entities.length; i++){
			//Multiply number by 10 then round and divide by 10 to get it rounded to first decimal
			entities[i].growth = Math.round((entities[i].growth - .2) * 10) / 10
		}
		growthTimer = 30
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mouseWheel(event) {
	if(event.delta < 0){
		zoom = zoom + .05
	}else{
		zoom = zoom - .05
	}
}

