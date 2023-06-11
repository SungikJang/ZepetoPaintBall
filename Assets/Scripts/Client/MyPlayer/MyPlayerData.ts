import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {WaitForSeconds, AudioListener, Random} from "UnityEngine";
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import { PLAYER_STATE } from '../Enums';
import Connector from '../Network/Connector';

export interface InterMyPlayerData {
    Init(): void;

    SetMyPlayer(player: ZepetoPlayer): void;

    Update(): void;
    
    SetTeam(team: string): void;
    
    SetPlayerState(state: string): void;
    
    get Hp();
    
    set Hp(value: float);
}

export default class MyPlayerData extends ZepetoScriptBehaviour implements InterMyPlayerData {
    private _myPlayer: ZepetoPlayer = null;
    
    private state: string = PLAYER_STATE.Live;
    
    public manager: InterManager;
    
    private team: string = '';
    
    private hp: float = 100;


    Init() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        console.log("데어이닛")
    }
    
    SetMyPlayer(player: ZepetoPlayer){
        this._myPlayer = player;
        this._myPlayer.character.gameObject.AddComponent<AudioListener>();
        console.log("myplayer세팅완료")
    }
    
    Update(){
        if(this.state !== PLAYER_STATE.Die){
            if (this.hp <= 0) {
                this.state = PLAYER_STATE.Die;
                Connector.Instance.ReqToServer('PlayerDieReq')
            }
        }
    }

    SetTeam(team: string){
        this.team = team;
    }

    SetPlayerState(state: string){
        this.state = state;
    }

    get Hp(){
        return this.hp
    }

    set Hp(value: float){
        this.hp = value
    }
}   