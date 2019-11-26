// --------------------------------------------------------------------
// This class stores vertex data used by render engine.
// Has some usefull functions to load data from a files.
// Also stores rotation. position, scale used to place
// mesh in world coordinates.
//

function Mesh() 
{
    this._id = -1;
    this.tris = new Array();
    this.VectorMin = new Vector(0, 0, 0);
    this.VectorMax = new Vector(0, 0, 0);			
    this.VectorCenter = new Vector(0, 0, 0);
    this.meshData = "";
    this.fileName = "";
    this.renderTris = new Array();

    this.position = new Vector(0, 0, 0);
    this.rotation = new Vector(0, 0, 0);
    this.scale = new Vector(1, 1, 1);
    this.worldMatrix = Space.createMatrixIdentity();
    this.imgTexture = new Image();
    this.imgDataTexture = null;
    this.alpha = 1;
    this.hide = false;
}

Mesh.prototype.getId = function() 
{
    return this._id;
}

Mesh.prototype.setId = function(_value) 
{
    this._id = _value;
}

Mesh.prototype.createMeshFromData = function(_callback, _center) 
{
    var allText = _callback();
    this.meshData = allText; 
    this.generateMeshFromFileData(allText);
    
    if (_center === true)
    {
        this.updateCenter();
        this.center();
    }
}

Mesh.prototype.loadMeshFromFile = function(_fileName, _callback, _center) 
{
    if (C_MOCK_MODE === true)
    {
        this.loadMeshFromFileMock(_fileName, _callback, _center);
    }
    else
    {
        this.loadMeshFromFileServer(_fileName, _callback, _center);
    }
}

Mesh.prototype.loadMeshFromFileMock = function(_fileName, _callback, _center) 
{
    this.fileName = _fileName.toLowerCase();

    if (mockedObj.has(this.fileName) === true)
    {
        var responseText = mockedObj.get(this.fileName);
        responseText = responseText.replace(/&lf;/g, "\n");
        this.generateMeshFromFileData(responseText);
        
        if (_callback !== null)
            _callback(this, true, _center);		            
    }
}

Mesh.prototype.loadMeshFromFileServer = function(_fileName, _callback, _center) 
{
    var thisClass = this;
    this.fileName = _fileName;

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
                thisClass.generateMeshFromFileData(rawFile.responseText);
                loadedOk = true;
            }
        }

        if (_callback !== null)
            _callback(thisClass, loadedOk, _center);		        
    }
    rawFile.send(null);
}

Mesh.prototype.generateMeshFromFileData = function(_meshData) 
{
    this.meshData = _meshData; 

    var cacheColorVertexes = new Array();
    var cacheVertexes = new Array();
    var cacheVertexTextures = new Array();
    var splitted = _meshData.split("\n");

    for (var i = 0; i < splitted.length - 1; i++) 
    {
           if (splitted[i].substring(0,2) == "v ")
           {
               var splittedRow = splitted[i].split(" ");
               
               var vector = new Vector(
                       parseFloat(splittedRow[1]), 
                       parseFloat(splittedRow[2]), 
                       parseFloat(splittedRow[3]), 
                       1);

               cacheVertexes.push(vector);

               var vertexColor = new Vector(0, 0, 0, 0);
               if (splittedRow.length > 4)
               {
                   vertexColor.colored = true;
                   vertexColor.x = parseFloat(splittedRow[4]);
                   vertexColor.y = parseFloat(splittedRow[5]);
                   vertexColor.z = parseFloat(splittedRow[6]);
                   vertexColor.w = 1;
               }

               if (splittedRow.length >= 8)
                    vertexColor.w = parseFloat(splittedRow[7]) / 255;

               cacheColorVertexes.push(vertexColor);
           }

           if (splitted[i].substring(0,3) == "vt ")
           {
               var splittedRow = splitted[i].split(" ");
               var vector = new Vector(
                   parseFloat(splittedRow[1]), 
                   parseFloat(splittedRow[2]), 
                   0, 
                   0);
               cacheVertexTextures.push(vector);
           }

           if (splitted[i].substring(0,2) == "f ")
           {
               var splittedFace = splitted[i].split(" ");
               var v = 0;
               var vt = 0;

               // Mesh with texture data.
               if (splittedFace[1].split("/").length > 1)
               {
                   v1 = splittedFace[1].split("/")[0];
                   vt1 = splittedFace[1].split("/")[1];
                   v2 = splittedFace[2].split("/")[0];
                   vt2 = splittedFace[2].split("/")[1];
                   v3 = splittedFace[3].split("/")[0];
                   vt3 = splittedFace[3].split("/")[1];

                   var tri = this.createNewTriangleWithPoints(cacheVertexes[parseFloat(v1) - 1],  
                                                              cacheVertexes[parseFloat(v2) - 1], 
                                                              cacheVertexes[parseFloat(v3) - 1]);

                   tri.setTexture( new Vector2D(	cacheVertexTextures[parseFloat(vt1) - 1].x, 
                                                   cacheVertexTextures[parseFloat(vt1) - 1].y, 
                                                1),

                                   new Vector2D(	cacheVertexTextures[parseFloat(vt2) - 1].x, 
                                                   cacheVertexTextures[parseFloat(vt2) - 1].y, 
                                                1),

                                   new Vector2D(	cacheVertexTextures[parseFloat(vt3) - 1].x, 
                                                   cacheVertexTextures[parseFloat(vt3) - 1].y,
                                                1));
                   tri.useTexture = true;
               }
               else
               {
                   var tri = this.createNewTriangleWithPoints(cacheVertexes[parseFloat(splittedFace[1]) - 1],  
                                                              cacheVertexes[parseFloat(splittedFace[2]) - 1], 
                                                              cacheVertexes[parseFloat(splittedFace[3]) - 1]);

                   var vertexColor = cacheColorVertexes[parseFloat(splittedFace[1]) - 1];
                   if (vertexColor !== null && vertexColor.colored === true)
                   {
                       tri.faceColor.r = vertexColor.x;
                       tri.faceColor.g = vertexColor.y;
                       tri.faceColor.b = vertexColor.z;
                       tri.faceColor.a = vertexColor.w;
                   }
               }

               this.addTriangle(tri);
           }
    }   

    console.log("generateMeshFromFileData ",this.fileName, ", triangles count:", this.tris.length);			
}

