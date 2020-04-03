p5.disableFriendlyErrors = true
//Variable used to pause the game so checking values without anything moving will be easy
var paused = false
//Variable to track frames elapsed while not paused
var frameCounter = 0
//Variable used to retain how much scaling should occur
//zoom has to be log(.5) so the scale is .5
var zoom = Math.log(.5)
var oldZoom = Math.log(.5)
//Variable used to retain how much translation should occur
var trans = [0, 0]
//Counters that keep track of how long the left or right arrow keys have been held down
var countLeft = 0
var countRight = 0

//How quickly entities grow
var growthTimer = 0	
var growthRate = 2
//How quickly food spawns
var foodRate = .5
//Frame rate cap. number of frames per second
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
//[x, y]
var mouseSector = [0, 0]
var mouseXScale = 0
var MouseYScale = 0

//Whether or not the family tree of the highlighted mob should be displayed
var displayTree = false
//List of all the variable that can be graphed
var graphs = []
//List of all the names of the graphs
var graphTitles
//Index for which graph to display
var graphIndex = 0
//The currently selected mob
var highlightedMob
//Number of mobs created total
var currentId = 0000

//Arrays of past average data
var avgHealthArr = []
var avgAgeArr = []
	
var avgMaxSizeArr = []
var avgMinSizeArr = []
var avgMaxSpeedArr = []
var avgSpeedGeneArr = []
	
var avgFeedNeedArr = []
var avgMatingThresholdArr = []
var avgChildHealthArr = []
var avgChildrenArr = []
var avgLitterArr = []
var avgGenerationArr = []
var minGenerationArr = []
var maxGenerationArr = []

