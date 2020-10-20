// --------------------------------------------------------------------
// Adapter to use Trhee.js instead my own 3D engine, 
// their kung fuu is better. 
//
SpaceThree.self = null;
SpaceThree.MAX_AZIMUTH_ANGLE = 85;
SpaceThree.MIN_AZIMUTH_ANGLE = 20;
SpaceThree.MAX_ZOOM = 800;
SpaceThree.MIN_ZOOM = 30;

function SpaceThree() 
{
    SpaceThree.self = this;

    // Scene
    this.sceneT = new THREE.Scene();
    this.sceneT.castShadow = true;    

    // CameRA
    this.cameraT = new THREE.PerspectiveCamera( 40, window.innerWidth/window.innerHeight, 0.1, 10000 );
    this.cameraT.lookAt( 0, 0, 0 );
    this.inclinationCameraAngle = 45;
    this.azimuthCameraAngle = 45;
    this.cameraRadious = 400;

    // Renderer
    this.rendererT = new THREE.WebGLRenderer( { antialias: true } );
    this.rendererT.setSize(window.innerWidth, window.innerHeight);
    this.rendererT.setPixelRatio( window.devicePixelRatio );
    this.rendererT.outputEncoding = THREE.sRGBEncoding;
    this.rendererT.shadowMap.enabled = true;

    // Used in selection by mouse
    this.raycasterT = new THREE.Raycaster();
    this.mouse = {x:0, y:0, leftButtonDown: false, middleButtonDown: false, rightButtonDown: false, mouseT:  new THREE.Vector3()};

    // Ligths
    this.lightAmbientT = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.sceneT.add( this.lightAmbientT );

    this.mygroup = new THREE.Group();
    this.editor = null;
    this.selectedObjects = null;

    // Events
    this.onCameraChangeHandler = null;

    this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
    this.moveVector = new THREE.Vector3( 0, 0, 0 );
    this.rotationVector = new THREE.Vector3( 0, 0, 0 );
    this.lastPosition = new THREE.Vector3();
    this.movementSpeed = 5.0;
    this.rollSpeed = 0.05;
    this.tmpQuaternion = new THREE.Quaternion();
    this.waitMouseUp = false;

    this.lastQuaternion = new THREE.Quaternion();
    this.lastPosition = new THREE.Vector3();
    this.lastRotation = new THREE.Vector3();
}

// SETUP AND ESCENE
SpaceThree.prototype.appendToDocumentBody = function() 
{
    document.body.appendChild( this.rendererT.domElement );

    this.addGrid();
    this.addSkyDome();
    this.addResizeEvent();
    this.addMouseEvents();

    this.addFlyingControlEvents();
}

