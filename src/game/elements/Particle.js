import * as PIXI from 'pixi.js';

export default class Particle extends PIXI.Container {
	/**
		params.particleSrc
		params.blendMode
		params.tint
		params.scale
		params.scaleIncrease
		params.velocity
		params.alphascale
		params.lifetime
	**/
    constructor(params) {

    	super();

        this.params = params;
         // this.sprite = PIXI.Sprite.fromFrame('additiveTriangleParticle.jpg');
        // this.sprite = PIXI.Sprite.fromFrame('additiveHardParticle.jpg');
        this.reset();
        

    }
    reset(){
        this.sprite = this.params.sprite?this.params.sprite:(PIXI.Sprite.fromFrame(this.params.particleSrc?this.params.particleSrc:'additiveParticle.png'));
        this.sprite.blendMode = this.params.blendMode != undefined ?this.params.blendMode:PIXI.BLEND_MODES.ADD;
        this.spawnArea = this.params.spawnArea != undefined ?this.params.spawnArea:{x:0,y:0,w:1,h:1};
        this.sprite.anchor.set(0.5);
        this.sprite.tint = this.params.tint?this.params.tint:0xFFFFFF
        this.sprite.scale.set(this.params.scale != undefined ?this.params.scale:2.5);
        //this.addChild(this.sprite);
        this.sprite.alpha = 1;
        this.scaleIncrease = this.params.scaleIncrease != undefined?this.params.scaleIncrease:{x:0,y:0};
        this.kill = false;
        this.velocity = this.params.velocity?this.params.velocity:{x:(Math.random()-0.5)/2, y:-Math.random()*1.2}
        this.alphaScale = this.params.alphaScale != null?this.params.alphaScale:[0,0.2,0];
        this.maxLifetime = this.params.lifetime?this.params.lifetime:2;
        this.rotationSpeed = this.params.rotationSpeed?this.params.rotationSpeed:0;
        this.life = this.maxLifetime;
        this.nlife = 0;
        this.gravity = this.params.gravity?this.params.gravity:0;

        this.sprite.x = (this.spawnArea.w - this.spawnArea.x) * Math.random();
        this.sprite.y = (this.spawnArea.h - this.spawnArea.y) * Math.random();

    }
    update ( dt ) {
    	this.sprite.rotation += this.rotationSpeed;
    	this.life -= dt;
    	this.nlife = this.life / this.maxLifetime;
    	this.velocity.y +=this.gravity;
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;
        this.nAlpha = this.updateAlphaScale(1-this.nlife);
        if(this.nAlpha)
        	this.sprite.alpha = this.nAlpha//!this.nAlpha?1:this.nAlpha

        this.sprite.scale.x += this.scaleIncrease.x;
        this.sprite.scale.y += this.scaleIncrease.y;
        if(this.life < 0){
            this.kill = true;
            if(this.sprite.parent){
                this.sprite.parent.removeChild(this.sprite);
            }
        }
    }
	updateAlphaScale ( nTime ) {
		let tempId = Math.floor(nTime * this.alphaScale.length)

		//console.log(tempId);
		if(this.alphaScale.length <= 1 || tempId >= this.alphaScale.length - 1){
			return false;
		}
		let tempValue = this.alphaScale[tempId]
		let transition = this.alphaScale[tempId + 1] - tempValue

		let mtime = 1/ this.alphaScale.length
		let time = nTime - (tempId * mtime)
		let startvalue = tempValue;
		let changevalue = this.alphaScale[tempId + 1] - startvalue;

		let ret = changevalue*time/ mtime + startvalue
		return ret;
	}

}
