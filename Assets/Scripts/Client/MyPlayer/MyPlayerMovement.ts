import {Animator, AudioListener, GameObject, Quaternion, Random, Time, Transform, Vector3, WaitForSeconds} from 'UnityEngine';
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import Connector from '../Network/Connector';
import MyPlayerCoroutineController from './MyplayerCoroutineController';

export interface InterMyPlayerMovement {
    Init(): void;

    Update(): void;

    SetMyPlayer(player: ZepetoPlayer): void;

    Teleport(pos: Transform): void;
    
    get OnFire();
    
    set OnFire(value: boolean);
    
    get MyAnimator();

    SetSpineAngle(spineAngle: float);

    get MyCoroutineController()

    set MyCoroutineController(value: MyPlayerCoroutineController)
}

export default class MyPlayerMovement extends ZepetoScriptBehaviour implements InterMyPlayerMovement {
    private isInStartUI: boolean = true;
    private myPlayer: ZepetoPlayer = null;
    private myPlayerObject: GameObject = null;
    private myAnimator: Animator;
    private lastSpineAngle: float = 0;
    
    private onFire: boolean = false;
    
    public manager: InterManager;

    private myCoroutineController: MyPlayerCoroutineController


    Init() {
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
        this.myAnimator = player.character.ZepetoAnimator;
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
            this.myPlayer.character.gameObject.transform.rotation = Quaternion.Euler(new Vector3(q.x, cq.y, q.z));
            console.log(cq.x, cq.y, cq.z)
            let sa: float = 0;
            if(cq.x === 0){
                sa = 0;
            }
            else{
                if(cq.x > 300){
                    sa = (360 - cq.x) / 36;
                }
                else{
                    sa = cq.x / -45;
                }
            }
            let val: float = this.lastSpineAngle - sa;
            if(Math.abs(val) > 0.001){
                Connector.Instance.ReqToServer("SpineAngle", {spineAngle: sa});
                this.lastSpineAngle = sa;
            }
        }
    }

    get OnFire(){
        return this.onFire;
    }

    set OnFire(value: boolean){
        this.onFire = value;
    }

    get MyAnimator(){
        return this.myAnimator;
    }

    get MyCoroutineController(){
        return this.myCoroutineController
    }

    set MyCoroutineController(value: MyPlayerCoroutineController){
        this.myCoroutineController = value
    }


    SetSpineAngle(spineAngle: float){
        this.myAnimator.SetFloat("SpineAngle", spineAngle)
    }
}