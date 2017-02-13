import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Ball from '../entity/Ball'
import AnimationManager  from '../entity/utils/AnimationManager';
import Trail from '../entity/Trail';

export default class InitScreen extends Screen{	
	constructor(label){
		super(label);
	}
	build(){
		super.build();

		this.backgroundContaier = new PIXI.Container();
		this.addChild(this.backgroundContaier);

		this.background = new PIXI.Graphics();
		this.background.beginFill(0xababab);
	    this.background.drawRect( 0, 0, config.width, config.height);
		this.backgroundContaier.addChild(this.background);

		this.animationContainer = new PIXI.Container();
		// this.addChild(this.animationContainer)

		this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:'players/dead/dead00',
            totalFrames:9,
            startFrame:0,
            animationSpeed:0.2,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.5}
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer)
        // this.animationManager.finishCallback = this.finishAnimation.bind(this);
        // this.animationManager.startCallback = this.startAnimation.bind(this);
        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        this.ball = new Ball();

        this.addChild(this.ball)

        this.ball.x = config.width / 2;
        this.ball.y = config.height;

        // this.ball.velocity.y = -this.ball.speed.y;
        // this.ball.virtualVelocity.x = 0;
        // this.ball.virtualVelocity.y = 0;

        this.ball2 = new Ball();

        this.addChild(this.ball2)

        this.ball2.x = 200;
        this.ball2.y = 400;


        this.ball3 = new Ball();

        this.addChild(this.ball3)

        this.ball3.x = 400;
        this.ball3.y = 600;

        this.ingameUIContainer = new PIXI.Container();
		this.addChild(this.ingameUIContainer);

		this.backgroundIngameUI = new PIXI.Graphics().beginFill(0x023548).drawRect(0,0,config.width, config.height);
		this.backgroundIngameUI.alpha = 0;
		this.ingameUIContainer.addChild(this.backgroundIngameUI)

		this.addEvents();

		this.mouseTrail = new Trail(this.ingameUIContainer, 20, PIXI.Texture.from('assets/images/rainbow-flag2.jpg'))
	}

	collideBounds(delta, entity){

		if(entity.velocity.x > 0){
			if(entity.x > config.width){
				entity.velocity.x *= -1;
				entity.x += entity.velocity.x * delta;
			}
		}else if(entity.velocity.x < 0){
			if(entity.x < 0){
				entity.velocity.x *= -1;
				entity.x += entity.velocity.x * delta
			}
		}

		if(entity.velocity.y > 0){
			if(entity.y > config.height){
				entity.velocity.y *= -1;
				entity.y += entity.velocity.y * delta;
			}
		}else if(entity.velocity.y < 0){
			if(entity.y < 0){
				entity.velocity.y *= -1;
				entity.y += entity.velocity.y * delta;
			}
		}
	}

	collide(delta, entity, toCollide){
		if(utils.distance(toCollide.x, toCollide.y, entity.x, entity.y) < toCollide.getRadius() + entity.getRadius()){
			let angle = -Math.atan2(toCollide.y - entity.y, toCollide.x - entity.x);
			angle += 90 / 180 * 3.14;
			let percent = (Math.abs(entity.velocity.x) + Math.abs(entity.velocity.y))/(Math.abs(entity.speed.x) + Math.abs(entity.speed.y))
			entity.velocity.x = Math.sin(angle) * - Math.abs(entity.speed.x * percent);
			entity.velocity.y = Math.cos(angle) * - Math.abs(entity.speed.y * percent);
		}
	}
	
	update(delta){
		super.update(delta);


		this.mousePosition = renderer.plugins.interaction.mouse.global;
		this.mouseTrail.update(delta, this.mousePosition)

		this.collide(delta, this.ball, this.ball2)
		this.collide(delta, this.ball, this.ball3)
		this.collideBounds(delta, this.ball)



	}

	onTapDown(){

		let angle = -Math.atan2(this.ball.y - this.mousePosition.y, this.ball.x - this.mousePosition.x);
		angle += 90 / 180 * 3.14;
		//this.ball.x = config.width / 2;
        //this.ball.y = config.height;

        this.ball.velocity.x = 0;
        this.ball.velocity.y = 0;
        this.ball.velocity.x = -this.ball.speed.x * Math.sin(angle);
        this.ball.velocity.y = -this.ball.speed.y * Math.cos(angle);

        this.ball.virtualVelocity.x = 0;
        this.ball.virtualVelocity.y = 0;
	}
	removeEvents(){
		this.ingameUIContainer.interactive = false;
		this.ingameUIContainer.off('touchstart').off('mousedown');
		// this.ingameUIContainer.off('touchend').off('mouseup');
	}
	addEvents(){
		this.removeEvents();
		this.ingameUIContainer.interactive = true;
		this.ingameUIContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		// this.ingameUIContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));
	}
	
}
