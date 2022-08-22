import ResMgr from "../Managers/ResMgr";
import ResPkg from "./GameResPkg";

export default class Game extends cc.Component {
    public static Instance: Game = null;

    onLoad(): void {
        if(Game.Instance === null) {
            Game.Instance = this;
        }
        else {
            this.destroy();
            return;
        }


    }

    public StartGame(): void {
        var loading = this.node.getChildByName("ResLoading");
        var progressValue: cc.Sprite = loading.getChildByName("UIProgress").getChildByName("value").getComponent(cc.Sprite);
        progressValue.fillRange = 0;
        // 预加载资源
        ResMgr.Instance.preloadResPkg(ResPkg, (now, total)=>{
            var per = now / total;
            progressValue.fillRange = per;

        }, ()=>{
            loading.destroy();
            this.EnterGameScene();
        });
        // end

    }

    public EnterGameScene(): void {
        console.log("EnterGameScene");

        // 释放游戏地图
        var mapPrefab = ResMgr.Instance.getAsset("TestWorld", "Maps/Level1");
        var map = cc.instantiate(mapPrefab);
        this.node.addChild(map);
        map.y += 160;
        // end

        // 根据地图释放角色，NPC，物品等
        var playerPrefab = ResMgr.Instance.getAsset("TestWorld", "Charactors/Player_1");
        var player = cc.instantiate(playerPrefab);
        this.node.addChild(player);
        player.setPosition(cc.v2(0, 0));
        // end

        // // 释放游戏UI
        var uiGamePrefab = ResMgr.Instance.getAsset("TestWorld", "GUI/ui_prefabs/GameUI");
        var uiGame:cc.Node = cc.instantiate(uiGamePrefab);
        this.node.addChild(uiGame);

        let script = ResMgr.Instance.getAsset("TestWorld","Scripts/TestScript");
        uiGame.addComponent(script);
        // end
    }
}
