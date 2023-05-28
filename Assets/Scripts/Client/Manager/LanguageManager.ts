//import BaseScene from '../Scenes/BaseScene';
import IOC from '../IOC';
import Manager, { InterManager } from './Manager';

/*
import SettingUI from '../UI/PopUpUI/SettingUI';
import InGameUI from '../UI/DefaultUI/InGameUI';
import FirstTutorialUI from '../UI/PopUpUI/FirstTutorialUI';
*/

export enum LanguageState {
    Korean,
    English,
    Japanese,
    Indonesian,
    Thai,
    Vietnamese,
    Spanish,
    French,
    Portuguese,
}

export interface InterLanguageManager {
    Init(): void;

    Translator(targetLanguage: string): void;
    
    GetValueByKeys(keys: string): void;
}

export default class LanguageManager implements InterLanguageManager{
    // property
    private currentDictionary;
    private dictionary = {};
    public languageList = [];
    public currentLanguage: int;
    
    private Manager: InterManager;

    // method
    public Translator(targetLanguage: string) {
        if (targetLanguage in this.dictionary) {
            this.currentDictionary = this.dictionary[targetLanguage];
            this.currentLanguage = LanguageState[targetLanguage];
        } else {
            let dictionary = this.Manager.Resource.LoadData('Language\\' + targetLanguage);
            if (dictionary) {
                this.dictionary[targetLanguage] = dictionary;
                this.currentDictionary = this.dictionary[targetLanguage];
                this.currentLanguage = LanguageState[targetLanguage];
            } else {
                if (!('English' in this.dictionary)) {
                    this.dictionary['English'] = this.Manager.Resource.LoadData('Language\\' + 'English');
                }
                this.currentDictionary = this.dictionary['English'];
                this.currentLanguage = LanguageState['English'];
            }
        }
        /*
                if (SettingUI.Instance) {
                    SettingUI.Instance.Init();
                }
                if (InGameUI.Instance) {
                    InGameUI.Instance.SetLanguage();
                }
                if (FirstTutorialUI.Instance) {
                    FirstTutorialUI.Instance.SetLanguage();
                }
                */
    }

    public GetValueByKeys(keys: string) {
        let value = this.currentDictionary;
        keys.split('/').forEach((key) => {
            if (key in value) {
                value = value[key];
            } else {
                console.log('[Language Manager] 잘못된 키 경로 입니다.', keys);
                return 'Error: ' + keys;
            }
        });

        return value.toString();
    }

    Init() {
        this.Manager = IOC.Instance.getInstance(Manager);
        // this.languageList = Object.keys(Manager.Data.GetValueByKeys('Config/Language')) as string[];
        //this.Translator(BaseScene.Language);
    }
}
