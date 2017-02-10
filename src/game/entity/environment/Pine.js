import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
import StandardEnvironmentEntity  from './StandardEnvironmentEntity';
export default class Pine extends StandardEnvironmentEntity {

    constructor(game, flatten) {

    	super(game, flatten);

    }

    build ( ) {

        let idRock =1// Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
         this.animationModel.push({
            label:'static',
            src:'pine'+idRock+'00',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:false,
        });
        if(!this.flatten){
            this.animationModel.push({
                label:'idle',
                src:'pine'+idRock+'00',
                totalFrames:22,
                startFrame:0,
                animationSpeed:0.5,
                movieClip:null,
                position:{x:10,y:0},
                anchor:{x:0.5,y:1},
                loop:false,
                haveCallback:true,
            });
        }

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);       


        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('static');

        // this.debugCollision()

    }
    

    update ( delta ) {
        super.update(delta);
    }	
}
