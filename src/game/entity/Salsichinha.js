import * as PIXI from 'pixi.js';
import utils  from '../../utils';
import config  from '../../config';
import AnimationManager  from './utils/AnimationManager';
import Tiro  from './Tiro';
export default class Salsichinha extends PIXI.Container{

    constructor(game, input, type) {
    	super();

    	this.inputID = input;
    	this.type = type;
    	this.entityType = 'salsicha'
    	console.log('SALSICHA');
    	this.game = game;

		this.motionContainer = new PIXI.Container();

		this.animationContainerBody = new PIXI.Container();
		this.animationContainerHead = new PIXI.Container();

		this.motionContainer.pivot.y = -200
		// this.motionContainer.y = 200
        // this.animationContainer.x = -5
        // this.animationContainer.y = 0
        this.addChild(this.motionContainer);
        this.motionContainer.addChild(this.animationContainerBody);
        this.motionContainer.addChild(this.animationContainerHead);

        // this.motionContainer.y = 50
        this.motionContainer.y = -150

        this.radius = 40;

        this.graphic = new PIXI.Graphics().beginFill(0x000000).drawCircle(0,0,30);
		this.addChild(this.graphic);

		this.graphic.y = 35
		this.graphic.x = 3

		this.graphic.scale.y = 0.5;
		this.graphic.alpha = 0.1;

		this.canAttack = 0;
		this.deadTimer = 0;

		this.startPoint = null;

        this.build();

        // this.reset();
    }
    waved(value = 0.5){
    	this.inWave = value;
    }
    build(){

    	this.types = ['players/karayo/','players/pyrok/','players/kasseT/']
    	// let enemieType = 'players/pyrok/';

    	let enemieType = this.types[this.type];
    	// let enemieType = 'players/kasseT/';

    	this.enemyType = enemieType;
    	this.animationModelBody = [];
        this.animationModelBody.push({
            label:'runLD',
            src:enemieType+'run/runLD00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1}
        });
        if(enemieType == 'players/kasseT/'){
        	this.animationModelBody[this.animationModelBody.length - 1].position.x = 2;
        	this.animationModelBody[this.animationModelBody.length - 1].position.y = 0;
        }

        this.animationModelBody.push({
            label:'runL',
            src:enemieType+'run/runL00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:6,y:0},
            anchor:{x:0.5,y:1}
        });

        this.animationModelBody.push({
            label:'runLU',
            src:enemieType+'run/runLU00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:4,y:0},
            anchor:{x:0.5,y:1}
        });

        this.animationModelBody.push({
            label:'dead',
            src:'players/dead/dead00',
            totalFrames:9,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:4,y:0},
            anchor:{x:0.5,y:1},
            haveCallback:true,
            loop:false
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelBody[this.animationModelBody.length - 1].position.x = 2;
        	this.animationModelBody[this.animationModelBody.length - 1].position.y = 0;
        }
        if(enemieType == 'players/pyrok/'){
        	this.animationModelBody[this.animationModelBody.length - 1].position.x = 2;
        	this.animationModelBody[this.animationModelBody.length - 1].position.y = 0;
        }

        this.animationModelBody.push({
            label:'idleLD',
            src:enemieType+'idle/idleLD',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:-10},
            anchor:{x:0.5,y:1},
            singleFrame:true,
            haveCallback: false
        });