SpaceThree.prototype.addGrid = function() 
{
    var planeSize = 2000;
    var loader = new THREE.TextureLoader();
    var texture = null;

    // Texture
    var loader = new THREE.TextureLoader();
    texture = loader.load("obj/paper.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set(20, 20);

    var planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    //var planeMat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, opacity: 0.9, transparent: true});
    //var planeMat = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

    var planeMat  = new THREE.MeshPhongMaterial({             
        color: 0Xf57e42, 
        //transparent: true,
        //opacity: _mesh.alpha
        side: THREE.DoubleSide,
        shininess  :  20,
        bumpMap    :  texture,
        map        :  texture,
        bumpScale  :  0.45,
    });

    var planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.receiveShadow = true;
    planeMesh.rotation.x = Math.PI/2;
    planeMesh.position.y = -0.1;
    this.sceneT.add(planeMesh);
}

SpaceThree.prototype.addSkyDome = function() 
{
    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
        topColor: { value: new THREE.Color( 0x0077ff ) },
        bottomColor: { value: new THREE.Color( 0xffffff ) },
        offset: { value: 400 },
        exponent: { value: 0.6 }
    };

    var skyGeo = new THREE.SphereBufferGeometry( 4000, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    this.sceneT.add( sky );
}

SpaceThree.prototype.addResizeEvent = function()
{
    // Resize event
    window.addEventListener( 'resize', function () 
    {
        SpaceThree.self.cameraT.aspect = window.innerWidth / window.innerHeight;
        SpaceThree.self.cameraT.updateProjectionMatrix();
        SpaceThree.self.rendererT.setSize(window.innerWidth, window.innerHeight);
    }, false );
}

// MOUSE
SpaceThree.prototype.addMouseEvents = function()
{
    this.rendererT.domElement.addEventListener( 'touchstart', onTouchStart, false );
    function onTouchStart( event ) 
    {
        onTouchMove(event);
        SpaceThree.self.mouse.leftButtonDown = true;
       
        // Force calculation here because to use this data in BluePlane class,
        // touchStart is different to mouseDown, it fires first.
        SpaceThree.self.selectedObjects = SpaceThree.self.calculateSelectedObjectsByMouse();
        
        event.preventDefault();
        event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'touchend', onTouchEnd, false );
    function onTouchEnd( event ) 
    {
        SpaceThree.self.mouse.leftButtonDown = false;
        
        event.preventDefault();
        event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'touchmove', onTouchMove, false );
    function onTouchMove( event ) 
    {
        if (typeof event.targetTouches[0] !== 'undefined')
        {
            SpaceThree.self.mouse.x = event.targetTouches[0].clientX;
            SpaceThree.self.mouse.y = event.targetTouches[0].clientY;
    
            SpaceThree.self.mouse.mouseT.x = (event.targetTouches[0].clientX / window.innerWidth ) * 2 - 1;
            SpaceThree.self.mouse.mouseT.y = -(event.targetTouches[0].clientY / window.innerHeight ) * 2 + 1;
        }
    }

    this.rendererT.domElement.addEventListener( 'mousedown', onMouseDown, false );
    function onMouseDown( event ) 
    {
        if (event.button === 0)
            SpaceThree.self.mouse.leftButtonDown = true;
        if (event.button === 1)
            SpaceThree.self.mouse.middleButtonDown = true;
        if (event.button === 2)
            SpaceThree.self.mouse.rightButtonDown = true;

        event.preventDefault();
		event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'mouseup', onMouseUp, false );
    function onMouseUp( event ) 
    {
        if (event.button === 0)
            SpaceThree.self.mouse.leftButtonDown = false;
        if (event.button === 1)
            SpaceThree.self.mouse.middleButtonDown = false;
        if (event.button === 2)
            SpaceThree.self.mouse.rightButtonDown = false;

        event.preventDefault();
        event.stopPropagation();
    }

    this.rendererT.domElement.addEventListener( 'mousemove', onMouseMove, false );
    function onMouseMove( event ) 
    {
        SpaceThree.self.mouse.x = event.clientX;
        SpaceThree.self.mouse.y = event.clientY;

        SpaceThree.self.mouse.mouseT.x = (event.clientX / window.innerWidth ) * 2 - 1;
        SpaceThree.self.mouse.mouseT.y = -(event.clientY / window.innerHeight ) * 2 + 1;
    }
}

SpaceThree.prototype.addFlyingControlEvents = function()
{
    window.addEventListener( 'keydown', this.keyDown, false );
    window.addEventListener( 'keyup', this.keyUp, false );
}

SpaceThree.prototype.keyUp  = function ( event ) {

    switch ( event.keyCode ) {
        case 87: /*W*/ SpaceThree.self.moveState.up = 0; break;
        case 83: /*S*/ SpaceThree.self.moveState.down = 0; break;

        case 65: /*A*/ SpaceThree.self.moveState.yawLeft = 0; break;
        case 68: /*D*/ SpaceThree.self.moveState.yawRight = 0; break;

        case 38: /*up*/ SpaceThree.self.moveState.forward = 0; break;
        case 40: /*down*/ SpaceThree.self.moveState.back = 0; break;
    }

    SpaceThree.self.updateMovementVector();
    SpaceThree.self.updateRotationVector();
};

SpaceThree.prototype.keyDown = function ( event ) {

    switch ( event.keyCode ) {
        case 87: /*W*/ SpaceThree.self.moveState.up = 1; break;
        case 83: /*S*/ SpaceThree.self.moveState.down = 1; break;

        case 65: /*A*/ SpaceThree.self.moveState.yawLeft = 1; break;
        case 68: /*D*/ SpaceThree.self.moveState.yawRight = 1; break;

        case 38: /*up*/ SpaceThree.self.moveState.forward = 1; break;
        case 40: /*down*/ SpaceThree.self.moveState.back = 1; break;
    }

    SpaceThree.self.updateMovementVector();
    SpaceThree.self.updateRotationVector();
};

SpaceThree.prototype.updateMovementVector = function () 
{
    this.moveVector.x = ( - this.moveState.left + this.moveState.right );
    this.moveVector.y = ( - this.moveState.down + this.moveState.up );
    this.moveVector.z = ( - this.moveState.forward + this.moveState.back );
};

SpaceThree.prototype.updateRotationVector = function () 
{
    this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.y = ( - this.moveState.yawRight + this.moveState.yawLeft );
    this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

};

// LIFE CYCLE
SpaceThree.prototype.handleInputs = function()
{
    if (this.editor.flyingMode === true)
        this.checkMouseDownFlyingControls();
}

SpaceThree.prototype.checkMouseDownFlyingControls = function()
{
    if (this.editor.spaceThree.mouse.leftButtonDown === true)  
    {
        var btnCross = document.getElementById("btnCross");
        var btnUpDown = document.getElementById("btnUpDown");

        var cx = 0;
        var cy = 0;
        // NOTE: only when btnCross is enebled the width is scaled.
        // It will be better create a class and do it better.
        var radious = btnCross.width / 3;

        // Test up movement
        cx = (btnCross.width / 2) + btnCross.offsetLeft;
        cy = (btnCross.height / 3) * 0.5 + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.up = 1;
        }

        // Test down movement
        cx = (btnCross.width / 2) + btnCross.offsetLeft;
        cy = (btnCross.height / 3) * 2.5 + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.down = 1;
        }

        // Test left movement
        cx = (btnCross.width / 3) * 0.5 + btnCross.offsetLeft;
        cy = (btnCross.height / 2) + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.yawLeft = 1;
        }

        // Test right movement
        cx = (btnCross.width / 3) * 2.5 + btnCross.offsetLeft;
        cy = (btnCross.height / 2) + btnCross.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.yawRight = 1;
        }

        // Test forward movement
        cx = (btnUpDown.width / 2) + btnUpDown.offsetLeft;
        cy = (btnUpDown.height / 3) * 0.5 + btnUpDown.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.forward = 1;
        }

        // Test back movement
        cx = (btnUpDown.width / 2) + btnUpDown.offsetLeft;
        cy = (btnUpDown.height / 3) * 2.5 + btnUpDown.offsetTop;
        if (Helper.distance(cx, cy, this.editor.spaceThree.mouse.x, this.editor.spaceThree.mouse.y) < radious)
        {
            this.moveState.back = 1;
        }

        /*var btnPointer = document.getElementById("btnPointer");
        btnPointer.style.left = cx + "px";
        btnPointer.style.top = cy + "px";
        */

        var someMovementPending = (SpaceThree.self.moveState.up +
            SpaceThree.self.moveState.down + 
            SpaceThree.self.moveState.yawLeft +
            SpaceThree.self.moveState.yawRight +
            SpaceThree.self.moveState.forward + 
            SpaceThree.self.moveState.back) > 0;

        if (someMovementPending === true)
        {
            this.updateMovementVector();
            this.updateRotationVector();
           
            this.waitMouseUp = true;
            this.cleanJoystickFlags();
        }
    }
    else
    {
        if (this.waitMouseUp === true)
        {
            this.waitMouseUp = false;
            this.cleanJoystickFlags();

            this.updateMovementVector();
            this.updateRotationVector();
        }
    }
}

