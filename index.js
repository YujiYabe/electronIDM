const Util = require('./util');

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

    methodSetListColor: function (targetName, index) {
      const selectColor = this.dataColorList.targetSelected
      const UnselectColor = this.dataColorList.targetUnselected
      let targetType = this.dataSaveFile.selectHistoryIndex;

      if (targetName == 'item') {
        targetType = this.dataSelectedItem.index;
      }
      return index == targetType ? selectColor : UnselectColor
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
        itemType.name = "created at : " + Util.dateTimeString()
        afterAddShow = 'true'
        this.dataFilterWord = null
      } else if (type == 'copy') {
        itemType = Object.create(this.dataSelectedItem)
        afterAddShow = 'false'
      }

      const set = Util.methodSetContentItem(itemType)

      dataItemList.unshift(set);
      this.dataItemList = dataItemList;
      this.methodSetSelectedItem(0);
      this.methodSetAllVisible(afterAddShow);
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
      Util.readFile(this)
    },

    methodRemoveFile: function () {
      Util.methodRemoveFile(this)
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
      Util.methodReadHistoryFileList(this)
    },

    // saveFileボタンが押されたとき
    methodSaveFile: function () {
      Util.methodSaveFile(this)
    },

    MethodResizeFrame(event) {
      if (event.buttons === 0) {
        Util.methodEndResizeFrame(this)
        return
      }
      if (this.dataControlFrame.isDragged) {
        if (event.clientX + FRAME_ADJUSTED_SETTING < LEFT_FRAME_MIN_WIDTH) {
          this.dataControlFrame.leftFrameWidth = LEFT_FRAME_MIN_WIDTH
          return
        }
        this.dataControlFrame.leftFrameWidth = event.clientX + FRAME_ADJUSTED_SETTING
      }
    },

  }
})
