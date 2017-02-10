import * as PIXI from 'pixi.js';

export default class AnimationManager {

    constructor(animationModel, animationContainer) {

        this.animationModel = animationModel;
        this.animationContainer = animationContainer;

        for (var i = 0; i < this.animationModel.length; i++) {
            let texturesList = [];
            this.animationModel[i]
            if(this.animationModel[i].singleFrame){
                var texture = PIXI.Texture.fromFrame(this.animationModel[i].src+'.png');
                texturesList.push(texture);
                texture.smooth = true;
            }else{
                for (let j = 0; j < this.animationModel[i].totalFrames; j++)
                {
                    if(j+1 > 9){
                        var texture = PIXI.Texture.fromFrame(this.animationModel[i].src+ (j+1) + '.png');
                    }else{
                        var texture = PIXI.Texture.fromFrame(this.animationModel[i].src  +'0'+ (j+1) + '.png');
                    }

                    texturesList.push(texture);
                    texture.smooth = true;
                }
            }

            this.animationModel[i].movieClip = new PIXI.extras.AnimatedSprite(texturesList);
            if(this.animationModel[i].loop != undefined){
                this.animationModel[i].movieClip.loop = this.animationModel[i].loop;
                this.animationModel[i].movieClip.onComplete = this.animationFinished;
            }
            this.animationModel[i].movieClip.anchor.set(this.animationModel[i].anchor.x,this.animationModel[i].anchor.y);
            this.animationModel[i].movieClip.x = this.animationModel[i].position.x;
            this.animationModel[i].movieClip.y = this.animationModel[i].position.y;
            this.animationModel[i].movieClip.rotation = this.animationModel[i].rotation?this.animationModel[i].rotation:0;
            this.animationModel[i].movieClip.animationSpeed = this.animationModel[i].animationSpeed;
            this.animationModel[i].movieClip.gotoAndStop(this.animationModel[i].startFrame);
            this.animationContainer.addChild(this.animationModel[i].movieClip);

        }

        this.ableToChangeAnimation = true;

        this.startCallback = function(){};
        this.finishCallback = function(){};
        // this.hideAll();
        // this.stopAll();
        // this.changeState('idle');
    }
    showJust(list) {
        this.hideAll();
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < this.animationModel.length; j++) {
                if(this.animationModel[j].label == list[i])
                {
                    this.animationModel[j].movieClip.visible = true
                }
            }
        }
    }
    stopCurrent() {
        let current = this.animationModel[this.getAnimationID(this.state)];current.movieClip.gotoAndStop(current.startFrame);
    }
    hideCurrent() {
        this.animationModel[this.getAnimationID(this.state)].movieClip.visible = false;
    }
    hideAll() {
        for (var i = 0; i < this.animationModel.length; i++) {
            let animData = this.animationModel[i];
            animData.movieClip.visible = false;
        }
    }
    stopAll() {
        for (var i = 0; i < this.animationModel.length; i++) {
            let animData = this.animationModel[i];
            if(!animData.movieClip.playing){
                animData.movieClip.stop();
            }
        }
    }
    playMovieclip(id, forcePlay) {
        let animData = this.animationModel[id];
        if(animData.haveCallback){
            // this.ableToChangeAnimation = false;
        }else{
            this.ableToChangeAnimation = true;
        }
        if(!animData.movieClip.playing || forcePlay){
            this.startCallback();
            animData.movieClip.gotoAndPlay( animData.startFrame);
            animData.movieClip.visible = true;
            //console.log('q',animData.movieClip);
        }
    }

    getAnimation(label) {
        for (var i = 0; i < this.animationModel.length; i++) {
            if(this.animationModel[i].label == label){
                return this.animationModel[i]
            }            
        }
        return null;
    }

    getAnimationID(label) {
        for (var i = 0; i < this.animationModel.length; i++) {
            if(this.animationModel[i].label == label){
                return i
            }            
        }
        return -1;
    }
    changeState(state, force){
        //console.log(state);
        if(!force && (this.state == state || !this.ableToChangeAnimation)){
            return false;
        }

        //console.log(state);

        if(this.state){
            this.stopCurrent()
            this.hideCurrent()
        }
        this.state = state;
        this.updateState();
        return true;
    }
    updateState() {
        // console.log('updateState');
        this.playMovieclip(this.getAnimationID(this.state));
    }
    updateAnimations(){
        //console.log(this.animationModel[this.getAnimationID(this.state)].movieClip.playing);
        //console.log(this.state, this.getAnimationID(this.state),  this.animationModel[this.getAnimationID(this.state)].haveCallback, this.animationModel[this.getAnimationID(this.state)].movieClip.playing);
         if(this.state && 
            this.animationModel[this.getAnimationID(this.state)].haveCallback && 
            !this.animationModel[this.getAnimationID(this.state)].movieClip.playing)
        {
            //console.log(this.finishCallback);
            this.finishCallback();
        }
    }
}
