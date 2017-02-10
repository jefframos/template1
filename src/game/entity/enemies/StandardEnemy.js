import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
import EnemyModel  from './../model/EnemyModel';
export default class StandardEnemy extends Entity {

    constructor(game, team) {

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


        let enemyStats = {
            level:1,
            hp:200,
            stamina:40,
            speed:60,
            magicPower:13,
            battlePower:150,
            defense:5,
            magicDefense:120,
            xp:20
        }
        
        this.enemyModel = new EnemyModel('tomato', enemyStats )


        this.actionTimer = -1;
        this.action = null;
        
        this.dynamicModel = {
            attackSpeed: 2,
            invencibleTimer:0.1
        }
        // this.build();

        // this.sprite.scale.set(this.starterScale)
    }

    build () {
        let enemieType = '';
            this.enemyModel.updateLevel(2)
        if(this.team == 0){
            // this.enemyModel.updateLevel(10)
            enemieType = Math.random() <0.5?'Candy1':'Candy2';
        }else{
            enemieType = Math.random() <0.5?'Tomato':'Potato';
        }
        {
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
        }
        // this.animationContainer.addChild(this.sprite);
       
        this.speed = {x:100,y:100};
        this.velocity = {x:0,y:0};
        this.spriteVelocity = {x:0,y:0};

        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.4 + Math.random() * 0.1;
        this.gravity = 15;
        // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');
        this.radius = 80 + Math.random() * 40;
        this.externalRadius = 160;
        // this.debugCollision();


        // this.debugCollision();
        this.reset();
        this.start();
    }


    reset ( ) {
        this.killed = false;


        this.skipCollision = 5;
        // this.animationManager.showJust(['idle','attack'])

        this.flipKill = false;

        this.side = -1;//Math.random() < 0.5?1:-1;

        this.attackTimer = -1;
        this.attackSpeed = this.dynamicModel.attackSpeed;
        this.attacking = false;
        this.preparingAttack = false;

        this.ableToMove = true;

        this.entityToAttack = null;
        //this.actionTimer = Math.random() * 2 + 1.5;
        //this.action = this.move;

        this.targetPosition = {x:-1,y:-10};
        this.followTarget = false;
        this.waypointID = 0;
        this.updateable = false;

        this.maxLife = this.enemyModel.hpMax;
        this.life = this.maxLife;

        this.disapearTimerMax = 20;
        this.disapearTimer = this.disapearTimerMax;
        this.disapearing = false;

        this.addLifeBar({x:0, y:-150}, {w:80, h:10}, this.team == 0?0x0000FF:0x00FF00);
    }

