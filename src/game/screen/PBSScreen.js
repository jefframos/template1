import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Particle from '../elements/Particle'
import Mouse from '../entity/Mouse'

export default class PBSScreen extends Screen{
	screenContainer;
	background;
	logoTimer;
	constructor(label){
		super(label);
	}
	build(){
		super.build();
		
		this.listsOfParticles = [];
		this.particleList = [];
		this.snowParticleList = [];

		this.listsOfParticles.push(this.particleList);
		this.listsOfParticles.push(this.snowParticleList);
		this.setUpSnow();
		this.setUpFireplace();
		
    
	}
	
	update(delta){
		super.update(delta);
		
		this.mouse.update(delta);

		this.updateParticles(delta);

		if(this.gradeShadow.alpha > 0.1){
			this.gradeShadow.alpha -= 0.001;
		}

		
	}
	setUpSnow(){
		this.snowContainer = new PIXI.Container();
		this.addChild(this.snowContainer)

		this.snowBackground = new PIXI.Graphics();
		this.snowBackground.beginFill(0x00C3F7);
		this.snowBackground.drawRect(0,0,config.width,config.height / 2);
		this.snowContainer.addChild(this.snowBackground)
		this.snowContainer.y = config.height / 2;

		this.snowEmitter = new PIXI.Container()
		this.snowEmitter.x = 0;
		this.snowEmitter.y = 0;
		this.snowContainer.addChild(this.snowEmitter);


		this.snowBase = PIXI.Sprite.fromFrame('snowBase.png');
		this.snowBase.x = 0;
		this.snowBase.y = this.snowContainer.height  - this.snowBase.height;
		this.snowBase.width = this.snowContainer.width;
		this.snowContainer.addChild(this.snowBase);

		this.snowWind = 0;

		this.createSnow();
	}
	createSnow(){
		let params = {};
		params.particleSrc = 'snow.png'
		params.blendMode = PIXI.BLEND_MODES.NORMAL;
		let alpha = Math.random() < 0.5 ? 1 : 0.9;
		params.scale =  Math.random()*0.5 + 0.3;
		params.gravity = 0.008 + Math.random() * 0.01;
		params.velocity = {x:Math.random() * 0.5 - 0.25, y:Math.random() * 0.5 + 0.5}
		params.alphaScale = [0,alpha,alpha,alpha,alpha,alpha,0]
		params.lifetime = 5//3 + Math.random() * 3;

		let particle = new Particle(params);
		particle.x = Math.random() * config.width;
		particle.y = Math.random() * -30;
		this.snowParticleList.push(particle);
		this.snowEmitter.addChild(particle);

	}

