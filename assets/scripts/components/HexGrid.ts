import GlobalMgr from "../GlobalMgr";
import Utils from "../Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HexGrid extends cc.Component {

    @property
    hexSize: number = 4;// 六边形地图边界数

    @property
    tileH: number = 74;// 单个六边形高度

    public boardFrameList: any[] = null;


    private _globalMgr: GlobalMgr = GlobalMgr.getInstance();
    private _utilsSingleton: Utils = Utils.getInstance();



    private _hexes: any[] = null;
    private _qres: any[] = null;




    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.setHexGrid();
    }

    // start() {}

    // update (dt) {}


    // 棋盘六角网格布局，坐标系存储方法
    private setHexGrid() {
        this.boardFrameList = [];

        this._hexes = [];
        this._qres = [];
        this.hexSize--;
        for (let q = -this.hexSize; q <= this.hexSize; ++q) {
            let r1 = Math.max(-this.hexSize, -q - this.hexSize);
            let r2 = Math.min(this.hexSize, -q + this.hexSize);
            for (let r = r1; r <= r2; ++r) {
                let col = q + this.hexSize;
                let row = r - r1;
                if (!this._hexes[col]) {
                    this._hexes[col] = [];
                    this._qres[col] = [];
                }
                this._hexes[col][row] = this._utilsSingleton.hex2pixel([q, r], this.tileH);
                this._qres[col][row] = [q, r];
            }
        }

        this._hexes.forEach(hexs => {
            this.initHexGrid(hexs);
        });
    }

    private initHexGrid(hexes) {
        for (let index = 0; index < hexes.length; ++index) {
            let node = cc.instantiate(this._globalMgr.getHexPrefab());
            let nodeCom = node.getComponent("HexCell");
            nodeCom.setPos([hexes[index].x, hexes[index].y]);
            node.parent = this.node;
            this.boardFrameList.push(node);// 这一行，保存当前棋盘的格子的信息，用于后面落子判定、消除逻辑等处理



            let newNode = new cc.Node("lb");
            newNode.y = -10;
            let lb = newNode.addComponent(cc.Label);
            let id = this._hexes.indexOf(hexes);
            lb.fontSize = 24;
            lb.string = this._qres[id][index][0] + "," + this._qres[id][index][1];
            newNode.parent = node;
        }
    }

}
