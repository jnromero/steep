#!/usr/bin/python
from __future__ import print_function,division,absolute_import   
import time
import filecmp
import pickle
import os
import imp
import os.path
from shutil import copyfile
import sys

def makeFolderIfNeeded(fullPathToFolder):
    if not os.path.exists(fullPathToFolder):
        print("creating new folder",fullPathToFolder)
        os.makedirs(fullPathToFolder)

def createAutoVersionFolderIfNeeded(config):
    #create auto-version folder if needed.
    avFolder=config['webServerRoot']+config['packageFolder']+'/html/auto-version/'
    makeFolderIfNeeded(avFolder)
    writeBlankTransformedFileIfNeeded(config)

def writeBlankTransformedFileIfNeeded(config):
    #create blank transformed file if needed.
    filename=config['webServerRoot']+config['packageFolder']+'/html/auto-version/transformed.pickle'
    if os.path.isfile(filename)==False: 
        print("creating new auto-version file transformed.pickle")
        file = open(filename,'wb')
        pickle.dump({},file, protocol=2)
        file.close() 
    return filename

def loadTransformedFile(config):
    filename=writeBlankTransformedFileIfNeeded(config)
    file = open(filename,'rb')
    transformedFiles=pickle.load(file)
    file.close() 
    return transformedFiles

def writeTransformedFile(config,transformedFiles):
    filename=writeBlankTransformedFileIfNeeded(config)
    file = open(filename,'wb')
    pickle.dump(transformedFiles,file, protocol=2)
    file.close() 

def loadFileList(config):
    #this loads the list of all files that need to be auto-versioned
    fileList = imp.load_source('fileList',config['webServerRoot']+config['packageFolder']+"/html/fileList.py")
    originalFiles=fileList.getOriginalFiles(config)
    return originalFiles

def updateAutoVersion(config,updateAll):
    createAutoVersionFolderIfNeeded(config)
    originalFiles=loadFileList(config)
    transformedFiles=loadTransformedFile(config)
    transformedFiles=updateFiles(config,originalFiles,transformedFiles,updateAll)
    writeTransformedFile(config,transformedFiles)
    return transformedFiles


def updateFiles(config,originalFiles,transformedFiles,updateAll):
    timeStamp=time.strftime("%Y%m%d-%H%M%S",time.localtime(time.time()))
    webServerRoot=config['webServerRoot']
    packageFolder=config['packageFolder']
    currentExperiment=config['currentExperiment']
    for fileType in ['common',currentExperiment]:
        for filename in originalFiles[fileType]:
            extension = os.path.splitext(filename)[1].replace(".","")
            folderName="%s/%s"%(fileType.replace("/","_"),extension)
            update=0
            if fileType not in transformedFiles:
                transformedFiles[fileType]={}
            if filename in transformedFiles[fileType]:
                baseFile=webServerRoot+originalFiles[fileType][filename]
                autoVersionFile=webServerRoot+packageFolder+"/html/auto-version/"+transformedFiles[fileType][filename]
                if os.path.isfile(autoVersionFile): 
                    if filecmp.cmp(baseFile,autoVersionFile)==False:
                        update=1
                else:
                    update=1
            else:
                update=1

            #force update all files
            if updateAll==1:
                update=1

            if update==1:
                #remove Old File
                if fileType in transformedFiles:
                    if filename in transformedFiles[fileType]:
                        try:
                            os.remove(webServerRoot+packageFolder+"/html/auto-version/"+transformedFiles[fileType][filename])
                        except:
                            e = sys.exc_info()[0]
                            print("ERROR: %s"% e )
                            print("no old files to remove",fileType,filename)

                #make folder if needed
                thisAVFolder=webServerRoot+packageFolder+"/html/auto-version/%s/"%(folderName)
                makeFolderIfNeeded(thisAVFolder)

                #copy original to auto-version
                originalFilename=webServerRoot+originalFiles[fileType][filename]
                transformedFiles[fileType][filename]="/%s/"%(folderName)+filename.replace(".","-"+timeStamp+".")
                newFile=webServerRoot+packageFolder+"/html/auto-version/"+transformedFiles[fileType][filename]
                copyfile(originalFilename,newFile)
    return transformedFiles