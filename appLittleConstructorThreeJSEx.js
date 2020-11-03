/*
First: thanks to @Javidx9, this was inspired in his youtube tutorials
    OneLoneCoder.com - 3D Graphics Part #1 - Triangles & Projections
    "Tredimensjonal Grafikk" - @Javidx9

First.five: thancks to ThreeJS (https://threejs.org/) I'm speechless.

Second: license

Third: about this and me.

License
~~~~~~~
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
Sources: https://github.com/mfontanadev/appLittleConstructor/tree/ThreeJSEx - Little Constructor 

Thre idea is that you can use it to build virtual houses. I hope this programm can inspire you
to make your own one.

NOTE: this is a branch from appLittleConstructor, this time it has new UX, not using my custom JSEngine,
and other things

Video
~~~~~
PENDING

Author
~~~~~~
site: https://mfontanadev.github.io
twitter: https://twitter.com/mfontanadev
git: https://github.com/mfontanadev
linkedin: https://www.linkedin.com/in/mauricio-fontana-8285681b/?originalSubdomain=ar

Last Updated: 03/10/2020
*/
  
// --------------------------------------------------------------- 
// CLASS: helper.js 
// --------------------------------------------------------------- 
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
    /*
    Space.multiplyMatrixVector(this.p[0], result.p[0], matrix);
    Space.multiplyMatrixVector(this.p[1], result.p[1], matrix);
    Space.multiplyMatrixVector(this.p[2], result.p[2], matrix);
    */
    return result;
}

Triangle.prototype.applyMatrixFromRenderPoints = function(matrix) 
{   /*
    Space.multiplyMatrixVectorOver(this.pointsRender[0], matrix);
    Space.multiplyMatrixVectorOver(this.pointsRender[1], matrix);
    Space.multiplyMatrixVectorOver(this.pointsRender[2], matrix);
    */
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
    this.uuid = "";

    this.actionUpdate = false;
    this.actionAdd = false;

    this.isSelected = false;
    this.actionSelectedFlagChange = false
    
    this.isBackgroundMode = false;
    this.actionBackgroundModeFlagChange = false
}

Mesh.prototype.getId = function() 
{
    return this._id;
}

Mesh.prototype.setId = function(_value) 
{
    this._id = _value;
}

Mesh.prototype.getUuid = function() 
{
    return this.uuid;
}

Mesh.prototype.setUuid = function(_value) 
{
    this.uuid = _value;
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
}

Mesh.prototype.loadTextureFromMaterialFile = function(_fileName, _materialNames) 
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
    this.setPositionX(_x);
    this.setPositionY(_y);
    this.setPositionZ(_z);
}

Mesh.prototype.setPositionX = function(_x) 
{
    this.position.x = _x;
    this.actionUpdate = true;
}

Mesh.prototype.setPositionY = function(_y) 
{
    this.position.y = _y;
    this.actionUpdate = true;
}

Mesh.prototype.setPositionZ = function(_z) 
{
    this.position.z = _z;
    this.actionUpdate = true;
}

Mesh.prototype.getPosition = function() 
{
    return this.position;
}

Mesh.prototype.setAngleX = function(_value) 
{
    this.rotation.x = _value;
    this.actionUpdate = true;
}

Mesh.prototype.setAngleY = function(_value) 
{
    this.rotation.y = _value;
    this.actionUpdate = true;
}

Mesh.prototype.setAngleZ = function(_value) 
{
    this.rotation.z = _value;
    this.actionUpdate = true;
}

Mesh.prototype.addAngleX = function(_value) 
{
    this.rotation.x += _value;
    this.actionUpdate = true;
}

Mesh.prototype.addAngleY = function(_value) 
{
    this.rotation.y += _value;
    this.actionUpdate = true;
}

Mesh.prototype.addAngleZ = function(_value) 
{
    this.rotation.z += _value;
    this.actionUpdate = true;
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
    this.actionUpdate = true;
}

Mesh.prototype.setScaleY = function(_value) 
{
    this.scale.y = _value;
    this.actionUpdate = true;
}

Mesh.prototype.setScaleZ = function(_value) 
{
    this.scale.z = _value;
    this.actionUpdate = true;
}

Mesh.prototype.getScale = function() 
{
    return this.scale;
}

Mesh.prototype.loadTexture = function(_url) 
{
    this.textureFileName = Helper.resolveURLToResourceFolder(_url).toLowerCase();
    this.loadTextureFile(this.textureFileName);
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

Mesh.prototype.setAlpha = function(_alpha)
{
    this.alpha = _alpha;
    this.actionAlphaChange = true;
}

Mesh.prototype.getAlpha = function()
{
    return this.alpha;
}

Mesh.prototype.setSelected = function(_value)
{
    this.isSelected = _value;
    this.actionSelectedFlagChange = true;
}

Mesh.prototype.getSelected = function()
{
    return this.isSelected;
}

Mesh.prototype.setBackgroundMode = function(_value)
{
    this.isBackgroundMode = _value;
    this.actionBackgroundModeFlagChange = true;
}

Mesh.prototype.getBackgroundMode = function()
{
    return this.isBackgroundMode;
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
    this.mesh.setSelected(_value);
}

Piece.prototype.getSelected = function() 
{
    return this.mesh.getSelected();
}

Piece.prototype.setBackgroundMode = function(_value) 
{
    this.mesh.setBackgroundMode(_value);
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

// This is not a best practice, but I don't want spend time (for this project) refactoring.
Piece.prototype.rotate = function() 
{
    if (this.type === PieceFactory.CABRIADA)
    {
        this.type = PieceFactory.CABRIADAB;
        this.mesh.setAngleY(Helper.graToRad(90));
    }
    else if (this.type === PieceFactory.CABRIADAB)
    {
        this.type = PieceFactory.CABRIADA;
        this.mesh.setAngleY(0);
    }
    else if (this.type === PieceFactory.ROOF)
    {
        this.type = PieceFactory.ROOFB;
        this.mesh.setAngleY(Helper.graToRad(90));
    }
    else if (this.type === PieceFactory.ROOFB)
    {
        this.type = PieceFactory.ROOF;
        this.mesh.setAngleY(0);
    }
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

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("cursorMark.OBJ"), this.createShapeFromFile, true);
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

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("BOARD.OBJ"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY() * -1, 0);

    piece.mesh = newMesh;
    piece.setZOrder(1);

    return piece;
}	

PieceFactory.prototype.getDOOR = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("DOOR.OBJ"), this.createShapeFromFile, true);
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
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("WINDOW.OBJ"), this.createShapeFromFile, true);
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
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("SOCLE.OBJ"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowGroundMovement = true;    
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getPILAR_TALL = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("PILAR_TALL.OBJ"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getPILAR_MEDIUM = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("PILAR_MEDIUM.OBJ"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;
    piece.setZOrder(5);

    return piece;
}	

PieceFactory.prototype.getPILAR_SMALL = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("PILAR_SMALL.OBJ"), this.createShapeFromFile, true);
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
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("RAILING.OBJ"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);

    piece.mesh = newMesh;
    piece.allowGroundMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getCABRIADA_base = function(_angle) 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("CABRIADA.OBJ"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);
    newMesh.setAngleY(Helper.graToRad(_angle));

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getCABRIADA = function() 
{
    return this.getCABRIADA_base(0);
}

PieceFactory.prototype.getCABRIADAB = function() 
{
    return this.getCABRIADA_base(90);
}

PieceFactory.prototype.getROOF_base = function(_angle) 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("ROOF.OBJ"), this.createShapeFromFile, true);
    newMesh.setPosition(0, newMesh.getHalfY(), 0);
    newMesh.setAngleY(Helper.graToRad(_angle));

    piece.mesh = newMesh;
    piece.allowHoleMovement = true;    
    piece.setZOrder(5);

    return piece;
}