SpaceThree.prototype.cleanJoystickFlags = function()
{ 
    SpaceThree.self.moveState.up = 0; 
    SpaceThree.self.moveState.down = 0;

    SpaceThree.self.moveState.yawLeft = 0;
    SpaceThree.self.moveState.yawRight = 0;

    SpaceThree.self.moveState.forward = 0; 
    SpaceThree.self.moveState.back = 0;
}

SpaceThree.prototype.getWaitMouseUp = function()
{ 
    return this.waitMouseUp;
}

SpaceThree.prototype.implementGameLogic = function()
{ 
    var _meshCollection = this.editor.bluePlane.getMeshCollection();
    
    this.selectedObjects = this.calculateSelectedObjectsByMouse();

    this.updateThreeJSMeshes(_meshCollection);

    this.updateCametaWithFlyingValues();
}

SpaceThree.prototype.updateCametaWithFlyingValues = function()
{
    this.applyCameraTransformations(this.movementSpeed, this.rollSpeed);

    // If camera is outside limits, the wollback transformations.
    if (Helper.distance3D(this.cameraT.position.x, this.cameraT.position.y, this.cameraT.position.z, 0, 0, 0) > SpaceThree.MAX_ZOOM ||
        this.cameraT.position.y < 5)
    {
        this.applyCameraTransformations(this.movementSpeed * -1, this.rollSpeed * -1);
    }
}

