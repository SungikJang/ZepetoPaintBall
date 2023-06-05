import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {WaitForSeconds, AudioListener, Random} from "UnityEngine";
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';

export interface InterMyPlayerData {
    Init(): void;

    SetMyPlayer(): void;

    Update(): void;
}

export default class MyPlayerData extends ZepetoScriptBehaviour implements InterMyPlayerData {
    private _myPlayer: ZepetoPlayer = null;
    
    public manager: InterManager;


    Init() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        console.log("데어이닛")
    }
    
    SetMyPlayer(){
        this._myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
        this._myPlayer.character.gameObject.AddComponent<AudioListener>();
        console.log("myplayer세팅완료")
    }
    
    Update(){
        
    }
}   