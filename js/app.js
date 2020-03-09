// --------------------------------------------------------------------
// Entry point to the aplication, main loop, inputs controlle, core
//

var C_VERSION_TITLE = "Little constructor (based on JSEngine) v1.3";
var gEngine = null; 
var C_SERVER_IP = "127.0.0.1:8080";

/* Ok this is a big thing. 
C_MOCK_MODE = true, this means that there is no need to load anything from external. 
Objetcs definitions and demo mode data is all included in hardcoded strings (see mockedObj.js)

C_MOCK_MODE = false, you need to startup some server and serve all files .obj and house,bpl files. 
If I have time (that means, surely not) I will make a detailed doumentation about it.
*/ 
var C_MOCK_MODE = true;

function load() 
{
    console.log(C_VERSION_TITLE);
    console.log("MOCK_MODE:", C_MOCK_MODE);

    document.title = C_VERSION_TITLE;

    gEngine = new JSGameEngine(document.getElementById("cv")); 
    gEngine.start();
}

// --------------------------------------------------------------------
// Game data
//
var spacePreview = new Space();
var spaceWired = new Space();
var bluePlane = new BluePlane();
var helpMode = false;

var defaultWX = 10;
var defaultWY = 10;
var defaultWZ = 10;
var defaultMeshColor = "100 100 100";
var defaultOffX = 0;
var defaultOffY = 0;
var defaultOffZ = 0;
var defaultIndex = 0;

/* For test Three.js
var meshes = new Array();
var piece = null;
*/

function onUserCreate() 
{
    console.log("User create");

    gEngine.showTimes(false);

    /* For test Three.js
    var meshes = new Array();
    piece = PieceFactory.getInstance().createPiece(PieceFactory.WINDOW);
    meshes.push(piece.mesh);
    spacePreview.setMeshCollection(meshes);
    */
    
    // Space preview.
    spacePreview.setViewSize(800, 340);
    spacePreview.setViewOffset(0, 0);

    spacePreview.normalsVisible = false;
    spacePreview.linesVisible = false;
    spacePreview.setLight(0, 500, 0);
    spacePreview.ambientLightFactor = 0.5;
    spacePreview.projectionType = Space.C_PROJECTION_TYPE_ISOMETRIC;

    spacePreview.setCamera(-180, 0, -180);
    spacePreview.cameraXaw = JSGameEngine.graToRad(-26);
    spacePreview.cameraYaw = JSGameEngine.graToRad(-43);
    spacePreview.addCameraZoom(1.4);
    spacePreview.updateIsometricCamera(spacePreview.cameraXaw, spacePreview.cameraYaw);
    bluePlane.setSpace(spacePreview);
    
    /* For test Three.js
    //bluePlane.setSpace(spacePreview);
    spacePreview.setMeshCollection(meshes);
    */
    
    // Space wired and top.
    spaceWired.setViewSize(800, 240);
    spaceWired.setViewOffset(0, 350);

    spaceWired.normalsVisible = false;
    spaceWired.linesVisible = false;
    spaceWired.renderMode = Space.C_RENDER_MODE_WIREFRAME;
    spaceWired.setLight(0, 500, 0);
    spaceWired.ambientLightFactor = 0.5;
    spaceWired.projectionType = Space.C_PROJECTION_TYPE_ISOMETRIC;

    spaceWired.setCamera(0, 300, 0);
    spaceWired.cameraXaw = JSGameEngine.graToRad(-90);
    spaceWired.addCameraZoom(1.25);
    spaceWired.updateIsometricCamera(spaceWired.cameraXaw, spaceWired.cameraYaw);
    spaceWired.setMeshCollection(spacePreview.getMeshCollection());
	
    /* For test Three.js
    //spaceWired.setMeshCollection(spacePreview.getMeshCollection());
    spaceWired.setMeshCollection(meshes);
    */

}

function onUserUpdate() 
{
    console.log("User update");			

    processInputs();

    gEngine.clearScreen();
     
    if (helpMode === false)
    {
        /* For test Three.js
        //piece.mesh.addAngleX(0.01);
        //piece.mesh.addAngleY(0.02);
	    */
	
        spaceWired.update();
        spaceWired.renderInfo();

        spacePreview.update();
        spacePreview.renderLookAt(spacePreview, bluePlane.currentLayer);
    }
    else
    {
        showHelpScreen();
    }
}

function processInputs()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_H) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_H) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_H);
        helpMode = !helpMode;
    }   

    if (helpMode === false)
    {
        this.processInputsFlags();

        if (spacePreview.cameraControlEnabled === true)
            this.processInputsCameraEnabled();
        else
            this.processInputsObjectMovement();

        this.processManagerObjects();
    }
}

