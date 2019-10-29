const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

function readFile(self) {
  const targetPath = self.dataSaveFile.dataDirectory + path.sep + self.dataSaveFile.selectHistoryFile
  fs.readFile(targetPath, (error, content) => {
    if (error != null) {
      alert('file open error.')
      return
    }

    let targetReadData = content.toString()
    if (self.dataSaveFile.openFileType == 'encjson') {
      try {
        const decrypted = CryptoJS.AES.decrypt(targetReadData, self.dataSaveFile.encryptKeyword)
        targetReadData = decrypted.toString(CryptoJS.enc.Utf8)
      } catch (e) {
        alert('password not correct')
      }
    }
    self.dataItemList = JSON.parse(targetReadData);
    self.dataDialog.open = false
  })
}

function methodSaveFile(self) {
  let tempArray = []
  self.dataItemList.forEach(function (key) {
    if (key) {
      const set = methodSetContentItem(key)
      tempArray.push(set)
    }
  })

  let targetSaveData = JSON.stringify(tempArray);

  let fileExtension = ".json"

  if (self.dataSaveFile.saveFileType == 'encrypt') {
    fileExtension = ".encjson"
    const encrypted = CryptoJS.AES.encrypt(targetSaveData, self.dataSaveFile.encryptKeyword)
    targetSaveData = encrypted.toString()
  }

  let optionSaveFileName = ''
  if (self.dataSaveFile.optionSaveFileName) {
    optionSaveFileName = '_' + self.dataSaveFile.optionSaveFileName
  }

  methodWriteFile(self, targetSaveData, optionSaveFileName, fileExtension)
  self.dataDialog.save = false
  self.methodReadHistoryFileList()
}


function methodReadHistoryFileList(self) {
  if (!fs.existsSync(self.dataSaveFile.dataDirectory)) {
    fs.mkdirSync(self.dataSaveFile.dataDirectory);
  }

  fs.readdir(self.dataSaveFile.dataDirectory + path.sep, function (err, files) {
    if (err) {
      console.log("error : " + err);
    }
    if (files.length == 0) {
      // バックアップファイルが一つもない場合、ダイアログを開かない
      console.log("not found files");
      self.dataDialog.open = false
      self.dataSaveFile.historyList = []
    } else {
      self.dataDialog.open = true
      self.dataSaveFile.historyList = files.slice().reverse();
    }
  });
}


function methodEndResizeFrame(self) {
  self.dataControlFrame.isDragged = false
}

function methodRemoveFile(self) {
  const index = self.dataSaveFile.selectHistoryIndex;
  const fileName = self.dataSaveFile.historyList[index]
  fs.unlinkSync(self.dataSaveFile.dataDirectory + path.sep + fileName);
  self.methodReadHistoryFileList()
  self.dataSaveFile.selectHistoryIndex = null
}



function methodWriteFile(self, data, optionSaveFileName, fileExtension) {
  const fileName = self.dataSaveFile.dataDirectory + path.sep + Util.dateTimeString() + optionSaveFileName + fileExtension
  fs.writeFile(fileName, data, (error) => {
    if (error != null) {
      alert('save error.')
    }
  })
}


function dateTimeString() {
  let dt = new Date();
  let yyyy = dt.getFullYear();
  let mm = ("00" + (dt.getMonth() + 1)).slice(-2);
  let dd = ("00" + dt.getDate()).slice(-2);
  let hh = ("00" + dt.getHours()).slice(-2);
  let nn = ("00" + dt.getMinutes()).slice(-2);
  let ss = ("00" + dt.getSeconds()).slice(-2);
  return yyyy + "-" + mm + "-" + dd + "--" + hh + "-" + nn + "-" + ss;
}

function methodSetContentItem(itemType) {
  const set = {
    "name": itemType.name,
    "id": itemType.id,
    "password": itemType.password,
    "other1": itemType.other1,
    "other2": itemType.other2,
    "text": itemType.text,
    "tagId": itemType.tagId,
    "tagPassword": itemType.tagPassword,
    "tagOther1": itemType.tagOther1,
    "tagOther2": itemType.tagOther2,
  };
  return set
}

module.exports = {
  dateTimeString,
  methodSetContentItem,
  readFile,
  methodReadHistoryFileList,
  methodRemoveFile,
  methodWriteFile,
  methodSaveFile,
  methodEndResizeFrame,
};