PieceFactory.prototype.getROOF = function() 
{
    return this.getROOF_base(0);
}

PieceFactory.prototype.getROOFB = function() 
{
    return this.getROOF_base(90);
}

PieceFactory.prototype.getFLOOR = function() 
{
    var piece = new Piece();

    var newMesh = new Mesh();
    newMesh.loadMeshFromFile(Helper.resolveURLToResourceFolder("FLOOR.OBJ"), this.createShapeFromFile, true);
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
    this.clicMesh = null;
}

LinkPoint.prototype.init = function(_indexPos, _position, _holeType, _groundType, _direction, _mesh) 
{
    this.indexPos = _indexPos;
    this.position = _position;
    this.holeType = _holeType;
    this.groundType = _groundType;
    this.pieces = new Array();
    this.direction = _direction;
    this.clicMesh = _mesh
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

LinkPoint.prototype.movePieceUp = function(_pieceId) 
{
    var foundIndex = -1;
    for (let index = 0; index < this.pieces.length; index++) 
    {
        const element = this.pieces[index];
        if (element.getId() === _pieceId)
        {
            foundIndex = index;
        } 
    }

    if (foundIndex !== -1 && foundIndex < this.pieces.length - 1)
    {
        this.swapIndex(foundIndex, foundIndex + 1);
    }
}

LinkPoint.prototype.movePieceDown = function(_pieceId) 
{
    var foundIndex = -1;
    for (let index = 0; index < this.pieces.length; index++) 
    {
        const element = this.pieces[index];
        if (element.getId() === _pieceId)
        {
            foundIndex = index;
        } 
    }

    if (foundIndex !== -1 && foundIndex > 0)
    {
        this.swapIndex(foundIndex, foundIndex - 1);
    }
}

LinkPoint.prototype.swapIndex = function(_index1, _index2) 
{
    var pieceOri = this.pieces[_index1];
    this.pieces[_index1] = this.pieces[_index2];
    this.pieces[_index2] = pieceOri;
}

LinkPoint.prototype.setClicMesh = function(_mesh) 
{
    this.clicMesh = _mesh;
}

LinkPoint.prototype.getClicMesh = function() 
{
    return this.clicMesh;
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
    this.piece.mesh.setPosition(this.link.position.x, 1 + 1, this.link.position.z);
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
 
    this.waitMouseUpToMoveCursorAgaing = false;
    this.initPlane();

    this.editor = null;

    this.fileName = "";
}

BluePlane.prototype.setEditor = function(_editor) 
{
    this.editor = _editor;
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
                    LinkPoint.C_DIRECTION_NOT_SET,
                    null);
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
                    LinkPoint.C_DIRECTION_NOT_SET,
                    null);
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
                    linkDirection,
                    null);
                this.linkPoints.push(item);

                if (this.initialLinkPointGround === null)
                    this.initialLinkPointGround = item;
            }
        }

    this.createCursor();
    this.createBoard();
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

BluePlane.prototype.findLinkpointFromPieceId = function(_pieceId) 
{
    var result = null;
    var element = null; 
    for (var index = 0; index < this.linkPoints.length && result === null; index++) 
    {
        element = this.linkPoints[index];

        for (var p = 0; p < element.pieces.length && result === null; p++) 
        {
            elementPiece = element.pieces[p];

            if (elementPiece._id === _pieceId)
            {
                result = element;
            }
        }           
    }

    return result;
}

BluePlane.prototype.createCursor = function() 
{
    this.cursor.piece = PieceFactory.getInstance().createPiece(PieceFactory.CURSOR);
    this.cursor.piece.setSelected(false);
    this.cursor.setLink(this.getLinkPointAtIndex(0, 0));
    
    this.addMesh(this.cursor.getMesh());
}

BluePlane.prototype.createBoard = function() 
{
    var linkPoint = null;
    var pilar = null;

    var pilarBase = new Mesh();
    pilarBase.loadMeshFromFile(Helper.resolveURLToResourceFolder("holeMark.OBJ"), null, true);
    pilarBase.updateCenter();
    pilarBase.center();
 
    var groundBase = new Mesh();
    groundBase.loadMeshFromFile(Helper.resolveURLToResourceFolder("groundMark.OBJ"), null, true);
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
                pilar.setPosition(linkPoint.position.x, linkPoint.position.y + 1, linkPoint.position.z);
                pilar.setZOrder(2);
                linkPoint.setClicMesh(pilar);
                this.addMesh(pilar);
            }
        }
    }
}

BluePlane.prototype.deleteSelectedPiece = function() 
{
    if (this.cursor === null || this.getSelectedPiece() === null)
        return;

    var piece = this.getSelectedPiece();
    var pieceUuid = piece.getMesh().getUuid();

    this.cursor.getLink().removePiece(piece.getId());
    this.reorganizePiecesYPosition(this.cursor.getLink());
    
    this.removePiece(piece.getMesh().getId());
   
    this.setPieceToSelectedAndHideOthers(null);
    //this.selectedPiece = null;
    this.editor.spaceThree.deleteMeshByUUID(pieceUuid);
}

BluePlane.prototype.getSelectedPiece = function() 
{
    return this.selectedPiece;
}

BluePlane.prototype.rotateSelectedPiece = function() 
{
    var piece = this.getSelectedPiece();

    if (piece !== null)
        piece.rotate();
}

BluePlane.prototype.moveSelectedPieceUp = function() 
{
    if (this.cursor === null || this.getSelectedPiece() === null)
        return;

    var piece = this.getSelectedPiece();

    this.cursor.getLink().movePieceUp(piece.getId());

    this.reorganizePiecesYPosition(this.cursor.getLink());
}

BluePlane.prototype.moveSelectedPieceDown = function() 
{
    if (this.cursor === null || this.getSelectedPiece() === null)
    return;

    var piece = this.getSelectedPiece();

    this.cursor.getLink().movePieceDown(piece.getId());

    this.reorganizePiecesYPosition(this.cursor.getLink());
}

BluePlane.prototype.loadBoard = function(_fileName) 
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
                thisClass.setFilename(_fileName);
            }
        }
    }

    rawFile.send(null);
}

BluePlane.prototype.loadBoardFromFile = function(_fileName) 
{
    var thisClass = this;

    var reader = new FileReader();
    reader.readAsDataURL(_fileName); 
    reader.onload = readerEvent => {
        var content = readerEvent.target.result; 

        // Remove: unnecessary  "data:application/octet-stream;base64," and "=" from final before decode.
        content = content.split(",")[1].replace( /=/g, "")
        var decodedData = window.atob(content);

        thisClass.setBoardFromData(decodedData);
        this.setFilename(_fileName.name);
    }
}

BluePlane.prototype.setBoardFromData = function(_data) 
{
    this.resetBoard();

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
                    var piece =  PieceFactory.getInstance().createPiece(pieceMatrix[row][col]);
                    this.addPieceAtLinkpoint(this.linkPoints[linkIndex], piece);
                }
                linkIndex++;
            }
        }
    }
}

