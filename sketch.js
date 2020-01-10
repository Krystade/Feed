p5.disableFriendlyErrors = true
// Variable used to pause the game so checking values without anything moving will be easy
var paused = false
// Variable used to retain how much scaling should occur
// zoom has to be log(.5) so the scale is .5
var zoom = Math.log(.5)
var oldZoom = Math.log(.5)
// Variable used to retain how much translation should occur
var trans = [0, 0]

// How quickly entities grow
var growthTimer = 0	
var growthRate = 1
// How quickly food spawns
var foodRate = .5
// Frame rate cap. number of frames per second
var fr = 30

var bground

var entities = []
var foods = []
var colors = []
var pressed = 0
var menuOpen = false
var placeColor = [0, 0, 0]

var sectorSize = 2000
var sectors = []
// [x, y]
var mouseSector = [0, 0]
var mouseXScale = 0
var MouseYScale = 0

var highlightedMob

function setup() {
	createCanvas(windowWidth, windowHeight)
	frameRate(fr)
	// Setting the area that food is allowed to spawn in
	aWidth = sectorSize * 30
	aHeight = sectorSize * 30
	// Color of the background
	bground = color(210, 220, 235)
	// The range of sizes that mobs are spawned in
	sizeRange = [10, 160]
	
	// Fill sectors with empty arrays
		// Number of sectors wide
		for(var i = 0; i < aWidth/sectorSize; i++){
			sectors.push([])
			// Number of sectors tall
			for(var j = 0; j < aHeight/sectorSize; j++){
				sectors[i].push([])
			}
		}
	
	for(var i = 0; i < 100; i++){		
		//entities.push(new Mob(0, 0, 0, 0, 0, 70, 10))
		//entities.push(new Mob(0, 0, 0, 0, 0, 70, 10, foods, "square"))
		//entities.push(new Mob(0, 0, 0, 0, 0, 70, 10, foods, "triangle"))
		entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), 0, 0, /*size*/random(sizeRange[0], sizeRange[1]), /*life*/random(8, 14)))
	}
	
	for(var i = 0; i < 250; i++){
		foods.push(new Food(ceil(random(30, aWidth)), ceil(random(30, aHeight))))
	}
	
	ungroup()
	menu = new Menu(15, 80)
	var highlightedMob = undefined
	
	stats = new Stats(windowWidth - 260, 80, 240, 300)
	print(displayAvgStats())
	
	// Put the camera near the center of the spawning area
	trans = [-aWidth/2, -aHeight/2]
	
	prevMobButton = createButton('Prev Mob')
	prevMobButton.size(85,20)
	prevMobButton.position(windowWidth/2 - 90, windowHeight - 30)
	prevMobButton.mousePressed(highlightPrev)//bPlaceHolder)
	// Follow the mob at the next index
	nextMobButton = createButton('Next Mob')
	nextMobButton.size(85,20)
	nextMobButton.position(windowWidth/2 + 5, windowHeight - 30)
	nextMobButton.mousePressed(highlightNext)
}