//Variable to track whether or not all the entities should be displayed
var showEntities = false
var showColors = false
var colorIndex = 0

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function setup() {
	createCanvas(windowWidth, windowHeight)
	frameRate(fr)
	//test = createFileInput()
	//test.position(100, 100)
	//Setting the area that food is allowed to spawn in
	aWidth = sectorSize * 35
	aHeight = sectorSize * 35
	//Color of the background
	bground = color(210, 220, 235)
	//The range of sizes that mobs are spawned in
	sizeRange = [10, 70]
	//Variable to control how frequent mutations are. Value between 0 and 1, 1 being 100% rate to mutate
	mutationRate = .7
	
	//Fill sectors with empty arrays
		//Number of sectors wide
		for(var i = 0; i < aWidth/sectorSize; i++){
			sectors.push([])
			//Number of sectors tall
			for(var j = 0; j < aHeight/sectorSize; j++){
				sectors[i].push([])
			}
		}
	
	for(var i = 0; i < 100; i++){
		startMob = new Mob(random(0, 255), random(0, 255), random(0, 255), 0, 0, /*size*/random(sizeRange[0], sizeRange[1]), /*life*/random(8, 14))
		//startMob.size = startMob.maxSize
		entities.push(startMob)
	}
	
	for(var i = 0; i < 500; i++){
		foods.push(new Food(ceil(random(30, aWidth)), ceil(random(30, aHeight))))
	}
	
	ungroup()
	menu = new Menu(15, 80)
	
	
	//List of all the variable that can be graphed
	graphs = [avgHealthArr, avgAgeArr, avgMaxSizeArr, avgMinSizeArr, avgMaxSpeedArr, avgSpeedGeneArr, avgFeedNeedArr, avgMatingThresholdArr, avgChildHealthArr, avgChildrenArr, avgLitterArr, avgGenerationArr, minGenerationArr, maxGenerationArr]
	//List of all the titles of the graphs
	graphTitles = ["Health", "Age", "Max Size", "Min Size", "Max Speed", "Speed Gene", "Feed Need", "Mating Threshold", "Child Health", "Num of Children", "Litter Size", "Generation", "Min Generation", "Max Generation"]
	
	graph = new Graph(50, windowHeight - 10, graphs[graphIndex], graphTitles[graphIndex])
	var highlightedMob = undefined
	
	stats = new Stats(windowWidth - 260, 80, 240)
	
	//Put the camera near the center of the spawning area
	//trans = [-aWidth/2, -aHeight/2]
	
	prevMobButton = createButton('Prev Mob')
	prevMobButton.size(125,40)
	prevMobButton.position(windowWidth/2 - 130, windowHeight - 50)
	prevMobButton.mousePressed(highlightPrev)//bPlaceHolder)
	//Follow the mob at the next index
	nextMobButton = createButton('Next Mob')
	nextMobButton.size(125,40)
	nextMobButton.position(windowWidth/2 + 5, windowHeight - 50)
	nextMobButton.mousePressed(highlightNext)
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function draw() {
	//Display average stats every so often
	//if(frameCounter%(10*60*fr) == 0){
	if(frameCounter%(10 * 60 * fr) == 0 && frameCounter > 10){
		print(displayAvgStats())
		cleanSectors()
	}
	//Number to scale the canvas by
	scaleNum = Math.pow(10, zoom)
	//The mouse position on the map not the screen
	mouseXScale = mouseX * (1/scaleNum) - trans[0]
	MouseYScale = mouseY * (1/scaleNum) - trans[1]
	if (keyIsDown(LEFT_ARROW)){
		if(typeof(highlightedMob) == "undefined"){
		   trans[0] += 700
		}else{
			if(countLeft == 0){
				highlightPrev()
			}
			countLeft++
		}
	//If the key isn't being held down reset the counter
	}else{
		countLeft = 0
	}
	//Move view up
	if (keyIsDown(UP_ARROW) && typeof(highlightedMob) == "undefined"){
		trans[1] += 700
	}
	//Move view right
	if (keyIsDown(RIGHT_ARROW)){
		if(typeof(highlightedMob) == "undefined"){
		trans[0] -= 700
		}else{
			if(countRight == 0){
				highlightNext()
			}
			countRight++
		}
	//If the key isn't being held down reset the counter
	}else{
		countRight = 0
	}
	//Move view down
	if (keyIsDown(DOWN_ARROW) && typeof(highlightedMob) == "undefined"){
		trans[1] -= 700
	}
	push()
	//Set the background color
	background(bground)
	//Scale and translate all entities to simulate zooming and moving
	scale(scaleNum)
	translate(trans[0], trans[1])
		
	/*Drawing Sector Borders*/
	/*Used for Debugging*/
	/*push()
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
	pop()*/
	strokeWeight(20)
	stroke(255, 150, 0)
	//line((aWidth/2), 0, (aWidth/2), aHeight)

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
							print("Clicked on ", entities[i])
							//Remove the mob from sectors
							sectors[entities[i].sector[0]][entities[i].sector[1]].splice(find(sectors[entities[i].sector[0]][entities[i].sector[1]], entities[i]), 1)
							//Remove the mob from entities
							entities.splice(i,1)
							i--;
						}
					}
					break
				case "Select":
					for(var i = entities.length - 1; i >= 0; i--){
						if(dist(mouseXScale, MouseYScale, entities[i].x, entities[i].y) <= entities[i].size/2){
							//Check if the clicked on mob is already highlighted
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
							//If the mob is already highlighted, unhighlight it
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
	if (foodRate > 0 && foods.length < 2500 && !paused){
		randX = random(0, aWidth)
		/*while (!(randX < aWidth/2 - 5000) && !(randX > aWidth/2 + 5000)) {
			randX = random(0, aWidth);
		}*/
		//Im not exactly sure how this works but it does so im not going to change it.
		if(((frameCounter*foodRate)%1).toFixed(4) < foodRate){
		foods.push(new Food(randX, random(30, aHeight)))
		}
		//When foodRate is greater than 1 need to spawn atleast 1 food every frame
		if(foodRate >= 1){
			for(var i = 0; i < int(foodRate); i++){
				foods.push(new Food(randX, random(30, aHeight)))
			}
		}
	}else{
	//Don't spawn food if food rate is 0 or negative
	}
	//Display food
	for(var i = 0; i < foods.length; i++){
		foods[i].update()
	}
	//Clear out the colors array to refill them with new values
	colors = []
	for(var i = 0; i < entities.length; i++){
		//Allows for early exit if the mob has less than 0 health
		while(true){
			//Remove dead entities
			if(entities[i].health <= 0){
				//Unhighlight the mob if it is selected
				if(highlightedMob == entities[i]){
					print("Highlighted mob died")
					highlightedMob = undefined
				}
				//Remove the mob from sectors
				sectors[entities[i].sector[0]][entities[i].sector[1]].splice(find(sectors[entities[i].sector[0]][entities[i].sector[1]], entities[i]), 1)
				//Remove the mob from entities
				entities.splice(i, 1)
				if(i != 0){
					i--
				}else{}
				break
			}
			//Move, Display, split, increase breedNeed
			entities[i].update()
			
			if(typeof(entities.target) != "undefined"){
				if(entities[i].target.mob == false){
					entities[i].findTarget()
				}
			}else{
				entities[i].findTarget()
			}
			
			//Have the camera follow highlighted mob
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
				if(typeof(foods[j]) != "undefined"){
					if(entities[i].eats(foods[j])){
						//If it does lengthen the mob's life
						entities[i].health += foods[j].value
						pos = findInSectors(foods[j])
						//And remove the food from foods and sectors
						if(pos == -1 || typeof(sectors[foods[j].sector[0]][foods[j].sector[1]][pos[2]]) == "undefined"){
							foods.splice(j, 1)
						}else{
							//sectors[pos[0]][pos[1]].splice(pos[2], 1)
							sectors[foods[j].sector[0]][foods[j].sector[1]].splice(pos[2], 1)
							foods.splice(j, 1)
							if(j != 0){
								j--
							}
						}
					}
				}
			}
			
			//Checking if the entities color is already in the list
			//If it is add to the count
			//If it is not add the color to the list
			colorMatched = false
			for(var j = 0; j < colors.length; j++){
				if(compareRgb(entities[i].rgb, [colors[j][0], colors[j][1], colors[j][2]]) <= 10){
					colors[j][3].push(entities[i])
					colorMatched = true
					break
					print("color matched")
				}else{}
			}
			if(!colorMatched){
				colors.push([entities[i].r, entities[i].g, entities[i].b, [entities[i]]])
			}
		break
		}
	}
	
	//Find which colors have the most circles
	temp = []
	topColors = [[255, 255, 255, []], [255, 255, 255, []], [255, 255, 255, []]]
	for(var i = 0; i < colors.length; i++){
		if(colors[i][3].length > topColors[2][3].length){
			topColors[2] = [colors[i][0], colors[i][1], colors[i][2], colors[i][3]]
				if(colors[i][3].length > topColors[1][3].length){
				temp = topColors[1]
				topColors[1] = [colors[i][0], colors[i][1], colors[i][2], colors[i][3]]
				topColors[2] = temp
					if(colors[i][3].length > topColors[0][3].length){
					temp = topColors[0]
					topColors[0] = [colors[i][0], colors[i][1], colors[i][2], colors[i][3]]
					topColors[1] = temp
				}
			}
		}
	}
	//push() at start of draw so the text stays in view
	pop()
	tempTrans = [trans[0], trans[1]]
	strokeWeight(2)
	stroke(0)
	textSize(20)
	scale(1)
	trans = [0, 0]
	//Displaying all previous parents of currently highlighted mob
	if(displayTree && typeof(highlightedMob) != "undefined"){
		displayMobs(highlightedMob.tree)
	}
	if(showEntities){
		displayMobs(entities)
	}
	if(showColors){
		if(colorIndex != colors.length && colors.length > 0){
			displayMobs(colors[colorIndex%colors.length][3])
		}
	}
	//Drawing graph
	//if(graph){		
		graph.update()
	//}
	
	//Drawing the menu
	menu.display()
	stats.display()
	textAlign(CENTER)
	//Drawing the top colors and how many of each top color there is
	for(var i = 0; i < topColors.length; i++){
		fill(topColors[i][0], topColors[i][1], topColors[i][2])
		ellipse(200 + 50 * i, 50, 15)
		text(topColors[i][3].length, 200 + 50 * i, 38)
	}
	noStroke()
	fill(0)
	textAlign(LEFT)
	text(colors.length + " Unique Colors", 190, 78)
	

	trans = [tempTrans[0], tempTrans[1]]
	//Population
	
	text("Time: " + getTime(frameCounter), 20, 45)
	
	text("Population: " + entities.length, 20, 65)
	//Instructions
	textAlign(CENTER)
	text("Hold mouse button for rapid click", windowWidth / 2, 20)
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
	//Display the current framerate
	text(str(round(frameRate())), windowWidth - 30, 25)
	textSize(15)
/* Debugging */
	//Display the x and y position of the mouse in the area
	//text(str(round(mouseXScale)) + ", " + str(round(MouseYScale)), mouseX, mouseY - 20)
	//Display the x and y position of the mouse in the screen
	//text(round(mouseX) + ", " + round(mouseY), mouseX, mouseY - 5)
    pop()
    if (!paused) {
        frameCounter++
    } else {
        push()
        stroke(0)
        strokeWeight(2)
        fill('RED')
        textAlign(CENTER)
        text("PAUSED", windowWidth/2, windowHeight/2 - 30)
        pop()
    }
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightPrev(){
	debug = false
	if(debug){
		start = millis()
	}
	if(entities.length > 0){
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
	if(debug){
		print("Startup took " + (millis() - start) + "ms")
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightNext(){
	debug = false
	if(debug){
		start = millis()
	}
	if(entities.length > 0){
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
	if(debug){
		print("highlightNext took " + (millis() - start) + "ms")
	}
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

	function calcSector(x, y){
	debug = false
		if(debug){
			start = millis()
		}
		//Which column
		sectorX = int(x/(sectorSize))
		//Which Row
		sectorY = int(y/(sectorSize))
		
		//If the entity is outside of the food spawning area, pretend they're just in the closest sector
		//Check X Sector
		if(sectorX < 0){
			sectorX = 0
		}else if(sectorX >= aWidth/sectorSize){
				 sectorX = aWidth/sectorSize - 1
		}
		//Check Y Sector
		if(sectorY < 0){
			sectorY = 0
		}else if(sectorY >= aHeight/sectorSize){
				 sectorY = aHeight/sectorSize - 1
		}
		
		sector = [sectorX, sectorY]
		return sector
		if(debug){
		print("calcSector took " + (millis() - start) + "ms")
	}
	} 

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightNext(){
	debug = false
	if(debug){
		start = millis()
	}
	if(entities.length > 0){
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
	if(debug){
		print("highlightNext took " + (millis() - start) + "ms")
	}
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

	function calcSector(x, y){
	debug = false
		if(debug){
			start = millis()
		}
		//Which column
		sectorX = int(x/(sectorSize))
		//Which Row
		sectorY = int(y/(sectorSize))
		
		//If the entity is outside of the food spawning area, pretend they're just in the closest sector
		//Check X Sector
		if(sectorX < 0){
			sectorX = 0
		}else if(sectorX >= aWidth/sectorSize){
				 sectorX = aWidth/sectorSize - 1
		}
		//Check Y Sector
		if(sectorY < 0){
			sectorY = 0
		}else if(sectorY >= aHeight/sectorSize){
				 sectorY = aHeight/sectorSize - 1
		}
		
		sector = [sectorX, sectorY]
		return sector
		if(debug){
		  print("calcSector took " + (millis() - start) + "ms")
	  }
	} 

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
//Currently only used in changing mutating color, range will be from 0-255 for food but likely 0 - 1000 for other genes when implemented
function mutate(gene, range){
	debug = false
	if(debug){
		start = millis()
	}
	rand = random()
	min = range[0]
	max = range[1]
	//%20 of the time
	if(rand > .8){
		//Don't mutate 
	}else if(rand > 1 - mutationRate){
		//Subtracting .5 so the random number is from -.5 to +.5
		//10% max increase or decrease of max
		gene += (random() - .5)*max/5
	}else if(rand > 1 - mutationRate - .19){
		//20% max increase or decrease of max
		gene += (random() - .5)*max/2.5
	}else{
		gene = random(min, max)
		//print("Random Gene " + getTime(frameCounter))
	}
	if(gene > max){
	   gene = max
	}else if(gene < min){
		gene = min
	}
	if(debug){
		print("mutate took " + (millis() - start) + "ms")
	}
	return gene
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

//Takes input of two rgb color arrays and returns the deltaE value of them
function compareRgb(color1, color2){
	return deltaE(rgb2lab(color1), rgb2lab(color2))
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

//Searches a one dimensional array and returns the index of the item
function find(arr, item){
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == item){
			return i
		}
	}
	//Returns -1 if the item is not found
	return -1
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

//Searches a one dimensional array and returns the indices of the item in sectors arr = [i, j, k] -> sectors[arr[0]][arr[1]][arr[2]]
function findInSectors(item){
	for(var i = 0; i < sectors.length; i++){
		for(var j = 0; j < sectors[i].length; j++){
			if(find(sectors[i][j], item) != -1){
				return [i,j,find(sectors[i][j], item)]
			}
		}
	}
	//Returns -1 if the item is not found
	return -1
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlight(entity){
	if(typeof(highlightedMob) != "undefined"){
		highlightedMob.highlighted = false
	}
	highlightedMob = entity
	highlightedMob.highlighted = true
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function displayMobs(mobs){
	push()
	var spacing = int(sqrt(mobs.length) + 1)
	for(var i = 0; i < spacing; i++){
		for(var j = 0; j < spacing; j++){
			if(i + j*spacing < mobs.length){
				//noStroke()
				strokeWeight(.75)
				//If the passed array is entities or colors
				if(mobs.length > 0 && typeof(mobs[0][0]) != "undefined"){
					//First Parent
					fill(mobs[i + j*spacing][0].rgb, 255)
					ellipse(((windowWidth-270)/spacing)*(.5+i), ((windowHeight-100)/spacing)*(.5+j) +  100, 10)
					//Second Parent
					fill(mobs[i + j*spacing][1].rgb, 255)
					ellipse(((windowWidth-270)/spacing)*(.5+i) + 10, ((windowHeight-100)/spacing)*(.5+j) + 100, 10)
				//If the passed array is tree
				}else if(mobs.length > 0 && typeof(mobs[0][0]) == "undefined"){
					if(mobs[i + j*spacing] == highlightedMob){
						fill(250, 50, 50)
						ellipse((windowWidth-270)/spacing*(.5+i), ((windowHeight-100)/spacing)*(.5+j) +  100, 17)
					}
					fill(mobs[i + j*spacing].rgb, 255)
					//If the stats are being shown
					if(stats.open){
						ellipse((windowWidth-270)/spacing*(.5+i), ((windowHeight-100)/spacing)*(.5+j) +  100, 10)
					//Want the mobs to take up the whole width if stats isnt open
					}else{
						ellipse(windowWidth/spacing*(.5+i), ((windowHeight-100)/spacing)*(.5+j) +  100, 10)
					}
				}
			}
		}
	}
	pop()
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function displayAvgStats(){
	debug = false
	if(debug){
		start = millis()
	}
	calcAvgStats()
	if(debug){
		print("displayAvgStats took " + (millis() - start) + "ms")
	}
	/*print*/return("\nTime: " + getTime(frameCounter) + 
					"\nPopulation: " + entities.length + 
					"\nAverage Health: " + avgHealth + 
					"\nAverage Max Size: " + avgMaxSize + 
					"\nAverage Min Size: " + avgMinSize + 
					"\nAverage Max Speed: " + avgMaxSpeed + 
					"\nAverage Speed Gene: " + avgSpeedGene + 
					"\nAverage Feed Need: " + avgFeedNeed + 
					"\nAverage Child Health: " + avgChildHealth*100 + "%" + 
					"\nAverage # of Children: " + avgChildren + 
					"\nAverage Max Litter Size: " + avgLitter + 
					"\nMin Generation: " + minGeneration + 
					"\nMax Generation: " + maxGeneration + 
					"\nAverage Generation: " + avgGeneration)
	
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function calcAvgStats(){
	//Default values
	avgHealth = 0
	avgAge = 0
	
	avgMaxSize = 0
	avgMinSize = 0
	avgMaxSpeed = 0
	avgSpeedGene = 0
	
	avgFeedNeed = 0
	avgMatingThreshold = 0
	avgChildHealth = 0
	avgChildren = 0
	avgLitter = 0
	avgGeneration = 0
	minGeneration = 999999
	maxGeneration = -1
	
	for(var i = 0; i < entities.length; i++){
		avgHealth += entities[i].health/entities.length
		avgAge += entities[i].age/entities.length
		
		avgMaxSize += entities[i].maxSize/entities.length
		avgMinSize += entities[i].minSize/entities.length
		avgMaxSpeed += entities[i].maxXSpeed/entities.length
		avgSpeedGene += entities[i].speedGene/entities.length
		
		avgFeedNeed += entities[i].feedNeed/entities.length
		avgMatingThreshold += entities[i].matingHealthThreshold/entities.length
		avgChildHealth += entities[i].childLife/entities.length
		avgChildren += entities[i].numChildren/entities.length
		avgLitter += entities[i].litterSize/entities.length
		avgGeneration += entities[i].generation/entities.length
		if(entities[i].generation > maxGeneration){
			maxGeneration = entities[i].generation
		}else if(entities[i].generation < minGeneration){
			minGeneration = entities[i].generation
		}else{}
	}
	
	//Record data points for later graphing
	avgHealthArr.push([avgHealth, frameCounter])
	avgAgeArr.push([avgAge/fr, frameCounter])
	
	avgMaxSizeArr.push([avgMaxSize, frameCounter])
	avgMinSizeArr.push([avgMinSize, frameCounter])
	avgMaxSpeedArr.push([avgMaxSpeed, frameCounter])
	avgSpeedGeneArr.push([avgSpeedGene, frameCounter])
	
	avgFeedNeedArr.push([avgFeedNeed/fr, frameCounter])
	avgMatingThresholdArr.push([avgMatingThreshold, frameCounter])
	avgChildHealthArr.push([avgChildHealth*100, frameCounter])
	avgChildrenArr.push([avgChildren, frameCounter])
	avgLitterArr.push([avgLitter, frameCounter])
	avgGenerationArr.push([avgGeneration, frameCounter])
	minGenerationArr.push([minGeneration, frameCounter])
	maxGenerationArr.push([maxGeneration, frameCounter])
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function saveSim(){
	//MOVE SPLIT to before setup
	//Split points for each saved variable
	let split = ["frameCounter", "currentId", "foodRate", "zoom", "trans", "Entities", "Foods"]
	let saveFile = []
	
	saveFile.push(frameCounter)
	saveFile.push("frameCounter")
	saveFile.push("\n")
	
	saveFile.push(currentId)
	saveFile.push("currentId")
	saveFile.push("\n")
	
	
	saveFile.push(foodRate)
	saveFile.push("foodRate")
	saveFile.push("\n")
	
	
	saveFile.push(zoom)
	saveFile.push("zoom")
	saveFile.push("\n")
	
	
	saveFile.push(trans)
	saveFile.push("trans")
	saveFile.push("\n")
	
	for(var i = 0; i < graphs.length; i++){
		saveFile.push(getGraphData(graphs[i]))
		saveFile.push(graphTitles[i] + "\n")
	}
	saveFile.push("Graphs")
	saveFile.push("\n")
	
	
	for(var i = 0; i < entities.length; i++){
		entityString = getEntityData(entities[i])
		saveFile.push(entityString)
	}
	saveFile.push("Entities")
	saveFile.push("\n")
	
	saveFile.push(getFoodData())
	saveFile.push("\n")
	
	
	saveFile.push("Foods")
	saveFile.push("\n")
	
	
	saveStrings(saveFile, "Save", "txt")
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function loadSave(){
	loadStrings("Save.txt", fileLoaded)
}

function fileLoaded(text){
	//Empty current entities and foods
	//Will be filled with loaded data
	entities = []
	foods = []
	
	frameCounter = int(text[0])
	currentId = int(text[2])
	foodRate = float(text[4])
	foodRateInput.attribute('placeholder', foodRate)
	zoom = float(text[6])
	trans = int(split(text[8], ","))
	
	//Remove added values from text
	text.splice(0, 10)
	
	//Filling the graphs
	for(var i = 0; i < graphs.length; i++){
		//text[i*2] is all of the data for each graph individually, skips the labeling
		let values = split(text[i*2], "|")
		for(var j = 0; j < values.length; j++){
			graphs[i].push(float(split(values[j], ", ")))
		}
	}
	
	//Remove added graph data from text
	for(var i = 0; i < text.length; i++){
		if(text[i] == "Graphs"){
			text.splice(0, i + 1)
			break
		}
	}
	
	//Filling the mobs
	//Adding 16 values per entitiy
	while(text[0] != "Entities"){
		loadRgb = int(split(text[0], ","))
		entityLoad = new Mob(loadRgb[0], loadRgb[1], loadRgb[2], float(text[1]), float(text[2]), float(text[3]), float(text[4]))
		entityLoad.maxSize = float(text[5])
		entityLoad.speedGene = float(text[6])
		entityLoad.created = float(text[7])
		entityLoad.age = int(text[8])
		entityLoad.id = int(text[9])
		entityLoad.feedNeed = int(text[10])
		entityLoad.matingHealthThreshold = float(text[11])
		entityLoad.maxBreedNeed = int(text[12])
		entityLoad.generation = int(text[13])
		entityLoad.numChildren = int(text[14])
		entityLoad.timesSplit = int(text[15])
		entities.push(entityLoad)
		
		text.splice(0, 16)
	}
	//Removing the "Entities" Tag
	text.splice(0, 1)
	
	//Filling foods
	for(var i = 0; i < int(text[0]); i++){
		foods.push(new Food(random(0, aWidth), random(0, aHeight)))
	}
	/*while(text[0] != "Foods"){
		foodLoad = new Food(float(text[0]), float(text[1]))
		foodLoad.color = text[2]
		foodLoad.value = text[3]
		foods.push(foodLoad)
		splice(0, 4)			
	}*/
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function getGraphData(graphIn){
	//Convert all necessary data into string array format
	let graphString = []
	for(var i = 0; i < graphIn.length; i++){
		graphString += (graphIn[i][0] + ", " + graphIn[i][1] + " | ")
	}
	return graphString
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function getEntityData(entity){
	//Convert all necessary data into string array format
	let entityString = ""
	entityString += (entity.rgb + "\n")
	entityString += (entity.x + "\n")
	entityString += (entity.y + "\n")
	entityString += (entity.size + "\n")
	entityString += (entity.health + "\n")
	entityString += (entity.maxSize + "\n")
	entityString += (entity.speedGene + "\n")
	entityString += (entity.created + "\n")
	entityString += (entity.age + "\n")
	entityString += (entity.id + "\n")
	entityString += (entity.feedNeed + "\n")
	entityString += (entity.matingHealthThreshold + "\n")
	entityString += (entity.maxBreedNeed + "\n")
	entityString += (entity.generation + "\n")
	entityString += (entity.numChildren + "\n")
	entityString += (entity.timesSplit + "\n")
	return entityString
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function getFoodData(){
	//Convert all necessary data into string array format
	/*let foodString = []
	foodString.push(food.x)
	foodString.push("\n")
	foodString.push(food.y)
	foodString.push("\n")
	foodString.push(food.color)
	foodString.push("\n")
	foodString.push(food.value)
	foodString.push("\n")
	return foodString*/
	//Re-placing all food into a random location so data for each one does not need to be loaded
	return foods.length
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

//function used to remove any mobs or food that is in sectors[] but not in foods[] or entities[]
function cleanSectors(){
	print("Cleaning Sectors")
	var cleaned = []
	var count = 0
	var found = false
	for(var i = 0; i < sectors.length; i++){
		for(var j = 0; j < sectors[i].length; j++){
			for(var k = 0; k < sectors[i][j].length; k++){
				//If the mob/food is in both sectors and entities/foods
				found = false
				if(sectors[i][j][k].mob){
					//Loop through all mobs in entities
					for(var l = 0; l < entities.length; l++){
						//If mob l in entities matches mob in sectors, break and mark it as found
						if(sectors[i][j][k] == entities[l]){
							found = true
							break
						}
					}
				}else if(sectors[i][j][k].food){
					for(var l = 0; l < foods.length; l++){
						//If food l in foods matches food in sectors, mark it as found and break
						if(sectors[i][j][k] == foods[l]){
							found = true
							break
						}
					}
				}else{}
				if(found){}
				else{
					cleaned.push(sectors[i][j][k])
					sectors[i][j].splice(k, 1)
					count++
				}
			}
			
		}
	}
	print(count, "Items removed", cleaned)
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function getTime(frameCounter){
	debug = false
	if(debug){
		start = millis()
	}
	time = (frameCounter) / fr
	hours = floor(time/60/60)
	minutes = floor(time/60 - hours*60)
	seconds = floor(time - minutes*60 - hours*60*60)
	
	if(debug){
		print("getTime took " + (millis() - start) + "ms")
	}
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
	stats.x = windowWidth - 260
	graph.y = windowHeight - 10
	nextMobButton.position(windowWidth/2 + 5, windowHeight - 50)
	prevMobButton.position(windowWidth/2 - 130, windowHeight - 50)
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mousePressed() {
	debug = false
	if(debug){
		start = millis()
	}
	//Dimensions of next and prev mob buttons
	if(mouseX > windowWidth/2 - 130 && mouseX < windowWidth/2 + 130 && mouseY < windowHeight - 10 && mouseY > windowHeight - 50){
	//Dimensions of menu button
	}else if(mouseX < 65 && mouseX > 15 &&
	   mouseY < 100 && mouseY > 80){
		//Prevent any spawning/deleting/selecting
		
	//Dimensions of menu options when opened
	}else if(menuOpen &&
			mouseX > menu.x && 
			mouseX < menu.x + menu.width &&
			mouseY > menu.y + menu.size[1] + 10 && 
			mouseY < menu.y + menu.height + menu.size[1] + 10){
			//Prevent any spawning/deleting/selecting
		
	//If a mob is highlighted and its stats are being displayed
	//Don't create a mob when clicking on the stats box
	}else if(stats.open && 
			mouseX > stats.x && 
			mouseX < stats.x + stats.w &&
			mouseY > stats.y && 
			mouseY < stats.y + stats.h + 30){
				if(stats.open && 
			 	mouseX > stats.x + 5 &&
			 	mouseX < stats.x - 5 + stats.w &&
			 	mouseY > stats.y &&
			 	mouseY < stats.y + 30){
					stats.tab = floor((mouseX - stats.x)/stats.w*4)
					print("CLicked Tab")
				}else{}
			 //Prevent any spawning/deleting/selecting
	}else{
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
						//Loop through the sector array that the entity is and remove it
						secX = entities[i].sector[0]
						secY = entities[i].sector[1]
						for(var j = 0; j < sectors[secX][secY].length; j++){
							if(sectors[secX][secY][j] == entities[i]){
								sectors[secX][secY].splice(j,1)
								break
							}
						}
						print("Clicked on ", entities[i])
						if(highlightedMob == entities[i]){
							highlightedMob = undefined
						}
						//Remove the mob from sectors
						sectors[entities[i].sector[0]][entities[i].sector[1]].splice(find(sectors[entities[i].sector[0]][entities[i].sector[1]], entities[i]), 1)
						//Remove the mob from entities
						entities.splice(i,1)
						i--;
					}
				}
				break
			case "Select":
				for(var i = entities.length - 1; i >= 0; i--){
					if(dist(mouseXScale, MouseYScale, entities[i].x, entities[i].y) <= entities[i].size/2){
						//Check if the clicked on mob is already highlighted
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
						//If the mob is already highlighted, unhighlight it
						}else{
							entities[i].highlighted = false
							highlightedMob = undefined
						}
					}
				}
				break		
		}
	}
	if(debug){
		print("mousePressed took " + (millis() - start) + "ms")
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function keyPressed() {
	//keycode 71 is g
	if (keyCode == 71){
		graphIndex++
		if(graphIndex >= graphs.length){
			graphIndex = 0
		}
		graph.min = 9999
		graph.max = 0
		graph.arr = graphs[graphIndex]
		graph.title = graphTitles[graphIndex]
	}
	//keyCode 32 is spacebar
	if (keyCode == 32){
		paused = !paused
	}
	//keyCode 85 is u
	if (keyCode == 85){
		ungroup()
	}
	//keyCode s is s
	if(keyCode == 83){
	   showEntities = !showEntities
	}
	//keyCode 67 is c
	if(keyCode == 67){
	   showColors = !showColors
	}
	//keyCode 86 is v
	if(keyCode == 86){
		//Show the next color in colors
		colorIndex++
	 }
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mouseWheel(event) {
	oldZoom = zoom
	oldTrans = [trans[0], trans[1]]
	//mousewheel up
	//zoom in
	if(event.delta < 0){
		zoom += .05
	//mouswheel down
	//zoom out
	}else{
		zoom -= .05
	}
	scaleChange = Math.pow(10, -oldZoom) - Math.pow(10, -zoom)
	trans[0] -= (windowWidth/2)*(scaleChange)
	trans[1] -= (windowHeight/2)*(scaleChange)
	//https://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate

}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

//Computes the average of two values
function average(value1, value2){
	return((value1 + value2)/2)
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

//the following functions are based off of the pseudocode
//found on www.easyrgb.com
//I found this code at https://github.com/antimatter15/rgb-lab/blob/master/color.js

function rgb2lab(rgb){
	debug = false
	if(debug){
		start = millis()
	}
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
	if(debug){
		print("rgb2lab took " + (millis() - start) + "ms")
	}
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

//calculate the perceptual distance between colors in CIELAB
//https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs

function deltaE(labA, labB){
	debug = false
	if(debug){
		start = millis()
	}
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
	if(debug){
		print("deltaE took " + (millis() - start) + "ms")
	}
  return i < 0 ? 0 : Math.sqrt(i);
}
