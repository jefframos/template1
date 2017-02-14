import plugins from './plugins';
import config  from './config';
import Game from './Game';
import ScreenManager from './screenManager/ScreenManager';
import InitScreen from './game/screen/InitScreen';
import LoadScreen from './game/screen/LoadScreen';



PIXI.loader
	// .add('./assets/map.json')
	.add('./assets/images/salsicha.json')
	.add('./assets/images/bg.png')
	.add('./assets/images/ringDisplaceMap.jpg')
	.add('./assets/images/onion.png')
	// .add('./assets/images/ui.json')
	.add('./assets/fonts/luckiestguy-webfont.woff')
	.add('./assets/fonts/luckiestguy-webfont.woff2')
	.add('./assets/fonts/stylesheet.css')
	.add('./assets/fonts/specimen_files/specimen_stylesheet.css')
	.load(configGame);

function configGame(){

	window.game = new Game(config);
	
	//create screen manager
	let screenManager = new ScreenManager();
	//add screens
	let initScreen = new InitScreen('InitScreen');
	let loadScreen = new LoadScreen('LoadScreen');

	game.stage.addChild(screenManager);

	screenManager.addScreen(initScreen);
	screenManager.addScreen(loadScreen);
	//change to init screen
	screenManager.forceChange('LoadScreen');

	// screenManager.filters = [this.pixelate]

	game.start();
}
