/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { Live2DCubismFramework as cubismmatrix44 } from '@framework/math/cubismmatrix44';
import { Live2DCubismFramework as acubismmotion } from '@framework/motion/acubismmotion';
import Csm_CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import ACubismMotion = acubismmotion.ACubismMotion;
import vue from './main';
import { LAppModel } from './lappmodel';
import { canvas } from './lappdelegate';
import * as LAppDefine from './lappdefine';
export let s_instance: LAppLive2DManager = null;

/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
export class LAppLive2DManager {
  /**
   * クラスのインスタンス（シングルトン）を返す。
   * インスタンスが生成されていない場合は内部でインスタンスを生成する。
   *
   * @return クラスのインスタンス
   */
  public static getInstance(): LAppLive2DManager {
    if (s_instance == null) {
      s_instance = new LAppLive2DManager();
    }

    return s_instance;
  }

  /**
   * クラスのインスタンス（シングルトン）を解放する。
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance = void 0;
    }

    s_instance = null;
  }

  /**
   * 現在のシーンで保持しているモデルを返す。
   *
   * @param no モデルリストのインデックス値
   * @return モデルのインスタンスを返す。インデックス値が範囲外の場合はNULLを返す。
   */
  public getModel(name: string): LAppModel {
    if (typeof (this._models[name]) != undefined) {
      return this._models[name];
    }
    return null;
  }

  public getActiveModelPosition(): string {
    if (this._active_model != null) {
      if (this._active_model == this._right_model)
        return "right"
      else if (this._active_model == this._left_model)
        return "left"
    }
    return "middle"
  }

  /**
   * 現在のシーンで保持しているすべてのモデルを解放する
   */
  public releaseAllModel(): void {

    for (let item in this._models) {
      this._models[item].release();
      this._models[item] = null;
    }
    this._models = {};
  }

  /**
   * 画面をドラッグした時の処理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onDrag(x: number, y: number): void {
    // for (let i = 0; i < this._models.getSize(); i++) {
    //   const model: LAppModel = this.getModel();

    //   if (model) {
    //     model.setDragging(x, y);
    //   }
    // }
  }


  /**
   * 转换表情
   * @param emotion 
   * @param chara 
   */
  public changeEmotion(emotion: string) {
    if (this._active_model == null) return;

    this._active_model
      .startMotion(
        LAppDefine.MotionGroupIdle,
        emotion,
        LAppDefine.PriorityNormal,
        this._finishedMotion
      );
  }

  /**
   * 转换活跃类
   */

  public changeLeftModel(chara?: string) {
    this._left_model = this.changeSomeModel(this._left_model, chara);

  }
  public changeMiddleModel(chara: string) {
    this._middle_model = this.changeSomeModel(this._middle_model, chara);
  }

  public changeRightModel(chara: string) {
    this._right_model = this.changeSomeModel(this._right_model, chara);
  }

  public isNameHasModel(name: string): boolean {
    if (this._models[name]) {
      return true;
    }
    else return false;
  }

  public clearActiveModel() {
    this._active_model = null;
  }

  public changeSomeModel(model: LAppModel, chara?: string): LAppModel {
    //图像为空
    if (!chara || chara == "") {
      if (model != null) {
        this._active_value--;
        this.changeActiveModel(null);
      }
      return null;
    }
    //查找到图像
    else if (this._models[chara]) {
      //null->
      if (model == null) {
        this._active_value++;
        this.changeSliper(chara);
      }
      //此图像并非null，可当前的人物并非是它
      else if (model != this._models[chara]) {
        this.changeSliper(chara);
      }
      this.changeActiveModel(this._models[chara]);
      return this._models[chara];
    }
    //未查找到图像，调用静态img
    this.changeActiveModel(null);
    return null;
  }


  public changeActiveModel(newModel: LAppModel) {
    this._active_model = newModel;
    if (this._per_fade_flag) {
      this._fading_in_charactor = this._active_model;
      this._per_fade_flag = false;
    }
  }

  public resetActiveOpacity() {
    if (this._active_model.getOpacity() <= 0) {
      this._active_model.setOpacity(1);
    }
  }


  public fadeout(chara?: string): void {
    if (!chara) {
      this._fading_out_charactor = this._active_model;
    }
    if (this._models[chara]) {
      this._fading_out_charactor = this._models[chara];
    }
  }

  public fadein(chara?: string): void {
    this._per_fade_flag = true;
  }

  public clear(): void {
    if (this._active_model != null) {
      if (this._active_model == this._right_model) {
        this.changeRightModel(null);
      }
      else if (this._active_model == this._middle_model) {
        this.changeMiddleModel(null);
      }
      else if (this._active_model == this._left_model) {
        this.changeLeftModel(null);
      }
    }
  }

  public changeSliper(chara: string) {
    if (this._models[chara]) {
      this._models[chara]._sliper = false;
    }
  }


