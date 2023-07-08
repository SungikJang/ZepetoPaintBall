import Manager from "./Manager";

export default class DataManager{

    Translator(targetLanguage: string): void {
        throw new Error('Method not implemented.');
    }

    // property
    private dataDictionary = {};

    // method

    Init() {
        console.log("datamanager")
        
        let Weapon = Manager.Resource.LoadData('Weapon');
        
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