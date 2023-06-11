import { LANGUAGES } from "../Enums";
import IOC from "../IOC";
import Manager from "./Manager";
import ResourceManager from "./ResourceManager";

export interface InterLanguageManager {
    Translator(targetLanguage: string): void

    GetValueByKeys(keys: string): string
    Init(): void;
}

export default class LanguageManager implements InterLanguageManager {
    // property
    private currentDictionary;
    private dictionary = {};
    public currentLanguage: int;

    // method
    public Translator(targetLanguage: string): void {
        if (targetLanguage in this.dictionary) {
            this.currentDictionary = this.dictionary[targetLanguage];
            // this.currentLanguage = LANGUAGES[targetLanguage];
        } else {
            let dictionary = IOC.Instance.getInstance(ResourceManager).LoadJson('Language\\' + targetLanguage);
            if (dictionary) {
                this.dictionary[targetLanguage] = dictionary;
                this.currentDictionary = this.dictionary[targetLanguage];
                // this.currentLanguage = LANGUAGES[targetLanguage];
            } else {
                if (!('English' in this.dictionary)) {
                    this.dictionary['English'] = IOC.Instance.getInstance(Manager).Resource.LoadJson('Language\\' + 'English');
                }
                this.currentDictionary = this.dictionary['English'];
                // this.currentLanguage = LANGUAGES['English'];
            }
        }
    }

    public GetValueByKeys(keys: string): string {
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
        //this.Translator(LANGUAGES.English);
    }
}
