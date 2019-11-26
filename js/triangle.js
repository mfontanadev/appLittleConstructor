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
