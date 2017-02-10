import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class StandardEnvironmentEntity extends Entity {

    constructor(game, flatten) {

    	super();

        this.flatten = flatten;
        this.game = game;
        // this.base = new PIXI.Container();
        // this.roundBase = new PIXI.Graphics();
        // this.roundBase.beginFill(0);
        // this.roundBase.drawCircle(0,0,20);
        // this.roundBase.scale.y = 0.4
        // this.roundBase.alpha = 0.1;
        // this.roundBase.x = 0;
        // this.base.addChild(this.roundBase);

        // this.addChild(this.base);


        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = 0
        this.animationContainer.y = 0
        this.addChild(this.animationContainer);

        this.radius = 30;
        this.externalRadius = 0;
        //this.debugCollision();

        this.static = true;

        this.waitingNext = 5 * Math.random() + 1;
        this.sinScale = Math.random();

        this.build();
        // this.sprite.scale.set(this.starterScale)
    }

    build ( ) {

        let idRock = Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:'rock1000'+idRock,
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.8},
            loop:false,
            singleFrame:true
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);
        this.animationManager.finishCallback = this.finishAnimation.bind(this);
             // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        

    }
    finishAnimation ( ) {
        this.animationManager.changeState('static', true);
    }
    update ( delta ) {
        if(this.flatten){
            return
        }
        // console.log('this');
       if(this.waitingNext > 0){
            this.waitingNext -= delta;

            let sin = Math.sin(this.sinScale += delta*4);
            let cos = Math.cos(this.sinScale += delta*4);

            this.animationContainer.scale.y = (-sin * 0.03) + 1;
            this.animationContainer.scale.x = (sin * 0.03) + 1;

            this.animationContainer.rotation = cos * 0.01;
            
        }

        if(this.waitingNext <= 0){
            this.waitingNext = 5 * Math.random() + 1;
            this.animationManager.changeState('idle', true);
        }

        this.animationManager.updateAnimations();
    }	
}
