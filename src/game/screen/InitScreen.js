import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import AnimationManager  from '../entity/utils/AnimationManager';

export default class InitScreen extends Screen{	
	constructor(label){
		super(label);
	}
	build(){
		super.build();

		this.backgroundContaier = new PIXI.Container();
		this.addChild(this.backgroundContaier);

		this.background = new PIXI.Graphics();
		this.background.beginFill(0xababab);
	    this.background.drawRect( 0, 0, config.width, config.height);
		this.backgroundContaier.addChild(this.background);

		this.animationContainer = new PIXI.Container();
		this.addChild(this.animationContainer)

		this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:'players/dead/dead00',
            totalFrames:9,
            startFrame:0,
            animationSpeed:0.2,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.5}
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer)
        // this.animationManager.finishCallback = this.finishAnimation.bind(this);
        // this.animationManager.startCallback = this.startAnimation.bind(this);
        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        this.animationContainer.x = 200;
        this.animationContainer.y = 200;

	}

	
	update(delta){
		super.update(delta);

	}
	
}
