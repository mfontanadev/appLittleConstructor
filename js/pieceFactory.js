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