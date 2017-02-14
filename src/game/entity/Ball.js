import * as PIXI from 'pixi.js';
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
        this.externalRadius = this.radius*1.1;
        this.static = false;
        this.side = 1;
        this.maxLife = 5;
        this.life = 5;
        this.collidable = true;


        this.container = new PIXI.Container();
        this.addChild(this.container);

        // if(this.radius > 20){
            this.sprite = new PIXI.Sprite(PIXI.Texture.from('assets/images/onion.png'));
            this.container.addChild(this.sprite);
            this.sprite.anchor.set(0.5);
            console.log(this.radius, this.sprite.width);
            this.sprite.scale.set(this.radius / 50);
        // }

        // this.externalColisionCircle = new PIXI.Graphics();
        // this.externalColisionCircle.lineStyle(1,0xFFFF00);
        // this.externalColisionCircle.drawCircle(0,0,this.radius);
        // this.externalColisionCircle.alpha = 0.8;
        // this.container.addChild(this.externalColisionCircle);

        this.shooting = false;
    }
   

    shoot() {
        this.shooting = true;
        this.rotationInfluence.x = this.rotationSpeed * 1000;
        console.log(this.rotationSpeed);
        console.log(this.rotationInfluence);
    }
    reset() {
        this.virtualVelocity = {x:0,y:0};
        this.velocity = {x:0,y:0};
        this.rotationInfluence = {x:0,y:0};
        this.rotationSpeed = 0;
        this.shooting = false;
    }
    getRadius() {
        return this.standardScale * this.radius;
    }
    getExternalRadius() {
        return this.standardScale * this.externalRadius;
    }

    update ( delta ) {
        this.x += this.velocity.x * delta * this.scale.x;
        this.y += this.velocity.y * delta * this.scale.y;

        let percentage = Math.abs((Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) / 
            (Math.abs(this.speed.x) + Math.abs(this.speed.y)));
        // console.log(this.rotationSpeed);
        this.rotation += this.rotationSpeed * percentage * 0.5;

        if(this.shooting && percentage == 0){
            this.game.reset();
        }
        if(percentage){
            this.velocity.x += this.rotationInfluence.x * delta * percentage;

            // console.log(this.rotationInfluence.x);
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
