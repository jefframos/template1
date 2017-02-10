import * as PIXI from 'pixi.js';
import utils  from '../../utils';
import AnimationManager  from './utils/AnimationManager';
import EntityModel  from './model/EntityModel';
import EnemyModel  from './model/EnemyModel';
import Entity  from './Entity';
export default class Cupcake extends Entity {

    constructor(game, startPosition, team) {

        
    	super();

        let stats = {
            // baseHP,
                hpMin:100,
                vigor:37,
                speed:40,
                stamina:28,
                magicPower:28,
                battlePower:14,
                defense:38,
                magicDefense:23            
        }

        // baseHPModifier:11.92,
        //         baseMPModifier:10.2,
        //         vigorModifier:0.005,
        //         speedModifier:0.007,
        //         staminaModifier:0.007,
        //         magicPowerModifier:0.004,
        //         battlePowerModifier:0.005,
        //         defenseModifier:0.004,
        //         magicDefenseModifier:0.004        

        let modifiers = {
                baseHPModifier:3.02,
                baseMPModifier:10.2,
                vigorModifier:0.005,
                speedModifier:0.007,
                staminaModifier:0.007,
                magicPowerModifier:0.004,
                battlePowerModifier:0.005,
                defenseModifier:0.004,
                magicDefenseModifier:0.004         
        }

        this.heroModel = new EntityModel('jose',  'thief', stats, modifiers, null, null)
        this.heroModel.entity = this;
        // this.heroModel.log()


        
        // this.enemyModel.log()


        // // console.log(this.enemyModel.getNormalizedAtt());
        // // console.log(this.heroModel.getNormalizedAtt());
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.hpMax);
        // this.heroModel.levelUp();
        // console.log(this.heroModel.getNormalizedAtt());

        this.type = 'hero';
        this.game = game;
        this.team = team;
        this.startPosition = startPosition;

