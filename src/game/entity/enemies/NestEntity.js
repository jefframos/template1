import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import EnemyModel  from './../model/EnemyModel';
import StandardEnemy  from './StandardEnemy';
export default class NestEntity extends StandardEnemy {

    constructor(game) {

    	super();

        this.type = 'enemy';

        this.game = game;
        this.team = -1;

        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0xffffff);
        this.roundBase.drawCircle(0,0,60);
        this.roundBase.scale.y = 0.4
        this.roundBase.alpha = 0.1;
        this.roundBase.x = 0;
        this.base.addChild(this.roundBase);

        this.addChild(this.base);
        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = -5
        this.animationContainer.y = 0
        this.addChild(this.animationContainer);


        this.actionTimer = -1;
        this.action = null;
        
            let enemyStats = {
            level:1,
            hp:300,
            stamina:40,
            speed:60,
            magicPower:13,
            battlePower:250,
            defense:20,
            magicDefense:120,
            xp:20
        }
        
        this.enemyModel = new EnemyModel('tomato', enemyStats )


        this.actionTimer = -1;
        this.action = null;
        
        this.dynamicModel = {
            attackSpeed: 1,
            invencibleTimer:0.1,
            speedUp:1.5,
        }


        // this.build();

        // this.sprite.scale.set(this.starterScale)

        this.nestCenter = {x:0,y:0};
    }

    setNestCenter (pos, radius) {
        this.nestCenter = pos;
        this.nestRadius = radius *0.9 + (Math.random() *radius*0.1);
    }
    attack () {
        super.attack();
        this.wait();
    }
    build () {
        let enemieType = 'Rock';
       
        this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:enemieType+'/idle/idle00',
            totalFrames:15,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1}
        });

        this.animationModel.push({
            label:'killBack',
            src:enemieType+'/dead1/dead00',
            totalFrames:12,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'killFront',
            src:enemieType+'/dead1/dead00',
            totalFrames:12,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'hurt',
            src:enemieType+'/hurt/hurt00',
            totalFrames:10,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:-15,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'attackIn',
            src:enemieType+'/attack/attack00',
            totalFrames:10,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:45,y:2},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'attackOut',
            src:enemieType+'/attack/attack00',
            totalFrames:23,
            startFrame:11,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:45,y:2},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

          this.animationModel.push({
            label:'walk',
            src:enemieType+'/walk/walk00',
            totalFrames:17,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:2,y:0},
            anchor:{x:0.5,y:1},
            loop:true
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);
        this.animationManager.finishCallback = this.finishAnimation.bind(this);

        // this.animationContainer.addChild(this.sprite);
       
        this.speed = {x:150,y:150};
        this.velocity = {x:0,y:0};
        this.spriteVelocity = {x:0,y:0};

        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.3 * Math.random() + 0.4;
        this.gravity = 15;
        // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');
        this.radius = 120 + Math.random() * 10;
        this.externalRadius = 500;
        // this.debugCollision();


        // this.debugCollision();
        this.reset();

        this.testCollisions = false;

        this.skipCollision = 3;
        // this.start();
    }

    setTarget (position, isEnemy) {
        if(this.attacking || this.preparingAttack){
            return
        }
        this.isEnemy = isEnemy;
        var angle = Math.random() * 360 / 180 * 3.14
        this.targetPosition.x = position.x + Math.sin(angle)*40;
        this.targetPosition.y = position.y + Math.cos(angle)*40;
        this.followTarget = true;
        // this.move();
    }
    update(delta){
        super.update(delta);

        this.skipCollision --;
        if(this.skipCollision <= 0){
            this.skipCollision = Math.random() * 3 + 2;
            if(this.testCollisions && !this.attacking){
                let entityCollisions = this.game.getExternalColisionList(this,['player'], true);
                // console.log(entityCollisions);
                if(entityCollisions && entityCollisions.length){                    
                    this.followHero(entityCollisions[0].entity);
                }
            }
            if(this.following){
                if(utils.distance(this.x,this.y,this.nestCenter.x,this.nestCenter.y) > this.nestRadius * 1.5){
                    this.following = null;
                }else{
                    this.setTarget({x:this.following.x, y:this.following.y});
                }
            }
        }
        // console.log(this.actionTimer);
    }
    followHero (target) {
        this.following = target;
    }
    wait ( ) {
        if(this.animationManager.state == 'idle'){
            return
        }
        this.attacking = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.animationManager.changeState('idle');
        
        this.actionTimer = Math.random() * 5 + 3;
        this.action = this.getNewSpot;
    }

    getNewSpot () {
        let tempAngle = Math.random() * 360 / 180 * 3.14;
        let tempRadius = Math.random() * (this.nestRadius * 0.8) + this.nestRadius * 0.2;
        let targ = {x:this.nestCenter.x+Math.sin(tempAngle) * tempRadius, y:this.nestCenter.y + Math.cos(tempAngle) * tempRadius}
        this.setTarget(targ);
        
        this.move();
    }
    move () {
        // console.log(this.attacking);
        if(this.attacking && !this.ableToMove){
            return
        }



        if(this.followTarget){

            let angle = Math.atan2(this.targetPosition.y - this.y, this.targetPosition.x - this.x);

            //console.log('follow',angle * 180 / 3.14);
            this.velocity.x = Math.cos(angle) * this.speed.x * this.dynamicModel.speedUp;
            this.velocity.y = Math.sin(angle) * this.speed.x * this.dynamicModel.speedUp;

            if(this.velocity.x < 0){
                this.side = -1;
            }else{
                this.side = 1;
            }
        }else{
            this.velocity.x = this.speed.x * this.side;
        }

        this.animationManager.changeState('walk');
    }
    start ( ) {
        this.updateable = true;

        this.getNewSpot();
        //this.setTarget(this.waypoints[this.waypointID]);
    }

}