    start ( ) {
        this.updateable = true;
        this.move();
        this.setTarget(this.waypoints[this.waypointID]);
    }
    wait ( ) {
        return
        this.attacking = false;
        this.preparingAttack = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.animationManager.changeState('idle');
        
        this.actionTimer = 0.05//Math.random() * 3 + 1;
        this.action = this.move;
    }
    updateWaypointsSame () {
        if(this.waypointID >= this.waypoints.length){
            this.wait();
            return;
        }
        this.setTarget(this.waypoints[this.waypointID]);
    }
    updateWaypoints (same) {
        if(!same){
            this.waypointID ++;
        }
        if(this.waypointID >= this.waypoints.length){
            this.wait();
            return;
        }
        this.setTarget(this.waypoints[this.waypointID]);
    }
    setWaypoints (waypoints) {
        //console.log(waypoints);
        this.waypoints = waypoints;
        this.waypointID = 0;
        
    }
    setTarget (position, isEnemy = false) {
        this.isEnemy = isEnemy;
        var angle = Math.random() * 360 / 180 * 3.14
        this.targetPosition.x = position.x + Math.sin(angle)*50;
        this.targetPosition.y = position.y + Math.cos(angle)*50;
        this.followTarget = true;
        this.move();
    }
    move () {
        // console.log(this.attacking);
        if((this.preparingAttack || this.attacking) && !this.ableToMove){
            return
        }
        if(this.followTarget){

            let angle = Math.atan2(this.targetPosition.y - this.y, this.targetPosition.x - this.x);

            //console.log('follow',angle * 180 / 3.14);
            this.velocity.x = Math.cos(angle) * this.speed.x;
            this.velocity.y = Math.sin(angle) * this.speed.x;

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

    moveBack (delta) {
        this.side *= -1;

        this.velocity.x = this.speed.x * this.side;
        this.velocity.y *= -1;

        this.x += this.velocity.x * delta * this.speedScale * 2;
        this.y += this.velocity.y * delta * this.speedScale * 2;
        
        this.animationManager.changeState('walk');
        // this.actionTimer = 2//Math.random() * 3 + 1;
        // this.action = this.wait;
    }

    attack () {
        //this.actionTimer = this.attackTimer + 0.1//Math.random() * 2 + 1.5;
        //this.action = this.move;
        this.attackTimer = this.attackSpeed;

        if(this.entityToAttack.entity.type == 'hero'){
            let newList = this.game.getSimpleEntityCollision(this, this.entityToAttack.entity);


            this.attacking = true;
            // console.log('ATTACK', newList);
            if(newList.length){
                // console.log( this.entityToAttack.entity.team, this.team, newList);

                this.entityToAttack.entity.hit(this.enemyModel.getDemage());
            }
        }else{
            // console.log(this.entityToAttack);
            this.attacking = true;
            this.entityToAttack.entity.hit(this.enemyModel.getDemage());
            // this.attacking = false;
        }
    }
    prepareAttack (target) {
        if(!target || this.attacking || this.preparingAttack){
            return
        }

        this.ableToMove = false;

        this.entityToAttack = target;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.animationManager.changeState('attackIn', true);
        this.preparingAttack = true;

        
        if(this.entityToAttack.entity.type == 'tower'){
            this.entityToAttack.entity.addEnemy(this);
            this.currentTower = this.entityToAttack.entity;
        }
        
    }
    finishAnimation ( ) {
        if(this.animationManager.state == 'attackOut'){
            this.ableToMove = true;
        }
        if(this.animationManager.state == 'attackIn'){
            this.animationManager.changeState('attackOut', true);
            this.attack();
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
    hit(power, forceSide, entity) {
        // console.log(this.attacking);
        if(this.life < 0 || this.invencible > 0){// || this.attacking){
            return false;
        }

        let calcPower = this.enemyModel.getHurt(power);

        // this.wait();

        this.invencible = this.dynamicModel.invencibleTimer;

        this.hitting = true;
        this.hitTime = 0.3;

        this.life -= calcPower;

        // console.log(this.life);

        if(this.animationManager.state != 'attack'){
            this.animationManager.changeState('hurt', true);
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

    endHit(){
        this.hitting = false;
        this.hitTime = -1;
    }

    dead() {
        this.disapearing = true;
        this.removeLifeBar();
        TweenLite.to(this.base,0.5,{alpha:0})
        this.collidable = false;
        
        if(this.side < 0){
            if(this.flipKill){
                this.side = 1;
            }
            this.updateScale();
            this.animationManager.ableToChangeAnimation = true;
            this.animationManager.changeState('killFront', true);
        }else{
            this.animationManager.changeState('killBack', true);
        }
        //this.kill = true;
    }
    updateBaseColor ( ) {
        if(this.hitting){
            this.roundBase.tint = 0xFF0000;
        }else{
            this.roundBase.tint = 0;
        }
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

        if(this.currentTower && this.currentTower.type !='base' && this.currentTower.life <= 0){
            this.updateWaypoints();
            this.currentTower = null;
        }

        this.skipCollision --;
        if(this.skipCollision <= 0){
            this.skipCollision = Math.random() * 3 + 2;
            if(!this.attacking){
                let entityCollisions = this.game.getCollisionList(this,['tower','player','enemy'], true);
                // console.log(entityCollisions);
                if(entityCollisions && entityCollisions.length){
                    if(entityCollisions[0].ableToHit || entityCollisions[0].entity.type == 'tower'){
                        if(entityCollisions[0].trueLeft){
                            this.side = 1;
                        }else{
                            this.side = -1;
                        }
                        this.prepareAttack(entityCollisions[0]);
                    }
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
        // console.log(this.attacking);
        if((this.isEnemy && this.followTarget) || this.followTarget && !this.attacking){
            // if(this.isEnemy){
            //     this.speedScale = 1.5;
            // }else{
            //     this.speedScale = 1;
            // }
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
