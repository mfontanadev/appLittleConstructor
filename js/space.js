// --------------------------------------------------------------------
// All trigonometric calculation, this is THE 3D ENGINE. 
// Also has a couple of functions like Quick Reference Text and 
// mini Viewport to see camera and status.
//

Space.C_RENDER_MODE_WIREFRAME = 1;
Space.C_RENDER_MODE_TRIANGLE_FILL = 2;
Space.C_RENDER_MODE_PIXEL_FILL = 3;

Space.C_ILLUMINATOIN_MODE_SOLID = 1;      // solid colors with no light calculatoin.
Space.C_ILLUMINATOIN_MODE_LIGHT = 2;      // degree color using simple light calculatoin.

Space.C_PROJECTION_TYPE_ISOMETRIC = 1;     
Space.C_PROJECTION_TYPE_PERSPECTIVE = 2;

function Space() 
{
    this.accumulativeMatrix = this.createMatrixIdentity();
    this.worldMatrix = this.createMatrixIdentity();
    this.viewMatrix = this.createMatrixIdentity();
    this.projectionMatrix = this.createMatrixIdentity();
    this.screenMatrix = this.createMatrixIdentity();
    
    this.camera = new Vector(0, 0, 0);
    this.cameraYaw = 0;
    this.cameraXaw = 0;
    this.camera = new Vector(0, 0, 0);
    this.cameraZoom = 0;
    this.lightDirection = new Vector(0, 0, 0);
    this.lightDirection.normalize();

    this.tmpTriangleNormalVector = new Vector(0, 0, 0);

    this.normalVectorSize = 5;

    this.normalsVisible = false;
    this.linesVisible = false;
    this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;

    this.meshCollection = new Array();

    this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    this.cameraControlEnabled = false;
    this.ambientLightFactor = 0;    // 0 has no insidence, 1 full light.

    this.viewWidth = 800;
    this.viewHeight = 600;
    this.viewOffsetX = 0;
    this.viewOffsetY = 0;
}

Space.prototype.setViewSize = function(_width, _height) 
{
    this.viewWidth = _width;
    this.viewHeight = _height;
}

Space.prototype.setViewOffset = function(_offsetX, _offsetY) 
{
    this.viewOffsetX = _offsetX;
    this.viewOffsetY = _offsetY;
}

Space.prototype.setLight = function(_x, _y, _z) 
{
    this.lightDirection.x = _x;
    this.lightDirection.y = _y;
    this.lightDirection.z = _z;

    this.lightDirection.normalize();
}

Space.prototype.setCamera = function(_x, _y, _z) 
{
    this.camera.x = Math.round(_x);
    this.camera.y = Math.round(_y);
    this.camera.z = Math.round(_z);
}

Space.prototype.addCameraZoom = function(_value) 
{
    this.cameraZoom += _value;
}

Space.prototype.subCameraZoom = function(_value) 
{
    this.cameraZoom -= _value;
    if (this.cameraZoom <= 0)
        this.cameraZoom = 0.01;
}

Space.prototype.resetAccumulative = function() 
{
    this.accumulativeMatrix = this.createMatrixIdentity();
}

Space.prototype.setWorldMatrix = function(_matrix) 
{
    this.worldMatrix = _matrix;
}

Space.prototype.setViewMatrix = function(_matrix) 
{
    this.viewMatrix = _matrix;
}

Space.prototype.setProjectionMatrix = function(_matrix) 
{
    this.projectionMatrix = _matrix;
}

Space.prototype.setScreenMatrix = function(_matrix) 
{
    this.screenMatrix = _matrix;
}

Space.prototype.getCamera = function() 
{
    return this.camera;
}

Space.prototype.updateIsometricCamera = function(_xaw, _yaw)
{
    var zoom = this.getCamera().length() * -1;

    var positionVector = this.getLookAtVector();
    positionVector.mul(zoom);

    //this.getCamera().x = Math.round(positionVector.x);
    //this.getCamera().z = Math.round(positionVector.z);    
    this.setCamera(positionVector.x, positionVector.y , positionVector.z);

    //console.log(positionVector.x, positionVector.y, positionVector.z);
}

Space.prototype.multiplyToCurrent = function(m1) 
{
    this.accumulativeMatrix = this.matrixMultiply(this.accumulativeMatrix, m1);
}

Space.prototype.matrixMultiply = function(m1, m2) 
{
    var result = this.createMatrixIdentity();

    var width = m1[0].length;
    var height = m1.length;

    if (width != m2.length) {
        // error
    }

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var sum = 0;

            for (var z = 0; z < width; z++)
                sum += m1[y][z] * m2[z][x];
            

            result[y][x] = sum;
        }
    }

    return result;
}

