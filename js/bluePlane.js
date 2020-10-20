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