SpaceThree.prototype.applyCameraTransformations = function(_moveMult, _rotMult)
{ 
    this.cameraT.translateX( this.moveVector.x * _moveMult );
    this.cameraT.translateY( this.moveVector.y * _moveMult );
    this.cameraT.translateZ( this.moveVector.z * _moveMult );

    this.tmpQuaternion.set( this.rotationVector.x * _rotMult, this.rotationVector.y * _rotMult, this.rotationVector.z * _rotMult, 1 ).normalize();
    this.cameraT.quaternion.multiply( this.tmpQuaternion );
}

SpaceThree.prototype.render = function()
{ 
    this.rendererT.render( this.sceneT, this.cameraT );
}

// BUSINESS LOGIC
SpaceThree.prototype.resetScene = function()
{
    if (typeof this.sceneT.getObjectById(this.mygroup.id) !== 'undefined')
    {
        Helper.clearArray(this.mygroup.children);
        this.sceneT.remove(this.mygroup); 
    }
        
    this.sceneT.add( this.mygroup );
}

SpaceThree.prototype.calculateSelectedObjectsByMouse = function()
{
    // update the picking ray with the camera and mouse position
    this.raycasterT.setFromCamera( this.mouse.mouseT, this.cameraT );
    
    // calculate objects intersecting the picking ray
    var intersects = this.raycasterT.intersectObjects( this.mygroup.children );

    return intersects;
}

SpaceThree.prototype.getSelectedObjectsByMouse = function()
{
    return this.selectedObjects;
}

// OPERATIONS OVER MESH COLLECTION
SpaceThree.prototype.addMeshToScene = function(_mesh)
{
    this.mygroup.add(_mesh);
}

