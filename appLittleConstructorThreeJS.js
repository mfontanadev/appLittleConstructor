/*
First: thanks to @Javidx9, this was inspired in his youtube tutorials
    OneLoneCoder.com - 3D Graphics Part #1 - Triangles & Projections
    "Tredimensjonal Grafikk" - @Javidx9

First.five: thancks to ThreeJS (https://threejs.org/) I'm speechless.

Second: license

Third: about this and me.

License
~~~~~~~
JSEngine Senoid (Playing with hyper minimal 3dEngineJS). 
Copyright (C) 2020 mfontanadev.
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it
under certain conditions; See license for details.

Original works located at:
https://github.com/mfontanadev

From mfontanadev :)
~~~~~~~~~~~~~~~
Hello! Use this as like as you want, I hope you can create amazing things 
and have a lot of fun. Let me know. You acknowledge
that I am not responsible for anything bad that happens as a result of
your actions. However this code is protected by GNU GPLv3, see the license in the
github repo. This means you must attribute me if you use it. You can view this
license here: https://github.com/mfontanadev/POCs/blob/master/LICENSE
Cheers!

Background
~~~~~~~~~~
Sources: https://github.com/mfontanadev/appLittleConstructor/tree/ThreeJS - Little Constructor - 3dEngineJS hyper minimal.

This programm has two layers, first you can use it like a 3dEngine, second,
you can use it to build virtual houses. I hope this programm can inspire you
to make your own one.

NOTE: this is a branch from appLittleConstructor to take source code from master and 
change the render engine to use ThreeJS.

Video
~~~~~
PENDING

Author
~~~~~~
site: https://mfontanadev.github.io
twitter: https://twitter.com/mfontanadev
git: https://github.com/mfontanadev
linkedin: https://www.linkedin.com/in/mauricio-fontana-8285681b/?originalSubdomain=ar

Last Updated: 20/04/2020
*/
 
// --------------------------------------------------------------- 
// CLASS: jsGameEngine.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Minimal engine to render points, lines, keyboard, save files, 
// and some usefull functions.
//

/* thanks to @Javidx9, this was inspired in his youtube tutorials
    OneLoneCoder.com - 3D Graphics Part #1 - Triangles & Projections
    "Tredimensjonal Grafikk" - @Javidx9
*/
JSGameEngine.C_FPS = 24;
JSGameEngine.C_TEXTURE_QUALITY = 2;
JSGameEngine.C_VIEWPORT_SCALE = 0.5;			//one unit in world = 0.5 unit in viewport.
JSGameEngine.C_VIEWPORT_CURSOR_LENGTH = 20;		//px;
JSGameEngine.C_SKEEP_TEST = true;

JSGameEngine.PIXEL_SOLID = 1;
JSGameEngine.FG_WHITE = "white";

var C_KEY_SHIFT = 16;
var C_KEY_CTRL = 17;
var C_KEY_ALT = 18;

var C_KEY_LEFT = 37;
var C_KEY_DOWN = 40;
var C_KEY_RIGHT = 39;
var C_KEY_UP = 38;

var C_KEY_CHAR_A = 65;
var C_KEY_CHAR_B = 66;
var C_KEY_CHAR_C = 67;
var C_KEY_CHAR_D = 68;
var C_KEY_CHAR_E = 69;
var C_KEY_CHAR_F = 70;
var C_KEY_CHAR_G = 71;
var C_KEY_CHAR_H = 72;
var C_KEY_CHAR_I = 73;
var C_KEY_CHAR_J = 74;
var C_KEY_CHAR_K = 75;
var C_KEY_CHAR_L = 76;
var C_KEY_CHAR_M = 77;
var C_KEY_CHAR_N = 78;
var C_KEY_CHAR_O = 79;
var C_KEY_CHAR_P = 80;
var C_KEY_CHAR_Q = 81;
var C_KEY_CHAR_R = 82;
var C_KEY_CHAR_S = 83;
var C_KEY_CHAR_T = 84;
var C_KEY_CHAR_U = 85;
var C_KEY_CHAR_V = 86;
var C_KEY_CHAR_W = 87;
var C_KEY_CHAR_X = 88;
var C_KEY_CHAR_Y = 89;
var C_KEY_CHAR_Z = 90;

var C_KEY_CHAR_ADD = 187;
var C_KEY_CHAR_SUB = 189;

var C_KEY_INSERT = 45;
var C_KEY_DELETE = 46;
var C_KEY_RETURN = 13;
var C_KEY_SPACE = 32;

var C_KEY_CHAR_0 = 48;
var C_KEY_CHAR_1 = 49;
var C_KEY_CHAR_2 = 50;
var C_KEY_CHAR_3 = 51;
var C_KEY_CHAR_4 = 52;
var C_KEY_CHAR_5 = 53;
var C_KEY_CHAR_6 = 54;
var C_KEY_CHAR_7 = 55;
var C_KEY_CHAR_8 = 56;
var C_KEY_CHAR_9 = 57;

function JSGameEngine(_canvas, _context) 
{
    this.canvas = _canvas;
    this.context = this.canvas.getContext("2d");
    this.fontSize = 9;        
    this.font = this.fontSize + "px Verdana";

    this.canvasWidth = this.canvas.width;
    this.halfCanvasWidth = this.canvasWidth * 0.5;
    this.canvasHeight = this.canvas.height;
    this.halfCanvasHeight = this.canvasHeight * 0.5;
    this.aspectRatio = this.canvasWidth / this.canvasHeight;
    this.aspectRatio = 1;
    this.keyboardeventPropagation = true;

    this.keyPressed = [];
    this.keyWaitRelease = [];
    this.onKeyDownCallback = null;
    this.onKeyUpCallback = null;
    this.initKeyboard();

    this.times = new Array();
    this.logTimes = false;
    this.px = this.context.createImageData(1, 1);
    this.pxData = this.px.data;

    this.setFontSize(this.fontSize);

    console.log("js game engine created, widht x height:", this.canvasWidth, " x ", this.canvasHeight);

    this.pDepthBuffer = new Array();
    for (var y = 0; y < this.canvasHeight; y++) 
        for (var x = 0; x < this.canvasWidth; x++) 
            this.pDepthBuffer.push(0);

    if (JSGameEngine.C_SKEEP_TEST === false)
        JSGameEngine.tests(this);
}

JSGameEngine.prototype.start = function() 
{
    onUserCreate();
    setInterval('onUserUpdate()', 1000 / JSGameEngine.C_FPS);
}

JSGameEngine.prototype.setKeyboardCallbacks = function(_onKeyDownFunction, _onKeyUpFunction)
{
    this.onKeyDownCallback = _onKeyDownFunction;
    this.onKeyUpCallback = _onKeyUpFunction;
}

JSGameEngine.prototype.initKeyboard = function()
{
    var finalThis = this;

    for (var i = 0; i < 256; i++)
    {
        this.keyPressed.push(false);
        this.keyWaitRelease.push(false);
    }

    document.onkeydown = function(event) 
    {
        finalThis.keyPressed[event.keyCode] = true;

        if (finalThis.onKeyDownCallback)
            finalThis.onKeyDownCallback(event.keyCode);

        return finalThis.keyboardeventPropagation;
    };
    
    document.onkeyup = function(event) 
    {
        finalThis.keyPressed[event.keyCode] = false;
        finalThis.keyWaitRelease[event.keyCode] = false;

        if (finalThis.onKeyUpCallback)
            finalThis.onKeyUpCallback(event.keyCode);

        return finalThis.keyboardeventPropagation;
    }
}

JSGameEngine.prototype.isKeyPressed = function(_scanCode) 
{
    return this.keyPressed[_scanCode];
}

JSGameEngine.prototype.satKeyWaitRelease = function(_scanCode) 
{
    this.keyWaitRelease[_scanCode] = true;
}

JSGameEngine.prototype.getKeyWaitingRelease = function(_scanCode) 
{
    return this.keyWaitRelease[_scanCode];
}

JSGameEngine.prototype.clearScreen = function() 
{
    gEngine.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}

JSGameEngine.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3, style, fillColor) 
{
    this.renderLine(x1, y1, x2, y2, style, fillColor);
    this.renderLine(x2, y2, x3, y3, style, fillColor);
    this.renderLine(x3, y3, x1, y1, style, fillColor);
}

JSGameEngine.prototype.fillTriangle = function(x1, y1, x2, y2, x3, y3, style, fillColor) 
{
    this.context.save();

    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.lineTo(x3, y3);
    this.context.closePath();
    this.context.strokeStyle = fillColor;
    this.context.stroke();

    this.context.fillStyle = fillColor;
    this.context.fill();

    this.context.restore();
}

JSGameEngine.prototype.putPixel = function(	x, y, r, g, b, a)
{
    this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
    this.context.fillRect(x, y, 1, 1);
}

JSGameEngine.prototype.putPixelSize = function(	x, y, r, g, b, a, size)
{
    this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
    this.context.fillRect(x, y, size, size);
}

JSGameEngine.prototype.texturedTriangle = function(	x1, y1, u1, v1, w1,
                                                    x2, y2, u2, v2, w2,
                                                    x3, y3, u3, v3, w3,	texture)
{
    if (texture === null)
        return;

    var detail = 0;
    var pixColour = null;
    var t = 0;

    if (y2 < y1)
    {
        t=y1; y1=y2; y2=t;
        t=x1; x1=x2; x2=t; 
        t=u1; u1=u2; u2=t; 
        t=v1; v1=v2; v2=t; 
        t=w1; w1=w2; w2=t; 
    }

    if (y3 < y1)
    {
        t=y1; y1=y3; y3=t;
        t=x1; x1=x3; x3=t; 
        t=u1; u1=u3; u3=t; 
        t=v1; v1=v3; v3=t; 
        t=w1; w1=w3; w3=t; 
    }

    if (y3 < y2)
    {
        t=y2; y2=y3; y3=t;
        t=x2; x2=x3; x3=t; 
        t=u2; u2=u3; u3=t; 
        t=v2; v2=v3; v3=t; 
        t=w2; w2=w3; w3=t; 
    }

    var dy1 = y2 - y1;
    var dx1 = x2 - x1;
    var dv1 = v2 - v1;
    var du1 = u2 - u1;
    var dw1 = w2 - w1;

    var dy2 = y3 - y1;
    var dx2 = x3 - x1;
    var dv2 = v3 - v1;
    var du2 = u3 - u1;
    var dw2 = w3 - w1;

    var tex_u, tex_v, tex_w;

    var dax_step = 0, dbx_step = 0,
        du1_step = 0, dv1_step = 0,
        du2_step = 0, dv2_step = 0,
        dw1_step = 0, dw2_step = 0;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);

    if (dy1) du1_step = du1 / Math.abs(dy1);
    if (dy1) dv1_step = dv1 / Math.abs(dy1);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);

    if (dy2) du2_step = du2 / Math.abs(dy2);
    if (dy2) dv2_step = dv2 / Math.abs(dy2);
    if (dy2) dw2_step = dw2 / Math.abs(dy2);

    if (dy1)
    {
        for (var i = y1; i <= y2; i+=JSGameEngine.C_TEXTURE_QUALITY)
        {
            var ax = x1 + (i - y1) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_su = u1 + (i - y1) * du1_step;
            var tex_sv = v1 + (i - y1) * dv1_step;
            var tex_sw = w1 + (i - y1) * dw1_step;

            var tex_eu = u1 + (i - y1) * du2_step;
            var tex_ev = v1 + (i - y1) * dv2_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_su; 	tex_su=tex_eu; 	tex_eu=t;
                t=tex_sv; 	tex_sv=tex_ev; 	tex_ev=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }

            tex_u = tex_su;
            tex_v = tex_sv;
            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_u = (1 - t) * tex_su + t * tex_eu;
                tex_v = (1 - t) * tex_sv + t * tex_ev;
                tex_w = (1 - t) * tex_sw + t * tex_ew;
                
                pixColour = this.getTexturePixelScaled(texture, tex_u / tex_w, tex_v / tex_w);
                this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);
    
                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }

        }
    }

    dy1 = y3 - y2;
    dx1 = x3 - x2;
    dv1 = v3 - v2;
    du1 = u3 - u2;
    dw1 = w3 - w2;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);

    du1_step = 0, dv1_step = 0;
    if (dy1) du1_step = du1 / Math.abs(dy1);
    if (dy1) dv1_step = dv1 / Math.abs(dy1);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);

    if (dy1)
    {
        for (var i = y2; i <= y3; i+=JSGameEngine.C_TEXTURE_QUALITY)
        //for (var i = y2; i <= y2; i++)
        {
            var ax = x2 + (i - y2) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_su = u2 + (i - y2) * du1_step;
            var tex_sv = v2 + (i - y2) * dv1_step;
            var tex_sw = w2 + (i - y2) * dw1_step;

            var tex_eu = u1 + (i - y1) * du2_step;
            var tex_ev = v1 + (i - y1) * dv2_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_su; 	tex_su=tex_eu; 	tex_eu=t;
                t=tex_sv; 	tex_sv=tex_ev; 	tex_ev=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }

            tex_u = tex_su;
            tex_v = tex_sv;
            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_u = (1 - t) * tex_su + t * tex_eu;
                tex_v = (1 - t) * tex_sv + t * tex_ev;
                tex_w = (1 - t) * tex_sw + t * tex_ew;

                pixColour = this.getTexturePixelScaled(texture, tex_u / tex_w, tex_v / tex_w);
                this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);

                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }
        }	
    }		
}

JSGameEngine.prototype.getTexturePixelScaled = function(imgData, x, y) 
{
    var px = x * imgData.width;
    var py = y * imgData.height;
    return this.getTexturePixel(imgData, px, py);
}

JSGameEngine.prototype.getTexturePixel = function(imgData, x, y) 
{
    x = Math.round(x, 2) % imgData.width;
    y = Math.round(y, 2) % imgData.height;

    var index = (y * imgData.width + x) * 4;

    return ([	imgData.data[index],
                imgData.data[index + 1], 
                imgData.data[index + 2],
                imgData.data[index + 3]
            ]);
}

JSGameEngine.prototype.fillTriangleCustom = function(	x1, y1, w1, x2, y2, w2, x3, y3, w3, fillColor)
{
    var pixColour = [fillColor.r, fillColor.g, fillColor.b, fillColor.a * 255];
    var t = 0;
    var index = 0;

    if (y2 < y1)
    {
        t=y1; y1=y2; y2=t;
        t=x1; x1=x2; x2=t; 
        t=w1; w1=w2; w2=t; 
    }

    if (y3 < y1)
    {
        t=y1; y1=y3; y3=t;
        t=x1; x1=x3; x3=t; 
        t=w1; w1=w3; w3=t; 
        t=w2; w2=w3; w3=t; 
    }

    if (y3 < y2)
    {
        t=y2; y2=y3; y3=t;
        t=x2; x2=x3; x3=t; 
    }

    var dy1 = y2 - y1;
    var dx1 = x2 - x1;
    var dw1 = w2 - w1;

    var dy2 = y3 - y1;
    var dx2 = x3 - x1;
    var dw2 = w3 - w1;

    var tex_w;

    var dax_step = 0, dbx_step = 0,
        dw1_step = 0, dw2_step = 0;


    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);
    if (dy2) dw2_step = dw2 / Math.abs(dy2);

    if (dy1)
    {
        for (var i = y1; i <= y2; i+=JSGameEngine.C_TEXTURE_QUALITY)
        {
            var ax = x1 + (i - y1) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_sw = w1 + (i - y1) * dw1_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }

            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_w = (1 - t) * tex_sw + t * tex_ew;
                
                //index = Math.round(i * this.canvasWidth + j, 0);
                //if (tex_w > this.pDepthBuffer[index])
                {
                    this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);
                    //this.pDepthBuffer[index] = tex_w;
                }

                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }

        }
    }

    dy1 = y3 - y2;
    dx1 = x3 - x2;
    dw1 = w3 - w2;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);

    if (dy1)
    {
        for (var i = y2; i <= y3; i+=JSGameEngine.C_TEXTURE_QUALITY)
        //for (var i = y2; i <= y2; i++)
        {
            var ax = x2 + (i - y2) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_sw = w2 + (i - y2) * dw1_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }
    
            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_w = (1 - t) * tex_sw + t * tex_ew;
                
                //index = Math.round(i * this.canvasWidth + j, 0);
                //if (tex_w > this.pDepthBuffer[index])
                {
                    this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);
                    //this.pDepthBuffer[index] = tex_w;
                }

                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }
        }	
    }		
}

JSGameEngine.prototype.renderLine = function(x1, y1, x2, y2, style, fillColor)
{
    this.context.save();
    this.context.beginPath();

    this.context.lineWidth = style;
    this.context.strokeStyle = fillColor;

    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.restore();
}

JSGameEngine.prototype.renderCircle = function(x1, y1, r, lineWidth, fillColor)
{
    this.context.save();
    this.context.beginPath();

    this.context.strokeStyle = fillColor;
    this.context.lineWidth = lineWidth;
    this.context.fillStyle = fillColor;

    this.context.arc(x1, y1, r, 0, 2 * Math.PI, false);
    this.context.fill();
    this.context.stroke();
    this.context.restore();
}

JSGameEngine.prototype.draw2DAxis = function(fillColor) 
{
    this.renderLine(0, this.halfCanvasHeight, this.canvasWidth, this.halfCanvasHeight, 1, fillColor);
    this.renderLine(this.halfCanvasWidth, 0, this.halfCanvasWidth, this.canvasHeight, 1, fillColor);
}

JSGameEngine.prototype.renderText = function(_cenX, _cenY, _text, _fillColor) 
{
    if (typeof _fillColor === "undefined")
        _fillColor = "white";

    this.context.save();
    this.context.font = this.font;
    this.context.fillStyle = _fillColor;
    this.context.fillText(_text, _cenX, _cenY);
    this.context.restore();
}

JSGameEngine.prototype.locateText = function(_col, _row, _text, _fillColor) 
{
    this.renderText(_col * this.fontSize, _row * this.fontSize * 1.5, _text, _fillColor);
}

JSGameEngine.prototype.getRowNumberGivenYPosition = function(_yPosition) 
{
    return Math.ceil(_yPosition / (this.fontSize * 1.5));
}

JSGameEngine.prototype.getColNumberGivenXPosition = function(_xPosition) 
{
    return Math.ceil(_xPosition / this.fontSize);
}

JSGameEngine.prototype.renderRectangle = function(_x1, _y1, _w, _h, lineWidth, fillColor)
{
   this.context.save();
   this.context.beginPath();
   this.context.lineWidth = lineWidth;
   this.context.strokeStyle = fillColor;
   this.context.rect(_x1, _y1, _w, _h);
   this.context.stroke();
   this.context.restore();
}

JSGameEngine.prototype.rgbaToColor = function(_r, _g, _b, _a) 
{
    var r = _r % 256;
    var g = _g % 256;
    var b = _b % 256;

     var result = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + "," + _a.toString()+")";
    
    return result;
}

JSGameEngine.st_rgbaToColor = function(_r, _g, _b) 
{
    var r = _r % 256;
    var g = _g % 256;
    var b = _b % 256;

     var result = "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
    
    return result;
}

JSGameEngine.prototype.startTime = function(_key)
{
    var foundItem = this.chFoundTimeKey(_key);

    if (foundItem === null)
    {
        foundItem = {key:_key, date: null, totalTime: 0};
        this.times.push(foundItem);
    }
    
    foundItem.totalTime = 0;
    foundItem.date = Date.now();
}

JSGameEngine.prototype.showTimes = function(_value)
{
    this.logTimes = _value;
}

JSGameEngine.prototype.showTimeDiff = function(_key)
{
    if (this.logTimes === false)
        return;

    this.addTimeDiff(_key);

    var foundItem = this.chFoundTimeKey(_key);
    if (foundItem !== null)
    {
        console.log("Timediff ", foundItem.key, ":", foundItem.totalTime);
    }
    else
    {
        console.log("Timediff ", _key, ": not found");
    }
}

JSGameEngine.prototype.addTimeDiff = function(_key)
{
    var foundItem = this.chFoundTimeKey(_key);
    if (foundItem !== null)
    {
        foundItem.totalTime += (Date.now() - foundItem.date);
        foundItem.date = Date.now();
    }
}

JSGameEngine.prototype.chFoundTimeKey = function(_key)
{
    var foundItem = null;

    for (var i = 0; i < this.times.length && foundItem === null; i++) 
        if (this.times[i].key === _key)
            foundItem = this.times[i];

    return foundItem;
}

JSGameEngine.prototype.clearBuffer = function()
{
    for (let index = 0; index < this.pDepthBuffer.length; index++) 
    {
        this.pDepthBuffer[index] = 0;
    }
}

JSGameEngine.prototype.swap = function(_array)
{
    if (_array != null && _array.length > 0)
    {
        _array.splice(0, _array.length);	
    }
}

JSGameEngine.prototype.setFontSize = function(_size)
{
    this.font = _size + "px Verdana";
}

JSGameEngine.prototype.getFontSize = function()
{
    return this.fontSize;
}

JSGameEngine.tests = function(_this)
{
    console.log("\n");
    console.log("******** TESTS START ********" );

    console.log("******** TESTS END ********" );
    console.log("\n");
}

JSGameEngine.download = function(filename, text) 
{
    //Inline option with no name setted.
    //uriContent = "data:application/octet-stream," + encodeURIComponent(json);
    //newWindow = window.open(uriContent, 'nuevoDocumento');

    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

JSGameEngine.padChar = function(num, size, char) 
{
    var numLenght = num.toString().length;
    if (numLenght < size)
        return char.repeat(size - numLenght) + num.toString();
    else
        return num;
}

JSGameEngine.chClearArray = function(_array)
{
    if (_array != null && _array.length > 0)
    {
        _array.splice(0, _array.length);	
    }
}

JSGameEngine.graToRad = function(grados)
{
    return grados * Math.PI / 180;
}

JSGameEngine.radToGra = function(radians)
{
    return 180 * radians / Math.PI;
}

// Get an URL to the OBJ folder, adding SERVER IP and  PORT previous to the filename.
JSGameEngine.resolveURLToResourceFolder = function(_filename)
{
    return 'http://'+ C_SERVER_IP + '/obj/' + _filename; 
}
 
// --------------------------------------------------------------- 
// CLASS: jsGameEngine.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Minimal engine to render points, lines, keyboard, save files, 
// and some usefull functions.
//

/* thanks to @Javidx9, this was inspired in his youtube tutorials
    OneLoneCoder.com - 3D Graphics Part #1 - Triangles & Projections
    "Tredimensjonal Grafikk" - @Javidx9
*/
JSGameEngine.C_FPS = 24;
JSGameEngine.C_TEXTURE_QUALITY = 2;
JSGameEngine.C_VIEWPORT_SCALE = 0.5;			//one unit in world = 0.5 unit in viewport.
JSGameEngine.C_VIEWPORT_CURSOR_LENGTH = 20;		//px;
JSGameEngine.C_SKEEP_TEST = true;

JSGameEngine.PIXEL_SOLID = 1;
JSGameEngine.FG_WHITE = "white";

var C_KEY_SHIFT = 16;
var C_KEY_CTRL = 17;
var C_KEY_ALT = 18;

var C_KEY_LEFT = 37;
var C_KEY_DOWN = 40;
var C_KEY_RIGHT = 39;
var C_KEY_UP = 38;

var C_KEY_CHAR_A = 65;
var C_KEY_CHAR_B = 66;
var C_KEY_CHAR_C = 67;
var C_KEY_CHAR_D = 68;
var C_KEY_CHAR_E = 69;
var C_KEY_CHAR_F = 70;
var C_KEY_CHAR_G = 71;
var C_KEY_CHAR_H = 72;
var C_KEY_CHAR_I = 73;
var C_KEY_CHAR_J = 74;
var C_KEY_CHAR_K = 75;
var C_KEY_CHAR_L = 76;
var C_KEY_CHAR_M = 77;
var C_KEY_CHAR_N = 78;
var C_KEY_CHAR_O = 79;
var C_KEY_CHAR_P = 80;
var C_KEY_CHAR_Q = 81;
var C_KEY_CHAR_R = 82;
var C_KEY_CHAR_S = 83;
var C_KEY_CHAR_T = 84;
var C_KEY_CHAR_U = 85;
var C_KEY_CHAR_V = 86;
var C_KEY_CHAR_W = 87;
var C_KEY_CHAR_X = 88;
var C_KEY_CHAR_Y = 89;
var C_KEY_CHAR_Z = 90;

var C_KEY_CHAR_ADD = 187;
var C_KEY_CHAR_SUB = 189;

var C_KEY_INSERT = 45;
var C_KEY_DELETE = 46;
var C_KEY_RETURN = 13;
var C_KEY_SPACE = 32;

var C_KEY_CHAR_0 = 48;
var C_KEY_CHAR_1 = 49;
var C_KEY_CHAR_2 = 50;
var C_KEY_CHAR_3 = 51;
var C_KEY_CHAR_4 = 52;
var C_KEY_CHAR_5 = 53;
var C_KEY_CHAR_6 = 54;
var C_KEY_CHAR_7 = 55;
var C_KEY_CHAR_8 = 56;
var C_KEY_CHAR_9 = 57;

function JSGameEngine(_canvas, _context) 
{
    this.canvas = _canvas;
    this.context = this.canvas.getContext("2d");
    this.fontSize = 9;        
    this.font = this.fontSize + "px Verdana";

    this.canvasWidth = this.canvas.width;
    this.halfCanvasWidth = this.canvasWidth * 0.5;
    this.canvasHeight = this.canvas.height;
    this.halfCanvasHeight = this.canvasHeight * 0.5;
    this.aspectRatio = this.canvasWidth / this.canvasHeight;
    this.aspectRatio = 1;
    this.keyboardeventPropagation = true;

    this.keyPressed = [];
    this.keyWaitRelease = [];
    this.onKeyDownCallback = null;
    this.onKeyUpCallback = null;
    this.initKeyboard();

    this.times = new Array();
    this.logTimes = false;
    this.px = this.context.createImageData(1, 1);
    this.pxData = this.px.data;

    this.setFontSize(this.fontSize);

    console.log("js game engine created, widht x height:", this.canvasWidth, " x ", this.canvasHeight);

    this.pDepthBuffer = new Array();
    for (var y = 0; y < this.canvasHeight; y++) 
        for (var x = 0; x < this.canvasWidth; x++) 
            this.pDepthBuffer.push(0);

    if (JSGameEngine.C_SKEEP_TEST === false)
        JSGameEngine.tests(this);
}

JSGameEngine.prototype.start = function() 
{
    onUserCreate();
    setInterval('onUserUpdate()', 1000 / JSGameEngine.C_FPS);
}

JSGameEngine.prototype.setKeyboardCallbacks = function(_onKeyDownFunction, _onKeyUpFunction)
{
    this.onKeyDownCallback = _onKeyDownFunction;
    this.onKeyUpCallback = _onKeyUpFunction;
}

JSGameEngine.prototype.initKeyboard = function()
{
    var finalThis = this;

    for (var i = 0; i < 256; i++)
    {
        this.keyPressed.push(false);
        this.keyWaitRelease.push(false);
    }

    document.onkeydown = function(event) 
    {
        finalThis.keyPressed[event.keyCode] = true;

        if (finalThis.onKeyDownCallback)
            finalThis.onKeyDownCallback(event.keyCode);

        return finalThis.keyboardeventPropagation;
    };
    
    document.onkeyup = function(event) 
    {
        finalThis.keyPressed[event.keyCode] = false;
        finalThis.keyWaitRelease[event.keyCode] = false;

        if (finalThis.onKeyUpCallback)
            finalThis.onKeyUpCallback(event.keyCode);

        return finalThis.keyboardeventPropagation;
    }
}

JSGameEngine.prototype.isKeyPressed = function(_scanCode) 
{
    return this.keyPressed[_scanCode];
}

JSGameEngine.prototype.satKeyWaitRelease = function(_scanCode) 
{
    this.keyWaitRelease[_scanCode] = true;
}

JSGameEngine.prototype.getKeyWaitingRelease = function(_scanCode) 
{
    return this.keyWaitRelease[_scanCode];
}

JSGameEngine.prototype.clearScreen = function() 
{
    gEngine.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}

JSGameEngine.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3, style, fillColor) 
{
    this.renderLine(x1, y1, x2, y2, style, fillColor);
    this.renderLine(x2, y2, x3, y3, style, fillColor);
    this.renderLine(x3, y3, x1, y1, style, fillColor);
}