BluePlane.prototype.resetBoard = function() 
{
    this.setFilename("");

    Helper.clearArray(this.getMeshCollection());

    for (var index = 0; index < this.linkPoints.length; index++) 
    {
        Helper.clearArray(this.linkPoints[index].pieces);
    }

    this.editor.spaceThree.resetScene();

    this.createCursor();
    this.createBoard();
}

BluePlane.prototype.saveBoard = function(_filename) 
{
    var bluePlaneOBJ = this.generateBoardData();
    var json = JSON.stringify(bluePlaneOBJ, null, "   ");

    Helper.download(_filename, json);
}

BluePlane.prototype.printBoard = function(_fileName) 
{
    var bluePlaneOBJ = this.generateBoardData();
    var lines = Array();
    var fileData = "";
    
    console.clear();

    //TODO: add piece quick reference.
    fileData += "Piece reference  " + "\n";
    fileData += "1- PILAR LOW     " + "\n";
    fileData += "2- RAILING       " + "\n";
    fileData += "3- SOCLE         " + "\n";
    fileData += "4- WINDOW        " + "\n";
    fileData += "5- DOOR          " + "\n";
    fileData += "6- PILAR MEDIUM  " + "\n";
    fileData += "7- PILAR TALL    " + "\n";
    fileData += "8- FLOOR         " + "\n";
    fileData += "9- CABRIADA (SHF)" + "\n";
    fileData += "0- ROOF (SHF)    " + "\n";
    fileData += "\n";

    // Process all layers
    for (var layerIndex = 0; layerIndex < bluePlaneOBJ.Layers.length; layerIndex++)
    {
        const pieceMatrix = bluePlaneOBJ.Layers[layerIndex].pieceMatrix;
        Helper.clearArray(lines);
        
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
                        token = Helper.padChar(pieceMatrix[row][col], 2, "0");
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
                        token = Helper.padChar(pieceMatrix[row][col], 2, "0");
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
        }

        var line = "";
        lines.push("Layer:" + layerIndex);
        for (var i = lines.length - 1; i >= 0; i--) 
        {
            // Avoid CHrome console merge same text lines.
            line = lines[i];
            if (i % 2 === 0)
                line += " ";

            fileData += line + "\n";
        }
        fileData += "\n\n\n";
    }
   
    Helper.download(_fileName, fileData);    
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

BluePlane.prototype.getMeshCollection = function()
{ 
    return this.meshCollection;
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
    }
}

BluePlane.prototype.createAndAddSelectedPieceToCursorPosition = function(_pieceType) 
{
    this.addPieceAtLinkpoint(this.cursor.getLink(), PieceFactory.getInstance().createPiece(_pieceType));
}

BluePlane.prototype.addPieceAtLinkpoint = function(_link, _piece) 
{
    if (this.movePieceToLinkPosition(_link, _piece) === true)
    {
        _link.pieces.push(_piece);
        this.addMesh(_piece.mesh);
        this.reorganizePiecesYPosition(_link);
    }
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
                _piece.mesh.setAngleY(Helper.graToRad(90));
            else
                _piece.mesh.setAngleY(Helper.graToRad(0));
        }

        result = true;
    }

    return result;
}