SpaceThree.prototype.updateThreeJSMeshes = function(_meshCollection)
{ 
    var meshT = null; 

    for (var i = 0; i < _meshCollection.length; i++) 
    {
        if (_meshCollection[i].actionAdd === true)
        {
            this.addMeshToScene(this.createRenderData(_meshCollection[i]));
            _meshCollection[i].actionAdd = false;
        }

        meshT = this.findMeshTByUUID(_meshCollection[i].getUuid());
        if (meshT !== null)
        {
            if (_meshCollection[i].actionUpdate === true)
            {
                this.updateMeshTFromMesh(_meshCollection[i], meshT);

                _meshCollection[i].actionUpdate = false;
            }

            if (_meshCollection[i]._id > 1)
            {
                if (_meshCollection[i].actionBackgroundModeFlagChange === true)
                {
                    if ( _meshCollection[i].getBackgroundMode() === true)
                        meshT.material.opacity = _meshCollection[i].getAlpha() * 0.2;
                    else
                        meshT.material.opacity = _meshCollection[i].getAlpha();

                    _meshCollection[i].actionBackgroundModeFlagChange = false;
                }

                if (_meshCollection[i].actionSelectedFlagChange === true)
                {
                    if ( _meshCollection[i].getSelected() === true)
                    {
                        meshT.material.color.r = 1;
                        meshT.material.color.g = 1;
                        meshT.material.color.b = 1;
                    }
                    else
                    {
                        meshT.material.color.r = _meshCollection[i].meshColor.r / 255;
                        meshT.material.color.g = _meshCollection[i].meshColor.g / 255;
                        meshT.material.color.b = _meshCollection[i].meshColor.b / 255;
                    }

                    _meshCollection[i].actionSelectedFlagChange = false;
                }
            }
        }
    }
}

SpaceThree.prototype.updateMeshTFromMesh = function(_mesh, _meshT)
{
    _meshT.position.set(_mesh.getPosition().x, _mesh.getPosition().y, _mesh.getPosition().z * -1);

    _meshT.rotation.set(_mesh.getRotation().x, _mesh.getRotation().y, _mesh.getRotation().z, "XYZ" );

    _meshT.scale.set(_mesh.getScale().x, _mesh.getScale().y, _mesh.getScale().z); 
}

SpaceThree.prototype.findMeshTByUUID = function(_uuid)
{
    var meshTItem = null;
    for (var i = 0; i < this.mygroup.children.length; i++) 
    {
        if (_uuid === this.mygroup.children[i].uuid)
        {
            meshTItem = this.mygroup.children[i];
            break;
        }    
    }	

    return meshTItem;
}

SpaceThree.prototype.deleteMeshByUUID = function(_uuid)
{
    var meshTItem = null;
    for (var i = 0; i < this.mygroup.children.length; i++) 
    {
        if (_uuid === this.mygroup.children[i].uuid)
        {
            meshTItem = this.mygroup.children[i];

            meshTItem.geometry.dispose();
            meshTItem.material.dispose();

            this.mygroup.children.splice(i, 1);
            break;
        }    
    }
}

SpaceThree.prototype.createRenderData = function(_mesh)
{ 
    _mesh.actionAdd = false;
    _mesh.actionUpdate = false;
    _mesh.actionAlphaChange = false;

    // MATERIAL
    var shColor = Helper.st_rgbaToColor( _mesh.meshColor.r, _mesh.meshColor.g,  _mesh.meshColor.b);

    var mycube_material = null;

    var shColor = Helper.st_rgbaToColor( _mesh.meshColor.r, _mesh.meshColor.g,  _mesh.meshColor.b);
    mycube_material = new THREE.MeshPhongMaterial( { color: shColor, transparent: true, opacity: _mesh.alpha} );

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
    mycube_mesh.castShadow = true;
    //mycube_mesh.receiveShadow = true;

    // TRANSFORMATIONS
    this.updateMeshTFromMesh(_mesh, mycube_mesh);
    
    _mesh.setUuid(mycube_mesh.uuid);

    return mycube_mesh;
}

// DEPENDENCIES
SpaceThree.prototype.setEditor = function(_editor) 
{
    this.editor = _editor;
}

// LIGHTS
SpaceThree.prototype.addPointLight = function(_color, _intensity, _x, _y, _z, _distance, _castShadow) 
{
    var light = new THREE.PointLight(_color, _intensity);
    light.position.set(_x, _y, _x);
    light.distance = _distance;
    light.castShadow = _castShadow;
    this.sceneT.add(light);
}

