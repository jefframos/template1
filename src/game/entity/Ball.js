import * as PIXI from 'pixi.js';
import config  from '../../config';
export default class Ball extends PIXI.Container {

    constructor(game, radius = 20) {
        super();  
        this.game = game;
        this.virtualVelocity = {x:0,y:0};
        this.velocity = {x:0,y:0};
        this.speed = {x:250,y:250};
        this.friction = {x:100,y:100};
        this.rotationInfluence = {x:0,y:0};
        this.rotationSpeed = 0;
        this.scaleFator = 1;
        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.5;
        this.radius = radius;
        this.externalRadius = this.radius*1;
        this.static = false;
        this.side = 1;
        this.maxLife = 5;
        this.life = 5;
        this.collidable = true;

        this.spriteVelocity = {x:0, y:0};
        this.spriteGravityStandard = 2000;
        this.spriteGravity = 2000;
        this.shootYSpeed = -630;
        this.spriteDirection = 1;


        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.spriteContainer = new PIXI.Container();
        this.container.addChild(this.spriteContainer);

        // if(this.radius > 20){

        this.sprite = PIXI.Sprite.fromImage('assets/images/onion.png');
        this.spriteContainer.addChild(this.sprite);
        this.sprite.anchor.set(0.5);
        console.log(this.radius, this.sprite.width);
        this.sprite.scale.set(this.radius / 150);
        // }

        console.log(this.container.skew.scope);
        
        this.externalColisionCircle = new PIXI.Graphics();
        this.externalColisionCircle.lineStyle(1,0xFFFF00);
        this.externalColisionCircle.drawCircle(0,0,this.radius);
        this.externalColisionCircle.alpha = 0.8;
        this.container.addChild(this.externalColisionCircle);

        this.shooting = false;
    }
   

    shoot(force) {
        this.shooting = true;
        this.rotationInfluence.x = this.rotationSpeed * 850;
        this.spriteVelocity.y = Math.abs(this.spriteVelocity.y);
        this.spriteVelocity.y += this.shootYSpeed * force*0.5;

        this.spriteGravity = this.spriteGravityStandard * force*0.5

        console.log(force);

        
        this.spriteDirection = 1;
        this.sprite.y = 0;
    }
    reset() {
        this.virtualVelocity = {x:0,y:0};
        this.velocity = {x:0,y:0};

        this.rotationInfluence = {x:0,y:0};
        this.rotationSpeed = 0;
        this.shooting = false;

        if(Math.random() < 0.5){
            this.spriteVelocity = {x:0, y:0};
            this.spriteContainer.y = 0;
            this.x = config.width / 2;
        }else{
            this.spriteContainer.y = - Math.random() * 150;
            this.spriteVelocity.y = Math.abs(this.spriteVelocity.y);
            this.virtualVelocity.x = -this.speed.x;
            this.velocity.x = -this.speed.x;
        }
    }
    getRadius() {
        return this.standardScale * this.radius;
    }
    getExternalRadius() {
        return this.standardScale * this.externalRadius;
    }

    update ( delta ) {
        // delta*= 0.2

        this.x += this.velocity.x * delta * this.scale.x;
        this.y += this.velocity.y * delta * this.scale.y;

        let ang = Math.atan2(this.velocity.y, this.velocity.x)
        //this.container.skew.x = this.x - config.width / 2//Math.sin(ang)
        //this.container.skew.y = 0//Math.cos(ang)
        // console.log(ang * 180 / 3.14);
        TweenLite.to(this.spriteContainer.scale, 0.5, {x:Math.sin(ang)*0.2 + 1, y:Math.cos(ang)*0.2+1})
        //this.spriteContainer.scale.set(Math.sin(ang)*0.2 + 1, Math.cos(ang)*0.2+1)

        let percentage = Math.abs((Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) / 
            (Math.abs(this.speed.x) + Math.abs(this.speed.y)));
        // console.log(this.rotationSpeed);
        this.sprite.rotation += this.rotationSpeed * percentage * 0.5;

        if(this.shooting && percentage == 0){
            this.game.reset();
        }
        if(percentage){
            this.velocity.x += this.rotationInfluence.x * delta * percentage;

            if(this.spriteContainer.y > 0){
                this.spriteVelocity.y = this.shootYSpeed
            }
            // console.log(this.rotationInfluence.x);
            this.spriteContainer.x += this.spriteVelocity.x * delta * this.scale.x;
            this.spriteContainer.y += this.spriteVelocity.y * delta * this.scale.y;
            this.spriteVelocity.y += this.spriteGravity * delta;

            // console.log(this.spriteVelocity.y);

            // if(this.spriteVelocity.y < 0){
            // }
            // this.velocity.y += Math.cos(this.rotation);
        }


        if(this.rotationInfluence.x < 0){
            this.rotationInfluence.x += this.friction.x * delta;
            if(this.rotationInfluence.x > 0){
                this.rotationInfluence.x = 0
            }
        }else if(this.rotationInfluence.x > 0){
            this.rotationInfluence.x -= this.friction.x * delta;
            if(this.rotationInfluence.x < 0){
                this.rotationInfluence.x = 0
            }
        }



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
