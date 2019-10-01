function Food (x,y){
	this.x = x
	this.y = y
	this.size = 50
	
	this.display = function(){
		noStroke()
		textAlign(CENTER)
		textSize(20)
		fill(20,200,40)
		ellipse(this.x,this.y, this.size, this.size)
	}
	
	/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
	
	this.isInside = function(dimensions){
		if(this.x >= dimensions[0] && this.x < dimensions[1] && this.y >= dimensions[2] && this.y < dimensions[3]){
			return true
		}else{
			return false
		}
	}
}
