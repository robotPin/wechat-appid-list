// panel/index.js, this filename needs to match the one registered in package.json
let packageName = "wechat-appid-list";
const Fs = require("fire-fs");
const Path = require("fire-path");
let Electron = require('electron');
var CfgUtil = Editor.require("packages://wechat-appid-list/core/CfgUtil");
// var chokidar = Editor.require('packages://' + packageName + '/node_modules/chokidar');

Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,
  // html template for panel
  template: Fs.readFileSync(
    Editor.url("packages://wechat-appid-list/panel/index.html"),
    "utf-8"
  ),
  // element and variable binding
  $: {
    
  },
  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.plugin = new window.Vue({
      el: this.shadowRoot,
      created() {},
      data: {
        /**小游戏跳转文件所在路径文件 */
        gameJsonPath:null,
        /**是否自动编译 */
        isAutoBuild:false,
        appIdList:[],
        nameList:[],
      },
      methods: {
        /**帮助按钮回调 */
        onBtnClickHelpDoc() {
          let url = "https://github.com/robotPin/wechat-appid-list";
          Electron.shell.openExternal(url);
        },
        onBtnClickTellMe() {
          let url = "http://wpa.qq.com/msgrd?v=3&uin=1067638746&site=qq&menu=yes";
          Electron.shell.openExternal(url);
        },
        /**选择小游戏保存的路径 */
        onBtnClickSelectJsonRootPath() {
          let res = Editor.Dialog.openFile({
              title: "选择微信小游戏下game.json文件的目录",
              defaultPath: Editor.Project.path,
              properties: ['openDirectory'],
          });
          if (res !== -1) {
            let dir = res[0];
            if (dir !== this.gameJsonPath) {
                this.gameJsonPath = dir;
            }
          }
        },
        /**打开小游戏保存的路径 */
        onBtnClickOpenJsonRootPath() {
          if (Fs.existsSync(this.gameJsonPath)) {
              Electron.shell.showItemInFolder(this.gameJsonPath);
              Electron.shell.beep();
          } else {
              Editor.log("目录不存在：" + this.gameJsonPath);
          }
        },
        /**读取APPID文件跟APPID名称文件 */
        _readAppidFile(){
          CfgUtil.initCfg(function(data){
            // Editor.log("read",data);
            this.isAutoBuild=data.isAutoBuild;
            this.gameJsonPath=data.gameJsonPath;
            this.appIdList=data.appIdList;
            this.nameList=data.nameList;
          }.bind(this));
        },
        //读取小游戏列表
        onBtnReadList(){
          this._readAppidFile();
        },
        /**写入文件 */
        onBtnWriteFile(){
          
        },
        /**把列表跟名称写入文件 */
        // 生成配置
        onBtnClickGen() {
          if(!this.gameJsonPath){
            Editor.log('请选择小游戏列表文件目录');
            return;
          }
          Editor.log('开始生成......');
          //保存配置文件
          CfgUtil.setConfig(this.isAutoBuild,this.appIdList,this.nameList,this.gameJsonPath);
          CfgUtil.saveGameJson();
        },
        onBtnClickAuto(){
          this.isAutoBuild=!this.isAutoBuild;
          CfgUtil.setConfig(this.isAutoBuild,this.appIdList,this.nameList,this.gameJsonPath);
        },
      }
    });
    this.plugin._readAppidFile();
  },

  // register your ipc messages here
  messages: {
    'wechatgame-appid-list:hello' (event) {
      Editor.log(" ------------editor:hello")
    },

  }
});
