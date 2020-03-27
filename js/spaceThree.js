// --------------------------------------------------------------------
// Adapter to use Trhee.js instead my own 3D engine, 
// their kung fuu is better. 
//

function SpaceThree() 
{
    this.camera = new Vector(0, 0, 0);
    this.cameraYaw = 0;
    this.cameraXaw = 0;
    this.cameraZoom = 0;
    this.normalsVisible = false;
    this.linesVisible = false;
    this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;

    this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    this.cameraControlEnabled = false;
    this.ambientLightFactor = 0;    // 0 has no insidence, 1 full light.

    this.viewWidth = 800;
    this.viewHeight = 600;
    this.viewOffsetX = 0;
    this.viewOffsetY = 0;

    // Space preview with ThreeJS
    this.sceneT = new THREE.Scene();
    this.cameraT = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.rendererT = new THREE.WebGLRenderer();

    // Init orbit
    this.orbitControls = new THREE.OrbitControls( this.cameraT, this.rendererT.domElement );
                
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.mygroup = new THREE.Group();
}

SpaceThree.prototype.appendToDocumentBody = function() 
{
    document.body.appendChild( this.rendererT.domElement );
}

SpaceThree.prototype.setViewSize = function(_width, _height) 
{
    this.viewWidth = _width;
    this.viewHeight = _height;
    this.rendererT.setSize( 512, 320 );
}

SpaceThree.prototype.setViewOffset = function(_offsetX, _offsetY) 
{
    this.viewOffsetX = _offsetX;
    this.viewOffsetY = _offsetY;
}

SpaceThree.prototype.setLight = function(_x, _y, _z) 
{

    //this.lightDirection.x = _x;
    //this.lightDirection.y = _y;
    //this.lightDirection.z = _z;

    //this.lightDirection.normalize();
}

SpaceThree.prototype.addHemisphereLight = function(_skyColor, _groundColor) 
{
    var skyColor = _skyColor;  
    var groundColor = _groundColor;  
    var intensity = 1;
    var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    this.sceneT.add(light);
}

SpaceThree.prototype.addDirectionalLight = function(_color, _x, _y, _z, _x2, _y2, _z2) 
{
    const color = _color;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(_x, _y, _z);
    light.target.position.set(_x2, _y2, _z2);
    this.sceneT.add(light);
    this.sceneT.add(light.target);
}

SpaceThree.prototype.setCamera = function(_x, _y, _z) 
{
    this.camera.x = Math.round(_x);
    this.camera.y = Math.round(_y);
    this.camera.z = Math.round(_z);

    this.updateCameraT(this.getCamera(), this.getLookAtVector());
}

SpaceThree.prototype.updateCameraT = function(_camera, _lookAtVector) 
{
    this.cameraT.position.x = _camera.x;
    this.cameraT.position.y = _camera.y;
    this.cameraT.position.z = _camera.z * -1;

    var x2 = this.cameraT.position.x + _lookAtVector.x;
    var y2 = this.cameraT.position.y + _lookAtVector.y;
    var z2 = this.cameraT.position.z + _lookAtVector.z * -1;
    this.cameraT.lookAt( x2, y2, z2);

    //this.cameraT.up.set( 0, 0, 1 );
    this.cameraT.updateProjectionMatrix();
}

SpaceThree.prototype.addCameraZoom = function(_value) 
{
    this.cameraZoom += _value;
}

SpaceThree.prototype.subCameraZoom = function(_value) 
{
    this.cameraZoom -= _value;
    if (this.cameraZoom <= 0)
        this.cameraZoom = 0.01;
}

SpaceThree.prototype.getCamera = function() 
{
    return this.camera;
}

SpaceThree.prototype.updateIsometricCamera = function(_xaw, _yaw)
{
    this.updateCameraT(this.getCamera(), this.getLookAtVector());
}
SpaceThree.prototype.createRotateXMatrix = function(x) 
{
        var cosX = Math.cos(x);
        var sinX = Math.sin(x);
        var rotX = [
            [1, 0, 0, 0],
            [0, cosX, -sinX, 0],
            [0, sinX, cosX,0],
            [0, 0, 0, 1]
        ];	

        return rotX;				
}

SpaceThree.prototype.createRotateYMatrix = function(y) 
{
        var cosY = Math.cos(y);
        var sinY = Math.sin(y);
        var rotY = [
            [cosY, 0, sinY, 0],
            [0, 1, 0, 0],
            [-sinY, 0, cosY, 0],
            [0, 0, 0, 1]
        ];	
        
        return rotY;				
}
SpaceThree.prototype.getLookAtVector = function() 
{
    return this.getLookAtVectorAt(this.cameraXaw, this.cameraYaw);
}