function processInputsFlags()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_P) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_P) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_P);

        if (spacePreview.projectionType === Space.C_PROJECTION_TYPE_ISOMETRIC)
        {
            spacePreview.cameraXaw = 0;
            spacePreview.getCamera().y = 40; 
        }
        else
        {
            spacePreview.cameraXaw = JSGameEngine.graToRad(-26);
        }

        spacePreview.changeProjectionType();
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_C) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_C) === false)
    {
        spacePreview.cameraControlEnabled = !spacePreview.cameraControlEnabled;
        gEngine.satKeyWaitRelease(C_KEY_CHAR_C);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_N) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_N) === false)
    {
        spacePreview.changeNormalVisibility();
        gEngine.satKeyWaitRelease(C_KEY_CHAR_N);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_L) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_L) === false)
    {
        spacePreview.linesVisible = !spacePreview.linesVisible;
        gEngine.satKeyWaitRelease(C_KEY_CHAR_L);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_M) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_M) === false)
    {
        spacePreview.changeRenderMode();
        gEngine.satKeyWaitRelease(C_KEY_CHAR_M);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_I) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_I) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_I);
        spacePreview.changeIlluminationMode();
    }    
}

function processInputsCameraEnabled()
{
    if (spacePreview.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
    {
        if (gEngine.isKeyPressed(C_KEY_CTRL) === true)
        {
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().y += 5; 	// Travel Upwards

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().y -= 5; 	// Travel Downwards
        }
        else
        {
            // Rotate camera target.
            if (gEngine.isKeyPressed(C_KEY_LEFT) === true)
                spacePreview.cameraYaw += JSGameEngine.graToRad(5);

            if (gEngine.isKeyPressed(C_KEY_RIGHT) === true)
                spacePreview.cameraYaw -= JSGameEngine.graToRad(5);
        
            // Move camera
            var vForward = Vector.Mul(spacePreview.getLookAtVector(), 5); 

            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().add(vForward);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().sub(vForward);
        }
    }
    else
    {
        if (gEngine.isKeyPressed(C_KEY_CTRL) === true)
        {
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.cameraXaw -= JSGameEngine.graToRad(1);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.cameraXaw += JSGameEngine.graToRad(1);
        }
        else if (gEngine.isKeyPressed(C_KEY_SHIFT) === true)
        {
            /*
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().y += 5; 	// Travel Upwards

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().y -= 5; 	// Travel Downwards
                */
        }        
        else
        {

            if (gEngine.isKeyPressed(C_KEY_LEFT) === true)
                spacePreview.cameraYaw += JSGameEngine.graToRad(5);

            if (gEngine.isKeyPressed(C_KEY_RIGHT) === true)
                spacePreview.cameraYaw -= JSGameEngine.graToRad(5);

            // Move camera
            var vForward = Vector.Mul(spacePreview.getLookAtVector(), 1); 

            /*
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
                spacePreview.getCamera().add(vForward);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.getCamera().sub(vForward);
            */
            if (gEngine.isKeyPressed(C_KEY_UP) === true)
               spacePreview.addCameraZoom(0.1);

            if (gEngine.isKeyPressed(C_KEY_DOWN) === true)
                spacePreview.subCameraZoom(0.1);
        }

        spacePreview.updateIsometricCamera(spacePreview.cameraXaw, spacePreview.cameraYaw);
    }
}

function processManagerObjects()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_ADD) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_ADD) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_ADD);
        bluePlane.selectNextLayer();
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_SUB) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_SUB) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_SUB);
        bluePlane.selectPreviousLayer();
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_1) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_1) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.PILAR_SMALL);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_1);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_2) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_2) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.RAILING);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_2);
    }   

    if (gEngine.isKeyPressed(C_KEY_CHAR_3) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_3) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.SOCLE);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_3);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_4) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_4) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.WINDOW);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_4);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_5) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_5) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.DOOR);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_5);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_6) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_6) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.PILAR_MEDIUM);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_6);
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_7) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_7) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.PILAR_TALL);
        gEngine.satKeyWaitRelease(C_KEY_CHAR_7);
    }
    
    if (gEngine.isKeyPressed(C_KEY_CHAR_8) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_8) === false)
    {
        bluePlane.addPieceAtCursor(PieceFactory.FLOOR);

        gEngine.satKeyWaitRelease(C_KEY_CHAR_8);
    }    

    if (gEngine.isKeyPressed(C_KEY_CHAR_9) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_9) === false)
    {
        if (gEngine.isKeyPressed(C_KEY_SHIFT) === false)
            bluePlane.addPieceAtCursor(PieceFactory.CABRIADA);
        else
            bluePlane.addPieceAtCursor(PieceFactory.CABRIADAB);

        gEngine.satKeyWaitRelease(C_KEY_CHAR_9);
    }    

    if (gEngine.isKeyPressed(C_KEY_CHAR_0) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_0) === false)
    {
        if (gEngine.isKeyPressed(C_KEY_SHIFT) === false)
            bluePlane.addPieceAtCursor(PieceFactory.ROOF);
        else
            bluePlane.addPieceAtCursor(PieceFactory.ROOFB);

        gEngine.satKeyWaitRelease(C_KEY_CHAR_0);
    }  
}