JSGameEngine.prototype.fillTriangle = function(x1, y1, x2, y2, x3, y3, style, fillColor) 
{
    this.context.save();

    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.lineTo(x3, y3);
    this.context.closePath();
    this.context.strokeStyle = fillColor;
    this.context.stroke();

    this.context.fillStyle = fillColor;
    this.context.fill();

    this.context.restore();
}

JSGameEngine.prototype.putPixel = function(	x, y, r, g, b, a)
{
    this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
    this.context.fillRect(x, y, 1, 1);
}

JSGameEngine.prototype.putPixelSize = function(	x, y, r, g, b, a, size)
{
    this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
    this.context.fillRect(x, y, size, size);
}

JSGameEngine.prototype.texturedTriangle = function(	x1, y1, u1, v1, w1,
                                                    x2, y2, u2, v2, w2,
                                                    x3, y3, u3, v3, w3,	texture)
{
    if (texture === null)
        return;

    var detail = 0;
    var pixColour = null;
    var t = 0;

    if (y2 < y1)
    {
        t=y1; y1=y2; y2=t;
        t=x1; x1=x2; x2=t; 
        t=u1; u1=u2; u2=t; 
        t=v1; v1=v2; v2=t; 
        t=w1; w1=w2; w2=t; 
    }

    if (y3 < y1)
    {
        t=y1; y1=y3; y3=t;
        t=x1; x1=x3; x3=t; 
        t=u1; u1=u3; u3=t; 
        t=v1; v1=v3; v3=t; 
        t=w1; w1=w3; w3=t; 
    }

    if (y3 < y2)
    {
        t=y2; y2=y3; y3=t;
        t=x2; x2=x3; x3=t; 
        t=u2; u2=u3; u3=t; 
        t=v2; v2=v3; v3=t; 
        t=w2; w2=w3; w3=t; 
    }

    var dy1 = y2 - y1;
    var dx1 = x2 - x1;
    var dv1 = v2 - v1;
    var du1 = u2 - u1;
    var dw1 = w2 - w1;

    var dy2 = y3 - y1;
    var dx2 = x3 - x1;
    var dv2 = v3 - v1;
    var du2 = u3 - u1;
    var dw2 = w3 - w1;

    var tex_u, tex_v, tex_w;

    var dax_step = 0, dbx_step = 0,
        du1_step = 0, dv1_step = 0,
        du2_step = 0, dv2_step = 0,
        dw1_step = 0, dw2_step = 0;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);

    if (dy1) du1_step = du1 / Math.abs(dy1);
    if (dy1) dv1_step = dv1 / Math.abs(dy1);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);

    if (dy2) du2_step = du2 / Math.abs(dy2);
    if (dy2) dv2_step = dv2 / Math.abs(dy2);
    if (dy2) dw2_step = dw2 / Math.abs(dy2);

    if (dy1)
    {
        for (var i = y1; i <= y2; i+=JSGameEngine.C_TEXTURE_QUALITY)
        {
            var ax = x1 + (i - y1) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_su = u1 + (i - y1) * du1_step;
            var tex_sv = v1 + (i - y1) * dv1_step;
            var tex_sw = w1 + (i - y1) * dw1_step;

            var tex_eu = u1 + (i - y1) * du2_step;
            var tex_ev = v1 + (i - y1) * dv2_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_su; 	tex_su=tex_eu; 	tex_eu=t;
                t=tex_sv; 	tex_sv=tex_ev; 	tex_ev=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }

            tex_u = tex_su;
            tex_v = tex_sv;
            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_u = (1 - t) * tex_su + t * tex_eu;
                tex_v = (1 - t) * tex_sv + t * tex_ev;
                tex_w = (1 - t) * tex_sw + t * tex_ew;
                
                pixColour = this.getTexturePixelScaled(texture, tex_u / tex_w, tex_v / tex_w);
                this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);
    
                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }

        }
    }

    dy1 = y3 - y2;
    dx1 = x3 - x2;
    dv1 = v3 - v2;
    du1 = u3 - u2;
    dw1 = w3 - w2;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);

    du1_step = 0, dv1_step = 0;
    if (dy1) du1_step = du1 / Math.abs(dy1);
    if (dy1) dv1_step = dv1 / Math.abs(dy1);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);

    if (dy1)
    {
        for (var i = y2; i <= y3; i+=JSGameEngine.C_TEXTURE_QUALITY)
        //for (var i = y2; i <= y2; i++)
        {
            var ax = x2 + (i - y2) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_su = u2 + (i - y2) * du1_step;
            var tex_sv = v2 + (i - y2) * dv1_step;
            var tex_sw = w2 + (i - y2) * dw1_step;

            var tex_eu = u1 + (i - y1) * du2_step;
            var tex_ev = v1 + (i - y1) * dv2_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_su; 	tex_su=tex_eu; 	tex_eu=t;
                t=tex_sv; 	tex_sv=tex_ev; 	tex_ev=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }

            tex_u = tex_su;
            tex_v = tex_sv;
            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_u = (1 - t) * tex_su + t * tex_eu;
                tex_v = (1 - t) * tex_sv + t * tex_ev;
                tex_w = (1 - t) * tex_sw + t * tex_ew;

                pixColour = this.getTexturePixelScaled(texture, tex_u / tex_w, tex_v / tex_w);
                this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);

                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }
        }	
    }		
}

JSGameEngine.prototype.getTexturePixelScaled = function(imgData, x, y) 
{
    var px = x * imgData.width;
    var py = y * imgData.height;
    return this.getTexturePixel(imgData, px, py);
}

JSGameEngine.prototype.getTexturePixel = function(imgData, x, y) 
{
    x = Math.round(x, 2) % imgData.width;
    y = Math.round(y, 2) % imgData.height;

    var index = (y * imgData.width + x) * 4;

    return ([	imgData.data[index],
                imgData.data[index + 1], 
                imgData.data[index + 2],
                imgData.data[index + 3]
            ]);
}

JSGameEngine.prototype.fillTriangleCustom = function(	x1, y1, w1, x2, y2, w2, x3, y3, w3, fillColor)
{
    var pixColour = [fillColor.r, fillColor.g, fillColor.b, fillColor.a * 255];
    var t = 0;
    var index = 0;

    if (y2 < y1)
    {
        t=y1; y1=y2; y2=t;
        t=x1; x1=x2; x2=t; 
        t=w1; w1=w2; w2=t; 
    }

    if (y3 < y1)
    {
        t=y1; y1=y3; y3=t;
        t=x1; x1=x3; x3=t; 
        t=w1; w1=w3; w3=t; 
        t=w2; w2=w3; w3=t; 
    }

    if (y3 < y2)
    {
        t=y2; y2=y3; y3=t;
        t=x2; x2=x3; x3=t; 
    }

    var dy1 = y2 - y1;
    var dx1 = x2 - x1;
    var dw1 = w2 - w1;

    var dy2 = y3 - y1;
    var dx2 = x3 - x1;
    var dw2 = w3 - w1;

    var tex_w;

    var dax_step = 0, dbx_step = 0,
        dw1_step = 0, dw2_step = 0;


    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);
    if (dy2) dw2_step = dw2 / Math.abs(dy2);

    if (dy1)
    {
        for (var i = y1; i <= y2; i+=JSGameEngine.C_TEXTURE_QUALITY)
        {
            var ax = x1 + (i - y1) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_sw = w1 + (i - y1) * dw1_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }

            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_w = (1 - t) * tex_sw + t * tex_ew;
                
                //index = Math.round(i * this.canvasWidth + j, 0);
                //if (tex_w > this.pDepthBuffer[index])
                {
                    this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);
                    //this.pDepthBuffer[index] = tex_w;
                }

                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }

        }
    }

    dy1 = y3 - y2;
    dx1 = x3 - x2;
    dw1 = w3 - w2;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);
    if (dy1) dw1_step = dw1 / Math.abs(dy1);

    if (dy1)
    {
        for (var i = y2; i <= y3; i+=JSGameEngine.C_TEXTURE_QUALITY)
        //for (var i = y2; i <= y2; i++)
        {
            var ax = x2 + (i - y2) * dax_step;
            var bx = x1 + (i - y1) * dbx_step;

            var tex_sw = w2 + (i - y2) * dw1_step;
            var tex_ew = w1 + (i - y1) * dw2_step;

            if (ax > bx)
            {
                t=ax; 		ax=bx; 			bx=t;
                t=tex_sw; 	tex_sw=tex_ew; 	tex_ew=t;
            }
    
            tex_w = tex_sw;

            var tstep = 1 / (bx - ax);
            var t = 0;

            for (var j = ax; j < bx; j+=JSGameEngine.C_TEXTURE_QUALITY)
            {
                tex_w = (1 - t) * tex_sw + t * tex_ew;
                
                //index = Math.round(i * this.canvasWidth + j, 0);
                //if (tex_w > this.pDepthBuffer[index])
                {
                    this.putPixelSize(j, i, pixColour[0], pixColour[1], pixColour[2], pixColour[3], JSGameEngine.C_TEXTURE_QUALITY);
                    //this.pDepthBuffer[index] = tex_w;
                }

                t += tstep * JSGameEngine.C_TEXTURE_QUALITY;
            }
        }	
    }		
}

JSGameEngine.prototype.renderLine = function(x1, y1, x2, y2, style, fillColor)
{
    this.context.save();
    this.context.beginPath();

    this.context.lineWidth = style;
    this.context.strokeStyle = fillColor;

    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.restore();
}

JSGameEngine.prototype.renderCircle = function(x1, y1, r, lineWidth, fillColor)
{
    this.context.save();
    this.context.beginPath();

    this.context.strokeStyle = fillColor;
    this.context.lineWidth = lineWidth;
    this.context.fillStyle = fillColor;

    this.context.arc(x1, y1, r, 0, 2 * Math.PI, false);
    this.context.fill();
    this.context.stroke();
    this.context.restore();
}

JSGameEngine.prototype.draw2DAxis = function(fillColor) 
{
    this.renderLine(0, this.halfCanvasHeight, this.canvasWidth, this.halfCanvasHeight, 1, fillColor);
    this.renderLine(this.halfCanvasWidth, 0, this.halfCanvasWidth, this.canvasHeight, 1, fillColor);
}

JSGameEngine.prototype.renderText = function(_cenX, _cenY, _text, _fillColor) 
{
    if (typeof _fillColor === "undefined")
        _fillColor = "white";

    this.context.save();
    this.context.font = this.font;
    this.context.fillStyle = _fillColor;
    this.context.fillText(_text, _cenX, _cenY);
    this.context.restore();
}

JSGameEngine.prototype.locateText = function(_col, _row, _text, _fillColor) 
{
    this.renderText(_col * this.fontSize, _row * this.fontSize * 1.5, _text, _fillColor);
}

JSGameEngine.prototype.getRowNumberGivenYPosition = function(_yPosition) 
{
    return Math.ceil(_yPosition / (this.fontSize * 1.5));
}

JSGameEngine.prototype.getColNumberGivenXPosition = function(_xPosition) 
{
    return Math.ceil(_xPosition / this.fontSize);
}

JSGameEngine.prototype.renderRectangle = function(_x1, _y1, _w, _h, lineWidth, fillColor)
{
   this.context.save();
   this.context.beginPath();
   this.context.lineWidth = lineWidth;
   this.context.strokeStyle = fillColor;
   this.context.rect(_x1, _y1, _w, _h);
   this.context.stroke();
   this.context.restore();
}

JSGameEngine.prototype.rgbaToColor = function(_r, _g, _b, _a) 
{
    var r = _r % 256;
    var g = _g % 256;
    var b = _b % 256;

     var result = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + "," + _a.toString()+")";
    
    return result;
}

JSGameEngine.st_rgbaToColor = function(_r, _g, _b) 
{
    var r = _r % 256;
    var g = _g % 256;
    var b = _b % 256;

     var result = "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
    
    return result;
}

JSGameEngine.prototype.startTime = function(_key)
{
    var foundItem = this.chFoundTimeKey(_key);

    if (foundItem === null)
    {
        foundItem = {key:_key, date: null, totalTime: 0};
        this.times.push(foundItem);
    }
    
    foundItem.totalTime = 0;
    foundItem.date = Date.now();
}

JSGameEngine.prototype.showTimes = function(_value)
{
    this.logTimes = _value;
}

JSGameEngine.prototype.showTimeDiff = function(_key)
{
    if (this.logTimes === false)
        return;

    this.addTimeDiff(_key);

    var foundItem = this.chFoundTimeKey(_key);
    if (foundItem !== null)
    {
        console.log("Timediff ", foundItem.key, ":", foundItem.totalTime);
    }
    else
    {
        console.log("Timediff ", _key, ": not found");
    }
}

JSGameEngine.prototype.addTimeDiff = function(_key)
{
    var foundItem = this.chFoundTimeKey(_key);
    if (foundItem !== null)
    {
        foundItem.totalTime += (Date.now() - foundItem.date);
        foundItem.date = Date.now();
    }
}

JSGameEngine.prototype.chFoundTimeKey = function(_key)
{
    var foundItem = null;

    for (var i = 0; i < this.times.length && foundItem === null; i++) 
        if (this.times[i].key === _key)
            foundItem = this.times[i];

    return foundItem;
}

JSGameEngine.prototype.clearBuffer = function()
{
    for (let index = 0; index < this.pDepthBuffer.length; index++) 
    {
        this.pDepthBuffer[index] = 0;
    }
}

JSGameEngine.prototype.swap = function(_array)
{
    if (_array != null && _array.length > 0)
    {
        _array.splice(0, _array.length);	
    }
}

JSGameEngine.prototype.setFontSize = function(_size)
{
    this.font = _size + "px Verdana";
}

JSGameEngine.prototype.getFontSize = function()
{
    return this.fontSize;
}

JSGameEngine.tests = function(_this)
{
    console.log("\n");
    console.log("******** TESTS START ********" );

    console.log("******** TESTS END ********" );
    console.log("\n");
}

JSGameEngine.download = function(filename, text) 
{
    //Inline option with no name setted.
    //uriContent = "data:application/octet-stream," + encodeURIComponent(json);
    //newWindow = window.open(uriContent, 'nuevoDocumento');

    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

JSGameEngine.padChar = function(num, size, char) 
{
    var numLenght = num.toString().length;
    if (numLenght < size)
        return char.repeat(size - numLenght) + num.toString();
    else
        return num;
}

JSGameEngine.chClearArray = function(_array)
{
    if (_array != null && _array.length > 0)
    {
        _array.splice(0, _array.length);	
    }
}

JSGameEngine.graToRad = function(grados)
{
    return grados * Math.PI / 180;
}

JSGameEngine.radToGra = function(radians)
{
    return 180 * radians / Math.PI;
}

// Get an URL to the OBJ folder, adding SERVER IP and  PORT previous to the filename.
JSGameEngine.resolveURLToResourceFolder = function(_filename)
{
    return 'http://'+ C_SERVER_IP + '/obj/' + _filename; 
}
 
// --------------------------------------------------------------- 
// CLASS: space.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// All trigonometric calculation, this is THE 3D ENGINE. 
// Also has a couple of functions like Quick Reference Text and 
// mini Viewport to see camera and status.
//

Space.C_RENDER_MODE_WIREFRAME = 1;
Space.C_RENDER_MODE_TRIANGLE_FILL = 2;
Space.C_RENDER_MODE_PIXEL_FILL = 3;

Space.C_ILLUMINATOIN_MODE_SOLID = 1;      // solid colors with no light calculatoin.
Space.C_ILLUMINATOIN_MODE_LIGHT = 2;      // degree color using simple light calculatoin.

Space.C_PROJECTION_TYPE_ISOMETRIC = 1;     
Space.C_PROJECTION_TYPE_PERSPECTIVE = 2;

function Space() 
{
    this.accumulativeMatrix = this.createMatrixIdentity();
    this.worldMatrix = this.createMatrixIdentity();
    this.viewMatrix = this.createMatrixIdentity();
    this.projectionMatrix = this.createMatrixIdentity();
    this.screenMatrix = this.createMatrixIdentity();
    
    this.camera = new Vector(0, 0, 0);
    this.cameraYaw = 0;
    this.cameraXaw = 0;
    this.camera = new Vector(0, 0, 0);
    this.cameraZoom = 0;
    this.lightDirection = new Vector(0, 0, 0);
    this.lightDirection.normalize();

    this.tmpTriangleNormalVector = new Vector(0, 0, 0);

    this.normalVectorSize = 5;

    this.normalsVisible = false;
    this.linesVisible = false;
    this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;

    this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    this.cameraControlEnabled = false;
    this.ambientLightFactor = 0;    // 0 has no insidence, 1 full light.

    this.viewWidth = 800;
    this.viewHeight = 600;
    this.viewOffsetX = 0;
    this.viewOffsetY = 0;
}

Space.prototype.setViewSize = function(_width, _height) 
{
    this.viewWidth = _width;
    this.viewHeight = _height;
}

Space.prototype.setViewOffset = function(_offsetX, _offsetY) 
{
    this.viewOffsetX = _offsetX;
    this.viewOffsetY = _offsetY;
}

Space.prototype.setLight = function(_x, _y, _z) 
{
    this.lightDirection.x = _x;
    this.lightDirection.y = _y;
    this.lightDirection.z = _z;

    this.lightDirection.normalize();
}

Space.prototype.setCamera = function(_x, _y, _z) 
{
    this.camera.x = Math.round(_x);
    this.camera.y = Math.round(_y);
    this.camera.z = Math.round(_z);
}

Space.prototype.addCameraZoom = function(_value) 
{
    this.cameraZoom += _value;
}

Space.prototype.subCameraZoom = function(_value) 
{
    this.cameraZoom -= _value;
    if (this.cameraZoom <= 0)
        this.cameraZoom = 0.01;
}

Space.prototype.resetAccumulative = function() 
{
    this.accumulativeMatrix = this.createMatrixIdentity();
}

Space.prototype.setWorldMatrix = function(_matrix) 
{
    this.worldMatrix = _matrix;
}

Space.prototype.setViewMatrix = function(_matrix) 
{
    this.viewMatrix = _matrix;
}

Space.prototype.setProjectionMatrix = function(_matrix) 
{
    this.projectionMatrix = _matrix;
}

Space.prototype.setScreenMatrix = function(_matrix) 
{
    this.screenMatrix = _matrix;
}

Space.prototype.getCamera = function() 
{
    return this.camera;
}

Space.prototype.updateIsometricCamera = function(_xaw, _yaw)
{
    var zoom = this.getCamera().length() * -1;

    var positionVector = this.getLookAtVector();
    positionVector.mul(zoom);

    //this.getCamera().x = Math.round(positionVector.x);
    //this.getCamera().z = Math.round(positionVector.z);    
    this.setCamera(positionVector.x, positionVector.y , positionVector.z);

    //console.log(positionVector.x, positionVector.y, positionVector.z);
}

Space.prototype.multiplyToCurrent = function(m1) 
{
    this.accumulativeMatrix = this.matrixMultiply(this.accumulativeMatrix, m1);
}

Space.prototype.matrixMultiply = function(m1, m2) 
{
    var result = this.createMatrixIdentity();

    var width = m1[0].length;
    var height = m1.length;

    if (width != m2.length) {
        // error
    }

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var sum = 0;

            for (var z = 0; z < width; z++)
                sum += m1[y][z] * m2[z][x];
            

            result[y][x] = sum;
        }
    }

    return result;
}

Space.createMatrixIdentity = function () 
{
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

Space.prototype.createMatrixIdentity = function() 
{
    return Space.createMatrixIdentity();
}

Space.prototype.createScaleMatrix = function(x, y, z) 
{
    return [
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1]
    ];
}

Space.prototype.createTranslateMatrix = function(x, y, z) 
{
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [x, y, z, 1]
    ];
}

Space.prototype.createRotateXMatrix = function(x) 
{
        var cosX = Math.cos(x);
        var sinX = Math.sin(x);
        var rotX = [
            [1, 0, 0, 0],
            [0, cosX, -sinX, 0],
            [0, sinX, cosX,0],
            [0, 0, 0, 1]
        ];	

        return rotX;				
}

Space.prototype.createRotateYMatrix = function(y) 
{
        var cosY = Math.cos(y);
        var sinY = Math.sin(y);
        var rotY = [
            [cosY, 0, sinY, 0],
            [0, 1, 0, 0],
            [-sinY, 0, cosY, 0],
            [0, 0, 0, 1]
        ];	
        
        return rotY;				
}

