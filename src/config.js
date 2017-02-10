export default {
	width: 414,
	height: 736,
	webgl: true,
	tileWidth: true,
	effectsLayer:null,
	colors: {
		background: 0x61C5CC,
		wall:{
			standard:0x789FD0,
			slippery:0x089FD0,
			fast:0x789F00,
		},
		player: 0xF06D6D,
	},
	rendererOptions: {
		//pixi rendererOptions
		resolution:1,
		antialias: true,
		backgroundColor : 0x77A162
	},
	levels:[]
}
