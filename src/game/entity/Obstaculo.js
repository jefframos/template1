import * as PIXI from 'pixi.js';
import utils  from '../../utils';
import config  from '../../config';
import AnimationManager  from './utils/AnimationManager';
export default class Obstaculo extends PIXI.Container {
	constructor(game){
		super();

		this.game = game;
		this.entityType = 'obstaculo'
		// this.salsicha = salsicha;
		// this.entityType = 'obstaculo'
		this.build();
	}
	build(){
		this.radius = 40;

		this.graphic = new PIXI.Graphics().beginFill(0xF95C29).drawCircle(0,0,this.radius);
		this.addChild(this.graphic);
		this.graphic.alpha = 0.3

		let image = PIXI.Sprite.fromImage('./assets/images/onion.png');

		image.anchor.set(0.5,0.6)

		this.addChild(image)

		this.velocity = {x:0, y:0};
		this.speed = {x:330, y:330};

		this.displaceAccum = 0.2;
		this.lifeTime = 1.5;




	}
	bounce(){
		this.scale.set(0.8,1.2)
    	TweenLite.to(this.scale, 0.5, {x:1, y:1, ease:'easeOutElastic'})
	}
	collide(delta,entity){
		if(entity.entityType != 'salsicha' || this.canCollide > 0){
			return
		}
		// console.log(this.dist(this.x, this.y, entity.x, entity.y));
		// console.log(this.getRadius() + entity.getRadius());
		if(!this.kill1 && !this.kill && !entity.kill1 && !entity.kill && this.dist(this.x, this.y, entity.x, entity.y) < this.getRadius() + entity.getRadius()){
			let angle = -Math.atan2(entity.y - this.y, entity.x - this.x) //* 180 / 3.14
			angle += 90 / 180 * 3.14
			this.velocity.x = Math.sin(angle) * - Math.abs(this.speed.x);
			this.velocity.y = Math.cos(angle) * - Math.abs(this.speed.y);
			//this.x += this.velocity.x * delta;
			//this.y += this.velocity.y * delta;

			if(entity.entityType == 'salsicha'){
				entity.waved(0.3);
				entity.velocity.x = -this.velocity.x * 2
				entity.velocity.y = -this.velocity.y * 2

				this.bounce();
			}
			// console.log('COLIDIU');
		}
	}
	// find distance between two points
	dist(x1,y1,x2,y2) {
	  return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
	}

	getRadius(){
		return this.radius * this.scale.x;
	}
	update(delta){

		for (var i = this.game.entityList.length - 1; i >= 0; i--) {
			this.collide(delta, this.game.entityList[i])
		}
		// this.x += this.velocity.x * delta;
		// this.y += this.velocity.y * delta;



	}
}