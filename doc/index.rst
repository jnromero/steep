STEEP - Simple Toolboox for Experimental Economics Programs
========

Steep is a minimal framework that allows for interaction between a python server and web browser clients (via javascript) via websockets.  Steep is simple, and doesn't have a lot of built in features, which allows for a lot of flexibility.

Look how easy it is to use:

    import project
    # Get your stuff done
    project.do_stuff()

Requirements
--------

:python: STEEP can be used with recent versions of either python 2 or python 3.  To install python on a mac, I recommend using the installation via homebrew (http://brew.sh/).  For windows, I recommend anaconda (https://www.continuum.io/downloads).  To check to see if python is installed, you can type



    .. code-block:: python
       :emphasize-lines: 3,5

       def some_function():
           interesting = False
           print 'This line is highlighted.'
           print 'This one is not...'
           print '...but this one is.'

   python --version
in terminal in mac or the command prompt in windows, and you should get an output that looks like "Python 2.7.10"
?
1
Python 2.7.10
After python is installed, you need to install the following packages (you can use the pip python installer)
twisted - this is used for the networking enginehttps://twistedmatrix.com/
?
1
pip install twisted
autobahn - this is used for websockets http://autobahn.ws/
?
1
pip install autobahn



Features
--------

- Be awesome
- Make things faster

.. code-block:: python
   :caption: this.py
   :name: this-py

   print 'Explicit is better than implicit.'


Installation
------------

Install $project by running:

    install project

Contribute
----------

- Issue Tracker: github.com/$project/$project/issues
- Source Code: github.com/$project/$project

Support
-------

If you are having issues, please let us know.
We have a mailing list located at: project@google-groups.com

License
-------

The project is licensed under the BSD license.
