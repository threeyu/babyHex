import { HEX_SHAPE } from "../Constants"
import Utils from "../Utils";
import GlobalMgr from "../GlobalMgr";
import HexGrid from "./HexGrid";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HexShape extends cc.Component {

    @property
    tileH: number = 74;// 单个六边形高度

    @property
    tileScale: number = 0.7;// 形状默认缩放值

    @property(HexGrid)
    board: HexGrid = null;



    private _globalMgr: GlobalMgr = GlobalMgr.getInstance();// 全局管理类
    private _utilsSingleton: Utils = Utils.getInstance();// 工具类
    private _shapeConf: any[] = null;// 六角形状配表

    private _randColor: number = this._utilsSingleton.getRandRound(1, 5);// 随机颜色
    private _originX: number = null;// 初始位置x
    private _originY: number = null;// 初始位置y

    private _boardTiles: any[] = null;// 保存棋盘与方块重合部分
    private _fillTiles: any[] = null;// 保存方块当前重合部分


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._shapeConf = HEX_SHAPE;

        this.create();
        this.addEvent();
    }

    // start() {}

    // update (dt) {}

    private create() {
        const hexData = this.getOneRandShape();
        let hexes = hexData.list.map(hex => {
            return this._utilsSingleton.hex2pixel(hex, this.tileH);
        });

        this.initHex(hexes);


        this.node.scale = this.tileScale;
        this._originX = this.node.x;
        this._originY = this.node.y;
    }

    // 随机出一个形状
    private getOneRandShape(): { type: number, list: any[] } {
        const shape = this._shapeConf[this._utilsSingleton.getRandRound(0, this._shapeConf.length)];
        const list = shape.list[this._utilsSingleton.getRandRound(0, shape.list.length)];
        // const shape = this._shapeConf[4];
        // const list = shape.list[5];
        return {
            type: shape.type,
            list: list
        }
    }

    private initHex(hexes) {
        for (let index = 0; index < hexes.length; ++index) {
            let node = cc.instantiate(this._globalMgr.getHexPrefab());
            let nodeCom = node.getComponent("HexCell");
            nodeCom.setPos([hexes[index].x, hexes[index].y]);
            node.parent = this.node;

            nodeCom.setSprite(this._randColor);
        }
    }

    // 形状与棋盘碰撞检测
    private checkCollision() {
        this._boardTiles = [];// 保存棋盘中重合的格子
        this._fillTiles = [];// 保存形状中重合的格子

        const tiles: cc.Node[] = this.node.children;
        for (let i = 0; i < tiles.length; ++i) {
            const tile: cc.Node = tiles[i];
            const pos: cc.Vec2 = this.node.position.add(tile.position);
            const boardTile = this.checkDistance(pos);
            if (boardTile) {
                this._boardTiles.push(boardTile);
                this._fillTiles.push(tile);
            }
        }

    }

    // 判断形状格子与棋盘格子间距离
    private checkDistance(pos: cc.Vec2): cc.Node {
        const distance: number = Math.floor(this.node.children[0].width / 2);// 单个格子的半径
        const boardFrameList: any[] = this.board.boardFrameList;// HexGrid棋盘中保存的格子信息
        for (let i = 0; i < boardFrameList.length; ++i) {
            const boardNode: cc.Node = boardFrameList[i];
            const nodeDistance = boardNode.position.sub(pos).mag();
            if (nodeDistance <= distance) {
                return boardNode;
            }
        }
        return null;
    }

    // 判断能否落子
    private checkCanDrop(): boolean {
        const boardTiles: any[] = this._boardTiles;// 当前棋盘与形状方块重合部分
        const fillTiles: any[] = this.node.children;// 当前形状的格子总数
        const boardTilesLen: number = boardTiles.length;
        const fillTilesLen: number = fillTiles.length;

        // 如果当前重合部分为0，或者重合部分的数量与当前形状格子的总数不一致，则不能落子
        if (boardTilesLen === 0 || boardTilesLen != fillTilesLen) {
            return false;
        }

        // 如果重合部分中存在有方块，则不能落子
        for (let i = 0; i < boardTilesLen; ++i) {
            if (boardTiles[i].isFulled) {
                return false;
            }
        }

        return true;
    }

    private resetBoardFrames() {
        const boardFrameList: any[] = this.board.boardFrameList;

        for (let i = 0; i < boardFrameList.length; ++i) {
            let node: cc.Node = boardFrameList[i];
            node.opacity = 255;
        }
    }

    private dropPrompt(canDrop: boolean) {
        const boardTiles: any[] = this._boardTiles;
        const boardTilesLen: number = boardTiles.length;

        this.resetBoardFrames();
        if (canDrop) {
            for (let i = 0; i < boardTilesLen; ++i) {
                let node: cc.Node = boardTiles[i];
                node.opacity = 100;
            }
        }
    }

    private tileDrop() {
        this.resetBoardFrames();
        if (this.checkCanDrop()) {
            const boardTiles = this._boardTiles;
            const fillTiles = this._fillTiles;
            const fillTileLen = fillTiles.length;

            for (let i = 0; i < fillTileLen; ++i) {
                const boardTile = boardTiles[i];
                const fillTile = fillTiles[i];
                const spId = fillTile.getComponent("HexCell").getSpriteId();

                boardTile.isFulled = true;
                boardTile.getComponent("HexCell").setSprite(spId);
            }
            this.resetTile();
        } else {
            this.backPos();
        }
    }

    private resetTile() {
        this.node.removeAllChildren();
        this.node.x = this._originX;
        this.node.y = this._originY;

        this.create();
    }

    private backPos() {
        this.node.scale = this.tileScale;
        this.node.x = this._originX;
        this.node.y = this._originY;

        this.node.children.forEach(child => {
            child.setScale(1);
        })
    }

    private onMyTouchStart(e: cc.Event.EventTouch) {
        this.node.setScale(1);
        this.node.children.forEach(child => {
            child.setScale(0.8);
        });


        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMyTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMyTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMyTouchEnd, this);
    }

    private onMyTouchMove(e: cc.Event.EventTouch) {
        const { x, y } = e.touch.getDelta();
        this.node.x += x;
        this.node.y += y;


        this.checkCollision();

        if (this.checkCanDrop()) {
            this.dropPrompt(true);
        } else {
            this.dropPrompt(false);
        }
    }

    private onMyTouchEnd(e: cc.Event.EventTouch) {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onMyTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onMyTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onMyTouchEnd, this);

        this.tileDrop();
    }

    private addEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMyTouchStart, this);
    }

    private removeEvent() {
        console.log("removeEvent");
        this.node.off(cc.Node.EventType.TOUCH_START, this.onMyTouchStart, this);
    }

    onDestroy() {
        this.removeEvent();
    }
}
