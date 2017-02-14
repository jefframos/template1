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

        this.ball = new Ball(50);

        this.addChild(this.ball)

        this.ball.x = config.width / 2;
        this.ball.y = config.height - 100;

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

		this.currentTrail = false;

		this.trailPool = [];
	}

	getTrail(){
		for (var i = this.trailPool.length - 1; i >= 0; i--) {
			if(this.trailPool[i].killed){
				return this.trailPool[i]
			}
		}
		let trail = new Trail(this.ingameUIContainer, 200, PIXI.Texture.from('assets/images/rainbow-flag2.jpg'));
		trail.trailTick = 15;
		trail.speed = 0.01;
		trail.frequency = 0.0001
		this.trailPool.push(trail);
		return trail;
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
		// if(this.currentTrail)
		this.verifyInterception();
		for (var i = this.trailPool.length - 1; i >= 0; i--) {
			if(!this.trailPool[i].killed && this.trailPool[i] != this.currentTrail){
				this.trailPool[i].update(delta, null);
			}
		}
		if(this.currentTrail){
			this.currentTrail.update(delta, this.mousePosition)
		}

		this.collide(delta, this.ball, this.ball2)
		this.collide(delta, this.ball, this.ball3)
		this.collideBounds(delta, this.ball)



	}
	// bkp(){
	// 	let angle = -Math.atan2(this.ball.y - this.mousePosition.y, this.ball.x - this.mousePosition.x);
	// 	angle += 90 / 180 * 3.14;
	// 	//this.ball.x = config.width / 2;
 //        //this.ball.y = config.height;

 //        this.ball.velocity.x = 0;
 //        this.ball.velocity.y = 0;
 //        this.ball.velocity.x = -this.ball.speed.x * Math.sin(angle);
 //        this.ball.velocity.y = -this.ball.speed.y * Math.cos(angle);

 //        this.ball.virtualVelocity.x = 0;
 //        this.ball.virtualVelocity.y = 0;
	// }
	inteceptCircleLineSeg(circle, line){
	    var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
	    v1 = {};
	    v2 = {};
	    v1.x = line.p2.x - line.p1.x;
	    v1.y = line.p2.y - line.p1.y;
	    v2.x = line.p1.x - circle.x;
	    v2.y = line.p1.y - circle.y;
	    b = (v1.x * v2.x + v1.y * v2.y);
	    c = 2 * (v1.x * v1.x + v1.y * v1.y);
	    b *= -2;
	    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
	    if(isNaN(d)){ // no intercept
	        return [];
	    }
	    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
	    u2 = (b + d) / c;    
	    retP1 = {};   // return points
	    retP2 = {}  
	    ret = []; // return array
	    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
	        retP1.x = line.p1.x + v1.x * u1;
	        retP1.y = line.p1.y + v1.y * u1;
	        ret[0] = retP1;
	    }
	    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
	        retP2.x = line.p1.x + v1.x * u2;
	        retP2.y = line.p1.y + v1.y * u2;
	        ret[ret.length] = retP2;
	    }       
	    return ret;
	}
	verifyInterception(){
		if(!this.tapping){
			return;
		}

		this.secPoint = {x:this.mousePosition.x,y:this.mousePosition.y};
		// console.log(this.firstPoint);
		// console.log(this.secPoint);

		let interception = this.inteceptCircleLineSeg(this.ball, {p1:this.firstPoint, p2:this.secPoint});
		// console.log(interception);
		if(interception.length < 2){
			return
		}
		this.tapping = false;
		let angleColision = -Math.atan2(interception[0].y - interception[1].y, interception[0].x - interception[1].x);
		angleColision += 90 / 180 * 3.14;
		// console.log(interception, angleColision * 180 / 3.14);
		let angle = -Math.atan2(this.firstPoint.y - this.secPoint.y, this.firstPoint.x - this.secPoint.x);
		angle += 90 / 180 * 3.14;
		//this.ball.x = config.width / 2;
        //this.ball.y = config.height;
        let angSpeed = angleColision;
        // let angSpeed = this.ball.rotation - angleColision;
        // this.ball.rotation += angleColision// * 0.5;
        let force = utils.distance(this.firstPoint.x, this.firstPoint.y, this.secPoint.x, this.secPoint.y) * 0.01
        console.log(force);
        this.ball.rotationSpeed = angSpeed * 1// * 0.5;
        this.ball.velocity.x = 0;
        this.ball.velocity.y = 0;
        this.ball.velocity.x = -this.ball.speed.x * Math.sin(angle) * force;
        this.ball.velocity.y = -this.ball.speed.y * Math.cos(angle) * force;

        this.ball.virtualVelocity.x = 0;
        this.ball.virtualVelocity.y = 0;
	}
	onTapUp(){
		this.currentTrail = null;
		this.tapping = false;
	}
	onTapDown(){
		// this.currentTrail = this.getTrail();
		// this.currentTrail.update(0, this.mousePosition)
		this.tapping = true;
		this.firstPoint = {x:this.mousePosition.x,y:this.mousePosition.y};
	}
	removeEvents(){
		this.ingameUIContainer.interactive = false;
		this.ingameUIContainer.off('touchstart').off('mousedown');
		this.ingameUIContainer.off('touchend').off('mouseup');
	}
	addEvents(){
		this.removeEvents();
		this.ingameUIContainer.interactive = true;
		this.ingameUIContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		this.ingameUIContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));
	}
	
}
