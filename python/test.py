from __future__ import print_function,division,absolute_import   
import sys



class Logger():
   def __init__(self,stream):
      self.stream=stream
   def write(self,obj):
      self.stream.write("stderr "+obj)

sys.stderr = Logger(sys.stderr)

print(x)


