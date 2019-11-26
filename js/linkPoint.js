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