Space.createMatrixIdentity = function () 
{
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

Space.prototype.createMatrixIdentity = function() 
{
    return Space.createMatrixIdentity();
}

Space.prototype.createScaleMatrix = function(x, y, z) 
{
    return [
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1]
    ];
}

Space.prototype.createTranslateMatrix = function(x, y, z) 
{
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [x, y, z, 1]
    ];
}

Space.prototype.createRotateXMatrix = function(x) 
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

Space.prototype.createRotateYMatrix = function(y) 
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

Space.prototype.createRotateZMatrix = function(z) 
{
        var cosZ = Math.cos(z);
        var sinZ = Math.sin(z);
        var rotZ = [
            [cosZ, -sinZ, 0, 0],
            [sinZ, cosZ, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        return rotZ;
}		

Space.prototype.createOrtograpich2ProjectionMatrix = function(width, height, fNear, fFar, _camera, _zoom)
{
    //var m = 100 / _camera.length();
    var m = _zoom;

    var returnMatrix = 
    [
        [2 / width * m, 	0, 				0, 											0],
        [0, 				2 / height * m, 0, 											0],
        [0, 				0, 				(2 / (fFar - fNear)) * m,					0],
        [0, 				0, 				-1 * ((fFar + fNear) / (fFar - fNear)),		1]
    ];

    return returnMatrix;
}

Space.prototype.createProjectionMatrix = function(fFovDegrees, fAspectRatio, fNear, fFar)
{
    var fFovRad = 1.0 / Math.tan(fFovDegrees * 0.5 / 180.0 * 3.14159);

    var returnMatrix = 
    [
        [fAspectRatio * fFovRad, 	0, 		 	0, 									0],
        [0, 						fFovRad, 	0, 									0],
        [0, 						0, 		 	fFar / (fFar - fNear), 				1],
        [0, 						0, 			(-fFar * fNear) / (fFar - fNear), 	0]
    ];
    /*
    returnMatrix[0][0] = fAspectRatio * fFovRad;
    returnMatrix[1][1] = fFovRad;
    returnMatrix[2][2] = fFar / (fFar - fNear);
    returnMatrix[3][2] = (-fFar * fNear) / (fFar - fNear);
    returnMatrix[2][3] = 1;
    returnMatrix[3][3] = 0;
*/
    return returnMatrix;
}

Space.prototype.createPointAtInverseMatrix = function(pos, _xaw, _yaw) 
{
    var matCamera = this.createPointAtMatrix(pos, _xaw, _yaw);
    return this.createQuickInverseMatrix(matCamera);
}

Space.prototype.getLookAtVector = function() 
{
    return this.getLookAtVectorAt(this.cameraXaw, this.cameraYaw);
}

Space.prototype.getLookAtVectorAt = function(_xaw, _yaw) 
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

Space.prototype.createPointAtMatrix = function(pos, _xaw, _yaw) 
{
    // Create "Point At" Matrix for camera
    var vUp = new Vector(0, 1, 0);
    var vTarget = new Vector(0, 0, 1);

    var vLookDir = this.getLookAtVectorAt(_xaw, _yaw);
    var vTarget = Vector.Add(this.getCamera(), vLookDir);

    return this.createPointAtBaseMatrix(pos, vTarget, vUp);
}

Space.prototype.createPointAtBaseMatrix = function(pos, target, up) 
{
    // Calculate new forward direction
    var newForward = Vector.Sub(target, pos);
    newForward.normalize();

    // Calculate new Up direction
    var a = Vector.Mul(newForward, up.dotProduct(newForward));
    var newUp = Vector.Sub(up, a);
    newUp.normalize();

    // New Right direction is easy, its just cross product
    var newRight = newUp.crossProduct(newForward);

    // Construct Dimensioning and Translation Matrix	
    var result = this.createMatrixIdentity();

    result[0][0] = newRight.x;	result[0][1] = newRight.y;	result[0][2] = newRight.z;	result[0][3] = 0.0;
    result[1][0] = newUp.x;		result[1][1] = newUp.y;		result[1][2] = newUp.z;		result[1][3] = 0.0;
    result[2][0] = newForward.x;result[2][1] = newForward.y;result[2][2] = newForward.z;result[2][3] = 0.0;
    result[3][0] = pos.x;		result[3][1] = pos.y;		result[3][2] = pos.z;		result[3][3] = 1.0;

    return result;
}

Space.prototype.createQuickInverseMatrix = function(_matrix) 
{
    var result = this.createMatrixIdentity();

    result[0][0] = _matrix[0][0]; result[0][1] = _matrix[1][0]; result[0][2] = _matrix[2][0]; result[0][3] = 0;
    result[1][0] = _matrix[0][1]; result[1][1] = _matrix[1][1]; result[1][2] = _matrix[2][1]; result[1][3] = 0;
    result[2][0] = _matrix[0][2]; result[2][1] = _matrix[1][2]; result[2][2] = _matrix[2][2]; result[2][3] = 0;

    result[3][0] = -(_matrix[3][0] * result[0][0] + _matrix[3][1] * result[1][0] + _matrix[3][2] * result[2][0]);
    result[3][1] = -(_matrix[3][0] * result[0][1] + _matrix[3][1] * result[1][1] + _matrix[3][2] * result[2][1]);
    result[3][2] = -(_matrix[3][0] * result[0][2] + _matrix[3][1] * result[1][2] + _matrix[3][2] * result[2][2]);
    result[3][3] = 1;

    return result;
}

Space.prototype.getGrayedColorFromLight = function(_light, _triNormal, _faceColor, _illuminationMode, _meshAlpha)
{
    var lightDotProduct = Math.min(1, _light.dotProduct(_triNormal));

    lightDotProduct = (lightDotProduct + this.ambientLightFactor);
    if (lightDotProduct > 1)
        lightDotProduct = 1;

    var red = Math.trunc(_faceColor.r * lightDotProduct);
    var green = Math.trunc(_faceColor.g * lightDotProduct);
    var blue = Math.trunc(_faceColor.b * lightDotProduct)
    var alpha = _faceColor.a * _meshAlpha;
    
    if (_illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
    {
        red = _faceColor.r;
        green = _faceColor.g;
        blue = _faceColor.b;
    }

    return {r: red, g: green, b: blue, a: alpha};
}

Space.prototype.update = function()
{ 
    var sceneTiranglesToRender = new Array();

    gEngine.startTime("process");

    // Precalculate general matrix. 
    this.resetAccumulative();
    this.multiplyToCurrent(this.createPointAtInverseMatrix(this.getCamera(), this.cameraXaw, this.cameraYaw));
    this.setViewMatrix(this.accumulativeMatrix);

    this.resetAccumulative();
    this.multiplyToCurrent(this.createScaleMatrix(1, -1, 1));

    if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
    {
        this.multiplyToCurrent(this.createProjectionMatrix(90, gEngine.aspectRatio, 0.01, 1000));
    }
    else
    {
        this.multiplyToCurrent(this.createOrtograpich2ProjectionMatrix(
            this.viewWidth, 
            this.viewHeight, 
            0.01, 
            1000, 
            this.getCamera(), 
            this.cameraZoom));
    }
    
    this.setProjectionMatrix(this.accumulativeMatrix);

    this.resetAccumulative();
    this.multiplyToCurrent(this.createTranslateMatrix(1, 1, 0));
    this.multiplyToCurrent(this.createScaleMatrix(0.5 * this.viewWidth, 0.5 * this.viewHeight, 1));
    this.setScreenMatrix(this.accumulativeMatrix);

    // Calculate render data for each mesh.
    var meshItem = null;
    for (var i = 0; i < this.getMeshCollection().length; i++) 
    {
        meshItem = this.getMeshCollection()[i];
        if (meshItem.hide === false)
        {
            meshItem.worldMatrix = this.createMatrixIdentity();
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createScaleMatrix(
                                                                                                meshItem.getScale().x, 
                                                                                                meshItem.getScale().y, 
                                                                                                meshItem.getScale().z));

            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createRotateXMatrix(meshItem.getRotation().x));
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createRotateYMatrix(meshItem.getRotation().y));
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createRotateZMatrix(meshItem.getRotation().z));
            meshItem.worldMatrix = this.matrixMultiply(meshItem.worldMatrix, this.createTranslateMatrix(
                meshItem.getPosition().x,
                meshItem.getPosition().y,
                meshItem.getPosition().z));

        this.createRenderData(meshItem, sceneTiranglesToRender);
        }    
}			

    // Global Z order sorting.
    gEngine.startTime("Sorting");
    this.zOrderSorting(sceneTiranglesToRender);						
    gEngine.addTimeDiff("Sorting");	

    gEngine.showTimeDiff("process");
    gEngine.showTimeDiff("dumpOri");	
    gEngine.showTimeDiff("World");	
    gEngine.showTimeDiff("Normal");	
    gEngine.showTimeDiff("Culling");	
    gEngine.showTimeDiff("Illumination");	
    gEngine.showTimeDiff("Camera");	
    gEngine.showTimeDiff("Clip z");	
    gEngine.showTimeDiff("Projection");	
    gEngine.showTimeDiff("Normalization");	
    gEngine.showTimeDiff("Clip borders");	
    gEngine.showTimeDiff("Z order opt");	
    gEngine.showTimeDiff("Sorting");	
    gEngine.showTimeDiff("Normals show");	

    this.render(sceneTiranglesToRender);
    
    if (gEngine.logTimes === true)
    {
        console.log("Count triangles:", sceneTiranglesToRender.length, "(mesh =", this.getMeshCollection().length, ")");
    }
}