Space.prototype.createRotateZMatrix = function(z) 
{
        var cosZ = Math.cos(z);
        var sinZ = Math.sin(z);
        var rotZ = [
            [cosZ, -sinZ, 0, 0],
            [sinZ, cosZ, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        return rotZ;
}		

Space.prototype.createOrtograpich2ProjectionMatrix = function(width, height, fNear, fFar, _camera, _zoom)
{
    //var m = 100 / _camera.length();
    var m = _zoom;

    var returnMatrix = 
    [
        [2 / width * m, 	0, 				0, 											0],
        [0, 				2 / height * m, 0, 											0],
        [0, 				0, 				(2 / (fFar - fNear)) * m,					0],
        [0, 				0, 				-1 * ((fFar + fNear) / (fFar - fNear)),		1]
    ];

    return returnMatrix;
}

Space.prototype.createProjectionMatrix = function(fFovDegrees, fAspectRatio, fNear, fFar)
{
    var fFovRad = 1.0 / Math.tan(fFovDegrees * 0.5 / 180.0 * 3.14159);

    var returnMatrix = 
    [
        [fAspectRatio * fFovRad, 	0, 		 	0, 									0],
        [0, 						fFovRad, 	0, 									0],
        [0, 						0, 		 	fFar / (fFar - fNear), 				1],
        [0, 						0, 			(-fFar * fNear) / (fFar - fNear), 	0]
    ];
    /*
    returnMatrix[0][0] = fAspectRatio * fFovRad;
    returnMatrix[1][1] = fFovRad;
    returnMatrix[2][2] = fFar / (fFar - fNear);
    returnMatrix[3][2] = (-fFar * fNear) / (fFar - fNear);
    returnMatrix[2][3] = 1;
    returnMatrix[3][3] = 0;
*/
    return returnMatrix;
}

Space.prototype.createPointAtInverseMatrix = function(pos, _xaw, _yaw) 
{
    var matCamera = this.createPointAtMatrix(pos, _xaw, _yaw);
    return this.createQuickInverseMatrix(matCamera);
}

Space.prototype.getLookAtVector = function() 
{
    return this.getLookAtVectorAt(this.cameraXaw, this.cameraYaw);
}

Space.prototype.getLookAtVectorAt = function(_xaw, _yaw) 
{
    var lookAt = new Vector(0, 0, 0);
    var vTarget = new Vector(0, 0, 1);

    var xawMatrix = this.createRotateXMatrix(_xaw);
    var yawMatrix = this.createRotateYMatrix(_yaw);

    Space.multiplyMatrixVectorOver(vTarget, xawMatrix);
    Space.multiplyMatrixVectorOver(vTarget, yawMatrix);

    lookAt.clone(vTarget);
    return lookAt;
}

Space.prototype.createPointAtMatrix = function(pos, _xaw, _yaw) 
{
    // Create "Point At" Matrix for camera
    var vUp = new Vector(0, 1, 0);
    var vTarget = new Vector(0, 0, 1);

    var vLookDir = this.getLookAtVectorAt(_xaw, _yaw);
    var vTarget = Vector.Add(this.getCamera(), vLookDir);

    return this.createPointAtBaseMatrix(pos, vTarget, vUp);
}

Space.prototype.createPointAtBaseMatrix = function(pos, target, up) 
{
    // Calculate new forward direction
    var newForward = Vector.Sub(target, pos);
    newForward.normalize();

    // Calculate new Up direction
    var a = Vector.Mul(newForward, up.dotProduct(newForward));
    var newUp = Vector.Sub(up, a);
    newUp.normalize();

    // New Right direction is easy, its just cross product
    var newRight = newUp.crossProduct(newForward);

    // Construct Dimensioning and Translation Matrix	
    var result = this.createMatrixIdentity();

    result[0][0] = newRight.x;	result[0][1] = newRight.y;	result[0][2] = newRight.z;	result[0][3] = 0.0;
    result[1][0] = newUp.x;		result[1][1] = newUp.y;		result[1][2] = newUp.z;		result[1][3] = 0.0;
    result[2][0] = newForward.x;result[2][1] = newForward.y;result[2][2] = newForward.z;result[2][3] = 0.0;
    result[3][0] = pos.x;		result[3][1] = pos.y;		result[3][2] = pos.z;		result[3][3] = 1.0;

    return result;
}

Space.prototype.createQuickInverseMatrix = function(_matrix) 
{
    var result = this.createMatrixIdentity();

    result[0][0] = _matrix[0][0]; result[0][1] = _matrix[1][0]; result[0][2] = _matrix[2][0]; result[0][3] = 0;
    result[1][0] = _matrix[0][1]; result[1][1] = _matrix[1][1]; result[1][2] = _matrix[2][1]; result[1][3] = 0;
    result[2][0] = _matrix[0][2]; result[2][1] = _matrix[1][2]; result[2][2] = _matrix[2][2]; result[2][3] = 0;

    result[3][0] = -(_matrix[3][0] * result[0][0] + _matrix[3][1] * result[1][0] + _matrix[3][2] * result[2][0]);
    result[3][1] = -(_matrix[3][0] * result[0][1] + _matrix[3][1] * result[1][1] + _matrix[3][2] * result[2][1]);
    result[3][2] = -(_matrix[3][0] * result[0][2] + _matrix[3][1] * result[1][2] + _matrix[3][2] * result[2][2]);
    result[3][3] = 1;

    return result;
}

Space.prototype.getGrayedColorFromLight = function(_light, _triNormal, _faceColor, _illuminationMode, _meshAlpha)
{
    var lightDotProduct = Math.min(1, _light.dotProduct(_triNormal));

    lightDotProduct = (lightDotProduct + this.ambientLightFactor);
    if (lightDotProduct > 1)
        lightDotProduct = 1;

    var red = Math.trunc(_faceColor.r * lightDotProduct);
    var green = Math.trunc(_faceColor.g * lightDotProduct);
    var blue = Math.trunc(_faceColor.b * lightDotProduct)
    var alpha = _faceColor.a * _meshAlpha;
    
    if (_illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
    {
        red = _faceColor.r;
        green = _faceColor.g;
        blue = _faceColor.b;
    }

    return {r: red, g: green, b: blue, a: alpha};
}

Space.prototype.update = function(_meshCollection, _forceSceneUpdate)
{ 
    var sceneTiranglesToRender = new Array();

    gEngine.startTime("process");

    // Precalculate general matrix. 
    this.resetAccumulative();
    this.multiplyToCurrent(this.createPointAtInverseMatrix(this.getCamera(), this.cameraXaw, this.cameraYaw));
    this.setViewMatrix(this.accumulativeMatrix);

    this.resetAccumulative();
    this.multiplyToCurrent(this.createScaleMatrix(1, -1, 1));

    if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
    {
        this.multiplyToCurrent(this.createProjectionMatrix(90, gEngine.aspectRatio, 0.01, 1000));
    }
    else
    {
        this.multiplyToCurrent(this.createOrtograpich2ProjectionMatrix(
            this.viewWidth, 
            this.viewHeight, 
            0.01, 
            1000, 
            this.getCamera(), 
            this.cameraZoom));
    }
    
    this.setProjectionMatrix(this.accumulativeMatrix);

    this.resetAccumulative();
    this.multiplyToCurrent(this.createTranslateMatrix(1, 1, 0));
    this.multiplyToCurrent(this.createScaleMatrix(0.5 * this.viewWidth, 0.5 * this.viewHeight, 1));
    this.setScreenMatrix(this.accumulativeMatrix);

    // Calculate render data for each mesh.
    var meshItem = null;
    for (var i = 0; i < _meshCollection.length; i++) 
    {
        meshItem = _meshCollection[i];
        if (meshItem.hide === false)
        {
            meshItem.worldMatrix = this.createMatrixIdentity();
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createScaleMatrix(
                                                                                                meshItem.getScale().x, 
                                                                                                meshItem.getScale().y, 
                                                                                                meshItem.getScale().z));

            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createRotateXMatrix(meshItem.getRotation().x));
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createRotateYMatrix(meshItem.getRotation().y));
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createRotateZMatrix(meshItem.getRotation().z));
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createTranslateMatrix(
                meshItem.getPosition().x,
                meshItem.getPosition().y,
                meshItem.getPosition().z));

        this.createRenderData(meshItem, sceneTiranglesToRender);
        }    
}			

    // Global Z order sorting.
    gEngine.startTime("Sorting");
    this.zOrderSorting(sceneTiranglesToRender);						
    gEngine.addTimeDiff("Sorting");	

    gEngine.showTimeDiff("process");
    gEngine.showTimeDiff("dumpOri");	
    gEngine.showTimeDiff("World");	
    gEngine.showTimeDiff("Normal");	
    gEngine.showTimeDiff("Culling");	
    gEngine.showTimeDiff("Illumination");	
    gEngine.showTimeDiff("Camera");	
    gEngine.showTimeDiff("Clip z");	
    gEngine.showTimeDiff("Projection");	
    gEngine.showTimeDiff("Normalization");	
    gEngine.showTimeDiff("Clip borders");	
    gEngine.showTimeDiff("Z order opt");	
    gEngine.showTimeDiff("Sorting");	
    gEngine.showTimeDiff("Normals show");	

    this.render(sceneTiranglesToRender);
    
    if (gEngine.logTimes === true)
    {
        console.log("Count triangles:", sceneTiranglesToRender.length, "(mesh =", _meshCollection.length, ")");
    }
}

Space.prototype.createRenderData = function(_mesh, _sceneTiranglesToRender)
{ 
    var trianglesCount = 0;

    if (_mesh === null || typeof _mesh === "undefined")
        return;

    JSGameEngine.chClearArray(_mesh.renderTris);

    gEngine.startTime("dumpOri");
    this.copyPointsAndSetTexture(_mesh);
    gEngine.addTimeDiff("dumpOri");	

    trianglesCount = _mesh.tris.length;

    // World Matrix Transform		
    this.worldMatrix = _mesh.worldMatrix;

    gEngine.startTime("World");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.tris, this.worldMatrix);
    gEngine.addTimeDiff("World");	

    // Calculate triangles Normal
    gEngine.startTime("Normal");
    _mesh.renderTris = this.calculateAndUpdateNormalVectorFromRenderPoints(_mesh.renderTris);						
    gEngine.addTimeDiff("Normal");	

    // Backface culling
    gEngine.startTime("Culling");
    _mesh.renderTris = this.backFaceCulling(_mesh.renderTris, this.getCamera());						
    gEngine.addTimeDiff("Culling");	

    // Illumination
    gEngine.startTime("Illumination");
    _mesh.renderTris = this.trianglesColorUsingLight(_mesh.renderTris, this.lightDirection, this.illuminationMode, _mesh.alpha);
    gEngine.addTimeDiff("Illumination");	

    // Camera: convert World Space --> View Space
    gEngine.startTime("Camera");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.renderTris, this.viewMatrix);
    gEngine.addTimeDiff("Camera");	

    // Clip camera plane
    gEngine.startTime("Clip z");
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris, new Vector(0, 0, 0.1), new Vector(0, 0, 1));
    gEngine.addTimeDiff("Clip z");	

    // Projection: convert 3D --> 2D
    gEngine.startTime("Projection");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.renderTris, this.projectionMatrix);
    gEngine.addTimeDiff("Projection");	

    // Manual normalization triangles.
    gEngine.startTime("Normalization");
    _mesh.renderTris = this.normalizePoints(_mesh.renderTris);						
    gEngine.addTimeDiff("Normalization");	

    // Screen: convert View Space --> Screen
    gEngine.startTime("Screen");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.renderTris, this.screenMatrix);
    gEngine.addTimeDiff("Screen");	

    // Clip camera screen borders
    // Right
    gEngine.startTime("Clip borders");
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(this.viewWidth - 1, 0, 0), new Vector(-1, 0, 0));
    // Top
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(0, this.viewHeight - 1, 0), new Vector(0, -1, 0));
    // Left
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(0, 0, 0), new Vector(1, 0, 0));
    // Button
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(0, 0, 0), new Vector(0, 1, 0));
    gEngine.addTimeDiff("Clip borders");	

    // Normal proyection to show in render
    gEngine.startTime("Normals show");
    _mesh.renderTris = this.normalProjection(_mesh.renderTris);						
    gEngine.addTimeDiff("Normals show");	

    // Optimization to depth sorting.
    gEngine.startTime("Z order opt");
    _mesh.renderTris = this.zOrderCalculation(_mesh.renderTris);						
    gEngine.addTimeDiff("Z order opt");	

    // Optimization to depth sorting.
    gEngine.startTime("Offset");
    _mesh.renderTris = this.offset(_mesh.renderTris, this.viewOffsetX, this.viewOffsetY);						
    gEngine.addTimeDiff("Offset");	
        
    // Add triangles to one huge array to perform global sorting.
    for (var is = 0; is < _mesh.renderTris.length; is++) 
        _sceneTiranglesToRender.push(_mesh.renderTris[is]);

    //console.log("Triangles start, end: ", trianglesCount, ", ", _mesh.renderTris.length);
}

Space.prototype.render = function(_sceneTiranglesToRender)
{ 
    gEngine.startTime("draw");
    this.drawTriangles(_sceneTiranglesToRender);
    gEngine.showTimeDiff("draw");	
}

// Copy triangle points data to avoid lost them in matrix calculatoins.
Space.prototype.copyPointsAndSetTexture = function(_mesh)
{ 
    var triItem = null;

    for (var i = 0; i < _mesh.tris.length; i++) 
    {
        triItem = _mesh.tris[i];

        // Dump points values.
         triItem.pointsRender[0].x =  triItem.p[0].x;
         triItem.pointsRender[0].y =  triItem.p[0].y;
         triItem.pointsRender[0].z =  triItem.p[0].z;
         triItem.pointsRender[0].w =  triItem.p[0].w;

         triItem.pointsRender[1].x =  triItem.p[1].x;
         triItem.pointsRender[1].y =  triItem.p[1].y;
         triItem.pointsRender[1].z =  triItem.p[1].z;
         triItem.pointsRender[1].w =  triItem.p[1].w;

         triItem.pointsRender[2].x =  triItem.p[2].x;
         triItem.pointsRender[2].y =  triItem.p[2].y;
         triItem.pointsRender[2].z =  triItem.p[2].z;
         triItem.pointsRender[2].w =  triItem.p[2].w;

        // Dump texture values.
         triItem.tRender[0].u =  triItem.t[0].u;
         triItem.tRender[0].v =  triItem.t[0].v;
         triItem.tRender[0].w =  triItem.t[0].w;

         triItem.tRender[1].u =  triItem.t[1].u;
         triItem.tRender[1].v =  triItem.t[1].v;
         triItem.tRender[1].w =  triItem.t[1].w;

         triItem.tRender[2].u =  triItem.t[2].u;
         triItem.tRender[2].v =  triItem.t[2].v;
         triItem.tRender[2].w =  triItem.t[2].w;

         if (triItem.useTexture === false)
             triItem.imgDataTexture = null;				
         else
             triItem.imgDataTexture = _mesh.imgDataTexture;				

    }

    return _mesh.tris;
}

Space.prototype.calculateAndUpdateNormalVectorFromRenderPoints = function(_arrayTriangles)
 { 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];
        triItem.calculateAndUpdateNormalVectorFromRenderPoints();
        result.push(triItem);
    }

    return result;
}

Space.prototype.backFaceCulling = function(_arrayTriangles, _cameraVector)
{ 
    var result = new Array();
    var triItem = null;
    var vCameraRay = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        vCameraRay = Vector.Sub(triItem.pointsRender[0], _cameraVector)
        if (triItem.isABackfacedTriangle(triItem.normalVector, vCameraRay) === true)
        {
            result.push(triItem);
        }
    }

    return result;
}

Space.prototype.trianglesColorUsingLight = function(_arrayTriangles, _lightDirection, _illuminationMode, _meshAlpha)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        triItem.faceColorRenderRGBA = this.getGrayedColorFromLight(this.lightDirection, triItem.normalVector, triItem.faceColor, _illuminationMode, _meshAlpha);
        triItem.faceColorRender =  gEngine.rgbaToColor(
            triItem.faceColorRenderRGBA.r, 
            triItem.faceColorRenderRGBA.g, 
            triItem.faceColorRenderRGBA.b, 
            triItem.faceColorRenderRGBA.a);

        result.push(triItem);
    }

    return result;
}

Space.prototype.normalizePoints = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        // Do normalising manually. 
        triItem.pointsRender[0].div(triItem.pointsRender[0].w);
        triItem.pointsRender[1].div(triItem.pointsRender[1].w);
        triItem.pointsRender[2].div(triItem.pointsRender[2].w);

        triItem.tRender[0].div(triItem.pointsRender[0].w);
        triItem.tRender[1].div(triItem.pointsRender[1].w);
        triItem.tRender[2].div(triItem.pointsRender[2].w);

        result.push(triItem);
    }

    return result;
}

Space.prototype.clipAgainstPlane = function(_arrayTriangles, plane_p, plane_n)
{ 
    var result = new Array();
    var triItem = null;
    var nClippedTriangles = 0;
    var clipped = [new Triangle(), new Triangle()];
    var newTriangle = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        newTriangle = Vector.Triangle_ClipAgainstPlane(plane_p, plane_n, triItem); 

        if (newTriangle !== 0)
        {
            result.push(triItem);

            if (newTriangle !== null)
                result.push(newTriangle);
        }
    }

    return result;
}

Space.prototype.applyMatrixFromRenderPoints = function(_arrayTriangles, _matrix)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        // World Matrix Transform				
        triItem.applyMatrixFromRenderPoints(_matrix);

        result.push(triItem);
    }

    return result;
}

Space.prototype.zOrderCalculation = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        triItem.zAverage = (triItem.pointsRender[0].z + triItem.pointsRender[1].z + triItem.pointsRender[2].z) / 3; 

        result.push(triItem);
    }

    return result;
}

Space.prototype.zOrderSorting = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;

    _arrayTriangles.sort
    (
        function (_t1, _t2) 
        {
            var result = 0;
            if (_t1.zOrder !== _t2.zOrder)
                result = (_t1.zOrder - _t2.zOrder);
            else
                result = (_t2.zAverage - _t1.zAverage);

            return result;
        }
    );

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];
        result.push(triItem);
    }

    return result;
}

Space.prototype.offset = function(_arrayTriangles, _offsetX, _offsetY)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        triItem.pointsRender[0].x += this.viewOffsetX;
        triItem.pointsRender[0].y += this.viewOffsetY;
        triItem.pointsRender[1].x += this.viewOffsetX;
        triItem.pointsRender[1].y += this.viewOffsetY;
        triItem.pointsRender[2].x += this.viewOffsetX;
        triItem.pointsRender[2].y += this.viewOffsetY;

        result.push(triItem);
    }

    return result;
}

Space.prototype.normalProjection = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;
    var cx = 0;
    var cy = 0;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        if (triItem.getNormalVisible() === true)
        {
            triItem.normalRenderVectorO.set
            (
                (triItem.p[0].x + triItem.p[1].x + triItem.p[2].x) / 3, 
                (triItem.p[0].y + triItem.p[1].y + triItem.p[2].y) / 3,
                (triItem.p[0].z + triItem.p[1].z + triItem.p[2].z) / 3
            );
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.worldMatrix);

            triItem.normalRenderVectorT.clone(triItem.normalVector);
            triItem.normalRenderVectorT.mul(this.normalVectorSize);
            triItem.normalRenderVectorT.add(triItem.normalRenderVectorO);

            // Camera: convert World Space --> View Space
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.viewMatrix);
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorT, this.viewMatrix);

            // 3D to 2D		
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.projectionMatrix);
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorT, this.projectionMatrix);

            // Normalize
            triItem.normalRenderVectorO.div(triItem.normalRenderVectorO.w);
            triItem.normalRenderVectorT.div(triItem.normalRenderVectorT.w);

            // Screen
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.screenMatrix);
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorT, this.screenMatrix);
        }
        result.push(triItem);
    }

    return result;
}

Space.prototype.clipTriangles = function(_triangles)
{ 
    // Some stolen comments from @Javidx9
    // Clip triangles against all four screen edges, this could yield
    // a bunch of triangles, so create a queue that we traverse to 
    //  ensure we only test new triangles generated against planes
    var listTriangles = new Array();
    var clipped = [new Triangle(), new Triangle()];
    var triClipped = null;
    var triangleItem = null;
    var nTrisToAdd = 0;
    var nNegativeTris = 0;

    // Loop through all transformed, viewed, projected, and sorted triangles
    for (var i = 0; i < _triangles.length; i++) 
    {
        triangleItem = _triangles[i];

        nNegativeTris = 0;
        for (var p = 0; p < 4; p++)
        {
            nTrisToAdd = 0;

            switch (p)
            {
                // screen right
                case 0:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(this.viewWidth - 1, 0, 0), new Vector(-1, 0, 0), triangleItem, clipped[0], clipped[1]); 
                break;

                // screen top
                case 1:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(0, this.viewHeight - 1, 0), new Vector(0, -1, 0), triangleItem, clipped[0], clipped[1]); 
                break;
                
                // screen left
                case 2:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(0, 0, 0), new Vector(1, 0, 0), triangleItem, clipped[0], clipped[1]); 
                break;

                // screen bottom
                case 3:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(0, 0, 0), new Vector(0, 1, 0), triangleItem, clipped[0], clipped[1]); 
                break;
            }

            if (nTrisToAdd === -1)
            {
                nNegativeTris++;
            }
            else
            {
                // Clipping may yield a variable number of triangles, so
                // add these new ones to the back of the queue for subsequent
                // clipping against next planes
                for (var w = 0; w < nTrisToAdd; w++)
                {
                    triClipped = new Triangle();
                    triClipped.clone(clipped[w]);
                    listTriangles.push(triClipped);
                }
            }
        }

        if (nNegativeTris === 4)
        {
            //triClipped = new Triangle();
            //triClipped.clone(clipped[0]);
            listTriangles.push(triangleItem);
        }
    }

    return listTriangles;
}

Space.prototype.drawTriangles = function(_listTriangles)
{ 
    var step = 1;
    if (_listTriangles.length > 1000)
        step = Math.round(_listTriangles.length / 1000);
    
    var p0 = null;
    var p1 = null;
    var p2 = null;
    var t = null;
    var normO = null;
    var normT = null;

    //gEngine.clearBuffer();

    for (var i = 0; i < _listTriangles.length; i++) 
    {
        p0 = _listTriangles[i].pointsRender[0];
        p1 = _listTriangles[i].pointsRender[1];
        p2 = _listTriangles[i].pointsRender[2];
        t0 = _listTriangles[i].tRender[0];
        t1 = _listTriangles[i].tRender[1];
        t2 = _listTriangles[i].tRender[2];
        
        normO = _listTriangles[i].normalRenderVectorO;
        normT = _listTriangles[i].normalRenderVectorT;
        sprTex1 = null;

        if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        {
            gEngine.drawTriangle(	p0.x, p0.y, p1.x, p1.y, p2.x, p2.y,	JSGameEngine.PIXEL_SOLID, _listTriangles[i].faceColorRender);
        }
        else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL || 
                 this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
        {
            if (_listTriangles[i].imgDataTexture !== null)
            {
                gEngine.texturedTriangle(p0.x, p0.y, t0.u, t0.v, t0.w,
                                      p1.x, p1.y, t1.u, t1.v, t1.w,
                                      p2.x, p2.y, t2.u, t2.v, t2.w, _listTriangles[i].imgDataTexture);
            }
            else
            {
                if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
                    gEngine.fillTriangle(	p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, JSGameEngine.PIXEL_SOLID, _listTriangles[i].faceColorRender);
                else
                    gEngine.fillTriangleCustom(	p0.x, p0.y, p0.w, p1.x, p1.y, p1.w, p2.x, p2.y, p2.w, _listTriangles[i].faceColorRenderRGBA);
            }
            
            if (this.linesVisible === true)
                gEngine.drawTriangle(	p0.x, p0.y, p1.x, p1.y, p2.x, p2.y,	JSGameEngine.PIXEL_SOLID, "gray");
        }
    }

    if (this.normalsVisible === true)
    {

        for (var i = 0; i < _listTriangles.length; i++) 
        {
            p0 = _listTriangles[i].pointsRender[0];
            p1 = _listTriangles[i].pointsRender[1];
            p2 = _listTriangles[i].pointsRender[2];
            t0 = _listTriangles[i].tRender[0];
            t1 = _listTriangles[i].tRender[1];
            t2 = _listTriangles[i].tRender[2];
            
            normO = _listTriangles[i].normalRenderVectorO;
            normT = _listTriangles[i].normalRenderVectorT;
            sprTex1 = null;

            if (_listTriangles[i].getNormalVisible() === true)
            {
                gEngine.renderLine(normO.x, normO.y, normT.x, normT.y, 2, "green");
            }
        }
    }
}

Space.prototype.renderLookAt = function(_currentLayer)
{ 
}

Space.prototype.renderInfo = function(_space)
{ 
    gEngine.setFontSize(12);

    var initialRow = gEngine.getRowNumberGivenYPosition(this.viewOffsetY);
    var initialCol = gEngine.getColNumberGivenXPosition(this.viewWidth - (gEngine.getFontSize() * 15));

    gEngine.locateText(initialCol, initialRow,      "Press H for HELP.");
    gEngine.locateText(initialCol, initialRow + 1,  "Press U for fun.");
    gEngine.locateText(initialCol, initialRow + 3,  "1- SMALL PILAR");
    gEngine.locateText(initialCol, initialRow + 4,  "2- RAILING ");
    gEngine.locateText(initialCol, initialRow + 5,  "3- SOCLE ");
    gEngine.locateText(initialCol, initialRow + 6,  "4- WINDOW");
    gEngine.locateText(initialCol, initialRow + 7,  "5- DOOR");
    gEngine.locateText(initialCol, initialRow + 8,  "6- MEDIUM PILAR");
    gEngine.locateText(initialCol, initialRow + 9,  "7- TALL PILAR");
    gEngine.locateText(initialCol, initialRow + 10, "8- FLOOR");
    gEngine.locateText(initialCol, initialRow + 11, "9- CABRIADA (SHF)");
    gEngine.locateText(initialCol, initialRow + 12, "0- ROOF (SHF)");
    
    gEngine.setFontSize(9);
}


Space.prototype.changeRenderMode = function() 
{
    if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
        this.renderMode = Space.C_RENDER_MODE_PIXEL_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
        this.renderMode = Space.C_RENDER_MODE_WIREFRAME;
}

Space.prototype.changeProjectionType = function() 
{
    this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    /*
    if (this.projectionType === Space.C_PROJECTION_TYPE_ISOMETRIC)
        this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    else if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
        this.projectionType = Space.C_PROJECTION_TYPE_ISOMETRIC;
    */
}

Space.prototype.changeIlluminationMode = function() 
{
    if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_LIGHT)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_SOLID;
    else if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;
}

Space.prototype.changeNormalVisibility = function() 
{
    this.normalsVisible = !this.normalsVisible;
}

Space.multiplyMatrixVector = function(inVector, outVector, matrix) 
{
    outVector.x = inVector.x * matrix[0][0] + inVector.y * matrix[1][0] + inVector.z * matrix[2][0] + matrix[3][0];
    outVector.y = inVector.x * matrix[0][1] + inVector.y * matrix[1][1] + inVector.z * matrix[2][1] + matrix[3][1];
    outVector.z = inVector.x * matrix[0][2] + inVector.y * matrix[1][2] + inVector.z * matrix[2][2] + matrix[3][2];
    outVector.w = inVector.x * matrix[0][3] + inVector.y * matrix[1][3] + inVector.z * matrix[2][3] + matrix[3][3];
}

Space.multiplyMatrixVectorOver = function(inVector, matrix) 
{
    var x, y, z, w;

    x = inVector.x * matrix[0][0] + inVector.y * matrix[1][0] + inVector.z * matrix[2][0] + matrix[3][0];
    y = inVector.x * matrix[0][1] + inVector.y * matrix[1][1] + inVector.z * matrix[2][1] + matrix[3][1];
    z = inVector.x * matrix[0][2] + inVector.y * matrix[1][2] + inVector.z * matrix[2][2] + matrix[3][2];
    w = inVector.x * matrix[0][3] + inVector.y * matrix[1][3] + inVector.z * matrix[2][3] + matrix[3][3];

    inVector.x = x;
    inVector.y = y;
    inVector.z = z;
    inVector.w = w;
}

 
// --------------------------------------------------------------- 
// CLASS: vector2D.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Vector used for texturing stuff.
//

function Vector2D(u, v, w) 
{
    this.u = u;
    this.v = v;
    this.w = w;
}

Vector2D.prototype.clone = function(v) 
{
    this.u = v.u;
    this.v = v.v;
    this.w = v.w;
}

Vector2D.prototype.div = function(k) 
{
    this.u /= k;
    this.v /= k;
    this.w /= k;
}
 
// --------------------------------------------------------------- 
// CLASS: vector.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Vector definition data and some global functions to perform 
// vector operations.
//

function Vector(x, y, z, w) 
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.updated = false;
    this.colored = false;
}

Vector.prototype.clone = function(v) 
{
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    this.updated = v.updated;
    this.colored = v.colored;
  }

Vector.Clone = function (v) 
{
    var result = new Vector(v.x, v.y, v.z, v.w);
    result.updated = v.updated;
    result.colored = v.colored;
    return result;  
}

