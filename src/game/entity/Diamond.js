import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';
import Collectable from './Collectable';

export default class Diamond extends Collectable{
	constructor(game){
		super(game);
		this.value = 10;
	}
	build(data){
		super.build(data);
		this.shape = new PIXI.Graphics().beginFill(0x00ffff).drawCircle(0,0,this.radius);
		this.addChild(this.shape)
		this.collidable = true;
		this.kill = false;
		this.visible = true;
	}
	active(){
		this.kill = true;
		this.game.getCoin(this);
	}
	hide(){
		this.collidable = false;
		this.visible = false;
	}
	show(delay = 0){
		this.visible = true;
		this.collidable = true;
		this.shape.scale.set(0);
		TweenLite.to(this.shape.scale, 0.5, {delay:delay, x:1, y:1, ease:'easeOutElastic'})
	}
	getRadius(){
		
		return this.scale.x * this.radius
	}	
}