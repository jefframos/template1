import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
import TweenLite from 'gsap';

export default class Player extends PIXI.Container{
	constructor(game, type = 'MAIN'){
		super();

		this.type = type;
		this.game = game;
		this.radius = config.tileWidth / 2;
		this.playerContainer = new PIXI.Container();
		this.addChild(this.playerContainer);
		if(this.type == 'MAIN'){
			this.playerView = new PIXI.Graphics().lineStyle(2, 0).beginFill(config.colors.player).drawCircle(0,0,this.radius);
		}else{
			this.playerView = new PIXI.Graphics().beginFill(config.colors.wall['standard]']).drawCircle(0,0,this.radius);
		}
		this.headView = new PIXI.Graphics().beginFill(config.colors.player).drawCircle(0,0,this.radius/2);
		this.headView.alpha = 0;
		// this.headView = new PIXI.Graphics().beginFill(0xff55ff).drawCircle(0,0,this.radius/2);
		this.feetsView = new PIXI.Graphics().beginFill(config.colors.player).drawCircle(0,0,this.radius/2);
		// this.feetsView = new PIXI.Graphics().beginFill(0x5555ff).drawCircle(0,0,this.radius/2);

		this.gravities = {wall:1200, ground:1900};
		this.speeds = {wall:{x: 550, y:-450}, ground:{x: 450, y:-600}};
		this.accelerations = {wall:550, ground:550 / 90};


		this.playerContainer.addChild(this.playerView)
		this.headView.y = - this.radius
		this.feetsView.y = this.radius / 2
		this.playerContainer.addChild(this.headView)
		this.playerContainer.addChild(this.feetsView)

		this.side = 1;

		this.reset();


		if(this.type != 'MAIN'){
			this.playerView.tint = 0x00FFFF;

		}

		window.player = this;

		this.ySpeedScale = 1;


	}
	reset(type = 'wall'){
		this.velocity = {x:0,y:0};
		this.virtualVelocity = {x:0,y:0};
		this.speed = this.speeds[type]//wall;
		this.gravity = this.gravities[type];
		this.acceleration = this.accelerations[type];
		this.currentStickedWall = null;
		this.onGround = false;
		this.falling = false;
		this.firstJump = false;
		this.touchOnGround = false;
		this.cameraType = 'WALL'
		this.itens = [];
		this.gameOver = false;
		// this.firstJump = false;
	}
	canJump(){

		if(this.currentStickedWall)
		{
			return -1
		}

		if(this.onGround){
			return -1
		}

		if(this.wallCollide(this.radius)){
			return 0
		}
		// let ret = !(this.currentStickedWall || this.onGround)
		return 1//ret
	}
	getItemByType(type){
		let tempItens = [];
		for (var i = 0; i < this.itens.length; i++) {
			console.log(this);
			if(this.itens[i].data.type.indexOf(type) !== -1){
				tempItens.push(this.itens[i]);
			}
		}
		return tempItens
	}
	removeItem(item){
		console.log('REMOVE');
		for (var i = 0; i < this.itens.length; i++) {
			if(this.itens[i] == item){
				this.itens.splice(i,1);
			}
		}
		if(item.data.type.indexOf('invencible') !== -1){
			this.invencible = false;
		}
		if(item.data.type.indexOf('attract') !== -1){
			this.attract = false;
		}
	}
	applyItem(item){
		item.setPlayer(this);
		let toRemove = this.getItemByType(item.data.type);
		for (var i = 0; i < toRemove.length; i++) {
			this.removeItem(toRemove[i]);
		}
		// this.getItemByType
		this.itens.push(item);
		if(item.data.type.indexOf('invencible') !== -1){
			this.invencible = true;
		}
		if(item.data.type.indexOf('attract') !== -1){
			this.attract = true;
		}

		console.log(this.itens);
	}
	jump(force, ignoreXVelocity){
		// console.log(this.cameraType);
		if(this.falling){
			return
		}
		let jumpType = this.canJump()
		if(jumpType > 0 && !force){
			return;
		}

		this.ySpeedScale = 1;

		// console.log(jumpType);
		if(!this.onGround){
			this.side *= -1;

			if(this.firstJump){
				this.virtualVelocity.x = this.speed.x/2 * this.side;
			}else{
				if(!ignoreXVelocity){
					this.virtualVelocity.x = this.speed.x * this.side;
				}		
			}

			this.velocity.y = this.speed.y;			

			this.cameraType = 'AIR';

		}else{
			this.velocity.y = this.speed.y;
			this.y += this.velocity.y * 1/60;
			this.onGround = false;
		}
		this.firstJump = false;
		
		this.currentStickedWall = null;

		this.onGround = false;

		this.touchOnGround = false;

		if(jumpType == 0){
			this.earlyJump();
		}
		// console.log(this.cameraType, this.virtualVelocity, this.velocity, this.speed, this.gravity, this.acceleration);
		// this.game.camera.zoom(0.8, 1);
	}
	earlyJump(){
		this.x += this.virtualVelocity.x * 1/30;
	}
	getHeadBounds(){
		let obj = {x:this.x + this.headView.x - this.headView.width/2, y:this.y + this.headView.y - this.headView.height/2,
				width:this.headView.width, height:this.headView.height}
		if(this.currentStickedWall){
			obj.x = this.x + this.headView.x - this.headView.width/2 + 10 * (-this.side)
			}
		return obj
	}
	getFeetsBounds(){
		let obj = {x:this.x + this.feetsView.x - this.feetsView.width/2, y:this.y + this.feetsView.y - this.feetsView.height/2,
				width:this.feetsView.width, height:this.feetsView.height}
		
		return obj
	}