function processInputsObjectMovement()
{
    if (gEngine.isKeyPressed(C_KEY_CHAR_D) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_D) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_D);
        bluePlane.saveBoard("house.bpl"); 
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_T) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_T) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_T);
        bluePlane.printBoard("housePrint.ppl"); 
    }

    if (gEngine.isKeyPressed(C_KEY_CHAR_U) === true && gEngine.getKeyWaitingRelease(C_KEY_CHAR_U) === false)
    {
        gEngine.satKeyWaitRelease(C_KEY_CHAR_U);
        bluePlane.loadBoard(JSGameEngine.resolveURLToResourceFolder("house.bpl")); 
    }

    if (gEngine.isKeyPressed(C_KEY_SPACE) === true && gEngine.getKeyWaitingRelease(C_KEY_SPACE) === false)
    {
        bluePlane.togleSelectPiece();
        gEngine.satKeyWaitRelease(C_KEY_SPACE);
    }

    if (bluePlane.getSelectedPiece() !== null)
    {
        if (gEngine.isKeyPressed(C_KEY_DELETE) === true && gEngine.getKeyWaitingRelease(C_KEY_DELETE) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_DELETE);
            bluePlane.deleteSelectedPiece(); 
        }
    }

    if (bluePlane.getSelectedPiece() !== null)
    {
        if (gEngine.isKeyPressed(C_KEY_UP) === true && gEngine.getKeyWaitingRelease(C_KEY_UP) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_UP);
            bluePlane.toggleNextSelectedPiece();
        }
    
        if (gEngine.isKeyPressed(C_KEY_DOWN) === true && gEngine.getKeyWaitingRelease(C_KEY_DOWN) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_DOWN);
            bluePlane.togglePreviousSelectedPiece();
        }

        if (gEngine.isKeyPressed(C_KEY_RETURN) === true && gEngine.getKeyWaitingRelease(C_KEY_RETURN) === false)
        {
            gEngine.satKeyWaitRelease(C_KEY_RETURN);
            bluePlane.rotateSelectedPiece(); 
        }

        bluePlane.movePieceToCursorPosition(bluePlane.getCursor(), bluePlane.getSelectedPiece());
    }
    else
    {
        if (gEngine.isKeyPressed(C_KEY_LEFT) === true && gEngine.getKeyWaitingRelease(C_KEY_LEFT) === false)
        {
            bluePlane.moveCursor(-1, 0);
            gEngine.satKeyWaitRelease(C_KEY_LEFT);
        }
    
        if (gEngine.isKeyPressed(C_KEY_RIGHT) === true && gEngine.getKeyWaitingRelease(C_KEY_RIGHT) === false)
        {
            bluePlane.moveCursor(1, 0);
            gEngine.satKeyWaitRelease(C_KEY_RIGHT);
        }

        if (gEngine.isKeyPressed(C_KEY_UP) === true && gEngine.getKeyWaitingRelease(C_KEY_UP) === false)
        {
            bluePlane.moveCursor(0, 1);
            gEngine.satKeyWaitRelease(C_KEY_UP);
        }
    
        if (gEngine.isKeyPressed(C_KEY_DOWN) === true && gEngine.getKeyWaitingRelease(C_KEY_DOWN) === false)
        {
            bluePlane.moveCursor(0, -1);
            gEngine.satKeyWaitRelease(C_KEY_DOWN);
        }        
    }
}

