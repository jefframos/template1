import * as PIXI from 'pixi.js';
export default class Ball extends PIXI.Container {

    constructor(debug) {  
        super();  
        this.virtualVelocity = {x:0,y:0};
        this.velocity = {x:0,y:0};
        this.speed = {x:600,y:600};
        this.friction = {x:100,y:100};
        this.scaleFator = 1;
        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.5;
        this.radius = 20;
        this.externalRadius = 100;
        this.static = false;
        this.side = 1;
        this.maxLife = 5;
        this.life = 5;
        this.collidable = true;

        this.container = new PIXI.Container();

        this.addChild(this.container);

        this.externalColisionCircle = new PIXI.Graphics();
        this.externalColisionCircle.lineStyle(1,0xFFFF00);
        this.externalColisionCircle.drawCircle(0,0,this.radius);
        this.externalColisionCircle.alpha = 0.8;
        this.container.addChild(this.externalColisionCircle);


    }
   

    getRadius() {
        return this.standardScale * this.radius;
    }
    getExternalRadius() {
        return this.standardScale * this.externalRadius;
    }

    update ( delta ) {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;

        if(this.velocity.x < this.virtualVelocity.x){
            this.velocity.x += this.friction.x * delta;
            if(this.velocity.x > this.virtualVelocity.x){
                this.velocity.x = this.virtualVelocity.x
            }
        }else if(this.velocity.x > this.virtualVelocity.x){
            this.velocity.x -= this.friction.x * delta;
            if(this.velocity.x < this.virtualVelocity.x){
                this.velocity.x = this.virtualVelocity.x
            }
        }

        if(this.velocity.y < this.virtualVelocity.y){
            this.velocity.y += this.friction.y * delta;
            if(this.velocity.y > this.virtualVelocity.y){
                this.velocity.y = this.virtualVelocity.y
            }
        }else if(this.velocity.y > this.virtualVelocity.y){
            this.velocity.y -= this.friction.y * delta;
            if(this.velocity.y < this.virtualVelocity.y){
                this.velocity.y = this.virtualVelocity.y
            }
        }
    }	
}