Space.prototype.createRenderData = function(_mesh, _sceneTiranglesToRender)
{ 
    var trianglesCount = 0;

    if (_mesh === null || typeof _mesh === "undefined")
        return;

    JSGameEngine.chClearArray(_mesh.renderTris);

    gEngine.startTime("dumpOri");
    this.copyPointsAndSetTexture(_mesh);
    gEngine.addTimeDiff("dumpOri");	

    trianglesCount = _mesh.tris.length;

    // World Matrix Transform		
    this.worldMatrix = _mesh.worldMatrix;

    gEngine.startTime("World");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.tris, this.worldMatrix);
    gEngine.addTimeDiff("World");	

    // Calculate triangles Normal
    gEngine.startTime("Normal");
    _mesh.renderTris = this.calculateAndUpdateNormalVectorFromRenderPoints(_mesh.renderTris);						
    gEngine.addTimeDiff("Normal");	

    // Backface culling
    gEngine.startTime("Culling");
    _mesh.renderTris = this.backFaceCulling(_mesh.renderTris, this.getCamera());						
    gEngine.addTimeDiff("Culling");	

    // Illumination
    gEngine.startTime("Illumination");
    _mesh.renderTris = this.trianglesColorUsingLight(_mesh.renderTris, this.lightDirection, this.illuminationMode, _mesh.alpha);
    gEngine.addTimeDiff("Illumination");	

    // Camera: convert World Space --> View Space
    gEngine.startTime("Camera");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.renderTris, this.viewMatrix);
    gEngine.addTimeDiff("Camera");	

    // Clip camera plane
    gEngine.startTime("Clip z");
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris, new Vector(0, 0, 0.1), new Vector(0, 0, 1));
    gEngine.addTimeDiff("Clip z");	

    // Projection: convert 3D --> 2D
    gEngine.startTime("Projection");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.renderTris, this.projectionMatrix);
    gEngine.addTimeDiff("Projection");	

    // Manual normalization triangles.
    gEngine.startTime("Normalization");
    _mesh.renderTris = this.normalizePoints(_mesh.renderTris);						
    gEngine.addTimeDiff("Normalization");	

    // Screen: convert View Space --> Screen
    gEngine.startTime("Screen");
    _mesh.renderTris = this.applyMatrixFromRenderPoints(_mesh.renderTris, this.screenMatrix);
    gEngine.addTimeDiff("Screen");	

    // Clip camera screen borders
    // Right
    gEngine.startTime("Clip borders");
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(this.viewWidth - 1, 0, 0), new Vector(-1, 0, 0));
    // Top
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(0, this.viewHeight - 1, 0), new Vector(0, -1, 0));
    // Left
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(0, 0, 0), new Vector(1, 0, 0));
    // Button
    _mesh.renderTris = this.clipAgainstPlane(_mesh.renderTris,  new Vector(0, 0, 0), new Vector(0, 1, 0));
    gEngine.addTimeDiff("Clip borders");	

    // Normal proyection to show in render
    gEngine.startTime("Normals show");
    _mesh.renderTris = this.normalProjection(_mesh.renderTris);						
    gEngine.addTimeDiff("Normals show");	

    // Optimization to depth sorting.
    gEngine.startTime("Z order opt");
    _mesh.renderTris = this.zOrderCalculation(_mesh.renderTris);						
    gEngine.addTimeDiff("Z order opt");	

    // Optimization to depth sorting.
    gEngine.startTime("Offset");
    _mesh.renderTris = this.offset(_mesh.renderTris, this.viewOffsetX, this.viewOffsetY);						
    gEngine.addTimeDiff("Offset");	
        
    // Add triangles to one huge array to perform global sorting.
    for (var is = 0; is < _mesh.renderTris.length; is++) 
        _sceneTiranglesToRender.push(_mesh.renderTris[is]);

    //console.log("Triangles start, end: ", trianglesCount, ", ", _mesh.renderTris.length);
}

