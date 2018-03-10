STEEP - Simple Toolboox for Experimental Economics Programs
========

Steep is a minimal framework that allows for interaction between a python server and web browser clients (via javascript) via websockets.  Steep is simple, and doesn't have a lot of built in features, which allows for a lot of flexibility.  Experimenters can then use the plethora of online resources dedicated to programing of webapps using CSS and Javascript.

Installation
--------

:python: STEEP can be used with recent versions of either python 2 or python 3.  To install python on a Mac, I recommend using the installation via homebrew (http://brew.sh/), although you can also just use the default installed version.  For Windows, I recommend anaconda (https://www.continuum.io/downloads).  To check to see if python is installed, you can type
:twisted: Twisted is an open source networking engine, more info at https://twistedmatrix.com/.  This can be installed with pip using "pip install twisted"
:autobahn: Autobahn is an open source WebSocket implementation, more info at http://autobahn.ws/.  This can be installed with pip using "pip install autobahn"
:STEEP: The latest version of STEEP can be downloaded from github via the following link: https://github.com/jnromero/steep/releases/latest

Running a Simple Experiment
--------

Once you have installed the above requirements, you can run a simple experiment.  Assume that you put the STEEP folder at the following path: /path/to/steep/. Navigate to the directory /path/to/steep/examples/simple/files/ (this can be done in terminal on a Mac or or the command prompt on Windows) by typing:

.. code-block:: console

   cd /path/to/steep/examples/simple/files/

Then you can run the server by running the following command:

.. code-block:: console

   python experiment.py -l local


Once the server is running, you can open the monitor at http://localhost:24921/monitor.html and several clients at http://localhost:24921/client.html.  In this experiment, every client is in the same group, and they have a button to click.  Once the total number of clicks for all subjects is greater than 10, then a new match starts. For a further description of this simple experiment see Description of Simple Experiment.

Structure of an Experiment 
--------

A STEEP experiment is programmed in three files:

:experiment.css: This file contains style information for the interface.
:experiment.js: This file contains javascript code.  In this file you will have function such as "drawGame" that will draw the interface for the subjects. You will also have function such as "makeChoice" which will select a choice for the subject and contact the server.
:experiment.py: This file is the main server file.  This file controls every aspect of the experiment, such as making the matchings between subjects, aggregating subjects choices, calculating payoffs, etc. 

Subject IDs 
--------
When a new client connects to a STEEP server, it is automatically assigned a subjectID.  The default behavior is to call subjects "subject1", "subject2", and so on as they join the experiment.  


Sending Messages 
--------

The main functionality of STEEP is to provide a simple way for experimenters to set up a connection between a python server and web clients in a way that will be accessible and useful for running economics experiments.  Therefore, the most important and basic feature of STEEP is sending messages.  There are two types of messages: client to server and server to client.

Server to Client
~~~~~~~
Since the server is a python server, the server to client messages are sent from python using code as follows:

    .. code-block:: python
       :emphasize-lines: 50

       msg={}
       msg['type']="updatePeriodPayoffs"
       msg['payoffs']=2.25
       msg['period']=26
       self.messageToId(msg,"subject1")

This code will send the message to the client with subjectID "subject1".  All messages must be a dictionary and have a "type" key.  This example message has a "type" key of "updatePeriodPayoffs".  When the client receives this message, it will automatically run a javascript function with the name of the "type" key.  So if a client receives the above message, then it would run a function like this:

    .. code-block:: javacript
       :emphasize-lines: 5

       function updatePeriodPayoffs(msg){
          document.getElementById("periodPayoff").innerHTML=msg['payoffs'];
          document.getElementById("currentPeriod").innerHTML=msg['period'];
       }

The javascript function will have access to the entire msg dictionary, so any relevant information that the server needs to communicate to the client can be put in this dictionary.  

Client to Server
~~~~~~~
Since the client is sending messages with javascript to a python server, the client to server messages are sent from javascript using code as follows:

    .. code-block:: javacript
       :emphasize-lines: 50

       msg={}
       msg['type']="makeChoice"
       msg['choice']="c";
       msg['period']=45;
       sendMessage(msg);

This code will send the message to the python server.  All messages must be a dictionary and have a "type" key.  This example message has a "type" key of "makeChoice".  When the server receives this message, it will automatically run a python function with the name of the "type" key.  So if the server receives the above message, then it would run a function like this:

    .. code-block:: python
       :emphasize-lines: 50

       def makeChoice(self,msg):
          subjectID=msg['subjectID']
          thisPeriod=msg['period']
          thisChoice=msg['choice']
          self.data[subjectID].choices[thisPeriod]=[thisChoice,time.time()]

The python function will have access to the entire msg dictionary, so any relevant information that the client needs to communicate to the server can be put in this dictionary.  In addition, the "subjectID" key will be added to the msg dictionary automatically so that the server can identify which client the message came from.



Support
-------

If you are having issues, please let us know.
We have a mailing list located at: project@google-groups.com

License
-------

The project is licensed under the MIT license.
