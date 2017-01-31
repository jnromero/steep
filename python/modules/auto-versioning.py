#!/usr/bin/python
from __future__ import print_function
import time
import filecmp
import pickle
import os
import imp
import os.path
from shutil import copyfile


def writeBlankFile():
    filename='../../html/auto-version/transformed.pickle'
    file = open(filename,'wb')
    pickle.dump({},file)
    file.close() 

def loadTransformedFile(config):
    filename=config['webServerRoot']+config['packageFolder']+'/html/auto-version/transformed.pickle'
    if os.path.isfile(filename)==False: 
        file = open(filename,'wb')
        pickle.dump({},file)
        file.close() 
    file = open(filename,'rb')
    transformedFiles=pickle.load(file)
    file.close() 
    return transformedFiles

def loadFileList(config):
    fileList = imp.load_source('fileList',config['webServerRoot']+config['packageFolder']+"/html/fileList.py")
    originalFiles=fileList.getOriginalFiles(config)
    return originalFiles

def updateAutoVersion(config):
    originalFiles=loadFileList(config)
    transformedFiles=loadTransformedFile(config)
    transformedFiles=updateFilesIfNeeded(config,originalFiles,transformedFiles)
    return transformedFiles


def updateFilesIfNeeded(config,originalFiles,transformedFiles):
    timeStamp=time.strftime("%Y%m%d-%H%M%S",time.localtime(time.time()))
    webServerRoot=config['webServerRoot']
    packageFolder=config['packageFolder']
    currentExperiment=config['currentExperiment']
    for fileType in ['common',currentExperiment]:
        for filename in originalFiles[fileType]:
            extension = os.path.splitext(filename)[1].replace(".","")
            folderName="%s/%s"%(fileType.replace("/","_"),extension)
            update=0
            if currentExperiment not in transformedFiles:
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
            if update==1:
                #remove Old File
                try:
                    os.remove(webServerRoot+packageFolder+"/html/auto-version/"+transformedFiles[fileType][filename])
                except:
                    print("no old files to remove")

                #make folder if needed
                thisAVFolder=webServerRoot+packageFolder+"/html/auto-version/%s/"%(folderName)
                if not os.path.exists(thisAVFolder):
                    os.makedirs(thisAVFolder)

                #copy original to auto-version
                originalFilename=webServerRoot+originalFiles[fileType][filename]
                transformedFiles[fileType][filename]="/%s/"%(folderName)+filename.replace(".","-"+timeStamp+".")
                newFile=webServerRoot+packageFolder+"/html/auto-version/"+transformedFiles[fileType][filename]
                copyfile(originalFilename,newFile)
    return transformedFiles


def updateAllAutoVersion(config):
    print("updating All autoversion files")
    originalFiles=loadFileList(config)
    transformedFiles=loadTransformedFile(config)
    transformedFiles=updateAllFiles(config,originalFiles,transformedFiles)
    return transformedFiles


def updateAllFiles(config,originalFiles,transformedFiles):
    timeStamp=time.strftime("%Y%m%d-%H%M%S",time.localtime(time.time()))
    webServerRoot=config['webServerRoot']
    packageFolder=config['packageFolder']
    currentExperiment=config['currentExperiment']
    for fileType in ['common',currentExperiment]:
        for filename in originalFiles[fileType]:
            extension = os.path.splitext(filename)[1].replace(".","")
            folderName="%s/%s"%(fileType.replace("/","_"),extension)
            update=0
            if currentExperiment not in transformedFiles:
                transformedFiles[fileType]={}
            update=1
            if update==1:
                #remove Old File
                try:
                    os.remove(webServerRoot+packageFolder+"/html/auto-version/"+transformedFiles[fileType][filename])
                except:
                    print("no old files to remove",filename)

                #make folder if needed
                thisAVFolder=webServerRoot+packageFolder+"/html/auto-version/%s/"%(folderName)
                if not os.path.exists(thisAVFolder):
                    os.makedirs(thisAVFolder)

                #copy original to auto-version
                originalFilename=webServerRoot+originalFiles[fileType][filename]
                transformedFiles[fileType][filename]="/%s/"%(folderName)+filename.replace(".","-"+timeStamp+".")
                newFile=webServerRoot+packageFolder+"/html/auto-version/"+transformedFiles[fileType][filename]
                copyfile(originalFilename,newFile)


    filename=webServerRoot+packageFolder+'/html/auto-version/transformed.pickle'
    file = open(filename,'wb')
    pickle.dump(transformedFiles,file)
    file.close() 

    return transformedFiles