SpaceThree.prototype.getLookAtVectorAt = function(_xaw, _yaw) 
{
    var lookAt = new Vector(0, 0, 0);
    var vTarget = new Vector(0, 0, 1);

    var xawMatrix = this.createRotateXMatrix(_xaw);
    var yawMatrix = this.createRotateYMatrix(_yaw);

    Space.multiplyMatrixVectorOver(vTarget, xawMatrix);
    Space.multiplyMatrixVectorOver(vTarget, yawMatrix);

    lookAt.clone(vTarget);
    return lookAt;
}

SpaceThree.prototype.update = function(_meshCollection, _forceThreeUpdate)
{ 
    gEngine.startTime("process");
    
    if (_forceThreeUpdate === false)
        _forceThreeUpdate = this.checkIFSomeMeshMustBeUpdated(_meshCollection);

    if (_forceThreeUpdate === true)
    {
        // Calculate render data for each mesh.
        var meshItem = null;
        for (var i = 0; i < _meshCollection.length; i++) 
        {
            meshItem = _meshCollection[i];
            if (meshItem.hide === false)
            {
                var mesh = this.createRenderData(meshItem);
                this.mygroup.add(mesh);
            }    
        }			
        this.sceneT.add( this.mygroup );
    }
    
    gEngine.showTimeDiff("process");

    this.render();
    
    if (gEngine.logTimes === true)
    {
        console.log("Count triangles:", sceneTiranglesToRender.length, "(mesh =", _meshCollection.length, ")");
    }
}

SpaceThree.prototype.checkIFSomeMeshMustBeUpdated = function(_meshCollection)
{ 
    var returnValue = false;
    
    for (var i = 0; i < _meshCollection.length; i++) 
    {
        if (_meshCollection[i].updateMeshBecauseTextureWasLoaded === true)
        {
            _meshCollection[i].updateMeshBecauseTextureWasLoaded = false;
            returnValue = true;
        }
    }

    return returnValue;
}

// COnvert MEsh to Three Shape and add to scene.
SpaceThree.prototype.createRenderData = function(_mesh)
{ 
    if (typeof this.sceneT.getObjectById(this.mygroup.id) !== 'undefined')
    {
        JSGameEngine.chClearArray(this.mygroup.children);
        this.sceneT.remove(this.mygroup);
    }

    // MATERIAL
    var mycube_material = null;
    if (_mesh.imgDataTexture !== null)
    {
        var loader = new THREE.TextureLoader();
        var texture = null;
        
        if (C_MOCK_MODE === true)
            texture = loader.load(mockedObj.get(_mesh.textureFileName));
        else
            texture = loader.load(_mesh.textureFileName);
        
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        var repeats = 1;
        texture.repeat.set(repeats, repeats);

        mycube_material = new THREE.MeshPhongMaterial({             
            map: texture,
            side: THREE.DoubleSide
        });
    }
    else
    {
        var shColor = JSGameEngine.st_rgbaToColor( _mesh.meshColor.r, _mesh.meshColor.g,  _mesh.meshColor.b);
        mycube_material = new THREE.MeshPhongMaterial( { color: shColor } );
    }

    // GEOMETRY
    var mycube_geometry = new THREE.Geometry();

    // Dump mesh data to THREE.mesn
    for (var i = 0; i < _mesh.points.length; i++) 
    {
        mycube_geometry.vertices.push
        (
            new THREE.Vector3(
                _mesh.points[i].x + _mesh.VectorCenter.x, 
                _mesh.points[i].y + _mesh.VectorCenter.y, 
                _mesh.points[i].z + _mesh.VectorCenter.z)
        );
    }

    for (var i = 0; i < _mesh.faces.length; i++) 
    {
        mycube_geometry.faces.push
        (
            new THREE.Face3(_mesh.faces[i].x, _mesh.faces[i].y, _mesh.faces[i].z)
        );
    }

    if (_mesh.imgDataTexture !== null)
    {
        for (var i = 0; i < _mesh.faces.length; i++) 
        {
            mycube_geometry.faceVertexUvs[0].push( 
                [
                    new THREE.Vector2(_mesh.tris[i].t[0].u, _mesh.tris[i].t[0].v), 
                    new THREE.Vector2(_mesh.tris[i].t[1].u, _mesh.tris[i].t[1].v), 
                    new THREE.Vector2(_mesh.tris[i].t[2].u, _mesh.tris[i].t[2].v) 
                ]);
        }
    }

    //mycube_geometry.computeBoundingSphere();
    mycube_geometry.computeFaceNormals();

    // MESH
    var mycube_mesh = new THREE.Mesh(mycube_geometry, mycube_material );

    // TRANSFORMATIONS
    // Scale
    mycube_mesh.scale.set(
        _mesh.getScale().x, 
        _mesh.getScale().y, 
        _mesh.getScale().z); 

    // Rotation
    mycube_mesh.rotateX(_mesh.getRotation().x);
    mycube_mesh.rotateY(_mesh.getRotation().y);
    mycube_mesh.rotateZ(_mesh.getRotation().z);

    // Position
    mycube_mesh.position.set(
        _mesh.position.x , 
        _mesh.position.y , 
        _mesh.position.z * -1);


    return mycube_mesh;
}

