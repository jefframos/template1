import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import PuzzlePart from '../elements/PuzzlePart'
import Particle from '../elements/Particle'

export default class MainScreen extends Screen{
	constructor(label){
		super(label);
	}
	build(){
		super.build();


		//create background shape
		this.background = new PIXI.Graphics();
		this.background.beginFill(0xFFFFFF);
	    this.background.drawRect( 0, 0, config.width, config.height);
		this.addChild(this.background);
		this.backgroundColor = 0x007d7c;
		this.background.tint = this.backgroundColor;



		this.circuitsContainer = new PIXI.Container();
		this.addChild(this.circuitsContainer);

		this.puzzleContainer = new PIXI.Container();
		this.addChild(this.puzzleContainer);

		this.particlesContainer = new PIXI.Container();
		this.addChild(this.particlesContainer);

		//create background shape
		this.foreground = new PIXI.Graphics();
		this.foreground.beginFill(0xFFFFFF);
	    this.foreground.drawRect( 0, 0, config.width, config.height);
		this.particlesContainer.addChild(this.foreground);

		this.puzzleRadius = 71;
		this.puzzleBorderSize = 10;

		this.gameBounds = {x:230,y:this.puzzleRadius * 1.5,width:config.width - 460,height:config.height - this.puzzleRadius*3};

	    this.puzzleArray = [];
		this.puzzleArray.push(new PuzzlePart(this.puzzleRadius, this.puzzleBorderSize));
		this.puzzleArray.push(new PuzzlePart(this.puzzleRadius, this.puzzleBorderSize,1));
		this.puzzleArray.push(new PuzzlePart(this.puzzleRadius, this.puzzleBorderSize,0));
		// this.puzzleArray.push(new PuzzlePart(this.puzzleRadius, this.puzzleBorderSize));

		this.totSizeParts = (this.gameBounds.width) / this.puzzleArray.length;
		for (var i = 0; i < this.puzzleArray.length; i++) {
			this.puzzleContainer.addChild(this.puzzleArray[i]);
			this.puzzleArray[i].x = this.totSizeParts * i + this.gameBounds.x + this.totSizeParts/2;
			this.puzzleArray[i].y = Math.random() * this.gameBounds.height + this.gameBounds.y;
		}
		this.puzzleArray[this.puzzleArray.length - 1].y = config.middlePoint.y;


		this.endButton = new PIXI.Container();
		this.innerEndButtonShape = this.drawCircle(0xfedd00,this.puzzleRadius + this.puzzleBorderSize/2);
		this.endButton.addChild(this.innerEndButtonShape);
		this.addChild(this.endButton);
		this.endButton.x = config.width - 140;
		this.endButton.y = config.middlePoint.y;
		this.endButton.scale = {x:0,y:0};
		this.lockerImage = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-2.png'));
		this.endButton.addChild(this.lockerImage);
		//this.lockerImage.tint = 0xfedd00;
		this.lockerImage.x -= this.lockerImage.width / 2;
		this.lockerImage.y -= this.lockerImage.height / 2;

		this.endButtonFill = new PIXI.Container();
		this.innerEndButtonFillShape = this.drawCircle(0xFFFFFF,this.puzzleRadius + this.puzzleBorderSize/2);
		this.endButtonFill.addChild(this.innerEndButtonFillShape);
		this.addChild(this.endButtonFill);
		this.endButtonFill.x = config.width - 140;
		this.endButtonFill.y = config.middlePoint.y;
		this.endButtonFill.scale = {x:0,y:0};

		this.particlesAdded = 0;
		this.maxParticles = 25;

		this.lightColors = [0xe05d26,0x1dc2f2,0x74c700]
		this.currentLightColors = Math.floor(Math.random() * this.lightColors.length);

		
		this.startButton = new PIXI.Container();
		this.innerStartButtonShape = this.drawCircle(0xffffff,this.puzzleRadius + this.puzzleBorderSize/2);
		this.startButton.addChild(this.innerStartButtonShape);
		this.addChild(this.startButton);
		this.startButton.x = 0;
		this.startButton.y = config.middlePoint.y;
		this.arrowImage = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/arrow.png'));
		this.startButton.addChild(this.arrowImage);
		this.arrowImage.tint = 0xfedd00;
		this.arrowImage.x -= this.arrowImage.width / 2;
		this.arrowImage.y -= this.arrowImage.height / 2;

		this.startButton.interactive = true;
		this.startButton.buttonMode = true;
		this.startButton.on('tap', this.startGame.bind(this)).on('click', this.startGame.bind(this));


		this.setChildIndex(this.startButton, this.children.length - 1);
		this.setChildIndex(this.endButton, this.children.length - 1);
		this.setChildIndex(this.endButtonFill, this.children.length - 1);

		this.circuitsContainer.alpha = 0
		this.particlesArray = [];

		
	}	
	transitionIn(){
		this.startGame();
	}
	startGame(){
		TweenLite.to(this.foreground,0.5,{alpha:0});
		this.createCircuit();
		setTimeout(function() {
			this.addParticle();
		}.bind(this), 3000);

		for (var i = 0; i < this.puzzleArray.length; i++) {
			this.puzzleArray[i].startState(0.2*i+1, 1);
		}
		this.startButton.interactive = false;
		this.startButton.buttonMode = false;
		let timelineStart = new TimelineLite();		
		timelineStart.add(TweenLite.to(this.startButton,1,{x: 140, ease:'easeOutElastic'}));

		TweenLite.to(this.circuitsContainer, 0.5, {delay:0.51, alpha:1});
		TweenLite.to(this.endButton.scale, 1, {delay:0.5,x:1,y:1, ease:'easeOutElastic'});
		this.endButtonFill.scale = {x:0,y:0};
	}
	addParticle(){
		for (var i = 0; i < this.maxParticles; i++) {
			let tempParticle = new Particle(this.puzzleBorderSize, this.circuitPoints,this.puzzleArray,i*0.1 + 0.1, i);
			this.particlesContainer.addChild(tempParticle);
			this.particlesArray.push(tempParticle);
		}		
	}
	createCircuit(){
		this.circuit = new PIXI.Graphics();
		this.circuit.lineStyle(this.puzzleBorderSize, 0x8ccec3);
	    this.circuitsContainer.addChildAt(this.circuit,0);
	    this.circuitPoints = [];
	    //140 is first point
	    this.circuitPoints.push({x:140, y:this.startButton.y});
	    // this.circuitPoints.push({x:this.startButton.x, y:this.startButton.y});

	    let tempYDir = 1;
		for (var i = 0; i < this.puzzleArray.length; i++) {

			this.circuitPoints.push({x:this.circuitPoints[this.circuitPoints.length - 1].x+Math.random() * 100 + this.puzzleRadius*1.1,  y:this.circuitPoints[this.circuitPoints.length - 1].y});
			// this.circuitPoints.push({x:this.circuitPoints[this.circuitPoints.length - 1].x+Math.random() * 100 + 90,  y:this.circuitPoints[this.circuitPoints.length - 1].y});


			if(this.puzzleArray[i].correctDirection < 2){
				if(this.puzzleArray[i].correctDirection == 0){
					tempYDir = -1;
				}else{
					tempYDir = 1;
				}
				this.circuitPoints.push({x:this.circuitPoints[this.circuitPoints.length - 1].x,
					y: (this.puzzleRadius + this.puzzleBorderSize) * tempYDir + this.puzzleArray[i].y + (Math.random() * 20 + 5)* tempYDir
				});
				this.circuitPoints.push({x:this.puzzleArray[i].x,  y:this.circuitPoints[this.circuitPoints.length - 1].y});
			}

			this.circuitPoints.push({x:this.puzzleArray[i].x,  y:this.puzzleArray[i].y});
			if(Math.random() < 0.8){
				this.addFakeCircuit(this.puzzleArray[i]);
			}
		}
	    this.circuitPoints.push({x:this.endButton.x, y:this.endButton.y});

		this.circuit.moveTo(this.circuitPoints[0].x, this.circuitPoints[0].y);
		for (var i = 1; i < this.circuitPoints.length; i++) {
			this.circuit.lineTo(this.circuitPoints[i].x, this.circuitPoints[i].y);
		}


		this.asset1 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-1.png'));
		this.asset3 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-3.png'));
		this.asset4 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-4.png'));
		this.asset5 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-5.png'));

		this.circuitsContainer.addChild(this.asset1);
		this.circuitsContainer.addChild(this.asset3);
		this.circuitsContainer.addChild(this.asset4);
		this.circuitsContainer.addChild(this.asset5);

		this.asset1.x = -50;
		this.asset1.y = -50;

		this.asset3.x = config.middlePoint.x + 90;
		this.asset3.y = -20;

		this.asset4.x = config.width - 180;
		this.asset4.y = 20;

		this.asset5.x = config.width /2 - 280;
		this.asset5.y = config.height - 70;

		for (var i = 0; i < 3; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.circuitsContainer.addChild(tempCircle);
			tempCircle.x = config.width /2 - 275 + 50 * i;
			tempCircle.y = config.height - 90;
		}

		for (var i = 0; i < 3; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.circuitsContainer.addChild(tempCircle);
			tempCircle.x = 50;
			tempCircle.y = 150 + 50 * i;
		}
		for (var i = 0; i < 3; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.circuitsContainer.addChild(tempCircle);
			tempCircle.x = 100 + 50 * i;
			tempCircle.y = 250;
		}

		for (var i = 0; i < 6; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.circuitsContainer.addChild(tempCircle);
			tempCircle.x = config.width - 300 + 50 * i;
			tempCircle.y = 250;
		}

		for (var i = 0; i < 3; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.circuitsContainer.addChild(tempCircle);
			tempCircle.x = config.width - 50;
			tempCircle.y = 250 - 50 * i;
		}
	}
	addFakeCircuit(puzzle){

		let fakeCircuit = new PIXI.Graphics();
		let yPos = 0;
		let finalXPos = 0;
		fakeCircuit.lineStyle(this.puzzleBorderSize, 0x8ccec3);
    	this.circuitsContainer.addChildAt(fakeCircuit,1);
    	fakeCircuit.moveTo(puzzle.x, puzzle.y);

    	yPos = puzzle.y + (this.puzzleRadius + Math.random() * 30 + 20) * (puzzle.correctDirection === 0 ?1:-1);
    	if(yPos < 25){
    		yPos = 25;
    	}else if(yPos > config.height - 25){
    		yPos = config.height - 25;
    	}

    	fakeCircuit.lineTo(puzzle.x, yPos);

    	finalXPos = puzzle.x - (Math.random() * 50 + 80)//*(Math.random() < 0.5 ?1:-1);
    	fakeCircuit.lineTo(finalXPos, yPos);
    	
    	let tempCircle = this.drawCircle(0xFFFFFF, 20)
    	tempCircle.tint = this.lightColors[this.currentLightColors];
    	this.currentLightColors ++;
    	if(this.currentLightColors >= this.lightColors.length){
    		this.currentLightColors = 0;
    	}
    	tempCircle.x = finalXPos;
    	tempCircle.y = yPos;
    	this.circuitsContainer.addChild(tempCircle);
	}
	drawCircle(color, radius){
		let circle = new PIXI.Graphics();
		circle.beginFill( color );
	    circle.drawCircle( 0,0,radius);
	    return circle;
	}
	endGame(){

		this.ending = true;
		for (var i = 0; i < this.particlesArray.length; i++) {
			this.particlesArray[i].destroy();
		}

		TweenLite.to(this.arrowImage, 0.5, {alpha:0});

		this.endButton.alpha = 0;
		TweenMax.to(this.endButtonFill, 1.2, {
			delay:1,
			bezier: {
				type:"thru",
				curviness :2,
				values:[
					{x:this.endButtonFill.x, y:this.endButtonFill.y}, 
				  	{x:config.middlePoint.x + (this.endButtonFill.x - config.middlePoint.x) / 2, y:config.height - this.puzzleRadius},
				  	{x:config.middlePoint.x, y:0}],
				  	ease:Power1.easeInOut
				}
			}
		);
		TweenLite.to(this.endButtonFill.scale,1,{delay:1,x:20, y:20,ease:'easeInCubic'});
		TweenLite.to(this.arrowImage,0.2,{alpha:0});


		setTimeout(function() {
			this.changeScreen();
		}.bind(this), 2000);
	}
	changeScreen(){
		this.screenManager.change('END');
	}

