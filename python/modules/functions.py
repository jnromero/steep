

def printColor(string,color='black',highlights=[]):
   attr = ['0','30']
   if color=="green":
      # green
      attr.append('32')
   elif color=="red":
      # red
      attr.append('31')
   elif color=="gold":
      # red
      attr.append('33')
   elif color=="blue":
      # red
      attr.append('34')
   elif color=="pink":
      # red
      attr.append('35')
   elif color=="turquoise":
      # red
      attr.append('36')
   elif color=="grey":
      # red
      attr.append('37')
   else:
      attr.append('30')

   for highlight in highlights:
      if highlight=='bold':
         attr.append('1')
      elif highlight=='italic':
         attr.append('3')
      elif highlight=='underline':
         attr.append('4')
      elif highlight=='flash':
         attr.append('5')
      elif highlight=='background':
         attr.append('7')

   print('\x1b[%sm%s\x1b[0m' % (';'.join(attr), string)),

