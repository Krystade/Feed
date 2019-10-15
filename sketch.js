/*
** TO FIX
** 
** BREEDING NOT WORKING
**
** Different shapes attract to each other
** 
*/

/*
** TO DO
**
** Put in some millis() to track how long functions take to run
** Look into anonymous functions and make them not anonymous
**
** DROP DOWN MENU - fill out the menu with more options:
**			clear Food
**			place mode: Mob[x] Food[ ]
**			growthRate
**			foodRate
**			change food spawning area (Awidth, Aheight)
**			Random Color[ ]		custom color[x]
**					R:[   ] G:[   ] B:[   ]
**
** Adjust the times that mobs are able to split rather than breed
**
** "collision"(hitboxes) for multiple shapes when eating food
** Zooming in on mouse cursor not 0, 0
** Collision between mobs
**
**
** 		GENES (each with a value 0-1000) 
**		(weighted average of two genes when breeding) + random(-x, +x) 
**		(1/16 chance to completely randomize)
** amount of life given to offspring
** required lifespan before breeding (At a certain lifespan look for a mate)
** minSize, maxSize
** bordeness (how much time until the mob chooses a different target (food, mob))
** sight distance (sectors)
** maybe remove the color requirements for breeding so any of them can breed with any others
** new form of movement (jumping)(add value to velocity)(slow down mob as time goes on)
**
**
** make an ai control each mob
** give them the ability to split whenever
** have a penalty for splitting, maybe only keep 80% of the lifespan or something
** maybe have combined lifespan count as score or most circles on the screen for the longest time. a mix of both would be good. give a multiplier of something like 1.1 or something for each aditional entity of the same color
*/

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
// How quickly food spawns
var foodRate = .5
// Frame rate cap. number of frames per second
var fr = 30

var entities = []
var foods = []
var colors = []
var pressed = 0
var menuPressed = false

var sectorDimensions = []
var sectorSize = 2000
var sectors = []



function setup() {
	createCanvas(windowWidth, windowHeight)
	frameRate(fr)
	// Setting the area that food is allowed to spawn in
	aWidth = sectorSize * 6
	aHeight = sectorSize * 6
	
	for(var i = 0; i < aWidth; i += sectorSize){
		for(var j = 0; j < aHeight; j += sectorSize){
			sectorDimensions.push(/*[x1, x2, y1, y2]*/[j, j + sectorSize, i, i + sectorSize])
		}
	}
	menu = new Menu(30, 90)

	
	for(var i = 0; i < 100; i++){		
		//entities.push(new Mob(0, 0, 0, 0, 0, 70, 10, foods, "circle"))
		//entities.push(new Mob(0, 0, 0, 0, 0, 70, 10, foods, "square"))
		//entities.push(new Mob(0, 0, 0, 0, 0, 70, 10, foods, "triangle"))
		entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), 0, 0, /*size*/random(40, 80), /*life*/random(8, 14), foods, "circle"))
	}
	for(var i = 0; i < 50; i++){
		foods.push(new Food(ceil(random(30, aWidth)), ceil(random(30, aHeight))))
	}
	ungroup()
}

