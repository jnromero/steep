from experiment import subjectClass
import pickle 


filename='../data/tmp/tmp.pickle'
file = open(filename,'rb')
data=pickle.load(file)
file.close() 

for sid in data['subjectIDs']:
   print data[sid]