	endPuzzles(){
		for (var i = 0; i < this.puzzleArray.length; i++) {
			this.puzzleArray[i].endGameState();
		}
	}
	addParticleToEnd(){
		if(this.ending){
			return;
		}
		this.particlesAdded ++;

		


		this.endGame();
		TweenLite.to(this.endButtonFill.scale, 2, {x:1,y:1,ease:'easeOutElastic'});
		// if(this.particlesAdded != this.maxParticles){
		// 	// this.endButtonFill.scale.x = (this.particlesAdded / this.maxParticles)
		// 	// this.endButtonFill.scale.y = (this.particlesAdded / this.maxParticles)
		// 	TweenLite.to(this.endButtonFill.scale, 0.5, {x:(this.particlesAdded / this.maxParticles),y:(this.particlesAdded / this.maxParticles)});
		// }else{
		// 	TweenLite.to(this.endButtonFill.scale, 1, {x:(this.particlesAdded / this.maxParticles),y:(this.particlesAdded / this.maxParticles),ease:'easeOutElastic'});
		// 	this.endGame();
		// }
	}
	update(delta){

		let acumRights = 0;
		for (var i = 0; i < this.puzzleArray.length; i++) {
			if(this.puzzleArray[i].correctDirection == this.puzzleArray[i].currentDirection)
			{
				acumRights ++;
			}
		}
		if(acumRights >= this.puzzleArray.length){
			this.endPuzzles();
		}
		for (var i = 0; i < this.particlesArray.length; i++) {
			this.particlesArray[i].update(delta);
			if(this.particlesArray[i].kill){
				this.particlesArray[i].startParticle();
			}
			if(this.particlesArray[i].remove){
				//this.particlesArray[i].parent.removeChild(this.particlesArray[i]);
				//this.particlesArray.splice(i,1);
				this.addParticleToEnd();
				//break;
			}
		}
	}
}
