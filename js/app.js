// --------------------------------------------------------------------
// Entry point to the aplication, main loop, inputs controlle, core
//

var C_VERSION_TITLE = "Little constructor ThreeJS v3.1.1";
var gEngine = null; 
var C_SERVER_IP = "localhost:8080";

function load() 
{
    console.log(C_VERSION_TITLE);
    document.title = C_VERSION_TITLE;

    onUserCreate();

    setInterval('onUserUpdate()', 1000 / 25);
}

// --------------------------------------------------------------------
// App data
//
var spaceThree = new SpaceThree();
var bluePlane = new BluePlane();
var flyingMode = false;

var leftToolbarElements = [
    "btnRotate", 
    "btnZoomIn", 
    "btnZoomOut",
    "btnFlying",
    "btnCancelFlying"];

var pieceToolbarElements = [
    "btnPILAR_SMALL", 
    "btnRAILING", 
    "btnSOCLE", 
    "btnWINDOW", 
    "btnDOOR", 
    "btnPILAR_MEDIUM", 
    "btnPILAR_TALL", 
    "btnFLOOR",
    "btnCABRIADA", 
    "btnROOF"];

var pieceActionsToolbarElements = [
    "btnPieceMoveUp",
    "btnPieceMoveDown",
    "btnPieceRotate",
    "btnPieceDelete"];

function onUserCreate() 
{
    console.log("User create");

    // Space preview, ThreeJs renderer.
    spaceThree.setEditor(this);
    spaceThree.appendToDocumentBody();
    spaceThree.addPointLight(0xFFFFFF, 1, -100, 100, 0, 300, true);
    spaceThree.resetScene();
    spaceThree.onCameraChange(updateCameraControls);
    spaceThree.rotateCamera(90);

    // Object manager
    bluePlane.setEditor(this);

    // UI control events
    setVisibilityPieceActionsToolbar(false);

    addEventsToMenu();
    addEventsToLeftToolbar();
    addEventsToPiecesToolbar();
    addEventsToPieceActionsToolbar();

    showControlsOnFlying();
}

function onUserUpdate() 
{
    // Inputs
    bluePlane.handleInputs();
    spaceThree.handleInputs(this);

    // Implement game logic
    bluePlane.implementGameLogic();
    spaceThree.implementGameLogic(this);

    // Render
    bluePlane.render();
    spaceThree.render(this);
}

// EVENTS
// FILE MENU EVENTS
function addEventsToMenu()
{
    document.getElementById("btnCross").disabled = true; 
    document.getElementById("btnUpDown").disabled = true; 

    addEventToFileSection();
    addEventToExampleSection();
    addEventToAboutSection();
}

function addEventToFileSection()
{
    document.getElementById('idLoad').addEventListener("click", function() 
    {
        document.getElementById('file-load').click();
    });
   
    document.getElementById('file-load').addEventListener("change", function(e) 
    {
        var file = e.target.files[0]; 
        bluePlane.loadBoardFromFile(file);
    });

    document.getElementById('idSave').addEventListener("click", function() 
    {
        bluePlane.saveBoard(bluePlane.getFilename() + ".bpl"); 
    });

    addSaveAsEvents();

    document.getElementById('idPrint').addEventListener("click", function() 
    {
        bluePlane.printBoard(bluePlane.getFilename() + ".ppl"); 
    });

    addPrintAsEvents();

    document.getElementById('idClearBoard').addEventListener("click", function() 
    {
        bluePlane.resetBoard();
    });
}

function addSaveAsEvents()
{
    var modal = document.getElementById("idSaveAsModal");

    document.getElementById("idOpenSaveAs").onclick = function() 
    {   
        modal.style.display = "block";
        document.getElementById('file-save-as').value = bluePlane.getFilename();
    }

    document.getElementById("idSaveAsOk").onclick = function() 
    {
        modal.style.display = "none";
        var saveAsFilename = document.getElementById('file-save-as').value;

        bluePlane.saveBoard(saveAsFilename + ".bpl"); 
    }

    document.getElementById("idSaveAsCancel").onclick = function() {modal.style.display = "none";}
}