SpaceThree.prototype.render = function()
{ 
    gEngine.startTime("draw");
 
    this.rendererT.render( this.sceneT, this.cameraT );

    gEngine.showTimeDiff("draw");	
}

SpaceThree.prototype.renderLookAt = function(_currentLayer)
{ 
    var vCamera = this.getCamera();
    var vLookDir = this.getLookAtVector();

    // Viewport
    var rectSize = 100;
    var r = {   
        x1: 50,
        y1: 10, 
        x2: rectSize, 
        y2: rectSize};
    
    var rmx = r.x1 + rectSize / 2;
    var rmy = r.y1 + rectSize / 2;

    gEngine.renderRectangle(r.x1, r.y1, rectSize, rectSize, 1, "green");
    gEngine.renderLine(rmx, r.y1, rmx, r.y1 + rectSize, 1, "green");
    gEngine.renderLine(r.x1, rmy, r.x1 + rectSize, rmy, 1, "green");

    // Camera position			
    var cameraPosText = "C Pos: " + Math.round(vCamera.x) + "," + Math.round(vCamera.y) + "," + Math.round(vCamera.z) + "";
    gEngine.renderText(r.x1, r.y1 + rectSize + 10, cameraPosText, "green");

    // Camera angles			
    var cameraRotText = "C Ang: " + Math.round(JSGameEngine.radToGra (this.cameraXaw)) + "," + 
    Math.round(JSGameEngine.radToGra (this.cameraYaw)) + "," + (this.cameraZoom).toFixed(2);
    gEngine.renderText(r.x1, r.y1 + rectSize + 20, cameraRotText, "green");

    // Cursor
    var k = JSGameEngine.C_VIEWPORT_SCALE;

    var mw = this.viewWidth / 2;
    var mh = this.viewHeight / 2;
    
    var x1 = vCamera.x;
    var y1 = vCamera.z;

    var x2 = x1 * k + (vLookDir.x * JSGameEngine.C_VIEWPORT_CURSOR_LENGTH);
    var y2 = y1 * k + (vLookDir.z * JSGameEngine.C_VIEWPORT_CURSOR_LENGTH);

    gEngine.renderLine(rmx + x1 * k, rmy - y1 * k, rmx + x2, rmy - y2, 1, JSGameEngine.FG_WHITE);
    gEngine.renderCircle(rmx + x1 * k, rmy - y1 * k, 2, 0, JSGameEngine.FG_WHITE);

    // Projection information
    var projectionInfo = ""
    if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
        projectionInfo = "P=P";
    else
        projectionInfo = "P=I";
    gEngine.renderText(r.x1 - 30, r.y1 + 9, projectionInfo, "yellow");

    // Illumination information
    var fillTypeInfo = ""
    if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
        fillTypeInfo = "I=S";
    else if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_LIGHT)
        fillTypeInfo = "I=L";
    gEngine.renderText(r.x1 - 30, r.y1 + 19, fillTypeInfo, "yellow");

    // Wireframe information
    var wireframeInfo = ""
    if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        wireframeInfo = "M=W";
    else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
        wireframeInfo = "M=T";
    else if (this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
            wireframeInfo = "M=P";
    gEngine.renderText(r.x1 - 30, r.y1 + 29, wireframeInfo, "yellow");

    // Camera control information
    var cameraControlInfo = ""
    if (this.cameraControlEnabled === true)
        cameraControlInfo = "C";
    else
        cameraControlInfo = "c";
    gEngine.renderText(r.x1 - 30, r.y1 + 39, cameraControlInfo, "yellow");			

    // Current layer.
    if (_currentLayer !== -1)
    {
        gEngine.renderText(r.x1 - 30, r.y1 + 49, "CL=" + _currentLayer, "yellow");
    }			     
}

SpaceThree.prototype.renderInfo = function()
{ 
}

SpaceThree.prototype.changeRenderMode = function() 
{
    if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
        this.renderMode = Space.C_RENDER_MODE_PIXEL_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
        this.renderMode = Space.C_RENDER_MODE_WIREFRAME;
}

SpaceThree.prototype.changeProjectionType = function() 
{
    /*
    if (this.projectionType === Space.C_PROJECTION_TYPE_ISOMETRIC)
        this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    else if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
        this.projectionType = Space.C_PROJECTION_TYPE_ISOMETRIC;
    */
}

SpaceThree.prototype.changeIlluminationMode = function() 
{
    if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_LIGHT)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_SOLID;
    else if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;
}

SpaceThree.prototype.changeNormalVisibility = function() 
{
    this.normalsVisible = !this.normalsVisible;
}
