import * as PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
import StandardEnvironmentEntity  from './StandardEnvironmentEntity';
export default class Rock extends StandardEnvironmentEntity {

    constructor(game, flatten) {

    	super(game, flatten);

    }

    build ( ) {

        let idRock = Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
        this.animationModel.push({
            label:'static',
            src:'rock'+idRock+'00',
            totalFrames:1,
            startFrame:1,
            animationSpeed:0.3,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.95},
            loop:false,
            haveCallback:false,
        });
        if(!this.flatten){
            this.animationModel.push({
                label:'idle',
                src:'rock'+idRock+'00',
                totalFrames:idRock == 1 ? 17 : 16,
                startFrame:0,
                animationSpeed:0.3,
                movieClip:null,
                position:{x:0,y:0},
                anchor:{x:0.5,y:0.95},
                loop:false,
                haveCallback:true,
            });
        }

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('static');

    }
    update ( delta ) {
        super.update(delta);
    }
}
