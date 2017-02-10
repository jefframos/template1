import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';

export default class PuzzlePart extends PIXI.Container{
	constructor(radius, border, toAvoid){
		super();

		this.directions = ['upRight', 'downRight','leftDown', 'leftUp'];
		this.correctDirection = Math.floor(Math.random() * 2)//this.directions.length);

		if(toAvoid != undefined){
			while(toAvoid == this.correctDirection){
				this.correctDirection = Math.floor(Math.random() * 2)
			}
		}
		this.currentDirection = this.correctDirection;
		while(this.currentDirection == this.correctDirection){
			this.currentDirection = Math.floor(Math.random() * this.directions.length);
		}

		this.rotation = (90 / 180 * 3.14) * this.currentDirection;
		this.radius = radius;
		this.borderSize = border;
		this.simplePuzzleContainer = new PIXI.Container();
		this.simplePuzzleContainer.interactive = false;
		this.simplePuzzleContainer.buttonMode = false;

		this.puzzleBackground = new PIXI.Graphics();
		this.puzzleBackground.beginFill(0x007d7c);
	   	this.puzzleBackground.drawCircle(0,0,this.radius);
	    this.simplePuzzleContainer.addChild(this.puzzleBackground);

	    this.puzzleEffectBackground = new PIXI.Graphics();
		this.puzzleEffectBackground.beginFill(0xffffff);
	   	this.puzzleEffectBackground.drawCircle(0,0,this.radius);
	   	this.puzzleEffectBackground.tint = 0xfedd00;
	   	this.puzzleEffectBackground.alpha = 0;
	    this.simplePuzzleContainer.addChild(this.puzzleEffectBackground);

	    this.lineCorner = new PIXI.Graphics();
		this.lineCorner.lineStyle(this.borderSize, 0x8ccec3);
	   	this.lineCorner.moveTo(0,0);
	   	this.lineCorner.lineTo(0,this.radius);
	   	this.lineCorner.lineTo(this.radius,this.radius);
	   	this.lineCorner.y = -this.radius;
	    this.simplePuzzleContainer.addChild(this.lineCorner);
	    this.lineCorner.alpha = 0;

		this.puzzleBorder = new PIXI.Graphics();
		this.puzzleBorder.lineStyle(this.borderSize, 0xFFFFFF);
	   	this.puzzleBorder.drawCircle(0,0,this.radius);	   	
	    this.simplePuzzleContainer.addChild(this.puzzleBorder);
	    this.puzzleBorder.alpha = 0;
	    this.puzzleBorder.tint = 0xfedd00;

	    this.animatedBuzzleBorder = new PIXI.Graphics();
		this.animatedBuzzleBorder.lineStyle(this.borderSize, 0xfedd00);
	   	this.animatedBuzzleBorder.drawCircle(0,0,this.radius);	   	
	    this.simplePuzzleContainer.addChild(this.animatedBuzzleBorder);    
	   	this.animatedBuzzleBorder.alpha = 0; 	
	    
	    this.simplePuzzleContainer.on('tap', this.onTapUp.bind(this)).on('click', this.onTapUp.bind(this));

	    this.addChild(this.simplePuzzleContainer);

	    this.endState = false;

	}
	startState(delay, lineDelay) {
		this.simplePuzzleContainer.interactive = true;
		this.simplePuzzleContainer.buttonMode = true;
		TweenLite.to(this.puzzleBorder, 0.5, {alpha: 1, delay:delay})
		TweenLite.to(this.lineCorner, 0.5, {alpha: 1, delay:lineDelay})
		setTimeout(function() {
			this.startBorderAnimation();
		}.bind(this), delay * 1000 + 500);
	}
	endGameState() {
		//TweenLite.to(this.puzzleBorder, 0.1, {tint: 0x8ccec3 });
		this.animatedBuzzleBorder.alpha = 0;
		// this.puzzleBorder.tint = 0x8ccec3;
		 //this.puzzleBorder.tint = 0x259b99;
		this.puzzleBorder.tint = 0xbeeae3;

		this.endState = true;
		this.simplePuzzleContainer.interactive = false;
		this.simplePuzzleContainer.buttonMode = false;
	}
	onTapUp(e) {
		TweenLite.killTweensOf(this.puzzleEffectBackground);

		this.rotation = (90 / 180 * 3.14) * this.currentDirection;

		this.currentDirection ++;
		if(this.currentDirection >= this.directions.length){
			this.currentDirection = 0;
		}

		TweenLite.to(this, 0.5, {rotation:this.rotation + (90 / 180 * 3.14), ease:"easeOutElastic"});
		this.scale = {x:0.8, y:0.8};
		TweenLite.to(this.scale, 0.5, {x:1, y:1, ease:"easeOutElastic"});
		this.puzzleEffectBackground.alpha = 0.5;
		TweenLite.to(this.puzzleEffectBackground, 0.5, {alpha:0});
		//config.effectsLayer.addShockwave(this.x / config.width,this.y / config.height,5,0);
		config.effectsLayer.shakeSplitter(0.5,1,0.2,true);
	}
	onTapDown(e) {
	}
	startBorderAnimation(){
		if(this.endState){
			return;
		}
		this.animatedBuzzleBorder.alpha = 1;
		this.animatedBuzzleBorder.scale = {x:1,y:1};
		TweenLite.to(this.animatedBuzzleBorder.scale, 1, {x:1.5,y:1.5});
	    TweenLite.to(this.animatedBuzzleBorder, 1, {alpha:0, onComplete:this.startBorderAnimation.bind(this)});
	}

}