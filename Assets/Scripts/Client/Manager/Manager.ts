import { GameObject, Object } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import DataManager from './DataManager';
import FlagGameManager from './FlagGameManager';
import GameManager from './GameManger';
import LanguageManager from './LanguageManager';
import ProductManager from './ProductManager';
import ResourceManager from './ResourceManager';
import SiegeGameManager from './SiegeGameManager';
import SoundManager from './SoundManager';
import UIManager from './UIManager';

export default class Manager extends ZepetoScriptBehaviour {
    private static _instance: Manager = null;
    private static _language: LanguageManager = new LanguageManager();
    private static _resource: ResourceManager = new ResourceManager();
    private static _ui: UIManager = new UIManager();
    private static _sound: SoundManager = new SoundManager();
    private static _game: GameManager = new GameManager();
    private static _data: DataManager = new DataManager();
    //private static _leaderboard: LeaderboardManager = new LeaderboardManager();
    private static _flagGame: FlagGameManager = new FlagGameManager();
    private static _siegeGame: SiegeGameManager = new SiegeGameManager();
    private static _product: ProductManager = new ProductManager();

    public static get Instance(): Manager {
        this.Init();
        return this._instance;
    }

    public static get UI(): UIManager {
        return this._ui;
    }

    public static get Resource(): ResourceManager {
        return this._resource;
    }

    public static get Sound(): SoundManager {
        return this._sound;
    }

    public static get Language(): LanguageManager {
        return this._language;
    }

    public static get Data(): DataManager {
        return this._data;
    }

    public static get Game(): GameManager {
        return this._game;
    }

    public static get FlagGame(): FlagGameManager {
        return this._flagGame;
    }

    public static get SiegeGame(): SiegeGameManager {
        return this._siegeGame;
    }

    // public get SoloFlagGame(): InterSoloFlagGameManager {
    //     return this._soloFlagGameManager;
    // }
    
    public static get Product(): ProductManager{
        return this._product;
    }


    public static Clear(): void { }

    // life cycle
    public static Init(): void {
        console.log("manager")
        if (this._instance == null) {
            let go = GameObject.Find('Manager');
            this._instance = go.GetComponent<Manager>();
        }
    }

    Awake() {
        Manager.Data.Init();
        Manager.Resource.Init();
        Manager.UI.Init();
        //Manager.Sound.Init();
        Manager.Language.Init();
        Manager.Game.Init();
        Manager.FlagGame.Init();
        Manager.SiegeGame.Init();
        Manager.Product.Init();
    }
}
