import * as PIXI from 'pixi.js';
import utils  from '../../utils';
import AnimationManager  from './../entity/utils/AnimationManager';
import Entity  from './../entity/Entity';
export default class UISpawner extends Entity {

    constructor(game, entity) {

    	super(game);
        
        this.entity = entity;
        this.backShape = utils.getSprite('ingame/backtower.png');

        let team = this.entity.team + 1;


        if(this.entity.team == 0){
            this.entSprite1 = utils.getSprite('ingame/candy1.png');
            this.entSprite2 = utils.getSprite('ingame/candy2dead.png');
            this.entSprite2.y = 42;
        }else{
            this.entSprite1 = utils.getSprite('ingame/veg1.png');
            this.entSprite2 = utils.getSprite('ingame/veg2dead.png');
            this.entSprite2.y = 38;
        }

        this.entSprite1.x = 10;
        this.entSprite2.x = 105;


        this.entSprite1.y = 42;


        this.backShape.tint = this.entity.team == 0?0x0000FF:0x00FF00

        var style = {
            // fontFamily : 'Arial',
            fontSize : '10px',
            fill : this.entity.team == 0?'#0000bb':'#005500',
        };

        this.spawnedLabel = new PIXI.Text('0', style);
        this.killedLabel = new PIXI.Text('0', style);
        this.wavesLabel = new PIXI.Text('0', style);
        this.liveLabel = new PIXI.Text('0', style);


        this.addChild(this.backShape)
        this.addChild(this.entSprite1)
        this.addChild(this.entSprite2)

        this.addChild(this.spawnedLabel)
        this.addChild(this.killedLabel)
        this.addChild(this.wavesLabel)
        this.addChild(this.liveLabel)

        this.wavesLabel.x = 5
        this.liveLabel.x = 105

        this.spawnedLabel.x = 45


        this.spawnedLabel.y = 42
        
        this.killedLabel.x = 145
        this.killedLabel.y = 42
        // if(this.entity.team == 0){
        //     this.towerSprite.y = -13
        // }else{
            
        //     this.towerSprite.y = -35
        // }

        this.reset();
        // this.pivot.y = this.towerSprite.y

    }

    addLifeBar(pos, size, color) {
        let border = 1;
        this.barContainer = new PIXI.Container();
        this.addChild(this.barContainer);
        this.barContainer.x = pos.x;
        this.barContainer.y = pos.y;

        this.backBar = new PIXI.Graphics()
        this.backBar.beginFill(0);
        this.backBar.drawRect(-border, -border, size.w + border*2, size.h + border*2);

        this.backBarRed = new PIXI.Graphics()
        this.backBarRed.beginFill(0xFF0000);
        this.backBarRed.drawRect(0, 0, size.w, size.h);

        this.backBarGreen = new PIXI.Graphics()
        this.backBarGreen.beginFill(color);
        this.backBarGreen.drawRect(0, 0, size.w, size.h);

        this.barContainer.addChild(this.backBar);
        this.barContainer.addChild(this.backBarRed);
        this.barContainer.addChild(this.backBarGreen);

        this.barContainer.pivot.set((size.w + border*2)/2, (size.h + border*2)/2);
    }

    updateLifeBar() {
        if(this.entity.killed){
            this.backShape.tint = 0xFF0000;
            this.x = - 20 * this.scale.x;
            this.updateable = false;
        }
        if(this.backBarGreen && this.backBarGreen.parent){
            this.backBarGreen.scale.x = this.entity.life / this.entity.maxLife;
            this.barContainer.scale.x = this.scale.x < 0?-1:1;
        }
    }
     reset() {
        //this.addLifeBar({x:this.backShape.width / 2, y:this.backShape.height + 2}, {w:this.backShape.width, h:5}, this.entity.team == 0?0x0000FF:0x00FF00);
        this.updateable = true;
     }


    build ( ) {
        if(this.scale.x < 0){
            this.spawnedLabel.scale.x = -1;
            this.spawnedLabel.x += -this.spawnedLabel.width


            this.killedLabel.scale.x = -1;
            this.killedLabel.x += -this.killedLabel.width


            this.wavesLabel.scale.x = -1;
            this.wavesLabel.x += -this.wavesLabel.width

            this.liveLabel.scale.x = -1;
            this.liveLabel.x += -this.liveLabel.width
        }

        let scale = 0.6
        this.spawnedLabel.scale.set(scale);
        this.killedLabel.scale.set(scale);
        this.wavesLabel.scale.set(scale);
        this.liveLabel.scale.set(scale);
    }
    
    update ( delta ) {
        if(!this.updateable){
            return
        }

        this.killedLabel.text = this.entity.totalKilled;
        this.spawnedLabel.text = this.entity.totalEntities;
        this.wavesLabel.text = 'wave: '+this.entity.totalWaves;
        this.liveLabel.text = 'alive: '+this.entity.currentEntities.length;
        //this.updateLifeBar();
    }
}
