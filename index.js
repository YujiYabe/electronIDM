const fs = require('fs')
const {
  BrowserWindow,
  dialog
} = require('electron').remote
const {
  clipboard
} = require('electron')

const key = 'ssssssssssssssss'
const isSecret = true
const LEFT_FRAME_MIN_WIDTH = 45
const FRAME_ADJUSTED_SETTING = 10

// html内の要素取得とリスナーの設定
const preview = document.getElementById('preview')

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    show2: false,
    dataIdPrependIcon: false,


    aaa: '',

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
      id: false,
      password: false,
      other1: false,
      other2: false,
    },

    dataDictionary: {
      placeholderBody: "Please input ",
      placeholderTag: "changeable",
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

    dataItemtemplate: {
      name: "please input id",
      id: "please input id",
      password: "please input password",
      other1: "",
      other2: "",
      text: "",

      tagId: "ID",
      tagPassword: "password",
      tagOther1: "other1",
      tagOther2: "other2",
    }


  },
  mounted() { },
  methods: {


    sleep: function (time) {
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
      return index == this.dataSelectItem.index ?  "pink lighten-3" : "amber lighten-3"
    },

    reload: function (event) {
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
      return yyyy +"-"+ mm +"-"+ dd +" "+ hh +":"+ nn +":"+ ss;
    },


    setDataSelectItem: function (position) {
      let dataItem = Object.create(this.dataItemList[this.dataSelectItem.index]);
      console.log(dataItem)

      dataItem[position] = this.dataSelectItem[position];
      this.dataItemList[this.dataSelectItem.index] = dataItem;
    },


    addItem: function () {
      let dataItemList = Object.create(this.dataItemList);

      const set = {
        "name": "created at : " + this.currentDateTimeString(),
        "id": this.dataItemtemplate.id,
        "password": this.dataItemtemplate.password,
        "other1": this.dataItemtemplate.other1,
        "other2": this.dataItemtemplate.other2,
        "text": this.dataItemtemplate.text,
        "tagId": this.dataItemtemplate.tagId,
        "tagPassword": this.dataItemtemplate.tagPassword,
        "tagOther1": this.dataItemtemplate.tagOther1,
        "tagOther2": this.dataItemtemplate.tagOther2,
      };
      dataItemList.push(set);
      this.dataItemList = dataItemList;
      let aaa = this.dataItemList.length-1;
      this.selectDataCurrentItem(aaa)

    },

    pasteToClipBoard: function (position) {
      let self = this;
      this.dataPrependIcon[position] = true;
      clipboard.writeText(this.dataSelectItem[position])
      setTimeout(function () { self.dataPrependIcon[position] = false }, 500)
    },



    // 指定したファイルを読み込む
    readFile: function (path) {
      // alert(path)

      fs.readFile(path, (error, content) => {
        if (error != null) {
          alert('file open error.')
          return
        }

        // let data = content
        let data = content.toString()

        if (isSecret) {
          const decrypted = CryptoJS.AES.decrypt(data, key)
          data = decrypted.toString(CryptoJS.enc.Utf8)
          console.log(decrypted.toString(CryptoJS.enc.Utf8))
        }
        this.aaa = data
        // preview.value = decrypted.toString(CryptoJS.enc.Utf8)
      })
    },

    openFile: function (event) {
      const win = BrowserWindow.getFocusedWindow()
      dialog.showOpenDialog(
        win, {
        properties: ['openFile'],
        filters: [{
          name: 'Document',
          extensions: ['csv', 'txt']
          // extensions: ['txt']
        }]
      },
        (fileNames) => {
          if (fileNames.length) {
            // alert(fileNames[0])
            this.readFile(fileNames[0]) // 複数選択の可能性もあるので配列となる。
          }
        }
      )
    },

    // saveFileボタンが押されたとき
    saveFile: function (event) {
      const win = BrowserWindow.getFocusedWindow()
      dialog.showSaveDialog(
        win, {
        properties: ['openFile'],
        filters: [{
          name: 'Documents',
          extensions: ['txt']
          // extensions: ['csv', 'txt']
        }]
      },
        (fileName) => {
          if (fileName) {
            // let data = preview.textContent
            let data = this.aaa

            if (isSecret) {
              const encrypted = CryptoJS.AES.encrypt(data, key)
              data = encrypted.toString()
            }

            this.writeFile(fileName, data)
          }
        }
      )
    },

    // fileを保存（Pathと内容を指定）
    writeFile: function (path, data) {
      fs.writeFile(path, data, (error) => {
        if (error != null) {
          alert('save error.')
        }
      })
    },

    startResize() {
      this.isDragged = !this.isDragged
    },

    changeWitdh() {
      return this.isDragged ? 'pink ' : 'grey'
    },

    resizeFrame(event) {
      if (this.isDragged) {
        if (event.clientX + FRAME_ADJUSTED_SETTING < LEFT_FRAME_MIN_WIDTH) {
          this.leftWidth = LEFT_FRAME_MIN_WIDTH
          return
        }
        // console.log(event.clientX)
        this.leftWidth = event.clientX
      }
    }
  }
})