function draw() {
	if(!paused){
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

		for(var i = 0; i < sectorDimensions.length; i++){
			fill(200)
			stroke(170, 170, 170)
			rect(sectorDimensions[i][0], sectorDimensions[i][2], sectorSize, sectorSize, 5)
		}

		// Move all entities right simulating the view moving left
		if (keyIsDown(LEFT_ARROW)){
			trans[0] = trans[0] + 50
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
				entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), mouseX * (1/scaleNum) - trans[0], mouseY * (1/scaleNum) - trans[1], random(40, 80), 10, foods, "circle"))
			}
		}else{
			pressed = 0
		}

		//(foodRate) foods are spawned each frame
		if (foodRate < 1 && foodRate > 0 && frameCount % (1/foodRate) == 0){
			foods.push(new Food(random(30, aWidth), random(30, aHeight)))
		}else if (foodRate >= 1){
			for (var i = 0; i < foodRate; i++){
				foods.push(new food(random(30, aWidth), random(30, aHeight)))
			}
		}else{
		//Don't spawn food if food rate is negative
		}
		//Display food
		for(var i = 0; i < foods.length; i++){
			foods[i].display()
		}
		// Reset the sector array and fill it with empty arrays
		sectors = []
		for(var i = 0; i < Math.sqrt(sectorDimensions.length); i++){
			sectors.push([])
			for(var j = 0; j < Math.sqrt(sectorDimensions.length); j++){
				sectors[i].push([])
			}
		}
		// Clear out the colors array to refill them with new values
		colors = []
		for(var i = 0; i < entities.length; i++){
			// Remove dead entities
			if(entities[i].lifeSpan <= 0){
				if(i == 0){
					entities.shift()
				}else{
					entities.splice(i, 1)
					i--
				}
			}
			// Make sure the entity is valid
			if (entities[i]){
				// Move the entity
				entities[i].move()
				// Filling the sectors array
				for(var j = 0; j < sectors.length; j++){
					for(var k = 0; k < sectors[j].length; k++){
						if(entities[i].isInside(sectorDimensions[Math.sqrt(sectorDimensions.length) * j + k])){
						sectors[j][k].push(entities[i])
						entities[i].sector = [j, k]
						entities[i].sectorsAdj = [ [j-1, k-1], [j-1, k], [j-1, k+1], 
												   [j, k-1]  , [j, k]  , [j, k+1], 
												   [j+1, k-1], [j+1, k], [j+1, k+1] ]
						}
					}
				}

				// If the entity can split have it split
				//entities[i].separate()
				// Draw the entity to the canvas
				entities[i].display()

				for(var j = 0; j < foods.length; j++){
				//Check if the mob exists and if it is within range of food
					if(foods[j]){
						if(entities[i].eats(foods[j])){
							entities[i].lifeSpan += foods[j].value
							if(entities[i].feedNeed > 300){
								entities[i].feedNeed -= foods[j].value * 10
							}
							//If it does remove the food and lengthen the mob's life
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
				if (entities[i].breedCoolDown > 0){
					entities[i].breedCoolDown -= 1
				}else{
					entities[i].canBreed = true
				}
				// Checking if the entities color is already in the list
				// If it is add to the count
				// If it is not add the color to the list
				colorMatched = false
				for(var j = 0; j < colors.length; j++){
					if(deltaE(rgb2lab([entities[i].r, entities[i].g, entities[i].b]), rgb2lab([colors[j][0], colors[j][1], colors[j][2]])) <= 2){
						colors[j][3] = colors[j][3] + 1
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
		for(var i = 0; i < foods.length; i++){
			for(var j = 0; j < sectors.length; j++){
				for(var k = 0; k < sectors[j].length; k++){
					if(foods[i].isInside(sectorDimensions[Math.sqrt(sectorDimensions.length) * j + k])){
						sectors[k][j].push(foods[i])
						break
					}
				}
			}
		}
		// Can't be in the first entities loop because the sector aray has not been filled yet
		for(var i = 0; i < entities.length; i++){
			// Find which food and which breedable entity is the closest
				entities[i].search(entities, foods)
		}
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
		push()
		scale(1)
		trans = [0, 0]
		// Drawing the menu button and all the menu details
		menu.display()
		if(menuPressed == true){
			menu.displayBox()
		}else{}
		for(var i = 0; i < topColors.length; i++){
			fill(topColors[i][0], topColors[i][1], topColors[i][2])
			ellipse(200 + 50 * i, 50, 15)
			text(topColors[i][3], 200 + 50 * i, 38)
		}
		fill('black')
		noStroke()
		text(colors.length + " Unique Colors", 270, 78)
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
		if(time < 10){
			text("Time:  " + minutes + ":0" + time, 20, 45)
		}else{
			text("Time:  " + minutes + ":" + time, 20, 45)
		}
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
		textAlign(RIGHT)
		fill(255)
		push()
		fill(0)
		textAlign(CENTER)
		// Display the current framerate
		text(str(round(frameRate())), windowWidth - 30, 25)
		textSize(15)
		// Display the x and y position of the mouse in the area
		text(str(round(mouseX * (1/scaleNum) - trans[0])) + ", " + str(round(mouseY * (1/scaleNum) - trans[1])), mouseX, mouseY - 20)
		// Display the x and y position of the mouse in the screen
		text(round(mouseX) + ", " + round(mouseY), mouseX, mouseY - 5)
		pop()
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
		entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), mouseX * (1/scaleNum) - trans[0], mouseY * (1/scaleNum) - trans[1], random(40, 80), 10, foods, "circle"))
		//entities.push(new Mob(100, 400, 15, mouseX * (1/scaleNum) - trans[0], mouseY * (1/scaleNum) - trans[1], random(40, 80), 10, foods, "circle"))
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function keyPressed() {
	//keyCode 32 is spacebar
	if (keyCode == 32){
		if(paused){
			paused = false
		}else{
			paused = true
		}
	}
	//keyCode 85 is u
	if (keyCode == 85){
		ungroup()
		}
	//keyCode 67 is c
	if (keyCode == 67){
		entities.splice(0, entities.length)
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

