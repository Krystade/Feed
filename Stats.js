function Stats(x, y, w){
	this.x = x
	this.y = y
	this.w = w
	this.h = 200
	this.open = false
	var mobIndex = -1
    var offset = 25

    this.tab = 0
    this.heights = [190, 90, 90, 185]
	
    this.display = function () {
        this.h = this.heights[this.tab]
		//Find which mob is highlighted if there is one
		for(var i = 0; i < entities.length; i++){
			if(entities[i].highlighted){
				this.open = true
				mobIndex = i
				break
			}else{
				this.open = false
			}
		}
		//Only display the stats if there is a highlighted mob
		if(entities[mobIndex] && entities[mobIndex].highlighted){
			this.open = true
			push()
			stroke(0)
			strokeWeight(2)
			textSize(20)
			textAlign(LEFT)
            switch (this.tab) {
                case 0:
                    //Buttons to switch between stats tabs
                    fill(230)
                    rect(this.x + 5, this.y, (this.w - 10) / 4, 30, 5)
                    fill(255)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y, (this.w - 10) / 4, 30, 5)
                    //Container for all the stats
                    rect(this.x, this.y + 30, this.w, this.h, 12)
                    //Text settings
                    noStroke()
					fill(0)
                    text("Index: " + mobIndex, this.x + 5, this.y + 30 + offset * 1)
                    text("ID: " + entities[mobIndex].id, this.x + 5, this.y + 30 + offset * 2)
                    text("Health: " + ceil(entities[mobIndex].health), this.x + 5, this.y + 30 + offset * 3)
                    text("Color: RGB(" + entities[mobIndex].r + "," + entities[mobIndex].g + "," + entities[mobIndex].b + ")", this.x + 5, this.y + 30 + offset * 4)
                    text("Sector: [" + entities[mobIndex].sector + "]", this.x + 5, this.y + 30 + offset * 5)
                    text("Created: " + entities[mobIndex].created, this.x + 5, this.y + 30 + offset * 6)
                    text("Time Alive: " + entities[mobIndex].timeAlive, this.x + 5, this.y + 30 + offset * 7)
                    break
                case 1:
                    //Buttons to switch between stats tabs
					//Drawing the second tab first to reduce number of fill statements
					fill(230)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y, (this.w - 10) / 4, 30, 5)
					fill(255)
                    rect(this.x + 5, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y, (this.w - 10) / 4, 30, 5)
                    //Container for all the stats
                    rect(this.x, this.y + 30, this.w, this.h, 12)
                    //Text settings
					noStroke()
					fill(0)
                    text("Size: " + round(entities[mobIndex].size), this.x + 5, this.y + 30 + offset * 1)
                    text("Min Size: " + round(entities[mobIndex].minSize), this.x + 5, this.y + 30 + offset * 2)
                    text("Max Size: " + round(entities[mobIndex].maxSize), this.x + 5, this.y + 30 + offset * 3)
                    break
                case 2:
                    //Buttons to switch between stats tabs
					//Drawing the third tab first to reduce number of fill statements
					fill(230)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y, (this.w - 10) / 4, 30, 5)
					fill(255)
                    rect(this.x + 5, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y, (this.w - 10) / 4, 30, 5)
                    //Container for all the stats
                    rect(this.x, this.y + 30, this.w, this.h, 12)
                    //Text settings
                    noStroke()
					fill(0)
                    //Variable used to calculate speed using a^2 + b^2 = c^2
                    s = sqrt(entities[mobIndex].xSpeed * entities[mobIndex].xSpeed + entities[mobIndex].ySpeed * entities[mobIndex].ySpeed)
                    text("Speed: " + round(s), this.x + 5, this.y + 30 + offset * 1)
                    text("Max Speed: " + round(entities[mobIndex].maxSpeed), this.x + 5, this.y + 30 + offset * 2)
                    text("Speed Gene: " + nf(entities[mobIndex].speedGene, 1, 2), this.x + 5, this.y + 30 + offset * 3)
                    break
                case 3:
                    //Buttons to switch between stats tabs
					//Drawing the fourth tab first to reduce number of fill statements
					fill(230)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y, (this.w - 10) / 4, 30, 5)
					fill(255)
                    rect(this.x + 5, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y, (this.w - 10) / 4, 30, 5)
                    //Container for all the stats
                    rect(this.x, this.y + 30, this.w, this.h, 12)
                    //Text settings
                    noStroke()
					fill(0)
                    text("Feed Need: " + round(entities[mobIndex].feedNeed/fr), this.x + 5, this.y + 30 + offset * 1)
                    text("Breed Need: " + round(entities[mobIndex].breedNeed/fr), this.x + 5, this.y + 30 + offset * 2)
                    text("Generation: " + entities[mobIndex].generation, this.x + 5, this.y + 30 + offset * 3)
                    text("Number of Children: " + entities[mobIndex].numChildren, this.x + 5, this.y + 30 + offset * 4)
                    text("Max Litter: " + nf(entities[mobIndex].litterSize, 0, 2), this.x + 5, this.y + 30 + offset * 5)
                    text("Mating Threshold: " + nf(entities[mobIndex].matingHealthThreshold, 0, 2), this.x + 5, this.y + 30 + offset * 6)
                    text("Child Health: " + nf(entities[mobIndex].childLife * 100, 0, 2) + "%", this.x + 5, this.y + 30 + offset * 7)
                    break
                default:
                    this.tab = 0
                    break
            }
			//Icon 1
			stroke(0)
			fill(255)
			rect(this.x + (this.w - 10)/8 - 8, this.y + 3, 23, 22)
			line(this.x + (this.w - 10)/8 - 2, this.y + 10, this.x + (this.w - 10)/8 + 8, this.y + 10)
			line(this.x + (this.w - 10)/8 - 2, this.y + 14, this.x + (this.w - 10)/8 + 8, this.y + 14)
			line(this.x + (this.w - 10)/8 - 2, this.y + 18, this.x + (this.w - 10)/8 + 8, this.y + 18)
			//Icon 2
			stroke(0)
			fill(70, 190, 190)
			ellipse(this.x + (this.w)/4 + 25, this.y + 15, 20)
			fill(90, 220, 220)
			ellipse(this.x + (this.w)/4 + 35, this.y + 20, 10)
			//Icon 3
			fill(70, 190, 190)
			ellipse(this.x + (this.w)/2 + 35, this.y + 15, 20)
			stroke(180)
			line(this.x + (this.w)/2 + 10, this.y + 10, this.x + (this.w)/2 + 22, this.y + 10)
			line(this.x + (this.w)/2 + 10, this.y + 15, this.x + (this.w)/2 + 22, this.y + 15)
			line(this.x + (this.w)/2 + 10, this.y + 20, this.x + (this.w)/2 + 22, this.y + 20)
			//Icon 4
			fill(70, 190, 190, 200)
			ellipse(this.x + (this.w) - 45, this.y + 15, 20)
			fill(84, 175, 232)
			ellipse(this.x + (this.w) - 30, this.y + 15, 20)
			noFill()
			stroke(0)
			ellipse(this.x + (this.w) - 45, this.y + 15, 20)
			ellipse(this.x + (this.w) - 30, this.y + 15, 20)
			//Listing all the stats of the highlighted mob
			
			//a^2 + b^2 = c^2
			//text("Acceleration: " + entities[mobIndex].acc, this.x + 5, this.y + offset*21)
			//text("Position: (" + this.x + ", " + this.y + ")" , this.x + 5, this.y + offset*13)
			
		
			pop()
		//If there is no highlighted mob, don't display anything
		}else{}
	}
}
