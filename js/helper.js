function Helper() 
{}


// ARRAY
Helper.clearArray = function(_array)
{
    if (_array != null && _array.length > 0)
    {
        _array.splice(0, _array.length);	
    }
}

// Get an URL to the OBJ folder, adding SERVER IP and  PORT previous to the filename.
Helper.resolveURLToResourceFolder = function(_filename)
{
    return 'obj/' + _filename; 
}

// IO
Helper.download = function(filename, text) 
{
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

// MATH
Helper.graToRad = function(grados)
{
    return grados * Math.PI / 180;
}

Helper.radToGra = function(radians)
{
    return 180 * radians / Math.PI;
}

Helper.distance = function(x1, y1, x2, y2)
{
    var dx = x2 - x1;
    var dy = y2 - y1;

    return Math.sqrt(dx * dx + dy * dy);
}

Helper.distance3D = function(x1, y1, z1, x2, y2, z2)
{
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dz = z2 - z1;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// STRINGS
Helper.padChar = function(num, size, char) 
{
    var numLenght = num.toString().length;
    if (numLenght < size)
        return char.repeat(size - numLenght) + num.toString();
    else
        return num;
}

// COLOR HELPERS
Helper.prototype.rgbaToColor = function(_r, _g, _b, _a) 
{
    var r = _r % 256;
    var g = _g % 256;
    var b = _b % 256;

     var result = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + "," + _a.toString()+")";
    
    return result;
}

Helper.st_rgbaToColor = function(_r, _g, _b) 
{
    var r = _r % 256;
    var g = _g % 256;
    var b = _b % 256;

     var result = "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
    
    return result;
}