Space.prototype.render = function(_sceneTiranglesToRender)
{ 
    gEngine.startTime("draw");
    this.drawTriangles(_sceneTiranglesToRender);
    gEngine.showTimeDiff("draw");	
}

// Copy triangle points data to avoid lost them in matrix calculatoins.
Space.prototype.copyPointsAndSetTexture = function(_mesh)
{ 
    var triItem = null;

    for (var i = 0; i < _mesh.tris.length; i++) 
    {
        triItem = _mesh.tris[i];

        // Dump points values.
         triItem.pointsRender[0].x =  triItem.p[0].x;
         triItem.pointsRender[0].y =  triItem.p[0].y;
         triItem.pointsRender[0].z =  triItem.p[0].z;
         triItem.pointsRender[0].w =  triItem.p[0].w;

         triItem.pointsRender[1].x =  triItem.p[1].x;
         triItem.pointsRender[1].y =  triItem.p[1].y;
         triItem.pointsRender[1].z =  triItem.p[1].z;
         triItem.pointsRender[1].w =  triItem.p[1].w;

         triItem.pointsRender[2].x =  triItem.p[2].x;
         triItem.pointsRender[2].y =  triItem.p[2].y;
         triItem.pointsRender[2].z =  triItem.p[2].z;
         triItem.pointsRender[2].w =  triItem.p[2].w;

        // Dump texture values.
         triItem.tRender[0].u =  triItem.t[0].u;
         triItem.tRender[0].v =  triItem.t[0].v;
         triItem.tRender[0].w =  triItem.t[0].w;

         triItem.tRender[1].u =  triItem.t[1].u;
         triItem.tRender[1].v =  triItem.t[1].v;
         triItem.tRender[1].w =  triItem.t[1].w;

         triItem.tRender[2].u =  triItem.t[2].u;
         triItem.tRender[2].v =  triItem.t[2].v;
         triItem.tRender[2].w =  triItem.t[2].w;

         if (triItem.useTexture === false)
             triItem.imgDataTexture = null;				
         else
             triItem.imgDataTexture = _mesh.imgDataTexture;				

    }

    return _mesh.tris;
}

