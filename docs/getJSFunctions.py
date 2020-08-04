#!/usr/bin/python

import os 
import re 

string="<html><body><ul>\n"
toShow=[]
directory=os.path.abspath("../code/javascript/") 
for dirName, subdirList, fileList in os.walk(directory): 
  for f in fileList:
    file_name,extension = os.path.splitext(f) 
    if extension==".js" and file_name.find("velocity")==-1 and file_name.find("jquery")==-1:
      completePath=os.path.abspath(dirName+"/"+f)
      file = open(completePath,'rb')
      fileData=file.read()
      file.close() 
      print completePath
      string+="<h1>%s</h1>"%(file_name) 
      functions = re.findall(r"function([ \(].*?\))",fileData,re.DOTALL) 
      for k in functions:
        if k.replace(" ","")!="()" and k.replace(" ","")!="(e)":
          string+="<li>%s</li>\n"%(k)

string+="</ul></body></html>" 

filename='jsFunctions.html'
file = open(filename,'w')
file.writelines(string)
file.close() 