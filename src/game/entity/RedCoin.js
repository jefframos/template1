import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';
import Collectable from './Collectable';

export default class RedCoin extends Collectable{
	constructor(game){
		super(game);


	}
	build(data){
		super.build(data);
		this.value = 1;
		this.shape = new PIXI.Graphics().beginFill(0xFF4444).drawCircle(0,0,this.radius);
		this.addChild(this.shape)
		this.collidable = false;
		this.hide();
	}
	hide(){
		this.visible = false;
	}
	show(delay = 0, order = 1){
		this.order = order;
		this.visible = true;
		this.collidable = true;
		this.shape.scale.set(0);
		TweenLite.to(this.shape.scale, 0.5, {delay:delay, x:1, y:1, ease:'easeOutElastic'})
	}
	active(){
		this.kill = true;
		this.game.getChainCoin(this);
	}
	getRadius(){
		
		return this.scale.x * (this.radius * 1.2)
	}
	
}