	setUpFireplace(){

		this.fireplaceContainer = new PIXI.Container();
		this.addChild(this.fireplaceContainer)

		this.fireplaceBackground = new PIXI.Graphics();
		this.fireplaceBackground.beginFill(0xC63605);
		this.fireplaceBackground.drawRect(0,0,config.width,config.height / 2);
		this.fireplaceContainer.addChild(this.fireplaceBackground)


		this.wall1 = new PIXI.Graphics();
		this.wall1.beginFill(0x8C2003);
		this.wall1.drawRect(0,0,config.width/5,config.height / 2 - 30);
		this.fireplaceContainer.addChild(this.wall1)

		this.wall2 = new PIXI.Graphics();
		this.wall2.beginFill(0x8C2003);
		this.wall2.drawRect(0,0,config.width/5,config.height / 2 - 30);
		this.wall2.x = config.width - this.wall2.width;
		this.fireplaceContainer.addChild(this.wall2)

		this.everything = new PIXI.Container();
		this.addChild(this.everything);

		this.backFireplace = PIXI.Sprite.fromFrame('backFire.png');
		this.backFireplace.scale.set(0.5)
		this.everything.addChild(this.backFireplace);
		this.backFireplace.x = config.width / 2 - this.backFireplace.width / 2;
		this.backFireplace.y = this.fireplaceBackground.height / 2 - this.backFireplace.height / 2;

		this.fireEmitter = new PIXI.Container()
		this.fireEmitter.x = config.width / 2;
		this.fireEmitter.y = this.fireplaceBackground.height / 2 + 25;
		this.everything.addChild(this.fireEmitter);
		//this.createParticles();

		this.fireParticleAccum = 1;
		this.snowParticleAccum = 0;


		let fireTextures = [];
		for (let i = 0; i < 7; i++)
	    {
	         var texture = PIXI.Texture.fromFrame('newFire000' + (i+1) + '.png');
	         fireTextures.push(texture);
	    }

	    this.fireContainer = new PIXI.Container();
		this.fire = new PIXI.MovieClip(fireTextures);
		this.fire.animationSpeed = 0.2
		this.fire.x = - this.fire.width * 0.5;
		this.fire.y = - this.fire.height * 0.9;
		this.fire.gotoAndPlay(0);
		this.fireContainer.x = config.width / 2 - this.fire.width / 2 - this.fire.x;
		this.fireContainer.y = this.fireplaceBackground.height / 2 - 240 - this.fire.y;
		this.everything.addChild(this.fireContainer);
		this.fireContainer.addChild(this.fire);

		this.fireContainer.scale.set(0);
		this.fireContainer.rotation = 45 / 180 * 3.14

		let timeline = new TimelineLite();

		timeline.add(TweenLite.to(this.fireContainer.scale, 0.1, {x:0.8, y:0.2}));
		timeline.add(TweenLite.to(this.fireContainer.scale, 0.5, {x:0.3, y:0.7}));
		timeline.add(TweenLite.to(this.fireContainer.scale, 0.2, {x:0.5, y:0.5}));
		
		TweenLite.to(this.fireContainer, 2, {rotation:0, ease:'easeOutElastic'})


		this.wood = PIXI.Sprite.fromFrame('wood.png');
		this.wood.scale.set(0.5)
		this.everything.addChild(this.wood);
		this.wood.x = config.width / 2 - this.wood.width / 2;
		this.wood.y = this.fireplaceBackground.height / 2 - this.wood.height / 2 + 65;

		this.woodShadow = PIXI.Sprite.fromFrame('woodShadow.png');
		this.woodShadow.scale.set(0.5)
		this.everything.addChild(this.woodShadow);
		this.woodShadow.x = config.width / 2 - this.woodShadow.width / 2 - 4;
		this.woodShadow.y = this.fireplaceBackground.height / 2 + 90;


		this.tapete = PIXI.Sprite.fromFrame('tapete.png');
		this.tapete.scale.set(0.5)
		this.everything.addChild(this.tapete);
		this.tapete.x = config.width / 2 - this.tapete.width / 2;
		this.tapete.y = this.fireplaceBackground.height / 2 + 125;


		this.grade = PIXI.Sprite.fromFrame('grade.png');
		this.grade.scale.set(0.5)
		this.everything.addChild(this.grade);
		this.grade.x = config.width / 2 - this.grade.width / 2;
		this.grade.y = this.fireplaceBackground.height / 2 - this.grade.height / 2 + 78;

		this.gradeShadow = PIXI.Sprite.fromFrame('gradeShadow.png');
		this.gradeShadow.scale.set(0.5)
		this.everything.addChild(this.gradeShadow);
		this.gradeShadow.x = config.width / 2 - this.gradeShadow.width / 2 - 2;
		this.gradeShadow.y = this.fireplaceBackground.height / 2  + 108;
		this.gradeShadow.alpha = 0
		TweenLite.to(this.gradeShadow, 1, {alpha:0.2, delay:0.2});

		this.bricks1 = PIXI.Sprite.fromFrame('bricks1.png');
		this.bricks1.scale.set(0.5)
		this.everything.addChild(this.bricks1);
		this.bricks1.x = config.width / 2 - this.bricks1.width * 3;
		this.bricks1.y = this.fireplaceBackground.height / 2 - this.bricks1.height / 2;

		this.bricks2 = PIXI.Sprite.fromFrame('bricks2.png');
		this.bricks2.scale.set(0.5)
		this.everything.addChild(this.bricks2);
		this.bricks2.x = config.width / 2 + this.bricks2.width * 2;
		this.bricks2.y = this.fireplaceBackground.height / 2 - this.bricks2.height / 2;


		this.mouse = new Mouse();
		this.mouse.x = this.tapete.x + 55;
		this.mouse.y = this.tapete.y + 20;
		//this.mouse.scale.set(0.7)
		this.everything.addChild(this.mouse);

		this.everything.y =- 30
		// this.createBacklight();

		// this.createRocks();

	}
	createRocks(){

		let direction = Math.random() < 0.5 ? 1:-1;
		let params = {};
		params.particleSrc = 'rock.png'
		params.blendMode = PIXI.BLEND_MODES.NORMAL;
		params.tint = 0x333333
		params.scale = 0.5
		params.gravity = 0.15
		params.rotationSpeed = 0.1 * direction
		params.scaleIncrease = {x:0.002, y:0.002};
		params.velocity = {x:(Math.random() * 2 + 2) * (direction), y:-Math.random() * 2 - 3}
		params.alphaScale = [1,1,1,1,0]
		params.lifetime = 1//3 + Math.random() * 3;

		
		let particle = new Particle(params);
		//particle.x = Math.random() * 120 - (60 * -direction)
		particle.y = -20
		this.particleList.push(particle);
		this.fireEmitter.addChild(particle);


		// this.gradeShadow.alpha = 0.3;	
	}
	createBacklight(){
		if(Math.random() < 0.05)
			this.createRocks();
		let params = {};
		params.tint = 0xFFF100
		params.scale = 8 + 5*Math.random();
		params.velocity = {x:0, y:-Math.random() * 0.5}
		params.alphaScale = [0,0.2,0]
		params.lifetime = 1+Math.random()*3//3 + Math.random() * 3;

		let particle = new Particle(params);
		//particle.x = Math.random() * 120 - 60
		this.particleList.push(particle);
		this.fireEmitter.addChild(particle);

		TweenLite.to(this.gradeShadow, 0.2, {alpha:0.3});
	}
	createParticles(){
		let particle = new Particle();
		particle.x = Math.random() * 120 - 60
		this.particleList.push(particle);
		this.fireEmitter.addChild(particle);		
	}