Vector.Sub = function (v1, v2) 
{
    var result = Vector.Clone(v1);
    result.sub(v2);
    return result;  
}

Vector.Add = function (v1, v2) 
{
    var result = Vector.Clone(v1);
    result.add(v2);
    return result;  
}

Vector.Mul = function (v1, k) 
{
    var result = Vector.Clone(v1);
    result.mul(k);
    return result;  
}

Vector.Div = function (v1, k) 
{
    var result = Vector.Clone(v1);
    result.div(k);
    return result;  
}

Vector.Normalize = function (v1) 
{
    var result = Vector.Clone(v1);
    result.normalize();
    return result;  
}

Vector.prototype.set = function(x, y, z, w) 
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vector.prototype.dotProduct = function(v2) 
{
    return this.x * v2.x + this.y * v2.y + this.z * v2.z;
}

Vector.prototype.crossProduct = function(v2) 
{
    var v = new Vector(0, 0, 0);

    v.x = this.y * v2.z - this.z * v2.y;
    v.y = this.z * v2.x - this.x * v2.z;
    v.z = this.x * v2.y - this.y * v2.x;
    
    return v;
}

Vector.IntersectPlane = function(plane_p, plane_n, lineStart, lineEnd, _t)
{
    plane_n.normalize();
    var plane_d = -plane_n.dotProduct(plane_p);
    var ad = lineStart.dotProduct(plane_n);
    var bd = lineEnd.dotProduct(plane_n);
    var t = (-plane_d - ad) / (bd - ad);
    _t.refValue = t;
    var lineStartToEnd = Vector.Sub(lineEnd, lineStart);
    var lineToIntersect = Vector.Mul(lineStartToEnd, t);
    return Vector.Add(lineStart, lineToIntersect);
}

// Return signed shortest distance from point to plane, plane normal must be normalised
Vector.Dist = function (point, plane_n, plane_p) 
{
    var dotProd = plane_n.dotProduct(plane_p);
    return (plane_n.x * point.x + plane_n.y * point.y + plane_n.z * point.z - dotProd);
}

Vector.Triangle_ClipAgainstPlane = function(plane_p, plane_n, in_tri, out_tri1, out_tri2)
{
    var result = null;

    // Posible optimizatoin, make point as static array.
    var points = new Array(new Vector(), new Vector(), new Vector());

    // Posible optimizatoin, make point as static array.
    var textures = new Array(new Vector2D(), new Vector2D(), new Vector2D());

    var t = {refValue: 0};

    // Make sure plane normal is indeed normal
    plane_n.normalize();

    // Create two temporary storage arrays to classify points either side of plane
    // If distance sign is positive, point lies on "inside" of plane
    var inside_points = new Array();  
    var nInsidePointCount = 0;
    var outside_points = new Array(); 
    var nOutsidePointCount = 0;
    var inside_tex = new Array();
    var nInsideTexCount = 0;
    var outside_tex = new Array(); 
    var nOutsideTexCount = 0;

    // Get signed distance of each point in triangle to plane
    var d0 = Vector.Dist(in_tri.pointsRender[0], plane_n, plane_p);
    var d1 = Vector.Dist(in_tri.pointsRender[1], plane_n, plane_p);
    var d2 = Vector.Dist(in_tri.pointsRender[2], plane_n, plane_p);

    points[0].clone(in_tri.pointsRender[0]);
    points[1].clone(in_tri.pointsRender[1]);
    points[2].clone(in_tri.pointsRender[2]);

    textures[0].clone(in_tri.tRender[0]);
    textures[1].clone(in_tri.tRender[1]);
    textures[2].clone(in_tri.tRender[2]);

    if (d0 >= 0) 
    { 
        inside_points.push(points[0]) 
        nInsidePointCount++;
        inside_tex.push(textures[0]); 	
        nInsideTexCount++
    }
    else 
    { 
        outside_points.push(points[0]); 
        nOutsidePointCount++;
        outside_tex.push(textures[0]);
        nOutsideTexCount++
    }

    if (d1 >= 0) 
    { 
        inside_points.push(points[1]) 
        nInsidePointCount++;
        inside_tex.push(textures[1]); 	
        nInsideTexCount++
    }
    else 
    { 
        outside_points.push(points[1]); 
        nOutsidePointCount++;
        outside_tex.push(textures[1]);
        nOutsideTexCount++
    }
    
    if (d2 >= 0) 
    { 
        inside_points.push(points[2]) 
        nInsidePointCount++;
        inside_tex.push(textures[2]); 	
        nInsideTexCount++				
    }
    else 
    { 
        outside_points.push(points[2]); 
        nOutsidePointCount++;
        outside_tex.push(textures[2]);
        nOutsideTexCount++				
    }

    // Now classify triangle points, and break the input triangle into 
    // smaller output triangles if required. There are four possible
    // outcomes...

    if (nInsidePointCount == 0)
    {
        // All points lie on the outside of plane, so clip whole triangle
        // It ceases to exist
        return 0; // No returned triangles are valid
    }

    if (nInsidePointCount == 3)
    {
        // All points lie on the inside of plane, so do nothing
        // and allow the triangle to simply pass through
        //out_tri1.clone(in_tri);
        return null; // Just the one returned original triangle is valid
    }

    if (nInsidePointCount == 1 && nOutsidePointCount == 2)
    {
        // Triangle should be clipped. As two points lie outside
        // the plane, the triangle simply becomes a smaller triangle

        // Copy appearance info to new triangle
        //out_tri1 = new Triangle();
        //out_tri1.clone(in_tri); 

        // The inside point is valid, so keep that...
        in_tri.pointsRender[0].clone(inside_points[0]);
        in_tri.tRender[0].clone(inside_tex[0]);

        // but the two new points are at the locations where the 
        // original sides of the triangle (lines) intersect with the plane
        in_tri.pointsRender[1] = Vector.IntersectPlane(plane_p, plane_n, inside_points[0], outside_points[0], t);
        in_tri.tRender[1].u = t.refValue * (outside_tex[0].u - inside_tex[0].u) + inside_tex[0].u;
        in_tri.tRender[1].v = t.refValue * (outside_tex[0].v - inside_tex[0].v) + inside_tex[0].v;
        in_tri.tRender[1].w = t.refValue * (outside_tex[0].w - inside_tex[0].w) + inside_tex[0].w;

        in_tri.pointsRender[2] = Vector.IntersectPlane(plane_p, plane_n, inside_points[0], outside_points[1], t);
        in_tri.tRender[2].u = t.refValue * (outside_tex[1].u - inside_tex[0].u) + inside_tex[0].u;
        in_tri.tRender[2].v = t.refValue * (outside_tex[1].v - inside_tex[0].v) + inside_tex[0].v;
        in_tri.tRender[2].w = t.refValue * (outside_tex[1].w - inside_tex[0].w) + inside_tex[0].w;

        //in_tri.color = "green";
        return null; // Return the newly formed single triangle
    }

    if (nInsidePointCount == 2 && nOutsidePointCount == 1)
    {
        // Triangle should be clipped. As two points lie inside the plane,
        // the clipped triangle becomes a "quad". Fortunately, we can
        // represent a quad with two new triangles

        // Copy appearance info to new triangles
        /*
        out_tri1 = new Triangle();
        out_tri1.clone(in_tri); 
        */
        
        result = new Triangle();
        result.clone(in_tri); 
        result.setNormalVisible(false);
        
        // The first triangle consists of the two inside points and a new
        // point determined by the location where one side of the triangle
        // intersects with the plane
        in_tri.pointsRender[0].clone(inside_points[0]);
        in_tri.pointsRender[1].clone(inside_points[1]);
        in_tri.tRender[0].clone(inside_tex[0]);
        in_tri.tRender[1].clone(inside_tex[1]);

        in_tri.pointsRender[2] = Vector.IntersectPlane(plane_p, plane_n, inside_points[0], outside_points[0], t);
        //in_tri.color = "cyan";
        in_tri.tRender[2].u = t.refValue * (outside_tex[0].u - inside_tex[0].u) + inside_tex[0].u;
        in_tri.tRender[2].v = t.refValue * (outside_tex[0].v - inside_tex[0].v) + inside_tex[0].v;
        in_tri.tRender[2].w = t.refValue * (outside_tex[0].w - inside_tex[0].w) + inside_tex[0].w;

        // The second triangle is composed of one of he inside points, a
        // new point determined by the intersection of the other side of the 
        // triangle and the plane, and the newly created point above
        result.pointsRender[0].clone(inside_points[1]);
        result.tRender[0].clone(inside_tex[1]);

        result.pointsRender[1].clone(in_tri.pointsRender[2]);
        result.tRender[1].clone(in_tri.tRender[2]);

        result.pointsRender[2] = Vector.IntersectPlane(plane_p, plane_n, inside_points[1], outside_points[0], t);
        //result.color = "magenta";
        result.tRender[2].u = t.refValue * (outside_tex[0].u - inside_tex[1].u) + inside_tex[1].u;
        result.tRender[2].v = t.refValue * (outside_tex[0].v - inside_tex[1].v) + inside_tex[1].v;
        result.tRender[2].w = t.refValue * (outside_tex[0].w - inside_tex[1].w) + inside_tex[1].w;

        return result; // Return two newly formed triangles which form a quad
    }
}

Vector.prototype.length = function() 
{
    return Math.sqrt(this.dotProduct(this));
}

Vector.prototype.normalize = function() 
{
        var l = this.length();

    if (l !== 0)
    {
        this.x = this.x / l;
        this.y = this.y / l;
        this.z = this.z / l;
    }
}

Vector.prototype.sub = function(_vector) 
{
    this.x -= _vector.x;
    this.y -= _vector.y;
    this.z -= _vector.z;
}

Vector.prototype.add = function(_vector) 
{
    this.x += _vector.x;
    this.y += _vector.y;
    this.z += _vector.z;
}

Vector.prototype.mul = function(_k) 
{
    this.x *= _k;
    this.y *= _k;
    this.z *= _k;
}

Vector.prototype.div = function(_k) 
{
    this.x /= _k;
    this.y /= _k;
    this.z /= _k;
}
 
// --------------------------------------------------------------- 
// CLASS: triangle.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Triangle data difenition adapted to specific Space.js 3d engine.  
//

function Triangle() 
{
    this.t = new Array();
    this.tRender = new Array();
    this.p = new Array();
    this.pointsRender = new Array();
    this.faceColor = {r:128, g:128, b:128, a:1};
    this.faceColorRender = "";
    this.faceColorRenderRGBA = {r:0, g:0, b:0, a:1};

    this.zAverage = 0;
    this.normalVector = new Vector(0,0,0);

    this.normalRenderVectorO = new Vector(0,0,0);
    this.normalRenderVectorT = new Vector(0,0,0);

    this.showNormal = true;

    this.set(new Vector(0, 0, 0), new Vector(0, 0, 0), new Vector(0, 0, 0));
    this.setTexture(new Vector2D(0, 0, 0), new Vector2D(0, 0, 0), new Vector2D(0, 0, 0));

    this.imgDataTexture = null;
    this.useTexture = false;

    this.zOrder = 0;
}

Triangle.prototype.clone = function(tri) 
{
    // Clone texture information
    this.t[0].u = tri.t[0].u;
    this.t[0].v = tri.t[0].v;
    this.t[0].w = tri.t[0].w;

    this.t[1].u = tri.t[1].u;
    this.t[1].v = tri.t[1].v;
    this.t[1].w = tri.t[1].w;

    this.t[2].u = tri.t[2].u;
    this.t[2].v = tri.t[2].v;
    this.t[2].w = tri.t[2].w;

    this.tRender[0].u = tri.tRender[0].u;
    this.tRender[0].v = tri.tRender[0].v;
    this.tRender[0].w = tri.tRender[0].w;

    this.tRender[1].u = tri.tRender[1].u;
    this.tRender[1].v = tri.tRender[1].v;
    this.tRender[1].w = tri.tRender[1].w;

    this.tRender[2].u = tri.tRender[2].u;
    this.tRender[2].v = tri.tRender[2].v;
    this.tRender[2].w = tri.tRender[2].w;

    // Clone points information
    this.p[0].x = tri.p[0].x;
    this.p[0].y = tri.p[0].y;
    this.p[0].z = tri.p[0].z;
    this.p[0].w = tri.p[0].w;

    this.p[1].x = tri.p[1].x;
    this.p[1].y = tri.p[1].y;
    this.p[1].z = tri.p[1].z;
    this.p[1].w = tri.p[1].w;

    this.p[2].x = tri.p[2].x;
    this.p[2].y = tri.p[2].y;
    this.p[2].z = tri.p[2].z;
    this.p[2].w = tri.p[2].w;

    this.pointsRender[0].x = tri.pointsRender[0].x;
    this.pointsRender[0].y = tri.pointsRender[0].y;
    this.pointsRender[0].z = tri.pointsRender[0].z;
    this.pointsRender[0].w = tri.pointsRender[0].w;

    this.pointsRender[1].x = tri.pointsRender[1].x;
    this.pointsRender[1].y = tri.pointsRender[1].y;
    this.pointsRender[1].z = tri.pointsRender[1].z;
    this.pointsRender[1].w = tri.pointsRender[1].w;

    this.pointsRender[2].x = tri.pointsRender[2].x;
    this.pointsRender[2].y = tri.pointsRender[2].y;
    this.pointsRender[2].z = tri.pointsRender[2].z;
    this.pointsRender[2].w = tri.pointsRender[2].w;

    // Miscelaneous data
    this.faceColor = tri.faceColor;
    this.faceColorRender = tri.faceColorRender;
    this.faceColorRenderRGBA = tri.faceColorRenderRGBA;
    this.zAverage = tri.zAverage;

    // Clone normal data
    this.normalVector.x = tri.normalVector.x;
    this.normalVector.y = tri.normalVector.y;
    this.normalVector.z = tri.normalVector.z;
    this.normalVector.w = tri.normalVector.w;

    this.normalRenderVectorO.x = tri.normalRenderVectorO.x;
    this.normalRenderVectorO.y = tri.normalRenderVectorO.y;
    this.normalRenderVectorO.z = tri.normalRenderVectorO.z;
    this.normalRenderVectorO.w = tri.normalRenderVectorO.w;

    this.normalRenderVectorT.x = tri.normalRenderVectorT.x;
    this.normalRenderVectorT.y = tri.normalRenderVectorT.y;
    this.normalRenderVectorT.z = tri.normalRenderVectorT.z;
    this.normalRenderVectorT.w = tri.normalRenderVectorT.w;

    this.showNormal = tri.showNormal;
    this.imgDataTexture = tri.imgDataTexture;
    this.useTexture = tri.useTexture;
    this.zOrder = tri.zOrder;
}

Triangle.prototype.clear = function() 
{
    this.p[0].x = 0;	this.p[0].y = 0;	this.p[0].z = 0;		this.p[0].w = 0;
    this.p[1].x = 0;	this.p[1].y = 0;	this.p[1].z = 0;		this.p[1].w = 0;
    this.p[2].x = 0;	this.p[2].y = 0;	this.p[2].z = 0;		this.p[2].w = 0;
}

Triangle.prototype.set = function(p1, p2, p3) 
{
    this.p[0] = p1;
    this.p[1] = p2;
    this.p[2] = p3;

    this.pointsRender[0] = new Vector(p1.x, p1.y, p1.z);
    this.pointsRender[1] = new Vector(p2.x, p2.y, p2.z);
    this.pointsRender[2] = new Vector(p3.x, p3.y, p3.z);
}

Triangle.prototype.setTexture = function(t1, t2, t3) 
{
    this.t[0] = t1;
    this.t[1] = t2;
    this.t[2] = t3;

    this.tRender[0] = new Vector2D(t1.u, t1.v, t1.w);
    this.tRender[1] = new Vector2D(t2.u, t2.v, t2.w);
    this.tRender[2] = new Vector2D(t3.u, t3.v, t3.w);
}

Triangle.prototype.applyMatrix = function(result, matrix) 
{
    result.clear();
    
    Space.multiplyMatrixVector(this.p[0], result.p[0], matrix);
    Space.multiplyMatrixVector(this.p[1], result.p[1], matrix);
    Space.multiplyMatrixVector(this.p[2], result.p[2], matrix);

    return result;
}

Triangle.prototype.applyMatrixFromRenderPoints = function(matrix) 
{
    Space.multiplyMatrixVectorOver(this.pointsRender[0], matrix);
    Space.multiplyMatrixVectorOver(this.pointsRender[1], matrix);
    Space.multiplyMatrixVectorOver(this.pointsRender[2], matrix);
}

Triangle.prototype.calculateAndUpdateNormalVector = function() 
{
    var normal = new Vector();
    var line1 = new Vector();
    var line2 = new Vector();

    line1.x = this.p[1].x - this.p[0].x;
    line1.y = this.p[1].y - this.p[0].y;
    line1.z = this.p[1].z - this.p[0].z;

    line2.x = this.p[2].x - this.p[0].x;
    line2.y = this.p[2].y - this.p[0].y;
    line2.z = this.p[2].z - this.p[0].z;

    this.normalVector = line1.crossProduct(line2);
    this.normalVector.normalize();

    return this.normalVector;
}

Triangle.prototype.calculateAndUpdateNormalVectorFromRenderPoints = function() 
{
    var normal = new Vector();
    var line1 = new Vector();
    var line2 = new Vector();

    line1.x = this.pointsRender[1].x - this.pointsRender[0].x;
    line1.y = this.pointsRender[1].y - this.pointsRender[0].y;
    line1.z = this.pointsRender[1].z - this.pointsRender[0].z;

    line2.x = this.pointsRender[2].x - this.pointsRender[0].x;
    line2.y = this.pointsRender[2].y - this.pointsRender[0].y;
    line2.z = this.pointsRender[2].z - this.pointsRender[0].z;

    this.normalVector = line1.crossProduct(line2);
    this.normalVector.normalize();

    return this.normalVector;
}

Triangle.prototype.isABackfacedTriangle = function(_normal, _vector) 
{
    var dp = _normal.dotProduct(_vector);

    //console.log("dp:", dp, " camera:", _vector, " normal:",_normal);

    return (dp < 0);
}

Triangle.prototype.setNormalVisible = function(_value) 
{
    this.showNormal = _value;
}

Triangle.prototype.getNormalVisible = function() 
{
    return this.showNormal;
}
 
// --------------------------------------------------------------- 
// CLASS: mesh.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// This class stores vertex data used by render engine.
// Has some usefull functions to load data from a files.
// Also stores rotation. position, scale used to place
// mesh in world coordinates.
//

function Mesh() 
{
    this._id = -1;
    this.tris = new Array();
    this.VectorMin = new Vector(0, 0, 0);
    this.VectorMax = new Vector(0, 0, 0);			
    this.VectorCenter = new Vector(0, 0, 0);
    this.meshData = "";
    this.fileName = "";
    this.renderTris = new Array();

    this.position = new Vector(0, 0, 0);
    this.rotation = new Vector(0, 0, 0);
    this.scale = new Vector(1, 1, 1);
    this.worldMatrix = Space.createMatrixIdentity();
    this.imgTexture = new Image();
    this.imgDataTexture = null;
    this.updateMeshBecauseTextureWasLoaded = false;
    this.materialFileName = "";
    this.textureFileName = "";
    this.alpha = 1;
    this.hide = false;

    this.points = new Array();
    this.faces = new Array();

    this.meshColor = {r:128, g:128, b:128, a:1};
}

Mesh.prototype.getId = function() 
{
    return this._id;
}

Mesh.prototype.setId = function(_value) 
{
    this._id = _value;
}

Mesh.prototype.createMeshFromData = function(_callback, _center) 
{
    var allText = _callback();
    this.meshData = allText; 
    this.generateMeshFromFileData(allText);
    
    if (_center === true)
    {
        this.updateCenter();
        this.center();
    }
}

Mesh.prototype.loadMeshFromFile = function(_fileName, _callback, _center) 
{
    if (C_MOCK_MODE === true)
    {
        this.loadMeshFromFileMock(_fileName, _callback, _center);
    }
    else
    {
        this.loadMeshFromFileServer(_fileName, _callback, _center);
    }
}

Mesh.prototype.loadMeshFromFileMock = function(_fileName, _callback, _center) 
{
    this.fileName = _fileName.toLowerCase();

    if (mockedObj.has(this.fileName) === true)
    {
        var responseText = mockedObj.get(this.fileName);
        responseText = responseText.replace(/&lf;/g, "\n");
        this.generateMeshFromFileData(responseText);
        
        if (_callback !== null)
            _callback(this, true, _center);		            
    }
}

Mesh.prototype.loadMeshFromFileServer = function(_fileName, _callback, _center) 
{
    var thisClass = this;
    this.fileName = _fileName;

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", _fileName, false);
    rawFile.onreadystatechange = function ()
    {
        var loadedOk = false;
        var allText = "";

        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                thisClass.generateMeshFromFileData(rawFile.responseText);
                loadedOk = true;
            }
        }

        if (_callback !== null)
            _callback(thisClass, loadedOk, _center);		        
    }
    rawFile.send(null);
}

Mesh.prototype.generateMeshFromFileData = function(_meshData) 
{
    this.meshData = _meshData; 

    var cacheColorVertexes = new Array();
    var cacheVertexes = new Array();
    var cacheVertexTextures = new Array();
    var cacheFaces = new Array();
    var splitted = _meshData.split("\n");
    var materialFile = "";
    var cacheMaterialsName = new Array();

    for (var i = 0; i < splitted.length; i++) 
    {
        if (splitted[i].substring(0,7) == "mtllib ")
        {
            var splittedRow = splitted[i].split(" ");
            materialFile = splittedRow[1];
        }

        if (splitted[i].substring(0,7) == "usemtl ")
        {
            var splittedRow = splitted[i].split(" ");
            cacheMaterialsName.push(splittedRow[1]);
        }

        if (splitted[i].substring(0,2) == "v ")
        {
            var splittedRow = splitted[i].split(" ");
            
            var vector = new Vector(
                    parseFloat(splittedRow[1]), 
                    parseFloat(splittedRow[2]), 
                    parseFloat(splittedRow[3]), 
                    1);
            this.points.push(vector);

            cacheVertexes.push(vector);

            var vertexColor = new Vector(0, 0, 0, 0);
            if (splittedRow.length > 4)
            {
                vertexColor.colored = true;
                vertexColor.x = parseFloat(splittedRow[4]);
                vertexColor.y = parseFloat(splittedRow[5]);
                vertexColor.z = parseFloat(splittedRow[6]);
                vertexColor.w = 1;
            }

            if (splittedRow.length >= 8)
                vertexColor.w = parseFloat(splittedRow[7]) / 255;

            cacheColorVertexes.push(vertexColor);
        }

        if (splitted[i].substring(0,3) == "vt ")
        {
            var splittedRow = splitted[i].split(" ");
            var vector = new Vector(
                parseFloat(splittedRow[1]), 
                parseFloat(splittedRow[2]), 
                0, 
                0);
            cacheVertexTextures.push(vector);
        }

        if (splitted[i].substring(0,2) == "f ")
        {
            var splittedFace = splitted[i].split(" ");
            var v = 0;
            var vt = 0;

            if (splittedFace[1].split("/").length > 1)
            {
                v1 = parseFloat(splittedFace[1].split("/")[0]) - 1;
                vt1 = parseFloat(splittedFace[1].split("/")[1]) - 1;
                v2 = parseFloat(splittedFace[2].split("/")[0]) - 1;
                vt2 = parseFloat(splittedFace[2].split("/")[1]) - 1;
                v3 = parseFloat(splittedFace[3].split("/")[0]) - 1;
                vt3 = parseFloat(splittedFace[3].split("/")[1]) - 1;

                cacheFaces.push({V1: v1, VT1: vt1, V2: v2, VT2: vt2, V3: v3, VT3: vt3, useTexture: true});
            }
            else
            {
                v1 = parseFloat(splittedFace[1]) - 1;
                v2 = parseFloat(splittedFace[2]) - 1;
                v3 = parseFloat(splittedFace[3]) - 1;

                cacheFaces.push({V1: v1, VT1: 0, V2: v2, VT2: 0, V3: v3, VT3: 0, useTexture: false});
            }
        }
    }   

    for (var i = 0; i < cacheFaces.length; i++) 
    {
        if (cacheFaces[i].useTexture === true)
        {
               v1 = cacheFaces[i].V1;
               vt1 = cacheFaces[i].VT1;
               v2 = cacheFaces[i].V2;
               vt2 = cacheFaces[i].VT2;
               v3 = cacheFaces[i].V3;
               vt3 = cacheFaces[i].VT3;

               var tri = this.createNewTriangleWithPoints(cacheVertexes[v1],  
                                                          cacheVertexes[v2], 
                                                          cacheVertexes[v3]);

               tri.setTexture( new Vector2D(	cacheVertexTextures[vt1].x, 
                                               cacheVertexTextures[vt1].y, 
                                            1),

                               new Vector2D(	cacheVertexTextures[vt2].x, 
                                               cacheVertexTextures[vt2].y, 
                                            1),

                               new Vector2D(	cacheVertexTextures[vt3].x, 
                                               cacheVertexTextures[vt3].y,
                                            1));
            
               tri.useTexture = true;
        }
        else
        {
            v1 = cacheFaces[i].V1;
            v2 = cacheFaces[i].V2;
            v3 = cacheFaces[i].V3;

            var tri = this.createNewTriangleWithPoints(cacheVertexes[v1], cacheVertexes[v2], cacheVertexes[v3]);
            var vertexColor = cacheColorVertexes[v1];
            if (vertexColor !== null && vertexColor.colored === true)
            {
                tri.faceColor.r = vertexColor.x;
                tri.faceColor.g = vertexColor.y;
                tri.faceColor.b = vertexColor.z;
                tri.faceColor.a = vertexColor.w;
            }
        }

        var face = new Vector(v1, v2, v3);
	    this.faces.push(face);
			    
        this.addTriangle(tri);
    }   

    // Set global Mesh using the first color in the first index.
    if (cacheColorVertexes.length > 0)
    {
        var vertexColor = cacheColorVertexes[0];
        if (vertexColor !== null && vertexColor.colored === true)
            this.color(vertexColor.x, vertexColor.y, vertexColor.z, vertexColor.w);
    }

    if (materialFile !== "" && cacheMaterialsName.length > 0)
    {
        this.loadTextureFromMaterialFile(materialFile, cacheMaterialsName);
    }

    console.log("generateMeshFromFileData ",this.fileName, ", triangles count:", this.tris.length);			
}