        this.starterScale = 1;

        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0xFFFFFF);
        this.roundBase.drawCircle(0,0,50,50);
        this.roundBase.scale.y = 0.4
        this.roundBase.alpha = 0.1;
        this.roundBase.x = 0;
        this.base.addChild(this.roundBase);

        this.addChild(this.base);
        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = 25/2
        this.addChild(this.animationContainer);
        // {
        //     let type = 'cupcake';
        //     this.animationModel = [];
        //     this.animationModel.push({
        //         label:'idle',
        //         src:type+'/idle/idle00',
        //         totalFrames:14,
        //         startFrame:0,
        //         animationSpeed:0.4,
        //         movieClip:null,
        //         position:{x:0,y:0},
        //         anchor:{x:0.5,y:1}
        //     });

        //     this.animationModel.push({
        //         label:'run',
        //         src:type+'/run/run00',
        //         totalFrames:24,
        //         startFrame:8,
        //         animationSpeed:0.4,
        //         movieClip:null,
        //         position:{x:-15,y:4},
        //         anchor:{x:0.5,y:1}
        //     });

        //     this.animationModel.push({
        //         label:'runFast',
        //         src:type+'/speedUp/speedUp00',
        //         totalFrames:24,
        //         startFrame:8,
        //         animationSpeed:0.4,
        //         movieClip:null,
        //         position:{x:-15,y:4},
        //         anchor:{x:0.5,y:1}
        //     });

        //     this.animationModel.push({
        //         label:'meleeAttack1',
        //         src:type+'/meleeAttack1/meleeAttack100',
        //         totalFrames:16,
        //         startFrame:7,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:43,y:0},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'meleeAttack2',
        //         src:type+'/meleeAttack2/meleeAttack200',
        //         totalFrames:16,
        //         startFrame:7,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:43,y:0},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'meleeAttack3',
        //         src:type+'/meleeAttack3/meleeAttack300',
        //         totalFrames:28,
        //         startFrame:12,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:83,y:0},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'meleeAttack4',
        //         src:type+'/meleeAttack4/meleeAttack400',
        //         totalFrames:38,
        //         startFrame:16,
        //         animationSpeed:0.7,
        //         movieClip:null,
        //         position:{x:50,y:5},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'jumpIn',
        //         src:type+'/jump/jump00',
        //         totalFrames:7,
        //         startFrame:0,
        //         animationSpeed:0.6,
        //         movieClip:null,
        //         position:{x:-10,y:0},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         // haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'jumpFalling',
        //         src:type+'/jump/jump00',
        //         totalFrames:13,
        //         startFrame:7,
        //         animationSpeed:0.3,
        //         movieClip:null,
        //         position:{x:-10,y:0},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         // haveCallback:true,
        //     });


        //     this.animationModel.push({
        //         label:'jumpOut',
        //         src:type+'/jump/jump00',
        //         totalFrames:20,
        //         startFrame:13,
        //         animationSpeed:0.3,
        //         movieClip:null,
        //         position:{x:-10,y:0},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'rangeAttack',
        //         src:type+'/rangeAttack1/rangeAttack100',
        //         totalFrames:15,
        //         startFrame:0,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:4,y:2},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'rangeAttackEnd',
        //         src:type+'/rangeAttack1/rangeAttack100',
        //         totalFrames:33,
        //         startFrame:15,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:4,y:2},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'areaAttack',
        //         src:type+'/areaAttack1/areaAttack100',
        //         totalFrames:30,
        //         startFrame:0,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:-15,y:36},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'killBack',
        //         src:type+'/kill1/kill100',
        //         totalFrames:22,
        //         startFrame:0,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:-190,y:15},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'revive',
        //         src:type+'/areaAttack1/areaAttack100',
        //         totalFrames:30,
        //         startFrame:23,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:-15,y:36},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'speedAttack',
        //         src:type+'/speedAttack/speedAttack00',
        //         totalFrames:8,
        //         startFrame:0,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:-40,y:6},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'speedAttackLoop',
        //         src:type+'/speedAttack/speedAttack00',
        //         totalFrames:8,
        //         startFrame:7,
        //         animationSpeed:0.5,
        //         movieClip:null,
        //         position:{x:-40,y:6},
        //         anchor:{x:0.5,y:1},
        //         loop:false
        //     });

        //     this.animationModel.push({
        //         label:'speedAttackEnd',
        //         src:type+'/speedAttack/speedAttack00',
        //         totalFrames:14,
        //         startFrame:8,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:-40,y:6},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });

        //     this.animationModel.push({
        //         label:'hit1',
        //         src:type+'/hurt1/hurt100',
        //         totalFrames:18,
        //         startFrame:0,
        //         animationSpeed:0.65,
        //         movieClip:null,
        //         position:{x:-35,y:4},
        //         anchor:{x:0.5,y:1},
        //         loop:false,
        //         haveCallback:true,
        //     });


        //     this.animationManager = new AnimationManager(this.animationModel, this.animationContainer)
        //     this.animationManager.finishCallback = this.finishAnimation.bind(this);
        //     this.animationManager.startCallback = this.startAnimation.bind(this);
        // }


                {
            let type = 'cupcake';
            this.animationModel = [];
            this.animationModel.push({
                label:'idle',
                src:type+'/idle/idle00',
                totalFrames:14,
                startFrame:0,
                animationSpeed:0.4,
                movieClip:null,
                position:{x:0,y:0},
                anchor:{x:0.5,y:1}
            });

            this.animationModel.push({
                label:'run',
                src:type+'/run/run00',
                totalFrames:24,
                startFrame:8,
                animationSpeed:0.4,
                movieClip:null,
                position:{x:-15,y:4},
                anchor:{x:0.5,y:1}
            });

            this.animationModel.push({
                label:'runFast',
                src:type+'/speedUp/speedUp00',
                totalFrames:24,
                startFrame:8,
                animationSpeed:0.4,
                movieClip:null,
                position:{x:-15,y:4},
                anchor:{x:0.5,y:1}
            });

            this.animationModel.push({
                label:'meleeAttack1',
                src:type+'/meleeAttack1/meleeAttack100',
                totalFrames:16,
                startFrame:7,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:43,y:0},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'meleeAttack2',
                src:type+'/meleeAttack2/meleeAttack200',
                totalFrames:16,
                startFrame:7,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:43,y:0},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'meleeAttack3',
                src:type+'/meleeAttack3/meleeAttack300',
                totalFrames:28,
                startFrame:12,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:83,y:0},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'meleeAttack4',
                src:type+'/meleeAttack4/meleeAttack400',
                totalFrames:38,
                startFrame:16,
                animationSpeed:0.7,
                movieClip:null,
                position:{x:50,y:5},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'jumpIn',
                src:type+'/jump/jump00',
                totalFrames:7,
                startFrame:0,
                animationSpeed:0.6,
                movieClip:null,
                position:{x:-10,y:0},
                anchor:{x:0.5,y:1},
                loop:false,
                // haveCallback:true,
            });

            this.animationModel.push({
                label:'jumpFalling',
                src:type+'/jump/jump00',
                totalFrames:13,
                startFrame:7,
                animationSpeed:0.3,
                movieClip:null,
                position:{x:-10,y:0},
                anchor:{x:0.5,y:1},
                loop:false,
                // haveCallback:true,
            });


            this.animationModel.push({
                label:'jumpOut',
                src:type+'/jump/jump00',
                totalFrames:20,
                startFrame:13,
                animationSpeed:0.3,
                movieClip:null,
                position:{x:-10,y:0},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'rangeAttack',
                src:type+'/rangeAttack1/rangeAttack100',
                totalFrames:15,
                startFrame:0,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:4,y:2},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'rangeAttackEnd',
                src:type+'/rangeAttack1/rangeAttack100',
                totalFrames:33,
                startFrame:15,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:4,y:2},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'areaAttack',
                src:type+'/areaAttack1/areaAttack100',
                totalFrames:30,
                startFrame:0,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:-15,y:36},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'killBack',
                src:type+'/kill1/kill100',
                totalFrames:22,
                startFrame:0,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:-190,y:15},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'revive',
                src:type+'/areaAttack1/areaAttack100',
                totalFrames:30,
                startFrame:23,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:-15,y:36},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'speedAttack',
                src:type+'/speedAttack/speedAttack00',
                totalFrames:8,
                startFrame:0,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:-40,y:6},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'speedAttackLoop',
                src:type+'/speedAttack/speedAttack00',
                totalFrames:8,
                startFrame:7,
                animationSpeed:0.5,
                movieClip:null,
                position:{x:-40,y:6},
                anchor:{x:0.5,y:1},
                loop:false
            });

            this.animationModel.push({
                label:'speedAttackEnd',
                src:type+'/speedAttack/speedAttack00',
                totalFrames:14,
                startFrame:8,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:-40,y:6},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });

            this.animationModel.push({
                label:'hit1',
                src:type+'/hurt1/hurt100',
                totalFrames:18,
                startFrame:0,
                animationSpeed:0.65,
                movieClip:null,
                position:{x:-35,y:4},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });


            for (var i = 0; i < this.animationModel.length; i++) {
                this.animationModel[i].position.x *= 0.5
                this.animationModel[i].position.y *= 0.5
            }

            this.animationManager = new AnimationManager(this.animationModel, this.animationContainer)
            this.animationManager.finishCallback = this.finishAnimation.bind(this);
            this.animationManager.startCallback = this.startAnimation.bind(this);
        }


        let limits={
            speed:{
                min:{x:200, y:170},
                max:{x:320, y:280}
            },
            rangeSpeed:{
                min:3,
                max:0.3
            }

        }
        this.dynamicModel = {
            speed:{x:300, y:250},
            standardTimeJump:0.7,
            jumpForce:300,
            rangeSpeed:2,//std 1
            attackSpeed:0.32,//std 0.4
            dashTime: 0.06,
            speedUp:1.5,
            dashSpeed:5,
            hitFeedback:0.2,
            comboStandardTimer:0.8,
            invencibleTimer:0.1,
            regen:20,
        }
        this.side = 1; 
        this.meleeComboList = ['meleeAttack1','meleeAttack2','meleeAttack3','meleeAttack4']
        this.currentMeleeCombo = 0;
        // this.updateState();
       
        // this.scale.set(1.5)

        //this.timer = 3.0;
        //this.nextAction = this.animationManager.changeState;
        // setTimeout(() => {
        //     this.animationManager.changeState();
        // }, 3000);

       // this.updateState();
        this.velocity = {x:0, y:0};

        // this.comboStandardTimer = 0.9;

        this.animationManager.ableToChangeAnimation = true;
        


        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        // this.animationManager.showJust(['idle','Hurt1'])

        // this.dynamicModel.standardTimeJump = 0.7;
        
        this.reset();


        this.radius = 100;
        this.externalRadius = 160;

        this.invencible = -1;
        // this.debugCollision();
       

    }

    
    reset() {

        this.timeJump = 0;
        this.attackTime = -1;
        this.dying = false;
        this.respawning = false;

        this.timeJump = 0;
        this.animationContainer.alpha = 1;
        this.base.alpha = 1;
        this.respawning = false;
        this.currentMeleeCombo = 0;
        this.animationManager.ableToChangeAnimation = true;


        this.comboTimer = 0;
        this.starterScale = 1;// 0.5;
        this.standardScale = this.starterScale;
        this.speedFactor = 1;

        this.rangeAttacking = false;
        this.attacking = false;
        this.jumping = false;
        this.hitting = false;
        this.jumpingOut = false;
        this.updateable = true;



        this.collidable = true;

        this.areaAttackTimer = -1;

        this.timeJump = 0;
        this.attackTime = -1;
        this.rangeTime = -1;
        this.dashTime = -1;
        this.hitTime = -1;

        this.dashSpeed = 1;

        this.x = this.startPosition.x;
        this.y = this.startPosition.y;

        this.maxLife = this.heroModel.hpMax;
        this.life = this.maxLife;
        //this.scale.set(this.standardScale)

        this.addLifeBar({x:0, y:-150}, {w:120, h:10}, this.team == 0?0x0000FF:0x00FF00);

    }

    dead() {
        this.removeLifeBar();
        this.collidable = false;
        if(this.animationManager.changeState('killBack', true)){
            this.animationContainer.y = 0;
        }
        this.dying = true;
        TweenLite.to(this.base,0.5, {alpha:0});
    }
    speedNormal() {
        this.endSpeedUpAttack();
        this.speedAttacking = false;
        this.speedFactor = 1;
        let animModel = this.animationManager.getAnimation('run');
        animModel.movieClip.animationSpeed = animModel.animationSpeed * this.speedFactor;
    }
    speedUp() {

        if(this.speedFactor == 1){
            this.invencible = this.dynamicModel.invencibleTimer;
        }

        if(this.speedAttacking){            
            //console.log('apwws');
            this.speedFactor = this.dynamicModel.speedUp * this.dynamicModel.dashSpeed;            
        }else{
            this.speedFactor = this.dynamicModel.speedUp;
        }
        let animModel = this.animationManager.getAnimation('runFast');
        animModel.movieClip.animationSpeed = animModel.animationSpeed * this.speedFactor;
    }
    hitEnemy(entity, demage) {
        let collisionResult = entity.hit(this.heroModel.getDemage())
        console.log(collisionResult);
        if(collisionResult == 'DEAD'){
            this.heroModel.updateXp(entity.enemyModel.xp)
        }
        return collisionResult
    }
    areaAttackCollision() {
        this.areaAttackTimer = -1;
        let collisionList = this.game.getExternalColisionList(this,['enemy', 'tower'], true);
        if(collisionList){
            for (var i = 0; i < collisionList.length; i++) {
                // if(collisionList[i].front || collisionList[i].back){
                collisionList[i].entity.side = this.side * -1;
                this.hitEnemy(collisionList[i].entity, this.heroModel.getDemage())
                
                // }
            }
        }
    }
    dashAttackCollision() {
        let collisionList = this.game.getCollisionList(this,['enemy', 'tower'], true);
        if(collisionList){
            for (var i = 0; i < collisionList.length; i++) {
                //if(collisionList[i].right || collisionList[i].left){
                    collisionList[i].entity.side = this.side * -1;
                    this.hitEnemy(collisionList[i].entity, this.heroModel.getDemage())
                    // if(collisionList[i].entity.hit(this.heroModel.getDemage())){
                    //     return true
                    // }
                //}
            }
        }
        return false
    }
    meleeAttackCollision() {
        let collisionList = this.game.getCollisionList(this,['tower','enemy'], true);
        if(collisionList){
            for (var i = 0; i < collisionList.length; i++) {
                if(collisionList[i].right || collisionList[i].left){
                    collisionList[i].entity.side = this.side * -1;
                    console.log(this.heroModel.getDemage());
                    if(this.hitEnemy(collisionList[i].entity, this.heroModel.getDemage())){
                        return true
                    }
                }
            }
        }
        return false
    }
    areaAttack() {
        if(this.dying){
            return;
        }
        if(this.jumping){
            if(this.animationManager.changeState('areaAttack')){
                this.animationContainer.y = 0;
                this.timeJump = 0;

                this.areaAttackTimer = 0.5;

                //this.jumping = false;
            }
            return;
        }
    }
    jump() {
        if(this.dying){
            return;
        }
        if(this.jumping){
            return
        }
        this.endSpeedUpAttack();
        if(this.animationManager.changeState('jumpIn')){
            this.jumping = true;
            this.timeJump = this.dynamicModel.standardTimeJump;
        }
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    rangeAttack() {
        if(this.dying){
            return;
        }
        if(this.rangeAttacking){
            return;
        }
        if(this.speedAttacking){
            return;
        }
        if(this.jumping || this.jumpOut){
            return;
        }
        if(this.animationManager.changeState('rangeAttack')){

            let rangeAnimation = this.animationManager.getAnimation('rangeAttack');
            rangeAnimation.movieClip.animationSpeed = this.dynamicModel.rangeSpeed * rangeAnimation.animationSpeed;

            let rangeAnimationEnd = this.animationManager.getAnimation('rangeAttackEnd');
            rangeAnimationEnd.movieClip.animationSpeed = this.dynamicModel.rangeSpeed * rangeAnimationEnd.animationSpeed;

            this.rangeAttacking = true;
            this.rangeSpeedY = this.velocity.y;
        }
        
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    endSpeedUpAttack() {

        this.dashSpeed = 1;
        this.dashTime = -1;

        this.speedFactor = this.dynamicModel.speedUp;
        
        if(this.speedAttacking){
            this.animationManager.changeState('speedAttackEnd', true);
            return;
        }
    }
    attack() {
        if(this.dying){
            return;
        }
        if(this.attacking){
            return;
        }
        if(this.rangeAttacking){
            return;
        }
         if(this.speedAttacking){
            return;
        }
        if(this.areaAttackTimer > 0){
            return;
        }
        if(this.attackTime > 0){
            return;
        }
        if(this.jumping){
            this.areaAttack();
            return;
        }

        if( this.speedFactor > 1 && ((Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) >= this.dynamicModel.speed.x *0.9 )){
            this.animationManager.changeState('speedAttack');
            //this.speedAttacking = true;
            this.dashTime = this.dynamicModel.dashTime;
            this.dashSpeed = this.dynamicModel.dashSpeed;
            return
        }


        if(this.animationManager.changeState(this.meleeComboList[this.currentMeleeCombo], this.attackTime <= 0) || this.attackTime <= 0){
            this.attackTime = this.dynamicModel.attackSpeed;
            this.attacking = true;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.comboTimer = this.dynamicModel.comboStandardTimer;



            let canCombo = this.meleeAttackCollision();

            if(this.canCombo() && canCombo){
                this.currentMeleeCombo ++;
            }else{
                this.currentMeleeCombo = 0;
            }

        }
    }
    canCombo() {
        // console.log(this.comboTimer);
        return this.currentMeleeCombo < this.meleeComboList.length - 1;
        // return this.comboTimer > 0 && this.currentMeleeCombo < this.meleeComboList.length - 1;
    }
    isMeleeCombo() {
        for (var i = 0; i < this.meleeComboList.length; i++) {
            if(this.animationManager.state == this.meleeComboList[i]){
                return true
            }
        }
        return false
    }
    startAnimation() {
    }
    finishJump() {
        if(this.dying){
            return;
        }
        this.jumpingOut = false;
        if(this.jumping){
            this.jumpingOut = true;
            this.animationManager.changeState('jumpOut');
        }
        this.animationContainer.y = 0;
        this.jumping = false;
    }

    respaw() {
        this.animationManager.changeState('revive');
        this.reset();
    }
    startRespaw() {
        if(this.respawning){
            return
        }
        this.respawning = true;
        TweenLite.to(this.animationContainer, 1, {alpha:0, delay:1, onComplete:this.respaw.bind(this)})
    }
    finishAnimation() {
        this.animationManager.ableToChangeAnimation = true;

        if(this.animationManager.state == 'revive'){
            this.dying = false;
        }
        

        if(this.dying){
            
            this.startRespaw();
            //respaw
            return
        }

        if(this.jumping){
            return
        }

        if(this.animationManager.state == 'speedAttackEnd'){
            this.speedAttacking = false;
        }


        if(this.speedAttacking && this.animationManager.state == 'speedAttack'){
            this.animationManager.changeState('speedAttackLoop', true);
            return
        }

        


        if(this.animationManager.state == 'rangeAttackEnd'){
            this.rangeAttacking = false;
        }
        if(this.rangeAttacking){
            ////console.log('RANGING');
            let bulletPosition = {x:this.position.x + (150/2  * this.side) * Math.abs(this.scale.x), y: this.position.y};
            let demage = this.heroModel.getDemage('range')
            // console.log(demage);
            this.game.addBullet({pos:bulletPosition, velocity:{x:800 * this.side, y:this.rangeSpeedY}, lifetime:0.1,team:this.team, power:demage, src:'cupcake/bullet/cherryBullet'});
            this.animationManager.changeState('rangeAttackEnd');
            return;
        }


        this.jumpingOut = false;

        if(this.isMeleeCombo()){            
            //this.attacking = false;
        }

        this.animationManager.changeState('idle');
    }
    endHit(){
        this.hitting = false;
        this.hitTime = -1;
    }
    hit(power, forceSide) {

        //rever condicoes de hit
        // console.log('rever condicoes de hit');
        //console.log(this.areaAttackTimer,this.jumping , this.rangeAttacking , this.invencible , this.jumpingOut);
        if(this.life < 0 || this.areaAttackTimer > 0 || this.jumping || this.rangeAttacking || this.invencible > 0){
            return false;
        }

        let calcPower = this.heroModel.getHurt(power);

        this.jumpingOut = false;
        this.speedAttacking  = false

        this.hitting = true;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.life -= calcPower;

        this.invencible = this.dynamicModel.invencibleTimer;

        if(this.animationManager.state != 'hit1'){
            this.animationManager.changeState('hit1', true);
        }

        if(forceSide){
            this.side = forceSide;
        }

        this.hitTime = this.dynamicModel.hitFeedback;

        if(this.life <= 0){
            this.dead();
            //return false;
        }

        

        return true;
    }

    stopMove() {
        if(this.dying){
            return;
        }
        if(this.speedAttacking){
            return;
        }
        if(this.jumping || this.jumpingOut){
            return;
        }
        this.velocity.x =0;
        this.velocity.y =0;
        this.animationManager.changeState('idle');
    }
    move(value) {
        if(this.dying || this.speedAttacking || this.hitting){
            return;
        }

        if(this.dashSpeed > 1){
            this.speedAttacking = true;
        }
        // console.log(value, this.dynamicModel.speed, this.speedScale, this.speedFactor);
        this.velocity.x = (this.dynamicModel.speed.x * (value[0]) * (this.speedScale * this.speedScale) * this.speedFactor )* this.dashSpeed;
        this.velocity.y = (this.dynamicModel.speed.y * (value[1]) * (this.speedScale * this.speedScale) * this.speedFactor )* this.dashSpeed;
        if(Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.05){
            this.stopMove();
        }else{
            let forceMove = this.animationManager.state == 'hit1';
            if(!this.jumping && !this.speedAttacking){
                if(this.speedFactor == 1){
                    this.animationManager.changeState('run',forceMove);
                }else{
                    this.animationManager.changeState('runFast',forceMove);
                }
            }
        }
    }

    regen (delta) {
        this.life += this.dynamicModel.regen * delta;
        if(this.life > this.maxLife){
            this.life = this.maxLife
        }
    }
    updateBaseColor ( ) {
        if(this.hitting){
            this.roundBase.tint = 0xFF0000;
        }else{
            this.roundBase.tint = 0;
        }
    }
    levelUp ( ) {
        console.log('LEVEL UP', this.heroModel.level);
    }
    updateXP ( xp ) {
        console.log('updateXP', xp);
    }
    update ( delta ) {

        this.animationManager.updateAnimations();

        this.updateLifeBar();

        if(this.dying){
            return;
        }

        this.regen(delta)
        // console.log(this.invencible);
        if(this.invencible >= 0){
            this.invencible -= delta;
        }

        // console.log(this.comboTimer);
        if(this.comboTimer > 0){
            this.comboTimer -= delta;
        }else{
            this.comboTimer = 0;
            this.currentMeleeCombo = 0;
        }

        if(this.areaAttackTimer > 0){
            this.areaAttackTimer -= delta;
            if(this.areaAttackTimer <= 0){
                this.areaAttackCollision();
            }
        }

        if(this.dashTime > 0){
            this.dashTime -= delta;
            this.dashAttackCollision();
            if(this.dashTime <= 0){
                this.endSpeedUpAttack();
            }
        }

        if(this.attackTime > 0){
            this.attackTime -= delta;
            if(this.attackTime <= 0){
                this.attacking = false;
                this.attackTime = -1;
            }
        }

        if(this.hitTime > 0){
            this.hitTime -= delta;
            if(this.hitTime <= 0){
                this.endHit();
            }
        }

        this.updateBaseColor();
        // if(this.timer <= 0){
        //     this.timer = 999999;
        //     this.nextAction();
        // }

        // console.log(this.velocity, delta);

        if(this.jumping){
            this.timeJump -= delta;
            let jumpFactor = 0.5 - utils.distance(utils.linear(this.timeJump / this.dynamicModel.standardTimeJump),0,0.5,0);
            // let jumpFactor = 0.5 - utils.distance(utils.easeInQuad(this.timeJump / this.dynamicModel.standardTimeJump),0,0.5,0);
            //// console.log(this.timeJump / this.dynamicModel.standardTimeJump);
            this.animationContainer.y = -jumpFactor * this.dynamicModel.jumpForce;
            if(this.timeJump / this.dynamicModel.standardTimeJump > 0.5){
                this.animationManager.changeState('jumpIn')
            }else{
                this.animationManager.changeState('jumpFalling')
            }

            if(this.timeJump <= 0){
                this.finishJump();
            }
        }

        if(this.velocity.x < 0){
            this.side = -1;
        }else if(this.velocity.x > 0){
            this.side = 1;
        }
        

        // console.log(this.velocity, this.scale);

        if(this.attacking || this.jumpingOut || this.rangeAttacking){
            return
        }

        if(this.game.worldCollision(this.x + (this.velocity.x * 1.1) * delta, this.y)){
            this.velocity.x = 0;
        }
        if(this.game.worldCollision(this.x, this.y + (this.velocity.y * 1.1) * delta)){
            this.velocity.y = 0;
        }
        // if(this.velocity.x < 0 &&  this.virtualVelocity.x){
        //     this.velocity.x = this.virtual
        // }

        this.x += this.velocity.x * delta;
    	this.y += this.velocity.y * delta;
    }	
}