BluePlane.prototype.addMesh = function(_mesh)
{ 
    _mesh.actionAdd = true;
    this.getMeshCollection().push(_mesh);
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

BluePlane.prototype.handleInputs = function()
{
    if (this.editor.spaceThree.mouse.leftButtonDown === false && this.waitMouseUpToMoveCursorAgaing === true)
    {
        this.waitMouseUpToMoveCursorAgaing = false;
    }
}

BluePlane.prototype.implementGameLogic = function()
{
    if (this.editor.spaceThree.mouse.leftButtonDown === true)  
    {
        // Note: avoid click over piece if some joystick's button was pressed before.
        if (this.waitMouseUpToMoveCursorAgaing === false &&
            this.editor.spaceThree.getWaitMouseUp() === false)
        {
            var intersectedObjects = this.editor.spaceThree.getSelectedObjectsByMouse();
            this.moveCursorToMouseHittedAndSelectPiece(intersectedObjects);
            this.showHidePieceActionsToolbar();

            this.waitMouseUpToMoveCursorAgaing = true;
        }
    }
}

BluePlane.prototype.render = function(_editor)
{

}

BluePlane.prototype.moveCursorToMouseHittedAndSelectPiece = function(_objects) 
{
    var foundPiece = null; 

    if (_objects !== null)
    {
        foundPiece = this.getPieceHittedByMouse(_objects);

        this.moveCursorToMouseHitted(foundPiece, _objects);
   }

    // If we select the same piece then select none.
    if (foundPiece !== null && this.selectedPiece !== null && 
        foundPiece.getId() === this.selectedPiece.getId())
    {
        foundPiece = null;
    }

    this.setPieceToSelectedAndHideOthers(foundPiece);

    this.selectedPiece = foundPiece;
}

BluePlane.prototype.getPieceHittedByMouse = function(_objects) 
{
    var piece = null;

    // Compare each piece with all ThreeJs suggested objects found at mouse position.
    // NOTE: the first iterations must be over objects are ordered by distante, 
    // this ensure that the object that is near to the camera will be searched in the board.
    for (var i2 = 0; i2 < _objects.length && piece === null; i2++)
    {
        // Iterate over all linkpoint arrays.
        for (var index = 0; index < this.linkPoints.length && piece === null; index++) 
        {
            element = this.linkPoints[index];

            // Iterate over each piece in linkpoint element.
            for (var p = 0; p < element.pieces.length && piece === null; p++) 
            {
                elementPiece = element.pieces[p];

                if (elementPiece.getMesh().getUuid() === _objects[i2].object.uuid)
                {
                    piece = elementPiece;
                }    
            }           
        }
    }    

    return piece;
}

// NOTE: if piece is null then the opacity of all pieces will be 1.
BluePlane.prototype.setPieceToSelectedAndHideOthers = function(_piece) 
{
    var selectedPiece= null;
    var element = null; 
    for (var index = 0; index < this.linkPoints.length && selectedPiece === null; index++) 
    {
        element = this.linkPoints[index];

        for (var p = 0; p < element.pieces.length && selectedPiece === null; p++) 
        {
            elementPiece = element.pieces[p];

            if (_piece === null)
            {
                elementPiece.setSelected(false);
                elementPiece.setBackgroundMode(false);
            }
            else
            {
                if (elementPiece.getId() !== _piece.getId())
                {
                    elementPiece.setSelected(false);
                    elementPiece.setBackgroundMode(true);
                }
                else
                {
                    elementPiece.setSelected(true);
                    elementPiece.setBackgroundMode(false);
                }
            }
        }           
    }
}

BluePlane.prototype.moveCursorToMouseHitted = function(_piece, _objects) 
{   
    var linkPointFromPiece = null; 

    if (_piece !== null)
    {
        linkPointFromPiece = this.findLinkpointFromPieceId(_piece.getId());
    }
    else
    {
        linkPointFromPiece = this.getLinkPointFromIntersectedObjects(_objects);
    }

    // Finally move cursor to the found linkpoint.
    if (linkPointFromPiece !== null)
    {
        this.cursor.setLink(linkPointFromPiece);
        this.cursor.getMesh().actionUpdate = true;
        
        this.editor.setVisibilityPieceToolbar(true);
    }
    else
    {
        this.editor.setVisibilityPieceToolbar(false);
    }
}

BluePlane.prototype.getLinkPointFromIntersectedObjects = function(_objects) 
{
    var linkPointSelected = null;

    // If no selectedPiece found, maybe it is one of the meshes used as
    // hole in the base of the linkpoint. So, compare it with 
    // ThreeJs suggested meshes and get his parent linkpoint.

    // NOTE: the first iterations must be over objects are ordered by distante, 
    // this ensure that the object that is near to the camera will be searched in the board.
    for (var i2 = 0; i2 < _objects.length && linkPointSelected === null; i2++)
    {
        for (var index = 0; index < this.linkPoints.length && linkPointSelected === null; index++) 
        {
            linkPointMesh = this.linkPoints[index].getClicMesh();

            if (linkPointMesh !== null && linkPointMesh.getUuid() === _objects[i2].object.uuid)
            {
                linkPointSelected = this.linkPoints[index];
            }    
        }
    }
    return linkPointSelected;
}

BluePlane.prototype.showHidePieceActionsToolbar = function() 
{
    this.editor.setVisibilityPieceActionsToolbar(this.getSelectedPiece() !== null);
}

BluePlane.prototype.setFilename = function(_fileName) 
{
    var splitName = _fileName.split(".")[0];
    var splitSlash = splitName.split("/");

    this.fileName = splitSlash[splitSlash.length - 1];
    this.editor.updateFileNameInfo(this.fileName);
}

BluePlane.prototype.getFilename = function(_fileName) 
{
    return this.fileName;
}
 
// --------------------------------------------------------------- 
// CLASS: spaceThree.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Adapter to use Trhee.js instead my own 3D engine, 
// their kung fuu is better. 
//
SpaceThree.self = null;
SpaceThree.MAX_AZIMUTH_ANGLE = 85;
SpaceThree.MIN_AZIMUTH_ANGLE = 20;
SpaceThree.MAX_ZOOM = 800;
SpaceThree.MIN_ZOOM = 30;

function SpaceThree() 
{
    SpaceThree.self = this;

    // Scene
    this.sceneT = new THREE.Scene();
    this.sceneT.castShadow = true;    

    // CameRA
    this.cameraT = new THREE.PerspectiveCamera( 40, window.innerWidth/window.innerHeight, 0.1, 10000 );
    this.cameraT.lookAt( 0, 0, 0 );
    this.inclinationCameraAngle = 45;
    this.azimuthCameraAngle = 45;
    this.cameraRadious = 400;

    // Renderer
    this.rendererT = new THREE.WebGLRenderer( { antialias: true } );
    this.rendererT.setSize(window.innerWidth, window.innerHeight);
    this.rendererT.setPixelRatio( window.devicePixelRatio );
    this.rendererT.outputEncoding = THREE.sRGBEncoding;
    this.rendererT.shadowMap.enabled = true;

    // Used in selection by mouse
    this.raycasterT = new THREE.Raycaster();
    this.mouse = {x:0, y:0, leftButtonDown: false, middleButtonDown: false, rightButtonDown: false, mouseT:  new THREE.Vector3()};

    // Ligths
    this.lightAmbientT = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.sceneT.add( this.lightAmbientT );

    this.mygroup = new THREE.Group();
    this.editor = null;
    this.selectedObjects = null;

    // Events
    this.onCameraChangeHandler = null;

    this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
    this.moveVector = new THREE.Vector3( 0, 0, 0 );
    this.rotationVector = new THREE.Vector3( 0, 0, 0 );
    this.lastPosition = new THREE.Vector3();
    this.movementSpeed = 5.0;
    this.rollSpeed = 0.05;
    this.tmpQuaternion = new THREE.Quaternion();
    this.waitMouseUp = false;

    this.lastQuaternion = new THREE.Quaternion();
    this.lastPosition = new THREE.Vector3();
    this.lastRotation = new THREE.Vector3();
}

// SETUP AND ESCENE
SpaceThree.prototype.appendToDocumentBody = function() 
{
    document.body.appendChild( this.rendererT.domElement );

    this.addGrid();
    this.addSkyDome();
    this.addResizeEvent();
    this.addMouseEvents();

    this.addFlyingControlEvents();
}

SpaceThree.prototype.addGrid = function() 
{
    var planeSize = 2000;
    var loader = new THREE.TextureLoader();
    var texture = null;

    // Texture
    var loader = new THREE.TextureLoader();
    texture = loader.load("obj/paper.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set(20, 20);

    var planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    //var planeMat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, opacity: 0.9, transparent: true});
    //var planeMat = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

    var planeMat  = new THREE.MeshPhongMaterial({             
        color: 0Xf57e42, 
        //transparent: true,
        //opacity: _mesh.alpha
        side: THREE.DoubleSide,
        shininess  :  20,
        bumpMap    :  texture,
        map        :  texture,
        bumpScale  :  0.45,
    });

    var planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.receiveShadow = true;
    planeMesh.rotation.x = Math.PI/2;
    planeMesh.position.y = -0.1;
    this.sceneT.add(planeMesh);
}

SpaceThree.prototype.addSkyDome = function() 
{
    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
        topColor: { value: new THREE.Color( 0x0077ff ) },
        bottomColor: { value: new THREE.Color( 0xffffff ) },
        offset: { value: 400 },
        exponent: { value: 0.6 }
    };

    var skyGeo = new THREE.SphereBufferGeometry( 4000, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    this.sceneT.add( sky );
}

SpaceThree.prototype.addResizeEvent = function()
{
    // Resize event
    window.addEventListener( 'resize', function () 
    {
        SpaceThree.self.cameraT.aspect = window.innerWidth / window.innerHeight;
        SpaceThree.self.cameraT.updateProjectionMatrix();
        SpaceThree.self.rendererT.setSize(window.innerWidth, window.innerHeight);
    }, false );
}

// MOUSE
SpaceThree.prototype.addMouseEvents = function()
{
    this.rendererT.domElement.addEventListener( 'touchstart', onTouchStart, false );
    function onTouchStart( event ) 
    {
        onTouchMove(event);
        SpaceThree.self.mouse.leftButtonDown = true;
       
        // Force calculation here because to use this data in BluePlane class,
        // touchStart is different to mouseDown, it fires first.
        SpaceThree.self.selectedObjects = SpaceThree.self.calculateSelectedObjectsByMouse();
        
        event.preventDefault();
        event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'touchend', onTouchEnd, false );
    function onTouchEnd( event ) 
    {
        SpaceThree.self.mouse.leftButtonDown = false;
        
        event.preventDefault();
        event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'touchmove', onTouchMove, false );
    function onTouchMove( event ) 
    {
        if (typeof event.targetTouches[0] !== 'undefined')
        {
            SpaceThree.self.mouse.x = event.targetTouches[0].clientX;
            SpaceThree.self.mouse.y = event.targetTouches[0].clientY;
    
            SpaceThree.self.mouse.mouseT.x = (event.targetTouches[0].clientX / window.innerWidth ) * 2 - 1;
            SpaceThree.self.mouse.mouseT.y = -(event.targetTouches[0].clientY / window.innerHeight ) * 2 + 1;
        }
    }

    this.rendererT.domElement.addEventListener( 'mousedown', onMouseDown, false );
    function onMouseDown( event ) 
    {
        if (event.button === 0)
            SpaceThree.self.mouse.leftButtonDown = true;
        if (event.button === 1)
            SpaceThree.self.mouse.middleButtonDown = true;
        if (event.button === 2)
            SpaceThree.self.mouse.rightButtonDown = true;

        event.preventDefault();
		event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'mouseup', onMouseUp, false );
    function onMouseUp( event ) 
    {
        if (event.button === 0)
            SpaceThree.self.mouse.leftButtonDown = false;
        if (event.button === 1)
            SpaceThree.self.mouse.middleButtonDown = false;
        if (event.button === 2)
            SpaceThree.self.mouse.rightButtonDown = false;

        event.preventDefault();
        event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'mousemove', onMouseMove, false );
    function onMouseMove( event ) 
    {
        SpaceThree.self.mouse.x = event.clientX;
        SpaceThree.self.mouse.y = event.clientY;

        SpaceThree.self.mouse.mouseT.x = (event.clientX / window.innerWidth ) * 2 - 1;
        SpaceThree.self.mouse.mouseT.y = -(event.clientY / window.innerHeight ) * 2 + 1;
    }
}

SpaceThree.prototype.addFlyingControlEvents = function()
{
    window.addEventListener( 'keydown', this.keyDown, false );
    window.addEventListener( 'keyup', this.keyUp, false );
}

SpaceThree.prototype.keyUp  = function ( event ) {

    switch ( event.keyCode ) {
        case 87: /*W*/ SpaceThree.self.moveState.up = 0; break;
        case 83: /*S*/ SpaceThree.self.moveState.down = 0; break;

        case 65: /*A*/ SpaceThree.self.moveState.yawLeft = 0; break;
        case 68: /*D*/ SpaceThree.self.moveState.yawRight = 0; break;

        case 38: /*up*/ SpaceThree.self.moveState.forward = 0; break;
        case 40: /*down*/ SpaceThree.self.moveState.back = 0; break;
    }

    SpaceThree.self.updateMovementVector();
    SpaceThree.self.updateRotationVector();
};

SpaceThree.prototype.keyDown = function ( event ) {

    switch ( event.keyCode ) {
        case 87: /*W*/ SpaceThree.self.moveState.up = 1; break;
        case 83: /*S*/ SpaceThree.self.moveState.down = 1; break;

        case 65: /*A*/ SpaceThree.self.moveState.yawLeft = 1; break;
        case 68: /*D*/ SpaceThree.self.moveState.yawRight = 1; break;

        case 38: /*up*/ SpaceThree.self.moveState.forward = 1; break;
        case 40: /*down*/ SpaceThree.self.moveState.back = 1; break;
    }

    SpaceThree.self.updateMovementVector();
    SpaceThree.self.updateRotationVector();
};

SpaceThree.prototype.updateMovementVector = function () 
{
    this.moveVector.x = ( - this.moveState.left + this.moveState.right );
    this.moveVector.y = ( - this.moveState.down + this.moveState.up );
    this.moveVector.z = ( - this.moveState.forward + this.moveState.back );
};

SpaceThree.prototype.updateRotationVector = function () 
{
    this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.y = ( - this.moveState.yawRight + this.moveState.yawLeft );
    this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

};

// LIFE CYCLE
SpaceThree.prototype.handleInputs = function()
{
    if (this.editor.flyingMode === true)
        this.checkMouseDownFlyingControls();
}

SpaceThree.prototype.checkMouseDownFlyingControls = function()
{
    if (this.editor.spaceThree.mouse.leftButtonDown === true)  
    {
        var btnCross = document.getElementById("btnCross");
        var btnUpDown = document.getElementById("btnUpDown");

        var cx = 0;
        var cy = 0;
        // NOTE: only when btnCross is enebled the width is scaled.
        // It will be better create a class and do it better.
        var radious = btnCross.width / 3;

        // Test up movement
        cx = (btnCross.width / 2) + btnCross.offsetLeft;
        cy = (btnCross.height / 3) * 0.5 + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.up = 1;
        }

        // Test down movement
        cx = (btnCross.width / 2) + btnCross.offsetLeft;
        cy = (btnCross.height / 3) * 2.5 + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.down = 1;
        }

        // Test left movement
        cx = (btnCross.width / 3) * 0.5 + btnCross.offsetLeft;
        cy = (btnCross.height / 2) + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.yawLeft = 1;
        }

        // Test right movement
        cx = (btnCross.width / 3) * 2.5 + btnCross.offsetLeft;
        cy = (btnCross.height / 2) + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.yawRight = 1;
        }

        // Test forward movement
        cx = (btnUpDown.width / 2) + btnUpDown.offsetLeft;
        cy = (btnUpDown.height / 3) * 0.5 + btnUpDown.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.forward = 1;
        }

        // Test back movement
        cx = (btnUpDown.width / 2) + btnUpDown.offsetLeft;
        cy = (btnUpDown.height / 3) * 2.5 + btnUpDown.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.back = 1;
        }

        /*var btnPointer = document.getElementById("btnPointer");
        btnPointer.style.left = cx + "px";
        btnPointer.style.top = cy + "px";
        */

        var someMovementPending = (SpaceThree.self.moveState.up +
            SpaceThree.self.moveState.down + 
            SpaceThree.self.moveState.yawLeft +
            SpaceThree.self.moveState.yawRight +
            SpaceThree.self.moveState.forward + 
            SpaceThree.self.moveState.back) > 0;

        if (someMovementPending === true)
        {
            this.updateMovementVector();
            this.updateRotationVector();
           
            this.waitMouseUp = true;
            this.cleanJoystickFlags();
        }
    }
    else
    {
        if (this.waitMouseUp === true)
        {
            this.waitMouseUp = false;
            this.cleanJoystickFlags();

            this.updateMovementVector();
            this.updateRotationVector();
        }
    }
}

