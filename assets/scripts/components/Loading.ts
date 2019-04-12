import GlobalMgr from "../GlobalMgr";

const { ccclass, property } = cc._decorator;

const initMgr = () => {

}

@ccclass
export default class Loading extends cc.Component {

    private _targetScene: string = "game_scene";
    private _globalMgr: GlobalMgr = GlobalMgr.getInstance();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {



        this.loadAll();
    }

    // start () {}

    // update (dt) {}

    private async loadAll() {
        await this._globalMgr.loadAssets();


        await this.loadRdy();
    }

    private loadRdy() {
        cc.director.preloadScene(this._targetScene, (completedCount: number, totalCount: number, item: any) => {

        }, (error: Error, asset: cc.SceneAsset) => {
            cc.director.loadScene(this._targetScene);
        });
    }
}