	attractCoins(){
		for (var i = 0; i < this.game.coinList.length; i++) {
			let coin = this.game.coinList[i];
			if(coin.type == 'COIN' && coin.collidable && utils.distance(this.x, this.y, coin.x, coin.y) < this.getRadius() * 8 + coin.getRadius()){
				let angle = Math.atan2(coin.y - this.y, coin.x - this.x) + 3.14/2;
				// let angle = Math.atan2(this.y - coin.y, this.x - coin.x);
				coin.velocity.x = -Math.sin(angle) * 600;
				coin.velocity.y = Math.cos(angle) * 600;
			}
		}
	}

	coinsCollision(){
		for (var i = 0; i < this.game.coinList.length; i++) {
			let coin = this.game.coinList[i];
			if(coin.collidable && utils.distance(this.x, this.y, coin.x, coin.y) < this.getRadius() + coin.getRadius()){
				coin.active();
			}
		}
	}
	enemiesCollision(){
		for (var i = 0; i < this.game.enemyList.length; i++) {
			let enemy = this.game.enemyList[i];
			if(enemy.collidable && utils.distance(this.x, this.y, enemy.x, enemy.y) < this.getRadius() + enemy.getRadius()){
				return enemy
			}
		}
	}
	headCollision(){
		this.headView.tint = 0xFFFFFF
		for (var i = 0; i < this.game.wallList.length; i++) {
			let wallBounds = this.game.wallList[i].getHeadHitBounds()
			let headBounds = this.getHeadBounds()
			if(headBounds.x < wallBounds.x + wallBounds.width &&
			   headBounds.x + headBounds.width > wallBounds.x &&
			   headBounds.y < wallBounds.y + wallBounds.height &&
			   headBounds.height + headBounds.y > wallBounds.y){
				// this.headView.tint = 0xFF0000
				// this.game.wallList[i].wallView.tint = 0x0000ff;
				this.y += this.getRadius();
				return true
			}else{
				// this.game.wallList[i].wallView.tint = 0xffffff;
			}
			// if(test){
			// 	return this.game.wallList[i];
			// }
		}
		// return null
	}
	groundCollision(){
		// this.feetsView.tint = 0xFFFFFF
		for (var i = 0; i < this.game.wallList.length; i++) {
			let wallBounds = this.game.wallList[i].getGroundHitBounds()
			let headBounds = this.getFeetsBounds()
			if(headBounds.x < wallBounds.x + wallBounds.width &&
			   headBounds.x + headBounds.width > wallBounds.x &&
			   headBounds.y < wallBounds.y + wallBounds.height &&
			   headBounds.height + headBounds.y > wallBounds.y){
				// this.headView.tint = 0xFF0000
				// this.game.wallList[i].wallView.tint = 0xff00ff;
				return wallBounds
			}else{
				// this.game.wallList[i].wallView.tint = 0xffffff;
			}
			// if(test){
			// 	return this.game.wallList[i];
			// }
		}
		// return null
	}
	wallCollide(virtualWidth = 0){
		for (var i = 0; i < this.game.wallList.length; i++) {

			let test = this.virtualVelocity.x < 0 && this.game.wallList[i].getPolygon().contains(
					this.x - this.getRadius() - virtualWidth, this.y//4
				) || this.virtualVelocity.x > 0 &&
				this.game.wallList[i].getPolygon().contains(
					this.x + this.getRadius() + virtualWidth, this.y//4
				)			
			if(test){
				// this.game.wallList[i].wallView.tint = 0xff0000;
				return this.game.wallList[i];
			}else{
				// this.game.wallList[i].wallView.tint = 0xffffff;
			}
		}
		return null
	}
	stickWall(wall){
		this.currentStickedWall = wall;
		this.lastStickedWall = wall;


		if(this.currentStickedWall.type == 'slippery'){
			this.ySpeedScale = 0.5;
			// this.game.reduceSpeed();
		}else if(this.currentStickedWall.type == 'fast'){
			this.ySpeedScale = 1.5;
			this.game.normalSpeed();
		}else{
			this.ySpeedScale = 1;
			this.game.normalSpeed();
		}
		TweenLite.to(this.playerContainer.scale, 0.3, {x:1, y:1, ease:'easeOutBounce'});
		// TweenLite.to(this.playerContainer, 0.2, {rotation:0});
		this.playerContainer.rotation = 0;

		if(wall.x < this.x){
			this.x = wall.x + this.currentStickedWall.wallContainer.width
		}else{
			this.x = wall.x
		}
		// this.game.camera.zoom(1.2);
	}
	teleport(target){

		// console.log('TELEPORT');
		this.x = target.x;
		this.y = target.y;

		this.velocity.x = 0;
		this.velocity.y = 0;

		// this.virtualVelocity.x = 0;
		// this.virtualVelocity.y = 0;
	}
	getRadius(){
		return this.scale.x * this.radius;
	}
	clone(player){


		this.velocity.x = player.velocity.x;
		this.velocity.y = player.velocity.y;

		this.virtualVelocity.x = player.virtualVelocity.x;
		this.virtualVelocity.y = player.virtualVelocity.y;

		this.cameraType = player.cameraType;

		this.acceleration = player.acceleration;
		this.speed.x = player.speed.x;
		this.speed.y = player.speed.y;

		this.gravity = player.gravity;
	}
	die(){

		if(this.type == 'MAIN'){
			this.game.gameOver();
		}

		for (var i = 0; i < this.itens.length; i++) {
			this.removeItem(this.itens[i]);
		}

		TweenLite.to(this.playerContainer.scale, 0.3, {x:1, y:1, ease:'easeOutBounce'});
		this.falling = true;
		this.gameOver = true;
		this.velocity.x *= - 0.2;
		this.velocity.y = 0;
	}
	dyingLoop(delta){
		if(this.type == 'MAIN'){
			this.game.camera.unfollow();
		}


		this.gravity = this.gravities.wall;
		this.velocity.y += this.gravity * delta;

		this.playerContainer.rotation = Math.atan2(this.velocity.y,this.virtualVelocity.x) - 3.14

		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;

		// console.log( this.type != 'MAIN', this.type);
		if(this.y > config.height || this.type != 'MAIN'){
			this.velocity.x = 0;
			this.velocity.y = 0;
			if(this.type != 'MAIN'){
				this.kill = true;
			}
		}
	}
	jumpingLoop(delta){
		//this.velocity.y = -this.game.gameSpeed;

		let headCollision = this.headCollision();
		let enemiesCollision = this.enemiesCollision();
		if(headCollision || enemiesCollision){
			if(headCollision && this.gravity == this.gravities.ground){
				this.velocity.y *= -1
				// this.y -= this.velocity.y * 4 * delta;
				// this.velocity.y = 0;
				return;
			}else{
				if(this.invencible && enemiesCollision){
					//enemiesCollision.kill = true;
					enemiesCollision.die(this.velocity);
				}else{
					this.die();
					return;
				}
			}
		}
		

		if(this.virtualVelocity.x && !this.currentStickedWall){
			let angle = Math.atan2( this.velocity.y,this.velocity.x);
			// let angle = Math.atan2( this.velocity.y, Math.abs(this.velocity.x));
			this.playerContainer.scale.x = 0.8 + Math.cos(angle) * 0.2;
			this.playerContainer.scale.y = 0.8 + Math.sin(angle) * 0.2;

			this.playerContainer.rotation = angle
		}
		this.onGround = this.groundCollision();

		if(this.onGround){
			this.atGround();
		}
		let wallCollide = this.wallCollide();

		

		if(!wallCollide){
			if(this.currentStickedWall){
				this.forceCornerJump();				
			}
			this.currentStickedWall = null;


			if(this.velocity.x < this.virtualVelocity.x){
				this.velocity.x += this.acceleration;
				if(this.velocity.x > this.virtualVelocity.x){
					this.velocity.x = this.virtualVelocity.x
				}
			}else if(this.velocity.x > this.virtualVelocity.x){
				this.velocity.x -= this.acceleration;
				if(this.velocity.x < this.virtualVelocity.x){
					this.velocity.x = this.virtualVelocity.x
				}
			}

			this.x += this.velocity.x * delta;
			this.velocity.y += this.gravity * delta;
			
			//}
			this.game.normalSpeed();			
		}else if(this.currentStickedWall != wallCollide){
			this.stickWall(wallCollide);

		}else{
			this.atWall();
			this.velocity.y = this.speed.y;
		}

		// console.log(this.ySpeedScale);
		this.velocity.y *= this.ySpeedScale;

		this.y += this.velocity.y * delta;
		// console.log(this.velocity.y);
		
	}
	forceCornerJump(){
		this.ySpeedScale = 1;
		this.speed = this.speeds.wall;
		this.velocity.x  = this.speed.x * 0.5 * this.side;
		this.gravity = this.gravities.ground;
		this.acceleration = this.accelerations.ground;
		this.side *= -1
		this.jump(true, true);
	}
	atGround(){
		this.gravity = this.gravities.ground;
		this.acceleration = this.accelerations.ground;
		if(this.cameraType != 'GROUND'){
			this.speed = this.speeds.ground;
		}
		if(!this.touchOnGround){
			this.velocity.x = this.speed.x / 2 * this.side;
			this.touchOnGround = true;
		}
		this.virtualVelocity.x  = this.speed.x * this.side;
		this.velocity.y = 0;
		this.y = this.onGround.y - this.getRadius() // 2 - 1;

		// console.log(this.y);
		this.cameraType = 'GROUND';
		TweenLite.to(this.playerContainer.scale, 0.3, {x:1, y:1, ease:'easeOutBounce'});
	}
	revive(forceWall){
		// if(forceWall){
		// 	console.log('STICK');
		// 	let lastWallBounds = this.lastStickedWall.getBounds();
		// 	this.y = lastWallBounds.y + lastWallBounds.height - this.getRadius();
		// 	// this.stickWall(this.lastStickedWall);
		// 	this.stickWall(this.lastStickedWall);

		// }
		// // this.velocity = {x:0, y:0};
		// // this.virtualVelocity = {x:0, y:0};
		// this.falling = false;
	}
	atWall(){
		this.speed = this.speeds.wall;
		this.gravity = this.gravities.wall;
		this.acceleration = this.accelerations.wall;
		this.cameraType = 'WALL';
	}
	update(delta){
		// console.log(this.falling);
			// console.log(this.velocity);
		if(!this.falling){			
			this.jumpingLoop(delta);
		}else{
			this.dyingLoop(delta);
		}
		if(this.attract){
			this.attractCoins();
		}
		this.coinsCollision();
		for (var i = 0; i < this.itens.length; i++) {
			this.itens[i].update(delta)
		}
	}
}