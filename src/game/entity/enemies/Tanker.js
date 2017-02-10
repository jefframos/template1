import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import EnemyModel  from './../model/EnemyModel';
import StandardEnemy  from './StandardEnemy';
export default class Tanker extends StandardEnemy {

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
            attackSpeed: 3,
            invencibleTimer:0.1
        }

        // this.build();

        // this.sprite.scale.set(this.starterScale)
    }

    build () {
        let enemieType = '';
        if(this.team == 0){
            enemieType = Math.random() <0.5?'Candy1':'Candy2';
        }else{
            enemieType = Math.random() <0.5?'Tomato':'Potato';
        }
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
        this.radius = 120 + Math.random() * 10;
        this.externalRadius = 160;
        // this.debugCollision();


        // this.debugCollision();
        this.reset();
        this.start();

        //console.log(this.attackSpeed);
    }


    // reset ( ) {
    //     this.killed = false;

    //     // this.animationManager.showJust(['idle','attack'])

    //     this.flipKill = false;

    //     this.side = -1;//Math.random() < 0.5?1:-1;

    //     this.attackTimer = -1;
    //     this.attackSpeed = 3;
    //     this.attacking = false;

    //     this.ableToMove = true;

    //     this.entityToAttack = null;
    //     //this.actionTimer = Math.random() * 2 + 1.5;
    //     //this.action = this.move;

    //     this.targetPosition = {x:-1,y:-10};
    //     this.followTarget = false;
    //     this.waypointID = 0;
    //     this.updateable = false;

    //     this.maxLife = this.entityModel.maxLife;
    //     this.life = this.maxLife;

    //     this.disapearTimerMax = 20;
    //     this.disapearTimer = this.disapearTimerMax;
    //     this.disapearing = false;

    //     this.addLifeBar({x:0, y:-150}, {w:80, h:10}, this.team == 0?0x0000FF:0x00FF00);
    // }

    start ( ) {
        this.updateable = true;
        this.move();
        this.setTarget(this.waypoints[this.waypointID]);
    }

}
