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
