// import IOC from '../../Common/IOC';
// import {Manager} from '../Manager';

export interface InterDataManager {
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
        // let Recipe = IOC.Instance.getInstance(Manager).Resource.LoadData('Recipe');
        // let Ingredient = IOC.Instance.getInstance(Manager).Resource.LoadData('Ingredient');
        // let StartItem = IOC.Instance.getInstance(Manager).Resource.LoadData('StartItem');
        // let Treasure = IOC.Instance.getInstance(Manager).Resource.LoadData('Treasure');
        // let Price = IOC.Instance.getInstance(Manager).Resource.LoadData('Price');
        // let Config = IOC.Instance.getInstance(Manager).Resource.LoadData('Config');
        //
        // this.dataDictionary = {
        //     Recipe,
        //     Ingredient,
        //     StartItem,
        //     Treasure,
        //     Price,
        //     Config,
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

export default DataManager;