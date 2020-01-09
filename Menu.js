function Menu (x, y) {
	// For the button to open the menu
	this.x = x
	this.y = y
	// For the menu itself
	this.width = 140*2
	this.height = 350
	// For the buttons
	this.size = [50,20]
	
	//Make all the buttons/DOM elements
	menuButton = createButton('Menu')
  	menuButton.position(this.x, this.y)
    menuButton.mousePressed(menuPressed)
	menuButton.size(this.size)
	
	// Ungroup
	ungroupButton = createButton('Ungroup')
	ungroupButton.size(85,20)
	ungroupButton.position(menuButton.x + 8, menuButton.y + 40)
	ungroupButton.mousePressed(ungroup)
	// Clear mobs
	clearMobsButton = createButton('Clear Mobs')
	clearMobsButton.size(85,20)
	clearMobsButton.position(menuButton.x + 8, menuButton.y + 40 + 30*1)
	clearMobsButton.mousePressed(clearMobs)
	// Clear food
	clearFoodButton = createButton('Clear Food')
	clearFoodButton.size(85,20)
	clearFoodButton.position(menuButton.x + 8, menuButton.y + 40 + 30*2)
	clearFoodButton.mousePressed(clearFoods)
	//Follow Healthiest Mob
	textSize(5) 
	healthiestButton = createButton('Healthiest')
	healthiestButton.size(85,20)
	healthiestButton.position(menuButton.x + 98, menuButton.y + 40)
	healthiestButton.mousePressed(highlightHealthiest)
	//Follow Oldest Mob	
	oldestButton = createButton('Oldest')
	oldestButton.size(85,20)
	oldestButton.position(menuButton.x + 98, menuButton.y + 70)
	oldestButton.mousePressed(highlightOldest)
	// Follow the mob at the next index
	nextMobButton = createButton('Next Mob')
	nextMobButton.size(85,20)
	nextMobButton.position(menuButton.x + 98, menuButton.y + 100)
	nextMobButton.mousePressed(highlightNext)
	
	smallestMobButton = createButton('Smallest')
	smallestMobButton.size(85,20)
	smallestMobButton.position(menuButton.x + 188, menuButton.y + 40)
	smallestMobButton.mousePressed(highlightSmallest)
	
	largestMobButton = createButton('Largest')
	largestMobButton.size(85,20)
	largestMobButton.position(menuButton.x + 188, menuButton.y + 40 + 30)
	largestMobButton.mousePressed(highlightLargest)
	
	b3 = createButton('Prev Mob')
	b3.size(85,20)
	b3.position(menuButton.x + 188, menuButton.y + 40 + 30*2)
	b3.mousePressed(highlightPrev)//bPlaceHolder)

	
	
	// Select click mode 
	clickRadio = createRadio()
	clickRadio.position(menuButton.x + 50, menuButton.y + 20 + 30*4)
	clickRadio.option('Place')
	clickRadio.option('Delete')
	clickRadio.option('Select')
	// Select place mode
	placeRadio = createRadio()
	placeRadio.position(menuButton.x + 80, menuButton.y + 30*6)
	placeRadio.option('Mob')
	placeRadio.option('Food')
	// Select color mode
	colorRadio = createRadio()
	colorRadio.position(menuButton.x + 65, menuButton.y + 10 + 30*7)
	colorRadio.option('Random')
	colorRadio.option('Custom')
	// Select color value
	colorInput = createInput('')
	colorInput.position(menuButton.x + 105, menuButton.y - 2 + 30*8)
	colorInput.attribute('placeholder', '0, 0, 0')
	colorInput.size(90, 15)
	// Change growth rate of all mobs
	growthRateInput = createInput('')
	growthRateInput.position(menuButton.x + 140, menuButton.y + 18 + 30*8)
	growthRateInput.attribute('placeholder', '1')
	growthRateInput.size(40, 15)
	// Button to set growthRate
	growthRateConfirm = createButton('Set')
	growthRateConfirm.position(menuButton.x + 185, menuButton.y + 15 + 30*8)
	growthRateConfirm.size(55, 18)
	growthRateConfirm.mousePressed(changeGrowthRate)
	// Change rate at which food spawns
	foodRateInput = createInput('')
	foodRateInput.position(menuButton.x + 140, menuButton.y + 18 + 30*9)
	foodRateInput.attribute('placeholder', '.5')
	foodRateInput.size(40, 15)
	// Button to set foodRate
	foodRateConfirm = createButton('Set')
	foodRateConfirm.position(menuButton.x + 185, menuButton.y + 15 + 30*9)
	foodRateConfirm.size(55, 18)
	foodRateConfirm.mousePressed(changeFoodRate)
	
	// Select number of mobs created
	mobsInput = createInput('')
	mobsInput.position(menuButton.x + 100, menuButton.y + 18 + 30*10)
	mobsInput.attribute('placeholder', '10')
	mobsInput.size(40, 15)
	// Button to create mobs
	mobsConfirm = createButton('Create')
	mobsConfirm.position(menuButton.x + 185, menuButton.y + 16 + 30*10)
	mobsConfirm.size(55, 18)
	mobsConfirm.mousePressed(createMobs)
	// Select number of foods to make
	foodInput = createInput('')
	foodInput.position(menuButton.x + 100, menuButton.y + 18 + 30*11)
	foodInput.attribute('placeholder', '10')
	foodInput.size(40, 15)
	// Button to create food
	foodConfirm = createButton('Create')
	foodConfirm.position(menuButton.x + 185, menuButton.y + 15 + 30*11)
	foodConfirm.size(55, 18)
	foodConfirm.mousePressed(createFood)
	
	// All buttons and inputs in an array for easy hiding/showing
	buttons = [ungroupButton, clearMobsButton, clearFoodButton, oldestButton, healthiestButton, nextMobButton, largestMobButton, smallestMobButton, clickRadio, placeRadio, colorRadio, growthRateInput, growthRateConfirm, foodRateConfirm, foodRateInput, mobsInput, foodInput, colorInput, mobsConfirm, foodConfirm, b3]
	
	// Default values for all menu items
	clickRadio.value('Place')
	placeRadio.value('Mob')
	colorRadio.value('Random')
	colorInput.value('')
	mobsInput.value('')
	foodInput.value('')
	
	this.display = function(){
		push()
		stroke(1)
		textAlign(CENTER)
		textSize(20)
		
		if(menuOpen){
			fill(230)
			// Entire container of the menu
			rect(this.x, this.y + this.size[1] + 10, this.width, this.height, 12)
			textAlign(CENTER)
			fill(0)
			noStroke()
			textSize(15)
			text("Click Mode:", this.x + this.width/2, this.y + 20 + 30*4)
			if(clickRadio.value() == "Place"){
				text("Place Mode:", this.x + this.width/2, this.y + 30*6)
			}
			if(placeRadio.value() == 'Mob' && clickRadio.value() == "Place"){
				text("Color Mode:", this.x + this.width/2, this.y + 10 + 30*7)
			}	
			if(colorRadio.value() == 'Custom' && placeRadio.value() == "Mob" && clickRadio.value() == "Place"){
			text("R, G, B:", this.x + this.width/2 - 65, this.y + 10 + 30*8)
			colorInput.show()
			}else{
				colorInput.hide()
			}
			text("Growth Rate                       ", this.x + this.width/2, this.y + 30*9)
			text("Food Rate                          ", this.x + this.width/2, this.y + 30*10)
			text("Create            mobs            ", this.x + this.width/2, this.y + 30*11)
			text("Create            foods            ", this.x + this.width/2, this.y + 30*12)	
			
			//Show all the buttons if the menu is open
			for(var i = 0; i < buttons.length; i++){
				buttons[i].show()
				if(colorRadio.value() == 'Random'){
	   				colorInput.hide()
				}
				if(placeRadio.value() == 'Food'){
					colorRadio.hide()
					colorInput.hide()
				}
				// Don't need to show Place mode and Color mode options if user isn't placing mobs
				if(clickRadio.value() != "Place"){
					colorRadio.hide()
					colorInput.hide()
					placeRadio.hide()
				}
			}
		}else{
			//Hide all the buttons if the menu isn't open
			for(var i = 0; i < buttons.length; i++){
				buttons[i].hide()
			}
			
		}
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

function clearMobs(){
	entities = []
	// Loop through each sector in sectors[] and each entity in sectors[][]
	for(var i = sectors.length - 1; i >= 0; i--){
		for(var j = sectors[i].length - 1; j >= 0; j--){
			for(var k = sectors[i][j].length - 1; k >= 0; k--){
				// Remove any mobs in sectors
				if(sectors[i][j][k].mob){
					sectors[i][j].splice(k, 1)
				}
			}
		}
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function clearFoods(){
	foods = []
	// Loop through each sector in sectors[] and each entity in sectors[][]
	for(var i = sectors.length - 1; i >= 0; i--){
		for(var j = sectors[i].length - 1; j >= 0; j--){
			for(var k = sectors[i][j].length - 1; k >= 0; k--){
				// Remove any foods in sectors
				if(sectors[i][j][k].food){
					sectors[i][j].splice(k, 1)
				}
			}
		}
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightHealthiest(){
	var healthiest = entities[0]
	for(var i = 1; i < entities.length; i++){
		if(entities[i].lifeSpan > healthiest.lifeSpan){
			healthiest = entities[i]
		}
	}
	if(highlightedMob){
		highlightedMob.highlighted = false
	}
	highlightedMob = healthiest
	highlightedMob.highlighted = true
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightOldest(){
	var oldest = entities[0]
	if(highlightedMob){
		highlightedMob.highlighted = false
	}
	highlightedMob = oldest
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

function highlightSmallest(){
	var smallest = entities[0]
	for(var i = 1; i < entities.length; i++){
		if(entities[i].size < smallest.size){
			smallest = entities[i]
		}
	}
	if(highlightedMob){
		highlightedMob.highlighted = false
	}
	highlightedMob = smallest
	highlightedMob.highlighted = true
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function highlightLargest(){
	var largest = entities[0]
	for(var i = 1; i < entities.length; i++){
		if(entities[i].size > largest.size){
			largest = entities[i]
		}
	}
	if(highlightedMob){
		highlightedMob.highlighted = false
	}
	highlightedMob = largest
	highlightedMob.highlighted = true
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function bPlaceHolder(){
	//Placeholder for the function that pressing button 3 will activate
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function createMobs(){
	if(colorRadio.value() == 'Random'){
		for(var i = 0; i < mobsInput.value(); i++){
			entities.push(new Mob(random(0, 255), random(0, 255), random(0, 255), random(0, aWidth), random(0, aHeight), random(sizeRange[0], sizeRange[1]), 10))
		}
	}else{
		for(var i = 0; i < mobsInput.value(); i++){
			placeColor = split(colorInput.value(), ',')
			entities.push(new Mob(int(placeColor[0]), int(placeColor[1]), int(placeColor[2]), random(0, aWidth), random(0, aHeight), random(sizeRange[0], sizeRange[1]), 10))
		}
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function createFood(){
	for(var i = 0; i < foodInput.value(); i++){
		foods.push(new Food(random(0, aWidth), random(0, aHeight)))
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function changeGrowthRate(){
	if(float(growthRateInput.value()) == float(growthRateInput.value())){
		growthRate = float(growthRateInput.value())
		growthTimer = 30
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function changeFoodRate(){
	if(float(foodRateInput.value()) == float(foodRateInput.value())){
		foodRate = float(foodRateInput.value())
	}
	print("foodRate changed to " + float(foodRateInput.value()))
}
/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
