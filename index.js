const fs = require('fs');
const path = require('path');

const {
  clipboard
} = require('electron');

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {

    dataPosition: null,

    dataSaveFile: {
      boolVisibleIcon: false,
      encryptKeyword: "",
      dataDirectory: "data",
      historyList: null,
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

    isDragged: false,


    dataPrependIcon: {
      id: false,
      password: false,
      other1: false,
      other2: false,
    },

    dataAppendIcon: {
      all: false,
      id: false,
      password: false,
      other1: false,
      other2: false,
    },

    dataFreeWord: '',

    rules: {
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

    },

    dataItemList: [],
    dataSelectItem: {
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
  mounted () {
    this.methodReadHistoryFileList()
  },

  computed: {
  },
  methods: {
    methodSetPrependIcon: function (position) {
      return this.dataPrependIcon[position] ? 'mdi-check-bold' : 'mdi-clipboard'
    },

    methodSetAppendIcon: function (position) {
      return this.dataAppendIcon[position] ? 'visibility' : 'visibility_off'
    },

    methodSetAppendIconStatus: function (position) {
      this.dataAppendIcon[position] = !this.dataAppendIcon[position]
    },

    methodSetTextType: function (position) {
      return this.dataAppendIcon[position] ? 'text' : 'password'
    },

    methodSetColor: function (position) {
      return this.dataColorList[position]
    },

    methodSetItemListColor: function (index) {
      return index == this.dataSelectItem.index ? "pink lighten-3" : "amber lighten-3"
    },

    methodSetFileListColor: function (index) {
      return index == this.dataSaveFile.selectHistoryIndex ? "pink lighten-3" : "amber lighten-3"
    },

    methodSetAllAppend: function (statusString) {
      if (statusString == "neutral") {
        this.dataAppendIcon.all = !this.dataAppendIcon.all
      } else if (statusString == "true") {
        this.dataAppendIcon.all = true
      } else {
        this.dataAppendIcon.all = false
      }

      this.dataAppendIcon.id = this.dataAppendIcon.all
      this.dataAppendIcon.password = this.dataAppendIcon.all
      this.dataAppendIcon.other1 = this.dataAppendIcon.all
      this.dataAppendIcon.other2 = this.dataAppendIcon.all
    },

    methodDeleteItem: function () {
      let dataItemList = Object.create(this.dataItemList);
      const index = this.dataSelectItem.index;
      dataItemList.splice(index, 1);
      this.dataItemList = dataItemList
    },

    methodSelectDataCurrentItem: function (index) {

      let dataItem = Object.create(this.dataItemList[index]);

      this.dataSelectItem.index = index;
      this.dataSelectItem.name = dataItem.name;
      this.dataSelectItem.id = dataItem.id;
      this.dataSelectItem.password = dataItem.password;
      this.dataSelectItem.other1 = dataItem.other1;
      this.dataSelectItem.other2 = dataItem.other2;
      this.dataSelectItem.text = dataItem.text;

      this.dataSelectItem.tagId = dataItem.tagId;
      this.dataSelectItem.tagPassword = dataItem.tagPassword;
      this.dataSelectItem.tagOther1 = dataItem.tagOther1;
      this.dataSelectItem.tagOther2 = dataItem.tagOther2;
      this.methodSetAllAppend("false")

    },

    fillZero: function (number) {
      return (0 + number).slice(-2);
    },

    currentDateTimeString: function () {
      let dt = new Date();
      let yyyy = dt.getFullYear();
      let mm = ("00" + (dt.getMonth() + 1)).slice(-2);
      let dd = ("00" + dt.getDate()).slice(-2);
      let hh = ("00" + dt.getHours()).slice(-2);
      let nn = ("00" + dt.getMinutes()).slice(-2);
      let ss = ("00" + dt.getSeconds()).slice(-2);
      // let ddd = ("000" + dt.getMilliseconds()).slice(-3);
      // return yyyy + mm + dd + hh + nn + ss + ddd;
      // return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + nn + ":" + ss;
      return yyyy + "-" + mm + "-" + dd + "--" + hh + "-" + nn + "-" + ss;
    },

    setDataSelectItem: function (position) {
      let dataItem = Object.create(this.dataItemList[this.dataSelectItem.index]);
      // console.log(dataItem)
      if (position == "name" && this.dataSelectItem[position] == "") {
        this.dataSelectItem[position] = "can't empty"
      }
      dataItem[position] = this.dataSelectItem[position];
      this.dataItemList[this.dataSelectItem.index] = dataItem;
    },

    methodCopyItem: function () {
      let dataItemList = Object.create(this.dataItemList);


      const set = {
        "name": this.dataSelectItem.name,
        "id": this.dataSelectItem.id,
        "password": this.dataSelectItem.password,
        "other1": this.dataSelectItem.other1,
        "other2": this.dataSelectItem.other2,
        "text": this.dataSelectItem.text,
        "tagId": this.dataSelectItem.tagId,
        "tagPassword": this.dataSelectItem.tagPassword,
        "tagOther1": this.dataSelectItem.tagOther1,
        "tagOther2": this.dataSelectItem.tagOther2,
      };

      dataItemList.unshift(set);
      this.dataItemList = dataItemList;
      this.methodSelectDataCurrentItem(0);
      this.methodSetAllAppend("true");

    },


    methodAddItem: function (type) {
      let dataItemList = Object.create(this.dataItemList)
      let itemType = null
      let afterAddShow = 'false'
      if (type == 'new') {
        itemType = Object.create(this.dataItemTemplate)
        itemType.name = "created at : " + this.currentDateTimeString()
        afterAddShow = 'true'
      } else if (type == 'copy') {
        itemType = Object.create(this.dataSelectItem)
        afterAddShow = 'false'
      }

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
      dataItemList.unshift(set);
      this.dataItemList = dataItemList;
      this.methodSelectDataCurrentItem(0);
      this.methodSetAllAppend(afterAddShow);
    },

    pasteToClipBoard: function (position) {
      let self = this;
      this.dataPrependIcon[position] = true;
      clipboard.writeText(this.dataSelectItem[position])
      setTimeout(function () {
        self.dataPrependIcon[position] = false
      }, 500)
    },

    // 整形表現に一致すればクラスis-showを返却
    methodFilterCondition: function (itemName) {
      let freeWordList = this.dataFreeWord.split(" ");
      if (this.dataFreeWord == "") {
        return "is-show";
      } else {
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

    // 指定したファイルを読み込む
    methodReadFile: function () {

      fs.readFile(this.dataSaveFile.dataDirectory + path.sep + this.dataSaveFile.selectHistoryFile, (error, content) => {
        if (error != null) {
          alert('file open error.')
          return
        }
        let targetReadData = content.toString()
        if (this.dataSaveFile.openFileType == 'encjson') {
          const decrypted = CryptoJS.AES.decrypt(targetReadData, this.dataSaveFile.encryptKeyword)
          targetReadData = decrypted.toString(CryptoJS.enc.Utf8)
        }
        this.dataItemList = JSON.parse(targetReadData);
        this.dataDialog.open = false
      })
    },

    methodRemoveFile: function () {
      const index = this.dataSaveFile.selectHistoryIndex;
      const fileName = this.dataSaveFile.historyList[index]
      // console.log(this.dataSaveFile.historyList[index])
      fs.unlinkSync(this.dataSaveFile.dataDirectory + path.sep + fileName);
      this.methodReadHistoryFileList()
    },

    methodSelectOpenFile: function (index) {
      let historyList = Object.create(this.dataSaveFile.historyList);
      let fileName = historyList[index]
      var reg = /(.*)(?:\.([^.]+$))/;
      this.dataSaveFile.openFileType = fileName.match(reg)[2];
      this.dataSaveFile.selectHistoryFile = fileName;
      this.dataSaveFile.selectHistoryIndex = index;
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
        } else {
          self.dataDialog.open = true
        }
        self.dataSaveFile.historyList = files.slice().reverse();
      });
    },

    // saveFileボタンが押されたとき
    methodSaveFile: function (event) {
      let temp = []
      this.dataItemList.forEach(function (key) {
        if (key) {
          const set = {
            name: key.name,
            id: key.id,
            password: key.password,
            other1: key.other1,
            other2: key.other2,
            text: key.text,
            tagId: key.tagId,
            tagPassword: key.tagPassword,
            tagOther1: key.tagOther1,
            tagOther2: key.tagOther2,
          }
          temp.push(set)
        }
      }
      )

      let targetSaveData = JSON.stringify(temp);

      const fileNameDate = this.currentDateTimeString()
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

    },

    // fileを保存（Pathと内容を指定）
    methodWriteFile: function (path, data) {
      fs.writeFile(path, data, (error) => {
        // fs.writeFileSync(path, data, (error) => {
        if (error != null) {
          alert('save error.')
        }
      })
    },

    startResize () {
      this.isDragged = !this.isDragged
    },

    changeWidth () {
      return this.isDragged ? 'pink ' : 'grey'
    },

  }
})
