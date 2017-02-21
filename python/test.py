import time
import sys
import os
time.sleep(2)
print("NEW SERVER")
# print('to run')
# string=sys.executable
# string+=" "+" ".join(sys.argv)
# print 
# os.system(string)


print(sys.executable,[sys.executable.split("/")[-1]]+sys.argv)
os.execv(sys.executable,[sys.executable.split("/")[-1]]+sys.argv)



# import subprocess
# subprocess.call(['/usr/bin/some-command', arg1,arg2])
