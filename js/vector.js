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
