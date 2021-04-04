/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '@framework/live2dcubismframework';

/**
 * Sample Appで使用する定数
 */
// 画面
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// モデル定義---------------------------------------------

// 外部定義ファイル（json）と合わせる
export const MotionGroupIdle = 'Idle'; // アイドリング
export const MotionGroupTapBody = 'TapBody'; // 体をタップしたとき

// 外部定義ファイル（json）と合わせる
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';

// モーションの優先度定数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// デバッグ用ログの表示オプション

export const DebugTouchLogEnable = false;

// Frameworkから出力するログのレベル設定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

//游戏状态机
export enum States{
    NORMAL,
    MOVIE,
    MOVIEPRO,
    CHOOSE,
    LOADING,
    BATTLE
}

//组件枚举
export enum Comps{
    LOAD,
    SAVE,
    SETTING,
    HELPER, //帮助
    DRAWER, //画廊
    MUSICER, //音乐
    LITTER, //信件
}

export const DELAY_TIME=800;

//游戏状态机中-哪些要做
export const StatesDeal = {
    'clickable': [States.NORMAL,States.MOVIE,States.MOVIEPRO]
};
//部署的时候：
//export const phpPath="../newphp/";
//单独起它的时候：
export const phpPath="http://localhost:80/newphp/";

//false内容：
//不打印log
//存档变成3页
//只有接受user才能进游戏
//打开回到原点按钮
export const DebugLogEnable = true;