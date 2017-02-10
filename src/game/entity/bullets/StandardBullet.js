import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class StandardBullet extends Entity {

    constructor(game, params) {

        super();

        this.game = game;
        this.lifetime = params.lifetime;
        this.velocity = params.velocity;
        this.power = params.power;
        this.src = params.src;
        this.team = params.team;

        
        this.disapearTimerMax = 20;
        this.disapearTimer = this.disapearTimerMax;
        this.disapearing = false;
        // this.build();
        
    }
    build(){
        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0);
        this.roundBase.drawCircle(0,0,20);
        this.roundBase.scale.y = 0.4
        this.roundBase.alpha = 0.1;
        this.roundBase.x = 0;
        this.base.addChild(this.roundBase);

        this.addChild(this.base);
        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = 0
        this.animationContainer.y = -135
        this.addChild(this.animationContainer);

        // this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame('cherry.png'))    
        // this.sprite.anchor.set(0.6);

        let idCherry = Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:this.src +idCherry+'00',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.5},
            loop:false
        });

        this.animationModel.push({
            label:'explode',
            src:this.src +idCherry+'00',
            totalFrames:6,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.5},
            loop:false
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);

        // this.animationContainer.addChild(this.sprite);
       
        this.spriteVelocity = {x:0,y:0};

        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.5;
        this.gravity = 3800;
        // this.scale.set(0);
        this.killed = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        this.radius = 10;
        this.externalRadius = 0;

    }

    bulletAttackCollision() {
        let collisionList = this.game.getCollisionList(this,['enemy', 'tower', 'player'], true);
        if(collisionList){
            for (var i = 0; i < collisionList.length; i++) {
                if((collisionList[i].trueLeft && this.velocity.x > 0)||
                    (collisionList[i].trueRight && this.velocity.x < 0)){
                    if(collisionList[i].ableToHit){
                        if(collisionList[i].entity.hit(this.power, collisionList[i].trueLeft ? -1 : 1)){
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

    update ( delta ) {

        if(this.disapearing){
            this.disapearTimer -= delta;
            if(this.disapearTimer <= 0){
                this.kill = true;
            }
            let value = this.disapearTimer / this.disapearTimerMax;
            this.alpha = value;
            this.animationContainer.scale.set(value * 0.8 + 0.2)
        }

        if(this.killTimer){
            this.killTimer -= delta;
            this.velocity.x *= 0.7;
            if(this.killTimer <= 0){
                this.dead();
            }
        }

        if(this.killed){
            return;
        }


        if(!this.killTimer && this.bulletAttackCollision()){
            //this.animationContainer.rotation = 3.14/2;
            //this.animationManager.changeState('explode');
            this.base.visible = false;
            this.collidable = false;
            
            //this.killed = true;
            this.killTimer = 0.2;
        }

        if(this.lifetime <= 0){
            this.spriteVelocity.y += this.gravity * delta;
            this.animationContainer.y += this.spriteVelocity.y * delta;
            
            if(this.animationContainer.y >= 0){
                this.animationContainer.rotation = 0;
                this.animationManager.changeState('explode');
                this.base.visible = false;
                this.killed = true;
                this.disapearing = true;
            }
        }else{
            this.lifetime -= delta;
        }

        if(!this.killTimer){
            this.animationContainer.rotation += delta * 10;
        }


        this.x += this.velocity.x * delta * this.speedScale;
        this.y += this.velocity.y * delta * this.speedScale;
    }	
}