SpaceThree.prototype.cleanJoystickFlags = function()
{ 
    SpaceThree.self.moveState.up = 0; 
    SpaceThree.self.moveState.down = 0;

    SpaceThree.self.moveState.yawLeft = 0;
    SpaceThree.self.moveState.yawRight = 0;

    SpaceThree.self.moveState.forward = 0; 
    SpaceThree.self.moveState.back = 0;
}

SpaceThree.prototype.getWaitMouseUp = function()
{ 
    return this.waitMouseUp;
}

SpaceThree.prototype.implementGameLogic = function()
{ 
    var _meshCollection = this.editor.bluePlane.getMeshCollection();
    
    this.selectedObjects = this.calculateSelectedObjectsByMouse();

    this.updateThreeJSMeshes(_meshCollection);

    this.updateCametaWithFlyingValues();
}

SpaceThree.prototype.updateCametaWithFlyingValues = function()
{
    this.applyCameraTransformations(this.movementSpeed, this.rollSpeed);

    // If camera is outside limits, the wollback transformations.
    if (Helper.distance3D(this.cameraT.position.x, this.cameraT.position.y, this.cameraT.position.z, 0, 0, 0) > SpaceThree.MAX_ZOOM ||
        this.cameraT.position.y < 5)
    {
        this.applyCameraTransformations(this.movementSpeed * -1, this.rollSpeed * -1);
    }
}

SpaceThree.prototype.applyCameraTransformations = function(_moveMult, _rotMult)
{ 
    this.cameraT.translateX( this.moveVector.x * _moveMult );
    this.cameraT.translateY( this.moveVector.y * _moveMult );
    this.cameraT.translateZ( this.moveVector.z * _moveMult );

    this.tmpQuaternion.set( this.rotationVector.x * _rotMult, this.rotationVector.y * _rotMult, this.rotationVector.z * _rotMult, 1 ).normalize();
    this.cameraT.quaternion.multiply( this.tmpQuaternion );
}