Space.prototype.calculateAndUpdateNormalVectorFromRenderPoints = function(_arrayTriangles)
 { 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];
        triItem.calculateAndUpdateNormalVectorFromRenderPoints();
        result.push(triItem);
    }

    return result;
}

Space.prototype.backFaceCulling = function(_arrayTriangles, _cameraVector)
{ 
    var result = new Array();
    var triItem = null;
    var vCameraRay = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        vCameraRay = Vector.Sub(triItem.pointsRender[0], _cameraVector)
        if (triItem.isABackfacedTriangle(triItem.normalVector, vCameraRay) === true)
        {
            result.push(triItem);
        }
    }

    return result;
}

Space.prototype.trianglesColorUsingLight = function(_arrayTriangles, _lightDirection, _illuminationMode, _meshAlpha)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        triItem.faceColorRenderRGBA = this.getGrayedColorFromLight(this.lightDirection, triItem.normalVector, triItem.faceColor, _illuminationMode, _meshAlpha);
        triItem.faceColorRender =  gEngine.rgbaToColor(
            triItem.faceColorRenderRGBA.r, 
            triItem.faceColorRenderRGBA.g, 
            triItem.faceColorRenderRGBA.b, 
            triItem.faceColorRenderRGBA.a);

        result.push(triItem);
    }

    return result;
}

Space.prototype.normalizePoints = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        // Do normalising manually. 
        triItem.pointsRender[0].div(triItem.pointsRender[0].w);
        triItem.pointsRender[1].div(triItem.pointsRender[1].w);
        triItem.pointsRender[2].div(triItem.pointsRender[2].w);

        triItem.tRender[0].div(triItem.pointsRender[0].w);
        triItem.tRender[1].div(triItem.pointsRender[1].w);
        triItem.tRender[2].div(triItem.pointsRender[2].w);

        result.push(triItem);
    }

    return result;
}

Space.prototype.clipAgainstPlane = function(_arrayTriangles, plane_p, plane_n)
{ 
    var result = new Array();
    var triItem = null;
    var nClippedTriangles = 0;
    var clipped = [new Triangle(), new Triangle()];
    var newTriangle = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        newTriangle = Vector.Triangle_ClipAgainstPlane(plane_p, plane_n, triItem); 

        if (newTriangle !== 0)
        {
            result.push(triItem);

            if (newTriangle !== null)
                result.push(newTriangle);
        }
    }

    return result;
}

Space.prototype.applyMatrixFromRenderPoints = function(_arrayTriangles, _matrix)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        // World Matrix Transform				
        triItem.applyMatrixFromRenderPoints(_matrix);

        result.push(triItem);
    }

    return result;
}

Space.prototype.zOrderCalculation = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        triItem.zAverage = (triItem.pointsRender[0].z + triItem.pointsRender[1].z + triItem.pointsRender[2].z) / 3; 

        result.push(triItem);
    }

    return result;
}

Space.prototype.zOrderSorting = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;

    _arrayTriangles.sort
    (
        function (_t1, _t2) 
        {
            var result = 0;
            if (_t1.zOrder !== _t2.zOrder)
                result = (_t1.zOrder - _t2.zOrder);
            else
                result = (_t2.zAverage - _t1.zAverage);

            return result;
        }
    );

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];
        result.push(triItem);
    }

    return result;
}

