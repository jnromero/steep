from __future__ import print_function

class SteepQuiz():
   def __init__(self):
      "self.doNothering=1"

   # Quiz Stuff

   def quizDemo(self,sid):
      self.startQuizForSubject(sid)
      
   def reconnectQuiz(self,sid):
      self.quizSpecificMonitorTable()
      self.displayQuiz(sid)

   def startQuiz(self,message,client):
      #quiz specific monitor table
      self.quizSpecificMonitorTable()
      self.data['serverStatus']['page']="quiz"
      for sid in self.data['subjectIDs']:
         self.startQuizForSubject(sid)
      self.data['monitorTasks'][message['index']]['status']='Done'
      self.monitorMessage()


   def startQuizForSubject(self,sid):
      self.data[sid].status['quizQuestionNumber']=1
      self.data[sid].status['quizQuestionTries']=0
      self.data[sid].status['quizQuestionStatus']="blank"
      self.displayQuiz(sid)

   def getNextQuestion(self,message,client):
      sid=client.subjectID
      self.data[sid].status['quizQuestionNumber']+=1
      self.data[sid].status['quizQuestionTries']=0
      self.data[sid].status['quizQuestionStatus']="blank"
      self.displayQuiz(sid)
      self.monitorMessage()

   def tryCurrentQuestionAgain(self,message,client):
      sid=client.subjectID
      self.data[sid].status['quizQuestionTries']+=1
      self.data[sid].status['quizQuestionStatus']="blank"
      self.displayQuiz(sid)
      self.monitorMessage()

   def checkQuizAnswer(self,message,client):
      sid=client.subjectID
      questionNumber=self.data[sid].status['quizQuestionNumber']
      questionTries=self.data[sid].status['quizQuestionTries']
      answer=message['answer']
      self.data[sid].status['answer']=answer
      self.data[sid].quizAnswers.append([questionNumber,questionTries,answer])
      if answer==self.quizAnswers[questionNumber]:
         self.data[sid].status['quizQuestionStatus']="correct"
      else:
         self.data[sid].status['quizQuestionStatus']="incorrect"
      self.displayQuiz(sid)
      self.monitorMessage()

   def quizQuestionStatement(self,sid):
      questionNumber=self.data[sid].status['quizQuestionNumber']
      msg={}
      msg['type']="drawStatement"
      msg['statement']="%s.  %s"%(questionNumber,self.quizQuestions[questionNumber]['statement'])
      msg['location']=self.quizQuestions[questionNumber]['location']
      msg['size']=[450,250]#width,height
      msg['options']=['']+self.quizQuestions[questionNumber]['options']
      self.customMessage(sid,msg)

   def drawQuizOverStatement(self,sid):
      msg={}
      msg['type']="drawStatement"
      msg['statement']="You have finished the quiz.  Please wait for others to finish the quiz."
      msg['location']=[450,250]
      msg['size']=[450,250]#width,height
      msg['options']=['']
      self.data[sid].status['quizQuestionStatus']="noButton"
      self.messageToId(msg,sid,"send")

   #quiz specific monitor Table
   def quizSpecificMonitorTable(self):
      self.data['monitorTableInfo']=[
      ['Status'                  ,'self.data[sid].status["quizQuestionStatus"]'],
      ['Question Number'         ,'self.data[sid].status["quizQuestionNumber"]'],
      ['Question Tries'          ,'self.data[sid].status["quizQuestionTries"]'],
      ['Total Tries'             ,'len(self.data[sid].quizAnswers)'],
      ['Answer'                  ,'self.data[sid].status["answer"]'],
      ]
      self.updateMonitorTableEntries()