function draw() {
	// Every 10 minutes display average stats
	if(frameCount%(10*60*fr) == 0){
		print(displayAvgStats())
		
		// Clearing out any ghost foods. Any food not in foods but still in sectors
		// Loop through each entity in each sector
		for(var i = 0; i < sectors.length; i++){
			for(var j = 0; j < sectors[i].length; j++){
				for(var k = 0; k < sectors[i][j].length; k++){
					if(sectors[i][j][k].food){
						// Compare all foods in foods[] to find a match
						var found = false
						for(var l = 0; l < foods.length; l++){
							if(foods[l].x == sectors[i][j][k].x && foods[l].y == sectors[i][j][k].y){
								found = true
								break
							}
						}
						// If the food isnt in foods, remove it form sectors
						if(!found){
							sectors[i][j].splice(k,1)
						}
					}
				}
			}
		}
	}
	// Number to scale the canvas by
	scaleNum = Math.pow(10, zoom)
	// The mouse position on the map not the screen
	mouseXScale = mouseX * (1/scaleNum) - trans[0]
	MouseYScale = mouseY * (1/scaleNum) - trans[1]
	// Move all entities right simulating the view moving left
	if (keyIsDown(LEFT_ARROW)){
		trans[0] += 700
	}	
	// Move view up
	if (keyIsDown(UP_ARROW)){
		trans[1] += 700
	}
	// Move view right
	if (keyIsDown(RIGHT_ARROW)){
		trans[0] -= 700
	}
	// Move view down
	if (keyIsDown(DOWN_ARROW)){
		trans[1] -= 700
	}
	if(!paused){
		push()
		// Set the background color
		background(bground)
		// Scale and translate all entities to simulate zooming and moving
		scale(scaleNum)
		translate(trans[0], trans[1])
		
		/*Drawing Sector Borders*//*
		push()
		strokeWeight(20)
		stroke(0,0,0,50)
		for(var i = 0; i <= aWidth; i += sectorSize){
			push()
			if(i/sectorSize%5 == 0){
				stroke(250, 80, 130)
			}
			line(i, 0, i, aHeight)
			pop()
		}
		for(var i = 0; i <= aHeight; i += sectorSize){
			line(0, i, aWidth, i)
		}
		pop()
		*/

		//Detect if the mouse is being held down to make a mob every 3 frames
		if (mouseIsPressed){
			pressed++
			if(pressed % 2 == 0 && pressed > 10){
				switch (clickRadio.value()){
					case "Place":
						if(placeRadio.value() == 'Mob'){
							if(colorRadio.value() == 'Random'){
								entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), mouseXScale, MouseYScale, random(sizeRange[0], sizeRange[1]), 10))
							}else{
								placeColor = split(colorInput.value(), ',')
								entities.push(new Mob(int(placeColor[0]), int(placeColor[1]), int(placeColor[2]), mouseXScale, MouseYScale, random(sizeRange[0], sizeRange[1]), 10))
							}
						}else{
							foods.push(new Food(mouseXScale, MouseYScale))
						}
						break
					case "Delete":
				for(var i = 0; i < entities.length; i++){
					if(dist(mouseXScale, MouseYScale, entities[i].x, entities[i].y) < entities[i].size/2){
						// Loop through the sector array that the entity is and remove it
						secX = entities[i].sector[0]
						secY = entities[i].sector[1]
						for(var j = 0; j < sectors[secX][secY].length; j++){
							if(sectors[secX][secY][j] == entities[i]){
								sectors[secX][secY].splice(j,1)
								break
							}
						}
						print("Clicked on ", entities[i])
						entities.splice(i,1)
						i--;
					}
				}
						break
					case "Select":
						for(var i = entities.length - 1; i >= 0; i--){
							if(dist(mouseXScale, MouseYScale, entities[i].x, entities[i].y) <= entities[i].size/2){
								// Check if the clicked on mob is already highlighted
								if(entities[i].highlighted == false){
									//If it isnt already highlighted, highlight it
									entities[i].highlighted = true
									if(typeof(highlightedMob) != "undefined"){
										highlightedMob.highlighted = false
										highlightedMob = entities[i]
									}else{
										highlightedMob = entities[i]
									}
									print("Clicked on", highlightedMob)
									break
								// If the mob is already highlighted, unhighlight it
								}else{
									entities[i].highlighted = false
									highlightedMob = undefined
								}
							}
						}
						break		
				}
			}
		}else{
			pressed = 0
		}
		//(foodRate) foods are spawned each frame
		if (foodRate > 0){
			// Im not exactly sure how this works but it does so im not going to change it.
			if(((frameCount*foodRate)%1).toFixed(4) < foodRate){
			foods.push(new Food(random(30, aWidth), random(30, aHeight)))
			}
			// When foodRate is greater than 1 need to spawn atleast 1 food every frame
			if(foodRate >= 1){
				for(var i = 0; i < int(foodRate); i++){
					foods.push(new Food(random(30, aWidth), random(30, aHeight)))
				}
			}
		}else{
		//Don't spawn food if food rate is 0 or negative
		}
		//Display food and place it in the right sector
		for(var i = 0; i < foods.length; i++){
			foods[i].display()
		}
		// Clear out the colors array to refill them with new values
		colors = []
		for(var i = 0; i < entities.length; i++){
			// Remove dead mobs from sectors[]
			if(entities[i].lifeSpan <= 0){
				secX = entities[i].sector[0]
				secY = entities[i].sector[1]
				// Loop through the sector that the mob is in and remove it from the array when found
				for(var j = 0; j < sectors[secX][secY].length; j++){
					if(entities[i] == sectors[secX][secY][j]){
						sectors[secX][secY].splice(j,1)
						break
					}
				}
				// Remove dead mobs from entities[]
				if(i == 0){
					entities.shift()
				}else{
					entities.splice(i, 1)
					i--
				}
				
			}
			// Make sure the entity is valid
			if (entities[i]){
				// Move, Display, Separate, increase breedNeed
				entities[i].update()
				
				if(typeof(entities.target) != "undefined"){
					if(entities[i].target.mob == false){
						entities[i].findTarget()
					}
				}else{
					entities[i].findTarget(entities, foods)
				}				
				
				// Have the camera follow highlighted mob
				if(typeof(highlightedMob) != "undefined"){
					if((windowWidth/2 * 1/scaleNum) - trans[0] != highlightedMob.x){
						trans[0] = (windowWidth/2 * 1/scaleNum) - highlightedMob.x
					}
					if((windowHeight/2 * 1/scaleNum) - trans[1] != highlightedMob.y){
						trans[1] = (windowHeight/2 * 1/scaleNum) - highlightedMob.y
					}
				}
				
				for(var j = 0; j < foods.length; j++){
				//Check if the mob exists and if it is within range of food
					if(foods[j]){
						if(entities[i].eats(foods[j])){
							//If it does, remove the food and lengthen the mob's life
							entities[i].lifeSpan += foods[j].value
							
							secX = foods[j].sector[0]
							secY = foods[j].sector[1]
							// Loop through the sector that the food is in and remove it from the array when found
							for(var k = 0; k < sectors[secX][secY].length; k++){
								if(foods[j] == sectors[secX][secY][k]){
									sectors[secX][secY].splice(k,1)
									break
								}
							}
							if(j == 0){
								foods.shift()
							}else{
								foods.splice(j, 1)
								j--
							}
						}
					}
				}
				//Keep track of breed ability as time goes on
				/*if (entities[i].breedCoolDown > 0){
					entities[i].breedCoolDown -= 1
				}else{
					entities[i].canBreed = true
				}*/
				if(entities[i].breedNeed > entities[i].feedNeed){
					entities[i].canBreed = true
				}
				// Checking if the entities color is already in the list
				// If it is add to the count
				// If it is not add the color to the list
				colorMatched = false
				for(var j = 0; j < colors.length; j++){
					if(compareRgb(entities[i].rgb, [colors[j][0], colors[j][1], colors[j][2]]) <= 10){
						colors[j][3] += 1
						colorMatched = true
						break
						print("color matched")
					}else{}
				}
				if(!colorMatched){
					colors.push([entities[i].r, entities[i].g, entities[i].b, 1])
				}
			}
		}
		mouseSector = calcSector(mouseXScale, MouseYScale)
		
		// Find which colors have the most circles
		temp = []
		topColors = [[255, 255, 255, 0], [255, 255, 255, 0], [255, 255, 255, 0]]
		for(var i = 0; i < colors.length; i++){
			if(colors[i][3] > topColors[2][3]){
				topColors[2] = [colors[i][0], colors[i][1], colors[i][2], colors[i][3]]

				if(colors[i][3] > topColors[1][3]){
					temp = topColors[1]
					topColors[1] = [colors[i][0], colors[i][1], colors[i][2], colors[i][3]]
					topColors[2] = temp

					if(colors[i][3] > topColors[0][3]){
						temp = topColors[0]
						topColors[0] = [colors[i][0], colors[i][1], colors[i][2], colors[i][3]]
						topColors[1] = temp
					}
				}
			}
		}
		// push() at start of draw so the text stays in view
		pop()
		// push() to keep the menu button in the top right corner
		tempTrans = [trans[0], trans[1]]
		strokeWeight(2)
		stroke(0)
		textSize(20)
		scale(1)
		trans = [0, 0]
		// Drawing the menu
		menu.display()
		stats.display()
		textAlign(CENTER)
		// Drawing the top colors and how many of each top color there is
		for(var i = 0; i < topColors.length; i++){
			fill(topColors[i][0], topColors[i][1], topColors[i][2])
			ellipse(200 + 50 * i, 50, 15)
			text(topColors[i][3], 200 + 50 * i, 38)
		}
		noStroke()
		fill(0)
		textAlign(LEFT)
		text(colors.length + " Unique Colors", 190, 78)
		

		trans = [tempTrans[0], tempTrans[1]]
		//Population
		
		text("Time: " + getTime(), 20, 45)
		
		text("Population: " + entities.length, 20, 65)
		//Instructions
		textAlign(CENTER)
		text("Hold mouse button for rapid click", windowWidth / 2, 25)
		//Growth Rate
		fill(35, 224, 67)
		strokeWeight(1.5)
		textSize(30)
		textAlign(RIGHT)
		//Only have the Growth Rate displayed for a few seconds
		if (growthTimer > 0){
			growthTimer--
			text ("Growth Rate: " + growthRate.toFixed(1), windowWidth - 60, 100)
		}
		textAlign(RIGHT)
		fill(255)
		push()
		fill(0)
		textAlign(CENTER)
		// Display the current framerate
		text(str(round(frameRate())), windowWidth - 30, 25)
		textSize(15)
		