Mesh.prototype.color = function(_r, _g, _b, _a) 
{
    this.tris.forEach(element => {
        element.faceColor.r = _r;
        element.faceColor.g = _g;
        element.faceColor.b = _b;
        element.faceColor.a = _a;
    });
}


Mesh.prototype.addTriangle = function(triangle) 
{
    this.tris.push(triangle);
}

Mesh.prototype.createNewTriangleWithPointsValues = function(x1, y1, z1, x2, y2, z2, x3, y3, z3) 
{
    var v1 = new Vector(x1, y1, z1);
    var v2 = new Vector(x2, y2, z2);
    var v3 = new Vector(x3, y3, z3);

    var tri = new Triangle();
    tri.set(v1, v2, v3);

    return tri;
}

Mesh.prototype.createNewTriangleWithPoints = function(_v1, _v2, _v3) 
{
    return this.createNewTriangleWithPointsValues(_v1.x, _v1.y, _v1.z, _v2.x, _v2.y, _v2.z, _v3.x, _v3.y, _v3.z);
}

Mesh.prototype.updateCenter = function()
{
    var tri = null;

    for (var i = 0; i < this.tris.length; i++) 
    {
        tri = this.tris[i];

        if (i === 0)
        {
            this.VectorMin.x = tri.p[0].x;
            this.VectorMin.y = tri.p[0].y;
            this.VectorMin.z = tri.p[0].z;
            this.VectorMax.x = tri.p[0].x;
            this.VectorMax.y = tri.p[0].y;
            this.VectorMax.z = tri.p[0].z;
        }

        for (var ip = 0; ip < 3; ip++) 
        {
            if (tri.p[ip].x <= this.VectorMin.x) this.VectorMin.x = tri.p[ip].x;
            if (tri.p[ip].y <= this.VectorMin.y) this.VectorMin.y = tri.p[ip].y;
            if (tri.p[ip].z <= this.VectorMin.z) this.VectorMin.z = tri.p[ip].z;

            if (tri.p[ip].x >= this.VectorMax.x) this.VectorMax.x = tri.p[ip].x;
            if (tri.p[ip].y >= this.VectorMax.y) this.VectorMax.y = tri.p[ip].y;
            if (tri.p[ip].z >= this.VectorMax.z) this.VectorMax.z = tri.p[ip].z;
        }
    }			

    this.VectorCenter.x = (this.VectorMin.x * -1) - this.getHalfX();
    this.VectorCenter.y = (this.VectorMin.y * -1) - this.getHalfY();
    this.VectorCenter.z = (this.VectorMin.z * -1) - this.getHalfZ();
}		

Mesh.prototype.getHalfX = function()
{
    return ((this.VectorMax.x - this.VectorMin.x) / 2);
}

Mesh.prototype.getHalfY = function()
{
    return ((this.VectorMax.y - this.VectorMin.y) / 2);
}

Mesh.prototype.getHalfZ = function()
{
    return ((this.VectorMax.z - this.VectorMin.z) / 2);
}

