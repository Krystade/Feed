/*
** TO FIX
** 
** BREEDING NOT WORKING
** Pause doesnt allow for scrolling/zooming
** Different shapes attract to each other
** 
**

/*
** TO DO
**
** Click on a mob and highlight it. Display mob stats maybe genes while highlighted. Show highlight over all other shapes but not text
**Follow highlighted mob. change trans so that it is always in the center of the screen
**
** Add color to closest colors[] not whichever one is first and similar
** Add option to group by species(color)
** Shaders
**
** Fix maxspeed check so they dont accelerate any more if it is over the max speed but still allow for them surpass it when. like if they get shot away from parents when born
**
** Put in some millis() to track how long functions take to run
** Look into anonymous functions and make them not anonymous
**
**
** DROP DOWN MENU - fill out the menu with more options:
**			click mode: delete[ ] place[x] select[ ]
**			place mode: Mob[x] Food[ ]
**			mob color:  Random[ ] custom[x]
**					R:[   ] G:[   ] B:[   ]
**			growthRate [ ]
**			foodRate [ ]
**			create [  ] mobs
**			create [  ] foods
**			change food spawning area (Awidth, Aheight)
**
** Adjust the times that mobs are able to split rather than breed
**
** "collision"(hitboxes) for multiple shapes when eating food
** Zooming in on mouse cursor not 0, 0
**
** 		GENES (each with a value 0-1000) 
**		(weighted average of two genes when breeding) + random(-x, +x) 
**		(1/16 chance to completely randomize)
** amount of life given to offspring
** required lifespan before breeding (At a certain lifespan look for a mate)
** 
** bordeness (how much time until the mob chooses a different target (food, mob))
** sight distance (sectors)
** 
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
var foodRate = .25
// Frame rate cap. number of frames per second
var fr = 30

var entities = []
var foods = []
var colors = []
var pressed = 0
var menuOpen = true
var placeColor = [0, 0, 0]

var sectorDimensions = []
var sectorSize = 2000
var sectors = []

function setup() {
	createCanvas(windowWidth, windowHeight)
	frameRate(fr)
	// Setting the area that food is allowed to spawn in
	aWidth = sectorSize * 12
	aHeight = sectorSize * 12
	
	for(var i = 0; i < aWidth; i += sectorSize){
		for(var j = 0; j < aHeight; j += sectorSize){
			sectorDimensions.push(/*[x1, x2, y1, y2]*/[j, j + sectorSize, i, i + sectorSize])
		}
	}
	
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
	menu = new Menu(15, 80)
	
	//Ungroup
	ungroupButton = createButton('Ungroup')
	ungroupButton.size(100,20)
	ungroupButton.position(menuButton.x + 20, menuButton.y + 40)
	ungroupButton.mousePressed(ungroup)
	//Clear mobs
	clearMobsButton = createButton('Clear Mobs')
	clearMobsButton.size(100,20)
	clearMobsButton.position(menuButton.x + 20, menuButton.y + 40 + 30*1)
	clearMobsButton.mousePressed(clearMobPressed)
	//Clear food
	clearFoodButton = createButton('Clear Food')
	clearFoodButton.size(100,20)
	clearFoodButton.position(menuButton.x + 20, menuButton.y + 40 + 30*2)
	clearFoodButton.mousePressed(clearFoodPressed)
/*			click mode: delete[ ] place[x] select[ ]
**			place mode: Mob[x] Food[ ]
**			mob color:  Random[ ] custom[x]
**					R:[   ] G:[   ] B:[   ]*/
	clickRadio = createRadio()
	clickRadio.position(menuButton.x + 50, menuButton.y + 20 + 30*4)
	clickRadio.option('Place')
	clickRadio.option('Delete')
	clickRadio.option('Select')
	
	placeRadio = createRadio()
	placeRadio.position(menuButton.x + 80, menuButton.y + 30*6)
	placeRadio.option('Mob')
	placeRadio.option('Food')
	
	colorRadio = createRadio()
	colorRadio.position(menuButton.x + 65, menuButton.y + 10 + 30*7)
	colorRadio.option('Random')
	colorRadio.option('Custom')
	
	colorInput = createInput('')
	colorInput.position(menuButton.x + 105, menuButton.y - 2 + 30*8)
	colorInput.attribute('placeholder', '255, 255, 255')
	colorInput.size(90, 15)
	
	mobsInput = createInput('')
	mobsInput.position(menuButton.x + 100, menuButton.y + 18 + 30*8)
	mobsInput.attribute('placeholder', '0')
	mobsInput.size(40, 15)
	
	mobsConfirm = createButton('Create')
	mobsConfirm.position(menuButton.x + 185, menuButton.y + 16 + 30*8)
	mobsConfirm.size(55, 18)
	
	foodInput = createInput('')
	foodInput.position(menuButton.x + 100, menuButton.y + 18 + 30*9)
	foodInput.attribute('placeholder', '0')
	foodInput.size(40, 15)
	
	foodConfirm = createButton('Create')
	foodConfirm.position(menuButton.x + 185, menuButton.y + 15 + 30*9)
	foodConfirm.size(55, 18)
	
	buttons = [ungroupButton, clearMobsButton, clearFoodButton, clickRadio, placeRadio, colorRadio, mobsInput, mobsConfirm, foodInput, foodConfirm]
	
	clickRadio.value('Place')
	placeRadio.value('Mob')
	colorRadio.value('Random')
	colorInput.value('255, 255, 255')
	mobsInput.value('0')
	foodInput.value('0')
}

