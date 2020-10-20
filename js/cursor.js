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
