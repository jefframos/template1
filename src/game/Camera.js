// import Gamepad from './Gamepad'
import utils  from '../utils';
import config  from '../config';
export default class Camera{
	constructor(game, worldMap, bounds){
		this.game = game;
		this.entityFollow = null;
		this.velocity = {x:0, y:0};
		this.velocityPlus = {x:0, y:0};
		this.virtualVelocity = {x:0, y:0};
		this.cameraSpeed = {x:config.width * 0.5, y:config.height * 0.5};
		this.acceleration = {x:this.cameraSpeed.x/60, y:this.cameraSpeed.y/60};
		this.worldMap = worldMap;
		this.cameraSpeed = {x:config.width * 0.5, y:config.height * 0.5};
		this.acceleration = {x:this.cameraSpeed.x/60, y:this.cameraSpeed.y/60};
		this.cameraDelayStandard = {x:1};
		this.cameraDelay = {x:0};
		this.cameraStopping = {x:false};
		this.cameraMoving = {x:false};
		this.fixCamera = false;
		this.startDelay = -1;
		this.currentZoom = 1;
		this.maxZoom = 1.1;
		// this.maxZoom = 1.2;
		this.minZoom = 0.055;

		this.bounds = bounds?bounds:{x:config.width * 0.2, y:config.height * 0.2, w:config.width - config.width * 0.4, h:config.height - config.height * 0.4}
		//se a distancia minima da camera for pequena, parece que o cara ta bebado
		// this.cameraBounds = new PIXI.Graphics().lineStyle(5, 0xFF0000).drawRect(this.bounds.x - this.bounds.w/2,this.bounds.y-this.bounds.h/2,this.bounds.w,this.bounds.h);
		// this.cameraBounds.x = config.width / 2
		// this.cameraBounds.y = config.height / 2
		// this.cameraBounds.pivot.x = -this.bounds.w
		// this.worldMap.parent.addChild(this.cameraBounds);
	}
	
	follow(entity){
		this.entityFollow = entity;

		this.updatePosition(true);
	}

