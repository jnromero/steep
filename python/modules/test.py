
import pickle

x=2
y=4
filename='/Users/jnr/Dropbox/Sites/jnromero.com/Experiments//strategyChoiceReplicateDBF//data/tmp//logs/pickle/2.pickle'


file = open(filename,'rb')
j=0
while 3<4:
	try:
		data=pickle.load(file)
		print data
	except:
		break
file.close() 
