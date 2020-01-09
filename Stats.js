function Stats(x, y, w, h){
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.open = false
	var mobIndex = -1
	var offset = 25
	
	this.display = function(){
		// Find which mob is highlighted if there is one
		for(var i = 0; i < entities.length; i++){
			if(entities[i].highlighted){
				mobIndex = i
				break
			}
		}
		//Only display the stats if there is a highlighted mob
		if(entities[mobIndex] && entities[mobIndex].highlighted){
			this.open = true
			push()
			stroke(1)
			textSize(20)
			textAlign(CENTER)

			// Container for all the stats
			//rect(this.x, this.y, this.w, this.h, 12)
			// Text settings
			fill(0)
			noStroke()
			textAlign(LEFT)
			// Listing all the stats of the highlighted mob
			text("Index: " + mobIndex, this.x + 5, this.y + offset)
			text("Lifespan: " + ceil(entities[mobIndex].lifeSpan), this.x + 5, this.y + offset*2)
			text("Size: " + round(entities[mobIndex].size), this.x + 5, this.y + offset*3)
			text("Min Size: " + round(entities[mobIndex].minSize), this.x + 5, this.y + offset*4)
			text("Max Size: " + round(entities[mobIndex].maxSize), this.x + 5, this.y + offset*5)
			text("Max Speed: " + round(entities[mobIndex].maxXSpeed), this.x + 5, this.y + offset*6)
			text("Color: RGB(" + entities[mobIndex].r + "," + entities[mobIndex].g + "," + entities[mobIndex].b + ")", this.x + 5, this.y + offset*7)
			text("Feed Need: " + round(entities[mobIndex].feedNeed), this.x + 5, this.y + offset*8)
			text("Breed Need: " +  round(entities[mobIndex].breedNeed), this.x + 5, this.y + offset*9)
			text("Generation: " + entities[mobIndex].generation, this.x + 5, this.y + offset*10)
			text("Number of Children: " + entities[mobIndex].numChildren, this.x + 5, this.y + offset*11)
			text("Sector: [" + entities[mobIndex].sector + "]", this.x + 5, this.y + offset*12)
			//text("Position: (" + this.x + ", " + this.y + ")" , this.x + 5, this.y + offset*13)
			
		
			pop()
		// If there is no highlighted mob, don't display anything
		}else{}
	}
}
