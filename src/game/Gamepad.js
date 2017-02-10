// import jQuery from 'jquery';
export default class Gamepad{
    constructor() {
        //fafaf
        //map button indices to names
        this.buttonNames = [
            'a',
            'b',
            'x',
            'y',
            'leftTop',
            'rightTop',
            'leftTrigger',
            'rightTrigger',
            'select',
            'start',
            'leftStick',
            'rightStick',
            'dpadUp',
            'dpadDown',
            'dpadLeft',
            'dpadRight'
        ];

        // callbacks for buton up listeners
        this.callbacks = {};

        // some browsers use an event to provide the gamepad when connected
        this.connectedGamepad = null;

        this.reset();
    }

    //reset button and stick state
    reset() {
        this.leftStick = { x: 0, y: 0 };
        this.rightStick = { x: 0, y: 0 };
        this.dpad = { x: 0, y: 0 };
        this.buttons = {};
    }

    // start listening for gamepad connection events
    start() {

        this.reset();

        this.listeners = {
            'gamepadconnected': jQuery.proxy(function(e) {
                var gamepad = e.originalEvent.gamepad;
                if (gamepad.mapping === 'standard') {
                    this.connectedGamepad = gamepad;
                }
            }),
            'gamepaddisconnected': jQuery.proxy(function(e) {
                var gamepad = e.originalEvent.gamepad;
                if (this.connectedGamepad === gamepad) {
                    this.connectedGamepad = null;
                }
            })
        };

        jQuery(window).on(this.listeners);
    }

    // stop listening to gamepad connection events
    stop() {
        jQuery(window).off(this.listeners);
        this.connectedGamepad = null;
    }

    // listen to button up events
    on(buttonName, callback) {
        console.log(this);
        var buttonCallbacks = this.callbacks[buttonName];
        if (!buttonCallbacks) {
            this.callbacks[buttonName] = [ callback ];
        } else {
            buttonCallbacks.push(callback);
        }
    }

    // remove button up event listeners
    off(buttonName, callback) {
        var buttonCallbacks = this.callbacks[buttonName];
        if (buttonCallbacks) {
            if (!callback) {
                // remove all callbacks
                this.callbacks = [];
            } else {
                // search for specified callback
                var callbackIndex = buttonCallbacks.indexOf(callback);
                if (callbackIndex >= 0) {
                    buttonCallbacks.splice(callbackIndex, 1);
                }
            }
        }
    }

    buttonPressed(gamepad, index) {
// console.log(index);
        if (!gamepad || !gamepad.buttons || index >= gamepad.buttons.length) {
            return false;
        }

        var b = gamepad.buttons[index];
        if (!b) {
            return false;
        }

        if (typeof(b) === "object") {
            return b.pressed;
        }

        return (b === 1.0);
    }

    // helper to retrieve the currently connected gamepad
    getGamepad() {
        
        // default to connected gamepad
        var gp = this.connectedGamepad;
        if (gp) {
            return gp;
        }
        
        // fetch all available gamepads
        // console.log(navigator.getGamepads());
        var gamepads;
        if (navigator.getGamepads) {
            gamepads = navigator.getGamepads();
        } else if (navigator.webkitGetGamepads) {
            gamepads = navigator.webkitGetGamepads();    
        }

        // look for a standard mapped gamepad
        if (gamepads) {
            for (var i = 0, len = gamepads.length; i < len; i++) {
                gp = gamepads[i];
                if (gp){//} && gp.mapping === 'standard') {
                    return gp;
                }
            }
        }

        return null;
    }

    // should be called during each frame update
    update() {

        // make sure we have a gamepad
        var gp = this.getGamepad();
        //console.log(gp);
        if (!gp) {
            return;
        }

        // check state of each of the buttons
        var i, len, name, wasDown, isDown;
        for (i = 0, len = this.buttonNames.length; i < len; i++) {

            name = this.buttonNames[i];
            wasDown = !!this.buttons[name];
            isDown = this.buttons[name] = this.buttonPressed(gp, i);

            if (wasDown && !isDown) {
                jQuery.each(this.callbacks[name] || [], function(callback) {
                    if (callback) { callback(); }
                });
            }
        }

        // update the sticks
        this.leftStick.x = gp.axes[0];
        this.leftStick.y = gp.axes[1];
        this.rightStick.x = gp.axes[2];
        this.rightStick.y = gp.axes[3];

        // dpad isn't a true stick, infer from buttons
        this.dpad.x = (this.buttons.dpadLeft ? -1 : 0) + (this.buttons.dpadRight ? 1 : 0);
        this.dpad.y = (this.buttons.dpadUp ? -1 : 0) + (this.buttons.dpadDown ? 1 : 0);

    }
}