	shake(force, steps, time){
		if(!force){
			force = 1;
		}
		if(!steps){
			steps = 4;
		}
		if(!time){
			time = 1;
		}
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 50);
		let spliterForce = (force * 20);
		let speed = time / steps;
		let currentPosition = {x:this.worldMap.x, y:this.worldMap.y};
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.worldMap.position, speed, {x:currentPosition.x+ Math.random() * positionForce - positionForce/2, y:currentPosition.y+ Math.random() * positionForce - positionForce/2, ease:"easeNoneLinear"}));
		};

		timelinePosition.append(TweenLite.to(this.worldMap.position, speed, {x:currentPosition.x, y:currentPosition.y, ease:"easeeaseNoneLinear"}));		
	}

	unfollow(){
		this.entityFollow = null;
	}
	
	zoomOut(value){
		return
		this.currentZoom -= value?value:0.1;
		if(this.currentZoom < this.minZoom){
			this.currentZoom = this.minZoom;
		}
		this.zoom(this.currentZoom)
	}
	zoom2(value){
		this.currentZoom += value;
		if(this.currentZoom > this.maxZoom){
			this.currentZoom = this.maxZoom;
		}
		if(this.currentZoom < this.minZoom){
			this.currentZoom = this.minZoom;
		}
		this.zoom(this.currentZoom)
	}
	zoom(value, time, delay){
		// console.log('zoom', value);
		// this.cameraBounds.scale.set(value)
		this.currentZoom = value;	
		TweenLite.killTweensOf(this.worldMap.scale)
		TweenLite.to(this.worldMap.scale, time?time:0.5, {delay:delay?delay:0, x:this.currentZoom, y:this.currentZoom});//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
		//this.worldMap.scale.set(value);//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
	}
	zoomBounce(value, time, delay){


		this.currentZoom = value;	
		TweenLite.killTweensOf(this.worldMap.scale)
		TweenLite.to(this.worldMap.scale, time?time:0.5, {delay:delay?delay:0, x:this.currentZoom, y:this.currentZoom, ease:'easeOutBack'});//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
		//this.worldMap.scale.set(value);//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
	}
	updatePosition(force){

		// console.log('update position', force);
		if(!this.entityFollow){
			return
		}
		let globalEntityPosition = this.entityFollow.toGlobal(new PIXI.Point());
		let globalWorldPosition = this.worldMap.toGlobal(new PIXI.Point());
		// console.log(this.worldMap.x, globalEntityPosition.x);
		let gambs = 0.3;
		let plusY = config.height * 0.5;

		if(force){
			this.worldMap.pivot.x =this.entityFollow.x;
			this.worldMap.pivot.y =  this.entityFollow.y// - config.height * gambs + plusY;

			this.worldMap.x = config.width / 2
			this.worldMap.y = config.height /2//*gambs + plusY

			console.log(this.entityFollow.x,this.entityFollow.y);
			
			return
		}

		let wX = 0;
		let pX = 0;

		pX = this.entityFollow.x;
		wX = config.width / 2 - config.width * 0.2 * -this.entityFollow.side
		TweenLite.to(this.worldMap.pivot, 2 ,{x: pX});
		TweenLite.to(this.worldMap, 2 ,{x: wX});


		let pY = this.entityFollow.y;
		let wY = config.height * gambs + plusY

		TweenLite.to(this.worldMap.pivot, 0.5 ,{y: pY});
		TweenLite.to(this.worldMap, 0.5 ,{y: wY});

	}


	updateOnGroundPosition(force){
		if(!this.entityFollow){
			return
		}
		let globalEntityPosition = this.entityFollow.toGlobal(new PIXI.Point());
		// let globalWorldPosition = this.worldMap.toGlobal(new PIXI.Point());
		// console.log(this.worldMap.x, globalEntityPosition.x);
		let gambs = 0.3;
		let plusY = config.height * 0.5;
		let wX = 0;
		let pX = 0;

		let wY = config.height * gambs + plusY
		let pY = this.entityFollow.y;//config.height * gambs + plusY;
		// if(globalEntityPosition.x < this.bounds.x){
		pX = this.entityFollow.x;
		// this.worldMap.pivot.y = -globalEntityPosition.y;//- config.height * gambs}
		// this.worldMap.x = this.bounds.x
		wX = config.width/2 - config.width * 0.45 * this.entityFollow.side

		TweenLite.to(this.worldMap.pivot, 1 ,{x: pX});
		TweenLite.to(this.worldMap, 1 ,{x: wX});

		TweenLite.to(this.worldMap.pivot, 2 ,{y:pY});
		TweenLite.to(this.worldMap, 2 ,{y:wY});

	}
	updateAirPosition(force){
		if(!this.entityFollow){
			return
		}
		let globalEntityPosition = this.entityFollow.toGlobal(new PIXI.Point());
		let globalWorldPosition = this.worldMap.toGlobal(new PIXI.Point());
		// console.log(this.worldMap.x, globalEntityPosition.x);
		let gambs = 0.3;
		let plusY = config.height * 0.5;

		if(force){
			this.worldMap.pivot.x =this.entityFollow.x;
			this.worldMap.pivot.y =  this.entityFollow.y// - config.height * gambs + plusY;

			this.worldMap.x = config.width / 2
			this.worldMap.y = config.height *gambs + plusY

			return
		}

		let wX = 0;
		let pX = 0;

		pX = this.entityFollow.x;
		wX = config.width / 2 - config.width * 0.1 * -this.entityFollow.side
		TweenLite.to(this.worldMap.pivot, 2 ,{x: pX});
		TweenLite.to(this.worldMap, 2 ,{x: wX});


		let pY = this.entityFollow.y;
		let wY = config.height * gambs + plusY

		TweenLite.to(this.worldMap.pivot, 0.5 ,{y: pY});
		TweenLite.to(this.worldMap, 0.5 ,{y: wY});

		// this.worldMap.pivot.y = pY//this.entityFollow.y //- config.height * gambs + plusY
		// this.worldMap.y = wY//config.height * gambs + plusY

	}


	update(delta, type){

		if(!this.entityFollow){
			return;
		}

		if(this.startDelay > 0){
			this.startDelay -= delta;
			return;	
		}
		// console.log(type);
		let lessz = 1//0.1
		if(type == 'GROUND'){
			this.updateOnGroundPosition();
			this.zoom(0.6 * lessz)
		}
		else if(type == 'WALL'){
			this.updatePosition();
			this.zoom(1 * lessz, 1)
		}
		else if(type == 'AIR'){
			// this.updatePosition();
			this.updateAirPosition();
			this.zoom(0.8 * lessz)
		}

	}
	
}