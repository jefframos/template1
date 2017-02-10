import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
import TweenLite from 'gsap';

export default class EndGameContainer extends PIXI.Container{
	constructor(screen, bounds){
		super();
		this.screen = screen;
		this.bounds = bounds;

		this.background = new PIXI.Graphics().beginFill(0x9B778F).drawRect(0,0,bounds.w, bounds.h);
		this.addChild(this.background)

	    this.screen = screen;
		this.bounds = bounds;
		let buttonDistance = 65;

		this.coinsLabel = new PIXI.Text('---',{font : '100px luckiest_guyregular', fill : 0xFFFFFF, align : 'right', dropShadow:true, dropShadowColor:'#F06D6D'});
	    this.addChild(this.coinsLabel);
	    this.coinsLabel.position.set(config.width/2 - this.coinsLabel.width/2, 20);


		let backButtonConfig = this.createButton('refresh_button.png');
		this.backButton = backButtonConfig.button;
		this.addChild(this.backButton);

		this.backButton.position.set(bounds.w / 2, 350);


		let reviveButtonConfig = this.createButton('revive_button.png');
		this.reviveButton = reviveButtonConfig.button;
		// this.addChild(this.reviveButton);

		this.reviveButton.position.set(bounds.w / 2 + 70, 350);

		this.currentCoins = 0;

		// utils.applyPositionCorrection(this);
		// this.hide(true)
	}
	
	show(delay){


		this.visible = true;
		this.screen.showDark();

		this.coinsLabel.text = this.currentCoins;
		this.coinsLabel.x = this.bounds.w/2 - this.coinsLabel.width/2;

		TweenLite.to(this.position, 1, {delay:delay?delay:0,y:this.bounds.y, ease:"easeOutBack"});
		// TweenLite.to(this.status.position, 1, {delay:delay?delay+0.5:0.5,y:60, ease:"easeOutBack"});
		this.addEvents();
	}
	hide(force){
		// TweenLite.to(this.status, 1, {alpha:0});
		// TweenLite.to(this.status.position, 1, {y:config.height});
		this.screen.hideDark();
		TweenLite.to(this.position, force?0:1, {y:force?-config.height:config.height, ease:"easeOutBack", onComplete: this.disable, onCompleteScope: this});
		

		this.removeEvents();
	}
	disable() {
		this.visible = false;
	}
	removeEvents(){
		// this.reestartButton.off('tap').off('click');
		this.backButton.off('tap').off('click');
		this.reviveButton.off('tap').off('click');
	}
	addEvents(){
	    // this.reestartButton.on('tap', this.onReestartCallback.bind(this)).on('click', this.onReestartCallback.bind(this));	    
	    this.backButton.on('tap', this.onBackCallback.bind(this)).on('click', this.onBackCallback.bind(this));
	    this.reviveButton.on('tap', this.onReviveCallback.bind(this)).on('click', this.onReviveCallback.bind(this));
	}
	onReviveCallback(){
		this.hide()	
		this.screen.onReviveCallback();
	}
	onReestartCallback(){
		if(this.lost == 0){
			if(config.currentLevel < config.levels.length - 1)
			{
				config.currentLevel ++;				
			}
		}else if(this.lost == 1){
			config.currentLevel --;
			if(config.currentLevel <= 0)
			{
				config.currentLevel = 0;
			}
		}
		this.screen.initGame();	
	}
	onBackCallback(){	
		this.hide()	
		this.screen.onReestartCallback();
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