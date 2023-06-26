import { GameObject, Object } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { InterDataManager } from './DataManager';
import { InterFlagGameManager } from './FlagGameManager';
import { InterGameManager } from './GameManger';
import { InterLanguageManager } from './LanguageManager';
import { InterProductManager } from './ProductManager';
import { InterResourceManager } from './ResourceManager';
import { InterSiegeGameManager } from './SiegeGameManager';
import { InterSoloFlagGameManager } from './SoloFlagGameManager';
import { InterSoundManager } from './SoundManager';
import { InterUIManager } from './UIManager';


export interface InterManager {
    Init(): void;
    
    get Language(): InterLanguageManager

    get Resource(): InterResourceManager

    get UI(): InterUIManager

    get Sound(): InterSoundManager

    get Data(): InterDataManager
    
    get Game(): InterGameManager

    get FlagGame(): InterFlagGameManager

    get SiegeGame(): InterSiegeGameManager

    get SoloFlagGame(): InterSoloFlagGameManager

    get Product(): InterProductManager
}

export default class Manager extends ZepetoScriptBehaviour implements InterManager {
    private _resourceManager: InterResourceManager;
    private _uiManager: InterUIManager;
    private _soundManager: InterSoundManager;
    private _languageManager: InterLanguageManager;
    private _dataManager: InterDataManager
    private _gameManager: InterGameManager
    private _flagGameManager: InterFlagGameManager
    private _siegeGameManager: InterSiegeGameManager
    private _soloFlagGameManager: InterSoloFlagGameManager
    private _productManager: InterProductManager

    constructor(
        _LanguageManager: InterLanguageManager,
        _ResourceManager: InterResourceManager,
        _UIManager: InterUIManager,
        _SoundManager: InterSoundManager,
        _DataManager: InterDataManager,
        _GameManager: InterGameManager,
        _FlagGameManager: InterFlagGameManager,
        _SiegeGameManager: InterSiegeGameManager,
        _SoloFlagGameManager: InterSoloFlagGameManager,
        _ProductManager: InterProductManager,
    ) {
        super();
        this._uiManager = _UIManager;
        this._resourceManager = _ResourceManager;
        this._soundManager = _SoundManager;
        this._languageManager = _LanguageManager;
        this._dataManager = _DataManager
        this._gameManager = _GameManager
        this._flagGameManager = _FlagGameManager
        this._siegeGameManager = _SiegeGameManager
        this._soloFlagGameManager = _SoloFlagGameManager
        this._productManager = _ProductManager
    }
    
    Init(){
        this._resourceManager.Init();
        this._languageManager.Init();
        this._uiManager.Init();
        this._gameManager.Init();
        this._flagGameManager.Init();
        this._siegeGameManager.Init();
        this._soloFlagGameManager.Init();
        this._dataManager.Init();
        this._productManager.Init();
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

    public get Game(): InterGameManager {
        return this._gameManager;
    }

    public get FlagGame(): InterFlagGameManager {
        return this._flagGameManager;
    }

    public get SiegeGame(): InterSiegeGameManager {
        return this._siegeGameManager;
    }

    public get SoloFlagGame(): InterSoloFlagGameManager {
        return this._soloFlagGameManager;
    }
    
    public get Product(): InterProductManager{
        return this._productManager;
    }
}
