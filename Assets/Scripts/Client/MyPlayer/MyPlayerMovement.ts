import {AudioListener, GameObject, Random, Time, Vector3, WaitForSeconds} from 'UnityEngine';
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';

export interface InterMyPlayerMovement {
    Init(): void;

    Update(): void;

    SetMyPlayer(player: ZepetoPlayer): void;

}

export default class MyPlayerMovement extends ZepetoScriptBehaviour implements InterMyPlayerMovement {
    private isInStartUI: boolean = true;
    private myPlayer: ZepetoPlayer = null;
    private myPlayerObject: GameObject = null;
    
    public manager: InterManager;


    Init() {
        console.log("무브이닛")
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        //this.serviceManager.EnglishGameService.SubscribeState(this);
        //this.StartCoroutine(this.Spin())
    }
    
    // * Spin(){
    //     while(true){
    //         console.log("????")
    //         ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.Rotate(new Vector3(0,1,0))
    //         yield new WaitForSeconds(0.2);
    //     }
    // }

    Update(){
        if(this.isInStartUI && this.myPlayerObject){
            this.myPlayerObject.transform.Rotate(Vector3.up * Time.deltaTime * 30);
        }
    }

    SetMyPlayer(player: ZepetoPlayer){
        this.myPlayer = player;
        this.myPlayerObject = this.myPlayer.character.gameObject;
        console.log("myplayer세팅완료")
    }
    
}