// import IOC from '../../Common/IOC';
// import {Manager} from '../Manager';

import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";

export interface InterDataManager {
    Init(): void
    
    Translator(targetLanguage: string): void

    GetValueByKeys(keys: string): Object
}

class DataManager implements InterDataManager {

    Translator(targetLanguage: string): void {
        throw new Error('Method not implemented.');
    }

    // property
    private dataDictionary = {};

    // method

    Init() {
        let Weapon = IOC.Instance.getInstance<InterManager>(Manager).Resource.LoadData('Weapon');
        
        this.dataDictionary = {
            Weapon
        };
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

export default DataManager;