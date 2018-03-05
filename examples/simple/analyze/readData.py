import imp
experiment = imp.load_source('experiment',"../files/experiment.py")
from experiment import subjectClass
import pickle 


filename='../data/tmp/tmp.pickle'
file = open(filename,'rb')
data=pickle.load(file)
file.close() 

for sid in data['subjectIDs']:
   print sid,data[sid].choices