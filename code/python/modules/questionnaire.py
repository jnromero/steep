from __future__ import print_function,division,absolute_import   

class SteepQuestionnaire():
   def __init__(self):
      "no init"

   def startQuestionnaire(self):
      for sid in self.data['subjectIDs']:
         self.data['subjects'][sid].status['page']="questionnaire"
         self.data['subjects'][sid].status['subjectID']=sid
         self.updateStatus(sid)

   def startQuestionnaireSubject(self,sid):
      self.data['subjects'][sid].status['page']="questionnaire"
      self.data['subjects'][sid].status['payment']=""
      self.data['subjects'][sid].status['subjectID']=sid
      self.updateStatus(sid)

   def questionnaireAnswers(self,message,client):
      sid=client.subjectID
      self.data['subjects'][sid].questionnaireAnswers=message['answers']
      self.data['subjects'][sid].status['doneWithEverything']="True"
      for s in self.data['subjectIDs']:
         self.calculateFinalPayoffs(s)
      self.displayFinalSummary(sid)
      self.monitorMessage()
