import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class Spawner extends Entity {

    constructor(game, team) {

    	super(game);

        this.game = game;
        this.type = 'spawner';
        this.name = 'tower';

        this.team = team;

        this.scaleFator = 2;

        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0xFFFFFF);
        this.roundBase.drawCircle(0,0,100);
        this.roundBase.scale.y = 0.4;
        this.roundBase.alpha = 0.1;
        this.base.addChild(this.roundBase);
        this.addChild(this.base);


        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = 0
        this.animationContainer.y = 0
        this.addChild(this.animationContainer);

        this.radius = 150;
        this.externalRadius = 600;
        // this.debugCollision();

        this.static = true;

        this.waitingNext = 5 * Math.random() + 1;
        this.sinScale = Math.random();
        this.life = 10000;

        this.enemiesList = [];
        // this.build();


        this.hitting = false;
        this.hitTimer = -1;

        this.slotsAttack = [];

        this.attacking = false;
        this.attackTimer = 1;
        this.waypointList = [];

        this.spawnTime = 30;

        this.spawnQuant = 7//this.team == 1?8:5;
        this.spawDistance = 1.5;

        this.currentWave = 0;
        this.currentWave2 = 0;


        this.actionTimer = -1;
        this.action = null;

        this.totalEntities = 0;
        this.totalWaves = 0;
        this.totalKilled = 0;
       
        this.currentEntities = [];

        this.currentEntity = 0;
        this.waves = [
            [30, 'standard', 'standard', 'standard','bomber'],
            [45,'tanker', 'standard', 'ranger', 'ranger', 'ranger'],
        ];

    }

    hit(power){
        super.hit(power);
        this.hitTimer = 0.5;
        this.hitting = true;
    }
    addWaypoint (x,y) {
        this.waypointList.push({x:x, y:y});
    }
    startSpawn () {
        this.currentWave = 1;
        this.currentEntity = 0;
        this.totalWaves ++;
        this.currentWave2 ++;
       
        this.addEntity();
    }
    addEntity () {


        // console.log(this.currentWave2);

         if(this.currentWave2 >= this.waves.length){
            this.currentWave2 = 0;
        }

        if(this.currentWave >= this.waves[this.currentWave2].length){
            this.actionTimer = this.waves[this.currentWave2][0];

            // console.log('next Wave in', this.actionTimer);
            // this.actionTimer = this.spawnTime;
            this.action = this.startSpawn;
            return
        }


        this.totalEntities ++;
        // TweenLite.from(this.animationContainer.scale, 0.8, {x:0.9, y:0.9, ease:'easeOutElastic'})
        let type = this.waves[this.currentWave2][this.currentWave]
        let ent = this.game.addEnemy(type, {x:this.x, y:this.y}, this.waypointList, this.team);
        //this.game.addEnemy('tomato', {x:this.x, y:this.y + Math.random() * this.getRadius() - this.getRadius()/2}, this.waypointList, this.team);
        this.actionTimer = this.spawDistance;
        this.action = this.addEntity;

        //if(this.team == 1)
        //ent.enemyModel.updateLevel(10);

        this.currentEntities.push(ent);
        this.currentWave ++;
    }


    updateBaseColor ( ) {
        if(this.hitting){
            this.roundBase.tint = 0xFF0000;
        }else{
            this.roundBase.tint = 0;
        }
    }

    start ( ) {
        this.action = this.startSpawn;
        this.actionTimer = 3;
        //this.addEntity();
    }
    build ( ) {

        let idRock =1// Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
         this.animationModel.push({
            label:'static',
            src:'spawner1/idle/spawner1',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:false,
            singleFrame:true
        });
        // this.animationModel.push({
        //     label:'idle',
        //     src:'pine'+idRock+'00',
        //     totalFrames:22,
        //     startFrame:0,
        //     animationSpeed:0.5,
        //     movieClip:null,
        //     position:{x:10,y:0},
        //     anchor:{x:0.5,y:1},
        //     loop:false,
        //     haveCallback:true,
        // });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);       


        this.animationManager.hideAll();
        this.animationManager.stopAll();
        // this.animationManager.changeState('static');

        this.collidable = true;


        let maxAngle = 360
        let totFixed = 10
        for (var i = 1; i < 80; i++) {
            if(i <= totFixed){
                let angle = maxAngle / totFixed * i;
                this.slotsAttack.push({angle:angle, entity:null, radius: Math.random() * this.getRadius()/4 + this.getRadius()/4});
                utils.shuffle(this.slotsAttack);
            }else{

                this.slotsAttack.push({angle:Math.random() * maxAngle, entity:null, radius: Math.random() * this.getRadius()/3 + this.getRadius()/3});
            }
        }

    }
    

    update ( delta ) {
        super.update(delta);

        if(this.actionTimer > 0){
            this.actionTimer -= delta;
            if(this.actionTimer <= 0){
                this.action();   
            }
        }

        if(this.hitTimer > 0){
            this.hitTimer -= delta;
            if(this.hitTimer <=0 ){
                this.hitting = false;
            }
        }

        for (var i = this.currentEntities.length - 1; i >= 0; i--) {
            if(this.currentEntities[i].disapearing){
                this.totalKilled ++;
                this.currentEntities.splice(i,1);
            }
        }
        this.updateBaseColor();
    }	
}