SpaceThree.prototype.render = function()
{ 
    this.rendererT.render( this.sceneT, this.cameraT );
}

// BUSINESS LOGIC
SpaceThree.prototype.resetScene = function()
{
    if (typeof this.sceneT.getObjectById(this.mygroup.id) !== 'undefined')
    {
        Helper.clearArray(this.mygroup.children);
        this.sceneT.remove(this.mygroup); 
    }
        
    this.sceneT.add( this.mygroup );
}

SpaceThree.prototype.calculateSelectedObjectsByMouse = function()
{
    // update the picking ray with the camera and mouse position
    this.raycasterT.setFromCamera( this.mouse.mouseT, this.cameraT );
    
    // calculate objects intersecting the picking ray
    var intersects = this.raycasterT.intersectObjects( this.mygroup.children );

    return intersects;
}

SpaceThree.prototype.getSelectedObjectsByMouse = function()
{
    return this.selectedObjects;
}

// OPERATIONS OVER MESH COLLECTION
SpaceThree.prototype.addMeshToScene = function(_mesh)
{
    this.mygroup.add(_mesh);
}

SpaceThree.prototype.updateThreeJSMeshes = function(_meshCollection)
{ 
    var meshT = null; 

    for (var i = 0; i < _meshCollection.length; i++) 
    {
        if (_meshCollection[i].actionAdd === true)
        {
            this.addMeshToScene(this.createRenderData(_meshCollection[i]));
            _meshCollection[i].actionAdd = false;
        }

        meshT = this.findMeshTByUUID(_meshCollection[i].getUuid());
        if (meshT !== null)
        {
            if (_meshCollection[i].actionUpdate === true)
            {
                this.updateMeshTFromMesh(_meshCollection[i], meshT);

                _meshCollection[i].actionUpdate = false;
            }

            if (_meshCollection[i]._id > 1)
            {
                if (_meshCollection[i].actionBackgroundModeFlagChange === true)
                {
                    if ( _meshCollection[i].getBackgroundMode() === true)
                        meshT.material.opacity = _meshCollection[i].getAlpha() * 0.2;
                    else
                        meshT.material.opacity = _meshCollection[i].getAlpha();

                    _meshCollection[i].actionBackgroundModeFlagChange = false;
                }

                if (_meshCollection[i].actionSelectedFlagChange === true)
                {
                    if ( _meshCollection[i].getSelected() === true)
                    {
                        meshT.material.color.r = 1;
                        meshT.material.color.g = 1;
                        meshT.material.color.b = 1;
                    }
                    else
                    {
                        meshT.material.color.r = _meshCollection[i].meshColor.r / 255;
                        meshT.material.color.g = _meshCollection[i].meshColor.g / 255;
                        meshT.material.color.b = _meshCollection[i].meshColor.b / 255;
                    }

                    _meshCollection[i].actionSelectedFlagChange = false;
                }
            }
        }
    }
}

SpaceThree.prototype.updateMeshTFromMesh = function(_mesh, _meshT)
{
    _meshT.position.set(_mesh.getPosition().x, _mesh.getPosition().y, _mesh.getPosition().z * -1);

    _meshT.rotation.set(_mesh.getRotation().x, _mesh.getRotation().y, _mesh.getRotation().z, "XYZ" );

    _meshT.scale.set(_mesh.getScale().x, _mesh.getScale().y, _mesh.getScale().z); 
}

SpaceThree.prototype.findMeshTByUUID = function(_uuid)
{
    var meshTItem = null;
    for (var i = 0; i < this.mygroup.children.length; i++) 
    {
        if (_uuid === this.mygroup.children[i].uuid)
        {
            meshTItem = this.mygroup.children[i];
            break;
        }    
    }	

    return meshTItem;
}

SpaceThree.prototype.deleteMeshByUUID = function(_uuid)
{
    var meshTItem = null;
    for (var i = 0; i < this.mygroup.children.length; i++) 
    {
        if (_uuid === this.mygroup.children[i].uuid)
        {
            meshTItem = this.mygroup.children[i];

            meshTItem.geometry.dispose();
            meshTItem.material.dispose();

            this.mygroup.children.splice(i, 1);
            break;
        }    
    }
}

SpaceThree.prototype.createRenderData = function(_mesh)
{ 
    _mesh.actionAdd = false;
    _mesh.actionUpdate = false;
    _mesh.actionAlphaChange = false;

    // MATERIAL
    var shColor = Helper.st_rgbaToColor( _mesh.meshColor.r, _mesh.meshColor.g,  _mesh.meshColor.b);

    var mycube_material = null;

    var shColor = Helper.st_rgbaToColor( _mesh.meshColor.r, _mesh.meshColor.g,  _mesh.meshColor.b);
    mycube_material = new THREE.MeshPhongMaterial( { color: shColor, transparent: true, opacity: _mesh.alpha} );

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
    mycube_mesh.castShadow = true;
    //mycube_mesh.receiveShadow = true;

    // TRANSFORMATIONS
    this.updateMeshTFromMesh(_mesh, mycube_mesh);
    
    _mesh.setUuid(mycube_mesh.uuid);

    return mycube_mesh;
}

// DEPENDENCIES
SpaceThree.prototype.setEditor = function(_editor) 
{
    this.editor = _editor;
}

// LIGHTS
SpaceThree.prototype.addPointLight = function(_color, _intensity, _x, _y, _z, _distance, _castShadow) 
{
    var light = new THREE.PointLight(_color, _intensity);
    light.position.set(_x, _y, _x);
    light.distance = _distance;
    light.castShadow = _castShadow;
    this.sceneT.add(light);
}

// CAMERA
SpaceThree.prototype.rotateCameraPercent = function(_value) 
{
    this.inclinationCameraAngle = Math.floor(_value / 100 * 360);
    this.updateCameraPosition();
}

SpaceThree.prototype.rotateCameraPercentAzimuthAngle = function(_value) 
{
    var range = SpaceThree.MAX_AZIMUTH_ANGLE - SpaceThree.MIN_AZIMUTH_ANGLE;
    this.azimuthCameraAngle = Math.floor((100 - _value) / 100 * range) + SpaceThree.MIN_AZIMUTH_ANGLE;
    this.updateCameraPosition();
}

SpaceThree.prototype.rotateCamera = function(_angle) 
{
    this.inclinationCameraAngle = ((this.inclinationCameraAngle + _angle) % 360);
    this.updateCameraPosition();
}

SpaceThree.prototype.zoomCamera = function(_delta) 
{
    var newValue = this.cameraRadious + _delta;
    this.validateAndSetZoom(newValue);
}

SpaceThree.prototype.zoomCameraPercent = function(_value) 
{
    var range = SpaceThree.MAX_ZOOM - SpaceThree.MIN_ZOOM;
    var newValue =  Math.floor((100 - _value) / 100 * range) + SpaceThree.MIN_ZOOM;
    this.validateAndSetZoom(newValue);
}

SpaceThree.prototype.validateAndSetZoom = function(_value) 
{
    if (_value >= SpaceThree.MIN_ZOOM && _value <= SpaceThree.MAX_ZOOM)
    {
        this.cameraRadious = _value;
        this.updateCameraPosition();
    }
}

