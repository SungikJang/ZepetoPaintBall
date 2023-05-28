import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export interface InterDataManager {
    Init(): void;

    GetValueByKeys(keys: string):void;
}

export default class DataManager extends ZepetoScriptBehaviour implements InterDataManager{
    // property
    private dataDictionary = {};

    // method

    Init() {
        // let Config = Manager.Resource.LoadData('Config');
        // let Monster = Manager.Resource.LoadData('Monster');
        // let Skill = Manager.Resource.LoadData('Skill');
        // let Weapon = Manager.Resource.LoadData('Weapon');
        //
        // this.dataDictionary = {
        //     Config,
        //     Monster,
        //     Skill,
        //     Weapon
        // };

    }

    public GetValueByKeys(keys: string) {
        let value = this.dataDictionary;
        keys.split('/').forEach((key) => {
            if (key in value) {
                value = value[key];
            } else {
                console.log('[Data Manager] 잘못된 키 경로 입니다.', keys);
                return;
            }
        });

        return value;
    }
}