Mesh.prototype.loadTextureFromMaterialFile = function(_fileName, _materialNames) 
{
    if (C_MOCK_MODE === true)
    {
        this.loadTextureFromMaterialFileMock(_fileName, _materialNames);
    }
    else
    {
        this.loadTextureFromMaterialFileServer(_fileName, _materialNames);
    }
}

Mesh.prototype.loadTextureFromMaterialFileMock = function(_fileName, _materialNames) 
{
    this.materialFileName = JSGameEngine.resolveURLToResourceFolder(_fileName).toLowerCase();

    if (mockedObj.has(this.materialFileName) === true)
    {
        var responseText = mockedObj.get(this.materialFileName);
        responseText = responseText.replace(/&lf;/g, "\n");
        this.parseMaterialFile(_fileName, responseText, _materialNames);	            
    }
}

Mesh.prototype.loadTextureFromMaterialFileServer = function(_fileName, _materialNames) 
{
    var thisClass = this;
    this.materialFileName = "/obj/" + _fileName;

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", this.materialFileName, false);
    rawFile.onreadystatechange = function ()
    {
        var loadedOk = false;
        var allText = "";

        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                thisClass.parseMaterialFile(thisClass.materialFileName, rawFile.responseText, _materialNames);
                loadedOk = true;
            }
        }
    }
    rawFile.send(null);
}

Mesh.prototype.parseMaterialFile = function(_fileName, _data, _materialsNames) 
{
    var splitted = _data.split("\n");

    // File example
    // newmtl Mat_0
    // Kd 1.000000 1.000000 1.000000
    // map_Kd jario_WithBorder_NoMipMap.png

    for (var i = 0; i < splitted.length; i++) 
    {
           if (splitted[i].substring(0,7) == "newmtl ")
           {
               var splittedRow = splitted[i].split(" ");
               materialName = splittedRow[1];
               i = i + 2;		// Skeep two lines to map_Kd

                if (splitted[i].substring(0,7) == "map_Kd ")
                {
                    splittedRow = splitted[i].split(" ");
                    textureName = splittedRow[1];

                    console.log("loaded texture from material", _fileName, ", texture name:", textureName);			
                    this.loadTexture(textureName);
                }							   		
           }
    }   
}

Mesh.prototype.color = function(_r, _g, _b, _a) 
{
    this.meshColor.r = _r;
    this.meshColor.g = _g;
    this.meshColor.b = _b;
    this.meshColor.a = _a;

    this.tris.forEach(element => {
        element.faceColor.r = _r;
        element.faceColor.g = _g;
        element.faceColor.b = _b;
        element.faceColor.a = _a;
    });
}


Mesh.prototype.addTriangle = function(triangle) 
{
    this.tris.push(triangle);
}

Mesh.prototype.createNewTriangleWithPointsValues = function(x1, y1, z1, x2, y2, z2, x3, y3, z3) 
{
    var v1 = new Vector(x1, y1, z1);
    var v2 = new Vector(x2, y2, z2);
    var v3 = new Vector(x3, y3, z3);

    var tri = new Triangle();
    tri.set(v1, v2, v3);

    return tri;
}

Mesh.prototype.createNewTriangleWithPoints = function(_v1, _v2, _v3) 
{
    return this.createNewTriangleWithPointsValues(_v1.x, _v1.y, _v1.z, _v2.x, _v2.y, _v2.z, _v3.x, _v3.y, _v3.z);
}

Mesh.prototype.updateCenter = function()
{
    var tri = null;

    for (var i = 0; i < this.tris.length; i++) 
    {
        tri = this.tris[i];

        if (i === 0)
        {
            this.VectorMin.x = tri.p[0].x;
            this.VectorMin.y = tri.p[0].y;
            this.VectorMin.z = tri.p[0].z;
            this.VectorMax.x = tri.p[0].x;
            this.VectorMax.y = tri.p[0].y;
            this.VectorMax.z = tri.p[0].z;
        }

        for (var ip = 0; ip < 3; ip++) 
        {
            if (tri.p[ip].x <= this.VectorMin.x) this.VectorMin.x = tri.p[ip].x;
            if (tri.p[ip].y <= this.VectorMin.y) this.VectorMin.y = tri.p[ip].y;
            if (tri.p[ip].z <= this.VectorMin.z) this.VectorMin.z = tri.p[ip].z;

            if (tri.p[ip].x >= this.VectorMax.x) this.VectorMax.x = tri.p[ip].x;
            if (tri.p[ip].y >= this.VectorMax.y) this.VectorMax.y = tri.p[ip].y;
            if (tri.p[ip].z >= this.VectorMax.z) this.VectorMax.z = tri.p[ip].z;
        }
    }			

    this.VectorCenter.x = (this.VectorMin.x * -1) - this.getHalfX();
    this.VectorCenter.y = (this.VectorMin.y * -1) - this.getHalfY();
    this.VectorCenter.z = (this.VectorMin.z * -1) - this.getHalfZ();
}		

Mesh.prototype.getHalfX = function()
{
    return ((this.VectorMax.x - this.VectorMin.x) / 2);
}

Mesh.prototype.getHalfY = function()
{
    return ((this.VectorMax.y - this.VectorMin.y) / 2);
}

Mesh.prototype.getHalfZ = function()
{
    return ((this.VectorMax.z - this.VectorMin.z) / 2);
}

Mesh.prototype.move = function(_x, _y, _z)
{
    var tri = null;

    for (var i = 0; i < this.tris.length; i++) 
    {
        tri = this.tris[i];

        for (var ip = 0; ip < 3; ip++) 
        {
            tri.p[ip].x += _x;
            tri.p[ip].y += _y;
            tri.p[ip].z += _z;
        }
    }			
}		

Mesh.prototype.center = function()
{
    var tri = null;

    for (var i = 0; i < this.tris.length; i++) 
    {
        tri = this.tris[i];

        for (var ip = 0; ip < 3; ip++) 
        {
            tri.p[ip].x += this.VectorCenter.x;
            tri.p[ip].y += this.VectorCenter.y;
            tri.p[ip].z += this.VectorCenter.z;
        }
    }			
}		

Mesh.prototype.addMeshAt = function(_mesh, _x, _y, _z)
{
    var tri = null;

    for (var i = 0; i < _mesh.tris.length; i++) 
    {
        tri = new Triangle();
        tri.p[0].clone(_mesh.tris[i].p[0]);
        tri.p[1].clone(_mesh.tris[i].p[1]);
        tri.p[2].clone(_mesh.tris[i].p[2]);

        for (var ip = 0; ip < 3; ip++) 
        {
            tri.p[ip].x += _x * 1.5;
            tri.p[ip].y += _y * 1.5;
            tri.p[ip].z += _z * 1.5;
        }

        this.createNewTriangleWithPoints(tri.p[0], tri.p[1], tri.p[2]);
    }			
}		

Mesh.prototype.setPosition = function(_x, _y, _z) 
{
    this.position.x = _x;
    this.position.y = _y;
    this.position.z = _z;
}

Mesh.prototype.setPositionX = function(_x) 
{
    this.position.x = _x;
}

Mesh.prototype.setPositionY = function(_y) 
{
    this.position.y = _y;
}

Mesh.prototype.setPositionZ = function(_z) 
{
    this.position.z = _z;
}

Mesh.prototype.getPosition = function() 
{
    return this.position;
}

Mesh.prototype.setAngleX = function(_value) 
{
    this.rotation.x = _value;
}

Mesh.prototype.setAngleY = function(_value) 
{
    this.rotation.y = _value;
}

Mesh.prototype.setAngleZ = function(_value) 
{
    this.rotation.z = _value;
}

Mesh.prototype.addAngleX = function(_value) 
{
    this.rotation.x += _value;
}

Mesh.prototype.addAngleY = function(_value) 
{
    this.rotation.y += _value;
}

Mesh.prototype.addAngleZ = function(_value) 
{
    this.rotation.z += _value;
}

Mesh.prototype.getRotation = function() 
{
    return this.rotation;
}

Mesh.prototype.setScale = function(_x, _y, _z) 
{
    this.setScaleX(_x);
    this.setScaleY(_y);
    this.setScaleZ(_z);
}

Mesh.prototype.setScaleX = function(_value) 
{
    this.scale.x = _value;
}

Mesh.prototype.setScaleY = function(_value) 
{
    this.scale.y = _value;
}

Mesh.prototype.setScaleZ = function(_value) 
{
    this.scale.z = _value;
}

Mesh.prototype.getScale = function() 
{
    return this.scale;
}

Mesh.prototype.loadTexture = function(_url) 
{
    var url = "";

    this.textureFileName = JSGameEngine.resolveURLToResourceFolder(_url).toLowerCase();
    if (C_MOCK_MODE === true)
    {
        url = mockedObj.get(this.textureFileName); 
    }
    else
    {
        url = this.textureFileName; 
    }

    this.loadTextureFile(url);
}

Mesh.prototype.loadTextureFile = function(_url) 
{
    var _this = this;
    this.imgTexture.onload = function () 
    {
        if (_this.imgTexture != null)
        {
            //var srcNameSplit = _this.imgTexture.src.split("/");
            //var imageName = (srcNameSplit[srcNameSplit.length - 1]).split(".")[0];
            var imgWidth = _this.imgTexture.width;
            var imgHeight = _this.imgTexture.height;
            var canvasName = "imageTexture_" + Date.now();

            var newCanvas = document.createElement('canvas');
            newCanvas.width = imgWidth;
            newCanvas.height = imgHeight;
            newCanvas.id = canvasName;

            var newContext = newCanvas.getContext('2d'); 
            newContext.clearRect(0, 0, imgWidth, imgHeight);
            newContext.drawImage(_this.imgTexture, 0, 0);

            _this.imgDataTexture = newContext.getImageData(0, 0,imgWidth, imgHeight);
            _this.updateMeshBecauseTextureWasLoaded = true;
        }
    }			

    this.imgTexture.onerror = function(e)
    {
        console.log("Error loading image:");
        console.log(e);
    }	

    console.log("loadTextureFile: " + _url)
    this.imgTexture.crossOrigin = "Anonymous";
    this.imgTexture.src = _url;
}

Mesh.prototype.isTextureLoaded = function() 
{
    return this.imgDataTexture !== null;
}

Mesh.prototype.setZOrder = function(_zOrder)
{
    for (var i = 0; i < this.tris.length; i++) 
    {
        this.tris[i].zOrder = _zOrder;	
    }
}
 
// --------------------------------------------------------------- 
// CLASS: piece.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// This class is and extention of Mesh using composition with specific
// data and methods for house app.
//

function Piece() 
{
    this._id = -1;
    this.type = -1;
    this.mesh = new Mesh();

    // The piece only can be pleaced in a link of type hole.
    // Example: pilars, floors, and so on.
    this.allowHoleMovement = false;

    // The piece only can be pleaced in a link of type ground.
    // Example: doors, windows.
    this.allowGroundMovement = false;
    
    this.selected = false;
    this.zOrder = 0;
}

Piece.prototype.init = function(_id) 
{
    this._id = _id;
}

Piece.prototype.getId = function() 
{
    return this._id;
}

Piece.prototype.setId = function(_value) 
{
    this._id = _value;
}

Piece.prototype.setType = function(_value) 
{
    this.type = _value;
}

Piece.prototype.getType = function() 
{
    return this.type;
}

Piece.prototype.setSelected = function(_value) 
{
    this.selected = _value;
    if (this.selected === true)
        this.mesh.alpha = 0.3;
    else
        this.mesh.alpha = 1;
}

Piece.prototype.allowPieceOnThisPlace = function(_linkPosition) 
{
    return ((this.allowHoleMovement === _linkPosition.holeType || this.allowGroundMovement === _linkPosition.groundType) && 
        (_linkPosition.holeType === true || _linkPosition.groundType === true));
}

Piece.prototype.getMesh = function() 
{
    return this.mesh;
}

Piece.prototype.restoreMeshZOrderWithPieceZOrder = function() 
{
    return this.mesh.setZOrder(this.zOrder);
}

Piece.prototype.setZOrder = function(_value) 
{
    this.zOrder = _value;
    this.restoreMeshZOrderWithPieceZOrder();
}

Piece.prototype.getZOrder = function() 
{
    return this.zOrder;
}

Piece.prototype.isPilar = function() 
{
    return (this.type === PieceFactory.PILAR_TALL || 
    this.type === PieceFactory.PILAR_MEDIUM || 
    this.type === PieceFactory.PILAR_SMALL);
}

Piece.prototype.autoRotateInLinkPosition = function() 
{
    return (this.type !== PieceFactory.CABRIADA && 
            this.type !== PieceFactory.CABRIADAB &&
            this.type !== PieceFactory.ROOF && 
            this.type !== PieceFactory.ROOFB);
}

Piece.prototype.getDownYPosition = function() 
{
    var result = 0;

    if (this.type === PieceFactory.CABRIADA || this.type === PieceFactory.CABRIADAB)
    {
        result = -4;
    }
    else if (this.type === PieceFactory.ROOF || this.type === PieceFactory.ROOFB)
    {
        result = (this.getMesh().getHalfY() * 2) - 4;
    }
    else if (this.type === PieceFactory.FLOOR)
    {
        result = 80;
    }

    return result;
}
 
// --------------------------------------------------------------- 
// CLASS: pieceFactory.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Whenever you want to create and initializate a piece you must use 
// this class.
//

PieceFactory.CURSOR = 0;

PieceFactory.BOARD = 100;   

PieceFactory.PILAR_SMALL = 1;       
PieceFactory.RAILING = 2;           
PieceFactory.SOCLE = 3;             
PieceFactory.WINDOW = 4;            
PieceFactory.DOOR = 5;              

PieceFactory.PILAR_MEDIUM = 6;      
PieceFactory.PILAR_TALL = 7;    

PieceFactory.FLOOR = 8;          
PieceFactory.CABRIADA = 9;      
PieceFactory.CABRIADAB = 91;    
PieceFactory.ROOF = 10;        
PieceFactory.ROOFB = 11;       

PieceFactory.instance = null; 

function PieceFactory() 
{
    this.lastPieceId = 0;
}

PieceFactory.getInstance = function()
{
    if (PieceFactory.instance === null)
        PieceFactory.instance = new PieceFactory();

    return PieceFactory.instance;
}

PieceFactory.prototype.getNextPieceId = function()
{
    return this.lastPieceId + 1;
}

PieceFactory.prototype.createPiece = function(_pieceType) 
{
    var result = null;

    switch (_pieceType)
    {
        case PieceFactory.CURSOR:
            result = this.getCURSOR();
            break;  
        case PieceFactory.BOARD:
            result = this.getBOARD();
            break;                  
        case PieceFactory.DOOR:
            result = this.getDOOR();
            break;
        case PieceFactory.WINDOW:
            result = this.getWINDOW();            
            break;
        case PieceFactory.SOCLE:
            result = this.getSOCLE();            
            break;
        case PieceFactory.PILAR_TALL:
            result = this.getPILAR_TALL();
            break;
        case PieceFactory.PILAR_MEDIUM:
            result = this.getPILAR_MEDIUM();
            break;
        case PieceFactory.PILAR_SMALL:
            result = this.getPILAR_SMALL();
            break;
        case PieceFactory.RAILING:
            result = this.getRAILING();
            break;
        case PieceFactory.CABRIADA:
            result = this.getCABRIADA();
            break;     
        case PieceFactory.CABRIADAB:
            result = this.getCABRIADAB();
            break;      
        case PieceFactory.ROOF:
            result = this.getROOF();
            break;     
        case PieceFactory.ROOFB:
            result = this.getROOFB();
            break;           
        case PieceFactory.FLOOR:
            result = this.getFLOOR();
            break;                                     
    }

    if (result !== null)
    {
        this.lastPieceId = this.getNextPieceId();
        result.setId(this.lastPieceId);
        result.getMesh().setId(this.lastPieceId);
        result.setType(_pieceType);
    }

    return result;
}