Space.prototype.offset = function(_arrayTriangles, _offsetX, _offsetY)
{ 
    var result = new Array();
    var triItem = null;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        triItem.pointsRender[0].x += this.viewOffsetX;
        triItem.pointsRender[0].y += this.viewOffsetY;
        triItem.pointsRender[1].x += this.viewOffsetX;
        triItem.pointsRender[1].y += this.viewOffsetY;
        triItem.pointsRender[2].x += this.viewOffsetX;
        triItem.pointsRender[2].y += this.viewOffsetY;

        result.push(triItem);
    }

    return result;
}

Space.prototype.normalProjection = function(_arrayTriangles)
{ 
    var result = new Array();
    var triItem = null;
    var cx = 0;
    var cy = 0;

    for (var i = 0; i < _arrayTriangles.length; i++) 
    {
        triItem = _arrayTriangles[i];

        if (triItem.getNormalVisible() === true)
        {
            triItem.normalRenderVectorO.set
            (
                (triItem.p[0].x + triItem.p[1].x + triItem.p[2].x) / 3, 
                (triItem.p[0].y + triItem.p[1].y + triItem.p[2].y) / 3,
                (triItem.p[0].z + triItem.p[1].z + triItem.p[2].z) / 3
            );
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.worldMatrix);

            triItem.normalRenderVectorT.clone(triItem.normalVector);
            triItem.normalRenderVectorT.mul(this.normalVectorSize);
            triItem.normalRenderVectorT.add(triItem.normalRenderVectorO);

            // Camera: convert World Space --> View Space
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.viewMatrix);
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorT, this.viewMatrix);

            // 3D to 2D		
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.projectionMatrix);
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorT, this.projectionMatrix);

            // Normalize
            triItem.normalRenderVectorO.div(triItem.normalRenderVectorO.w);
            triItem.normalRenderVectorT.div(triItem.normalRenderVectorT.w);

            // Screen
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorO, this.screenMatrix);
            Space.multiplyMatrixVectorOver(triItem.normalRenderVectorT, this.screenMatrix);
        }
        result.push(triItem);
    }

    return result;
}

Space.prototype.clipTriangles = function(_triangles)
{ 
    // Some stolen comments from @Javidx9
    // Clip triangles against all four screen edges, this could yield
    // a bunch of triangles, so create a queue that we traverse to 
    //  ensure we only test new triangles generated against planes
    var listTriangles = new Array();
    var clipped = [new Triangle(), new Triangle()];
    var triClipped = null;
    var triangleItem = null;
    var nTrisToAdd = 0;
    var nNegativeTris = 0;

    // Loop through all transformed, viewed, projected, and sorted triangles
    for (var i = 0; i < _triangles.length; i++) 
    {
        triangleItem = _triangles[i];

        nNegativeTris = 0;
        for (var p = 0; p < 4; p++)
        {
            nTrisToAdd = 0;

            switch (p)
            {
                // screen right
                case 0:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(this.viewWidth - 1, 0, 0), new Vector(-1, 0, 0), triangleItem, clipped[0], clipped[1]); 
                break;

                // screen top
                case 1:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(0, this.viewHeight - 1, 0), new Vector(0, -1, 0), triangleItem, clipped[0], clipped[1]); 
                break;
                
                // screen left
                case 2:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(0, 0, 0), new Vector(1, 0, 0), triangleItem, clipped[0], clipped[1]); 
                break;

                // screen bottom
                case 3:	
                    nTrisToAdd = Vector.Triangle_ClipAgainstPlane(new Vector(0, 0, 0), new Vector(0, 1, 0), triangleItem, clipped[0], clipped[1]); 
                break;
            }

            if (nTrisToAdd === -1)
            {
                nNegativeTris++;
            }
            else
            {
                // Clipping may yield a variable number of triangles, so
                // add these new ones to the back of the queue for subsequent
                // clipping against next planes
                for (var w = 0; w < nTrisToAdd; w++)
                {
                    triClipped = new Triangle();
                    triClipped.clone(clipped[w]);
                    listTriangles.push(triClipped);
                }
            }
        }

        if (nNegativeTris === 4)
        {
            //triClipped = new Triangle();
            //triClipped.clone(clipped[0]);
            listTriangles.push(triangleItem);
        }
    }

    return listTriangles;
}

