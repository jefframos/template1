import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
import TweenLite from 'gsap';

export default class StartGameContainer extends PIXI.Container{
	constructor(screen, bounds){
		super();
		this.screen = screen;
		this.bounds = bounds;
		let buttonDistance = 65;

		let backButtonConfig = this.createButton('play_button.png');
		this.backButton = backButtonConfig.button;
		this.addChild(this.backButton);

		this.backButton.position.set(bounds.w / 2, 350);

		console.log(this.y);
	}
	
	show(delay){
		this.visible = true;
		// this.screen.showDark();
		TweenLite.to(this.backButton.scale, 1, {delay:delay, x:1,y:1, ease:"easeOutElastic"});
		//TweenLite.to(this.position, 1, {delay:delay?delay:0,y:this.bounds.y, ease:"easeOutBack"});
		// TweenLite.to(this.status.position, 1, {delay:delay?delay+0.5:0.5,y:60, ease:"easeOutBack"});
		this.addEvents();
	}
	hide(force){
		// TweenLite.to(this.status, 1, {alpha:0});
		// TweenLite.to(this.status.position, 1, {y:config.height});
		this.screen.hideDark();
		if(force){
			TweenLite.to(this.backButton.scale, force?0:1, {x:0,y:0, ease:"easeOutBack", onComplete: this.disable, onCompleteScope: this});
		}else{
			TweenLite.to(this.backButton.scale, 0.2, {y:0.8, x:1.2});
			TweenLite.to(this.backButton.scale, 0.3, {delay:0.2, y:1.5, x:0.5});

			TweenLite.to(this.backButton, 0.6, {y:config.height + this.backButton.height, ease:"easeInBack", onComplete: this.disable, onCompleteScope: this});
		}
		this.removeEvents();
	}
	disable() {
		this.visible = false;
	}
	removeEvents(){
		this.backButton.off('tap').off('click');
	}
	addEvents(){	    
	    this.backButton.on('tap', this.onBackCallback.bind(this)).on('click', this.onBackCallback.bind(this));
	}
	onBackCallback(){		
		this.screen.onStartCallback();
	}
	onContinueCallback(){
		this.screen.onPauseCallback();
	}
	createButton(imageSrc, label) {
	    let button = new PIXI.Container()
	    if(imageSrc){
	    	let texture = PIXI.Texture.fromFrame(imageSrc);
	    	let sprite = new PIXI.Sprite(texture);
	    	sprite.anchor.set(0.5);
		    button.addChild(sprite);
	    }else{
		    let descriptionLabel = new PIXI.Text(label,{font : '50px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		    let color = 0x00FFFF;
		    button.addChild(descriptionLabel);
		}
	    button.interactive = true
	    button.buttonMode = true
	    return {button:button, size:{width:button.width, height:button.height}}
	}
}