PieceFactory.prototype.getCURSOR = function() 
{
    var piece = new Piece();
    piece.init(this.getNextPieceId());

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("cursorMark.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, 1, 0);
    newMesh.setZOrder(9999);
    newMesh.color(255, 255, 0, 1);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;
    piece.allowGroundMovement = true;

    return piece;
}	

PieceFactory.prototype.getBOARD = function() 
{
    var piece = new Piece();
    piece.init(this.getNextPieceId());

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("BOARD.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY() * -1, 0);

    piece.mesh = newMesh;
    piece.setZOrder(1);

    return piece;
}	

PieceFactory.prototype.getDOOR = function() 
{
    var piece = new Piece();
    piece.init(this.getNextPieceId());

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("DOOR.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowGroundMovement = true;    
    piece.setZOrder(5);
    
    return piece;
}	

PieceFactory.prototype.getWINDOW = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("WINDOW.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowGroundMovement = true;    
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getSOCLE = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("SOCLE.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowGroundMovement = true;    
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getPILAR_TALL = function() 
{
    var piece = new Piece();
    piece.init(this.getNextPieceId());

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("PILAR_TALL.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getPILAR_MEDIUM = function() 
{
    var piece = new Piece();
    piece.init(this.getNextPieceId());

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("PILAR_MEDIUM.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getPILAR_SMALL = function() 
{
    var piece = new Piece();
    piece.init(this.getNextPieceId());

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("PILAR_SMALL.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getRAILING = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("RAILING.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowGroundMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getCABRIADA = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("CABRIADA.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getCABRIADAB = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("CABRIADA.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);
    newMesh.setAngleY(JSGameEngine.graToRad(90));

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getROOF = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("ROOF.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getROOFB = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("ROOF.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);
    newMesh.setAngleY(JSGameEngine.graToRad(90));

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getFLOOR = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("FLOOR.obj"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.createShapeFromFile = function(_meshCube, _loadedStatus, _center)
{
    if (_loadedStatus === true)
    {
        if (_center)
        {
            _meshCube.updateCenter();
            _meshCube.center();
        }
    }
    else
    {
        console.log("Error loading mesh:", _meshCube.fileNme);
    }
} 
// --------------------------------------------------------------- 
// CLASS: linkPoint.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// This class is an intersecion beetwen a row and a columns in the board
// matrix. Each object of type linkPoint is like an stack of pieces.
// The user add or delete pieces and using simple functions that 
// make some magic to determinate Y position taking account previos 
// pieces in the stack.
// NOTE: this is not the only way to solve pieces management.
//

LinkPoint.C_TYPE_INVALID = 0;
LinkPoint.C_TYPE_HOLE = 1;
LinkPoint.C_TYPE_GROUND = 2;

LinkPoint.C_DIRECTION_NOT_SET = 0;
LinkPoint.C_DIRECTION_HORIZONTAL = 1;
LinkPoint.C_DIRECTION_VERTICAL = 2;

function LinkPoint() 
{
    this.indexPos = new Vector(0, 0, 0);
    this.position = new Vector(0, 0, 0);
    this.holeType = false;
    this.groundType = false;
    this.pieces = new Array();
    this.direction = 0;
}

LinkPoint.prototype.init = function(_indexPos, _position, _holeType, _groundType, _direction) 
{
    this.indexPos = _indexPos;
    this.position = _position;
    this.holeType = _holeType;
    this.groundType = _groundType;
    this.pieces = new Array();
    this.direction = _direction;
}

LinkPoint.prototype.equals = function(_element) 
{
    return _element !== null && this.indexPos.x === _element.indexPos.x && this.indexPos.y === _element.indexPos.y; 
}

LinkPoint.prototype.isHoleType = function() 
{
    return this.holeType === true; 
}

LinkPoint.prototype.isGroundType = function() 
{
    return this.groundType === true; 
}

LinkPoint.prototype.removePiece = function(_pieceId) 
{
    var removeIndex = -1;
    for (let index = 0; index < this.pieces.length; index++) 
    {
        const element = this.pieces[index];
        if (element.getId() === _pieceId)
            removeIndex = index; 
    }

    if (removeIndex !== -1)
        this.pieces.splice(removeIndex, 1);
}
 
// --------------------------------------------------------------- 
// CLASS: cursor.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// A combination of piece (recgangle with no height) and reference to
// current link.
//

function Cursor() 
{
    this.piece = new Piece();
    this.link = new LinkPoint();
}

Cursor.prototype.setMesh = function(_mesh) 
{
    this.piece.mesh = _mesh;
}

Cursor.prototype.getMesh = function() 
{
    return this.piece.mesh;
}

Cursor.prototype.setLink = function(_linkPoint) 
{
    this.link = _linkPoint;
    this.piece.mesh.setPosition(this.link.position.x, 1, this.link.position.z);
}

Cursor.prototype.getLink = function() 
{
    return this.link;
}
 
// --------------------------------------------------------------- 
// CLASS: bluePlane.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Manager of pieces objects, it allows add, remove, load, save an
// entire set of pieces.
//

BluePlane.C_BOARD_COLUMNS = 11; 
BluePlane.C_BOARD_ROWS = 7;
BluePlane.C_SIZE = 20;
BluePlane.C_OFFSET_X = 25 - 125;
BluePlane.C_OFFSET_Y = 25 - 85;

function BluePlane() 
{
    this.linkPoints = new Array();
    this.cursor = new Cursor();
    this.selectedPiece = null;
    this.currentLayer = -1;  // 0 means all layers.

    this.meshCollection = new Array();
    this.dataModified = false;

    this.initPlane();
}

BluePlane.prototype.initPlane = function() 
{
    var item = null;
    
    var linkPointsMatrix = 
    [
        [1,2,1,2,1,2,1,2,1,2,1],
        [2,0,2,0,2,0,2,0,2,0,2],
        [1,2,1,2,1,2,1,2,1,2,1],
        [2,0,2,0,2,0,2,0,2,0,2],
        [1,2,1,2,1,2,1,2,1,2,1],
        [2,0,2,0,2,0,2,0,2,0,2],
        [1,2,1,2,1,2,1,2,1,2,1]
    ];

    for (var y = 0; y < BluePlane.C_BOARD_ROWS; y++)
        for (var x = 0; x < BluePlane.C_BOARD_COLUMNS; x++)
        {
            if (linkPointsMatrix[y][x] === LinkPoint.C_TYPE_INVALID)
            {
                item = new LinkPoint();
                item.init(
                    new Vector(x, y, 0),
                    new Vector((x * BluePlane.C_SIZE) + BluePlane.C_OFFSET_X , 0, (y * BluePlane.C_SIZE) + BluePlane.C_OFFSET_Y),
                    false,
                    false,
                    LinkPoint.C_DIRECTION_NOT_SET);
                this.linkPoints.push(item);
            }
            if (linkPointsMatrix[y][x] === LinkPoint.C_TYPE_HOLE)
            {
                item = new LinkPoint();
                item.init(
                    new Vector(x, y, 0),
                    new Vector((x * BluePlane.C_SIZE) + BluePlane.C_OFFSET_X , 0, (y * BluePlane.C_SIZE) + BluePlane.C_OFFSET_Y),
                    true,
                    false,
                    LinkPoint.C_DIRECTION_NOT_SET);
                this.linkPoints.push(item);

                if (this.initialLinkPointHole === null)
                    this.initialLinkPointHole = item;
            }
            else if (linkPointsMatrix[y][x] === LinkPoint.C_TYPE_GROUND)
            {
                var linkDirection = LinkPoint.C_DIRECTION_NOT_SET;
                if (y % 2 === 0)
                    linkDirection = LinkPoint.C_DIRECTION_HORIZONTAL;
                else
                    linkDirection = LinkPoint.C_DIRECTION_VERTICAL;

                item = new LinkPoint();
                item.init(
                    new Vector(x, y, 0),
                    new Vector((x * BluePlane.C_SIZE) + BluePlane.C_OFFSET_X , 0, (y * BluePlane.C_SIZE) + BluePlane.C_OFFSET_Y),
                    false,
                    true,
                    linkDirection);
                this.linkPoints.push(item);

                if (this.initialLinkPointGround === null)
                    this.initialLinkPointGround = item;
            }
        }

    // Add cursor to current space.
    var linkPoint = this.getLinkPointAtIndex(0, 0); 

    this.cursor.piece = PieceFactory.getInstance().createPiece(PieceFactory.CURSOR);
    this.cursor.piece.setSelected(true);
    this.cursor.setLink(this.getLinkPointAtIndex(0, 0));
    
    this.addMesh(this.cursor.getMesh());

    // Add tablero made by the union of ground and cursor marks.
    this.createTablero();
}

BluePlane.prototype.getLinkPointAtIndex = function(_column, _row) 
{
    return this.linkPoints.find
    (
        function(element) 
        {
            return element.indexPos.x === _column && element.indexPos.y === _row;
        }
    );
}

BluePlane.prototype.moveCursor = function(_columnDelta, _rowDelta) 
{
    var actualX = this.cursor.link.indexPos.x;
    var actualY = this.cursor.link.indexPos.y;
    
    if (actualX + _columnDelta >= 0 && actualX + _columnDelta < BluePlane.C_BOARD_COLUMNS &&
        actualY + _rowDelta >= 0 && actualY + _rowDelta < BluePlane.C_BOARD_ROWS)
    {
        this.cursor.setLink(this.getLinkPointAtIndex(actualX + _columnDelta, actualY + _rowDelta));
        this.setModifiedData(true);
    }
}

BluePlane.prototype.findLinkedPointFromPiece = function(_piece) 
{
    var result = null;
    var element = null; 
    for (var index = 0; index < this.linkPoints.length && result === null; index++) 
    {
        element = this.linkPoints[index];

        for (var p = 0; p < element.pieces.length && result === null; p++) 
        {
            elementPiece = element.pieces[p];

            if (elementPiece._id === _piece._id)
            {
                result = element;
            }
        }            
    }

    return result;
}

BluePlane.prototype.getCursor = function() 
{
    return this.cursor;
}

BluePlane.prototype.addPieceAtCursor = function(_pieceType) 
{
    this.addPieceAtLink(this.cursor.getLink(), _pieceType);
}

BluePlane.prototype.addPieceAtLink = function(_link, _pieceType) 
{
    var piece = PieceFactory.getInstance().createPiece(_pieceType);

    if (this.movePieceToLinkPosition(_link, piece) === true)
    {
        _link.pieces.push(piece);
        this.addMesh(piece.mesh);
        this.reorganizePiecesYPosition(_link);
    }
    else
        piece = null;

    return piece;
}

BluePlane.prototype.reorganizePiecesYPosition = function(_link)
{
    var acumulativeY = 0;
    var element = null;

    if (_link.isHoleType() === true)
    {
        _link.pieces.forEach
        (   element => 
            {
                var dy = element.getDownYPosition();

                if (element.getType() === PieceFactory.PILAR_SMALL ||
                    element.getType() === PieceFactory.PILAR_MEDIUM ||
                    element.getType() === PieceFactory.PILAR_TALL)
                {
                    element.getMesh().setPositionY(acumulativeY + element.getMesh().getHalfY() - dy);
                }
                else
                {
                    if (element.getType() === PieceFactory.FLOOR)
                    {
                        element.getMesh().setPositionY(acumulativeY +  dy);
                        acumulativeY = acumulativeY + dy;

                    }
                    else
                    {
                        element.getMesh().setPositionY(acumulativeY + element.getMesh().getHalfY() - dy);
                        acumulativeY = acumulativeY + (element.getMesh().getHalfY() * 2) - dy;
                    }
                }
            }
        );
    }
    else
    {
        _link.pieces.forEach
        (   element => 
            {
                var dy = element.getDownYPosition();

                element.getMesh().setPositionY(acumulativeY + element.getMesh().getHalfY() - dy);
                acumulativeY = acumulativeY + (element.getMesh().getHalfY() * 2) - dy;
            }
        );
    }
}

BluePlane.prototype.movePieceToCursorPosition = function(_cursor, _piece) 
{
    return this.movePieceToLinkPosition(_cursor.getLink(), _piece);
}

BluePlane.prototype.movePieceToLinkPosition = function(_link, _piece) 
{
    var result = false;

    if (_piece.allowPieceOnThisPlace(_link) === true)
    {
        _piece.mesh.setPosition(_link.position.x,  _piece.mesh.position.y, _link.position.z);

        if (_piece.autoRotateInLinkPosition() === true)
        {
            if (_link.direction === LinkPoint.C_DIRECTION_VERTICAL)
                _piece.mesh.setAngleY(JSGameEngine.graToRad(90));
            else
                _piece.mesh.setAngleY(JSGameEngine.graToRad(0));
        }

        result = true;
    }

    return result;
}

BluePlane.prototype.deleteSelectedPiece = function() 
{
    if (this.cursor === null || this.getSelectedPiece() === null)
        return;

    var pieceId = this.getSelectedPiece().getId();
    var meshId = this.getSelectedPiece().getMesh().getId();

    this.cursor.getLink().removePiece(pieceId);
    this.reorganizePiecesYPosition(this.cursor.getLink());
    
    this.removePiece(meshId);

    this.selectedPiece = null;
}

BluePlane.prototype.createTablero = function() 
{
    var linkPoint = null;
    var pilar = null;

    //
    var ground = new Piece();
    ground = PieceFactory.getInstance().createPiece(PieceFactory.BOARD);
    this.addMesh(ground.getMesh());

    var pilarBase = new Mesh();
    pilarBase.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("holeMark.obj"), null, true);
    pilarBase.updateCenter();
    pilarBase.center();
 
    var groundBase = new Mesh();
    groundBase.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("groundMark.obj"), null, true);
    groundBase.updateCenter();
    groundBase.center();
 
    for (var y = 0; y < BluePlane.C_BOARD_ROWS; y++)
    {
        for (var x = 0; x < BluePlane.C_BOARD_COLUMNS; x++)
        {
            linkPoint = this.getLinkPointAtIndex(x, y);

            pilar = null;
            if (linkPoint.isHoleType() === true)
            {
                pilar = new Mesh();
                pilar.generateMeshFromFileData(pilarBase.meshData);
                pilar.updateCenter();
                pilar.center();
            }

            if (linkPoint.isGroundType() === true)
            {
                pilar = new Mesh();
                pilar.generateMeshFromFileData(groundBase.meshData);
                pilar.updateCenter();
                pilar.center();
            }
            
            if (pilar !== null)
            {
                pilar.setPosition(linkPoint.position.x, linkPoint.position.y, linkPoint.position.z);
                pilar.setZOrder(2);
                this.addMesh(pilar);
            }
        }
    }
}

BluePlane.prototype.togleSelectPiece = function()
{
    if (this.selectedPiece === null)
    {
        this.selectPieceAtCursor();
    }
    else
    {
        this.selectedPiece.setSelected(false);
        this.selectedPiece = null;
    }
}

BluePlane.prototype.toggleNextSelectedPiece = function()
{
    if (this.selectedPiece !== null)
    {
        var pieceId = this.selectedPiece.getId();

        for (let index = 0; index < this.cursor.link.pieces.length; index++) 
        {
            const element = this.cursor.link.pieces[index];
            
            if (element.getId() === pieceId)
            {
                if (index + 1 < this.cursor.link.pieces.length)
                {
                    this.togleSelectPiece();

                    this.selectedPiece = this.cursor.link.pieces[index + 1];
                    this.selectedPiece.setSelected(true);
                }
                break;
            }
        }
    }
}

BluePlane.prototype.togglePreviousSelectedPiece = function()
{
    if (this.selectedPiece !== null)
    {
        var pieceId = this.selectedPiece.getId();

        for (let index = this.cursor.link.pieces.length - 1; index >= 0; index--) 
        {
            const element = this.cursor.link.pieces[index];
            
            if (element.getId() === pieceId)
            {
                if (index - 1 >= 0)
                {
                    this.togleSelectPiece();

                    this.selectedPiece = this.cursor.link.pieces[index - 1];
                    this.selectedPiece.setSelected(true);
                }
                break;
            }
        }
    }
}

BluePlane.prototype.getSelectedPiece = function() 
{
    return this.selectedPiece;
}

BluePlane.prototype.selectPieceAtCursor = function() 
{
    if (this.cursor.link.pieces.length > 0)
    {
        this.selectedPiece = this.cursor.link.pieces[0];
        this.selectedPiece.setSelected(true);
    }
}

BluePlane.prototype.rotateSelectedPiece = function() 
{
    this.getSelectedPiece().mesh.addAngleY(JSGameEngine.graToRad(90));
}

BluePlane.prototype.loadBoard = function(_fileName) 
{
    if (C_MOCK_MODE === true)
    {
        this.loadBoardMock(_fileName);
    }
    else
    {
        this.loadBoardServer(_fileName);
    }
}

BluePlane.prototype.loadBoardMock = function(_fileName) 
{
    if (mockedObj.has(_fileName) === true)
    {
        var responseText = mockedObj.get(_fileName);
        responseText = responseText.replace(/&lf;/g, "\n");
        this.setBoardFromData(responseText);	            
    }
}

BluePlane.prototype.loadBoardServer = function(_fileName) 
{
    var thisClass = this;

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", _fileName, false);
    rawFile.onreadystatechange = function ()
    {
        var loadedOk = false;
        var allText = "";

        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                thisClass.setBoardFromData(rawFile.responseText);
            }
        }
    }
    rawFile.send(null);
}

BluePlane.prototype.setBoardFromData = function(_data) 
{
    var bluePlaneOBJ = null;
    
    this.bluePlaneOBJ = JSON.parse(_data);

    // Process all layers
    for (var layerIndex = 0; layerIndex < this.bluePlaneOBJ.Layers.length; layerIndex++)
    {
        const pieceMatrix = this.bluePlaneOBJ.Layers[layerIndex].pieceMatrix;  
        
        // Process matrix layer.
        var linkIndex = 0;
        for (var row = 0; row < pieceMatrix.length; row++)
        {
            const rowElement = pieceMatrix[row];
            for (var col = 0; col < rowElement.length; col++)
            {
                if (pieceMatrix[row][col] !== -1)
                {
                    this.addPieceAtLink(this.linkPoints[linkIndex], pieceMatrix[row][col]);
                }
                linkIndex++;
            }
        }
    }
}

BluePlane.prototype.saveBoard = function(_filename) 
{
    var bluePlaneOBJ = this.generateBoardData();
    var json = JSON.stringify(bluePlaneOBJ, null, "   ");

    JSGameEngine.download(_filename, json);
}

BluePlane.prototype.printBoard = function(_fileName) 
{
    var bluePlaneOBJ = this.generateBoardData();
    var lines = Array();
    var fileData = "";
    
    console.clear();

    //TODO: add piece quick reference.
    fileData += "Piece reference  " + "\n";
    fileData += "1- PILAR BAJO    " + "\n";
    fileData += "2- RAILING       " + "\n";
    fileData += "3- SOCLE        " + "\n";
    fileData += "4- WINDOW       " + "\n";
    fileData += "5- DOOR        " + "\n";
    fileData += "6- PILAR MEDIO   " + "\n";
    fileData += "7- PILAR ALTO    " + "\n";
    fileData += "8- FLOOR          " + "\n";
    fileData += "9- CABRIADA (SHF)" + "\n";
    fileData += "0- ROOF (SHF)   " + "\n";
    fileData += "\n";

    // Process all layers
    for (var layerIndex = 0; layerIndex < bluePlaneOBJ.Layers.length; layerIndex++)
    {
        const pieceMatrix = bluePlaneOBJ.Layers[layerIndex].pieceMatrix;
        JSGameEngine.chClearArray(lines);
        
        for (var row = 0; row < pieceMatrix.length; row++)
        {
            const rowElement = pieceMatrix[row];
            var colText = "";
            var colText2 = "";
            var token = "";
            for (var col = 0; col < rowElement.length; col++)
            {
                if (row % 2 === 0)
                {
                    if (pieceMatrix[row][col] !== -1)
                    {
                        token = JSGameEngine.padChar(pieceMatrix[row][col], 2, "0");
                    }
                    else
                    {
                        if (col % 2 === 0)
                            token = "[]";
                        else
                            token = "--";
                    }
                    colText += token;
                    
                    if (col < rowElement.length - 1)
                        colText += "--";
                }
                else
                {
                    if (pieceMatrix[row][col] !== -1)
                    {
                        token = JSGameEngine.padChar(pieceMatrix[row][col], 2, "0");
                    }
                    else
                    {
                        if (col % 2 === 0)
                            token = "| ";
                        else
                            token = "  ";
                    }
                    colText += token;
                    
                    if (col < rowElement.length - 1)
                        colText += "  ";
                }

                // Second line
                if (row < pieceMatrix.length -1)
                {
                    if (col % 2 === 0)
                        colText2 += "| ";
                    else
                        colText2 += "  ";

                    if (col < rowElement.length - 1)
                        colText2 += "  ";
                }
            }

            if (colText.length > 0)
                lines.push(colText);
            
            if (colText2.length > 0)
                lines.push(colText2);
            //console.log(colText);
            //console.log(colText2);
        }

        var line = "";
        lines.push("Layer:" + layerIndex);
        for (var i = lines.length - 1; i >= 0; i--) 
        {
            // Avoid CHrome console merge same text lines.
            line = lines[i];
            if (i % 2 === 0)
                line += " ";

            console.log(line);
            fileData += line + "\n";
        }
        console.log("\n\n\n");
        fileData += "\n\n\n";
    }
   
    JSGameEngine.download(_fileName, fileData);    
}

BluePlane.prototype.generateBoardData = function() 
{
    var bluePlaneOBJ = 
    {
        BoardColumns: 0, 
        BoardRows: 0,
        BoardId: 0,
        Layers: []
    };
    var layerOBJ = {layerNro: 0, pieceMatrix: null};
    var column = null;

    bluePlaneOBJ.BoardColumns = BluePlane.C_BOARD_COLUMNS;
    bluePlaneOBJ.BoardRows =  BluePlane.C_BOARD_ROWS;
    bluePlaneOBJ.BoardId =  PieceFactory.BOARD;

    var maxlayer = this.getMaxLayer();
    var layerItem = null;    
    for (let index = 0; index < maxlayer; index++) 
    {
        // The first layer is made by pilar pieces only.
        if (index === 0)
        {
            layerItem = Object.create(layerOBJ);
            layerItem.layerNro = index + 1; 
            layerItem.pieceMatrix = this.generateMatrixByLayer(true, 0);
            bluePlaneOBJ.Layers.push(layerItem);
        }

        layerItem = Object.create(layerOBJ);
        layerItem.layerNro = index + 2; 
        layerItem.pieceMatrix = this.generateMatrixByLayer(false, index);
        bluePlaneOBJ.Layers.push(layerItem);
    } 

    return bluePlaneOBJ;
}

BluePlane.prototype.generateMatrixByLayer = function(_forcePilarFilter, _level) 
{
    var matrix = new Array();

    var result = null;
    var element = null;
    var index = 0; 
    var id = -1;
    for (var y = 0; y < BluePlane.C_BOARD_ROWS; y++)
    {
        var colArray = new Array();
        for (var x = 0; x < BluePlane.C_BOARD_COLUMNS; x++)
        {
            element = this.linkPoints[index];
            id = -1;
     
            if (element.pieces.length > _level)
                if (_forcePilarFilter === element.pieces[_level].isPilar())
                    id = element.pieces[_level].getType();

            colArray.push(id);
            
            index++;
        }
        matrix.push(colArray);
    }

    return matrix;
}

BluePlane.prototype.getMaxLayer = function() 
{
    var result = -1;

    for (var index = 0; index < this.linkPoints.length; index++) 
    {
        if (this.linkPoints[index].pieces.length > result)
            result = this.linkPoints[index].pieces.length;
    }

    return result;
}

BluePlane.prototype.selectNextLayer = function() 
{
    if (this.currentLayer < this.getMaxLayer() - 1)
    {
        this.currentLayer++;
        this.onlyShowCurrentLayer();
    }
}

BluePlane.prototype.selectPreviousLayer = function() 
{
    if (this.currentLayer > -1)
    {
        this.currentLayer--;
        this.onlyShowCurrentLayer();
    }
}

BluePlane.prototype.onlyShowCurrentLayer = function() 
{
    var element = null; 
    for (var index = 0; index < this.linkPoints.length; index++) 
    {
        element = this.linkPoints[index];

        for (var p = 0; p < element.pieces.length; p++) 
        {
            elementPiece = element.pieces[p];

            elementPiece.getMesh().hide  = true;
            if (p === this.currentLayer || this.currentLayer === -1)
            {
                elementPiece.getMesh().hide = false;
                this.setModifiedData(true);
            }
        }            
    }
}

BluePlane.prototype.addMesh = function(_mesh)
{ 
    this.getMeshCollection().push(_mesh);
    this.setModifiedData(true);
}

BluePlane.prototype.getMeshCollection = function()
{ 
    return this.meshCollection;
}

BluePlane.prototype.setMeshCollection = function(_meshCollection)
{ 
    this.meshCollection = _meshCollection;
}

BluePlane.prototype.removePiece = function(_pieceId) 
{
    var removeIndex = -1;
    for (let index = 0; index < this.meshCollection.length; index++) 
    {
        const element = this.meshCollection[index];
        if (element.getId() === _pieceId)
        {
            removeIndex = index; 
        }
    }

    if (removeIndex !== -1)
    {
        this.meshCollection.splice(removeIndex, 1);
        this.setModifiedData(true);
    }
}

BluePlane.prototype.setModifiedData = function(_value) 
{
    this.dataModified = _value;
}

BluePlane.prototype.isDataModified = function(_pieceId) 
{
    return this.dataModified;
}

 
// --------------------------------------------------------------- 
// CLASS: spaceThree.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Adapter to use Trhee.js instead my own 3D engine, 
// their kung fuu is better. 
//

function SpaceThree() 
{
    this.camera = new Vector(0, 0, 0);
    this.cameraYaw = 0;
    this.cameraXaw = 0;
    this.cameraZoom = 0;
    this.normalsVisible = false;
    this.linesVisible = false;
    this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;

    this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    this.cameraControlEnabled = false;
    this.ambientLightFactor = 0;    // 0 has no insidence, 1 full light.

    this.viewWidth = 800;
    this.viewHeight = 600;
    this.viewOffsetX = 0;
    this.viewOffsetY = 0;

    // Space preview with ThreeJS
    this.sceneT = new THREE.Scene();
    this.cameraT = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.rendererT = new THREE.WebGLRenderer();

    // Init orbit
    this.orbitControls = new THREE.OrbitControls( this.cameraT, this.rendererT.domElement );
                
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.mygroup = new THREE.Group();
}

SpaceThree.prototype.appendToDocumentBody = function() 
{
    document.body.appendChild( this.rendererT.domElement );
}

SpaceThree.prototype.setViewSize = function(_width, _height) 
{
    this.viewWidth = _width;
    this.viewHeight = _height;
    this.rendererT.setSize( 512, 320 );
}

SpaceThree.prototype.setViewOffset = function(_offsetX, _offsetY) 
{
    this.viewOffsetX = _offsetX;
    this.viewOffsetY = _offsetY;
}

SpaceThree.prototype.setLight = function(_x, _y, _z) 
{

    //this.lightDirection.x = _x;
    //this.lightDirection.y = _y;
    //this.lightDirection.z = _z;

    //this.lightDirection.normalize();
}

SpaceThree.prototype.addHemisphereLight = function(_skyColor, _groundColor) 
{
    var skyColor = _skyColor;  
    var groundColor = _groundColor;  
    var intensity = 1;
    var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    this.sceneT.add(light);
}

SpaceThree.prototype.addDirectionalLight = function(_color, _x, _y, _z, _x2, _y2, _z2) 
{
    const color = _color;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(_x, _y, _z);
    light.target.position.set(_x2, _y2, _z2);
    this.sceneT.add(light);
    this.sceneT.add(light.target);
}

SpaceThree.prototype.setCamera = function(_x, _y, _z) 
{
    this.camera.x = Math.round(_x);
    this.camera.y = Math.round(_y);
    this.camera.z = Math.round(_z);

    this.updateCameraT(this.getCamera(), this.getLookAtVector());
}

SpaceThree.prototype.updateCameraT = function(_camera, _lookAtVector) 
{
    this.cameraT.position.x = _camera.x;
    this.cameraT.position.y = _camera.y;
    this.cameraT.position.z = _camera.z * -1;

    var x2 = this.cameraT.position.x + _lookAtVector.x;
    var y2 = this.cameraT.position.y + _lookAtVector.y;
    var z2 = this.cameraT.position.z + _lookAtVector.z * -1;
    this.cameraT.lookAt( x2, y2, z2);

    //this.cameraT.up.set( 0, 0, 1 );
    this.cameraT.updateProjectionMatrix();
}

SpaceThree.prototype.addCameraZoom = function(_value) 
{
    this.cameraZoom += _value;
}

SpaceThree.prototype.subCameraZoom = function(_value) 
{
    this.cameraZoom -= _value;
    if (this.cameraZoom <= 0)
        this.cameraZoom = 0.01;
}

SpaceThree.prototype.getCamera = function() 
{
    return this.camera;
}

SpaceThree.prototype.updateIsometricCamera = function(_xaw, _yaw)
{
    this.updateCameraT(this.getCamera(), this.getLookAtVector());
}
SpaceThree.prototype.createRotateXMatrix = function(x) 
{
        var cosX = Math.cos(x);
        var sinX = Math.sin(x);
        var rotX = [
            [1, 0, 0, 0],
            [0, cosX, -sinX, 0],
            [0, sinX, cosX,0],
            [0, 0, 0, 1]
        ];	

        return rotX;				
}

SpaceThree.prototype.createRotateYMatrix = function(y) 
{
        var cosY = Math.cos(y);
        var sinY = Math.sin(y);
        var rotY = [
            [cosY, 0, sinY, 0],
            [0, 1, 0, 0],
            [-sinY, 0, cosY, 0],
            [0, 0, 0, 1]
        ];	
        
        return rotY;				
}
SpaceThree.prototype.getLookAtVector = function() 
{
    return this.getLookAtVectorAt(this.cameraXaw, this.cameraYaw);
}

SpaceThree.prototype.getLookAtVectorAt = function(_xaw, _yaw) 
{
    var lookAt = new Vector(0, 0, 0);
    var vTarget = new Vector(0, 0, 1);

    var xawMatrix = this.createRotateXMatrix(_xaw);
    var yawMatrix = this.createRotateYMatrix(_yaw);

    Space.multiplyMatrixVectorOver(vTarget, xawMatrix);
    Space.multiplyMatrixVectorOver(vTarget, yawMatrix);

    lookAt.clone(vTarget);
    return lookAt;
}

SpaceThree.prototype.update = function(_meshCollection, _forceThreeUpdate)
{ 
    gEngine.startTime("process");
    
    if (_forceThreeUpdate === false)
        _forceThreeUpdate = this.checkIFSomeMeshMustBeUpdated(_meshCollection);

    if (_forceThreeUpdate === true)
    {
        // Calculate render data for each mesh.
        var meshItem = null;
        for (var i = 0; i < _meshCollection.length; i++) 
        {
            meshItem = _meshCollection[i];
            if (meshItem.hide === false)
            {
                var mesh = this.createRenderData(meshItem);
                this.mygroup.add(mesh);
            }    
        }			
        this.sceneT.add( this.mygroup );
    }
    
    gEngine.showTimeDiff("process");

    this.render();
    
    if (gEngine.logTimes === true)
    {
        console.log("Count triangles:", sceneTiranglesToRender.length, "(mesh =", _meshCollection.length, ")");
    }
}

SpaceThree.prototype.checkIFSomeMeshMustBeUpdated = function(_meshCollection)
{ 
    var returnValue = false;
    
    for (var i = 0; i < _meshCollection.length; i++) 
    {
        if (_meshCollection[i].updateMeshBecauseTextureWasLoaded === true)
        {
            _meshCollection[i].updateMeshBecauseTextureWasLoaded = false;
            returnValue = true;
        }
    }

    return returnValue;
}

// COnvert MEsh to Three Shape and add to scene.
SpaceThree.prototype.createRenderData = function(_mesh)
{ 
    if (typeof this.sceneT.getObjectById(this.mygroup.id) !== 'undefined')
    {
        JSGameEngine.chClearArray(this.mygroup.children);
        this.sceneT.remove(this.mygroup);
    }

    // MATERIAL
    var mycube_material = null;
    if (_mesh.imgDataTexture !== null)
    {
        var loader = new THREE.TextureLoader();
        var texture = null;
        
        if (C_MOCK_MODE === true)
            texture = loader.load(mockedObj.get(_mesh.textureFileName));
        else
            texture = loader.load(_mesh.textureFileName);
        
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        var repeats = 1;
        texture.repeat.set(repeats, repeats);

        mycube_material = new THREE.MeshPhongMaterial({             
            map: texture,
            side: THREE.DoubleSide
        });
    }
    else
    {
        var shColor = JSGameEngine.st_rgbaToColor( _mesh.meshColor.r, _mesh.meshColor.g,  _mesh.meshColor.b);
        mycube_material = new THREE.MeshPhongMaterial( { color: shColor } );
    }

    // GEOMETRY
    var mycube_geometry = new THREE.Geometry();

    // Dump mesh data to THREE.mesn
    for (var i = 0; i < _mesh.points.length; i++) 
    {
        mycube_geometry.vertices.push
        (
            new THREE.Vector3(
                _mesh.points[i].x + _mesh.VectorCenter.x, 
                _mesh.points[i].y + _mesh.VectorCenter.y, 
                _mesh.points[i].z + _mesh.VectorCenter.z)
        );
    }

    for (var i = 0; i < _mesh.faces.length; i++) 
    {
        mycube_geometry.faces.push
        (
            new THREE.Face3(_mesh.faces[i].x, _mesh.faces[i].y, _mesh.faces[i].z)
        );
    }

    if (_mesh.imgDataTexture !== null)
    {
        for (var i = 0; i < _mesh.faces.length; i++) 
        {
            mycube_geometry.faceVertexUvs[0].push( 
                [
                    new THREE.Vector2(_mesh.tris[i].t[0].u, _mesh.tris[i].t[0].v), 
                    new THREE.Vector2(_mesh.tris[i].t[1].u, _mesh.tris[i].t[1].v), 
                    new THREE.Vector2(_mesh.tris[i].t[2].u, _mesh.tris[i].t[2].v) 
                ]);
        }
    }

    //mycube_geometry.computeBoundingSphere();
    mycube_geometry.computeFaceNormals();

    // MESH
    var mycube_mesh = new THREE.Mesh(mycube_geometry, mycube_material );

    // TRANSFORMATIONS
    // Scale
    mycube_mesh.scale.set(
        _mesh.getScale().x, 
        _mesh.getScale().y, 
        _mesh.getScale().z); 

    // Rotation
    mycube_mesh.rotateX(_mesh.getRotation().x);
    mycube_mesh.rotateY(_mesh.getRotation().y);
    mycube_mesh.rotateZ(_mesh.getRotation().z);

    // Position
    mycube_mesh.position.set(
        _mesh.position.x , 
        _mesh.position.y , 
        _mesh.position.z * -1);


    return mycube_mesh;
}

SpaceThree.prototype.render = function()
{ 
    gEngine.startTime("draw");
 
    this.rendererT.render( this.sceneT, this.cameraT );

    gEngine.showTimeDiff("draw");	
}

SpaceThree.prototype.renderLookAt = function(_currentLayer)
{ 
    var vCamera = this.getCamera();
    var vLookDir = this.getLookAtVector();

    // Viewport
    var rectSize = 100;
    var r = {   
        x1: 50,
        y1: 10, 
        x2: rectSize, 
        y2: rectSize};
    
    var rmx = r.x1 + rectSize / 2;
    var rmy = r.y1 + rectSize / 2;

    gEngine.renderRectangle(r.x1, r.y1, rectSize, rectSize, 1, "green");
    gEngine.renderLine(rmx, r.y1, rmx, r.y1 + rectSize, 1, "green");
    gEngine.renderLine(r.x1, rmy, r.x1 + rectSize, rmy, 1, "green");

    // Camera position			
    var cameraPosText = "C Pos: " + Math.round(vCamera.x) + "," + Math.round(vCamera.y) + "," + Math.round(vCamera.z) + "";
    gEngine.renderText(r.x1, r.y1 + rectSize + 10, cameraPosText, "green");

    // Camera angles			
    var cameraRotText = "C Ang: " + Math.round(JSGameEngine.radToGra (this.cameraXaw)) + "," + 
    Math.round(JSGameEngine.radToGra (this.cameraYaw)) + "," + (this.cameraZoom).toFixed(2);
    gEngine.renderText(r.x1, r.y1 + rectSize + 20, cameraRotText, "green");

    // Cursor
    var k = JSGameEngine.C_VIEWPORT_SCALE;

    var mw = this.viewWidth / 2;
    var mh = this.viewHeight / 2;
    
    var x1 = vCamera.x;
    var y1 = vCamera.z;

    var x2 = x1 * k + (vLookDir.x * JSGameEngine.C_VIEWPORT_CURSOR_LENGTH);
    var y2 = y1 * k + (vLookDir.z * JSGameEngine.C_VIEWPORT_CURSOR_LENGTH);

    gEngine.renderLine(rmx + x1 * k, rmy - y1 * k, rmx + x2, rmy - y2, 1, JSGameEngine.FG_WHITE);
    gEngine.renderCircle(rmx + x1 * k, rmy - y1 * k, 2, 0, JSGameEngine.FG_WHITE);

    // Projection information
    var projectionInfo = ""
    if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
        projectionInfo = "P=P";
    else
        projectionInfo = "P=I";
    gEngine.renderText(r.x1 - 30, r.y1 + 9, projectionInfo, "yellow");

    // Illumination information
    var fillTypeInfo = ""
    if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
        fillTypeInfo = "I=S";
    else if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_LIGHT)
        fillTypeInfo = "I=L";
    gEngine.renderText(r.x1 - 30, r.y1 + 19, fillTypeInfo, "yellow");

    // Wireframe information
    var wireframeInfo = ""
    if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        wireframeInfo = "M=W";
    else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
        wireframeInfo = "M=T";
    else if (this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
            wireframeInfo = "M=P";
    gEngine.renderText(r.x1 - 30, r.y1 + 29, wireframeInfo, "yellow");

    // Camera control information
    var cameraControlInfo = ""
    if (this.cameraControlEnabled === true)
        cameraControlInfo = "C";
    else
        cameraControlInfo = "c";
    gEngine.renderText(r.x1 - 30, r.y1 + 39, cameraControlInfo, "yellow");			

    // Current layer.
    if (_currentLayer !== -1)
    {
        gEngine.renderText(r.x1 - 30, r.y1 + 49, "CL=" + _currentLayer, "yellow");
    }			     
}

SpaceThree.prototype.renderInfo = function()
{ 
}

SpaceThree.prototype.changeRenderMode = function() 
{
    if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
        this.renderMode = Space.C_RENDER_MODE_PIXEL_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
        this.renderMode = Space.C_RENDER_MODE_WIREFRAME;
}

SpaceThree.prototype.changeProjectionType = function() 
{
    /*
    if (this.projectionType === Space.C_PROJECTION_TYPE_ISOMETRIC)
        this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    else if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
        this.projectionType = Space.C_PROJECTION_TYPE_ISOMETRIC;
    */
}

SpaceThree.prototype.changeIlluminationMode = function() 
{
    if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_LIGHT)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_SOLID;
    else if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;
}

SpaceThree.prototype.changeNormalVisibility = function() 
{
    this.normalsVisible = !this.normalsVisible;
}
 
// --------------------------------------------------------------- 
// CLASS: mockedObj.js 
// --------------------------------------------------------------- 
 
// This file is autogenerated, if you add some byte it will be  
// deleted in the next iteration.  
  
var mockedObj = new Map(); 
var item = ""; 
 
item = '# Exported from Motor3dJS&lf;o Object.1&lf;v 0.00 0.00 0.00 10 10 255&lf;v 0.00 15.00 0.00 10 10 255&lf;v 15.00 15.00 0.00 10 10 255&lf;v 15.00 0.00 0.00 10 10 255&lf;v 0.00 0.00 15.00 10 10 255&lf;v 0.00 15.00 15.00 10 10 255&lf;v 15.00 15.00 15.00 10 10 255&lf;v 15.00 0.00 15.00 10 10 255&lf;&lf;f 2 6 7&lf;f 2 7 3&lf;&lf;&lf;&lf;&lf;';
mockedObj.set('http://localhost:8080/obj/cursorMark.obj'.toLowerCase(), item); 
 
item = '# Exported from Motor3dJS&lf;o Object.1&lf;v 0.00 0.00 0.00 133 87 76&lf;v 0.00 5.00 0.00 133 87 76&lf;v 5.00 5.00 0.00 133 87 76&lf;v 5.00 0.00 0.00 133 87 76&lf;v 0.00 0.00 5.00 133 87 76&lf;v 0.00 5.00 5.00 133 87 76&lf;v 5.00 5.00 5.00 133 87 76&lf;v 5.00 0.00 5.00 133 87 76&lf;&lf;f 2 6 7&lf;f 2 7 3&lf;';
mockedObj.set('http://localhost:8080/obj/groundMark.obj'.toLowerCase(), item); 
 
item = '# Exported from Motor3dJS&lf;o Object.1&lf;v 0.00 0.00 0.00 33 187 76&lf;v 0.00 10.00 0.00 33 187 76&lf;v 10.00 10.00 0.00 33 187 76&lf;v 10.00 0.00 0.00 33 187 76&lf;v 0.00 0.00 10.00 33 187 76&lf;v 0.00 10.00 10.00 33 187 76&lf;v 10.00 10.00 10.00 33 187 76&lf;v 10.00 0.00 10.00 33 187 76&lf;&lf;f 2 6 7&lf;f 2 7 3&lf;&lf;';
mockedObj.set('http://localhost:8080/obj/holeMark.obj'.toLowerCase(), item); 
 
item = 'multiCubeDataParameter&lf;(&lf;[&lf;"0, 0,0,0, 30,20,2, 200 200 200"&lf;]&lf;);&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 200 200 200&lf;v 0.00 20.00 0.00 200 200 200&lf;v 30.00 20.00 0.00 200 200 200&lf;v 30.00 0.00 0.00 200 200 200&lf;v 0.00 0.00 2.00 200 200 200&lf;v 0.00 20.00 2.00 200 200 200&lf;v 30.00 20.00 2.00 200 200 200&lf;v 30.00 0.00 2.00 200 200 200&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;';
mockedObj.set('http://localhost:8080/obj/RAILING.obj'.toLowerCase(), item); 
 
item = '# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 255 255 0&lf;v 0.00 25.00 0.00 255 255 0&lf;v 30.00 25.00 0.00 255 255 0&lf;v 30.00 0.00 0.00 255 255 0&lf;v 0.00 0.00 2.00 255 255 0&lf;v 0.00 25.00 2.00 255 255 0&lf;v 30.00 25.00 2.00 255 255 0&lf;v 30.00 0.00 2.00 255 255 0&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 40.00 0.00 0.00 255 255 0&lf;v 40.00 25.00 0.00 255 255 0&lf;v 70.00 25.00 0.00 255 255 0&lf;v 70.00 0.00 0.00 255 255 0&lf;v 40.00 0.00 2.00 255 255 0&lf;v 40.00 25.00 2.00 255 255 0&lf;v 70.00 25.00 2.00 255 255 0&lf;v 70.00 0.00 2.00 255 255 0&lf;&lf;f 9.00 10.00 11.00&lf;f 9.00 11.00 12.00&lf;f 12.00 11.00 15.00&lf;f 12.00 15.00 16.00&lf;f 16.00 15.00 14.00&lf;f 16.00 14.00 13.00&lf;f 13.00 14.00 10.00&lf;f 13.00 10.00 9.00&lf;f 10.00 14.00 15.00&lf;f 10.00 15.00 11.00&lf;f 16.00 13.00 9.00&lf;f 16.00 9.00 12.00&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 25.00 0.00 255 255 0&lf;v 35.00 50.00 0.00 255 255 0&lf;v 70.00 25.00 0.00 255 255 0&lf;v 0.00 25.00 2.00 255 255 0&lf;v 35.00 50.00 2.00 255 255 0&lf;v 70.00 25.00 2.00 255 255 0&lf;&lf;f 17.00 18.00 19.00&lf;f 20.00 22.00 21.00&lf;f 19.00 18.00 21.00&lf;f 19.00 21.00 22.00&lf;f 20.00 21.00 18.00&lf;f 20.00 18.00 17.00&lf;f 17.00 20.00 21.00&lf;f 17.00 22.00 19.00&lf;&lf;&lf;';
mockedObj.set('http://localhost:8080/obj/CABRIADA.obj'.toLowerCase(), item); 
 
item = 'multiCubeDataParameter&lf;(&lf;[&lf;"0, 0,0,0, 10,169,10, 185 153 118"&lf;]&lf;);&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 185 153 118&lf;v 0.00 189.00 0.00 185 153 118&lf;v 10.00 189.00 0.00 185 153 118&lf;v 10.00 0.00 0.00 185 153 118&lf;v 0.00 0.00 10.00 185 153 118&lf;v 0.00 189.00 10.00 185 153 118&lf;v 10.00 189.00 10.00 185 153 118&lf;v 10.00 0.00 10.00 185 153 118&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;';
mockedObj.set('http://localhost:8080/obj/PILAR_TALL.obj'.toLowerCase(), item); 
 
item = 'multiCubeDataParameter&lf;(&lf;[&lf;"0, 0,0,0, 10,107|,10, 185 153 118"&lf;]&lf;);&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 185 153 118&lf;v 0.00 107.00 0.00 185 153 118&lf;v 10.00 107.00 0.00 185 153 118&lf;v 10.00 0.00 0.00 185 153 118&lf;v 0.00 0.00 10.00 185 153 118&lf;v 0.00 107.00 10.00 185 153 118&lf;v 10.00 107.00 10.00 185 153 118&lf;v 10.00 0.00 10.00 185 153 118&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;';
mockedObj.set('http://localhost:8080/obj/PILAR_MEDIUM.obj'.toLowerCase(), item); 
 
item = '# Exported from 3D Builder&lf;mtllib PILAR_SMALL.mtl&lf;&lf;o Object.1&lf;v 0.000000 0.000000 0.000000&lf;v 0.000000 27.000000 0.000000&lf;v 10.000000 27.000000 0.000000&lf;v 10.000000 0.000000 0.000000&lf;v 10.000000 27.000000 10.000000&lf;v 10.000000 0.000000 10.000000&lf;v 0.000000 27.000000 10.000000&lf;v 0.000000 0.000000 10.000000&lf;&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 6/1 5/4 7/2&lf;f 6/1 7/2 8/3&lf;&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 0.000000&lf;&lf;usemtl Mat_0&lf;f 6/5 1/7 4/8&lf;f 6/5 8/6 1/7&lf;&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 1.000000 0.000000&lf;&lf;usemtl Mat_0&lf;f 4/9 5/10 6/11&lf;f 4/9 3/12 5/10&lf;&lf;vt 1.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 8/13 7/16 2/14&lf;f 8/13 2/14 1/15&lf;&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 1/17 2/20 3/18&lf;f 1/17 3/18 4/19&lf;&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 2/21 7/24 5/22&lf;f 2/21 5/22 3/23&lf;&lf;';
mockedObj.set('http://localhost:8080/obj/PILAR_SMALL.obj'.toLowerCase(), item); 
 
item = '&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 200 0 0&lf;v 0.00 2.00 0.00 200 0 0&lf;v 45.00 33.00 0.00 200 0 0&lf;v 45.00 31.00 0.00 200 0 0&lf;v 0.00 0.00 40.00 200 0 0&lf;v 0.00 2.00 40.00 200 0 0&lf;v 45.00 33.00 40.00 200 0 0&lf;v 45.00 31.00 40.00 200 0 0&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 45.00 31.00 0.00 200 0 0&lf;v 45.00 33.00 0.00 200 0 0&lf;v 90.00 2.00 0.00 200 0 0&lf;v 90.00 0.00 0.00 200 0 0&lf;v 45.00 31.00 40.00 200 0 0&lf;v 45.00 33.00 40.00 200 0 0&lf;v 90.00 2.00 40.00 200 0 0&lf;v 90.00 0.00 40.00 200 0 0&lf;&lf;f 9.00 10.00 11.00&lf;f 9.00 11.00 12.00&lf;f 12.00 11.00 15.00&lf;f 12.00 15.00 16.00&lf;f 16.00 15.00 14.00&lf;f 16.00 14.00 14.00&lf;f 13.00 14.00 10.00&lf;f 13.00 10.00 9.00&lf;f 10.00 14.00 15.00&lf;f 10.00 15.00 11.00&lf;f 16.00 13.00 9.00&lf;f 16.00 9.00 12.00&lf;';
mockedObj.set('http://localhost:8080/obj/ROOF.obj'.toLowerCase(), item); 
 
item = '# Exported from Motor3dJS&lf;o Object.1&lf;v 0.00 0.00 0.00 255 127 37&lf;v 0.00 10.00 0.00 255 127 37&lf;v 250.00 10.00 0.00 255 127 37&lf;v 250.00 0.00 0.00 255 127 37&lf;v 0.00 0.00 170.00 255 127 37&lf;v 0.00 10.00 170.00 255 127 37&lf;v 250.00 10.00 170.00 255 127 37&lf;v 250.00 0.00 170.00 255 127 37&lf;f 1 2 3&lf;f 1 3 4&lf;f 4 3 7&lf;f 4 7 8&lf;f 8 7 6&lf;f 8 6 5&lf;f 5 6 2&lf;f 5 2 1&lf;f 2 6 7&lf;f 2 7 3&lf;f 8 5 1&lf;f 8 1 4&lf;';
mockedObj.set('http://localhost:8080/obj/BOARD.obj'.toLowerCase(), item); 
 
item = 'multiCubeDataParameter&lf;(&lf;[&lf;"0, 0,0,0, 30,5,2, 20 20 128 255",&lf;"8, 0,70,0, 30,10,2, 20 20 128 255",&lf;"16, 0,5,0, 5,65,2, 20 20 128 255",&lf;"24, 25,5,0, 5,65,2, 20 20 128 255"&lf;]&lf;);&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 20 20 128 255&lf;v 0.00 5.00 0.00 20 20 128 255&lf;v 30.00 5.00 0.00 20 20 128 255&lf;v 30.00 0.00 0.00 20 20 128 255&lf;v 0.00 0.00 2.00 20 20 128 255&lf;v 0.00 5.00 2.00 20 20 128 255&lf;v 30.00 5.00 2.00 20 20 128 255&lf;v 30.00 0.00 2.00 20 20 128 255&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 70.00 0.00 20 20 128 255&lf;v 0.00 80.00 0.00 20 20 128 255&lf;v 30.00 80.00 0.00 20 20 128 255&lf;v 30.00 70.00 0.00 20 20 128 255&lf;v 0.00 70.00 2.00 20 20 128 255&lf;v 0.00 80.00 2.00 20 20 128 255&lf;v 30.00 80.00 2.00 20 20 128 255&lf;v 30.00 70.00 2.00 20 20 128 255&lf;&lf;f 9.00 10.00 11.00&lf;f 9.00 11.00 12.00&lf;f 12.00 11.00 15.00&lf;f 12.00 15.00 16.00&lf;f 16.00 15.00 14.00&lf;f 16.00 14.00 13.00&lf;f 13.00 14.00 10.00&lf;f 13.00 10.00 9.00&lf;f 10.00 14.00 15.00&lf;f 10.00 15.00 11.00&lf;f 16.00 13.00 9.00&lf;f 16.00 9.00 12.00&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 5.00 0.00 20 20 128 255&lf;v 0.00 70.00 0.00 20 20 128 255&lf;v 5.00 70.00 0.00 20 20 128 255&lf;v 5.00 5.00 0.00 20 20 128 255&lf;v 0.00 5.00 2.00 20 20 128 255&lf;v 0.00 70.00 2.00 20 20 128 255&lf;v 5.00 70.00 2.00 20 20 128 255&lf;v 5.00 5.00 2.00 20 20 128 255&lf;&lf;f 17.00 18.00 19.00&lf;f 17.00 19.00 20.00&lf;f 20.00 19.00 23.00&lf;f 20.00 23.00 24.00&lf;f 24.00 23.00 22.00&lf;f 24.00 22.00 21.00&lf;f 21.00 22.00 18.00&lf;f 21.00 18.00 17.00&lf;f 18.00 22.00 23.00&lf;f 18.00 23.00 19.00&lf;f 24.00 21.00 17.00&lf;f 24.00 17.00 20.00&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 25.00 5.00 0.00 20 20 128 255&lf;v 25.00 70.00 0.00 20 20 128 255&lf;v 30.00 70.00 0.00 20 20 128 255&lf;v 30.00 5.00 0.00 20 20 128 255&lf;v 25.00 5.00 2.00 20 20 128 255&lf;v 25.00 70.00 2.00 20 20 128 255&lf;v 30.00 70.00 2.00 20 20 128 255&lf;v 30.00 5.00 2.00 20 20 128 255&lf;&lf;f 25.00 26.00 27.00&lf;f 25.00 27.00 28.00&lf;f 28.00 27.00 31.00&lf;f 28.00 31.00 32.00&lf;f 32.00 31.00 30.00&lf;f 32.00 30.00 29.00&lf;f 29.00 30.00 26.00&lf;f 29.00 26.00 25.00&lf;f 26.00 30.00 31.00&lf;f 26.00 31.00 27.00&lf;f 32.00 29.00 25.00&lf;f 32.00 25.00 28.00&lf;';
mockedObj.set('http://localhost:8080/obj/DOOR.obj'.toLowerCase(), item); 
 
item = 'multiCubeDataParameter&lf;(&lf;[&lf;"0, 0,0,0, 30,5,2, 20 128 20",&lf;"8, 0,50,0, 30,10,2, 20 128 20",&lf;"16, 0,5,0, 5,45,2, 20 128 20",&lf;"24, 25,5,0, 5,45,2, 20 128 20",&lf;"32, 12.5,5,0, 5,45,2, 20 128 20",&lf;"40, 5,27.5,0, 20,5,2, 20 128 20"&lf;]&lf;);&lf;&lf;&lf;# Exported from 3D Builder&lf;mtllib WINDOW.mtl&lf;&lf;o Object.1&lf;v 0.000000 0.000000 0.000000 20 128 20&lf;v 30.000000 5.000000 0.000000 20 128 20&lf;v 30.000000 0.000000 0.000000 20 128 20&lf;v 30.000000 0.000000 2.000000 20 128 20&lf;v 0.000000 0.000000 2.000000 20 128 20&lf;v 0.000000 5.000000 2.000000 20 128 20&lf;v 30.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 5.000000 0.000000 20 128 20&lf;&lf;v 0.000000 5.000000 0.000000 20 128 20&lf;v 0.000000 5.000000 2.000000 20 128 20&lf;v 30.000000 5.000000 2.000000 20 128 20&lf;v 30.000000 0.000000 0.000000 20 128 20&lf;v 30.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 5.000000 0.000000 20 128 20&lf;v 30.000000 5.000000 2.000000 20 128 20&lf;v 30.000000 5.000000 0.000000 20 128 20&lf;v 0.000000 0.000000 2.000000 20 128 20&lf;v 0.000000 5.000000 0.000000 20 128 20&lf;&lf;f 3 7 4&lf;f 5 6 8&lf;f 9 10 11&lf;f 12 2 13&lf;f 14 15 16&lf;f 17 18 1&lf;&lf;vt 1.000000 -0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 -0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 4/5 1/6 3/7&lf;f 4/1 7/2 6/3&lf;f 4/1 6/3 5/4&lf;f 4/5 5/8 1/6&lf;&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 1/9 8/12 2/10&lf;f 1/9 2/10 3/11&lf;&lf;&lf;o Object.2&lf;v 0.000000 50.000000 0.000000 20 128 20&lf;v 30.000000 60.000000 0.000000 20 128 20&lf;v 30.000000 50.000000 0.000000 20 128 20&lf;v 30.000000 50.000000 2.000000 20 128 20&lf;v 0.000000 50.000000 2.000000 20 128 20&lf;v 0.000000 60.000000 2.000000 20 128 20&lf;v 30.000000 60.000000 2.000000 20 128 20&lf;v 0.000000 60.000000 0.000000 20 128 20&lf;&lf;v 0.000000 60.000000 0.000000 20 128 20&lf;v 0.000000 60.000000 2.000000 20 128 20&lf;v 30.000000 60.000000 2.000000 20 128 20&lf;v 30.000000 50.000000 0.000000 20 128 20&lf;v 30.000000 60.000000 2.000000 20 128 20&lf;v 0.000000 60.000000 0.000000 20 128 20&lf;v 30.000000 60.000000 2.000000 20 128 20&lf;v 30.000000 60.000000 0.000000 20 128 20&lf;v 0.000000 50.000000 2.000000 20 128 20&lf;v 0.000000 60.000000 0.000000 20 128 20&lf;&lf;f 21 25 22&lf;f 23 24 26&lf;f 27 28 29&lf;f 30 20 31&lf;f 32 33 34&lf;f 35 36 19&lf;&lf;vt 1.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 22/17 19/18 21/19&lf;f 22/13 25/14 24/15&lf;f 22/13 24/15 23/16&lf;f 22/17 23/20 19/18&lf;&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 19/21 26/24 20/22&lf;f 19/21 20/22 21/23&lf;&lf;&lf;o Object.3&lf;v 5.000000 50.000000 0.000000 20 128 20&lf;v 5.000000 5.000000 0.000000 20 128 20&lf;v 5.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 50.000000 2.000000 20 128 20&lf;v 5.000000 50.000000 2.000000 20 128 20&lf;v 0.000000 50.000000 0.000000 20 128 20&lf;v 0.000000 5.000000 0.000000 20 128 20&lf;&lf;v 5.000000 5.000000 0.000000 20 128 20&lf;v 5.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 50.000000 0.000000 20 128 20&lf;v 0.000000 50.000000 2.000000 20 128 20&lf;v 5.000000 50.000000 2.000000 20 128 20&lf;v 5.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 5.000000 0.000000 20 128 20&lf;v 5.000000 5.000000 0.000000 20 128 20&lf;v 5.000000 50.000000 2.000000 20 128 20&lf;v 0.000000 50.000000 0.000000 20 128 20&lf;v 5.000000 50.000000 2.000000 20 128 20&lf;v 5.000000 50.000000 0.000000 20 128 20&lf;v 0.000000 5.000000 2.000000 20 128 20&lf;v 0.000000 50.000000 0.000000 20 128 20&lf;v 0.000000 5.000000 0.000000 20 128 20&lf;&lf;f 39 44 38&lf;f 45 42 46&lf;f 40 41 43&lf;f 47 48 49&lf;f 50 51 52&lf;f 53 37 54&lf;f 55 56 57&lf;f 58 59 60&lf;&lf;vt 1.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;&lf;usemtl Mat_0&lf;f 39/25 42/26 41/27&lf;f 39/25 41/27 40/28&lf;&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 44/29 43/32 37/30&lf;f 44/29 37/30 38/31&lf;&lf;&lf;o Object.4&lf;v 30.000000 50.000000 0.000000 20 128 20&lf;v 30.000000 5.000000 0.000000 20 128 20&lf;v 30.000000 5.000000 2.000000 20 128 20&lf;v 25.000000 5.000000 2.000000 20 128 20&lf;v 25.000000 50.000000 2.000000 20 128 20&lf;v 30.000000 50.000000 2.000000 20 128 20&lf;v 25.000000 50.000000 0.000000 20 128 20&lf;v 25.000000 5.000000 0.000000 20 128 20&lf;&lf;v 30.000000 5.000000 0.000000 20 128 20&lf;v 30.000000 5.000000 2.000000 20 128 20&lf;v 25.000000 50.000000 0.000000 20 128 20&lf;v 25.000000 50.000000 2.000000 20 128 20&lf;v 30.000000 50.000000 2.000000 20 128 20&lf;v 30.000000 5.000000 2.000000 20 128 20&lf;v 25.000000 5.000000 2.000000 20 128 20&lf;v 25.000000 5.000000 0.000000 20 128 20&lf;v 30.000000 5.000000 0.000000 20 128 20&lf;v 30.000000 50.000000 2.000000 20 128 20&lf;v 25.000000 50.000000 0.000000 20 128 20&lf;v 30.000000 50.000000 2.000000 20 128 20&lf;v 30.000000 50.000000 0.000000 20 128 20&lf;v 25.000000 5.000000 2.000000 20 128 20&lf;v 25.000000 50.000000 0.000000 20 128 20&lf;v 25.000000 5.000000 0.000000 20 128 20&lf;&lf;f 63 68 62&lf;f 69 66 70&lf;f 64 65 67&lf;f 71 72 73&lf;f 74 75 76&lf;f 77 61 78&lf;f 79 80 81&lf;f 82 83 84&lf;&lf;vt 1.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;&lf;usemtl Mat_0&lf;f 63/33 66/34 65/35&lf;f 63/33 65/35 64/36&lf;&lf;vt 1.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;&lf;usemtl Mat_0&lf;f 68/37 67/38 61/39&lf;f 68/37 61/39 62/40&lf;&lf;&lf;o Object.5&lf;v 17.500000 50.000000 0.000000 20 128 20&lf;v 17.500000 5.000000 0.000000 20 128 20&lf;v 17.500000 5.000000 2.000000 20 128 20&lf;v 12.500000 5.000000 2.000000 20 128 20&lf;v 12.500000 50.000000 2.000000 20 128 20&lf;v 17.500000 50.000000 2.000000 20 128 20&lf;v 12.500000 50.000000 0.000000 20 128 20&lf;v 12.500000 5.000000 0.000000 20 128 20&lf;&lf;v 17.500000 5.000000 0.000000 20 128 20&lf;v 17.500000 5.000000 2.000000 20 128 20&lf;v 12.500000 50.000000 0.000000 20 128 20&lf;v 12.500000 50.000000 2.000000 20 128 20&lf;v 17.500000 50.000000 2.000000 20 128 20&lf;v 17.500000 5.000000 2.000000 20 128 20&lf;v 12.500000 5.000000 2.000000 20 128 20&lf;v 12.500000 5.000000 0.000000 20 128 20&lf;v 17.500000 5.000000 0.000000 20 128 20&lf;v 17.500000 50.000000 2.000000 20 128 20&lf;v 12.500000 50.000000 0.000000 20 128 20&lf;v 17.500000 50.000000 2.000000 20 128 20&lf;v 17.500000 50.000000 0.000000 20 128 20&lf;v 12.500000 5.000000 2.000000 20 128 20&lf;v 12.500000 50.000000 0.000000 20 128 20&lf;v 12.500000 5.000000 0.000000 20 128 20&lf;&lf;f 87 92 86&lf;f 93 90 94&lf;f 88 89 91&lf;f 95 96 97&lf;f 98 99 100&lf;f 101 85 102&lf;f 103 104 105&lf;f 106 107 108&lf;&lf;vt 1.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;&lf;usemtl Mat_0&lf;f 87/41 90/42 89/43&lf;f 87/41 89/43 88/44&lf;&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 92/45 91/48 85/46&lf;f 92/45 85/46 86/47&lf;&lf;&lf;o Object.6&lf;v 5.000000 27.500000 0.000000 20 128 20&lf;v 25.000000 32.500000 0.000000 20 128 20&lf;v 25.000000 27.500000 0.000000 20 128 20&lf;v 25.000000 27.500000 2.000000 20 128 20&lf;v 5.000000 27.500000 2.000000 20 128 20&lf;v 5.000000 32.500000 2.000000 20 128 20&lf;v 25.000000 32.500000 2.000000 20 128 20&lf;v 5.000000 32.500000 0.000000 20 128 20&lf;&lf;v 5.000000 27.500000 0.000000 20 128 20&lf;v 25.000000 32.500000 0.000000 20 128 20&lf;v 25.000000 27.500000 0.000000 20 128 20&lf;v 5.000000 32.500000 0.000000 20 128 20&lf;v 5.000000 32.500000 0.000000 20 128 20&lf;v 5.000000 32.500000 2.000000 20 128 20&lf;v 25.000000 32.500000 2.000000 20 128 20&lf;v 25.000000 27.500000 0.000000 20 128 20&lf;v 25.000000 32.500000 0.000000 20 128 20&lf;v 25.000000 32.500000 2.000000 20 128 20&lf;v 5.000000 32.500000 0.000000 20 128 20&lf;v 25.000000 32.500000 2.000000 20 128 20&lf;v 25.000000 32.500000 0.000000 20 128 20&lf;v 5.000000 27.500000 2.000000 20 128 20&lf;v 5.000000 32.500000 0.000000 20 128 20&lf;v 5.000000 27.500000 0.000000 20 128 20&lf;&lf;f 109 116 110&lf;f 117 118 111&lf;f 119 115 112&lf;f 113 114 120&lf;f 121 122 123&lf;f 124 125 126&lf;f 127 128 129&lf;f 130 131 132&lf;&lf;vt 1.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 1.000000&lf;vt 0.000000 0.000000&lf;vt 1.000000 0.000000&lf;vt 0.000000 1.000000&lf;&lf;usemtl Mat_0&lf;f 112/53 109/54 111/55&lf;f 112/49 115/50 114/51&lf;f 112/49 114/51 113/52&lf;f 112/53 113/56 109/54&lf;&lf;';
mockedObj.set('http://localhost:8080/obj/WINDOW.obj'.toLowerCase(), item); 
 
item = 'multiCubeDataParameter&lf;(&lf;[&lf;"0, 0,0,0, 40,2,40, 200 200 200 200"&lf;]&lf;);&lf;&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 200 200 200 200&lf;v 0.00 2.00 0.00 200 200 200 200&lf;v 40.00 2.00 0.00 200 200 200 200&lf;v 40.00 0.00 0.00 200 200 200 200&lf;v 0.00 0.00 40.00 200 200 200 200&lf;v 0.00 2.00 40.00 200 200 200 200&lf;v 40.00 2.00 40.00 200 200 200 200&lf;v 40.00 0.00 40.00 200 200 200 200&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;';
mockedObj.set('http://localhost:8080/obj/FLOOR.obj'.toLowerCase(), item); 
 
item = 'multiCubeDataParameter&lf;(&lf;[&lf;"0, 0,0,0, 30,20,2, 255 20 20"&lf;]&lf;);&lf;&lf;# Exported from Motor3dJS&lf;o Object.1&lf;&lf;v 0.00 0.00 0.00 255 20 20&lf;v 0.00 20.00 0.00 255 20 20&lf;v 30.00 20.00 0.00 255 20 20&lf;v 30.00 0.00 0.00 255 20 20&lf;v 0.00 0.00 2.00 255 20 20&lf;v 0.00 20.00 2.00 255 20 20&lf;v 30.00 20.00 2.00 255 20 20&lf;v 30.00 0.00 2.00 255 20 20&lf;&lf;f 1.00 2.00 3.00&lf;f 1.00 3.00 4.00&lf;f 4.00 3.00 7.00&lf;f 4.00 7.00 8.00&lf;f 8.00 7.00 6.00&lf;f 8.00 6.00 5.00&lf;f 5.00 6.00 2.00&lf;f 5.00 2.00 1.00&lf;f 2.00 6.00 7.00&lf;f 2.00 7.00 3.00&lf;f 8.00 5.00 1.00&lf;f 8.00 1.00 4.00&lf;';
mockedObj.set('http://localhost:8080/obj/SOCLE.obj'.toLowerCase(), item); 
 
item = '{&lf;   "BoardColumns": 11,&lf;   "BoardRows": 7,&lf;   "BoardId": 100,&lf;   "Layers": [&lf;      {&lf;         "layerNro": 1,&lf;         "pieceMatrix": [&lf;            [&lf;               1,&lf;               -1,&lf;               6,&lf;               -1,&lf;               6,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               1,&lf;               -1,&lf;               6,&lf;               -1,&lf;               6,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               1,&lf;               -1,&lf;               6,&lf;               -1,&lf;               6,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ]&lf;         ]&lf;      },&lf;      {&lf;         "layerNro": 2,&lf;         "pieceMatrix": [&lf;            [&lf;               -1,&lf;               2,&lf;               -1,&lf;               3,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               2,&lf;               -1,&lf;               5,&lf;               -1,&lf;               3,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               2,&lf;               -1,&lf;               3,&lf;               -1,&lf;               3,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               2,&lf;               -1,&lf;               3,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ]&lf;         ]&lf;      },&lf;      {&lf;         "layerNro": 3,&lf;         "pieceMatrix": [&lf;            [&lf;               -1,&lf;               -1,&lf;               8,&lf;               4,&lf;               8,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               4,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               8,&lf;               -1,&lf;               8,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               4,&lf;               -1,&lf;               4,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               8,&lf;               4,&lf;               8,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ]&lf;         ]&lf;      },&lf;      {&lf;         "layerNro": 4,&lf;         "pieceMatrix": [&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               91,&lf;               -1,&lf;               91,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ]&lf;         ]&lf;      },&lf;      {&lf;         "layerNro": 5,&lf;         "pieceMatrix": [&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               11,&lf;               -1,&lf;               11,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ],&lf;            [&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1,&lf;               -1&lf;            ]&lf;         ]&lf;      }&lf;   ]&lf;}&lf;';
mockedObj.set('http://localhost:8080/obj/HOUSE.bpl'.toLowerCase(), item); 
 
item = '# Exported from 3D Builder&lf;&lf;newmtl Mat_0&lf;Kd 1.000000 1.000000 1.000000&lf;map_Kd window.jpg&lf;';
mockedObj.set('http://localhost:8080/obj/WINDOW.mtl'.toLowerCase(), item); 
 
item = 'data:image/jpeg;base64,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';
mockedObj.set('http://localhost:8080/obj/window.jpg'.toLowerCase(), item); 
 
item = '# Exported from 3D Builder&lf;&lf;newmtl Mat_0&lf;Kd 1.000000 1.000000 1.000000&lf;map_Kd oak.jpg&lf;';
mockedObj.set('http://localhost:8080/obj/PILAR_SMALL.mtl'.toLowerCase(), item); 
 
item = 'data:image/jpeg;base64,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';
mockedObj.set('http://localhost:8080/obj/oak.jpg'.toLowerCase(), item); 
 
 
// --------------------------------------------------------------- 
// CLASS: app.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Entry point to the aplication, main loop, inputs controlle, core
//

var C_VERSION_TITLE = "Little constructor ThreeJS (based on JSEngine + ThreeJS) v2.0";
var gEngine = null; 
var C_SERVER_IP = "localhost:8080";

/* Ok this is a big thing. 
C_MOCK_MODE = true, this means that there is no need to load anything from external. 
Objetcs definitions and demo mode data is all included in hardcoded strings (see mockedObj.js)

C_MOCK_MODE = false, you need to startup some server and serve all files .obj and house,bpl files. 
If I have time (that means, surely not) I will make a detailed doumentation about it.
*/ 
var C_MOCK_MODE = true;

function load() 
{
    console.log(C_VERSION_TITLE);
    console.log("MOCK_MODE:", C_MOCK_MODE);

    document.title = C_VERSION_TITLE;

    gEngine = new JSGameEngine(document.getElementById("cv")); 
    gEngine.start();
}

// --------------------------------------------------------------------
// Game data
//
var spacePreview = new SpaceThree();
var spaceWired = new Space();
var bluePlane = new BluePlane();
var helpMode = false;

var defaultWX = 10;
var defaultWY = 10;
var defaultWZ = 10;
var defaultMeshColor = "100 100 100";
var defaultOffX = 0;
var defaultOffY = 0;
var defaultOffZ = 0;
var defaultIndex = 0;

function onUserCreate() 
{
    console.log("User create");

    /*
    gEngine.showTimes(false);
    */

    // Space wired and top.
    spaceWired.setViewSize(800, 240);
    spaceWired.setViewOffset(0, 10);
    spaceWired.normalsVisible = false;
    spaceWired.linesVisible = false;
    spaceWired.renderMode = Space.C_RENDER_MODE_WIREFRAME;
    spaceWired.setLight(0, 500, 0);
    spaceWired.ambientLightFactor = 0.5;
    spaceWired.projectionType = Space.C_PROJECTION_TYPE_ISOMETRIC;
    spaceWired.setCamera(0, 300, 0);

    spaceWired.cameraXaw = JSGameEngine.graToRad(-90);
    spaceWired.addCameraZoom(1.25);
    spaceWired.updateIsometricCamera(spaceWired.cameraXaw, spaceWired.cameraYaw);
    
    // Space preview.
    spacePreview.appendToDocumentBody();
    spacePreview.setViewSize(512, 320);
    spacePreview.setViewOffset(0, 0);
    spacePreview.normalsVisible = false;
    spacePreview.linesVisible = false;
    //spacePreview.setLight(0, 500, 0);
    //spacePreview.addHemisphereLight(0xB1E1FF, 0xB97A20);
    spacePreview.addDirectionalLight(0xFFA0A0, 500, 200  ,-500,   0,0,0);
    spacePreview.addDirectionalLight(0xA0FFA0, -500, 200  ,-500,   0,0,0);

    spacePreview.addDirectionalLight(0xA0A0FF, 500, 200  ,500,   0,0,0);
    spacePreview.addDirectionalLight(0xA0A0A0, -500, 200 ,500,   0,0,0);

    spacePreview.ambientLightFactor = 0.5;
    spacePreview.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    spacePreview.setCamera(0, 80, -10);

/*    
    var pieceTestCollection = new Array();
    var piecePilar = PieceFactory.getInstance().createPiece(PieceFactory.PILAR_SMALL);
    piecePilar.mesh.setPosition(0, 0, -100);
    bluePlane.addMesh(piecePilar.mesh);
*/
}

function onUserUpdate() 
{
    console.log("User update");			

    processInputs();

    gEngine.clearScreen();
     
    if (helpMode === false)
    {
        spaceWired.update(bluePlane.getMeshCollection(), bluePlane.isDataModified());
        spaceWired.renderInfo();
        spaceWired.renderLookAt(bluePlane.currentLayer);

        spacePreview.update(bluePlane.getMeshCollection(), bluePlane.isDataModified());
        spacePreview.renderInfo();
        spacePreview.renderLookAt(bluePlane.currentLayer);

        bluePlane.setModifiedData(false);
    }
    else
    {
        showHelpScreen();
    }
    
}

function processInputs()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_H) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_H) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_H);
        helpMode = !helpMode;
    }   

    if (helpMode === false)
    {
        this.processInputsFlags();

        if (spacePreview.cameraControlEnabled === true)
            this.processInputsCameraEnabled();
        else
            this.processInputsObjectMovement();

        this.processManagerObjects();
    }
}

function processInputsFlags()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_P) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_P) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_P);

        if (spacePreview.projectionType === Space.C_PROJECTION_TYPE_ISOMETRIC)
        {
            spacePreview.cameraXaw = 0;
            spacePreview.getCamera().y = 40; 
        }
        else
        {
            spacePreview.cameraXaw = JSGameEngine.graToRad(-26);
        }

        spacePreview.changeProjectionType();
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_C) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_C) === false)
    {
        spacePreview.cameraControlEnabled = !spacePreview.cameraControlEnabled;
        gEngine.satKeyWaitRelease(C_KEY_CHAR_C);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_N) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_N) === false)
    {
        spacePreview.changeNormalVisibility();
        gEngine.satKeyWaitRelease(C_KEY_CHAR_N);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_L) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_L) === false)
    {
        spacePreview.linesVisible = !spacePreview.linesVisible;
        gEngine.satKeyWaitRelease(C_KEY_CHAR_L);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_M) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_M) === false)
    {
        spacePreview.changeRenderMode();
        gEngine.satKeyWaitRelease(C_KEY_CHAR_M);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_I) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_I) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_I);
        spacePreview.changeIlluminationMode();
    }    
}

