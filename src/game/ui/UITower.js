import * as PIXI from 'pixi.js';
import utils  from '../../utils';
import AnimationManager  from './../entity/utils/AnimationManager';
import Entity  from './../entity/Entity';
export default class UITower extends Entity {

    constructor(game, entity) {

    	super(game);
        
        this.entity = entity;
        this.backShape = utils.getSprite('ingame/backtower.png');

        let team = this.entity.team + 1;

        this.towerSprite = utils.getSprite('ingame/tower'+team+'.png');

        this.backShape.tint = this.entity.team == 0?0x0000FF:0x00FF00
        this.addChild(this.backShape)
        this.addChild(this.towerSprite)

        if(this.entity.team == 0){
            this.towerSprite.y = -13
        }else{
            
            this.towerSprite.y = -35
        }

        this.reset();
        this.pivot.y = this.towerSprite.y

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
            this.visible = false;
        }
        if(this.backBarGreen && this.backBarGreen.parent){
            this.backBarGreen.scale.x = this.entity.life / this.entity.maxLife;
            this.barContainer.scale.x = this.scale.x < 0?-1:1;
        }
    }
     reset() {
        this.addLifeBar({x:this.backShape.width / 2, y:this.backShape.height + 2}, {w:this.backShape.width, h:5}, this.entity.team == 0?0x0000FF:0x00FF00);
        this.updateable = true;
     }


    build ( ) {

    }
    
    update ( delta ) {
        if(!this.updateable){
            return
        }
        this.updateLifeBar();
    }
}