	updateParticles(delta){
		this.fireParticleAccum -= delta;
		this.snowParticleAccum -= delta;
		if(this.fireParticleAccum < 0){
			this.createBacklight();
			this.fireParticleAccum = 0.7;
		}

		if(this.snowParticleAccum < 0){
			for (var i = Math.random() * 8 + 5; i >= 0; i--) {				
				this.createSnow();
			}
			this.snowParticleAccum = 1.3;
		}
		
		for (var i = this.listsOfParticles.length - 1; i >= 0; i--) {
			for (var j = this.listsOfParticles[i].length - 1; j >= 0; j--) {
				this.listsOfParticles[i][j].update(delta);
			}
			for (var j = this.listsOfParticles[i].length - 1; j >= 0; j--) {
				if(this.listsOfParticles[i][j].kill){
					this.listsOfParticles[i].splice(j,1);
				}
			}
		}
		this.snowWind += 2 * Math.random();
		let sinWind = Math.sin(this.snowWind* 3.14 / 180) ;
		for (var i = this.snowParticleList.length - 1; i >= 0; i--) {

			if(this.snowParticleList[i].y >= this.snowBackground.height - this.snowParticleList[i].height){//this.snowParticleList[i].height*1.5){
				this.snowParticleList[i].gravity = 0;
				this.snowParticleList[i].velocity = {x:0, y:0.15};
				this.snowParticleList[i].scaleIncrease = {x:0.01, y:-0.01};
			}else{
				this.snowParticleList[i].velocity.x = sinWind * (500* this.snowParticleList[i].gravity * (this.snowParticleList[i].scale.x * 1.75) ) * delta// * this.snowParticleList[i].gravity;
			}			
		}
	}
}
