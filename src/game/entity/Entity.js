import * as PIXI from 'pixi.js';
export default class Entity extends PIXI.Container {

    constructor(debug) {  
        super();  
        this.virtualVelocity = {x:0,y:0};
        this.velocity = {x:0,y:0};
        this.scaleFator = 1;
        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.5;
        this.radius = 50;
        this.externalRadius = 100;
        this.static = false;
        this.side = 1;
        this.maxLife = 5;
        this.life = 5;
        this.collidable = true;



    }
    removeLifeBar() {
        if(this.barContainer && this.barContainer.parent){
            this.barContainer.parent.removeChild(this.barContainer);
        }
    }
    updateLifeBar() {
        if(this.backBarGreen && this.backBarGreen.parent){
            this.backBarGreen.scale.x = this.life / this.maxLife;
            this.barContainer.scale.x = this.side;
        }
    }

    addLifeBar(pos, size, color) {
        this.barContainer = new PIXI.Container();
        this.addChild(this.barContainer);
        this.barContainer.x = pos.x;
        this.barContainer.y = pos.y;

        this.backBar = new PIXI.Graphics()
        this.backBar.beginFill(0);
        this.backBar.drawRect(-4, -4, size.w + 8, size.h + 8);

        this.backBarRed = new PIXI.Graphics()
        this.backBarRed.beginFill(0xFF0000);
        this.backBarRed.drawRect(0, 0, size.w, size.h);

        this.backBarGreen = new PIXI.Graphics()
        this.backBarGreen.beginFill(color);
        this.backBarGreen.drawRect(0, 0, size.w, size.h);

        this.barContainer.addChild(this.backBar);
        this.barContainer.addChild(this.backBarRed);
        this.barContainer.addChild(this.backBarGreen);

        this.barContainer.pivot.set((size.w + 8)/2, (size.h + 8)/2);
    }
    hit(power) {
        this.life -= power;
        if(this.life <= 0){
            this.dead();
        }
        return true
    }
    dead() {
        this.kill = true;
    }
    debugCollision() {
        // return
        this.colisionCircle = new PIXI.Graphics();
        this.colisionCircle.lineStyle(1,0xFF0000);
        this.colisionCircle.drawCircle(0,0,this.radius);
        this.colisionCircle.alpha = 0.8;
        this.addChild(this.colisionCircle);


        if(!this.externalRadius){
            return;
        }
        this.externalColisionCircle = new PIXI.Graphics();
        this.externalColisionCircle.lineStyle(1,0xFFFF00);
        this.externalColisionCircle.drawCircle(0,0,this.externalRadius);
        this.externalColisionCircle.alpha = 0.8;
        this.addChild(this.externalColisionCircle);
    }

    getRadius() {
        return this.standardScale * this.radius;
    }
    getExternalRadius() {
        return this.standardScale * this.externalRadius;
    }
    setDistance(value) {
        this.standardScale = (value * this.starterScale*0.7 + this.starterScale*0.3) * this.scaleFator;
        // this.standardScale = (value * 0.35 + 0.15) * this.scaleFator;
        this.speedScale = this.standardScale / this.starterScale;
        this.updateScale();
        // this.updateTint(value);
    }
    updateAlpha(value) {
        TweenLite.to(this.animationContainer, 0.5, {alpha:value});
        // this.animationContainer.alpha = value;//0xff0000
    }
    updateTint(value) {
        this.animationContainer.alpha = value * 0.4 + 0.6;//0xff0000
    }
    updateScale() {
        this.scale.x = (this.standardScale) * this.side;
        this.scale.y = this.standardScale
    }

    update ( delta ) {
    }	
}
