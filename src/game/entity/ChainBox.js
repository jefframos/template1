import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';
import Collectable from './Collectable';

export default class ChainBox extends Collectable{
	constructor(game, data){
		super(game, data);

		this.chain = null;
		
	}
	build(data){
		super.build(data);

		this.shape = new PIXI.Graphics().beginFill(0xFF4444).drawRect(-this.radius/2,-this.radius/2,this.radius, this.radius);
		this.addChild(this.shape)
		this.collidable = true;
	}
	active(){
		this.kill = true;
		for (var i = 0; i < this.chain.chainList.length; i++) {
			this.chain.chainList[i].show(0.1 * i, (i+1));
		}
		this.game.getChain(this);
	}
	getRadius(){
		
		return this.scale.x * (this.radius * 1.2)
	}
	
	update(delta){
		if(this.toGlobal(new PIXI.Point()).y > config.height * 1.5){
			this.kill = true;
		}
	}
}