
import { Live2DCubismFramework as cubismusermodel } from '@framework/model/cubismusermodel';
import { Live2DCubismFramework as acubismmotion } from '@framework/motion/acubismmotion';
import { Live2DCubismFramework as csmmap } from '@framework/type/csmmap';
import { Live2DCubismFramework as cubismmotion } from '@framework/motion/cubismmotion';
import CubismMotion = cubismmotion.CubismMotion;
import csmMap = csmmap.csmMap;
import ACubismMotion = acubismmotion.ACubismMotion;
import CubismUserModel = cubismusermodel.CubismUserModel;
import vue from './main';
export let s_instance: LAppCommonModel = null;

export class LAppCommonModel extends CubismUserModel {
    public static getInstance(): LAppCommonModel {
        if (s_instance == null) {
            s_instance = new LAppCommonModel();
        }

        return s_instance;
    }
    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance = void 0;
        }

        s_instance = null;
    }



    private initMotion() {
        let motionNames = ['a','a2','a3','b','bw','bs','j','f','ns','n','s','sw','w','wx','w2','sp','bo'];
        for (let name of motionNames) {
            fetch(`./Resources/${vue.$store.getters.gameName}/live2d/common/${name}.motion3.json`)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    const tmpMotion: CubismMotion = this.loadMotion(
                        arrayBuffer,
                        arrayBuffer.byteLength,
                        name
                    );

                    tmpMotion.setFadeInTime(1);
                    tmpMotion.setFadeOutTime(1);

                    if (this._common_motions.getValue(name) != null) {
                        ACubismMotion.delete(this._common_motions.getValue(name));
                    }

                    this._common_motions.setValue(name, tmpMotion);

                }).catch(e=>{console.log(e)});
        }
    }

    constructor() {
        super();
        this._common_motions = new csmMap<string, ACubismMotion>();
        this.initMotion();
    }
    _common_motions: csmMap<string, ACubismMotion>;
}