function processInputsCameraEnabled()
{
    if (spacePreview.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
    {
        if (gEngine.isKeyPressed(C_KEY_CTRL) === true)
        {
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().y += 5; 	// Travel Upwards

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().y -= 5; 	// Travel Downwards
        }
        else
        {
            // Rotate camera target.
            if (gEngine.isKeyPressed(C_KEY_LEFT) === true)
                spacePreview.cameraYaw += JSGameEngine.graToRad(5);

            if (gEngine.isKeyPressed(C_KEY_RIGHT) === true)
                spacePreview.cameraYaw -= JSGameEngine.graToRad(5);
        
            // Move camera
            var vForward = Vector.Mul(spacePreview.getLookAtVector(), 5); 

            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().add(vForward);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().sub(vForward);
        }

        spacePreview.updateIsometricCamera(spacePreview.cameraXaw, spacePreview.cameraYaw);
    }
    else
    {
        if (gEngine.isKeyPressed(C_KEY_CTRL) === true)
        {
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.cameraXaw -= JSGameEngine.graToRad(1);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.cameraXaw += JSGameEngine.graToRad(1);
        }
        else if (gEngine.isKeyPressed(C_KEY_SHIFT) === true)
        {
            /*
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().y += 5; 	// Travel Upwards

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().y -= 5; 	// Travel Downwards
                */
        }        
        else
        {

            if (gEngine.isKeyPressed(C_KEY_LEFT) === true)
                spacePreview.cameraYaw += JSGameEngine.graToRad(5);

            if (gEngine.isKeyPressed(C_KEY_RIGHT) === true)
                spacePreview.cameraYaw -= JSGameEngine.graToRad(5);

            // Move camera
            var vForward = Vector.Mul(spacePreview.getLookAtVector(), 1); 

            /*
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().add(vForward);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().sub(vForward);
            */
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
               spacePreview.addCameraZoom(0.1);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.subCameraZoom(0.1);
        }

        spacePreview.updateIsometricCamera(spacePreview.cameraXaw, spacePreview.cameraYaw);
    }
}

function processManagerObjects()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_ADD) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_ADD) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_ADD);
        bluePlane.selectNextLayer();
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_SUB) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_SUB) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_SUB);
        bluePlane.selectPreviousLayer();
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_1) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_1) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.PILAR_SMALL);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_1);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_2) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_2) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.RAILING);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_2);
    }   

    if (gEngine.isKeyPressed(C_KEY_CHAR_3) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_3) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.SOCLE);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_3);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_4) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_4) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.WINDOW);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_4);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_5) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_5) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.DOOR);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_5);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_6) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_6) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.PILAR_MEDIUM);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_6);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_7) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_7) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.PILAR_TALL);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_7);
    }
    
    if (gEngine.isKeyPressed(C_KEY_CHAR_8) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_8) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.FLOOR);

        gEngine.satKeyWaitRelease(C_KEY_CHAR_8);
    }    

    if (gEngine.isKeyPressed(C_KEY_CHAR_9) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_9) === false)
    {
        if (gEngine.isKeyPressed(C_KEY_SHIFT) === false)
            bluePlane.addPieceAtCursor(PieceFactory.CABRIADA);
        else
            bluePlane.addPieceAtCursor(PieceFactory.CABRIADAB);

        gEngine.satKeyWaitRelease(C_KEY_CHAR_9);
    }    

    if (gEngine.isKeyPressed(C_KEY_CHAR_0) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_0) === false)
    {
        if (gEngine.isKeyPressed(C_KEY_SHIFT) === false)
            bluePlane.addPieceAtCursor(PieceFactory.ROOF);
        else
            bluePlane.addPieceAtCursor(PieceFactory.ROOFB);

        gEngine.satKeyWaitRelease(C_KEY_CHAR_0);
    }  
}

