import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import EnemyModel  from './../model/EnemyModel';
import StandardEnemy  from './StandardEnemy';
export default class Ranger extends StandardEnemy {

    constructor(game, team) {
// 
        // console.log('tanker');
    	super();

        this.type = 'enemy';

        this.game = game;
        this.team = team;

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
            hp:50,
            stamina:20,
            speed:60,
            magicPower:13,
            battlePower:80,
            defense:10,
            magicDefense:120,
            xp:20
        }
        
        this.enemyModel = new EnemyModel('pump', enemyStats )


        this.actionTimer = -1;
        this.action = null;
        
        this.dynamicModel = {
            attackSpeed: 3,
            invencibleTimer:0.1
        }

        // this.build();

        // this.sprite.scale.set(this.starterScale)
    }

    build () {
        let enemieType = 'Pumpkin';
        // if(this.team == 0){
        //     enemieType = Math.random() <0.5?'Candy1':'Candy2';
        // }else{
        //     enemieType = Math.random() <0.5?'Tomato':'Potato';
        // }
        this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:enemieType+'/idle/idle00',
            totalFrames:16,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1}
        });

        this.animationModel.push({
            label:'killBack',
            src:enemieType+'/dead1/dead00',
            totalFrames:15,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'killFront',
            src:enemieType+'/dead1/dead00',
            totalFrames:15,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'hurt',
            src:enemieType+'/hurt/hurt00',
            totalFrames:13,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:5,y:1},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'attackIn',
            src:enemieType+'/attack/attack00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:38,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'attackOut',
            src:enemieType+'/attack/attack00',
            totalFrames:15,
            startFrame:8,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:38,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

          this.animationModel.push({
            label:'walk',
            src:enemieType+'/walk/walk00',
            totalFrames:18,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:12,y:0},
            anchor:{x:0.5,y:1},
            loop:true
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);
        this.animationManager.finishCallback = this.finishAnimation.bind(this);

        // this.animationContainer.addChild(this.sprite);
       
        this.speed = {x:100,y:100};
        this.velocity = {x:0,y:0};
        this.spriteVelocity = {x:0,y:0};

        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.7;
        this.gravity = 15;
        // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');
        this.radius = 80 + Math.random() * 10;
        this.externalRadius = 400 + Math.random() * 30;
        // this.debugCollision();


        // this.debugCollision();
        this.reset();
        this.start();


        // this.animationManager.showJust(['idle', 'killFront'])
        //console.log(this.attackSpeed);
    }

    attack () {
        if(!this.currentTarget || this.team == this.currentTarget.team){
            return
        }
        this.attackTimer = this.attackSpeed;

        let bulletPosition = {x:this.x, y: this.y};

        let angle = Math.atan2(this.currentTarget.y - bulletPosition.y, this.currentTarget.x - bulletPosition.x);

        // console.log(angle);
        let bulletSpeed = {x:Math.cos(angle) * 900, y:Math.sin(angle) * 900}

        let power = 60;

        let id = Math.floor(Math.random()*2)+1;
        let obj = {type:'enemy',pos:bulletPosition, velocity:bulletSpeed, lifetime:0.5, power:power, team:this.team, src:'cupcake/bullet/cherryBullet'}
        this.game.addBullet(obj);

        // console.log(obj);

        this.attacking = true;

        this.currentTarget = null
    }

    prepareAttack (entity) {
        if(this.animationManager.state == 'attack'){
            return
        }
        this.currentTarget = entity.entity

        super.prepareAttack (entity);
        // this.attacking = true;

    }
    update ( delta ) {

        if(this.disapearing){
            this.disapearTimer -= delta;
            if(this.disapearTimer <= 0){
                this.kill = true;
            }
            let value = this.disapearTimer / this.disapearTimerMax;
            this.alpha = value;
            this.animationContainer.scale.set(value * 0.5 + 0.5)
        }

        if(this.killed || !this.updateable){
            return;
        }
        // console.log(this.followTarget);
        
        if(this.invencible >= 0){
            this.invencible -= delta;
        }

        this.skipCollision --;
        if(this.skipCollision <= 0){
            this.skipCollision = Math.random() * 3 + 2;
            if(!this.attacking){
                let entityCollisions = this.game.getExternalColisionList(this,['player','tower','enemy'], true);
                // console.log(entityCollisions);
                if(entityCollisions && entityCollisions.length){
                    //if(entityCollisions[0].ableToHit || entityCollisions[0].entity.type == 'tower'){
                        if(entityCollisions[0].trueLeft){
                            this.side = 1;
                        }else{
                            this.side = -1;
                        }
                        this.prepareAttack(entityCollisions[0]);
                    //}
                }
            }
        }

        if(this.attackTimer > 0){
            this.attackTimer -= delta;
            if (this.attackTimer <= 0) {
                this.attacking = false;
            }
        }

        // console.log(this.velocity);
        if(this.actionTimer > 0){
            this.actionTimer -= delta;
            if(this.actionTimer <= 0){
                this.action();   
            }
        }

        this.animationManager.updateAnimations();

        if(this.hitTime > 0){
            this.hitTime -= delta;
            if(this.hitTime <= 0){
                this.endHit();
            }
        }


        this.updateBaseColor();
        if(this.hitting){
            return
        }

        if(this.game.worldCollision(this.x , this.y)){
            this.moveBack(delta);
            return
        }
        // console.log(this.velocity);
        this.x += this.velocity.x * delta * this.speedScale;
        this.y += this.velocity.y * delta * this.speedScale;
        // console.log(this.attacking);
        if((this.isEnemy && this.followTarget) || this.followTarget && !this.attacking){
            if(utils.distance(this.targetPosition.x, this.targetPosition.y, this.x, this.y) < this.getRadius()){
                if(!this.isEnemy){
                    this.updateWaypoints();
                }
                //this.followTarget = false;
                this.wait();
            }else{
                // console.log('MOVE');
                this.move();
            }
        }
    }   

    start ( ) {
        this.updateable = true;
        if(this.waypoints && this.waypoints[this.waypointID]){
            this.move();
            this.setTarget(this.waypoints[this.waypointID]);
        }
    }

}
