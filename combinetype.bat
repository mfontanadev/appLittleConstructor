set OUTPUTFILE=appLittleConstructorThreeJSEx.js
set JS_DIR=js
set BUILD_DIR=build

del %OUTPUTFILE%

type %JS_DIR%\license.js >> %OUTPUTFILE%  
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% helper.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% vector2D.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% vector.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% triangle.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% mesh.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% piece.js
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% pieceFactory.js  
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% linkPoint.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% cursor.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% bluePlane.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% spaceThree.js 
call addFileWithHeader.bat %OUTPUTFILE% %JS_DIR% app.js 

cls

REM Clean build dir.
rmdir /s /q %BUILD_DIR%

REM Create build dir.
mkdir %BUILD_DIR%

REM Copy all needed files to build dir.
xcopy css %BUILD_DIR%\css /E /I /Q
xcopy doc %BUILD_DIR%\doc /E /I /Q
xcopy img %BUILD_DIR%\img /E /I /Q
xcopy files %BUILD_DIR%\files /E /I /Q
xcopy js\lib %BUILD_DIR%\js\lib /E /I /Q

xcopy obj\*.obj %BUILD_DIR%\obj /E /I /Q
copy obj\house.bpl %BUILD_DIR%\obj
copy obj\paper.jpg %BUILD_DIR%\obj


copy %OUTPUTFILE% %BUILD_DIR% 
copy favicon.ico %BUILD_DIR% 
copy index.html %BUILD_DIR% 
copy LICENSE %BUILD_DIR% 
copy readme.md %BUILD_DIR% 

