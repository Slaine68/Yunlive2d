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

// 相対パス
export const ResourcesPath = './Resources/';

// モデルの後ろにある背景の画像ファイル
export const BackImageName = 'snow_tower.png';

// 歯車
export const GearImageName = 'icon_gear.png';

// 終了ボタン
export const PowerImageName = 'CloseNormal.png';

// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
export const ModelDir: string[] = ['aoi','yoru', 'Hiyori'];
export const ModelDirSize: number = ModelDir.length;

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

export var gameSetting={
    startChap:"w0",
    gameName:'yunweb',
    user:''
};

//角色映射图
export const charactorMap = {
    '霜阳明':'akira',
    '苹果': 'apple',
    '玉宁':'baihan',
    '青寒': 'aoi',
    '青寒x': 'aoi-x',
    '碧寒': 'bi',
    '才英':'caiying',
    '辉夜长青':'changqing',
    '辉夜长邪':'changye',
    '林正央':'lin',
    '崇武将军':'chongwu',
    '风晴':'fengqing',
    '风禾':'fenghe',
    '绯夜':'firebird',
    '军相':'firebird',
    '冬月':'fuyu',
    '冬月x':'fuyu-x',
    '晴夕':'haru',
    '上官星展': 'hoshi',
    '鲸': 'jing',
    '秦江淮': 'kawa',
    '若风':'kaze',
    '金寒': 'kin',
    '风月': 'kin',
    '金寒y': 'kiny',
    '露露': 'lulu',
    '夏月':'natsu',
    '黑阳':'kuro',
    '欧阳芷谙':'oyang',
    '商辰':'shangchen',
    '霜初':'shuangchu',
    '霜阳初':'shuangyangchu',
    '霜阳麒':'shuangqi',
    '霜阳蠡竹':'lizhu',
    '上官月展':'tsuki',
    '上官十五':'shiwu',
    '上官辰巳':'chensi',
    '李冥夜': 'yoru',
    '盲剑':'ken',
    '梦羽':'yume',
    '白羽':'haku',
    '星展':'shoshi',
    '战颜将军':'zhanyan',
    '葛菁芷':'jingzhi',
    '许文政':'wenzheng',
    '烟牙':'smoke',
    '遥谙':'yaoan',
    '芋圆':'yuyuan',
    'cglive':'cglive',
};


//角色映射图
export const charactorColor = {
    '青寒': 'green',
    '碧寒': 'green',
    '上官星展': 'blue',
    '晴夕': 'pink',
    '若风': 'gold',
    '金寒': 'yellow',
    '李冥夜': 'black',
    '苹果':'red',
    '霜初':'red',
    '军相':'red',
    '雷风夜':'brown',
};

//角色默认位置映射
export const charaDefaultPosition = {
    'left': ['apple','kin','kiny','chongwu','kaze','jing','shuangqi','caiying','lin','yuyuan','haku','shiwu','bi','chensi','shoshi','changye','oyang'],
    'middle': ['aoi','aoi-x','yoru','tsuki','firebird','lulu','shuangchu','shangchen','fengqing','fuyu','cglive','akira','baihan','changqing','shuangyangchu'],
    'right': ['hoshi','zhanyan','haru','yume','natsu','kuro','kawa','fenghe','smoke','yaoan','ken','jingzhi','lizhu','wenzheng'],
};

//游戏变量初始值
export const gameEmotion={
    '青寒':0,
    '金寒':0,
    '黑暗度':0,
    '真相度':0,
    '周目':1,
    '信物收集':0
}

//游戏状态机
export enum States{
    NORMAL,
    MOVIE,
    MOVIEPRO,
    CHOOSE,
    LOADING,
    BATTLE
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