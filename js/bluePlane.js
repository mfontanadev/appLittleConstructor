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

    this.initPlane();
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
                    LinkPoint.C_DIRECTION_NOT_SET);
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
                    LinkPoint.C_DIRECTION_NOT_SET);
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
                    linkDirection);
                this.linkPoints.push(item);

                if (this.initialLinkPointGround === null)
                    this.initialLinkPointGround = item;
            }
        }

    // Add cursor to current space.
    var linkPoint = this.getLinkPointAtIndex(0, 0); 

    this.cursor.piece = PieceFactory.getInstance().createPiece(PieceFactory.CURSOR);
    this.cursor.piece.setSelected(true);
    this.cursor.setLink(this.getLinkPointAtIndex(0, 0));
    
    this.addMesh(this.cursor.getMesh());

    // Add tablero made by the union of ground and cursor marks.
    this.createTablero();
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

BluePlane.prototype.moveCursor = function(_columnDelta, _rowDelta) 
{
    var actualX = this.cursor.link.indexPos.x;
    var actualY = this.cursor.link.indexPos.y;
    
    if (actualX + _columnDelta >= 0 && actualX + _columnDelta < BluePlane.C_BOARD_COLUMNS &&
        actualY + _rowDelta >= 0 && actualY + _rowDelta < BluePlane.C_BOARD_ROWS)
    {
        this.cursor.setLink(this.getLinkPointAtIndex(actualX + _columnDelta, actualY + _rowDelta));
        this.setModifiedData(true);
    }
}

BluePlane.prototype.findLinkedPointFromPiece = function(_piece) 
{
    var result = null;
    var element = null; 
    for (var index = 0; index < this.linkPoints.length && result === null; index++) 
    {
        element = this.linkPoints[index];

        for (var p = 0; p < element.pieces.length && result === null; p++) 
        {
            elementPiece = element.pieces[p];

            if (elementPiece._id === _piece._id)
            {
                result = element;
            }
        }            
    }

    return result;
}

BluePlane.prototype.getCursor = function() 
{
    return this.cursor;
}

BluePlane.prototype.addPieceAtCursor = function(_pieceType) 
{
    this.addPieceAtLink(this.cursor.getLink(), _pieceType);
}

BluePlane.prototype.addPieceAtLink = function(_link, _pieceType) 
{
    var piece = PieceFactory.getInstance().createPiece(_pieceType);

    if (this.movePieceToLinkPosition(_link, piece) === true)
    {
        _link.pieces.push(piece);
        this.addMesh(piece.mesh);
        this.reorganizePiecesYPosition(_link);
    }
    else
        piece = null;

    return piece;
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

BluePlane.prototype.movePieceToCursorPosition = function(_cursor, _piece) 
{
    return this.movePieceToLinkPosition(_cursor.getLink(), _piece);
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
                _piece.mesh.setAngleY(JSGameEngine.graToRad(90));
            else
                _piece.mesh.setAngleY(JSGameEngine.graToRad(0));
        }

        result = true;
    }

    return result;
}

BluePlane.prototype.deleteSelectedPiece = function() 
{
    if (this.cursor === null || this.getSelectedPiece() === null)
        return;

    var pieceId = this.getSelectedPiece().getId();
    var meshId = this.getSelectedPiece().getMesh().getId();

    this.cursor.getLink().removePiece(pieceId);
    this.reorganizePiecesYPosition(this.cursor.getLink());
    
    this.removePiece(meshId);

    this.selectedPiece = null;
}

BluePlane.prototype.createTablero = function() 
{
    var linkPoint = null;
    var pilar = null;

    //
    var ground = new Piece();
    ground = PieceFactory.getInstance().createPiece(PieceFactory.BOARD);
    this.addMesh(ground.getMesh());

    var pilarBase = new Mesh();
    pilarBase.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("holeMark.obj"), null, true);
    pilarBase.updateCenter();
    pilarBase.center();
 
    var groundBase = new Mesh();
    groundBase.loadMeshFromFile(JSGameEngine.resolveURLToResourceFolder("groundMark.obj"), null, true);
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
                pilar.setPosition(linkPoint.position.x, linkPoint.position.y, linkPoint.position.z);
                pilar.setZOrder(2);
                this.addMesh(pilar);
            }
        }
    }
}

BluePlane.prototype.togleSelectPiece = function()
{
    if (this.selectedPiece === null)
    {
        this.selectPieceAtCursor();
    }
    else
    {
        this.selectedPiece.setSelected(false);
        this.selectedPiece = null;
    }
}

BluePlane.prototype.toggleNextSelectedPiece = function()
{
    if (this.selectedPiece !== null)
    {
        var pieceId = this.selectedPiece.getId();

        for (let index = 0; index < this.cursor.link.pieces.length; index++) 
        {
            const element = this.cursor.link.pieces[index];
            
            if (element.getId() === pieceId)
            {
                if (index + 1 < this.cursor.link.pieces.length)
                {
                    this.togleSelectPiece();

                    this.selectedPiece = this.cursor.link.pieces[index + 1];
                    this.selectedPiece.setSelected(true);
                }
                break;
            }
        }
    }
}

BluePlane.prototype.togglePreviousSelectedPiece = function()
{
    if (this.selectedPiece !== null)
    {
        var pieceId = this.selectedPiece.getId();

        for (let index = this.cursor.link.pieces.length - 1; index >= 0; index--) 
        {
            const element = this.cursor.link.pieces[index];
            
            if (element.getId() === pieceId)
            {
                if (index - 1 >= 0)
                {
                    this.togleSelectPiece();

                    this.selectedPiece = this.cursor.link.pieces[index - 1];
                    this.selectedPiece.setSelected(true);
                }
                break;
            }
        }
    }
}

