import {Animator, GameObject, Input, Time, Vector3, WaitForSeconds} from 'UnityEngine'
import { Button,Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { WEAPON_TYPE } from '../../Enums';
import IOC from '../../IOC';
import Manager, { InterManager } from '../../Manager/Manager';
import { InterMyPlayerController, MyPlayerController } from '../../MyPlayer/MyPalyerController';
import Connector from "../../Network/Connector"
import {TMP_Text} from "TMPro";
import {ZepetoPlayers} from "ZEPETO.Character.Controller";

export interface InterControllerUI {
    Start(): void
    
    SetPad(OnOff: boolean): void
    
    SetJump(OnOff: boolean): void
}

export default class ControllerUI extends ZepetoScriptBehaviour implements InterControllerUI {
    public pad: GameObject;
    public padBackG: GameObject;
    public padAnim: Animator;
    public padObject: GameObject;
    public jumpObject: GameObject;
    public jumpBtn: Button;
    public reloadBtn: Button;
    public reloadObj: GameObject
    public zoomBtn: Button;
    public zoomObj: GameObject;
    public SRUI: GameObject;
    public cross: GameObject;

    public bulletcnt: TMP_Text;
    public bullets: TMP_Text;
    
    private MousePressed: boolean = false;
    private PressedTime: float;

    public manager: InterManager;
    public myPlayerController: InterMyPlayerController;

    private instanceSet: boolean = false;

    private padReady: boolean = false;

    Start() {
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.StartCoroutine(this.GetInstance());
        this.StartCoroutine(this.GetPad());
        this.StartCoroutine(this.GetBtn());
        this.manager.UI.ControllerUI = this;
        this.padObject.SetActive(false);
        this.jumpObject.SetActive(false);
        this.manager.Game.ControllerUI = this
    }

    Update(){
        this.MouseInputController();
        this.PadInputController();
    }

    SetPad(OnOff: boolean){
        this.padObject.SetActive(OnOff);
    }

    SetJump(OnOff: boolean){
        this.jumpObject.SetActive(OnOff);
    }
    
    MouseInputController(){
        if (Input.GetMouseButton(0)) {
            if(Input.mousePosition.x > this.manager.UI.ScreenCenter.x){
                if (!this.MousePressed) {
                    // 터치하는 순간
                    this.MousePressed = true;
                    this.PressedTime = Time.time;
                    if (this.manager.Game.IsGamePlaying) {
                        this.Fire();
                        this.myPlayerController.MyPlayerMovement.Shoot();
                    }
                } else {
                    // 터치하는 중
                    if (this.manager.Game.IsGamePlaying) {
                        this.Fire();
                    }
                }
            }
        }
        else {
            if (this.MousePressed) {
                if (Time.time - this.PressedTime < 0.1) {
                    //터치 함
                } else {
                    //터치 떼는 순간
                }
                this.MousePressed = false;
                this.PressedTime = 0;
                if(this.myPlayerController){
                    if(this.myPlayerController.MyPlayerMovement.OnFire) {
                        this.myPlayerController.MyPlayerMovement.OnFire = false;
                        if (this.myPlayerController.MyPlayerData.MyWeaponType !== WEAPON_TYPE.Sniper) {
                            Connector.Instance.ReqToServer("StopShootReq")
                        }
                    }
                }
            }
        }
    }
    
    PadInputController(){
        if(this.padReady){
            if (this.padAnim.GetCurrentAnimatorStateInfo(0).IsName("touchpad_handle_on")) {
                let v: Vector3 = this.pad.transform.position - this.padBackG.transform.position;
                // if(!this.myPlayerController.MyPlayerMovement.IsMoving){
                //     this.myPlayerController.MyPlayerMovement.IsMoving = true;
                //     this.myPlayerController.MyPlayerMovement.SetAnimParam("State", 102);
                // }
                this.myPlayerController.MyPlayerMovement.SetAnimParam("State", 102);
                if (v.magnitude > 12) {
                    this.myPlayerController.MyPlayerMovement.SetAnimParam("MoveState", 1);
                } else {
                    this.myPlayerController.MyPlayerMovement.SetAnimParam("MoveState", 0);
                }
                if (v.magnitude > 27) {
                    this.myPlayerController.MyPlayerMovement.Move(v.normalized.y, v.normalized.x, 27)
                } else {
                    this.myPlayerController.MyPlayerMovement.Move(v.normalized.y, v.normalized.x, v.magnitude)
                }
            } else {
                // if(this.myPlayerController.MyPlayerMovement.IsMoving){
                //     this.myPlayerController.MyPlayerMovement.IsMoving = false;
                //     this.myPlayerController.MyPlayerMovement.SetAnimParam("State", 1);
                // }
                this.myPlayerController.MyPlayerMovement.SetAnimParam("State", 1);
            }
        }
    }
    
    Fire(){
        if(this.myPlayerController){
            if(!this.myPlayerController.MyPlayerMovement.OnFire){
                //Connector.Instance.ReqToServer("FireReq", {fire: true}) 
                this.myPlayerController.MyPlayerMovement.OnFire = true;
            }
        }
    }

    * GetInstance(){
        while(!this.instanceSet){
            this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
            this.manager = IOC.Instance.getInstance<InterManager>(Manager);
            if(this.manager && this.myPlayerController){
                this.instanceSet = true;
                return;
            }
            yield new WaitForSeconds(0.1);
        }
    }
    
    * GetPad(){
        while(!this.padReady){
            if(this.padAnim && this.padBackG && this.pad){
                this.padReady = true;
                return;
            }
            yield new WaitForSeconds(0.1);
        }
    }

    * GetBtn(){
        while(true){
            if(this.reloadBtn && this.reloadObj && this.zoomBtn && this.jumpBtn){
                this.zoomBtn.onClick.AddListener(()=>{
                    this.manager.Game.GunController.Zoom();
                });
                this.reloadBtn.onClick.AddListener(()=>{
                    this.manager.Game.GunController.StartReload();
                });
                this.jumpBtn.onClick.AddListener(()=>{
                    this.myPlayerController.MyPlayerMovement.Jump();
                });
                return;
            }
            yield new WaitForSeconds(0.1);
        }
    }

    UpdateBullet(){
        this.bullets.text = this.manager.Game.GunController.Bullets.toString();
        let b = this.manager.Game.GunController.Bullets - this.manager.Game.GunController.BulletCnt;
        this.bulletcnt.text = b.toString();
    }
}