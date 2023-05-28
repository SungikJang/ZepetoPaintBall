import { GameObject, Object } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { InterDataManager } from './DataManager';
import { InterLanguageManager } from './LanguageManager';
import { InterResourceManager } from './ResourceManager';
import { InterSoundManager } from './SoundManager';
import { InterUIManager } from './UIManager';


export interface InterManager {
    get Language(): InterLanguageManager

    get Resource(): InterResourceManager

    get UI(): InterUIManager

    get Sound(): InterSoundManager

    get Data(): InterDataManager
}

export default class Manager extends ZepetoScriptBehaviour implements InterManager {
    private _resourceManager: InterResourceManager;
    private _uiManager: InterUIManager;
    private _soundManager: InterSoundManager;
    private _languageManager: InterLanguageManager;
    private _dataManager: InterDataManager

    constructor(
        _LanguageManager: InterLanguageManager,
        _ResourceManager: InterResourceManager,
        _UIManager: InterUIManager,
        _SoundManager: InterSoundManager,
        _DataManager: InterDataManager,
    ) {
        super();
        this._uiManager = _UIManager;
        this._resourceManager = _ResourceManager;
        this._soundManager = _SoundManager;
        this._languageManager = _LanguageManager;
        this._dataManager = _DataManager
        
        this._resourceManager.Init();
        this._languageManager.Init();
        this._uiManager.Init();
    }

    public get UI(): InterUIManager {
        return this._uiManager;
    }

    public get Resource(): InterResourceManager {
        return this._resourceManager;
    }

    public get Sound(): InterSoundManager {
        return this._soundManager;
    }

    public get Language(): InterLanguageManager {
        return this._languageManager;
    }

    public get Data(): InterDataManager {
        return this._dataManager;
    }
}