Mesh.prototype.move = function(_x, _y, _z)
{
    var tri = null;

    for (var i = 0; i < this.tris.length; i++) 
    {
        tri = this.tris[i];

        for (var ip = 0; ip < 3; ip++) 
        {
            tri.p[ip].x += _x;
            tri.p[ip].y += _y;
            tri.p[ip].z += _z;
        }
    }			
}		

Mesh.prototype.center = function()
{
    var tri = null;

    for (var i = 0; i < this.tris.length; i++) 
    {
        tri = this.tris[i];

        for (var ip = 0; ip < 3; ip++) 
        {
            tri.p[ip].x += this.VectorCenter.x;
            tri.p[ip].y += this.VectorCenter.y;
            tri.p[ip].z += this.VectorCenter.z;
        }
    }			
}		

Mesh.prototype.addMeshAt = function(_mesh, _x, _y, _z)
{
    var tri = null;

    for (var i = 0; i < _mesh.tris.length; i++) 
    {
        tri = new Triangle();
        tri.p[0].clone(_mesh.tris[i].p[0]);
        tri.p[1].clone(_mesh.tris[i].p[1]);
        tri.p[2].clone(_mesh.tris[i].p[2]);

        for (var ip = 0; ip < 3; ip++) 
        {
            tri.p[ip].x += _x * 1.5;
            tri.p[ip].y += _y * 1.5;
            tri.p[ip].z += _z * 1.5;
        }

        this.createNewTriangleWithPoints(tri.p[0], tri.p[1], tri.p[2]);
    }			
}		

Mesh.prototype.setPosition = function(_x, _y, _z) 
{
    this.position.x = _x;
    this.position.y = _y;
    this.position.z = _z;
}

Mesh.prototype.setPositionX = function(_x) 
{
    this.position.x = _x;
}

Mesh.prototype.setPositionY = function(_y) 
{
    this.position.y = _y;
}

Mesh.prototype.setPositionZ = function(_z) 
{
    this.position.z = _z;
}

Mesh.prototype.getPosition = function() 
{
    return this.position;
}

Mesh.prototype.setAngleX = function(_value) 
{
    this.rotation.x = _value;
}

Mesh.prototype.setAngleY = function(_value) 
{
    this.rotation.y = _value;
}

Mesh.prototype.setAngleZ = function(_value) 
{
    this.rotation.z = _value;
}

Mesh.prototype.addAngleX = function(_value) 
{
    this.rotation.x += _value;
}

Mesh.prototype.addAngleY = function(_value) 
{
    this.rotation.y += _value;
}

Mesh.prototype.addAngleZ = function(_value) 
{
    this.rotation.z += _value;
}

Mesh.prototype.getRotation = function() 
{
    return this.rotation;
}

Mesh.prototype.setScale = function(_x, _y, _z) 
{
    this.setScaleX(_x);
    this.setScaleY(_y);
    this.setScaleZ(_z);
}

Mesh.prototype.setScaleX = function(_value) 
{
    this.scale.x = _value;
}

Mesh.prototype.setScaleY = function(_value) 
{
    this.scale.y = _value;
}

Mesh.prototype.setScaleZ = function(_value) 
{
    this.scale.z = _value;
}

Mesh.prototype.getScale = function() 
{
    return this.scale;
}

Mesh.prototype.loadTexture = function(_url) 
{
    var _this = this;
    this.imgTexture.onload = function () 
    {
        if (_this.imgTexture != null)
        {
            //var srcNameSplit = _this.imgTexture.src.split("/");
            //var imageName = (srcNameSplit[srcNameSplit.length - 1]).split(".")[0];
            var imgWidth = _this.imgTexture.width;
            var imgHeight = _this.imgTexture.height;
            var canvasName = "imageTexture_" + Date.now();

            var newCanvas = document.createElement('canvas');
            newCanvas.width = imgWidth;
            newCanvas.height = imgHeight;
            newCanvas.id = canvasName;

            var newContext = newCanvas.getContext('2d'); 
            newContext.clearRect(0, 0, imgWidth, imgHeight);
            newContext.drawImage(_this.imgTexture, 0, 0);

            _this.imgDataTexture = newContext.getImageData(0, 0,imgWidth, imgHeight);
        }
    }			
    this.imgTexture.crossOrigin = "Anonymous";
    this.imgTexture.src = _url;

}

Mesh.prototype.isTextureLoaded = function() 
{
    return this.imgDataTexture !== null;
}

Mesh.prototype.setZOrder = function(_zOrder)
{
    for (var i = 0; i < this.tris.length; i++) 
    {
        this.tris[i].zOrder = _zOrder;	
    }
}