function draw() {
	if(colorRadio.value() == 'Random'){
	   colorInput.hide()
	}else{
		colorInput.show()
	}
	if(entities[0]){
		entities[0].highlighted = true
	}
	if(!paused){
		push()
		// Controls adjusting growth rate
		if (entities.length > 0){
			growth = entities[0].growth
		}else{
			growth = 2
		}
		// Set the background color
		background (210, 220, 235)
		// Number to scale the canvas by
		scaleNum = Math.pow(10, zoom)

		// Scale and translate all entities to simulate zooming and moving
		scale(scaleNum)
		translate(trans[0], trans[1])

		for(var i = 0; i < sectorDimensions.length; i++){
			//Just want the outline of the sectors
			noFill()
			//Make the outline a light grey color
			stroke(150)
			rect(sectorDimensions[i][0], sectorDimensions[i][2], sectorSize, sectorSize, 5)
		}

		// Move all entities right simulating the view moving left
		if (keyIsDown(LEFT_ARROW)){
			trans[0] += 125
		}	
		// Move view up
		if (keyIsDown(UP_ARROW)){
			trans[1] += 125
		}
		// Move view right
		if (keyIsDown(RIGHT_ARROW)){
			trans[0] -= 125
		}
		// Move view down
		if (keyIsDown(DOWN_ARROW)){
			trans[1] -= 125
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
					if(deltaE(rgb2lab([entities[i].r, entities[i].g, entities[i].b]), rgb2lab([colors[j][0], colors[j][1], colors[j][2]])) <= 10){
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
		strokeWeight(2)
		stroke(0)
		textSize(20)
		textAlign(LEFT)
		scale(1)
		trans = [0, 0]
		// Drawing the menu
		
		menu.display()
		for(var i = 0; i < topColors.length; i++){
			fill(topColors[i][0], topColors[i][1], topColors[i][2])
			ellipse(200 + 50 * i, 50, 15)
			text(topColors[i][3], 195 + 50 * i, 38)
		}
		noStroke()
		fill(0)
		text(colors.length + " Unique Colors", 190, 78)
		

		trans = [tempTrans[0], tempTrans[1]]
		//Time and Population
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

// Currently only used in changing mutating color, range will be from 0-255 for food but likely 0 - 1000 for other genes when implemented
function mutate(gene, range){
	rand = random()
	if(rand < .8){
		//Subtracting .5 so the random number is from -.5 to +.5
		gene = gene + (random() - .5)*10
	}else if(rand < .965){
		gene = gene + (random() - .5)*20
	}else{
		gene = random(0,range)
		print("Random Gene " + "Time:  " + minutes + ":" + time)
	}
	return gene
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function menuPressed(){
	if (menuOpen == false){
			menuOpen = true
		}else{
			menuOpen = false
		}
		print("Menu opened", menuOpen)
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function clearMobPressed(){
	entities = []
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function clearFoodPressed(){
	foods = []
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mousePressed() {
	//Dimensions of menu button
	if(mouseX < 65 && mouseX > 15 &&
	   mouseY < 100 && mouseY > 80){
		//Menu already opens automatically so just prevent mob creation
	}else if(menuOpen &&
			mouseX > menu.x && 
			mouseX < menu.x + menu.width &&
			mouseY > menu.y && 
			mouseY < menu.y + menu.height){
		//Do not spawn a mob when a button is clicked
	}else{
		if(clickRadio.value() == 'Place'){
		   if(placeRadio.value() == 'Mob'){
			   if(colorRadio.value() == 'Random'){
				   entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), mouseX * (1/scaleNum) - trans[0], mouseY * (1/scaleNum) - trans[1], random(40, 80), 10, foods, "circle"))
			   }else{
				   placeColor = split(colorInput.value(), ',')
				   entities.push(new Mob(int(placeColor[0]), int(placeColor[1]), int(placeColor[2]), mouseX * (1/scaleNum) - trans[0], mouseY * (1/scaleNum) - trans[1], random(40, 80), 10, foods, "circle"))
			   }
		   }else{
			   foods.push(new Food(mouseX * (1/scaleNum) - trans[0], mouseY * (1/scaleNum) - trans[1]))
		   }
		}else if(clickRadio.value() == 'Delete'){
			print('delete')
		}else{
			print('delete')
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

