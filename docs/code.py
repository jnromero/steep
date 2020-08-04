#!/usr/bin/python
# from __future__ import (absolute_import, division,print_function, unicode_literals)
# from builtins import (bytes, dict, int, list, object, range, str,ascii, chr, hex, input, next, oct, open,pow, round, super,filter, map, zip) 

import os 


toShow=[]
directory=os.path.abspath("../") 
for dirName, subdirList, fileList in os.walk(directory):
  if dirName.find("/docs")==-1 and dirName.find("/data")==-1:
    for f in fileList:
      file_name,extension = os.path.splitext(f) 
      if f[0]!="." and extension not in ['.pyc','.png','.mp3','.pickle']:
        completePath=os.path.abspath(dirName+"/"+f)
        toShow.append([completePath.replace(directory,""),extension,completePath])

toShow.sort()
for k in toShow:
  print(k)


string="""
<html>

<head>
    <link href="style.css?234" rel="stylesheet" type="text/css" />
    <link href="../code/css/prism/prism.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div id="sideBar">
    <div class="sideBarHeader">STEEP Files</div>
</div>
<div id="mainContent">
"""

def convertToPrism(string):
  string=string.replace("<","&lt;")
  return string

for k in toShow[:1222]:
  file = open(k[2],'r')
  fileData=file.read()
  file.close() 
  if k[1]==".py":
    language="language-python"
  elif k[1]==".js":
    language="language-js"
  elif k[1]==".css":
    language="language-css"
  else:
    language="language-plain"

  string+="""
<div class="header">%s</div>
<div class="p">
<pre class="line-numbers"><code class="%s">%s
</code></pre>
</div>
"""%(k[0],language,convertToPrism(fileData))


string+="""

<script src="../code/css/prism/prism.js"></script>

<script>
    var sideBar=document.getElementById("sideBar");
    var headers=document.querySelectorAll('.header,.subheader')
    for(k=0;k<headers.length;k++){
        var thisHeader=document.createElement("div");  
        var thisHeaderLink=document.createElement("a");  
        if(headers[k].className=="header"){
            thisHeader.className="sideBarEntry"
        }
        else if(headers[k].className=="subheader"){
            thisHeader.className="sideBarEntrys"
        }
        thisHeaderLink.innerHTML=headers[k].innerHTML;
        var replaced = headers[k].innerHTML.split(' ').join('').split('.').join('').split(')').join('').split('(').join('');
        thisHeaderLink.href="#"+replaced;
        thisHeader.innerHTML=thisHeaderLink.outerHTML;
        sideBar.appendChild(thisHeader);
        var subheaders=headers[k].getElementsByClassName("p");

        var target=document.createElement("a");  
        target.name=replaced;
        headers[k].parentNode.insertBefore(target,headers[k]);
    }




</script>

</body>

</html>


"""

filename='code.html'
file = open(filename,'w')
file.writelines(string)
file.close() 