function processInputsObjectMovement()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_D) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_D) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_D);
        bluePlane.saveBoard("house.bpl"); 
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_T) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_T) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_T);
        bluePlane.printBoard("housePrint.ppl"); 
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_U) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_U) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_U);
        bluePlane.loadBoard(JSGameEngine.resolveURLToResourceFolder("house.bpl")); 
    }

    if (gEngine.isKeyPressed(C_KEY_SPACE) === true && gEngine.getKeyWaitingRelease(C_KEY_SPACE) === false)
    {
        bluePlane.togleSelectPiece();
        gEngine.satKeyWaitRelease(C_KEY_SPACE);
    }

    if (bluePlane.getSelectedPiece() !== null)
    {
        if (gEngine.isKeyPressed(C_KEY_DELETE) === true && gEngine.getKeyWaitingRelease(C_KEY_DELETE) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_DELETE);
            bluePlane.deleteSelectedPiece(); 
        }
    }

    if (bluePlane.getSelectedPiece() !== null)
    {
        if (gEngine.isKeyPressed(C_KEY_UP) === true && gEngine.getKeyWaitingRelease(C_KEY_UP) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_UP);
            bluePlane.toggleNextSelectedPiece();
        }
    
        if (gEngine.isKeyPressed(C_KEY_DOWN) === true && gEngine.getKeyWaitingRelease(C_KEY_DOWN) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_DOWN);
            bluePlane.togglePreviousSelectedPiece();
        }

        if (gEngine.isKeyPressed(C_KEY_RETURN) === true && gEngine.getKeyWaitingRelease(C_KEY_RETURN) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_RETURN);
            bluePlane.rotateSelectedPiece(); 
        }

        bluePlane.movePieceToCursorPosition(bluePlane.getCursor(), bluePlane.getSelectedPiece());
    }
    else
    {
        if (gEngine.isKeyPressed(C_KEY_LEFT) === true && gEngine.getKeyWaitingRelease(C_KEY_LEFT) === false)
        {
            bluePlane.moveCursor(-1, 0);
            gEngine.satKeyWaitRelease(C_KEY_LEFT);
        }
    
        if (gEngine.isKeyPressed(C_KEY_RIGHT) === true && gEngine.getKeyWaitingRelease(C_KEY_RIGHT) === false)
        {
            bluePlane.moveCursor(1, 0);
            gEngine.satKeyWaitRelease(C_KEY_RIGHT);
        }

        if (gEngine.isKeyPressed(C_KEY_UP) === true && gEngine.getKeyWaitingRelease(C_KEY_UP) === false)
        {
            bluePlane.moveCursor(0, 1);
            gEngine.satKeyWaitRelease(C_KEY_UP);
        }
    
        if (gEngine.isKeyPressed(C_KEY_DOWN) === true && gEngine.getKeyWaitingRelease(C_KEY_DOWN) === false)
        {
            bluePlane.moveCursor(0, -1);
            gEngine.satKeyWaitRelease(C_KEY_DOWN);
        }        
    }
}

function showHelpScreen()
{
    gEngine.setFontSize(12);
    gEngine.locateText(1, 2, "PRESS H TO BACK");
    gEngine.locateText(1, 4, "Board:");
    gEngine.locateText(3, 5, "C=camera control on / off (use rows Right/Up/Left/Down ctrl+Up/Down).");
    gEngine.locateText(3, 6, "H=help screen on / off.");
    gEngine.locateText(3, 7, "I=illumination mode (S=solid, L=light).");
    gEngine.locateText(3, 8, "L=triangle lines on / off.");
    gEngine.locateText(3, 9, "N=normals on / off (you must be very close to see them).");
    gEngine.locateText(3, 10, "M=render mode (T=textured, P=pixel, W=wireframe).");
    gEngine.locateText(3, 11, "P=projection type, (I=isometric, P=perspective).");

    gEngine.locateText(1, 13, "General:");
    gEngine.locateText(3, 14, "Right/Up/Left/Down=move piece cursor.");
    gEngine.locateText(3, 15, "+/-=select layer (like a vertical cut).");
    gEngine.locateText(3, 16, "0..9=insert pieces, see reference in right side.");
    gEngine.locateText(3, 17, "U:upload file (from obj/house.bpl)");
    gEngine.locateText(3, 18, "D:download file binary mode (house.bpl, Chrome save it to download folder)");
    gEngine.locateText(3, 19, "T:download file humna mode (housePrint.ppl, Chrome save it to download folder)");

    gEngine.locateText(1, 22, "Pieces:");
    gEngine.locateText(3, 23, "SPACE:togle piece selection, then use Up/Down.");
    gEngine.locateText(3, 24, "DELETE:delete the selected piece.");
    gEngine.locateText(3, 25, "Up/Down:select piece when they are stacked in a column.");
    gEngine.locateText(3, 26, "RETURN:rotate the selected piece.");

    gEngine.locateText(1, 28, "See more at: http://mfontanadevhome.appspot.com/");
    gEngine.setFontSize(9);

}

// --------------------------------------------------------------------
// RESERVED FUNCTIONS: Making objects from Chrome console.
//
function multiCubeDataParameter(_array)
{
    var mergeAll = "";

    mergeAll = mergeAll + "multiCubeDataParameter" + "\n" + "(" + "\n" + "[" + "\n";
    
    for (let i = 0; i < _array.length; i++) 
    {
        const element = _array[i];

        if (i < _array.length - 1)
            mergeAll = mergeAll + '"' + element + '"' + "," + "\n";
        else
            mergeAll = mergeAll + '"' + element + '"'  + "\n";
    }

    mergeAll = mergeAll + "]" + "\n" + ");" + "\n\n";
    
    for (let i = 0; i < _array.length; i++) 
    {
        const element = _array[i];
        
        const tokens = element.split(",");
        
        const meshDef = cubeDataParameter(
            parseInt(tokens[0]), 
            parseFloat(tokens[1]), 
            parseFloat(tokens[2]), 
            parseFloat(tokens[3]), 
            parseFloat(tokens[4]), 
            parseFloat(tokens[5]), 
            parseFloat(tokens[6]), 
            tokens[7].trim());

            mergeAll = mergeAll + "\n" + meshDef + "\n";
    }

    console.clear();
    console.log(mergeAll);
}

function cubeDataParameter(_index, offX, offY, offZ, sizeX, sizeY, sizeZ, meshColor)
{
    var mesh = new Mesh();

    var meshData = "";

    meshData +="# Exported from Motor3dJS" + "\n";
    meshData +="o Object.1" + "\n";
    meshData +=   "\n";

    meshData +=   generateVertexString(offX,        offY,       offZ, meshColor);
    meshData +=   generateVertexString(offX,        offY+sizeY, offZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY+sizeY, offZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY,       offZ, meshColor);

    meshData +=   generateVertexString(offX,        offY,       offZ+sizeZ, meshColor);
    meshData +=   generateVertexString(offX,        offY+sizeY, offZ+sizeZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY+sizeY, offZ+sizeZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY,       offZ+sizeZ, meshColor);
    meshData +=   "\n";

    // SOUTH
    meshData +=    generateFaceString(_index, 1,2,3);
    meshData +=    generateFaceString(_index, 1,3,4);

    // EAST
    meshData +=    generateFaceString(_index, 4,3,7);
    meshData +=    generateFaceString(_index, 4,7,8);

    // NORTH
    meshData +=    generateFaceString(_index, 8,7,6);
    meshData +=    generateFaceString(_index, 8,6,5);

    // WEST
    meshData +=    generateFaceString(_index, 5,6,2);
    meshData +=    generateFaceString(_index, 5,2,1);

    // TOP
    meshData +=    generateFaceString(_index, 2,6,7);
    meshData +=    generateFaceString(_index, 2,7,3);

    // BOTTOM
    meshData +=    generateFaceString(_index, 8,5,1);
    meshData +=    generateFaceString(_index, 8,1,4);

    return meshData;
}

function generateVertexString(wx, wy, wz, color)
{
    return "v " + wx.toFixed(2) + " " + wy.toFixed(2) + " " + wz.toFixed(2) + " " + color + "\n";
}

function generateFaceString(index, v1, v2, v3)
{
    v1 = v1 + index;
    v2 = v2 + index;
    v3 = v3 + index;

    return "f " + v1.toFixed(2) + " " + v2.toFixed(2) + " " + v3.toFixed(2) + "\n";
}