/* Debugging *//*
		// Display the sector the mouse is in
		text("Sector: " + mouseSector, mouseX, mouseY - 35)
		// Display the x and y position of the mouse in the area
		text(str(round(mouseXScale)) + ", " + str(round(MouseYScale)), mouseX, mouseY - 20)
		// Display the x and y position of the mouse in the screen
		text(round(mouseX) + ", " + round(mouseY), mouseX, mouseY - 5)
		pop()
		*/
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightPrev(){
	var index = entities.length-1
	for(var i = 0; i < entities.length; i++){
		if(entities[i] == highlightedMob){
			if(i == 0){
				index = entities.length-1
			   		
			}else{
				index = i-1
			}
			break
		}
	}
	if(highlightedMob){
		highlightedMob.highlighted = false
	}
	highlightedMob = entities[index]
	highlightedMob.highlighted = true
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightNext(){
	var index = 0
	for(var i = 0; i < entities.length; i++){
		if(entities[i] == highlightedMob){
			if(i == entities.length - 1){
				index = 0
			   		
			}else{
				index = i+1
			}
			break
		}
	}
	if(highlightedMob){
		highlightedMob.highlighted = false
	}
	highlightedMob = entities[index]
	highlightedMob.highlighted = true
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

	function calcSector(x, y){
		// Which column
		sectorX = int(x/(sectorSize))
		// Which Row
		sectorY = int(y/(sectorSize))
		
		// If the entity is outside of the food spawning area, pretend they're just in the closest sector
		// Check X Sector
		if(sectorX < 0){
			sectorX = 0
		}else if(sectorX >= aWidth/sectorSize){
				 sectorX = aWidth/sectorSize - 1
		}
		// Check Y Sector
		if(sectorY < 0){
			sectorY = 0
		}else if(sectorY >= aHeight/sectorSize){
				 sectorY = aHeight/sectorSize - 1
		}
		
		sector = [sectorX, sectorY]
		return sector
	} 

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

// Currently only used in changing mutating color, range will be from 0-255 for food but likely 0 - 1000 for other genes when implemented
function mutate(gene, range){
	rand = random()
	min = range[0]
	max = range[1]
	if(rand < .5){
		// Don't mutate 
	}else if(rand < .8){
		//Subtracting .5 so the random number is from -.5 to +.5
		// 10% max increase or decrease of max
		gene += (random() - .5)*max/5
	}else if(rand < .99){
		// 20% max increase or decrease of max
		gene += (random() - .5)*max/2.5
	}else{
		gene = random(min, max)
		//print("Random Gene " + getTime())
	}/*
	if(gene > max){
	   gene = max
	}else if(gene < min){
		gene = min
	}*/
	return gene
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

// Takes input of two rgb color arrays and returns the deltaE value of them
function compareRgb(color1, color2){
	return deltaE(rgb2lab(color1), rgb2lab(color2))
}

function highlight(entity){
	if(typeof(highlightedMob) != "undefined"){
		highlightedMob.highlighted = false
	}
	highlightedMob = entity
	highlightedMob.highlighted = true
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function displayAvgStats(){
	avgLifespan = 0
	avgMaxSize = 0
	avgMinSize = 0
	avgMaxSpeed = 0
	avgFeedNeed = 0
	avgGeneration = 0
	avgChildren = 0
	minGeneration = 999999
	maxGeneration = -1
	for(var i = 0; i < entities.length; i++){
		avgLifespan += entities[i].lifeSpan/entities.length
		avgMaxSize += entities[i].maxSize/entities.length
		avgMinSize += entities[i].minSize/entities.length
		avgMaxSpeed += entities[i].maxXSpeed/entities.length
		avgFeedNeed += entities[i].feedNeed/entities.length
		avgGeneration += entities[i].generation/entities.length
		avgChildren += entities[i].numChildren/entities.length
		if(entities[i].generation > maxGeneration){
			maxGeneration = entities[i].generation
		}else if(entities[i].generation < minGeneration){
			minGeneration = entities[i].generation
		}else{}
	}
	
	/*print*/return("\nTime: " + getTime() + "\nPopulation: " + entities.length + "\nAverage Lifespan: " + avgLifespan + "\nAverage Max Size: " + avgMaxSize + "\nAverage Min Size: " + avgMinSize + "\nAverage Max Speed: " + avgMaxSpeed + "\nAverage Feed Need: " + avgFeedNeed + "\nAverage # of Children: " + avgChildren +"\nMin Generation: " + minGeneration + "\nMax Generation: " + maxGeneration + "\nAverage Generation: " + avgGeneration)
}

function getTime(){
	time = (frameCount) / fr
	hours = floor(time/60/60)
	minutes = floor(time/60 - hours*60)
	seconds = floor(time - minutes*60 - hours*60*60)
	
	return(hours + ":" + nf(minutes, 2) + ":" + nf(seconds,2))
	
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function menuPressed(){
	if (menuOpen == false){
			menuOpen = true
		}else{
			menuOpen = false
		}
		//print("Menu opened", menuOpen)
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	stats = new Stats(windowWidth - 260, 80, 240, 300)
	nextMobButton.position(windowWidth/2 + 5, windowHeight - 30)
	prevMobButton.position(windowWidth/2 - 90, windowHeight - 30)
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mousePressed() {
	//Dimensions of menu button
	if(mouseX < 65 && mouseX > 15 &&
	   mouseY < 100 && mouseY > 80){
		// Prevent any spawning/deleting/selecting
		
	// Dimensions of menu options when opened
	}else if(menuOpen &&
			mouseX > menu.x && 
			mouseX < menu.x + menu.width &&
			mouseY > menu.y + menu.size[1] + 10 && 
			mouseY < menu.y + menu.height + menu.size[1] + 10){
			// Prevent any spawning/deleting/selecting
		
	// If a mob is highlighted and its stats are being displayed
	// Don't create a mob when clicking on the stats box
	}/*else if(stats.open && 
			mouseX > stats.x && 
			mouseX < stats.x + stats.w &&
			mouseY > stats.y && 
			mouseY < stats.y + stats.h){
			 // Prevent any spawning/deleting/selecting
	}*/else{
		switch (clickRadio.value()){
			case "Place":
				if(placeRadio.value() == 'Mob'){
					if(colorRadio.value() == 'Random'){
						entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), mouseXScale, MouseYScale, random(sizeRange[0], sizeRange[1]), 10))
					}else{
						placeColor = split(colorInput.value(), ',')
						entities.push(new Mob(int(placeColor[0]), int(placeColor[1]), int(placeColor[2]), mouseXScale, MouseYScale, random(sizeRange[0], sizeRange[1]), 10))
					}
				}else{
					foods.push(new Food(mouseXScale, MouseYScale))
				}
				break
			case "Delete":
				for(var i = 0; i < entities.length; i++){
					if(dist(mouseXScale, MouseYScale, entities[i].x, entities[i].y) < entities[i].size/2){
						// Loop through the sector array that the entity is and remove it
						secX = entities[i].sector[0]
						secY = entities[i].sector[1]
						for(var j = 0; j < sectors[secX][secY].length; j++){
							if(sectors[secX][secY][j] == entities[i]){
								sectors[secX][secY].splice(j,1)
								break
							}
						}
						print("Clicked on ", entities[i])
						entities.splice(i,1)
						i--;
					}
				}
				break
			case "Select":
				for(var i = entities.length - 1; i >= 0; i--){
					if(dist(mouseXScale, MouseYScale, entities[i].x, entities[i].y) <= entities[i].size/2){
						// Check if the clicked on mob is already highlighted
						if(entities[i].highlighted == false){
							//If it isnt already highlighted, highlight it
							entities[i].highlighted = true
							if(typeof(highlightedMob) != "undefined"){
								highlightedMob.highlighted = false
								highlightedMob = entities[i]
							}else{
								highlightedMob = entities[i]
							}
							print("Clicked on", highlightedMob)
							break
						// If the mob is already highlighted, unhighlight it
						}else{
							entities[i].highlighted = false
							highlightedMob = undefined
						}
					}
				}
				break		
		}
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function keyPressed() {
	//keyCode 32 is spacebar
	if (keyCode == 32){
		if(paused){
			paused = false
		}else{
			//paused = true
		}
	}
	//keyCode 85 is u
	if (keyCode == 85){
		ungroup()
		}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mouseWheel(event) {
	oldZoom = zoom
	if(event.delta < 0){
		zoom = zoom + .05
	}else{
		zoom = zoom - .05
	}
	
	//https://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate

}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

//Computes the average of two values
function average(value1, value2){
	return((value1 + value2)/2)
}

// the following functions are based off of the pseudocode
// found on www.easyrgb.com
// I took this code from https://github.com/antimatter15/rgb-lab/blob/master/color.js

function rgb2lab(rgb){
  var r = rgb[0] / 255, 
      g = rgb[1] / 255, 
      b = rgb[2] / 255, 
      x, y, z;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

// calculate the perceptual distance between colors in CIELAB
// https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs

function deltaE(labA, labB){
  var deltaL = labA[0] - labB[0];
  var deltaA = labA[1] - labB[1];
  var deltaB = labA[2] - labB[2];
  var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  var deltaC = c1 - c2;
  var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  var sc = 1.0 + 0.045 * c1;
  var sh = 1.0 + 0.015 * c1;
  var deltaLKlsl = deltaL / (1.0);
  var deltaCkcsc = deltaC / (sc);
  var deltaHkhsh = deltaH / (sh);
  var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

