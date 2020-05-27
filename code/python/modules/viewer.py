import importlib.machinery
server = importlib.machinery.SourceFileLoader('server', 'files/experiment.py').load_module()
import pickle 

def getData():
	filename='PICKLEFILENAMEGOESHERE'
	file = open(filename,'rb')
	data=pickle.load(file)
	file.close() 
	return data

def showInfo(data):
	info=[]
	for k in data:
		thisInfo=[k,type(data[k]).__name__]
		info.append(thisInfo)
	info.sort()
	info.sort(key=lambda x: x[1])

	thisNumber=max([len(x[0]) for x in info])
	print("-"*(thisNumber+20))
	print(" "*(thisNumber-7)+"self.data") 
	print("-"*(thisNumber+20))
	for k in info:
		print(" "*(thisNumber-len(k[0])+2)+str(k[0])+" | "+str(k[1]))
	print() 
	if len(data['subjectIDs'])>0:
		info=[]
		sid1=data['subjectIDs'][0]
		subjectClass=data['subjects'][sid1]
		for k in dir(subjectClass):
			thisInfo=[k,type(eval("subjectClass.%s"%(k))).__name__]
			info.append(thisInfo)
		info.sort()
		info.sort(key=lambda x: x[1])
		thisNumber=max([len(x[0]) for x in info])
		print("-"*(thisNumber+20))
		print(" "*(thisNumber-10)+"subjectClass") 
		print("-"*(thisNumber+20))
		for k in info:
			if k[0][0]!="_" and k[1]!="method":
				print(" "*(thisNumber-len(k[0])+2)+str(k[0])+" | "+str(k[1]))
	print() 

	
if __name__ == '__main__':
	data=getData()
	showInfo(data)
