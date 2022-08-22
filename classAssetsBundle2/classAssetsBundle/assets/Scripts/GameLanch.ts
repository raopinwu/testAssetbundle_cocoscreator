import Game from "./Game/Game";
import ResMgr from "./Managers/ResMgr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class GameLanch extends cc.Component {
    private static Instance: GameLanch = null;
    onLoad(): void {
        if(GameLanch.Instance === null) {
            GameLanch.Instance = this;
        }
        else {
            this.destroy();
            return;
        }

        // 初始化游戏框架: 资源管理，声音管理，UI管理，网络管理，日志管理，...
        this.node.addComponent(ResMgr);
        //end

        // 初始化游戏模块
        this.node.addComponent(Game);
        // end
    }

    start(): void {
        // 检测资源你更新
        // end
        ResMgr.Instance.init();
        Game.Instance.StartGame();
    }
}
