function Stats(x, y, w){
	this.x = x
	this.y = y
	this.w = w
	this.h = 200
	this.open = false
	var mobIndex = -1
    var offset = 25

    this.tab = 4
    this.heights = [200, 140, 220, 600]
	
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
            switch (this.tab) {
                case 0:
                    stroke(1)
                    textSize(20)
                    textAlign(CENTER)
                    //Buttons to switch between stats tabs
                    fill(200)
                    rect(this.x + 5, this.y - 30, (this.w - 10) / 4, 30, 5)
                    fill(255)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y - 30, (this.w - 10) / 4, 30, 5)
                    //Text settings
                    noStroke()
                    textAlign(LEFT)
                    //Container for all the stats
                    rect(this.x, this.y, this.w, this.h, 12)
                    text("Index: " + mobIndex, this.x + 5, this.y + offset * 1)
                    text("ID: " + entities[mobIndex].id, this.x + 5, this.y + offset * 2)
                    text("Lifespan: " + ceil(entities[mobIndex].lifeSpan), this.x + 5, this.y + offset * 3)
                    text("Color: RGB(" + entities[mobIndex].r + "," + entities[mobIndex].g + "," + entities[mobIndex].b + ")", this.x + 5, this.y + offset * 4)
                    text("Sector: [" + entities[mobIndex].sector + "]", this.x + 5, this.y + offset * 5)
                    text("Created: " + entities[mobIndex].created, this.x + 5, this.y + offset * 6)
                    text("Time Alive: " + entities[mobIndex].timeAlive, this.x + 5, this.y + offset * 7)
                    break
                case 1:
                    //Buttons to switch between stats tabs
                    rect(this.x + 5, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y - 30, (this.w - 10) / 4, 30, 5)
                    //Container for all the stats
                    rect(this.x, this.y, this.w, this.h, 12)
                    text("Size: " + round(entities[mobIndex].size), this.x + 5, this.y + offset * 1)
                    text("Min Size: " + round(entities[mobIndex].minSize), this.x + 5, this.y + offset * 2)
                    text("Max Size: " + round(entities[mobIndex].maxSize), this.x + 5, this.y + offset * 3)
                    //Variable used to calculate speed using a^2 + b^2 = c^2
                    s = sqrt(entities[mobIndex].xSpeed * entities[mobIndex].xSpeed + entities[mobIndex].ySpeed * entities[mobIndex].ySpeed)
                    text("Speed: " + round(s), this.x + 5, this.y + offset * 4)
                    text("Max Speed: " + round(entities[mobIndex].maxSpeed), this.x + 5, this.y + offset * 5)
                    break
                case 2:
                    //Buttons to switch between stats tabs
                    rect(this.x + 5, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y - 30, (this.w - 10) / 4, 30, 5)
                    //Container for all the stats
                    rect(this.x, this.y, this.w, this.h, 12)
                    text("Feed Need: " + round(entities[mobIndex].feedNeed), this.x + 5, this.y + offset * 1)
                    text("Breed Need: " + round(entities[mobIndex].breedNeed), this.x + 5, this.y + offset * 2)
                    text("Generation: " + entities[mobIndex].generation, this.x + 5, this.y + offset * 3)
                    text("Number of Children: " + entities[mobIndex].numChildren, this.x + 5, this.y + offset * 4)
                    text("Speed Gene: " + nf(entities[mobIndex].speedGene, 1, 2), this.x + 5, this.y + offset * 5)
                    text("Max Litter: " + nf(entities[mobIndex].litterSize, 0, 2), this.x + 5, this.y + offset * 6)
                    text("Mating Threshold: " + nf(entities[mobIndex].matingLifespanThreshold, 0, 2), this.x + 5, this.y + offset * 7)
                    text("Child Lifespan: " + nf(entities[mobIndex].childLife * 100, 0, 2) + "%", this.x + 5, this.y + offset * 8)
                    break
                case 3:
                    //Buttons to switch between stats tabs
                    rect(this.x + 5, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 1, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 2, this.y - 30, (this.w - 10) / 4, 30, 5)
                    rect(this.x + 5 + (this.w - 10) / 4 * 3, this.y - 30, (this.w - 10) / 4, 30, 5)
                    //Container for all the stats
                    rect(this.x, this.y, this.w, this.h, 12)
                    push()
                    textAlign(CENTER)
                    text("Graphs", this.x + this.w / 2, this.y + offset * 1)
                    pop()
                    break
                default:
                    this.tab = 0
                    break
            }
			//Listing all the stats of the highlighted mob
			
			//a^2 + b^2 = c^2
			//text("Acceleration: " + entities[mobIndex].acc, this.x + 5, this.y + offset*21)
			//text("Position: (" + this.x + ", " + this.y + ")" , this.x + 5, this.y + offset*13)
			
		
			pop()
		//If there is no highlighted mob, don't display anything
		}else{}
	}
}
