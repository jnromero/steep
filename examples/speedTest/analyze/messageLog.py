import imp
experiment = imp.load_source('experiment',"../files/experiment.py")
from experiment import subjectClass
import pickle 

filename='../data/tmp/logs/messagesLog.pickle'
with open(filename,'rb') as f:
	while True:
		try:
			data=pickle.load(f)
			print data[0],data[1],data[2]['type'],data[2]['sid']
		except Exception,e: 
			print str(e)
			break
