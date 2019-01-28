var FS = require('fire-fs');
var path = require('path');
// const {remote} = require('electron');

let self = module.exports = {
    cfgData: {
        isAutoBuild : false,
        gameJsonPath:null,
        appIdList : [],
        nameList : [],
    },
    gameJsonData:{
        /**小游戏跳转列表 */
        navigateToMiniProgramAppIdList:[]
    },
    /**读取并修改小游戏配置文件 */
    saveGameJson(){
        let jsonPath =  self.cfgData.gameJsonPath+"\\game.json";
        if (FS.existsSync(jsonPath)) {
            let data = FS.readFileSync(jsonPath, 'utf-8');
            let saveData = JSON.parse(data.toString());
            saveData.navigateToMiniProgramAppIdList=[];
            for(let appid of self.cfgData.appIdList){
                if(appid.length > 15){
                    saveData.navigateToMiniProgramAppIdList.push(appid);
                }
            }
            // Editor.log("readGameJson",saveData.navigateToMiniProgramAppIdList);
            FS.writeFile(jsonPath, JSON.stringify(saveData), function (error) {
                if (!error) {
                    Editor.log("生成配置成功!");
                }
            }.bind(this));
        }else{
          Editor.log('请先编译微信小游戏后再生成小游戏列表。');
        }

    },
    setIsCompress(b) {
        this.saveConfig();
    },
    setConfig(isAutoBuild, appIdList, nameList,gameJsonPath) {
        this.cfgData.isAutoBuild = isAutoBuild;
        this.cfgData.appIdList = appIdList;
        this.cfgData.nameList = nameList;
        this.cfgData.gameJsonPath = gameJsonPath;
        this.saveConfig();
    },
    //
    saveConfig() {
        let configFilePath = self._getAppCfgPath();
        FS.writeFile(configFilePath, JSON.stringify(this.cfgData), function (error) {
            if (!error) {
                // Editor.log("保存配置成功!");
            }
        }.bind(this));
    },
    cleanConfig() {
        FS.unlink(this._getAppCfgPath());
    },
    _getAppCfgPath() {
        return Editor.url('packages://wechat-appid-list/save/cfg.json');
    },
    initCfg(cb) {
        let configFilePath = this._getAppCfgPath();
        if (FS.existsSync(configFilePath)) {
            Editor.log("cfg path: " + configFilePath);
            // FS.readFile(configFilePath, 'utf-8', function (err, data) {
            //     if (!err) {
            //         let saveData = JSON.parse(data.toString());
            //         self.cfgData = saveData;
            //         if (cb) {
            //             cb(saveData);
            //         }
            //     }
            // }.bind(self));

            let data = FS.readFileSync(configFilePath, 'utf-8');
            let saveData = JSON.parse(data.toString());
            self.cfgData = saveData;
            // saveData.appIdList=["11111111111","222222222222"];
            // Editor.log(saveData.isAutoBuild);
            // Editor.log(saveData.appIdList);
            // Editor.log(saveData.nameList);
            // Editor.log(saveData.gameJsonPath);
            if (cb) {
                cb(saveData);
            }

        } else {
            if (cb) {
                cb(null);
            }
        }
    }
};