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
