import { charactorMap } from './lappdefine';
import { ajax } from './ajax';
import { LAppLive2DManager } from "./lapplive2dmanager";

export class Sence {

    constructor(chaName: string) {
        this.texts = [];
        this.chas = [];
        this.faces = [];
        this.bkgs = [];
        this.musics = [];
        this.codes = [];
        this.autoflag = [];
        this.fragment = [];
        this.speaks = [];
        this.charSpeaks = [];

        this.title = "";
        this.nowi = 0;
        this.nowChar = '';//当前角色名
        this.charName = chaName;
    }

    public initByAjax(): Promise<void> {
        return new Promise((resolve, reject) => {
            ajax({
                type: "get",
                url: "/txt/" + this.charName + ".txt",
                dataType: "text"
            }).then((data) => {
                //this.downLoad(this.dealAudioTexts(data.split("\r\n")));
                LAppLive2DManager.getInstance().initCharactorsByList(this.dealTexts(data.split("\r\n")))
                .then(()=>{
                    this.nowChar = this.chas[0];
                    resolve();
                });
            }, () => {
                console.log("加载章节失败!");
                reject();
            })
        })
    }

    private dealAudioTexts(datas: string[]):object {
        /**
         * {
         * 'yoru':['','']
         * }
         */
        let temp_char: object = {};
        let char = '';
        datas.forEach((item)=>{
            item = item.trimLeft();
            switch (item[0]) {
                case '【':
                    let txt = item.slice(1, item.length - 1);
                    let real = this.getCharRealWithCh(txt);
                    char = this.getCharReal(real);
                    if(char && temp_char[char] === undefined){
                        temp_char[char] = [];
                    }
                    break;
                case '[':
                case '`':
                case '{':
                case '/':
                case '*':
                case '<':
                case '>':
                    break;
                default:
                    let arr = item.split('-');
                    if(temp_char[char]){
                        if (arr.length >= 2) {
                        temp_char[char].push(arr[1]);
                        }
                        else{
                            temp_char[char].push(arr[0]);
                        }
                    }
                    
            }
        })
        return temp_char;
    }

    private downLoad(content){
        let obj = '';
        for(let cha in content){
            obj += `【${cha}】\r\n`;
            obj += content[cha].join('\r\n');
            obj += '\r\n';
        }
        let aEle = document.createElement("a");// 创建a标签
        let blob = new Blob([obj]); 
        aEle.download = this.charName+'.txt';// 设置下载文件的文件名
        aEle.href = URL.createObjectURL(blob);
        aEle.click();// 设置点击事件
    }

    private dealTexts(datas: string[]):string[] {
        let nowi = 0;
        let frag_start: number[] = [];
        let temp_real: string[] = [];
        let temp_char: object = {};
        let char = '';
        datas.forEach((item,index)=>{
            item = item.trimLeft();
            switch (item[0]) {
                case '【':
                    this.chas[nowi] = item.slice(1, item.length - 1);
                    let real = this.getCharRealWithCh(this.chas[nowi]);
                    char = this.getCharReal(real);
                    if (real && !temp_real.includes(real)) {
                        temp_real.push(real);
                    }
                    if(char && temp_char[char] === undefined){
                        temp_char[char] = 0;
                    }
                    break;
                case '[':
                    this.bkgs[nowi] = item.slice(1, item.length - 1);
                    break;
                case '`':
                    this.title = item.slice(1, item.length - 1);
                    break;
                case '{':
                    this.musics[nowi] = item.slice(1, item.length - 1);
                    break;
                case '/':
                    if (!this.codes[nowi]) {
                        this.codes[nowi] = [];
                    }
                    this.codes[nowi].push(item.slice(1, item.length - 1));

                    break;
                case '*':
                    break;
                case '<':
                    frag_start.push(nowi);
                    break;
                case '>':
                    this.fragment[frag_start.pop()] = nowi;
                    break;
                default:
                    temp_char[char] += 1;
                    let arr = item.split('-');
                    this.speaks[nowi] = String(index+1);
                    let t = temp_char[char] < 10 ? '0' + temp_char[char] : temp_char[char];
                    this.charSpeaks[nowi] = `${this.charName}/${this.charName}-${char}_${t}`;//w5-kin_1
                    if (arr.length >= 2) {
                        this.faces[nowi] = arr[0];
                        this.texts[nowi] = arr[1];
                    }
                    else {
                        this.texts[nowi] = arr[0];
                    }
                    if (this.musics[nowi]) {
                        this.autoflag.push(nowi);
                    }
                    nowi++;
            }
        })
        return temp_real;
        
    }



    public getCode(): string[] {
        return this.codes[this.nowi];
    }

    public getCharOrigin(): string {
        return this.nowChar;
    }

    public setCharOrigin(str:string): void {
        this.nowChar=str;
    }

    public getCharReal(name?: string): string {
        let txt = name ? name : this.nowChar;
        if (txt) {
            let arr = txt.split('-');
            let real;
            if (arr.length >= 2) {
                real = arr[1];
            }
            else {
                real = arr[0];
            }
            return charactorMap[real];
        }
        else return null;
    }

    public getCharRealWithCh(name?: string): string {
        let txt = name ? name : this.nowChar;
        if (txt) {
            let arr = txt.split('-');
            return arr.length >= 2?arr[1]:arr[0];
        }
        else return null;
    }

    public getCharShow(name?: string): string {
        let txt = name ? name : this.nowChar;
        if (txt) {
            return txt.split('-')[0];
        }
        else return null;
    }

    public getText(): string {
        return this.texts[this.nowi];
    }

    public getFace(): string {
        return this.faces[this.nowi];
    }

    public getBkg(): string {
        return this.bkgs[this.nowi];
    }

    public getMus(): string {
        return this.musics[this.nowi];
    }

    public setNowi(n: number) {
        this.nowi = n;
        if (typeof this.chas[this.nowi] != 'undefined') {
            this.nowChar = this.chas[this.nowi];
        }
    }

    public setNowiAdd(n: number = 1) {
        this.nowi += n;
        if (typeof this.chas[this.nowi] != 'undefined') {
            this.nowChar = this.chas[this.nowi];
        }
    }

    public getAutoFlag(){
        return this.autoflag;
    }
    public getAutoFlagReserve(){
        return  [...this.autoflag].reverse();
    }

    public getSpeak(){
        return this.charName +'-'+this.speaks[this.nowi];
    }

    public getCharSpeaks(){
        return this.charSpeaks[this.nowi];
    }

    //寻找现在nowi前面的bkg
    public findPreBkg() {
        for(let i = this.nowi; i > 0; i--){
            if(this.bkgs[i]){
                this.bkgs[this.nowi] = this.bkgs[i];
                break;
            }
        }
    }

    public jumpToNextFrag() {
        this.setNowi(this.fragment[this.nowi]);
    }

   
    texts: string[];//文本
    chas: string[];//角色
    faces: string[];//表情
    bkgs: string[];//背景图片
    musics: string[];//音乐
    fragment: number[];//文本片元的开始与结束
    codes: string[][];//代码段
    autoflag: number[];//存放快进时存的nowi
    speaks: string[];//语音
    charSpeaks: string[];//角色语音['青寒 1','金寒 2']

    
    nowi: number;//nowi
    charName: string; //章节id(w2)
    title: string;//章节标题(第二章·111)
    nowChar: string;//当前角色全名【xxx-yyy】
}