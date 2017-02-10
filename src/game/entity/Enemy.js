import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class Enemy extends PIXI.Container{
	constructor(game){
		super();

		this.game = game;
		this.container = new PIXI.Container();
		this.addChild(this.container);

	}
	build(data){

		if(this.sprite && this.sprite.parent){
			this.sprite.parent.removeChild(this.sprite);
		}

		// console.log(data);
		let texture = PIXI.Texture.fromFrame('enemy.png');
	    this.sprite = new PIXI.Sprite(texture);
	    this.sprite.anchor.set(0.22,0.5)
		this.kill = false;
		this.radius = data.width / 2;

		this.scl = this.radius / (this.sprite.height * 0.75 );
// console.log(this.scl);
		this.sprite.scale.set(this.scl);
		// this.shape = new PIXI.Graphics().lineStyle(1,0x990000).drawCircle(0,0,this.radius);
		// this.addChild(this.shape)
		this.addChild(this.sprite)
		this.velocity = {x:0, y:0};
		this.gravity = 1500;
		this.collidable = true;
		this.rotation = 0;
		this.side = {x:1, y:1};
		if(data.gid >= 3221225474){ //verticalHorizontal
			this.side.x = -1;
			//this.side.y = -1;
			this.rotation = -3.17/2;
		}
		else if(data.gid >= 2147483650){//horizontal

			this.side.x = -1;
		}
		else if(data.gid >= 1073741826){ //vertical

			this.rotation = -3.17/2;
		}
		this.sprite.scale.x *= this.side.x;
		// this.sprite.scale.y *= this.side.y;

	}
	die(speed){
		this.velocity.x = speed.x;
		this.velocity.y = - 500;
		this.collidable = false;
	}
	getRadius(){
		
		return this.scale.x * this.radius
	}
	
	update(delta){
		if(this.velocity.y != 0){
			this.velocity.y += this.gravity * delta;
		}
		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;
		if(this.toGlobal(new PIXI.Point()).y > config.height * 1.5){
			this.kill = true;
		}
	}
}