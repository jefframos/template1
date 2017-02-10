import * as PIXI from 'pixi.js';

export default class Mouse extends PIXI.Container {

    constructor() {

    	super();

        this.mcContainer = new PIXI.Container();
        this.addChild(this.mcContainer);

        let idleTextures = [];
        for (let i = 0; i < 15; i++)
        {
            if(i+1 > 9){
                var texture = PIXI.Texture.fromFrame('mouseIdle00' + (i+1) + '.png');
            }else{
                var texture = PIXI.Texture.fromFrame('mouseIdle000' + (i+1) + '.png');
            }
                idleTextures.push(texture);
                texture.smooth = true;
        }
        this.mouseIdle = new PIXI.MovieClip(idleTextures);
        this.mouseIdle.animationSpeed = 0.4
        this.mouseIdle.gotoAndPlay(0);
        this.mcContainer.addChild(this.mouseIdle);

        let flipTextures = [];
        for (let i = 0; i < 21; i++)
        {
            if(i+1 > 9){
                var texture = PIXI.Texture.fromFrame('mouseFlip00' + (i+1) + '.png');
            }else{
                var texture = PIXI.Texture.fromFrame('mouseFlip000' + (i+1) + '.png');
            }
                flipTextures.push(texture);
                texture.smooth = true;
        }
        this.mouseFlip = new PIXI.MovieClip(flipTextures);
        this.mouseFlip.animationSpeed = 0.4;
        this.mouseFlip.x = 1
        this.mouseFlip.y = 0
        this.mouseFlip.gotoAndStop(0);
        this.mcContainer.addChild(this.mouseFlip);


        let runTextures = [];
        for (let i = 0; i < 14; i++)
        {
            if(i+1 > 9){
                var texture = PIXI.Texture.fromFrame('mouseRun00' + (i+1) + '.png');
            }else{
                var texture = PIXI.Texture.fromFrame('mouseRun000' + (i+1) + '.png');
            }
                runTextures.push(texture);
                texture.smooth = true;
        }
        this.mouseRun = new PIXI.MovieClip(runTextures);
        this.mouseRun.animationSpeed = 0.5;
        this.mouseRun.x = -15
        this.mouseRun.y = -5
        this.mouseRun.gotoAndStop(0);
        this.mcContainer.addChild(this.mouseRun);

        this.standardScale = 0.5;

        this.mouseIdle.scale.set(this.standardScale)
        this.mouseFlip.scale.set(this.standardScale)
        this.mouseRun.scale.set(this.standardScale)
        this.mouseIdle.anchor.set(0.5,1);
        this.mouseFlip.anchor.set(0.5,1);
        this.mouseRun.anchor.set(0.5,1);


        this.side = 1;
        this.state = 0;

        this.updateState();
        // this.scale.set(1.5)

        this.timer = 3.0;
        this.nextAction = this.changeState;
        // setTimeout(() => {
        //     this.changeState();
        // }, 3000);
        this.velocity = {x:0, y:0};
    }

    changeState (  ) {
        if(this.state == 0 || this.state == 1){
            this.state = 2;
            this.mouseRun.gotoAndPlay(7);
            this.velocity.x = 255 * this.side;

            this.timer = 1.5;
            this.nextAction = this.changeState;

            // setTimeout(() => {
            //     this.changeState();
            // }, 2300);
        }else if(this.state == 2){
            this.state = 0;
            this.velocity.x = 0;

            this.mouseIdle.scale.x = this.standardScale*1.1
            this.mouseIdle.scale.y = this.standardScale*0.9
            TweenLite.to(this.mouseIdle.scale,1,{x:this.standardScale, y:this.standardScale, ease:'easeOutElastic'});

            this.timer = 1.0;
            this.nextAction = this.flipMouse;
            // setTimeout(() => {
            //     this.flipMouse();
            // }, 3000);
        }
        this.updateState();
    }

    afterFlipMouse (  ) {
            this.scale.x = this.side;//= -1;
            this.state = 0;

            this.mouseFlip.gotoAndStop(0);
            
            TweenLite.to(this.mouseIdle.scale,0.4,{x:this.standardScale*1.1, y:this.standardScale*0.9});
            TweenLite.to(this.mouseIdle.scale,1,{delay:0.4, x:this.standardScale, y:this.standardScale, ease:'easeOutElastic'});

            this.updateState();

            this.timer = 2.0;
            this.nextAction = this.changeState;
            // setTimeout(() => {
            //     this.changeState();
            // }, 2000);
    }
    flipMouse (  ) {
        this.state = 1;
        
        this.mouseFlip.scale.set(this.standardScale)
        TweenLite.to(this.mouseFlip.scale,0.5,{x:this.standardScale*1.1, y:this.standardScale*0.9});

        this.mouseFlip.gotoAndPlay(0);
        this.updateState();
        this.side *= -1;

        this.timer = 0.86;
        this.nextAction = this.afterFlipMouse;
        // setTimeout(() => {
        //     this.afterFlipMouse();
        // }, 850);
    }
    updateState (  ) {
        console.log('updateState', this.state);
        switch (this.state){
            case 0:
                this.mouseIdle.visible = true;
                this.mouseFlip.visible = false;
                this.mouseRun.visible = false;
            break;
            case 1:
                this.mouseIdle.visible = false;
                this.mouseFlip.visible = true;
                this.mouseRun.visible = false;
            break;
            case 2:
                this.mouseIdle.visible = false;
                this.mouseFlip.visible = false;
                this.mouseRun.visible = true;
            break;
        }
    }
    update ( dt ) {
        this.timer -= dt;

        if(this.timer <= 0){
            this.timer = 999999;
            console.log('next action');
            this.nextAction();
        }
        this.x += this.velocity.x * dt;
    	this.y += this.velocity.y * dt;
    }	
}
