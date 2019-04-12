
export default class GlobalMgr {

    private static _instance: GlobalMgr = null;

    private _urlList = [
        "prefabs/hex",
    ];

    private _hexPrefab: cc.Prefab = null;

    constructor() {
    }

    public static getInstance(): GlobalMgr {
        if (this._instance == null) {
            this._instance = new GlobalMgr();
        }
        return this._instance;
    }

    public loadAssets() {
        return new Promise((resolve, reject) => {
            cc.loader.loadResArray(this._urlList, cc.Asset, (completedCount: number, totalCount: number, item: any) => {

            }, (error: Error, resource: any[]) => {
                if (error) {
                    console.log("load assets error: " + error);
                    reject(error);
                } else {
                    console.log("load assets over!");
                    this._hexPrefab = resource[0];
                    resolve(resource);
                }
            });
        });
    }

    public getHexPrefab(): cc.Prefab {
        return this._hexPrefab;
    }


}
