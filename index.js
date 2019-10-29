const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const LEFT_FRAME_MIN_WIDTH = 45
const FRAME_ADJUSTED_SETTING = -4

const {
  clipboard
} = require('electron');

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    dataControlFrame: {
      leftFrameWidth: 400,
      isDragged: false,
    },

    dataSaveFile: {
      boolVisibleIcon: false,
      isEditable: false,
      encryptKeyword: "",
      dataDirectory: "data",
      historyList: [],
      openFileType: 'normal',
      saveFileType: 'normal',
      optionSaveFileName: '',
      selectHistoryFile: "",
      selectHistoryIndex: null,
    },

    dataDialog: {
      save: false,
      open: false,
    },

    dataCopyIcon: {
      id: false,
      password: false,
      other1: false,
      other2: false,
    },

    dataVisibleIcon: {
      all: false,
      id: false,
      password: false,
      other1: false,
      other2: false,
    },

    dataFilterWord: '',

    dataRules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
    },
    dataDictionary: {
      placeholderBody: "Please input",
      placeholderOther: "optional",
      placeholderTag: "changeable",
    },

    dataColorList: {
      itemList: "amber lighten-3",
      itemSelect: "pink lighten-3",
      name: "cyan lighten-4",

      id: "blue lighten-4",
      password: "green lighten-4",
      other1: "teal lighten-4",
      other2: "indigo lighten-4",
      text: "deep-purple lighten-4",

      tagId: "blue",
      tagPassword: "green",
      tagOther1: "teal",
      tagOther2: "indigo",
      targetSelected: "pink lighten-3",
      targetUnselected: "amber lighten-3",
    },

    dataItemList: [],
    dataSelectedItem: {
      index: null,
      name: "",
      id: "",
      password: "",
      other1: "",
      other2: "",
      text: "",
    },

    dataItemTemplate: {
      name: "",
      id: "",
      password: "",
      other1: "",
      other2: "",
      text: "",
      tagId: "ID",
      tagPassword: "password",
      tagOther1: "other1",
      tagOther2: "other2",
    }

  },
  mounted() {
    this.methodReadHistoryFileList()
    this.methodSelectOpenFile(0)
  },

  computed: {},
  methods: {
    methodSetPrependIcon: function (position) {
      return this.dataCopyIcon[position] ? 'mdi-check-bold' : 'mdi-clipboard'
    },

    methodSetAppendIcon: function (position) {
      return this.dataVisibleIcon[position] ? 'visibility' : 'visibility_off'
    },

    methodSetAppendIconStatus: function (position) {
      this.dataVisibleIcon[position] = !this.dataVisibleIcon[position]
    },

    methodSetTextType: function (position) {
      return this.dataVisibleIcon[position] ? 'text' : 'password'
    },

    methodSetColor: function (position) {
      return this.dataColorList[position]
    },

    methodSetShowRightPane: function () {
      return this.dataSelectedItem.index == null ? 'is-hidden' : ''
    },

    methodSetItemListColor: function (index) {
      return index == this.dataSelectedItem.index ? this.dataColorList.targetSelected : this.dataColorList.targetUnselected
    },

    methodSetFileListColor: function (index) {
      return index == this.dataSaveFile.selectHistoryIndex ? this.dataColorList.targetSelected : this.dataColorList.targetUnselected
    },

    methodSetAllVisible: function (statusString) {
      if (statusString == "neutral") {
        this.dataVisibleIcon.all = !this.dataVisibleIcon.all
      } else if (statusString == "true") {
        this.dataVisibleIcon.all = true
      } else {
        this.dataVisibleIcon.all = false
      }

      this.dataVisibleIcon.id = this.dataVisibleIcon.all
      this.dataVisibleIcon.password = this.dataVisibleIcon.all
      this.dataVisibleIcon.other1 = this.dataVisibleIcon.all
      this.dataVisibleIcon.other2 = this.dataVisibleIcon.all
    },

    methodRemoveItem: function () {
      let dataItemList = Object.create(this.dataItemList);
      const index = this.dataSelectedItem.index;
      dataItemList.splice(index, 1);
      this.dataItemList = dataItemList
    },

    methodSetSelectedItem: function (index) {

      let dataItem = Object.create(this.dataItemList[index]);

      this.dataSelectedItem.index = index;
      this.dataSelectedItem.name = dataItem.name;
      this.dataSelectedItem.id = dataItem.id;
      this.dataSelectedItem.password = dataItem.password;
      this.dataSelectedItem.other1 = dataItem.other1;
      this.dataSelectedItem.other2 = dataItem.other2;
      this.dataSelectedItem.text = dataItem.text;

      this.dataSelectedItem.tagId = dataItem.tagId;
      this.dataSelectedItem.tagPassword = dataItem.tagPassword;
      this.dataSelectedItem.tagOther1 = dataItem.tagOther1;
      this.dataSelectedItem.tagOther2 = dataItem.tagOther2;
      this.methodSetAllVisible("false")

    },

    methodDateTimeString: function () {
      let dt = new Date();
      let yyyy = dt.getFullYear();
      let mm = ("00" + (dt.getMonth() + 1)).slice(-2);
      let dd = ("00" + dt.getDate()).slice(-2);
      let hh = ("00" + dt.getHours()).slice(-2);
      let nn = ("00" + dt.getMinutes()).slice(-2);
      let ss = ("00" + dt.getSeconds()).slice(-2);
      return yyyy + "-" + mm + "-" + dd + "--" + hh + "-" + nn + "-" + ss;
    },

    methodSetDataItem: function (position) {
      let dataItem = Object.create(this.dataItemList[this.dataSelectedItem.index]);

      if (position == "name" && this.dataSelectedItem[position] == "") {
        this.dataSelectedItem[position] = "can't empty"
      }

      dataItem[position] = this.dataSelectedItem[position];
      this.dataItemList[this.dataSelectedItem.index] = dataItem;
    },

    methodAddItem: function (type) {
      let dataItemList = Object.create(this.dataItemList)
      let itemType = null
      let afterAddShow = 'false'

      if (type == 'new') {
        itemType = Object.create(this.dataItemTemplate)
        itemType.name = "created at : " + this.methodDateTimeString()
        afterAddShow = 'true'
        this.dataFilterWord = null
      } else if (type == 'copy') {
        itemType = Object.create(this.dataSelectedItem)
        afterAddShow = 'false'
      }

      const set = this.methodSetContentItem(itemType)

      dataItemList.unshift(set);
      this.dataItemList = dataItemList;
      this.methodSetSelectedItem(0);
      this.methodSetAllVisible(afterAddShow);
    },

    methodSetContentItem: function (itemType) {
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
    },

    methodPasteToClipBoard: function (position) {
      let self = this;
      this.dataCopyIcon[position] = true;
      clipboard.writeText(this.dataSelectedItem[position])
      setTimeout(function () {
        self.dataCopyIcon[position] = false
      }, 500)
    },
    resetSelectedItem: function () {
      this.dataSelectedItem.index = null
    },

    // 整形表現に一致すればクラスis-showを返却
    methodFilterCondition: function (itemName) {
      if (this.dataFilterWord == '' || this.dataFilterWord == null) {
        return "is-show";
      } else {
        console.log(this.dataFilterWord)
        let freeWordList = this.dataFilterWord.split(" ");
        let strCombRegex = ".*";
        freeWordList.forEach((value, index, array) => {
          strCombRegex = ".*" + value + ".*";
        });
        let regexp = new RegExp(strCombRegex, "g");
        let matchArr = itemName.match(regexp);
        if (matchArr != null) {
          return "is-show";
        }

      }
    },

    methodReadFile: function () {
      const targetPath = this.dataSaveFile.dataDirectory + path.sep + this.dataSaveFile.selectHistoryFile
      fs.readFile(targetPath, (error, content) => {

        if (error != null) {
          alert('file open error.')
          return
        }

        let targetReadData = content.toString()
        if (this.dataSaveFile.openFileType == 'encjson') {

          try {
            const decrypted = CryptoJS.AES.decrypt(targetReadData, this.dataSaveFile.encryptKeyword)
            targetReadData = decrypted.toString(CryptoJS.enc.Utf8)
          } catch (e) {
            alert('password not correct')
          }
        }
        this.dataItemList = JSON.parse(targetReadData);
        this.dataDialog.open = false
      })
    },

    methodRemoveFile: function () {
      const index = this.dataSaveFile.selectHistoryIndex;
      const fileName = this.dataSaveFile.historyList[index]
      fs.unlinkSync(this.dataSaveFile.dataDirectory + path.sep + fileName);
      this.methodReadHistoryFileList()
      this.dataSaveFile.selectHistoryIndex = null
    },

    methodSelectOpenFile: function (index) {
      if (this.dataSaveFile.historyList.length != 0) {
        let historyList = Object.create(this.dataSaveFile.historyList);
        let fileName = historyList[index]
        if (fileName) {
          const reg = /(.*)(?:\.([^.]+$))/;
          this.dataSaveFile.openFileType = fileName.match(reg)[2];
          this.dataSaveFile.selectHistoryFile = fileName;
          this.dataSaveFile.selectHistoryIndex = index;
        }
      }
    },

    methodReadHistoryFileList: function () {
      if (!fs.existsSync(this.dataSaveFile.dataDirectory)) {
        fs.mkdirSync(this.dataSaveFile.dataDirectory);
      }

      let self = this

      fs.readdir(this.dataSaveFile.dataDirectory + path.sep, function (err, files) {
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
    },

    // saveFileボタンが押されたとき
    methodSaveFile: function (event) {
      let tempArray = []
      this.dataItemList.forEach(function (key) {
        if (key) {
          const set = this.methodSetContentItem(key)
          tempArray.push(set)
        }
      })

      let targetSaveData = JSON.stringify(tempArray);

      const fileNameDate = this.methodDateTimeString()
      let fileExtension = ".json"

      if (this.dataSaveFile.saveFileType == 'encrypt') {
        fileExtension = ".encjson"
        const encrypted = CryptoJS.AES.encrypt(targetSaveData, this.dataSaveFile.encryptKeyword)
        targetSaveData = encrypted.toString()
      }

      let optionSaveFileName = ''
      if (this.dataSaveFile.optionSaveFileName) {
        optionSaveFileName = '_' + this.dataSaveFile.optionSaveFileName
      }

      const fileName = this.dataSaveFile.dataDirectory + path.sep + fileNameDate + optionSaveFileName + fileExtension
      this.methodWriteFile(fileName, targetSaveData)
      this.dataDialog.save = false
      this.methodReadHistoryFileList()

    },

    // fileを保存（Pathと内容を指定）
    methodWriteFile: function (path, data) {
      fs.writeFile(path, data, (error) => {
        if (error != null) {
          alert('save error.')
        }
      })
    },


    methodSetWidthFrame() {
      return 'width:' + this.dataControlFrame.leftFrameWidth + 'px'
    },

    MethodStartResize() {
      this.dataControlFrame.isDragged = true
    },

    MethodResizeFrame(event) {
      if (event.buttons === 0) {
        this.methodEndResizeFrame()
        return
      }
      if (this.dataControlFrame.isDragged) {
        if (event.clientX + FRAME_ADJUSTED_SETTING < LEFT_FRAME_MIN_WIDTH) {
          this.dataControlFrame.leftFrameWidth = LEFT_FRAME_MIN_WIDTH
          return
        }
        console.log(event.clientX)
        this.dataControlFrame.leftFrameWidth = event.clientX + FRAME_ADJUSTED_SETTING
      }
    },

    methodEndResizeFrame() {
      this.dataControlFrame.isDragged = false
    }


  }
})
