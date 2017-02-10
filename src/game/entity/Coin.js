import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';
import Collectable from './Collectable';

export default class Coin extends Collectable{
	constructor(game){
		super(game);

		this.value = 1;

		this.type = 'COIN'
		
	}
	build(data){
		super.build(data);
		this.shape = new PIXI.Graphics().beginFill(0xFFFF63).drawCircle(0,0,this.radius);
		this.addChild(this.shape)
		this.collidable = true;

	}
	active(){
		this.kill = true;
		this.game.getCoin(this);
	}
	getRadius(){
		
		return this.scale.x * (this.radius * 1.2)
	}
}