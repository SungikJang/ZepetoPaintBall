import {Animator, AudioListener, GameObject, Quaternion, Random, Time, Transform, Vector3, WaitForSeconds} from 'UnityEngine';
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GunController from '../Controller/GunController';
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import Connector from '../Network/Connector';
import { InterMyPlayerController, MyPlayerController } from './MyPalyerController';
import MyPlayerAttachedController from './MyPlayerAttachedController';

export interface InterMyPlayerMovement {
    Init(): void;

    Update(): void;

    SetMyPlayer(player: ZepetoPlayer): void;

    Teleport(pos: Vector3, rot: Quaternion): void;

    get GunController();

    set GunController(value: GunController);
    
    get OnFire();
    
    set OnFire(value: boolean);

    get IsMoving();

    set IsMoving(value: boolean);
    
    get MyAnimator();

    get HavingFlag();

    SetSpineAngle(spineAngle: float);

    get MyPlayerAttachedController()

    set MyPlayerAttachedController(value: MyPlayerAttachedController)
    
    Shoot(type: string, nowWeapon: GameObject);
    
    Move(x: float, y: float, amount: float)

    SetAnimParam(name: string, num: int)
    
    Jump()

    GetHit();

    Respawn()

    TakeFlag(flagObj: GameObject);

    LostFlag()
}

export default class MyPlayerMovement extends ZepetoScriptBehaviour implements InterMyPlayerMovement {
    private isInStartUI: boolean = true;
    private myPlayer: ZepetoPlayer = null;
    private myPlayerObject: GameObject = null;
    private myAnimator: Animator;
    private lastSpineAngle: float = 0;
    
    private onFire: boolean = false;
    
    public manager: InterManager;

    private myPlayerAttachedController: MyPlayerAttachedController
    
    private gunController: GunController;
    
    private isMoving: boolean = false;
    
    private isJumping: boolean = false;

    private haveFlag: boolean = false;
    


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
        if(this.myPlayer){
            console.log(this.myPlayer.character.characterController.isGrounded)
            if (this.myPlayer.character.characterController.isGrounded) {
                this.isJumping = false;
            }
        }
    }

    SetMyPlayer(player: ZepetoPlayer){
        this.myPlayer = player;
        this.myPlayerObject = this.myPlayer.character.gameObject;
        this.myAnimator = player.character.ZepetoAnimator;
    }

                           
    Teleport(pos: Vector3, rot: Quaternion){
        this.myPlayer.character.Teleport(pos, rot);
    }
    
    Rotate(){
        if(!this.manager.Game.IsGamePlaying){
            if(this.isInStartUI && this.myPlayerObject){
                this.myPlayerObject.transform.Rotate(Vector3.up * Time.deltaTime * 30);
            }
        }
    }
    
    LookDir(){
        if(this.manager.Game.IsGamePlaying){
            let q = this.myPlayer.character.gameObject.transform.rotation.eulerAngles
            let cq = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.gameObject.transform.rotation.eulerAngles
            this.myPlayer.character.gameObject.transform.rotation = Quaternion.Euler(new Vector3(q.x, cq.y, q.z));
            // this.myPlayer.character.MoveContinuously(cq);
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

    get HavingFlag(){
        return this.haveFlag
    }

    get OnFire(){
        return this.onFire;
    }

    set OnFire(value: boolean){
        this.onFire = value;
    }

    get GunController(){
        return this.gunController
        
    }

    set GunController(value: GunController){
        this.gunController = value;
    }

    get MyAnimator(){
        return this.myAnimator;
    }

    get MyPlayerAttachedController(){
        return this.myPlayerAttachedController
    }

    set MyPlayerAttachedController(value: MyPlayerAttachedController){
        this.myPlayerAttachedController = value
    }

    get IsMoving(){
        return this.isMoving
    }

    set IsMoving(value: boolean){
        this.isMoving = value
    }

    SetSpineAngle(spineAngle: float){
        this.myAnimator.SetFloat("SpineAngle", spineAngle)
    }
    
    SetAnimParam(name: string, num: int){
        if(!this.isJumping){
            // if (this.myPlayer.character.characterController.isGrounded) {
            //     if (this.myAnimator.GetInteger(name) !== num) {
            //         this.myAnimator.SetInteger(name, num)
            //     }
            // }
            if (this.myAnimator.GetInteger(name) !== num) {
                this.myAnimator.SetInteger(name, num)
            }
        }
    }

    Shoot(){
        this.GunController.Shoot();
    }

    Move(x: float, y: float, amount: float){
        let speed = (amount / 27) / 5;
        this.myAnimator.SetFloat("Acceleration", amount / 27)
        let dir = new Vector3(y, 0, x).normalized
        let p: Vector3 = this.myPlayer.character.gameObject.transform.position
        dir = this.myPlayer.character.gameObject.transform.TransformDirection(dir)
        this.myPlayer.character.characterController.enabled = false;
        this.myPlayer.character.gameObject.transform.position = new Vector3(p.x + (dir.x * speed), p.y, p.z + (dir.z * speed))
        this.myPlayer.character.characterController.enabled = true;
    }

    Jump(){
        this.isJumping = true;
    }

    GetHit(){
        this.myPlayer.character.Context.gameObject.SetActive(false)
        this.manager.UI.InGameUI.InGameWeaponUI.SetActive(true);
    }

    Respawn(){
        let md = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController)
        if(md.MyPlayerData.WaitingWeeapon !== ''){
            md.MyPlayerData.EqiupGun(md.MyPlayerData.WaitingWeeapon);
            md.MyPlayerData.WaitingWeeapon = "";
        }
    }

    TakeFlag(flagObj: GameObject){
        console.log("6")
        this.haveFlag = true;
        flagObj.transform.SetParent(this.myPlayer.character.gameObject.transform)
        flagObj.transform.localPosition = new Vector3(-25.7740002,110.563004,7.01800013)
    }
    
    LostFlag(){
        this.haveFlag = false;
        this.manager.FlagGame.FreeFlag();
    }
}