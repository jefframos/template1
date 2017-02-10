import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import EnemyModel  from './../model/EnemyModel';
import StandardEnemy  from './StandardEnemy';
export default class Bomber extends StandardEnemy {

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
            level:3,
            hp:500,
            stamina:40,
            speed:60,
            magicPower:13,
            battlePower:250,
            defense:50,
            magicDefense:120,
            xp:20
        }
        
        this.enemyModel = new EnemyModel('bomber', enemyStats )


        this.actionTimer = -1;
        this.action = null;
        
        this.dynamicModel = {
            attackSpeed: 3,
            invencibleTimer:0.2
        }

        // this.build();

        // this.sprite.scale.set(this.starterScale)
    }

    build () {
        let enemieType = 'Chilli';
        // if(this.team == 0){
        //     enemieType = Math.random() <0.5?'Candy1':'Candy2';
        // }else{
        //     enemieType = Math.random() <0.5?'Tomato':'Potato';
        // }
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
            totalFrames:13,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:-100,y:3},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'killFront',
            src:enemieType+'/dead1/dead00',
            totalFrames:13,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:-100,y:3},
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
            position:{x:-30,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'hurt1',
            src:enemieType+'/hurt/hurt00',
            totalFrames:10,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:-30,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'attackIn',
            src:enemieType+'/attack/attack00',
            totalFrames:13,
            startFrame:0,
            animationSpeed:0.2,
            movieClip:null,
            position:{x:10,y:9},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'charged',
            src:enemieType+'/attack/attack00',
            totalFrames:13,
            startFrame:12,
            animationSpeed:0.2,
            movieClip:null,
            position:{x:10,y:9},
            anchor:{x:0.5,y:1},
            loop:true
        });

        this.animationModel.push({
            label:'attackOut',
            src:enemieType+'/attack/attack00',
            totalFrames:22,
            startFrame:14,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:10,y:9},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

          this.animationModel.push({
            label:'walk',
            src:enemieType+'/walk/walk00',
            totalFrames:19,
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
       
        this.speed = {x:100,y:100};
        this.velocity = {x:0,y:0};
        this.spriteVelocity = {x:0,y:0};

        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.75;
        this.gravity = 15;
        // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');
        this.radius = 80;
        this.externalRadius = 200;
        // this.debugCollision();


        // this.debugCollision();
        this.reset();
        this.start();

        this.charging = false;

 // this.animationManager.showJust(['idle','attackIn'])
        //console.log(this.attackSpeed);
    }

    hit(power, forceSide) {

        if(this.life < 0 || this.invencible > 0 || this.attacking){// || this.attacking){
            return false;
        }




        let calcPower = this.enemyModel.getHurt(power);

        // this.wait();

        this.invencible = this.dynamicModel.invencibleTimer;

        this.hitting = true;
        this.hitTime = 0.3;

        this.life -= calcPower;

        // console.log(this.life);

        if(!this.completeCharge){
            if(this.life <= this.maxLife * 0.75 && !this.charging){
                this.animationManager.changeState('hurt', true);
            }else{
                this.animationManager.changeState('hurt1');
            }
        }

        

        if(forceSide){
            this.side = forceSide;
        }

        if(this.life <= 0){
            this.dead();
            return 'DEAD';
        }

        this.updateLifeBar();
        return true;
    }

    explode ( ) {
        this.removeLifeBar();
        let entityCollisions = this.game.getExternalColisionList(this,['enemy', 'player', 'tower'], true);

        for (var i = 0; i < entityCollisions.length; i++) {
            entityCollisions[i].entity.hit(this.enemyModel.getDemage());
        }
    }
    finishAnimation ( ) {
    
        if(this.animationManager.state == 'attackOut'){
            if(!this.disapearing){
                this.explode();
            }
            this.disapearing = true;
            // this.ableToMove = true;
            //this.prepareAttack();
            return
        }
        if(this.animationManager.state == 'hurt'){
            // this.ableToMove = true;
            this.prepareAttack();
            return
        }
        if(this.animationManager.state == 'attackIn'){
            // this.animationManager.changeState('attackOut', true);
            this.charged();
            // this.attack();
            return;

        }
        if(this.animationManager.state == 'killFront' || this.animationManager.state == 'killBack'){
            this.killed = true;
            return;
        }

        // this.updateWaypointsSame();
        this.animationManager.changeState('idle', true);
        // this.attacking = false;
        this.preparingAttack = false;
    }

    charged(){
        this.animationManager.changeState('charged', true);
        this.completeCharge = true;
        this.chargeTime = 1;
        this.chargeScale = 0.2;
    }
    attack(){
        this.attacking = true;
        if(this.animationManager.state == 'attackOut'){
            return
        }

        this.velocity = {x:0,y:0};

        this.rotation = 0;
        this.animationManager.changeState('attackOut');
    }
    prepareAttack(){

        this.animationManager.changeState('attackIn', true);
        this.charging = true;

    }
    endHit(){
        this.hitting = false;
        this.hitTime = -1;

        
        // this.animationManager.changeState('attackIn', true);
    }


    start ( ) {
        this.updateable = true;
        if(this.waypoints && this.waypoints[this.waypointID]){
            this.move();
            this.setTarget(this.waypoints[this.waypointID]);
        }
    }


    update ( delta ) {

        if(this.disapearing){
            this.collidable = false;
            this.disapearTimer -= delta;
            if(this.disapearTimer <= 0){
                this.kill = true;
            }
            let value = this.disapearTimer / this.disapearTimerMax;
            this.alpha = value;
            //this.animationContainer.scale.set(value * 0.5 + 0.5)
        }

        if(this.killed || !this.updateable){
            return;
        }

        if(this.completeCharge){
            if(this.chargeTime > 0){
                this.velocity = {x:0,y:0};
                this.chargeTime -= delta;
                this.animationContainer.scale.x += this.chargeScale * delta;
                this.animationContainer.scale.y += this.chargeScale * delta;
                this.rotation = Math.random() * 0.1// * 10 - 5
                // console.log(this.animationContainer.scale.x);
            }else{
                this.attack();
                this.completeCharge = false;
            }

        }


        // console.log(this.followTarget);
        
        if(this.invencible >= 0){
            this.invencible -= delta;
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


        if(this.charging){
            return
        }

        if(this.hitTime > 0){
            this.hitTime -= delta;
            if(this.hitTime <= 0){
                this.endHit();
            }
        }
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
    }

}
