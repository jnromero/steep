import importlib.machinery
server = importlib.machinery.SourceFileLoader('server', 'files/experiment.py').load_module()
import pickle 

def getData():
	filename='PICKLEFILENAMEGOESHERE'
	file = open(filename,'rb')
	data=pickle.load(file)
	file.close() 
	return data

if __name__ == '__main__':
	data=getData()
	for sid in data['subjectIDs']:
		print(sid) 
