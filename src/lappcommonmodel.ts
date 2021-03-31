
import { Live2DCubismFramework as cubismusermodel } from '@framework/model/cubismusermodel';
import { Live2DCubismFramework as acubismmotion } from '@framework/motion/acubismmotion';
import { Live2DCubismFramework as csmmap } from '@framework/type/csmmap';
import { Live2DCubismFramework as cubismmotion } from '@framework/motion/cubismmotion';
import CubismMotion = cubismmotion.CubismMotion;
import csmMap = csmmap.csmMap;
import ACubismMotion = acubismmotion.ACubismMotion;
import CubismUserModel = cubismusermodel.CubismUserModel;
import { ResourcesPath } from './lappdefine';
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
        let motionNames = ['a','a2','b','bs','j','ns','n','s','sw','w','w2','sp','bo'];
        for (let name of motionNames) {
            fetch(`${ResourcesPath}common/${name}.motion3.json`)
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

                });
        }
    }

    constructor() {
        super();
        this._common_motions = new csmMap<string, ACubismMotion>();
        this.initMotion();
    }
    _common_motions: csmMap<string, ACubismMotion>;
}