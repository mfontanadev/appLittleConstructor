# App "Little constructor" branch ThreeJS

App that let you create houses using basic geometrial shapes. Do not forget use camera to go inside it. In this branch you can use orbit controls from ThreeJS.

## Why this branch?

The idea is take master and change the render engine using  ThreeJS.


## Enjoy at

[http://mfontanadev.github.io/games/deployLittleConstructorThreeJS/index.html](http://mfontanadev.github.io/games/deployLittleConstructorThreeJS/index.html)

## Motivation
- Make my own javascript version of Javidx9's 3D engine.
- Make a virtual version of the game "casitasfrm"

<table>
	<tr>
		<th width="360px" align="center">
		<img width="260px" src="https://github.com/mfontanadev/appLittleConstructor/blob/master/doc/poc_house_leftside.png?raw=true">
		</th>
		<th width="360px" align="center">
		<img width="190px" src="https://github.com/mfontanadev/appLittleConstructor/blob/master/doc/poc_house_rightside.png?raw=true?raw=true">
		</th>
	</tr>
	<tr>
		<th align="center">
			Digital version example
		</th>
		<th align="center">
			Real version example
		</th>
	</tr>
</table>

## Building a new version

The idea is merge all files in one only big .js file. To do that, you can use batch files or make your own merge. You can use merge process for you own porpouses, if you want. So, follow the next steps:

1. Go to root dir and locate combinetype.bat (this works on Windows). Run as is, with no arguments.
NOTE: if you want to set version number, please modify this line "var C_VERSION_TITLE = "Little constructor (based on JSEngine) v1.2";", this is a very simple way to identify it at running time.

2. You must see a new file called appLittleConstructor.js.

Ok, that was easy, but let me explain some of the "my merge way" details.

* First, to identify classes inside the fat file I use a separator made of three comment lines, this is generated automatically.  

* Second, all .obj files must be converted to .var and then added to mockedObj.js. This is achieved with a converter tool called file2var.jar (personal cooking).

## Code explanation

I think I will make a tutorial. There are multiples concepts in this app, for example: 3D Engine from scratch in javascript, mini framework (a class with some utilities) for game dev, classes to interac with the 3D engine and a layer to manipulate objects acoording to house creation (it can be modified to make a city builder or whatever)

## References

* Javidx9 tutorial: [https://www.youtube.com/watch?v=ih20l3pJoeU](https://www.youtube.com/watch?v=ih20l3pJoeU)

## Contact

* site: [https://mfontanadev.github.io](https://mfontanadev.github.io)

* twitter: [https://twitter.com/mfontanadev](https://twitter.com/mfontanadev)

* git: [https://github.com/mfontanadev](https://github.com/mfontanadev)

* linkedin: [https://www.linkedin.com/in/mauricio-fontana-8285681b/?originalSubdomain=ar](https://www.linkedin.com/in/mauricio-fontana-8285681b/?originalSubdomain=ar)

