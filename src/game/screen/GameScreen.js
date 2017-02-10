import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import InputManager  from '../InputManager';
import CookieManager  from '../CookieManager';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';
import Player from '../entity/Player';
import StartGameContainer from '../container/StartGameContainer';
import EndGameContainer from '../container/EndGameContainer';
import Camera from '../Camera';
import LevelBuilder from '../level/LevelBuilder';

export default class GameScreen extends Screen{
	constructor(label){
		super(label);


		this.background = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('texture_sky.png', config.width, config.height))
		this.addChild(this.background)

		this.background.width = config.width
		this.background.height = config.height
		this.background.tileScale.y = 50
		this.background.tilePosition.y = (this.background.height) //+  config.height//* 50

		//console.log(config.height * 50);


		//this.background = new PIXI.Graphics().beginFill(config.colors.background).drawRect(0,0,config.width, config.height);
		// this.addChild(this.background)

		this.gameContainer = new PIXI.Container();
		this.addChild(this.gameContainer)

		this.ingameUIContainer = new PIXI.Container();
		this.backgroundIngameUI = new PIXI.Graphics().beginFill(0x023548).drawRect(0,0,config.width, config.height);
		this.addChild(this.ingameUIContainer)
		this.backgroundIngameUI.alpha = 0;
		this.ingameUIContainer.addChild(this.backgroundIngameUI)

		this.UIContainer = new PIXI.Container();
		this.addChild(this.UIContainer)

		//this.backgroundLine = new PIXI.Graphics().lineStyle(5,0xaa3548).drawRect(0,0,config.width, config.height);
		//this.gameContainer.addChild(this.backgroundLine);


		let ww = 0.7
		this.cameraBounds = {x:config.width * (ww/2), y:config.height * 0.2, w:config.width - config.width * ww, h:config.height - config.height * 0.4};
		this.camera = new Camera(this, this.gameContainer, this.cameraBounds);
		ww = 0.3
		this.containersBounds = {x:config.width * (ww/2), y:config.height * 0.2, w:config.width - config.width * ww, h:config.height - config.height * 0.4};

		this.darkShape = new PIXI.Graphics().beginFill(0x000000).drawRect(0,0,config.width, config.height);
		this.darkShape.alpha = 0;
		this.UIContainer.addChild(this.darkShape);

		this.startGameContainer = new StartGameContainer(this, this.containersBounds);
		this.startGameContainer.x = this.containersBounds.x;
		this.startGameContainer.y = this.containersBounds.y;
		this.startGameContainer.hide(true)
		this.UIContainer.addChild(this.startGameContainer);

		this.endGameContainer = new EndGameContainer(this, this.containersBounds);
		this.endGameContainer.x = this.containersBounds.x;
		this.endGameContainer.y = this.containersBounds.y;
		this.endGameContainer.hide(true)

		// this.endGameContainer.show(0.5);

		this.UIContainer.addChild(this.endGameContainer);


		let backButtonConfig = this.createButton("II");
		this.pauseButton = backButtonConfig.button;
		this.addChild(this.pauseButton);
		this.pauseButton.position.set(30);
		this.UIContainer.addChild(this.pauseButton);
		this.pauseButton.on('tap', this.togglePause.bind(this)).on('click', this.togglePause.bind(this));

		this.currentCoins = 0;
		this.coinsLabel = new PIXI.Text(this.currentCoins,{font : '20px luckiest_guyregular', fill : 0xFFFFFF, align : 'right'});
		this.ingameUIContainer.addChild(this.coinsLabel);
		this.coinsLabel.x = config.width - this.coinsLabel.width - 20;
		this.coinsLabel.y = 20;

		this.playerStatus = new PIXI.Text('',{font : '15px luckiest_guyregular', fill : 0xFFFFFF, align : 'right'});
		this.ingameUIContainer.addChild(this.playerStatus);
		this.playerStatus.x = config.width - this.playerStatus.width - 20;
		this.playerStatus.y = 50;

		this.currentSpawnPoint = {x:0,y:0,side:1}


		window.gamee = this;

		this.currentHeight = 0;


		 if (location.href.indexOf("#debug") != -1) {
	        // Your code in here accessing the string like this
	        // location.href.substr(location.href.indexOf("#"))
	        this.debugging = true;
	    }else{
			this.debugging = false;
	    }

