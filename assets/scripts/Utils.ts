

export default class Utils {

    private static _instance: Utils = null;


    constructor() {
    }

    public static getInstance(): Utils {
        if (this._instance == null) {
            this._instance = new Utils();
        }
        return this._instance;
    }

    /**
     * 返回范围内随机数
     * @param min 最小
     * @param max 最大
     */
    public getRandRound(min: number, max: number): number {
        return min + Math.floor((max - min) * Math.random());
    }

    /**
     * 棋盘六角网格，坐标系转换像素方法
     * @param hex 轴坐标[q,r]
     * @param h 六角网格高度
     */
    public hex2pixel(hex: Array<number>, h: number) {
        let size = h / 2;
        let x = size * Math.sqrt(3) * (hex[0] + hex[1] / 2);
        let y = ((size * 3) / 2) * hex[1];
        return cc.v2(x, y);
    }

}
