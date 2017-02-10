import config from './config';
export default {
    getRandomValue(array, exception) {
        let value = array[Math.floor(Math.random() * array.length)];
        if (exception) {
            let equal = true;
            while (equal) {
                equal = false;
                for (let i = 0; i < exception.length; i++) {
                    if (exception[i] == value) {
                        equal = true;
                    }
                }
                if (equal) {
                    value = array[Math.floor(Math.random() * array.length)]
                }
            }
        }
        return value
    },
    alphabetCompare(a,b) {
        var yA = a.type;
        var yB = b.type;
        if (yA < yB){
            return -1;
        }
        if (yA > yB){
            return 1;
        }
        return 0;
    },
    xCompare(a,b) {
        var yA = a.x;
        var yB = b.x;        
        if (yA > yB){
            return -1;
        }
        if (yA < yB){
            return 1;
        }
        return 0;
    },
    distCompare(a,b) {
        var yA = a.dist;
        var yB = b.dist;
        if(yA === yB){
            return 0;
        }
        if(a.noDepth || b.noDepth){
            return 0;
        }
        if (yA < yB){
            return -1;
        }
        if (yA > yB){
            return 1;
        }
        return 0;
    },
    depthCompare(a,b) {
        var yA = a.y;
        var yB = b.y;
        if(yA === yB){
            return 0;
        }
        if(a.noDepth || b.noDepth){
            return 0;
        }
        if (yA < yB){
            return -1;
        }
        if (yA > yB){
            return 1;
        }
        return 0;
    },
    createNoiseTexture(config) {

    	var params = config?config:{};

        var canvas = document.createElement('canvas');
        canvas.width = params.width?params.width:32
        canvas.height = params.height?params.height:32

        var ctx = canvas.getContext('2d'),
            x, y,
            number,
            opacity = params.opacity?params.opacity:0.2

        for (x = 0; x < canvas.width; x++) {
            for (y = 0; y < canvas.height; y++) {
                number = Math.floor(Math.random() * 60);
                ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
                ctx.fillRect(x, y, 1, 1);
            }
        }

        var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
        sprite.anchor.set(0.5);
        return sprite;
    },

    createDotTexture(config) {

    	var params = config?config:{};

        var canvas = document.createElement('canvas');
        canvas.width = params.width?params.width:32
        canvas.height = params.height?params.height:32

        var ctx = canvas.getContext('2d');


       
        var x = canvas.width / 2,
            y = canvas.height / 2,
            // Radii of the white glow.
            innerRadius = config.innerRadius?config.innerRadius:0,
            outerRadius = config.outerRadius?config.outerRadius:canvas.width*0.3,
            // Radius of the entire circle.
            radius = canvas.width;

        var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, '#333');
         // gradient.addColorStop(0.75, '#030303');
         gradient.addColorStop(0.75, '#020202');
         gradient.addColorStop(0.95, '#010101');
        gradient.addColorStop(0.7, 'black');

        ctx.arc(x, y, radius, 0, 2 * Math.PI);

        ctx.fillStyle = gradient;
        ctx.fill();

        var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
        sprite.anchor.set(0.5);
        return sprite;
    },

    perlinNoise(config) {
        var params = config?config:{};
    	
        var canvas = document.createElement('canvas');
        canvas.width = params.width?params.width:32
        canvas.height = params.height?params.height:32

    	var noise = this.randomNoise(canvas);
        var ctx = canvas.getContext('2d');
	    ctx.save();
	    
	    /* Scale random iterations onto the canvas to generate Perlin noise. */
	    for (var size = 4; size <= noise.width; size *= 2) {
	        var x = (Math.random() * (noise.width - size)) | 0,
	            y = (Math.random() * (noise.height - size)) | 0;
	        ctx.globalAlpha = 4 / size;
	        ctx.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
	    }

	    ctx.restore();
	    var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
        sprite.anchor.set(0.5);
        return sprite;
	},

	randomNoise(canvas, x, y, width, height, alpha) {
		var canvas = document.createElement('canvas');
	    x = x || 0;
	    y = y || 0;
	    width = width || canvas.width;
	    height = height || canvas.height;
	    alpha = alpha || 255;
	    var g = canvas.getContext("2d"),
	        imageData = g.getImageData(x, y, width, height),
	        random = Math.random,
	        pixels = imageData.data,
	        n = pixels.length,
	        i = 0;
	    while (i < n) {
	        pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
	        pixels[i++] = alpha;
	    }
	    g.putImageData(imageData, x, y);
	    return canvas;
	},

    getSprite(frame) {
        let texture = PIXI.Texture.fromFrame(frame);
        return new PIXI.Sprite(texture);
    },

    shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    },

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    },

    linear(t) { return t },
    // accelerating from zero velocity
    easeInQuad(t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad(t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad(t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity 
    easeInCubic(t) { return t*t*t },
    // decelerating to zero velocity 
    easeOutCubic(t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic(t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity 
    easeInQuart(t) { return t*t*t*t },
    // decelerating to zero velocity 
    easeOutQuart(t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart(t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint(t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint(t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint(t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }

}