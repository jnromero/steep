filename='docs.txt'
with open(filename,'r') as f:
	fileData=f.read()

print fileData

re="{https*://.+?}"