function showHelpScreen()
{
    gEngine.setFontSize(12);
    gEngine.locateText(1, 2, "PRESS H TO BACK");
    gEngine.locateText(1, 4, "Board:");
    gEngine.locateText(3, 5, "C=camera control on / off (use rows Right/Up/Left/Down ctrl+Up/Down).");
    gEngine.locateText(3, 6, "H=help screen on / off.");
    gEngine.locateText(3, 7, "I=illumination mode (S=solid, L=light).");
    gEngine.locateText(3, 8, "L=triangle lines on / off.");
    gEngine.locateText(3, 9, "N=normals on / off (you must be very close to see them).");
    gEngine.locateText(3, 10, "M=render mode (T=textured, P=pixel, W=wireframe).");
    gEngine.locateText(3, 11, "P=projection type, (I=isometric, P=perspective).");

    gEngine.locateText(1, 13, "General:");
    gEngine.locateText(3, 14, "Right/Up/Left/Down=move piece cursor.");
    gEngine.locateText(3, 15, "+/-=select layer (like a vertical cut).");
    gEngine.locateText(3, 16, "0..9=insert pieces, see reference in right side.");
    gEngine.locateText(3, 17, "U:upload file (from obj/house.bpl)");
    gEngine.locateText(3, 18, "D:download file binary mode (house.bpl, Chrome save it to download folder)");
    gEngine.locateText(3, 19, "T:download file humna mode (housePrint.ppl, Chrome save it to download folder)");

    gEngine.locateText(1, 22, "Pieces:");
    gEngine.locateText(3, 23, "SPACE:togle piece selection, then use Up/Down.");
    gEngine.locateText(3, 24, "DELETE:delete the selected piece.");
    gEngine.locateText(3, 25, "Up/Down:select piece when they are stacked in a column.");
    gEngine.locateText(3, 26, "RETURN:rotate the selected piece.");

    gEngine.locateText(1, 28, "See more at: http://mfontanadevhome.appspot.com/");
    gEngine.setFontSize(9);

}

// --------------------------------------------------------------------
// RESERVED FUNCTIONS: Making objects from Chrome console.
//
function multiCubeDataParameter(_array)
{
    var mergeAll = "";

    mergeAll = mergeAll + "multiCubeDataParameter" + "\n" + "(" + "\n" + "[" + "\n";
    
    for (let i = 0; i < _array.length; i++) 
    {
        const element = _array[i];

        if (i < _array.length - 1)
            mergeAll = mergeAll + '"' + element + '"' + "," + "\n";
        else
            mergeAll = mergeAll + '"' + element + '"'  + "\n";
    }

    mergeAll = mergeAll + "]" + "\n" + ");" + "\n\n";
    
    for (let i = 0; i < _array.length; i++) 
    {
        const element = _array[i];
        
        const tokens = element.split(",");
        
        const meshDef = cubeDataParameter(
            parseInt(tokens[0]), 
            parseFloat(tokens[1]), 
            parseFloat(tokens[2]), 
            parseFloat(tokens[3]), 
            parseFloat(tokens[4]), 
            parseFloat(tokens[5]), 
            parseFloat(tokens[6]), 
            tokens[7].trim());

            mergeAll = mergeAll + "\n" + meshDef + "\n";
    }

    console.clear();
    console.log(mergeAll);
}

function cubeDataParameter(_index, offX, offY, offZ, sizeX, sizeY, sizeZ, meshColor)
{
    var mesh = new Mesh();

    var meshData = "";

    meshData +="# Exported from Motor3dJS" + "\n";
    meshData +="o Object.1" + "\n";
    meshData +=   "\n";

    meshData +=   generateVertexString(offX,        offY,       offZ, meshColor);
    meshData +=   generateVertexString(offX,        offY+sizeY, offZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY+sizeY, offZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY,       offZ, meshColor);

    meshData +=   generateVertexString(offX,        offY,       offZ+sizeZ, meshColor);
    meshData +=   generateVertexString(offX,        offY+sizeY, offZ+sizeZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY+sizeY, offZ+sizeZ, meshColor);
    meshData +=   generateVertexString(offX+sizeX,  offY,       offZ+sizeZ, meshColor);
    meshData +=   "\n";

    // SOUTH
    meshData +=    generateFaceString(_index, 1,2,3);
    meshData +=    generateFaceString(_index, 1,3,4);

    // EAST
    meshData +=    generateFaceString(_index, 4,3,7);
    meshData +=    generateFaceString(_index, 4,7,8);

    // NORTH
    meshData +=    generateFaceString(_index, 8,7,6);
    meshData +=    generateFaceString(_index, 8,6,5);

    // WEST
    meshData +=    generateFaceString(_index, 5,6,2);
    meshData +=    generateFaceString(_index, 5,2,1);

    // TOP
    meshData +=    generateFaceString(_index, 2,6,7);
    meshData +=    generateFaceString(_index, 2,7,3);

    // BOTTOM
    meshData +=    generateFaceString(_index, 8,5,1);
    meshData +=    generateFaceString(_index, 8,1,4);

    return meshData;
}

function generateVertexString(wx, wy, wz, color)
{
    return "v " + wx.toFixed(2) + " " + wy.toFixed(2) + " " + wz.toFixed(2) + " " + color + "\n";
}

function generateFaceString(index, v1, v2, v3)
{
    v1 = v1 + index;
    v2 = v2 + index;
    v3 = v3 + index;

    return "f " + v1.toFixed(2) + " " + v2.toFixed(2) + " " + v3.toFixed(2) + "\n";
}