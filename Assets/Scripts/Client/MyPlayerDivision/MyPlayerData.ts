import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {WaitForSeconds} from "UnityEngine";
import MyPlayerTriggerController from './MyPlayerTriggerController';

export interface InterMyPlayerData {
    init(): void;

    SetMyPlayer(): void;
}

export default class MyPlayerData extends ZepetoScriptBehaviour implements InterMyPlayerData{
    private _myPlayer: ZepetoPlayer = null;
    
    constructor() {  
        super();
    }
    
    init() {
        console.log("데어이닛")
    }
    
    SetMyPlayer(){
        this._myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
        console.log("myplayer세팅완료")
    }
}   