  /**
   * 画面を更新するときの処理
   * モデルの更新処理及び描画処理を行う
   */
  public onUpdate(): void {
    let projection: Csm_CubismMatrix44 = new Csm_CubismMatrix44();

    const { width, height } = canvas;
    projection.scale(1.0, width / height);
    if (this._viewMatrix != null) {
      projection.multiplyByMatrix(this._viewMatrix);
    }
    const saveProjection: Csm_CubismMatrix44 = projection.clone();
    //处理淡出状态
    if (this._fading_out_charactor != null) {
      let opa = this._fading_out_charactor.getOpacity();
      if (opa > 0) {
        this._fading_out_charactor.setOpacity(opa - 0.02);
      }
      else {
        this._fading_out_charactor.setOpacity(0);
        this._fading_out_charactor = null;
      }
    }
    //处理淡入状态
    if (this._fading_in_charactor != null) {
      let opa = this._fading_in_charactor.getOpacity();
      if (opa == 1) {
        this._fading_in_charactor.setOpacity(0);
      }
      else if (opa < 1) {
        this._fading_in_charactor.setOpacity(opa + 0.02);
      }
      else {
        this._fading_in_charactor.setOpacity(1);
        this._fading_in_charactor = null;
      }
    }

    //3个model依次处理
    if (this._left_model != null) {
      projection = saveProjection.clone();
      let offset = -0.6;
      if (this._active_value == 1) {
        offset = 0;
      }
      else if (this._active_value == 2) {
        offset = -0.4;
      }
      this.calNextOffset(this._left_model, offset);

      projection.translateRelative(this._left_model._offset, -0.07);
      this._left_model.update();
      this._left_model.draw(projection, this._left_model == this._active_model ? 1 : 0.5);
    }
    //中model位移及渲染
    if (this._middle_model != null) {
      projection = saveProjection.clone();
      let offset = 0;
      if (this._active_value == 2 && this._left_model != null) {
        offset = 0.4
      }
      else if (this._active_value == 2 && this._right_model != null) {
        offset = -0.4
      }
      this.calNextOffset(this._middle_model, offset);
      projection.translateRelative(this._middle_model._offset, -0.07);
      this._middle_model.update();
      this._middle_model.draw(projection, this._middle_model == this._active_model ? 1 : 0.5);
    }
    //右model位移及渲染
    if (this._right_model != null) {
      projection = saveProjection.clone();
      let offset = 0.6;
      if (this._active_value == 1) {
        offset = 0;
      }
      else if (this._active_value == 2) {
        offset = 0.4
      }
      this.calNextOffset(this._right_model, offset);
      projection.translateRelative(this._right_model._offset, -0.07);
      this._right_model.update();
      this._right_model.draw(projection, this._right_model == this._active_model ? 1 : 0.5);
    }

  }

  private calNextOffset(model: LAppModel, offset: number): void {
    if (model._sliper) {
      //一侦移动this._offset_value
      if (model._offset > offset + this._offset_value) {
        model._offset -= this._offset_value;
      }
      else if (model._offset < offset - this._offset_value) {
        model._offset += this._offset_value;
      }
    }
    else {
      if (model._offset != offset) {
        model._offset = offset;
      }
      model.resetSliper();
    }
  }

  /**
   * 加载人物模型
   */
  public changeScene(name: string, model: string): Promise<void> {
    if (model && !this._models[model]) {
      return new Promise(resolve => {
        const modelPath: string = `./Resources/${vue.$store.getters.gameName}/live2d/${model}/`;
        this._models[model] = new LAppModel();
        this._models[model].loadAssets(modelPath, model, name).then(() => {
          resolve();
        });
      })
    }
    else return new Promise(r => { r(); });
  }

  public clearAll(): void {
    this._left_model = null;
    this._right_model = null;
    this._middle_model = null;
    this._active_value = 0;
  }
  /**
   * コンストラクタ
   */
  constructor() {
    this._viewMatrix = new Csm_CubismMatrix44();
    this._left_model = null;
    this._right_model = null;
    this._middle_model = null;
    this._last_active_model = null;
    this._per_fade_flag = false;
    this._active_value = 0;
    this._models = {};
    this._offset_value = 0.015;
    this._sceneIndex = 0;
    this._fading_out_charactor = null;
    this._fading_in_charactor = null;
  }


  public initCharactorsByList(chars: string[], bkgs: string[]): Promise<void> {
    //释放所有资源,待优化
    this.clearAll();
    //this.releaseAllModel();
    return new Promise(resolve => {
      vue.$store.commit("setTotalPresent", chars.length + bkgs.length);
      for (let item of chars) {
        this.changeScene(item, vue.$store.getters.charactorMap[item]).then(() => {
          vue.$store.commit("addPresent");
          if (vue.$store.getters.getPresent >= 100) {
            //完成全部加载
            this._active_model = this._left_model;
            resolve();
          }
        })
      }
      for (let bkg of bkgs) {
        this.newImg(bkg).then(() => {
          vue.$store.commit("addPresent");
          if (vue.$store.getters.getPresent >= 100) {
            //完成全部加载
            this._active_model = this._left_model;
            resolve();
          }
        })
      }
    })
  }
  private newImg(src): Promise<void> {
    return new Promise((resolve) => {
      let img = new Image();
      img.onload = function () {
        resolve();
      }
      img.onerror = function () {
        resolve();
      }
      img.src = `./Resources/${vue.$store.getters.gameName}/bkg/${src}.jpg`;
    })
  }

  _left_model: LAppModel;
  _right_model: LAppModel;
  _middle_model: LAppModel;
  _last_active_model: LAppModel;
  _per_fade_flag: boolean;
  _active_model: LAppModel;
  _active_value: number;
  _offset_value: number;


  _fading_out_charactor: LAppModel;
  _fading_in_charactor: LAppModel;

  _viewMatrix: Csm_CubismMatrix44; // モデル描画に用いるview行列
  _models: object;//Map<string, LAppModel>; // モデルインスタンスのコンテナ
  _sceneIndex: number; // 表示するシーンのインデックス値
  // モーション再生終了のコールバック関数
  _finishedMotion = (self: ACubismMotion): void => {
  };
}
