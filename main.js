'use strict';
var CfgUtil = require('./core/CfgUtil');
/**小游戏跳转文件所在路径文件 */
var isAutoBuild=false;

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('wechat-appid-list');
    },
    'editor:build-start': function (event, target) {
      if (target.platform === "wechatgame"){
        CfgUtil.initCfg(function(data){
          isAutoBuild = data.isAutoBuild;
          // Editor.log(" ------------editor:build-start",isAutoBuild);
        });
        // Editor.log(" ------------editor:build-start");
      }
    },
    // 当插件构建完成的时候触发
    'editor:build-finished': function (event, target) {
      if (target.platform === "wechatgame"){
        //微信编译完成时执行
        // Editor.log(" ------------editor:build-finished")
        if(isAutoBuild){
          CfgUtil.saveGameJson();
        }
      }
    },
  },
};