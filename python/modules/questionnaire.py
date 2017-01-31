from __future__ import print_function

class SteepQuestionnaire():
   def __init__(self):
      "no init"

   def startQuestionnaire(self):
      for sid in self.data['subjectIDs']:
         self.data[sid].status['page']="questionnaire"
         self.data[sid].status['subjectID']=sid
         self.updateStatus(sid)

   def startQuestionnaireSubject(self,sid):
      self.data[sid].status['page']="questionnaire"
      self.data[sid].status['payment']=""
      self.data[sid].status['subjectID']=sid
      self.updateStatus(sid)

   def questionnaireAnswers(self,message,client):
      sid=client.subjectID
      self.data[sid].questionnaireAnswers=message['answers']
      self.data[sid].status['doneWithEverything']="True"
      for s in self.data['subjectIDs']:
         self.calculateFinalPayoffs(s)
      self.displayFinalSummary(sid)
      self.monitorMessage()
