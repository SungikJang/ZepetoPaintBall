import {GameObject, WaitForSeconds} from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import MyPlayerData from './MyPlayerData';
import MyPlayerMovement from './MyPlayerMovement';

export default class MyPlayerController extends ZepetoScriptBehaviour{
    private static _instance: MyPlayerController = null;
    private static _myPlayerData: MyPlayerData = new MyPlayerData();
    private static _myPlayerMovement: MyPlayerMovement = new MyPlayerMovement();

    public static get Instance(): MyPlayerController {
        this.Init();
        return this._instance;
    }

    public static get Data(): MyPlayerData {
        return this._myPlayerData;
    }

    public static get Movement(): MyPlayerMovement {
        return this._myPlayerMovement;
        
    }

    static Init() {
        if (this._instance == null) {
            let go = GameObject.Find('MyPlayerController');
            this._instance = go.GetComponent<MyPlayerController>();
        }
    }
    
    Update(){
        
    }

    Awake() {
        MyPlayerController.Data.Init();
        MyPlayerController.Movement.Init();
    }
} 