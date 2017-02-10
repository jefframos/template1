import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';
import Collectable from './Collectable';

export default class Portal extends Collectable{
	constructor(game){
		super(game);

		this.portalData = null;
		

	}
	build(data){
		super.build(data);

		this.type = 'TELEPORT'

		if(this.data.type.indexOf('duplicate') !== -1){
			this.type = 'DUPLICATE';
		}
		this.shape = new PIXI.Graphics().beginFill(this.type == 'TELEPORT' ? 0xFFFFFF : 0xaaaaaa).drawCircle(0,0,this.radius);
		this.addChild(this.shape)

		this.collidable = true;

		this.kill = false;
	}
	active(){
		this.kill = true;
		this.game.entryOnPortal(this);
	}
	getRadius(){
		
		return this.scale.x * (this.radius * 1.2)
	}
}