        this.animationModelBody.push({
            label:'idleL',
            src:enemieType+'idle/idleL',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:6,y:-10},
            anchor:{x:0.5,y:1},
            singleFrame:true,
            haveCallback: false
        });

        this.animationModelBody.push({
            label:'idleLU',
            src:enemieType+'idle/idleLU',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:3,y:-10},
            anchor:{x:0.5,y:1},
            singleFrame:true,
            haveCallback: false
        });
        if(enemieType == 'players/kasseT/'){
        	this.animationModelBody[this.animationModelBody.length - 1].position.x = 2;
        	this.animationModelBody[this.animationModelBody.length - 1].position.y = -10;
        }
        if(enemieType == 'players/pyrok/'){
        	this.animationModelBody[this.animationModelBody.length - 1].position.x = 2;
        	this.animationModelBody[this.animationModelBody.length - 1].position.y = -10;
        }

        this.animationManagerBody = new AnimationManager(this.animationModelBody, this.animationContainerBody);
        this.animationManagerBody.finishCallback = this.finishAnimation.bind(this);

        this.animationManagerBody.hideAll();
        this.animationManagerBody.stopAll();
        this.animationManagerBody.changeState('runLU');

		// this.animationContainerBody.scale.x = -1
		// this.animationContainerBody.x = -5

        this.animationModelHead = [];

        this.animationModelHead.push({
            label:'headU',
            src:enemieType+'head/headU00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1}
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 0.5;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }else if(enemieType == 'players/pyrok/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = -0.5;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }

        this.animationModelHead.push({
            label:'headLU',
            src:enemieType+'head/headLU00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:13,y:0},
            anchor:{x:0.5,y:1}
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 21;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }else if(enemieType == 'players/pyrok/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 15;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }

        this.animationModelHead.push({
            label:'headLD',
            src:enemieType+'head/headLD00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:13,y:0},
            anchor:{x:0.5,y:1}
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 21;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }else if(enemieType == 'players/pyrok/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 15;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }

        this.animationModelHead.push({
            label:'headD',
            src:enemieType+'head/headD00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1}
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 0;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }

        this.animationModelHead.push({
            label:'headL',
            src:enemieType+'head/headL00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:15.5,y:0},
            anchor:{x:0.5,y:1}
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 23;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 0;
        }

        this.animationModelHead.push({
            label:'attackU',
            src:enemieType+'attack/attackU00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:-4,y:22},
            anchor:{x:0.5,y:1},
            haveCallback:true,
            loop:false
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = -4;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 25;
        }

        this.animationModelHead.push({
            label:'attackLU',
            src:enemieType+'attack/attackLU00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:5,y:26},
            anchor:{x:0.5,y:1},
            haveCallback:true,
            loop:false
        });

         if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 6;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 25;
        }

        this.animationModelHead.push({
            label:'attackLD',
            src:enemieType+'attack/attackLD00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:2,y:26},
            anchor:{x:0.5,y:1},
            haveCallback:true,
            loop:false
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 6;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 25;
        }else if(enemieType == 'players/pyrok/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 4;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 26;
        }

        this.animationModelHead.push({
            label:'attackD',
            src:enemieType+'attack/attackD00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:-4,y:23},
            anchor:{x:0.5,y:1},
            haveCallback:true,
            loop:false
        });



        this.animationModelHead.push({
            label:'attackL',
            src:enemieType+'attack/attackL00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:-4,y:27},
            anchor:{x:0.5,y:1},
            haveCallback:true,
            loop:false
        });

        if(enemieType == 'players/kasseT/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = 6;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 25;
        }else if(enemieType == 'players/pyrok/'){
        	this.animationModelHead[this.animationModelHead.length - 1].position.x = -2;
        	this.animationModelHead[this.animationModelHead.length - 1].position.y = 26;
        }

        this.animationManagerHead = new AnimationManager(this.animationModelHead, this.animationContainerHead);
        this.animationManagerHead.finishCallback = this.finishAnimationHead.bind(this);

        this.animationManagerHead.hideAll();
        this.animationManagerHead.stopAll();
        this.animationManagerHead.changeState('headD');

        

        // this.animationManagerBody.showJust(['runLD','dead'])

        this.animationContainerHead.y = -106

		this.headPosition = 'headD';
		this.bodyPosition = 'runLD';

		this.speed = {x:250, y:250}
		this.velocity = {x:0, y:0}

		this.headAngleType = 'D'
		this.time = 0;
		this.inWave = 0;
		this.currentAttackAngle = 90

		this.kills = 0;
		// this.bulletList = [];

    }

    getRadius(){
		return this.radius * this.scale.x;
	}

    attack () {
    	if(this.canAttack > 0){
    		return
    	}
    	this.canAttack = 0.5;
    	let tiro = new Tiro(this);
    	let tempAngle = this.currentAttackAngle - 90;
    	tempAngle = tempAngle/ 180 * 3.14 * -1;
    	tiro.velocity.x = Math.sin(tempAngle) * tiro.speed.x
    	tiro.velocity.y = Math.cos(tempAngle) * tiro.speed.y

    	this.game.entityList.push(tiro);

    	this.game.entityContainer.addChild(tiro);
    	tiro.x = this.x;
    	tiro.y = this.y;

    	// console.log(tiro.velocity, tiro.x, tiro.y, this.parent);

    	// console.log('attack');
    	this.headPosition = 'attack' + this.headAngleType;

    	// console.log(this.headPosition);
    	this.attacking = true;
    	this.updateHead();
    }
    dist(x1,y1,x2,y2) {
	  return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
	}
    reset () {
    	this.animationContainerHead.visible = true;


    	this.x = this.startPoint.x;
    	this.y = this.startPoint.y;
    	this.velocity = {x:0, y:0};
    	this.died = false;
    	this.kill1 = false;
    	this.motionContainer.scale.set(0)
    	TweenLite.to(this.motionContainer.scale, 0.5, {x:1, y:1, ease:'easeOutElastic'})
    }
    die () {
    	this.animationManagerBody.changeState('dead');

    	this.animationContainerHead.visible = false;

    	this.died = true;

    	this.deadTimer = 1;

    	this.kill1 = true;

    	this.kills ++;

    }
    collideWorld () {
    	if(this.died){
    		return
    	}
    	if(this.dist(this.x,this.y, config.width/2, config.height/2) > 460){
    		this.die();
    	}
    }
    update (delta) {
    	if(this.died){
    		this.deadTimer -= delta;
    		if(this.deadTimer<0){
    			this.reset();
    		}
    		return
    	}
    	this.time+=delta
    	this.inWave-=delta
    	// console.log(this.time);
    	this.canAttack -= delta;
    	this.x += this.velocity.x * delta;
    	this.y += this.velocity.y * delta;
    	this.animationManagerHead.updateAnimations();

    	this.collideWorld();
    }
    updateInputs (input) {
    	if(this.died){
    		return
    	}
    	if(this.inWave > 0){
    		return
    	}
    	// console.log(input);
    	this.velocity.x = this.speed.x * input[0];
    	this.velocity.y = this.speed.y * input[1];

    }
    updateBodyPosition () {
    	if(this.died){
    		return
    	}
    	let angle = Math.atan2(this.velocity.y, this.velocity.x);
    	angle = angle * 180 / 3.14;
    	// console.log(angle, this.y, mousePosition.y);

    	// console.log(Math.abs(this.velocity.y) + Math.abs(this.velocity.x));
    	if(Math.abs(this.velocity.y) + Math.abs(this.velocity.x) == 0){
    		this.stopAnimation();
    		return
    	}
    	if(angle > -160 && angle < -120){
    		this.bodyPosition = 'runLU';
    	}
    	else if(angle > -120 && angle < -60){
    		if(this.velocity.x > 0){
    			this.bodyPosition = 'runLU';
    		}else{
    			this.bodyPosition = 'runRU';
    		}
    	}
    	else if(angle > -60 && angle < -30){
    		this.bodyPosition = 'runRU';
    	}
    	else if(angle > -30 && angle < 30){
    		this.bodyPosition = 'runR';
    	}
    	else if(angle > 30 && angle < 60){
    		this.bodyPosition = 'runRD';
    	}else if(angle < 120 && angle > 60){
    		if(this.velocity.x > 0){
    			this.bodyPosition = 'runLD';
    		}else{
    			this.bodyPosition = 'runRD';
    		}
    	}
    	else if(angle < 160 && angle > 120){
    		this.bodyPosition = 'runLD';
    	}else{
    		this.bodyPosition = 'runL';
    	}

    	// console.log(this.bodyPosition);
    	this.updateLegs();

    }
    stopAnimation () {
    	this.bodyPosition = this.bodyPosition.replace('run', 'idle');
    	this.updateLegs();
    }
    updateHeadAnimation (angle) {
    	if(this.died){
    		return
    	}
    	// this.headAngleType = 
    	this.currentAttackAngle = 0;
    	this.animationContainerBody.parent.setChildIndex(this.animationContainerBody, 0);

    	if(angle > -160 && angle < -120){
    		this.currentAttackAngle = -140;
    		// this.headPosition = 'headLU';
    		this.headAngleType = 'LU';
    		this.animationContainerHead.parent.setChildIndex(this.animationContainerHead, 0);
    	}
    	else if(angle > -120 && angle < -60){
    		this.currentAttackAngle = -90;

    		// this.headPosition = 'headU';
    		this.headAngleType = 'U';
    		this.animationContainerHead.parent.setChildIndex(this.animationContainerHead, 0);
    	}
    	else if(angle > -60 && angle < -30){
    		this.currentAttackAngle = -45;

    		// this.headPosition = 'headRU';
    		this.headAngleType = 'RU';
    		this.animationContainerHead.parent.setChildIndex(this.animationContainerHead, 0);

    	}
    	else if(angle > -30 && angle < 30){
    		this.currentAttackAngle = 0;

    		// this.headPosition = 'headR';
    		this.headAngleType = 'R';
    	}
    	else if(angle > 30 && angle < 60){
    		this.currentAttackAngle = 45;

    		// this.headPosition = 'headRD';
    		this.headAngleType = 'RD';
    	}else if(angle < 120 && angle > 60){
    		this.currentAttackAngle = 90;

    		// this.headPosition = 'headD';
    		this.headAngleType = 'D';
    	}
    	else if(angle < 160 && angle > 120){
    		this.currentAttackAngle = 140;

    		// this.headPosition = 'headLD';
    		this.headAngleType = 'LD';
    	}else{
    		this.currentAttackAngle = -180;
    		// this.headPosition = 'headL';
    		this.headAngleType = 'L';
    	}

    	this.headPosition = 'head' + this.headAngleType;
    	this.updateHead();

    }
    updateHeadPositionController (mousePosition) {
    	if(this.died){
    		return
    	}
    	if(mousePosition[1] == 0 && mousePosition[0] == 0){
    		return
    	}
    	let angle = Math.atan2(mousePosition[1],  mousePosition[0] );
    	angle = angle * 180 / 3.14;
    	
    	this.updateHeadAnimation(angle);
    	
    }
    updateHeadPosition (mousePosition) {
    	if(this.died){
    		return
    	}
    	if(mousePosition.x == 0 && mousePosition.y == 0){
    		return
    	}
    	// console.log(mousePosition);
    	let angle = Math.atan2(mousePosition.y - this.y, mousePosition.x - this.x);
    	angle = angle * 180 / 3.14;

    	this.updateHeadAnimation(angle);

    }
    updateHead ( ) {
    	if(this.died){
    		return
    	}
    	let side = this.headPosition;
    	if(this.animationManagerHead.state.indexOf('attack') !== -1 && this.attacking){

    		return
    	}
    	if(side.indexOf('R') !== -1){
    		this.animationContainerHead.scale.x = -1
    		if(this.enemyType == 'players/kasseT/'){
        		this.animationContainerHead.x = -3
    		}else if(this.enemyType == 'players/pyrok/'){
        		this.animationContainerHead.x = -6
    		}else{
        		this.animationContainerHead.x = -5
    		}
    		
    	}else{
    		this.animationContainerHead.scale.x = 1
        	this.animationContainerHead.x = 0
    	}
    	side = side.replace('R', 'L');

    	this.animationManagerHead.changeState(side, this.attacking );
    }


    updateLegs ( ) {
    	if(this.died){
    		return
    	}
    	let side = this.bodyPosition//this.bodyAnimationList[Math.floor(Math.random() * this.bodyAnimationList.length)];
    	// console.log(side);
    	// console.log(side);
    	if(side.indexOf('R') !== -1){
    		this.animationContainerBody.scale.x = -1
        	if(this.enemyType == 'players/kasseT/'){
        		this.animationContainerBody.x = -3
    		}else if(this.enemyType == 'players/pyrok/'){
        		this.animationContainerBody.x = -5
    		}else{
        		this.animationContainerBody.x = -5
    		}
    	}else{
    		this.animationContainerBody.scale.x = 1
        	this.animationContainerBody.x = 0
    	}
    	side = side.replace('R', 'L');
    	this.animationManagerBody.changeState(side);
    }


    endAttack ( ) {
    	this.headPosition = 'head' + this.headAngleType;
        this.attacking = false;
    	this.updateHead();
    }
    finishAnimationHead ( ) {
        if(this.animationManagerHead.state.indexOf('attack') !== -1){
        	this.endAttack();
        }        
    }

    finishAnimation ( ) {
    
        if(this.animationManagerBody.state == 'headLD'){
           
        }        
    }
}