function addPrintAsEvents()
{
    var modal = document.getElementById("idPrintAsModal");

    document.getElementById("idOpenPrintAs").onclick = function() 
    {   
        modal.style.display = "block";
        document.getElementById('file-print-as').value = bluePlane.getFilename();
    }

    document.getElementById("idPrintAsOk").onclick = function() 
    {
        modal.style.display = "none";
        var saveAsFilename = document.getElementById('file-print-as').value;

        bluePlane.saveBoard(saveAsFilename + ".ppl"); 
    }

    document.getElementById("idPrintAsCancel").onclick = function() {modal.style.display = "none";}
}

// EXAMPLE MENU EVENTS
function addEventToExampleSection()
{
    document.getElementById('idExampleLittleHouse').addEventListener("click", function() 
    {
        bluePlane.loadBoard('obj/house.bpl');
    });
}

// ABOUT MENU EVENTS
function addEventToAboutSection()
{
    addEventsToAboutOption();
    addEventsToSourceCodeOption();
}

function addEventsToAboutOption()
{
    var modal = document.getElementById("idAboutModal");

    var btn = document.getElementById("idOpenAbout");
    var span = document.getElementById("idCloseAbout");

    btn.onclick = function() {modal.style.display = "block";}
    span.onclick = function() {modal.style.display = "none";}
}

function addEventsToSourceCodeOption()
{
    var btn = document.getElementById("idSourceCode");
    btn.onclick = function() {window.open("https://github.com/mfontanadev/appLittleConstructor/tree/ThreeJSEx")};
}

// LEFT TOOLBAR EVENTS
function addEventsToLeftToolbar()
{
    leftToolbarElements.forEach(element => 
    {
        document.getElementById(element).addEventListener("click", function(event) {onClicButtonLeftToolbar(event, element);});
    });

    addEventsToZoom();

    addEventsToRotation();
}

function onClicButtonLeftToolbar(event, id) 
{
    switch ( id ) 
    {
        case 'btnRotate': 
            this.rotateCameraFixed(90); 
            break;
        case 'btnZoomIn': 
            this.zoomCamera(-50); 
            break;
        case 'btnZoomOut':
            this.zoomCamera(50); 
            break;
        case 'btnFlying': 
            flyingMode = true;
            this.hideControlsOnFlying();
            this.spaceThree.startFlyingControl();  
            break;
        case 'btnCancelFlying':
            flyingMode = false;
            this.showControlsOnFlying();
            this.spaceThree.cancelFlyingControl();  
            break;
    }
}

function addEventsToZoom()
{
    document.getElementById("idSliderZoom").addEventListener("input", function() {zoomCameraSliderV(this.value)});
    document.getElementById("idSliderZoom").addEventListener("change", function() {zoomCameraSliderV(this.value)});
}

function zoomCamera(_zoomDelta)
{
    spaceThree.zoomCamera(_zoomDelta);
}

function zoomCameraSliderV(_value)
{
    spaceThree.zoomCameraPercent(_value);
}

function addEventsToRotation()
{
    document.getElementById("idSliderH").addEventListener("input", function() {rotateCameraSliderH(this.value)});
    document.getElementById("idSliderH").addEventListener("change", function() {rotateCameraSliderH(this.value)});

    document.getElementById("idSliderV").addEventListener("input", function() {rotateCameraSliderV(this.value)});
    document.getElementById("idSliderV").addEventListener("change", function() {rotateCameraSliderV(this.value)});
}

function rotateCameraSliderH(_value)
{
    spaceThree.rotateCameraPercent(_value);
}

function rotateCameraFixed(_angle)
{
    spaceThree.rotateCamera(_angle);
}

function rotateCameraSliderV(_value)
{
    spaceThree.rotateCameraPercentAzimuthAngle(_value);
} 

// PIECE TOOLBAR EVENTS
function addEventsToPiecesToolbar()
{
    pieceToolbarElements.forEach(element => 
    {
        document.getElementById(element).addEventListener("click", function(event) {onClicButtonPiecesToolbar(event, element);});
    });
}

function onClicButtonPiecesToolbar(event, id)
{
    switch ( id ) 
    {
        case 'btnPILAR_SMALL': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.PILAR_SMALL);
            break;
        case 'btnRAILING': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.RAILING);
            break;
        case 'btnSOCLE': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.SOCLE);
            break;
        case 'btnWINDOW': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.WINDOW);
            break;
        case 'btnDOOR': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.DOOR);
            break;
        case 'btnPILAR_MEDIUM': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.PILAR_MEDIUM);
            break;
        case 'btnPILAR_TALL': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.PILAR_TALL);
            break;
        case 'btnFLOOR': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.FLOOR);
            break;
        case 'btnCABRIADA': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.CABRIADA);
            break;
        case 'btnROOF': 
            bluePlane.createAndAddSelectedPieceToCursorPosition(PieceFactory.ROOF);
            break;
    }
}

