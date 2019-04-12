
const { ccclass, property } = cc._decorator;

@ccclass
export default class HexItem extends cc.Component {

    @property([cc.SpriteFrame])
    spriteFrameList: cc.SpriteFrame[] = [];

    private _spId: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._spId = 0;
        this.setSprite(this._spId);
    }

    // start() {}
    // update (dt) {}

    public getSpriteId(): number {
        return this._spId;
    }

    public setSprite(id) {
        if (id < 0 && id > 5) {
            console.log("id error!");
            return;
        }
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteFrameList[id];
        this._spId = id;
    }

    public setPos(pos: Array<number>) {
        this.node.x = pos[0];
        this.node.y = pos[1];
    }
}
