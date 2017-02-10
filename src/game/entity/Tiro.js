import * as PIXI from 'pixi.js';
import utils  from '../../utils';
import config  from '../../config';
import AnimationManager  from './utils/AnimationManager';
export default class Tiro extends PIXI.Container {
	constructor(salsicha){
		super();
		this.salsicha = salsicha;
		this.entityType = 'tiro'
		this.build();
	}
	build(){

		this.graphic = new PIXI.Graphics().beginFill(0xF95C29).drawCircle(0,0,20);
		this.graphic.y = -35;
		this.addChild(this.graphic);
		this.graphic.alpha = 0.3
		this.graphic.scale.y = 0.5

		this.velocity = {x:0, y:0};
		this.speed = {x:350, y:350};

		this.displaceAccum = 0.2;
		this.lifeTime = 1.5;


		this.radius = 20;

		
		
		this.trailAccum = 0.1;

		this.particles = [];
		this.particlesContainer = new PIXI.ParticleContainer(500, {
		    scale: true,
		    position: true,
		    rotation: true,
		    uvs: true,
		    tint: true,
		    alpha: true
		});

		// this.graphic2 = new PIXI.Graphics().beginFill(0x666C29).drawCircle(0,0,this.radius);
		// this.addChild(this.graphic2);

		this.ignore = false;

		this.canCollide = 0.01;

		this.allCollide = false;
	}

	// find distance between two points
	dist(x1,y1,x2,y2) {
	  return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
	}

	getRadius(){
		return this.radius * this.scale.x;
	}
	applyDisplace(){
		if(!this.parent || !this.parent.parent){
			return;
		}
		this.displaceAccum = 0.2;
		this.salsicha.game.addDisplace({x:this.x, y:this.y}, this)

	}
	collide(delta,entity){
		if(entity == this || this.canCollide > 0){
			return
		}
		if(!this.allCollide && entity == this.salsicha){
			return
		}
		// console.log(this.dist(this.x, this.y, entity.x, entity.y));
		// console.log(this.getRadius() + entity.getRadius());
		if(!this.kill1 && !this.kill && !entity.kill1 && !entity.kill && this.dist(this.x, this.y, entity.x, entity.y) < this.getRadius() + entity.getRadius()){
			this.allCollide = true;
			let angle = -Math.atan2(entity.y - this.y, entity.x - this.x) //* 180 / 3.14
			angle += 90 / 180 * 3.14
			this.velocity.x = Math.sin(angle) * - Math.abs(this.speed.x);
			this.velocity.y = Math.cos(angle) * - Math.abs(this.speed.y);
			this.x += this.velocity.x * delta;
			this.y += this.velocity.y * delta;

			if(entity.entityType == 'salsicha'){
				entity.waved();
				entity.velocity.x = -this.velocity.x * 1.5
				entity.velocity.y = -this.velocity.y * 1.5
			}
			if(entity.entityType == 'obstaculo'){
				entity.bounce();
			}
			// console.log('COLIDIU');
		}
	}
	update(delta){

		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;

		// if(!this.ignore && this.dist(this.x, this.y, config.width/2, config.height/2) < 50 + 30){
		// 	let angle = -Math.atan2(config.height/2 - this.y, config.width/2 - this.x) //* 180 / 3.14
		// 	angle += 90 / 180 * 3.14
		// 	this.velocity.x = Math.sin(angle) * - Math.abs(this.speed.x);
		// 	this.velocity.y = Math.cos(angle) * - Math.abs(this.speed.y);
		// 	this.x += this.velocity.x * delta;
		// 	this.y += this.velocity.y * delta;
		// 	// this.ignore = true;
		// }
		this.canCollide -= delta;
		if(this.canCollide){
			for (var i = this.salsicha.game.entityList.length - 1; i >= 0; i--) {
				this.collide(delta, this.salsicha.game.entityList[i])
			}
		}
		// return
		this.updateParticles(delta)
		if(this.kill1){
			this.lifeTime -= delta;
			if(this.lifeTime < 0){
				this.kill = true;
				for (var i = this.particles.length - 1; i >= 0; i--) {
					this.particles[0].parent.removeChild(this.particles[0])
					this.particles.splice(0,1);
				}
				if(this.particlesContainer && this.particlesContainer.parent){
					this.particlesContainer.parent.removeChild(this.particlesContainer)
				}
				this.parent.removeChild(this);
			}

		}
		if(this.parent && !this.hasParticles){
			this.parent.addChild(this.particlesContainer);
			// this.createParticles();
		}
		this.lifeTime -= delta;
		if(this.lifeTime < 0){
			this.kill1 = true;
			this.lifeTime = 0.5;
		}
		this.displaceAccum -= delta;
		if(this.displaceAccum < 0){
			this.applyDisplace();
		}
		this.trailAccum -= delta;
		if(this.trailAccum < 0){
			this.trailAccum = 0.01;
			this.createParticles();
		}
		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;


		this.graphic.rotation = Math.atan2(this.velocity.y, this.velocity.x);

		

	}
	createParticles(){
		this.hasParticles = true;
		this.particleUpdater = 0;
		
		for (let i = 0; i < 4 * Math.random() + 2; i++)
		{
		    let particle = PIXI.Sprite.fromImage('./assets/images/particleMini.png');
		    particle.tint = 0xFF0000
		    particle.anchor.set(1, 0.5);
		    // particle.scale.set(0.05 * Math.random() + 0.025);
		    particle.scale.set(0.3 * Math.random() + 0.2);
		    let angle = Math.random() * (3.14 * 2)//- Math.atan2(this.velocity.y, this.velocity.x);
		    particle.x = this.x + Math.random() *20- 10;
		    particle.y = this.y - 35 + Math.random() *20- 10;
		    particle.alpha = 0.3;
		    particle.direction = angle;
		    particle.turningSpeed = 1;
		    particle.speed = Math.random() * 0.7 + 0.02;
		    this.particles.push(particle);
		    this.particlesContainer.addChild(particle);
		}
	}

	updateParticles(delta){
		for (var i = 0; i < this.particles.length; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction += particle.turningSpeed * 0.01;
	       	particle.position.x += Math.sin(particle.direction) * (particle.speed);
	        particle.position.y += Math.cos(particle.direction) * (particle.speed);
	        particle.rotation = -particle.direction + Math.PI;
	        particle.alpha -= delta *0.4;
	        particle.scale.x -= delta*0.2
	        particle.scale.y -= delta*0.2
		}
	}
}