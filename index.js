const fs = require('fs');
const path = require('path');
const {
  BrowserWindow,
  dialog
} = require('electron').remote;

const {
  clipboard
} = require('electron');

const isSecret = true
const LEFT_FRAME_MIN_WIDTH = 45;
const FRAME_ADJUSTED_SETTING = 10;

// html内の要素取得とリスナーの設定
const preview = document.getElementById('preview');

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {

    dataSaveFile: {
      boolVisibleIcon: false,
      encryptKeyword: "",
      dataDirectory: "data",
      historyList: null,
      openFileType: 'normal',
      saveFileType: 'normal',
      optionSaveFileName: '',
      selectHistoryFile: "",
    },

    dataDialog: {
      save: false,
      open: true,
    },

    width: null,
    isDragged: false,
    leftWidth: 600,
    centWidth: 10,


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
  mounted() {
    // this.methodOpenConfig()
    this.methodReadHistoryFileList()
  },

  computed: {
  },
  methods: {
    // methodOpenConfig: function (time) {
    // },

    methodOpenConfig: function () {

    },



    methodSleep: function (time) {
      const d1 = new Date();
      while (true) {
        const d2 = new Date();
        if (d2 - d1 > time) {
          return;
        }
      }
    },

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

    methodReload: function (event) {
      location.reload()
    },



    // selectDataCurrentItem: function (event) {
    selectDataCurrentItem: function (index) {
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


    addItem: function () {
      let dataItemList = Object.create(this.dataItemList);

      const set = {
        "name": "created at : " + this.currentDateTimeString(),
        "id": this.dataItemTemplate.id,
        "password": this.dataItemTemplate.password,
        "other1": this.dataItemTemplate.other1,
        "other2": this.dataItemTemplate.other2,
        "text": this.dataItemTemplate.text,
        "tagId": this.dataItemTemplate.tagId,
        "tagPassword": this.dataItemTemplate.tagPassword,
        "tagOther1": this.dataItemTemplate.tagOther1,
        "tagOther2": this.dataItemTemplate.tagOther2,
      };
      dataItemList.unshift(set);
      this.dataItemList = dataItemList;
      0
      this.selectDataCurrentItem(0)
      this.methodSetAllAppend("true")
    },

    pasteToClipBoard: function (position) {
      let self = this;
      this.dataPrependIcon[position] = true;
      clipboard.writeText(this.dataSelectItem[position])
      setTimeout(function () {
        self.dataPrependIcon[position] = false
      }, 500)
    },



    // 指定したファイルを読み込む
    methodReadFile: function () {
      // alert(path)

      fs.readFile(__dirname + path.sep + this.dataSaveFile.dataDirectory + path.sep + this.dataSaveFile.selectHistoryFile, (error, content) => {
        if (error != null) {
          alert('file open error.')
          return
        }

        // let data = content
        let targetReadData = content.toString()
        if (this.dataSaveFile.openFileType == 'encjson') {
          const decrypted = CryptoJS.AES.decrypt(targetReadData, this.dataSaveFile.encryptKeyword)
          targetReadData = decrypted.toString(CryptoJS.enc.Utf8)
          console.log(decrypted.toString(CryptoJS.enc.Utf8))
        }
        this.dataItemList = JSON.parse(targetReadData);
        this.dataDialog.open = false
        console.log(this.dataItemList)

      })
    },

    methodSelectOpenFile: function (fileName) {
      var reg = /(.*)(?:\.([^.]+$))/;
      console.log(fileName.match(reg)[2]);
      this.dataSaveFile.openFileType = fileName.match(reg)[2];
      this.dataSaveFile.selectHistoryFile = fileName;
    },



    methodReadHistoryFileList: function () {
      let self = this
      fs.readdir(__dirname + path.sep + this.dataSaveFile.dataDirectory + path.sep, function (err, files) {
        if (err) {
          console.log("error : " + err);
        }
        if (files.length == 0) {
          // バックアップファイルが一つもない場合、ダイアログを開かない
          console.log("not found files");
          self.dataDialog.open = false
        }
        self.dataSaveFile.historyList = files.slice().reverse();
      });
    },



    // saveFileボタンが押されたとき
    methodSaveFile: function (event) {
      if (!fs.existsSync(this.dataSaveFile.dataDirectory)) {
        fs.mkdirSync(this.dataSaveFile.dataDirectory);
      }

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
        if (error != null) {
          alert('save error.')
        }
      })
    },

    startResize() {
      this.isDragged = !this.isDragged
    },

    changeWidth() {
      return this.isDragged ? 'pink ' : 'grey'
    },

  }
})
