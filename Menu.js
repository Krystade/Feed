function Menu (x, y) {
	// For the button to open the menu
	this.x = x
	this.y = y
	// For the menu itself
	this.width = 140*2
	this.height = 350
	this.size = [50,20]
	
	//Make all the buttons/DOM elements
	menuButton = createButton('Menu')
  	menuButton.position(this.x, this.y)
    menuButton.mousePressed(menuPressed)
	menuButton.size(this.size)
	
	// Ungroup
	ungroupButton = createButton('Ungroup')
	ungroupButton.size(100,20)
	ungroupButton.position(menuButton.x + 20, menuButton.y + 40)
	ungroupButton.mousePressed(ungroup)
	// Clear mobs
	clearMobsButton = createButton('Clear Mobs')
	clearMobsButton.size(100,20)
	clearMobsButton.position(menuButton.x + 20, menuButton.y + 40 + 30*1)
	clearMobsButton.mousePressed(clearMobPressed)
	// Clear food
	clearFoodButton = createButton('Clear Food')
	clearFoodButton.size(100,20)
	clearFoodButton.position(menuButton.x + 20, menuButton.y + 40 + 30*2)
	clearFoodButton.mousePressed(clearFoodPressed)
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
	b1 = createButton('')
	b1.size(100,20)
	b1.position(menuButton.x + 160, menuButton.y + 40)
	b2 = createButton('')
	b2.size(100,20)
	b2.position(menuButton.x + 160, menuButton.y + 70)
	b3 = createButton('')
	b3.size(100,20)
	b3.position(menuButton.x + 160, menuButton.y + 100)
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
	buttons = [ungroupButton, clearMobsButton, clearFoodButton, b1, b2, b3, clickRadio, placeRadio, colorRadio, growthRateInput, growthRateConfirm, mobsInput, foodInput, colorInput, mobsConfirm, foodConfirm]
	
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
			text("Place Mode:", this.x + this.width/2, this.y + 30*6)
			if(placeRadio.value() == 'Mob'){
				text("Color Mode:", this.x + this.width/2, this.y + 10 + 30*7)
			}	
			if(colorRadio.value() == 'Custom'){
			text("R, G, B:", this.x + this.width/2 - 65, this.y + 10 + 30*8)
			colorInput.show()
			}else{
				colorInput.hide()
			}
			text("Growth Rate                       ", this.x + this.width/2, this.y + 30*9)
			text("Open Spot", this.x + this.width/2, this.y + 30*10)
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
