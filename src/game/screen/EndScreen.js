import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'

export default class EndScreen extends Screen{
	constructor(label){
		super(label);
	}
	build(){
		super.build();


		this.puzzleRadius = 71;
		this.puzzleBorderSize = 10;

		//create background shape
		this.background = new PIXI.Graphics();
		this.background.beginFill(0xFFFFFF);
	    this.background.drawRect( 0, 0, config.width, config.height);
		this.addChild(this.background);
		this.backgroundColor = 0x007d7c;
		this.background.endFill();
		this.background.tint = this.backgroundColor;

		this.mainContainer = new PIXI.Container();
		this.assetsContainer = new PIXI.Container();
		this.addChild(this.mainContainer);
		this.mainContainer.addChild(this.assetsContainer);
		
		//create background shape
		this.startButton = new PIXI.Container();
		this.innerStartButtonShape = this.drawCircle(0xffffff,this.puzzleRadius + this.puzzleBorderSize/2);
		this.startButton.addChild(this.innerStartButtonShape);
		this.addChild(this.startButton);
		this.arrowImage = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/arrow.png'));
		this.startButton.addChild(this.arrowImage);
		this.arrowImage.tint = 0xe05d26;
		this.arrowImage.x -= this.arrowImage.width / 2;
		this.arrowImage.y -= this.arrowImage.height / 2;

		this.startButton.x = config.width - 140;
		this.startButton.y = config.middlePoint.y;
		this.startButton.interactive = true;
		this.startButton.buttonMode = true;

		this.asset1 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-1.png'));
		this.asset2 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-2.png'));
		this.asset3 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-3.png'));
		this.asset4 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-4.png'));
		this.asset5 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-5.png'));
		this.asset51 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-5.png'));
		this.asset52 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-5.png'));
		this.asset53 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-5.png'));
		this.hard = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-6.png'));
		this.games = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/Asset-7.png'));

		this.assetsContainer.addChild(this.asset1);
		//this.assetsContainer.addChild(this.asset2);
		this.assetsContainer.addChild(this.asset3);
		this.assetsContainer.addChild(this.asset4);
		this.assetsContainer.addChild(this.asset5);
		this.assetsContainer.addChild(this.asset51);
		this.assetsContainer.addChild(this.asset52);
		this.assetsContainer.addChild(this.asset53);
		this.assetsContainer.addChild(this.hard);
		this.assetsContainer.addChild(this.games);

		this.asset1.x = 50;
		this.asset1.y = config.height / 2 - this.asset1.height / 2;

		this.asset2.x = config.width / 2 - this.asset2.width - 20;
		this.asset2.y = config.height / 2 - this.asset2.height / 2;

		this.asset3.x = config.width / 2 - this.asset3.width + 560;
		this.asset3.y = config.height / 2 - this.asset3.height / 2 + 50;

		this.asset4.x = config.width / 2 - this.asset4.width - 370;
		this.asset4.y = config.height / 2 - this.asset4.height / 2 + 70;

		this.asset5.x = config.width / 2 - this.asset5.width + 500;
		this.asset5.y = config.height / 2 - this.asset5.height / 2 - 90;


		this.asset51.x = config.width - this.asset51.width - 50;
		this.asset51.y = config.height / 2 - this.asset51.height / 2 - 80;

		this.asset52.x = config.width - this.asset52.width - 50;
		this.asset52.y = config.height / 2 - this.asset52.height / 2;

		this.asset53.x = config.width - this.asset53.width - 50;
		this.asset53.y = config.height / 2 - this.asset53.height / 2 + 80;


		this.hard.x = config.width / 2 - this.hard.width - 20;
		this.hard.y = config.height / 2 - this.hard.height / 2;

		this.games.x = config.width / 2 + 20;
		this.games.y = config.height / 2 - this.games.height / 2;

		for (var i = 0; i < 18; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.assetsContainer.addChild(tempCircle);
			tempCircle.x = 450 + 50 * i;
			tempCircle.y = config.height - 50;
		}

		for (var i = 0; i < 3; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.assetsContainer.addChild(tempCircle);
			tempCircle.x = 350;
			tempCircle.y = 50 + 50 * i;
		}


		this.lightColors = [0xe05d26,0x1dc2f2,0x74c700]
		for (var i = 0; i < 3; i++) {
			let tempCircle = this.drawCircle(this.lightColors[i], this.puzzleBorderSize *2);
			this.assetsContainer.addChild(tempCircle);
			tempCircle.x = 290;
			tempCircle.y = 30 + 55 * i;
		}

		for (var i = 0; i < 10; i++) {
			let tempCircle = this.drawCircle(0x8ccec3, this.puzzleBorderSize * 0.8);
			this.assetsContainer.addChild(tempCircle);
			tempCircle.x = 350 + 50 * i;
			tempCircle.y = 50;
		}

		let tempCircuit = new PIXI.Graphics();
		tempCircuit.lineStyle(this.puzzleBorderSize, 0x8ccec3);
    	this.assetsContainer.addChildAt(tempCircuit,1);
    	tempCircuit.moveTo(800, 50);
    	tempCircuit.lineTo(900, 50);
    	tempCircuit.lineTo(900, -20);
    	tempCircuit.lineTo(1000, -20);
    	tempCircuit.lineTo(1000, 50);
    	tempCircuit.lineTo(1350, 50);

    	let tempCircle = this.drawCircle(0xe05d26, this.puzzleBorderSize * 2);
		this.assetsContainer.addChild(tempCircle);
		tempCircle.x = 1350;
		tempCircle.y = 50;

		this.startButton.on('tap', this.showGames.bind(this)).on('click', this.showGames.bind(this));

		this.assetsContainer.x = - this.assetsContainer.width / 2;
		this.assetsContainer.y = - this.assetsContainer.height / 2;

		this.mainContainer.x = -this.assetsContainer.x;
		this.mainContainer.y = -this.assetsContainer.y;


		this.animatedBuzzleBorder = new PIXI.Graphics();
		this.animatedBuzzleBorder.lineStyle(this.puzzleBorderSize, 0xe05d26);
	   	this.animatedBuzzleBorder.drawCircle(0,0,this.puzzleRadius);	   	
	    this.startButton.addChild(this.animatedBuzzleBorder);    
	   	this.animatedBuzzleBorder.alpha = 1; 

	   	this.startBorderAnimation();
	}
	drawCircle(color, radius){
		let circle = new PIXI.Graphics();
		circle.beginFill( color );
	    circle.drawCircle( 0,0,radius);
	    return circle;
	}
	showGames(){
	}
	transitionIn(){

		this.foreground = new PIXI.Graphics();
		this.foreground.beginFill(0xFFFFFF);
	    this.foreground.drawRect( 0, 0, config.width, config.height);
		this.addChild(this.foreground);
		this.foreground.endFill();

		TweenLite.to(this.foreground, 1, {delay:0.5, alpha:0});

	}
	startBorderAnimation(){
		if(this.endState){
			return;
		}
		this.animatedBuzzleBorder.alpha = 1;
		this.animatedBuzzleBorder.scale = {x:1,y:1};
		TweenLite.from(this.startButton.scale, 1, {x:0.9,y:0.9, ease:'easeOutElastic'});
		this.animatedBuzzleBorder.scale = {x:0.97,y:0.97}
		TweenLite.to(this.animatedBuzzleBorder.scale, 1, {x:1.5,y:1.5});
	    TweenLite.to(this.animatedBuzzleBorder, 1, {alpha:0, onComplete:this.startBorderAnimation.bind(this),delay:0.1});
	}
}