BluePlane.prototype.getSelectedPiece = function() 
{
    return this.selectedPiece;
}

BluePlane.prototype.selectPieceAtCursor = function() 
{
    if (this.cursor.link.pieces.length > 0)
    {
        this.selectedPiece = this.cursor.link.pieces[0];
        this.selectedPiece.setSelected(true);
    }
}

BluePlane.prototype.rotateSelectedPiece = function() 
{
    this.getSelectedPiece().mesh.addAngleY(JSGameEngine.graToRad(90));
}

BluePlane.prototype.loadBoard = function(_fileName) 
{
    if (C_MOCK_MODE === true)
    {
        this.loadBoardMock(_fileName);
    }
    else
    {
        this.loadBoardServer(_fileName);
    }
}

BluePlane.prototype.loadBoardMock = function(_fileName) 
{
    if (mockedObj.has(_fileName) === true)
    {
        var responseText = mockedObj.get(_fileName);
        responseText = responseText.replace(/&lf;/g, "\n");
        this.setBoardFromData(responseText);	            
    }
}

BluePlane.prototype.loadBoardServer = function(_fileName) 
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
            }
        }
    }
    rawFile.send(null);
}

BluePlane.prototype.setBoardFromData = function(_data) 
{
    var bluePlaneOBJ = null;
    
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
                    this.addPieceAtLink(this.linkPoints[linkIndex], pieceMatrix[row][col]);
                }
                linkIndex++;
            }
        }
    }
}

BluePlane.prototype.saveBoard = function(_filename) 
{
    var bluePlaneOBJ = this.generateBoardData();
    var json = JSON.stringify(bluePlaneOBJ, null, "   ");

    JSGameEngine.download(_filename, json);
}

BluePlane.prototype.printBoard = function(_fileName) 
{
    var bluePlaneOBJ = this.generateBoardData();
    var lines = Array();
    var fileData = "";
    
    console.clear();

    //TODO: add piece quick reference.
    fileData += "Piece reference  " + "\n";
    fileData += "1- PILAR BAJO    " + "\n";
    fileData += "2- RAILING       " + "\n";
    fileData += "3- SOCLE        " + "\n";
    fileData += "4- WINDOW       " + "\n";
    fileData += "5- DOOR        " + "\n";
    fileData += "6- PILAR MEDIO   " + "\n";
    fileData += "7- PILAR ALTO    " + "\n";
    fileData += "8- FLOOR          " + "\n";
    fileData += "9- CABRIADA (SHF)" + "\n";
    fileData += "0- ROOF (SHF)   " + "\n";
    fileData += "\n";

    // Process all layers
    for (var layerIndex = 0; layerIndex < bluePlaneOBJ.Layers.length; layerIndex++)
    {
        const pieceMatrix = bluePlaneOBJ.Layers[layerIndex].pieceMatrix;
        JSGameEngine.chClearArray(lines);
        
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
                        token = JSGameEngine.padChar(pieceMatrix[row][col], 2, "0");
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
                        token = JSGameEngine.padChar(pieceMatrix[row][col], 2, "0");
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
            //console.log(colText);
            //console.log(colText2);
        }

        var line = "";
        lines.push("Layer:" + layerIndex);
        for (var i = lines.length - 1; i >= 0; i--) 
        {
            // Avoid CHrome console merge same text lines.
            line = lines[i];
            if (i % 2 === 0)
                line += " ";

            console.log(line);
            fileData += line + "\n";
        }
        console.log("\n\n\n");
        fileData += "\n\n\n";
    }
   
    JSGameEngine.download(_fileName, fileData);    
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

BluePlane.prototype.selectNextLayer = function() 
{
    if (this.currentLayer < this.getMaxLayer() - 1)
    {
        this.currentLayer++;
        this.onlyShowCurrentLayer();
    }
}

BluePlane.prototype.selectPreviousLayer = function() 
{
    if (this.currentLayer > -1)
    {
        this.currentLayer--;
        this.onlyShowCurrentLayer();
    }
}

BluePlane.prototype.onlyShowCurrentLayer = function() 
{
    var element = null; 
    for (var index = 0; index < this.linkPoints.length; index++) 
    {
        element = this.linkPoints[index];

        for (var p = 0; p < element.pieces.length; p++) 
        {
            elementPiece = element.pieces[p];

            elementPiece.getMesh().hide  = true;
            if (p === this.currentLayer || this.currentLayer === -1)
            {
                elementPiece.getMesh().hide = false;
                this.setModifiedData(true);
            }
        }            
    }
}

BluePlane.prototype.addMesh = function(_mesh)
{ 
    this.getMeshCollection().push(_mesh);
    this.setModifiedData(true);
}

BluePlane.prototype.getMeshCollection = function()
{ 
    return this.meshCollection;
}

BluePlane.prototype.setMeshCollection = function(_meshCollection)
{ 
    this.meshCollection = _meshCollection;
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
        this.setModifiedData(true);
    }
}

BluePlane.prototype.setModifiedData = function(_value) 
{
    this.dataModified = _value;
}

BluePlane.prototype.isDataModified = function(_pieceId) 
{
    return this.dataModified;
}