Space.prototype.drawTriangles = function(_listTriangles)
{ 
    var step = 1;
    if (_listTriangles.length > 1000)
        step = Math.round(_listTriangles.length / 1000);
    
    var p0 = null;
    var p1 = null;
    var p2 = null;
    var t = null;
    var normO = null;
    var normT = null;

    //gEngine.clearBuffer();

    for (var i = 0; i < _listTriangles.length; i++) 
    {
        p0 = _listTriangles[i].pointsRender[0];
        p1 = _listTriangles[i].pointsRender[1];
        p2 = _listTriangles[i].pointsRender[2];
        t0 = _listTriangles[i].tRender[0];
        t1 = _listTriangles[i].tRender[1];
        t2 = _listTriangles[i].tRender[2];
        
        normO = _listTriangles[i].normalRenderVectorO;
        normT = _listTriangles[i].normalRenderVectorT;
        sprTex1 = null;

        if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        {
            gEngine.drawTriangle(	p0.x, p0.y, p1.x, p1.y, p2.x, p2.y,	JSGameEngine.PIXEL_SOLID, _listTriangles[i].faceColorRender);
        }
        else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL || 
                 this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
        {
            if (_listTriangles[i].imgDataTexture !== null)
            {
                gEngine.texturedTriangle(p0.x, p0.y, t0.u, t0.v, t0.w,
                                      p1.x, p1.y, t1.u, t1.v, t1.w,
                                      p2.x, p2.y, t2.u, t2.v, t2.w, _listTriangles[i].imgDataTexture);
            }
            else
            {
                if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
                    gEngine.fillTriangle(	p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, JSGameEngine.PIXEL_SOLID, _listTriangles[i].faceColorRender);
                else
                    gEngine.fillTriangleCustom(	p0.x, p0.y, p0.w, p1.x, p1.y, p1.w, p2.x, p2.y, p2.w, _listTriangles[i].faceColorRenderRGBA);
            }
            
            if (this.linesVisible === true)
                gEngine.drawTriangle(	p0.x, p0.y, p1.x, p1.y, p2.x, p2.y,	JSGameEngine.PIXEL_SOLID, "gray");
        }
    }

    if (this.normalsVisible === true)
    {

        for (var i = 0; i < _listTriangles.length; i++) 
        {
            p0 = _listTriangles[i].pointsRender[0];
            p1 = _listTriangles[i].pointsRender[1];
            p2 = _listTriangles[i].pointsRender[2];
            t0 = _listTriangles[i].tRender[0];
            t1 = _listTriangles[i].tRender[1];
            t2 = _listTriangles[i].tRender[2];
            
            normO = _listTriangles[i].normalRenderVectorO;
            normT = _listTriangles[i].normalRenderVectorT;
            sprTex1 = null;

            if (_listTriangles[i].getNormalVisible() === true)
            {
                gEngine.renderLine(normO.x, normO.y, normT.x, normT.y, 2, "green");
            }
        }
    }
}