	    if (location.href.indexOf("#pattern=") != -1) {
	    	var type = window.location.hash.substr(9)
	    	this.fixedPattern = type;
	    }else{
	    	this.fixedPattern = null;
	    }

	    	//// console.log(location.href.indexOf("#zoom="));
	    if (location.href.indexOf("#zoom=") != -1) {
	    	var type = window.location.hash.substr(6)
	    	this.forcedZoom = parseFloat(type);
	    }else{
	    	this.forcedZoom = null;
	    }

	    this.currentMiddlePoint = {x:0, y:0};

	    this.levelBuilder = new LevelBuilder(this);

	}

	createButton(label) {
	    let button = new PIXI.Container()
	    let descriptionLabel = new PIXI.Text(label,{font : '20px luckiest_guyregular', fill : 0xFFFFFF, align : 'right'});
	    let color = 0x00FFFF;
	    button.addChild(descriptionLabel);
	    button.interactive = true
	    button.buttonMode = true
	    return {button:button, size:{width:descriptionLabel.width, height:descriptionLabel.height}, label:descriptionLabel}
	}
	
	showDark(){
		if(this.debugging)return
		TweenLite.to(this.darkShape, 0.5, {alpha:0.3})
	}
	hideDark(){
		TweenLite.to(this.darkShape, 0.5, {alpha:0})
	}
	build(){
		super.build();

		this.resetGame();
		
	}
		//destroy game
	destroyGame(){
		while(this.gameContainer.children.length){
			this.gameContainer.removeChildAt(0);
		}
		this.removeEvents();
	}
	resetGame(force){

		//console.log('RESET GAME');
		// this.endZoneLine = new PIXI.Graphics().beginFill(0x00ffff).drawRect(-500,0,config.width + 1000, 5);
		// this.gameContainer.addChild(this.endZoneLine);

		// this.beginZoneLine = new PIXI.Graphics().beginFill(0xffff00).drawRect(-500,0,config.width + 1000, 5);
		// this.gameContainer.addChild(this.beginZoneLine);


		this.updateList = [];

		this.wallList = [];
		this.coinList = [];
		this.chainsList = [];
		this.enemyList = [];
		this.itemList = [];
		this.addEvents();

		window.walls = this.wallList

		this.forceSingleLane = 0;

		this.playerList = [];

		let player = new Player(this);
		player.x = config.width / 2;
		player.y = -config.height/2;


		this.playerList.push(player);

		this.mainPlayer = player;

		this.gameSpeed = 350;
		
		this.gameContainer.addChild(player);
		this.updateList.push(player);


		this.endZone = 0;
		this.beginZone = 0;

		this.currentHeight = 0//this.player.y;
		this.checkPoints = [];

		this.levelBuilder.buildPattern(true);

		this.resetPlayerPositionJump();
		this.startJump();

		this.camera.follow(this.mainPlayer)

		//console.log('zoom 2 reset');
		this.camera.zoom(2)
		this.camera.updatePosition(true);

		// this.addShadowPlayer();

		this.levelBuilder.buildPattern();

		this.finishingGame = false;


		this.currentCoins = 0;


		if(!force){
			this.startGameContainer.show(0.3);
			if(this.debugging)
				this.startGameContainer.visible = false
			this.pause();
		}

	}
	addShadowPlayer(position){
		let player = new Player(this, 'SHADOW');
		player.x = position.x;
		player.y = position.y;


		this.gameContainer.addChild(player);
		this.updateList.push(player);
		this.playerList.push(player);

		player.reset();
		player.clone(this.mainPlayer);

	}
	resetPlayerPositionJump(){
		this.mainPlayer.reset('wall');//this.currentSpawnPoint
		this.mainPlayer.side = this.currentSpawnPoint.side * -1;
		this.mainPlayer.x = this.currentSpawnPoint.x//config.width / 2 //+ this.currentPattern.middle + this.mainPlayer.getRadius();
		this.mainPlayer.y = this.currentSpawnPoint.y//config.width / 2 //+ this.currentPattern.middle + this.mainPlayer.getRadius();

		//console.log(this.mainPlayer.side);
	}
	startJump(){
		
		this.mainPlayer.jump(true);
	}
	togglePause(){
		this.isPause = !this.isPause
	}
	pause(){
		this.isPause = true;
	}
	unpause(){
		this.isPause = false;
	}
	getItem(item){
		this.mainPlayer.applyItem(item);
	}
	entryOnPortal(portal){
		// return
		//// console.log(portal);
		if(this.lastPortal == portal || this.lastTargetPortal == portal || !portal.portalData || !portal.portalData.targets){
			return;
		}
		// this.lastPortal = portal;
		if(portal.type == 'TELEPORT'){
			// this.mainPlayer.x = portal.portalData.targets[0].x;
			// this.mainPlayer.y = portal.portalData.targets[0].y;
			this.mainPlayer.teleport(portal.portalData.targets[0]);
			// this.lastTargetPortal = portal.portalData.targets[0];
		}else{

			this.mainPlayer.x = portal.x;
			this.mainPlayer.y = portal.y;

			for (var i = 0; i < portal.portalData.targets.length; i++) {
				let target = portal.portalData.targets[i];
				this.addShadowPlayer({x:target.x, y:target.y + this.mainPlayer.getRadius()});
			}
		}
		// this.pause();
	}
	getChain(chainBox){
		this.currentChain = chainBox.chain;
		this.chainCoins = 0;
	}
	getChainCoin(coin){
		// this.currentCoins += coin.value;
		this.chainCoins ++;

		let getCoinLabel = new PIXI.Text(this.chainCoins,{font : '50px luckiest_guyregular', fill : 0xFF0000, align : 'right'});
		let container = new PIXI.Container();
		container.addChild(getCoinLabel);
		getCoinLabel.x = -getCoinLabel.width / 2;
		getCoinLabel.y = -getCoinLabel.height * 2;
		let pos = {x:coin.x, y:coin.y}//coin.toGlobal(new PIXI.Point());
		container.x = pos.x;
		container.y = pos.y;

		container.scale.set(0.5);
		TweenLite.to(container, 0.8, {y:container.y - container.height});
		TweenLite.to(container.scale, 1, {x:1, y:1, ease:'easeOutBounce', onComplete:this.removeFromUI, onCompleteParams:[container]});

		// this.ingameUIContainer.addChild(container);
		this.gameContainer.addChild(container);


		if(this.chainCoins >= this.currentChain.chainList.length){
			this.currentChain.endChain.show();
		}
	}
	getCoin(coin){
		this.currentCoins += coin.value;

		let getCoinLabel = new PIXI.Text(coin.value,{font : '20px luckiest_guyregular', fill : 0xFFFFFF, align : 'right'});
		let container = new PIXI.Container();
		container.addChild(getCoinLabel);
		getCoinLabel.x = -getCoinLabel.width / 2;
		getCoinLabel.y = -getCoinLabel.height * 2;
		let pos = {x:coin.x, y:coin.y}//coin.toGlobal(new PIXI.Point());
		container.x = pos.x;
		container.y = pos.y;

		container.scale.set(0.5);
		TweenLite.to(container, 0.8, {y:container.y - container.height});
		TweenLite.to(container.scale, 1, {x:1, y:1, ease:'easeOutBounce', onComplete:this.removeFromUI, onCompleteParams:[container]});

		// this.ingameUIContainer.addChild(container);
		this.gameContainer.addChild(container);
	}
	removeFromUI(object){
		if(object && object.parent){
			object.parent.removeChild(object);
		}
	}
	updateSpeed(){
		for (var i = 0; i < this.wallList.length; i++) {
			this.wallList[i].velocity.y = this.gameSpeed;
		}
	}
	normalSpeed(){
		this.gameSpeed = 350;
		this.updateSpeed();
	}
	reduceSpeed(){
		this.gameSpeed = 150;
		this.updateSpeed();
	}
	
	updateCurrentLevel(){


	}
	updateComboBar(){
		
	}
	addCombo(){
		

	}
	//EVENTS
	onReviveCallback(){
		//console.log('REVIVE');

		this.endGameContainer.hide();

		let forceWall = true;

		this.finishingGame = false;

		//// console.log(this.levelBuilder.currentPattern);
		this.mainPlayer.reset();
		this.mainPlayer.revive(forceWall);

		if(this.levelBuilder.currentPattern.playerPosition){
			this.resetPlayerPositionJump();
			this.startJump();
			forceWall = false;
		}


		this.camera.follow(this.mainPlayer)

		//console.log('zoom 2 REVIVE');

		this.camera.zoom(2)
		this.camera.updatePosition(true);

		
		this.pause();
		this.startGame(1000);
	}
	onStartCallback(){
		this.startGame()
	}
	removeEvents(){
		this.ingameUIContainer.off('touchstart').off('mousedown');
		this.ingameUIContainer.off('touchend').off('mouseup');
	}
	addEvents(){
		this.removeEvents();
		this.ingameUIContainer.interactive = true;
		this.ingameUIContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this)); 
		this.ingameUIContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this)); 	    
	}
	onMouseMoveCallback(e) {
		
	}
	onTapUp(e) {
		//// console.log('up');
	}
	onTapDown(e) {
		if(this.isPause){
			return;
		}
		//// console.log('down');

		//// console.log(this.playerList);
		for (var i = 0; i < this.playerList.length; i++) {
			this.playerList[i].jump();
		}
		// this.player.jump()

	}
	onPauseCallback() {
		
	}

	//GAMEPLAY
	
	//end game
	endGame() {
		
	}
	
	addBottomHUD() {
		
	}
	
	addInfoLabel(label, addEffects, dontRemove, grey) {
		
	}
	initGame() {
		

	}
	
	showGame(){
		
	}
	hideGame(){
		
	}
	showMenu(){
		
		
	}
	updateMenu(){

	}
	//end timer
	selectMenu(){
	}
	showEndContainer(){
	}

	onReestartCallback(){
		this.reestartGame();
	}

	reestartGame(){
		this.pause();
		this.destroyGame();
		this.resetGame(true);
		this.startGame(2000);
	}

	
	startGame(delay = 500) {

		this.background.tilePosition.y = (this.background.height)

		this.lastPortal = null;
		this.lastTargetPortal = null;

		this.startGameContainer.hide();

		this.resetPlayerPositionJump();
		//console.log('zoom 1 start game');

		setTimeout(function() {
			this.camera.zoom(1, 0.5)
			this.camera.follow(this.mainPlayer);
			this.camera.updatePosition(true);
			this.unpause();
		}.bind(this), delay);
		
	}
	gameOver() {

		for (var i = 0; i < this.playerList.length; i++) {
			if(this.playerList[i] != this.mainPlayer)
				this.playerList[i].kill = true;
		}
		this.mainPlayer.cameraType = 'AIR';
		this.camera.shake(1,20,0.5);
		this.camera.zoomBounce(0.5,2);
		this.gameSpeed = 0;
		this.finishingGame = true;
		this.updateSpeed();

		this.endGameContainer.currentCoins = this.currentCoins;
		this.endGameContainer.show(0.5);
		
	}
	//SCREEN
	
	
	//UPDATE
	//update timer
	updatePlayerPosition(){
		let playerBounds = this.mainPlayer.getHeadBounds();

		for (var i = 0; i < this.checkPoints.length; i++) {
			for (var j = 0; j < this.checkPoints[i].boundsEnd.length; j++) {
				let check = this.checkPoints[i].boundsEnd[j];
				if(check.x < playerBounds.x + playerBounds.width &&
				   check.x + check.width > playerBounds.x &&
				   check.y < playerBounds.y + playerBounds.height &&
				   check.height + check.y > playerBounds.y){

					this.currentSpawnPoint = this.checkPoints[i+1].respawPoint;

				   	let middlePoint = null;//{x:check.x - 32,y:check.y}

				   	if(this.checkPoints[i] && this.checkPoints[i + 1] && !this.checkPoints[i].single){
				   		this.nextMiddlePoint = {x:0, y:0};
				   		this.nextMiddlePoint.x = check.x;
				   		this.nextMiddlePoint.y = this.checkPoints[i + 1].boundsEnd[0].y;
				   		
				   		//// console.log(this.nextMiddlePoint, 'tenho que guardar esse middlepoint aqui');

				   	}

				   	if(this.checkPoints[i + 1] && !this.checkPoints[i + 1].single){
				   		//// console.log('tenho que guardar esse middlepoint aqui');

				   	}else{

				   		if(this.nextMiddlePoint){
				   			middlePoint = {x:0,y:0};
				   			middlePoint.x = this.nextMiddlePoint.x - 32;
				   			middlePoint.y = this.nextMiddlePoint.y;
				   			this.forceSingleLane = 1;
				   			this.nextMiddlePoint = null;
				   		}
					   	this.levelBuilder.buildPattern(false, middlePoint, this.forceSingleLane > 0);
					   	this.forceSingleLane --;
					   	this.checkPoints.splice(i,1)
				   	}

				}
			}
		}

		//// console.log(this.currentMiddlePoint);
	}
	updateTimer(delta){
		if(this.ended){
			return;
		}
		
	}
	
	update(delta){
		delta *= 1.2;
		
		// delta = delta.toFixed(2) * 0.5
		super.update(delta);

		// if(this.debugging)
		if(this.forcedZoom){
			this.camera.zoom(this.forcedZoom)
		}
		if(this.isPause || !this.mainPlayer){
			return;
		}
		//// console.log('coinPool',this.levelBuilder.coinPool.length)
		//// console.log('redCoinPool',this.levelBuilder.redCoinPool.length)
		//// console.log('portalPool',this.levelBuilder.portalPool.length)
		//// console.log('diamondPool',this.levelBuilder.diamondPool.length)
		//// console.log('enemyPool',this.levelBuilder.enemyPool.length)
		//// console.log('itemPool',this.levelBuilder.itemPool.length)
		//// console.log('wallPool',this.levelBuilder.wallPool.length)

		this.updatePlayerPosition();
		this.camera.update(delta, this.mainPlayer.cameraType);

			
			// if(this.background.tilePosition.y < config.height * 50 && this.mainPlayer){
			// 	this.background.tilePosition.y -= this.mainPlayer.velocity.y //* delta
			//// 	//console.log(this.background.tilePosition.y);
			// }
			if(this.background.tilePosition.y < (config.height*0.60  * 50) && this.mainPlayer){
				if(this.mainPlayer.velocity.y < 0){
					this.background.tilePosition.y -= this.mainPlayer.velocity.y * delta * 0.5
				}
				//// console.log(this.background.tilePosition.y);
			}


		if(!this.finishingGame){


			this.coinsLabel.text = this.currentCoins//this.player.velocity.x+' - '+ this.player.velocity.y//this.currentCoins;
			this.coinsLabel.x = config.width - this.coinsLabel.width - 20;


			this.playerStatus.text = '';

			for (var i = 0; i < this.mainPlayer.itens.length; i++) {
				this.playerStatus.text += this.mainPlayer.itens[i].data.type + ' - '+ this.mainPlayer.itens[i].timer.toFixed(2) + '\n';
			}
			this.playerStatus.x = config.width - this.playerStatus.width - 20;
		}
		for (var i = 0; i < this.wallList.length; i++) {
			if(this.wallList[i].kill){
				this.wallList.splice(i,1);
			}
		}	

		for (var i = 0; i < this.coinList.length; i++) {
			if(this.coinList[i].kill){
				this.coinList.splice(i,1);
			}
		}

		for (var i = 0; i < this.enemyList.length; i++) {
			if(this.enemyList[i].kill){
				this.enemyList.splice(i,1);
			}
		}

		for (var i = 0; i < this.itemList.length; i++) {
			if(this.itemList[i].kill){
				this.itemList.splice(i,1);
			}
		}

		for (var i = 0; i < this.playerList.length; i++) {
			if(this.playerList[i] != this.mainPlayer && this.playerList[i].kill){
				this.playerList.splice(i,1);
			}
		}

		for (var i = 0; i < this.checkPoints.length; i++) {
			let pos = this.checkPoints[i].shape.toGlobal(new PIXI.Point());
			if(pos.y > config.height * 5){
				if(this.checkPoints[i].shape.parent){
					this.checkPoints[i].shape.parent.removeChild(this.checkPoints[i].shape);
				}
				this.checkPoints.splice(i,1);
			}
		}

		for (var i = 0; i < this.updateList.length; i++) {
			this.updateList[i].update(delta)
			if(this.updateList[i].kill){
				if(this.updateList[i].parent)
					this.updateList[i].parent.removeChild(this.updateList[i]);
				this.updateList.splice(i,1);
			}
		}
		
	}
}
