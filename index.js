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
    aaa: '',
    width: null,
    isDragged: false,
    leftWidth: 600,
    centWidth: 10,
    dataItemList: [],
    dataSelectItem: {
      name: "",
      id: "",
      password: "",
      other1: "",
      other2: "",
      text: "",
    },

    dataItemtemplate: {
      name: "please input name",
      id: "please input id",
      password: "please input password",
      other1: " ",
      other2: " ",
      text: " ",
      tagId: "ID",
      tagPassword: "password",
      tagOther1: "other1",
      tagOther2: "other2",
    }


  },
  mounted() {},

  methods: {

    reload: function (event) {
      location.reload()
    },


    selectDataCurrentItem: function (event) {
      this.dataSelectItem.index = event.target.dataset.index;
      this.dataSelectItem.name = event.target.dataset.name;
      this.dataSelectItem.id = event.target.dataset.id;
      this.dataSelectItem.password = event.target.dataset.password;
      this.dataSelectItem.other1 = event.target.dataset.other1;
      this.dataSelectItem.other2 = event.target.dataset.other2;
      this.dataSelectItem.text = event.target.dataset.text;
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
      let ddd = ("000" + dt.getMilliseconds()).slice(-3);
      return yyyy + mm + dd + hh + nn + ss + ddd;
    },


    setDataSelectItem: function (position) {
      let dataItem = Object.create(this.dataItemList[this.dataSelectItem.index]);
      dataItem[position] = this.dataSelectItem[position];
      this.dataItemList[this.dataSelectItem.index] = dataItem;
    },


    addItem: function (event) {
      let dataItemList = Object.create(this.dataItemList);

      const set = {
        "name": this.dataItemtemplate.name,
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
    },

    pasteToClipBoard: function (position) {
      clipboard.writeText(this.dataSelectItem[position])
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