Space.prototype.renderLookAt = function(_space, _currentLayer)
{ 
    var vCamera = _space.getCamera();
    var vLookDir = _space.getLookAtVector();
    var rotX = this.getMeshCollection()[0].getRotation().x;
    var rotY = this.getMeshCollection()[0].getRotation().y;
    var rotZ = this.getMeshCollection()[0].getRotation().z;

    // Viewport
    var rectSize = 100;
    var r = {   x1: this.viewWidth - rectSize + this.viewOffsetX,
        y1: 0 + this.viewOffsetY, 
        x2: this.viewWidth + this.viewOffsetX , 
        y2: rectSize + this.viewOffsetY};
    
    var rmx = r.x1 + rectSize / 2;
    var rmy = r.y1 + rectSize / 2;

    gEngine.renderRectangle(r.x1, r.y1, rectSize, rectSize, 1, "green");
    gEngine.renderLine(rmx, r.y1, rmx, r.y1 + rectSize, 1, "green");
    gEngine.renderLine(r.x1, rmy, r.x1 + rectSize, rmy, 1, "green");

    // Camera position			
    var cameraPosText = "C Pos: " + Math.round(vCamera.x) + "," + Math.round(vCamera.y) + "," + Math.round(vCamera.z) + "";
    gEngine.renderText(r.x1, r.y1 + rectSize + 10, cameraPosText, "green");

    // Camera angles			
    var cameraRotText = "C Ang: " + Math.round(JSGameEngine.radToGra (_space.cameraXaw)) + "," + 
    Math.round(JSGameEngine.radToGra (_space.cameraYaw)) + "," + (_space.cameraZoom).toFixed(2);
    gEngine.renderText(r.x1, r.y1 + rectSize + 20, cameraRotText, "green");

    // Rotation values			
    var cameraPosText = "Rot sel: " + Math.round(JSGameEngine.radToGra (rotX)) + "," + Math.round(JSGameEngine.radToGra (rotY)) + "," + Math.round(JSGameEngine.radToGra (rotZ)) + "";
    gEngine.renderText(r.x1, r.y1 + rectSize + 30, cameraPosText, "green");

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
    if (this.projectionType === true)
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

Space.prototype.renderInfo = function(_space)
{ 
    gEngine.setFontSize(12);

    var initialRow = gEngine.getRowNumberGivenYPosition(this.viewOffsetY);
    var initialCol = gEngine.getColNumberGivenXPosition(this.viewWidth - (gEngine.getFontSize() * 15));

    gEngine.locateText(initialCol, initialRow,      "Press H for HELP.");
    gEngine.locateText(initialCol, initialRow + 1,  "Press U for fun.");
    gEngine.locateText(initialCol, initialRow + 3,  "1- SMALL PILAR");
    gEngine.locateText(initialCol, initialRow + 4,  "2- RAILING ");
    gEngine.locateText(initialCol, initialRow + 5,  "3- SOCLE ");
    gEngine.locateText(initialCol, initialRow + 6,  "4- WINDOW");
    gEngine.locateText(initialCol, initialRow + 7,  "5- DOOR");
    gEngine.locateText(initialCol, initialRow + 8,  "6- MEDIUM PILAR");
    gEngine.locateText(initialCol, initialRow + 9,  "7- TALL PILAR");
    gEngine.locateText(initialCol, initialRow + 10, "8- FLOOR");
    gEngine.locateText(initialCol, initialRow + 11, "9- CABRIADA (SHF)");
    gEngine.locateText(initialCol, initialRow + 12, "0- ROOF (SHF)");
    
    gEngine.setFontSize(9);
}

Space.prototype.getMeshCollection = function()
{ 
    return this.meshCollection;
}

Space.prototype.setMeshCollection = function(_meshCollection)
{ 
    this.meshCollection = _meshCollection;
}

Space.prototype.removePiece = function(_pieceId) 
{
    var removeIndex = -1;
    for (let index = 0; index < this.meshCollection.length; index++) 
    {
        const element = this.meshCollection[index];
        if (element.getId() === _pieceId)
            removeIndex = index; 
    }

    if (removeIndex !== -1)
        this.meshCollection.splice(removeIndex, 1);
}

Space.prototype.changeRenderMode = function() 
{
    if (this.renderMode === Space.C_RENDER_MODE_WIREFRAME)
        this.renderMode = Space.C_RENDER_MODE_TRIANGLE_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_TRIANGLE_FILL)
        this.renderMode = Space.C_RENDER_MODE_PIXEL_FILL;
    else if (this.renderMode === Space.C_RENDER_MODE_PIXEL_FILL)
        this.renderMode = Space.C_RENDER_MODE_WIREFRAME;
}

Space.prototype.changeProjectionType = function() 
{
    if (this.projectionType === Space.C_PROJECTION_TYPE_ISOMETRIC)
        this.projectionType = Space.C_PROJECTION_TYPE_PERSPECTIVE;
    else if (this.projectionType === Space.C_PROJECTION_TYPE_PERSPECTIVE)
        this.projectionType = Space.C_PROJECTION_TYPE_ISOMETRIC;
}

Space.prototype.changeIlluminationMode = function() 
{
    if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_LIGHT)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_SOLID;
    else if (this.illuminationMode === Space.C_ILLUMINATOIN_MODE_SOLID)
        this.illuminationMode = Space.C_ILLUMINATOIN_MODE_LIGHT;
}

Space.prototype.changeNormalVisibility = function() 
{
    this.normalsVisible = !this.normalsVisible;
}

Space.multiplyMatrixVector = function(inVector, outVector, matrix) 
{
    outVector.x = inVector.x * matrix[0][0] + inVector.y * matrix[1][0] + inVector.z * matrix[2][0] + matrix[3][0];
    outVector.y = inVector.x * matrix[0][1] + inVector.y * matrix[1][1] + inVector.z * matrix[2][1] + matrix[3][1];
    outVector.z = inVector.x * matrix[0][2] + inVector.y * matrix[1][2] + inVector.z * matrix[2][2] + matrix[3][2];
    outVector.w = inVector.x * matrix[0][3] + inVector.y * matrix[1][3] + inVector.z * matrix[2][3] + matrix[3][3];
}

Space.multiplyMatrixVectorOver = function(inVector, matrix) 
{
    var x, y, z, w;

    x = inVector.x * matrix[0][0] + inVector.y * matrix[1][0] + inVector.z * matrix[2][0] + matrix[3][0];
    y = inVector.x * matrix[0][1] + inVector.y * matrix[1][1] + inVector.z * matrix[2][1] + matrix[3][1];
    z = inVector.x * matrix[0][2] + inVector.y * matrix[1][2] + inVector.z * matrix[2][2] + matrix[3][2];
    w = inVector.x * matrix[0][3] + inVector.y * matrix[1][3] + inVector.z * matrix[2][3] + matrix[3][3];

    inVector.x = x;
    inVector.y = y;
    inVector.z = z;
    inVector.w = w;
}

