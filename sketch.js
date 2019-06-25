/*
** TO FIX
** 
** Different shapes attract to each other
** Handling/steering, go straight at target -- not have a fixed speed to increase/decrease
** 
*/

/*
** TO DO
** "collision" for multiple shapes
** 
** fighting?
** Collision between mobs
*/


var entities = [];
var foods = [];
var pressed = 0;
var growthTimer = 0;


function setup() {
	var width = windowWidth;
	var height = windowHeight;
	createCanvas(windowWidth, windowHeight);
	frameRate(30);
	
	for(var i = 0; i < 1; i++){
		//entities.push(new Mob(random(0,255), random(0,255), random(0,255), 0, 0, 20, 10, foods, "circle"))
		//entities.push(new Mob(random(0,255), random(0,255), random(0,255), 0, 0, 20, 10, foods, "square"))
		//entities.push(new Mob(random(0,255), random(0,255), random(0,255), 0, 0, 20, 10, foods, "triangle"))
		
		entities.push(new Mob(5, 25, 2, 0, 0, 20, 10, foods, "circle"))
		entities.push(new Mob(5, 25, 2, 0, 0, 20, 10, foods, "square"))
		entities.push(new Mob(5, 25, 2, 0, 0, 20, 10, foods, "triangle"))
	}	
	for(var i = 0; i < 50; i++){
		foods.push(new Food(ceil(random(30,width - 30)),ceil(random(30,height - 30))));
	}
	ungroup();
}
//var section = {width:width / sqrt(entities.length), height:height / sqrt(entities.length)}
function draw() {
	if (frameCount % (1/foodRate) == 0){
		print(frameCount);
	}
	background (200);
	var foodRate = .5;
	if (entities.length > 0){
		growth = entities[0].growth;
	}else{
		growth = .2
	}
	
	//Detect if the mouse is being held down to make a mob every 3 frames
	if (mouseIsPressed){
		pressed++;
		if(pressed % 3 == 0 && pressed > 10){
			entities.push(new Mob(random(0,255), random(0,255), random(0,255), mouseX, mouseY, 20, 10, foods, "circle"));
		}
	}else{
		pressed = 0;
	}
	
	//(foodRate) foods are spawned each frame
	if (foodRate < 1 && foodRate > 0 && frameCount % (1/foodRate) == 0){
		foods.push(new Food(random(30,width - 30),random(30,height - 30)));
	}else if (foodRate > 1){
		for (var i = 0; i < foodRate; i++){
			foods.push(new Food(random(30,width - 30),random(30,height - 30)));
		}
	}else{
	//Don't spawn food if food rate is negative
	}
	//Display food
	for(var i = 0; i < foods.length; i++){
		foods[i].display();
	}
	for(var i = 0; i < entities.length; i++){
		if(entities[i].lifeSpan <= 0){
			if(i == 0){
				entities.shift();
			}else{
				entities.splice(i,1);
				i--;
			}
		}
		if (entities[i]){
			entities[i].search(entities, foods);
			entities[i].display();
			entities[i].move();
			entities[i].separate();
			for(var j = i + 1; j < entities.length; j++){
				if(entities[i].breed(entities[j])){
					entities[i].canBreed = false;
					entities[j].canBreed = false;
					entities[i].foundMate = false;
					entities[j].foundMate = false;
					entities.push(new Mob( ceil(random(entities[i].r, entities[j].r)), ceil(random(entities[i].g, entities[j].g)), ceil(random(entities[i].b, entities[j].b)), (entities[i].x + entities[j].x)/2, (entities[i].y + entities[j].y)/2, 20, 10, foods, entities[i].shape));
					entities[entities.length -1].search(entities, foods);
					entities[i].lifeSpan -= 5;
					entities[j].lifeSpan -= 5;
				}
			}

			for(var j = 0; j < foods.length; j++){
			//Check if the mob exists and if it is within range of food
				if(foods[j]){
					if(entities[i].eats(foods[j])){
						//If it does remove the food and lengthen the mob's life
						if(j == 0){
							foods.shift();
						}else{
							foods.splice(j,1);
							j--;
						}  
						entities[i].lifeSpan += 2;
					}
				}
			}

			//Keep track of breed ability as time goes on
			if (entities[i].breedCoolDown > 0){
				entities[i].breedCoolDown -= 1;
			}else{
				entities[i].canBreed = true;
			}
		}
		
	}
	//Time: and Population
	fill(0);
	strokeWeight(0);
	textSize(30);
	textAlign(LEFT);
	text("Time: " + ceil(frameCount / 30), 50, 100);
	text("Population: " + entities.length, 50, 150 );
	//Instructions
	textSize(15);
	textAlign(CENTER);
	text("Click to create 1 mob, hold to create many", width / 2, 50);
	text("Press U to ungroup", width / 2, 80);
	text ("Press C to clear mobs", width / 2, 110);
	text ("Press + to increase and - to decrease \nthe growth rate of the mobs", width / 2, 140);
	//Growth Rate
	fill(35, 224, 67);
	strokeWeight(1.5);
	textSize(30);
	textAlign(RIGHT);
	//Only have the Growth Rate displayer for a few seconds
	if (growthTimer > 0){
		growthTimer--;
		text ("Growth Rate: " + growth, width - 60, 100);
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function ungroup(){
	var section = {width:width / ceil(sqrt(entities.length)), height:height / ceil(sqrt(entities.length))}
	var m = 0;
	for (var i = 0; i < sqrt(entities.length); i++){
		for (var j = 0; j < sqrt(entities.length); j++){
			entities[m].x = section.width * i + .5 * section.width;
			entities[m].y = section.height * j + .5 * section.height;
			m++;
			if (m == entities.length){
				break;
			}
		}
		if (m == entities.length){
			break;
		}
	}
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function mousePressed() {
	entities.push(new Mob(random(0,255), random(0,255), random(0,255), mouseX, mouseY, 20, 10, foods, "circle"));
}

/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/

function keyPressed() {
	//keyCode 85 is u
	if (keyCode == 85){
		ungroup();
		}
	//keyCode 67 is c
	if (keyCode == 67){
		entities.splice(0,entities.length);
		}
	//keycode 187 is = or +
	if (keyCode == 187){
		for(var i = 0; i < entities.length; i++){
			//Multiply number by 10 then round and divide by 10 to get it rounded to first decimal
			entities[i].growth = Math.round((entities[i].growth + .2) * 10) / 10;
		}
		growthTimer = 3 * 30;
	}
	//keyCode 189 is - or _
	if (keyCode == 189){
		for(var i = 0; i < entities.length; i++){
			//Multiply number by 10 then round and divide by 10 to get it rounded to first decimal
			entities[i].growth = Math.round((entities[i].growth - .2) * 10) / 10;
		}
		growthTimer = 3 * 30;
	}
}