SpaceThree.prototype.updateCameraPosition = function() 
{
    var x = this.cameraRadious * Math.sin(Helper.graToRad(this.azimuthCameraAngle)) *  Math.cos(Helper.graToRad(this.inclinationCameraAngle));
    var y = this.cameraRadious * Math.cos(Helper.graToRad(this.azimuthCameraAngle));
    var z = this.cameraRadious * Math.sin(Helper.graToRad(this.azimuthCameraAngle)) *  Math.sin(Helper.graToRad(this.inclinationCameraAngle));

    this.setCamera(x, y, z);

    if (this.onCameraChangeHandler !== null)
        this.onCameraChangeHandler(this.inclinationCameraAngle, this.azimuthCameraAngle, this.cameraRadious);
}

SpaceThree.prototype.getCamera = function() 
{
    return this.cameraT;
}

SpaceThree.prototype.setCamera = function(_x, _y, _z) 
{
    this.cameraT.position.x = _x;
    this.cameraT.position.y = _y;
    this.cameraT.position.z = _z;
    this.cameraT.lookAt( 0, 0, 0 );
    this.cameraT.updateProjectionMatrix();
}

SpaceThree.prototype.onCameraChange = function(_callback)
{
    this.onCameraChangeHandler = _callback;
}

SpaceThree.prototype.startFlyingControl = function()
{
    if (this.lastRotation.x === 0 && this.lastRotation.y === 0 && this.lastRotation.z === 0)
    {
        this.cameraT.position.y = 10;
        this.cameraT.lookAt(  0,  this.cameraT.position.y,  0);
    }
    else
    {
        this.cameraT.position.x = this.lastPosition.x;
        this.cameraT.position.y = this.lastPosition.y;
        this.cameraT.position.z = this.lastPosition.z;

        this.cameraT.rotation.x = this.lastRotation.x;
        this.cameraT.rotation.y = this.lastRotation.y;
        this.cameraT.rotation.z = this.lastRotation.z;
    }
    
    this.cameraT.updateProjectionMatrix();
}

SpaceThree.prototype.cancelFlyingControl = function()
{
    //this.lastQuaternion.copy( this.cameraT.quaternion );
    this.lastPosition.copy( this.cameraT.position );
    this.lastRotation.copy( this.cameraT.rotation );

    this.updateCameraPosition();
} 
// --------------------------------------------------------------- 
// CLASS: app.js 
// --------------------------------------------------------------- 
// --------------------------------------------------------------------
// Entry point to the aplication, main loop, inputs controlle, core
//

var C_VERSION_TITLE = "Little constructor ThreeJS v3.1.2";
var gEngine = null; 
var C_SERVER_IP = "localhost:8080";

function load() 
{
    console.log(C_VERSION_TITLE);
    document.title = C_VERSION_TITLE;

    onUserCreate();

    setInterval('onUserUpdate()', 1000 / 25);
}

// --------------------------------------------------------------------
// App data
//
var spaceThree = new SpaceThree();
var bluePlane = new BluePlane();
var flyingMode = false;

var leftToolbarElements = [
    "btnRotate", 
    "btnZoomIn", 
    "btnZoomOut",
    "btnFlying",
    "btnCancelFlying"];

var pieceToolbarElements = [
    "btnPILAR_SMALL", 
    "btnRAILING", 
    "btnSOCLE", 
    "btnWINDOW", 
    "btnDOOR", 
    "btnPILAR_MEDIUM", 
    "btnPILAR_TALL", 
    "btnFLOOR",
    "btnCABRIADA", 
    "btnROOF"];

var pieceActionsToolbarElements = [
    "btnPieceMoveUp",
    "btnPieceMoveDown",
    "btnPieceRotate",
    "btnPieceDelete"];

function onUserCreate() 
{
    console.log("User create");

    // Space preview, ThreeJs renderer.
    spaceThree.setEditor(this);
    spaceThree.appendToDocumentBody();
    spaceThree.addPointLight(0xFFFFFF, 1, -100, 100, 0, 300, true);
    spaceThree.resetScene();
    spaceThree.onCameraChange(updateCameraControls);
    spaceThree.rotateCamera(90);

    // Object manager
    bluePlane.setEditor(this);

    // UI control events
    setVisibilityPieceActionsToolbar(false);

    addEventsToMenu();
    addEventsToLeftToolbar();
    addEventsToPiecesToolbar();
    addEventsToPieceActionsToolbar();

    showControlsOnFlying();
}

function onUserUpdate() 
{
    // Inputs
    bluePlane.handleInputs();
    spaceThree.handleInputs(this);

    // Implement game logic
    bluePlane.implementGameLogic();
    spaceThree.implementGameLogic(this);

    // Render
    bluePlane.render();
    spaceThree.render(this);
}

// EVENTS
// FILE MENU EVENTS
function addEventsToMenu()
{
    document.getElementById("btnCross").disabled = true; 
    document.getElementById("btnUpDown").disabled = true; 

    addEventToFileSection();
    addEventToExampleSection();
    addEventToAboutSection();
}

function addEventToFileSection()
{
    document.getElementById('idLoad').addEventListener("click", function() 
    {
        document.getElementById('file-load').click();
    });
   
    document.getElementById('file-load').addEventListener("change", function(e) 
    {
        var file = e.target.files[0]; 
        bluePlane.loadBoardFromFile(file);
    });

    document.getElementById('idSave').addEventListener("click", function() 
    {
        bluePlane.saveBoard(bluePlane.getFilename() + ".bpl"); 
    });

    addSaveAsEvents();

    document.getElementById('idPrint').addEventListener("click", function() 
    {
        bluePlane.printBoard(bluePlane.getFilename() + ".ppl"); 
    });

    addPrintAsEvents();

    document.getElementById('idClearBoard').addEventListener("click", function() 
    {
        bluePlane.resetBoard();
    });
}

function addSaveAsEvents()
{
    var modal = document.getElementById("idSaveAsModal");

    document.getElementById("idOpenSaveAs").onclick = function() 
    {   
        modal.style.display = "block";
        document.getElementById('file-save-as').value = bluePlane.getFilename();
    }

    document.getElementById("idSaveAsOk").onclick = function() 
    {
        modal.style.display = "none";
        var saveAsFilename = document.getElementById('file-save-as').value;

        bluePlane.saveBoard(saveAsFilename + ".bpl"); 
    }

    document.getElementById("idSaveAsCancel").onclick = function() {modal.style.display = "none";}
}

function addPrintAsEvents()
{
    var modal = document.getElementById("idPrintAsModal");

    document.getElementById("idOpenPrintAs").onclick = function() 
    {   
        modal.style.display = "block";
        document.getElementById('file-print-as').value = bluePlane.getFilename();
    }

    document.getElementById("idPrintAsOk").onclick = function() 
    {
        modal.style.display = "none";
        var saveAsFilename = document.getElementById('file-print-as').value;

        bluePlane.saveBoard(saveAsFilename + ".ppl"); 
    }

    document.getElementById("idPrintAsCancel").onclick = function() {modal.style.display = "none";}
}

// EXAMPLE MENU EVENTS
function addEventToExampleSection()
{
    document.getElementById('idExampleLittleHouse').addEventListener("click", function() 
    {
        bluePlane.loadBoard('obj/house.bpl');
    });
}

// ABOUT MENU EVENTS
function addEventToAboutSection()
{
    addEventsToAboutOption();
    addEventsToSourceCodeOption();
}

function addEventsToAboutOption()
{
    var modal = document.getElementById("idAboutModal");

    var btn = document.getElementById("idOpenAbout");
    var span = document.getElementById("idCloseAbout");

    btn.onclick = function() {modal.style.display = "block";}
    span.onclick = function() {modal.style.display = "none";}
}