function addEventsToPieceActionsToolbar()
{
    pieceActionsToolbarElements.forEach(element => 
    {
        document.getElementById(element).addEventListener("click", function(event) {onClicButtonPieceActionsToolbar(event, element);});
    });
}

function onClicButtonPieceActionsToolbar(event, id) 
{
    switch ( id ) 
    {
        case 'btnPieceMoveUp': 
            bluePlane.moveSelectedPieceUp(); 
        break;
    
        case 'btnPieceMoveDown': 
            bluePlane.moveSelectedPieceDown(); 
        break;
        
        case 'btnPieceRotate': 
            bluePlane.rotateSelectedPiece(); 
        break;
        
        case 'btnPieceDelete': 
            bluePlane.deleteSelectedPiece(); 
        break;
    }
}

// UI BINDINGS
function setVisibilityPieceActionsToolbar(_visible) 
{
    var panel = document.getElementById("pieceActionsToolbar");

    if (_visible === true)
    {
        panel.style.display = "block";
    }
    else
    {
        panel.style.display = "none";
    }
}

function setVisibilityPieceToolbar(_visible) 
{
    var panel = document.getElementById("pieceToolbar");

    if (_visible === true)
    {
        panel.style.display = "block";
    }
    else
    {
        panel.style.display = "none";
    }
}

function updateFileNameInfo(_fileName)
{
    document.getElementById("info").innerHTML = _fileName + ".bpl";
}

function updateCameraControls(_inclinationCameraAngle, _azimuthCameraAngle, _zoomCamera)
{
    var percentValue = 0;
    
    percentValue = (_inclinationCameraAngle / 360) * 100;
    document.getElementById("idSliderH").value = percentValue;

    var rangeRot = SpaceThree.MAX_AZIMUTH_ANGLE - SpaceThree.MIN_AZIMUTH_ANGLE;
    percentValue = 100 - ((_azimuthCameraAngle - SpaceThree.MIN_AZIMUTH_ANGLE) / rangeRot) * 100;
    document.getElementById("idSliderV").value = percentValue;

    var rangeZoom = SpaceThree.MAX_ZOOM - SpaceThree.MIN_ZOOM;
    var percentValue = 100 - ((_zoomCamera - SpaceThree.MIN_ZOOM) / rangeZoom) * 100;
    document.getElementById("idSliderZoom").value = percentValue;
}

function hideControlsOnFlying()
{
    document.getElementById("btnFlyingPanel").style.display = "none";
    document.getElementById("btnCancelFlyingPanel").style.display = "block";

    this.setVisibilityPieceToolbar(false);
    this.setVisibilityPieceActionsToolbar(false);

    document.getElementById("btnZoomInPanel").style.display = "none";
    document.getElementById("sliderContainerZoomV").style.display = "none";
    document.getElementById("btnZoomOutPanel").style.display = "none";

    document.getElementById("btnRotatePanel").style.display = "none";
    document.getElementById("sliderContainerRotateH").style.display = "none";
    document.getElementById("sliderContainerRotateV").style.display = "none";

    document.getElementById("btnCross").style.display = "block";
    document.getElementById("btnUpDown").style.display = "block";
}

function showControlsOnFlying()
{
    document.getElementById("btnFlyingPanel").style.display = "block";
    document.getElementById("btnCancelFlyingPanel").style.display = "none";

    this.setVisibilityPieceToolbar(true);
    this.bluePlane.showHidePieceActionsToolbar();

    document.getElementById("btnZoomInPanel").style.display = "block";
    document.getElementById("sliderContainerZoomV").style.display = "block";
    document.getElementById("btnZoomOutPanel").style.display = "block";

    document.getElementById("btnRotatePanel").style.display = "block";
    document.getElementById("sliderContainerRotateH").style.display = "block";
    document.getElementById("sliderContainerRotateV").style.display = "block";
    
    document.getElementById("btnCross").style.display = "none";
    document.getElementById("btnUpDown").style.display = "none";
}
