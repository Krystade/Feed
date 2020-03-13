function Graph(x, y, arr, title){
	this.h = 200
	this.w = 200
	this.x = x
	this.y = y
	this.arr = arr
	this.title = title
	
	this.max = 0
	this.min = 99999
	
	this.update = function(){
		if(arr.length > 0 && this.arr[0][0]){
			this.max = this.arr[0][0]
			this.min = this.arr[0][0]			
		}
		for(var i = 1; i < this.arr.length; i++){
			if(this.max < this.arr[i][0]){
				this.max = this.arr[i][0]
			}else if(this.min > this.arr[i][0]){
				this.min = this.arr[i][0]
			}
		}
		this.display()
	}
	
	this.display = function(){
		push()
		textAlign(CENTER)
		stroke(0)
		fill(255)
		strokeWeight(2)
		text(this.title, this.x + this.w/2, this.y - this.h - 20)
		textAlign(RIGHT)
		fill(0)
		noStroke()
		textSize(12)
		text(nfc(this.max, 2), this.x - 5, this.y - this.h)
		text(nfc(this.max/2, 2), this.x - 5, this.y - this.h/2)
		
		fill(0)
		stroke(0)
		strokeWeight(3)
		//Drawing graph's axis
		line(this.x, this.y, this.x, this.y - this.h)
		line(this.x, this.y, this.x + this.w, this.y)
		//Plotting each point
		for(var i = 0; i < this.arr.length; i++){
			//print("go" + i)
			ellipse(this.x + (this.w/this.arr.length)*i + 5, this.y - map(this.arr[i][0] , 0, this.max, 0, this.h - 10), 1)
		}
		//Instructions
		textAlign(LEFT)
		strokeWeight(.25)
		text("Press g to cycle", this.x + this.w + 5, this.y)
		pop()
	}
	
}