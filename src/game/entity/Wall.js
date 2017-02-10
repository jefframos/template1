import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class Wall extends PIXI.Container{
	constructor(game){
		super();

		this.game = game;
		this.wallContainer = new PIXI.Container();
		this.addChild(this.wallContainer);
		// console.log(bounds);
		

		this.side = 1;

		this.velocity = {x:0,y:0};


	}
	build(bounds, type = 'standard'){
		if(this.wallView && this.wallView.parent){
			this.wallView.parent.removeChild(this.wallView);
		}
		this.type = type;
		this.kill = false;
		this.starterBounds = [];
		this.bounds = [];
		for (var i = 0; i < bounds.length; i++) {
			this.starterBounds.push(bounds[i])
			this.bounds.push(bounds[i])
		}
		// this.polygon = new PIXI.Polygon(this.bounds);
		this.wallView = new PIXI.Graphics().beginFill(config.colors.wall[this.type]).drawPolygon(this.starterBounds);
		// this.wallView.alpha = 0.8
		this.wallContainer.addChild(this.wallView)

		let h = 10;
		let w = 30

		this.groundHitbounds = {x:this.x + w/2, y:this.y + h, width:this.wallView.width - w, height:h};
		this.headHitbounds = {x:this.x + w/2, y:this.y + this.wallView.height - h, width:this.wallView.width - w, height:h};
		this.hitbounds = {x:this.x, y:this.y, width:this.wallView.width, height:this.wallView.height};
	}
	getGroundHitBounds(){
		let h = 10;
		let w = 30
		this.groundHitbounds.x = this.x + w/2;
		this.groundHitbounds.y = this.y + h;
		return this.groundHitbounds//{x:this.x + w/2, y:this.y + h, width:this.wallView.width - w, height:h};
	}
	getHeadHitBounds(){
		let h = 10;
		let w = 30
		this.headHitbounds.x = this.x + w/2;
		this.headHitbounds.y = this.y + this.wallView.height - h;
		return this.headHitbounds//{x:this.x + w/2, y:this.y + this.wallView.height - h, width:this.wallView.width - w, height:h};
	}
	getBounds(){
		this.hitbounds.x = this.x;
		this.hitbounds.y = this.y;
		return this.hitbounds//{x:this.x, y:this.y, width:this.wallView.width, height:this.wallView.height};
	}
	getPolygon(){
		this.applyPolygonPosition();
		return this.polygon;
	}
	applyPolygonPosition(){
		for (var i = 0; i < this.bounds.length; i+=2) {
			this.bounds[i] = this.starterBounds[i] + this.x;
			this.bounds[i+1] = this.starterBounds[i+1] + this.y;
		}
		this.polygon = new PIXI.Polygon(this.bounds);

	}
	update(delta){
		if(this.toGlobal(new PIXI.Point()).y > config.height * 1.5){
			this.kill = true;
		}
		// this.x += this.velocity.x * delta;
		// this.y += this.velocity.y * delta;
	}
}