// CAMERA
SpaceThree.prototype.rotateCameraPercent = function(_value) 
{
    this.inclinationCameraAngle = Math.floor(_value / 100 * 360);
    this.updateCameraPosition();
}

SpaceThree.prototype.rotateCameraPercentAzimuthAngle = function(_value) 
{
    var range = SpaceThree.MAX_AZIMUTH_ANGLE - SpaceThree.MIN_AZIMUTH_ANGLE;
    this.azimuthCameraAngle = Math.floor((100 - _value) / 100 * range) + SpaceThree.MIN_AZIMUTH_ANGLE;
    this.updateCameraPosition();
}

SpaceThree.prototype.rotateCamera = function(_angle) 
{
    this.inclinationCameraAngle = ((this.inclinationCameraAngle + _angle) % 360);
    this.updateCameraPosition();
}

SpaceThree.prototype.zoomCamera = function(_delta) 
{
    var newValue = this.cameraRadious + _delta;
    this.validateAndSetZoom(newValue);
}

SpaceThree.prototype.zoomCameraPercent = function(_value) 
{
    var range = SpaceThree.MAX_ZOOM - SpaceThree.MIN_ZOOM;
    var newValue =  Math.floor((100 - _value) / 100 * range) + SpaceThree.MIN_ZOOM;
    this.validateAndSetZoom(newValue);
}

SpaceThree.prototype.validateAndSetZoom = function(_value) 
{
    if (_value >= SpaceThree.MIN_ZOOM && _value <= SpaceThree.MAX_ZOOM)
    {
        this.cameraRadious = _value;
        this.updateCameraPosition();
    }
}

SpaceThree.prototype.updateCameraPosition = function() 
{
    var x = this.cameraRadious * Math.sin(Helper.graToRad(this.azimuthCameraAngle)) *  Math.cos(Helper.graToRad(this.inclinationCameraAngle));
    var y = this.cameraRadious * Math.cos(Helper.graToRad(this.azimuthCameraAngle));
    var z = this.cameraRadious * Math.sin(Helper.graToRad(this.azimuthCameraAngle)) *  Math.sin(Helper.graToRad(this.inclinationCameraAngle));

    this.setCamera(x, y, z);

    if (this.onCameraChangeHandler !== null)
        this.onCameraChangeHandler(this.inclinationCameraAngle, this.azimuthCameraAngle, this.cameraRadious);
}

SpaceThree.prototype.getCamera = function() 
{
    return this.cameraT;
}

SpaceThree.prototype.setCamera = function(_x, _y, _z) 
{
    this.cameraT.position.x = _x;
    this.cameraT.position.y = _y;
    this.cameraT.position.z = _z;
    this.cameraT.lookAt( 0, 0, 0 );
    this.cameraT.updateProjectionMatrix();
}

SpaceThree.prototype.onCameraChange = function(_callback)
{
    this.onCameraChangeHandler = _callback;
}

SpaceThree.prototype.startFlyingControl = function()
{
    if (this.lastRotation.x === 0 && this.lastRotation.y === 0 && this.lastRotation.z === 0)
    {
        this.cameraT.position.y = 10;
        this.cameraT.lookAt(  0,  this.cameraT.position.y,  0);
    }
    else
    {
        this.cameraT.position.x = this.lastPosition.x;
        this.cameraT.position.y = this.lastPosition.y;
        this.cameraT.position.z = this.lastPosition.z;

        this.cameraT.rotation.x = this.lastRotation.x;
        this.cameraT.rotation.y = this.lastRotation.y;
        this.cameraT.rotation.z = this.lastRotation.z;
    }
    
    this.cameraT.updateProjectionMatrix();
}

SpaceThree.prototype.cancelFlyingControl = function()
{
    //this.lastQuaternion.copy( this.cameraT.quaternion );
    this.lastPosition.copy( this.cameraT.position );
    this.lastRotation.copy( this.cameraT.rotation );

    this.updateCameraPosition();
}