function addEventsToSourceCodeOption()
{
    var btn = document.getElementById("idSourceCode");
    btn.onclick = function() {window.open("https://github.com/mfontanadev/appLittleConstructor/tree/ThreeJSEx")};
}

// LEFT TOOLBAR EVENTS
function addEventsToLeftToolbar()
{
    leftToolbarElements.forEach(element => 
    {
        document.getElementById(element).addEventListener("click", function(event) {onClicButtonLeftToolbar(event, element);});
    });

    addEventsToZoom();

    addEventsToRotation();
}

function onClicButtonLeftToolbar(event, id) 
{
    switch ( id ) 
    {
        case 'btnRotate': 
            this.rotateCameraFixed(90); 
            break;
        case 'btnZoomIn': 
            this.zoomCamera(-50); 
            break;
        case 'btnZoomOut':
            this.zoomCamera(50); 
            break;
        case 'btnFlying': 
            flyingMode = true;
            this.hideControlsOnFlying();
            this.spaceThree.startFlyingControl();  
            break;
        case 'btnCancelFlying':
            flyingMode = false;
            this.showControlsOnFlying();
            this.spaceThree.cancelFlyingControl();  
            break;
    }
}

function addEventsToZoom()
{
    document.getElementById("idSliderZoom").addEventListener("input", function() {zoomCameraSliderV(this.value)});
    document.getElementById("idSliderZoom").addEventListener("change", function() {zoomCameraSliderV(this.value)});
}

function zoomCamera(_zoomDelta)
{
    spaceThree.zoomCamera(_zoomDelta);
}

function zoomCameraSliderV(_value)
{
    spaceThree.zoomCameraPercent(_value);
}

function addEventsToRotation()
{
    document.getElementById("idSliderH").addEventListener("input", function() {rotateCameraSliderH(this.value)});
    document.getElementById("idSliderH").addEventListener("change", function() {rotateCameraSliderH(this.value)});

    document.getElementById("idSliderV").addEventListener("input", function() {rotateCameraSliderV(this.value)});
    document.getElementById("idSliderV").addEventListener("change", function() {rotateCameraSliderV(this.value)});
}

function rotateCameraSliderH(_value)
{
    spaceThree.rotateCameraPercent(_value);
}

function rotateCameraFixed(_angle)
{
    spaceThree.rotateCamera(_angle);
}

function rotateCameraSliderV(_value)
{
    spaceThree.rotateCameraPercentAzimuthAngle(_value);
} 

// PIECE TOOLBAR EVENTS
function addEventsToPiecesToolbar()
{
    pieceToolbarElements.forEach(element => 
    {
        document.getElementById(element).addEventListener("click", function(event) {onClicButtonPiecesToolbar(event, element);});
    });
}

function onClicButtonPiecesToolbar(event, id)
{
    switch ( id ) 
    {
        case 'btnPILAR_SMALL': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.PILAR_SMALL);
            break;
        case 'btnRAILING': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.RAILING);
            break;
        case 'btnSOCLE': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.SOCLE);
            break;
        case 'btnWINDOW': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.WINDOW);
            break;
        case 'btnDOOR': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.DOOR);
            break;
        case 'btnPILAR_MEDIUM': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.PILAR_MEDIUM);
            break;
        case 'btnPILAR_TALL': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.PILAR_TALL);
            break;
        case 'btnFLOOR': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.FLOOR);
            break;
        case 'btnCABRIADA': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.CABRIADA);
            break;
        case 'btnROOF': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.ROOF);
            break;
    }
}

function addEventsToPieceActionsToolbar()
{
    pieceActionsToolbarElements.forEach(element => 
    {
        document.getElementById(element).addEventListener("click", function(event) {onClicButtonPieceActionsToolbar(event, element);});
    });
}

function onClicButtonPieceActionsToolbar(event, id) 
{
    switch ( id ) 
    {
        case 'btnPieceMoveUp': 
            bluePlane.moveSelectedPieceUp(); 
        break;
    
        case 'btnPieceMoveDown': 
            bluePlane.moveSelectedPieceDown(); 
        break;
        
        case 'btnPieceRotate': 
            bluePlane.rotateSelectedPiece(); 
        break;
        
        case 'btnPieceDelete': 
            bluePlane.deleteSelectedPiece(); 
        break;
    }
}

// UI BINDINGS
function setVisibilityPieceActionsToolbar(_visible) 
{
    var panel = document.getElementById("pieceActionsToolbar");

    if (_visible === true)
    {
        panel.style.display = "block";
    }
    else
    {
        panel.style.display = "none";
    }
}

function setVisibilityPieceToolbar(_visible) 
{
    var panel = document.getElementById("pieceToolbar");

    if (_visible === true)
    {
        panel.style.display = "block";
    }
    else
    {
        panel.style.display = "none";
    }
}

function updateFileNameInfo(_fileName)
{
    document.getElementById("info").innerHTML = _fileName + ".bpl";
}

function updateCameraControls(_inclinationCameraAngle, _azimuthCameraAngle, _zoomCamera)
{
    var percentValue = 0;
    
    percentValue = (_inclinationCameraAngle / 360) * 100;
    document.getElementById("idSliderH").value = percentValue;

    var rangeRot = SpaceThree.MAX_AZIMUTH_ANGLE - SpaceThree.MIN_AZIMUTH_ANGLE;
    percentValue = 100 - ((_azimuthCameraAngle - SpaceThree.MIN_AZIMUTH_ANGLE) / rangeRot) * 100;
    document.getElementById("idSliderV").value = percentValue;

    var rangeZoom = SpaceThree.MAX_ZOOM - SpaceThree.MIN_ZOOM;
    var percentValue = 100 - ((_zoomCamera - SpaceThree.MIN_ZOOM) / rangeZoom) * 100;
    document.getElementById("idSliderZoom").value = percentValue;
}

function hideControlsOnFlying()
{
    document.getElementById("btnFlyingPanel").style.display = "none";
    document.getElementById("btnCancelFlyingPanel").style.display = "block";

    this.setVisibilityPieceToolbar(false);
    this.setVisibilityPieceActionsToolbar(false);

    document.getElementById("btnZoomInPanel").style.display = "none";
    document.getElementById("sliderContainerZoomV").style.display = "none";
    document.getElementById("btnZoomOutPanel").style.display = "none";

    document.getElementById("btnRotatePanel").style.display = "none";
    document.getElementById("sliderContainerRotateH").style.display = "none";
    document.getElementById("sliderContainerRotateV").style.display = "none";

    document.getElementById("btnCross").style.display = "block";
    document.getElementById("btnUpDown").style.display = "block";
}

function showControlsOnFlying()
{
    document.getElementById("btnFlyingPanel").style.display = "block";
    document.getElementById("btnCancelFlyingPanel").style.display = "none";

    this.setVisibilityPieceToolbar(true);
    this.bluePlane.showHidePieceActionsToolbar();

    document.getElementById("btnZoomInPanel").style.display = "block";
    document.getElementById("sliderContainerZoomV").style.display = "block";
    document.getElementById("btnZoomOutPanel").style.display = "block";

    document.getElementById("btnRotatePanel").style.display = "block";
    document.getElementById("sliderContainerRotateH").style.display = "block";
    document.getElementById("sliderContainerRotateV").style.display = "block";
    
    document.getElementById("btnCross").style.display = "none";
    document.getElementById("btnUpDown").style.display = "none";
}
