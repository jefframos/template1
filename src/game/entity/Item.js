import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';
import Collectable from './Collectable';

export default class Item extends Collectable{
	constructor(game){
		super(game);
		
	}
	
	build(data){
		super.build(data);

		this.shape = new PIXI.Graphics().beginFill(0x00FF63).drawCircle(0,0,this.radius);
		this.addChild(this.shape)

		this.collidable = true;

		this.timer = 0;

		this.kill = false;
	}
	setPlayer(player){
		this.player = player;
	}
	active(){
		this.kill = true;
		this.isActive = true;
		this.game.getItem(this);
		this.timer = 10;
	}
	getRadius(){		
		return this.scale.x * (this.radius * 1.2)
	}
	
	update(delta){
		if(this.timer <= 0){
			if(this.toGlobal(new PIXI.Point()).y > config.height * 1.5){
				console.log('killhere');
				this.kill = true;
				this.isActive = false;
			}
		}else{
			this.timer -= delta;
			if(this.timer <= 0){
				this.isActive = false;
				this.player.removeItem(this);
			}
		}
	}
}