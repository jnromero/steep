<html>

<head>
    <script type="text/javascript" src="syntaxhighlighter_3.0.83/scripts/shCore.js"></script>
    <script type="text/javascript" src="syntaxhighlighter_3.0.83/scripts/shBrushJScript.js"></script>
    <script type="text/javascript" src="syntaxhighlighter_3.0.83/scripts/shBrushCss.js"></script>
    <script type="text/javascript" src="syntaxhighlighter_3.0.83/scripts/shBrushPython.js"></script>
    <script type="text/javascript" src="syntaxhighlighter_3.0.83/scripts/shBrushPlain.js"></script>
    <script type="text/javascript" src="syntaxhighlighter_3.0.83/scripts/shBrushBash.js"></script>
    <link href="syntaxhighlighter_3.0.83/styles/shCore.css" rel="stylesheet" type="text/css" />
    <link href="style.css" rel="stylesheet" type="text/css" />
    <link href="syntaxhighlighter_3.0.83/styles/shThemeDefault.css" rel="stylesheet" type="text/css" />
</head>

<body>
    <div id="mainDiv">
        <div id="sidebar">
        <ul>
          <li><a href="#Requirements">Requirements</a></li>
          <li><a href="#Running">Running a simple experiment</a></li>
          <li><a href="#Description">Description of simple experiment</a></li>
        </ul>
        </div>
        <div id="container">
	        <A NAME="Requirements">
            <h1 class="title">Requirements</h1>
            <ul>
                <li> python 2.7</li>
                <ul>
                    <li>For mac, I recommend using the installation via homebrew (<a href="http://brew.sh/">http://brew.sh/</a>).</li>
                    <ul>
                        <li> To install homebrew type this in terminal: </li>
                        <pre class="brush: plain">/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"</pre>
                        <li>Then to install python:</li>
                        <pre class="brush: plain">brew install python</pre>
                    </ul>
                    <li>For windows, I know people use anaconda (<a href="https://www.continuum.io/downloads">https://www.continuum.io/downloads</a>).
                        <li>To check to see if python is installed, you can type
                            <pre class="brush: plain">python --version</pre> in terminal in mac or the command prompt in windows, and you should get an output that looks like "Python 2.7.10"
                            <pre class="brush: plain">Python 2.7.10</pre>
                </ul>
                <li>After python is installed, you need to install the following packages (you can use the pip python installer)</li>
                <ul>
                    <li>twisted - this is used for the networking engine<a href="https://twistedmatrix.com/">https://twistedmatrix.com/</a></li>
                    <pre class="brush: plain">pip install twisted</pre>
                    <li>autobahn - this is used for websockets <a href="http://autobahn.ws/">http://autobahn.ws/</a></li>
                    <pre class="brush: plain">pip install autobahn</pre>
                </ul>
            </ul>
            <!-- Finally, to actually run the highlighter, you need to include this JS on your page -->
            <script type="text/javascript">
            SyntaxHighlighter.all()
            </script>
            <A NAME="Running">
            <h1 class="title">Running a simple experiment</h1>
            <ul>
            	<li>This will tell you how to run a simple experiment.  In the experiment, each client of the experiment will have a button.  Once the button has been pressed 10 times (counting all client's presses), it will move on to the next match. 
                <li>Download the zip folder containing the common files Common Files and the simple experiment Simple experiment. 1. "common" is where all of the main files reside, these should probably not be edited. 2. "simple" is a simple example of an experiment. These files can be found here [ The main setup to run experiments requires you to have the "common" folder and then the experiment folder. The example experiment folder is "simple". For example, you may have the following folder structure:
                </li>
                <pre class="brush: plain">
/Users/myusername/Desktop/experiments/common
/Users/myusername/Desktop/experiments/simple
</pre>
                <li>Once you have the folders set up like this, you will need to edit the file in "/Users/myusername/Desktop/experiments/simple/config.py" so the the beginning looks like this:
                    <pre class="brush: python">
#!/usr/bin/python

import pickle
import os
scriptPath=os.path.dirname(os.path.realpath(__file__))

def defaultSettings(location,configFile,serverStartString):
	config={}
	config['favicon']="common/"

	config['packageFolder']="/common/"
	config['currentExperiment']="/simple/"
	# config['instructionsFolder']="/files/instructions/"
	# config['instructionsTexFile']="/latex/instructions.tex"
	# config['quiz']=True
	config["location"]=location
	config['screenServerPort']=1111

	if location=="local":
		config['webServerRoot']="/Users/myusername/Desktop/experiments/"
		config['serverType']="regularExperiment"	
		config['serverPort']=2222
		config['webSocketPort']=3333
		ip="localhost"
		config["domain"]="http://"+ip+":"+str(config['serverPort'])
		config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
		config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
	# elif location=="labComputer":
	# 	config['webServerRoot']="/Users/lab/Desktop/Experiments/"
	# 	config['serverType']="regularExperiment"	
	# 	config['serverPort']=2222
	# 	config['webSocketPort']=3333
	# 	ip="10.128.228.70"
	# 	config["domain"]="http://"+ip+":"+str(config['serverPort'])
	# 	config["websocketURL"]="ws://"+ip+":"+str(config['webSocketPort'])
	# 	config["screenServer"]="http://"+ip+":"+str(config['screenServerPort'])
</pre> Pretty much the only line that you will need to edit line 20, where you will put your path. On a Mac, it will look something like:
                    <pre class="brush: python">config['webServerRoot']="/Users/myusername/Desktop/experiments/"</pre> On windows it might look something like:
                    <pre class="brush: python">config['webServerRoot']="C:/Users/myusername/Desktop/experiments/"</pre> Note that for windows, you will keep the slashes as forward slashes, and not the backslashes that windows typically uses.
                </li>
                <li>You also need to make sure that the path on line 20 plus the path on line 11 is where you put the "common" folder (/Users/myusername/Desktop/experiments/common/ in this example) and the path on line 20 plus the path on line 12 is where you put the "simple" folder (/Users/myusername/Desktop/experiments/simple/ in this example).
                    <li>Once this is setup, you can run the program by moving to the common/python folder in terminal on a mac or the command prompt on windows by doing this:
                        <pre class="brush: bash">cd /Users/myusername/Desktop/experiments/common/python/</pre> Then you can run the program like this:
                        <pre class="brush: bash">python server.py -c '/Users/myusername/Desktop/experiments/common/config.py' -l local -o True</pre> to see all of the options you can run
                        <pre class="brush: bash">python server.py -h</pre>
                    </li>
                    <li>If you want to run the server on a different computer you can comment out the following 9 lines, and edit the code for those. This would be useful for example to run it on a lab computer or a web server.</li>
            </ul>
            <A NAME="Description">
            <h1 class="title">Description of the simple experiment</h1>

        </div>
    </div>
</body>

</html>
