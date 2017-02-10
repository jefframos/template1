import * as PIXI from 'pixi.js';

export default class Game {
	constructor(config){
		const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;
		//config.width = window.screen.width;

		//config.height = window.screen.height;
		this.ratio = config.width / config.height;
		window.renderer = new Renderer(config.width || 800, config.height || 600, config.rendererOptions);
		document.body.appendChild(window.renderer.view);

		this.stage = new PIXI.Container();
		//this.animationLoop = new PIXI.AnimationLoop(window.renderer);
		//this.animationLoop.on('prerender', this.update.bind(this));
		this.resize();

		this.frameskip = 1;
		this.update();

	}
	resize() {
		if (window.innerWidth / window.innerHeight >= this.ratio) {
			var w = window.innerHeight * this.ratio;
			var h = window.innerHeight;
		} else {
			var w = window.innerWidth;
			var h = window.innerWidth / this.ratio;
		}
		window.renderer.view.style.width = w + 'px';
		window.renderer.view.style.height = h + 'px';
	}

	update(){
		for (var i = this.frameskip - 1; i >= 0; i--) {
			for(let i = 0; i < this.stage.children.length; i++){
				if(this.stage.children[i].update){
					this.stage.children[i].update(1/60);
				}
			}
		}
		window.renderer.render(this.stage);
		requestAnimationFrame(this.update.bind(this));
	}

	start(){
	//	this.animationLoop.start();
	}

	stop(){
	//	this.animationLoop.stop();
	}
}
