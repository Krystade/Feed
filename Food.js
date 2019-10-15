function Food (x,y){
	this.x = x;
	this.y = y;
	this.size = 15
	this.display = function(){
		noStroke();
		textAlign(CENTER);
		textSize(20);
		fill(20,200,40);
		ellipse(this.x,this.y, this.size, this.size);
	}
}