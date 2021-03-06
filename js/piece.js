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
