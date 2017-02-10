import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class Collectable extends PIXI.Container{
	constructor(game){
		super();

		this.type = '';
		this.game = game;
		this.container = new PIXI.Container();
		this.addChild(this.container);
		this.velocity = {x:0, y:0}

		
	}
	build(data){

		this.data = data;
		this.radius = data.width / 2;

		this.velocity = {x:0, y:0};

		if(this.shape && this.shape.parent){
			this.shape.parent.removeChild(this.shape)
		}


	}
	add(){
		this.kill = false;
	}
	active(){
		this.kill = true;
	}
	getRadius(){		
		return this.scale.x * (this.radius * 1.2)
	}
	
	update(delta){
		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;
		if(this.toGlobal(new PIXI.Point()).y > config.height * 1.5){
			this.kill = true;
		}
	}
}