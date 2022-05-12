
import { Conf } from "../core/conf";
import { Mouse } from "../core/mouse";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Segment } from "./segment";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _segment:Array<Segment> = [];
  private _nowSegment:Segment | undefined;
  private _nowSegmentId:number = 0;
  private _max:number = 100;

  constructor(opt:any) {
    super(opt)

    this._resize();
  }


  private _addSegment(): void {
    if(this._segment.length >= this._max && this._nowSegment != undefined) {
      if(this._nowSegmentId > this._segment.length - 1) {
        this._nowSegmentId = 0;
      }

      this._segment[this._nowSegmentId].setPos(this._nowSegment.getPin().x, this._nowSegment.getPin().y);
      this._nowSegment = this._segment[this._nowSegmentId];
      this._nowSegmentId++;
      return
    }

    let mx = Mouse.instance.x;
    let my = Mouse.instance.y;

    if(this._nowSegment != undefined) {
      mx = this._nowSegment.getPin().x;
      my = this._nowSegment.getPin().y;
    }

    const el = document.createElement('div')
    el.classList.add('item')
    this.getEl().append(el);
    const item = new Segment({
      el:el,
      id:this._segment.length,
    })
    this._segment.push(item);

    this._nowSegment = item;
    this._nowSegmentId = this._segment.length - 1;

    item.setPos(mx, my);
  }


  protected _update(): void {
    super._update();

    const mx = Mouse.instance.x;
    const my = Mouse.instance.y;

    // 毎フレームセグメントを追加
    if(Mouse.instance.dist > 5 || (Conf.instance.IS_SP && Mouse.instance.isDown)) {
      this._addSegment();
    }


    if(this._nowSegment != undefined) {
      const x = this._nowSegment.getPos().x;
      const y = this._nowSegment.getPos().y;

      const dx = mx - this._nowSegment.getPos().x;
      const dy = my - this._nowSegment.getPos().y;

      const radian = Math.atan2(dy, dx); // ラジアン
      this._nowSegment.setRot(Util.instance.degree(radian)); // 度に変換

      Tween.instance.set(this._nowSegment.getEl(), {
        x:x,
        y:y,
        rotationZ:this._nowSegment.getRot()
      })
    }
  }
}