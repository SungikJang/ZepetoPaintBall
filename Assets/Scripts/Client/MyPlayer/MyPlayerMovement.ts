import {AudioListener, GameObject, Quaternion, Random, Time, Transform, Vector3, WaitForSeconds} from 'UnityEngine';
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';

export interface InterMyPlayerMovement {
    Init(): void;

    Update(): void;

    SetMyPlayer(player: ZepetoPlayer): void;

    Teleport(pos: Transform): void;
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
        if(!this.manager){
            this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        }
        this.Rotate();
        this.LookDir();
    }

    SetMyPlayer(player: ZepetoPlayer){
        this.myPlayer = player;
        this.myPlayerObject = this.myPlayer.character.gameObject;
        console.log("myplayer세팅완료")
    }
                           
    Teleport(pos: Transform){
        this.myPlayer.character.Teleport(pos.position, pos.rotation);
    }
    
    Rotate(){
        if(!this.manager.Game.IsGameRunning){
            if(this.isInStartUI && this.myPlayerObject){
                this.myPlayerObject.transform.Rotate(Vector3.up * Time.deltaTime * 30);
            }
        }
    }
    
    LookDir(){
        if(this.manager.Game.IsGameRunning){
            let q = this.myPlayer.character.gameObject.transform.rotation.eulerAngles
            let cq = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.gameObject.transform.rotation.eulerAngles
            this.myPlayer.character.gameObject.transform.rotation = Quaternion.Euler(new Vector3(q.x, cq.y, q.z))
        }
    }
}