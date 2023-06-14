import {Animator, GameObject, Input, Time, WaitForSeconds} from 'UnityEngine'
import { Button,Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../../IOC';
import Manager, { InterManager } from '../../Manager/Manager';
import { InterMyPlayerController, MyPlayerController } from '../../MyPlayer/MyPalyerController';

export interface InterControllerUI {
    Start(): void
    
    SetPad(OnOff: boolean): void
    
    SetJump(OnOff: boolean): void
}

export default class ControllerUI extends ZepetoScriptBehaviour implements InterControllerUI {
    public padObject: GameObject;
    public jumpObject: GameObject;
    public jumpBtn: Button;
    public fireBtn: Button;
    public OnFire: GameObject;
    public OffFire: GameObject;
    
    private MousePressed: boolean = false;
    private PressedTime: float;

    public manager: InterManager;
    public myPlayerController: InterMyPlayerController;

    private instanceSet: boolean = false;

    Start() {
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.StartCoroutine(this.GetInstance());
        this.manager.UI.ControllerUI = this;
        this.padObject.SetActive(false);
        this.jumpObject.SetActive(false);
        // this.jumpBtn.onClick.AddListener(()=>{
        //    
        // });
        this.fireBtn.onClick.AddListener(()=>{
            if(this.OffFire.activeSelf){
                this.OffFire.SetActive(false)
                this.OnFire.SetActive(true)
                if(!this.myPlayerController.MyPlayerMovement.OnFire){
                    this.myPlayerController.MyPlayerMovement.OnFire = true;
                }
            }
            else{
                this.OffFire.SetActive(true)
                this.OnFire.SetActive(false)
            }
        });
    }

    Update(){
        this.MouseInputController();
    }

    SetPad(OnOff: boolean){
        this.padObject.SetActive(OnOff);
    }

    SetJump(OnOff: boolean){
        this.jumpObject.SetActive(OnOff);
    }
    
    MouseInputController(){
        if (Input.GetMouseButton(0)) {
            if (!this.MousePressed) {
                // 터치하는 순간
                this.MousePressed = true;
                this.PressedTime = Time.time;
            } else {
                // 터치하는 중
                if(this.OffFire.activeSelf){
                    this.Fire();
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
                    if(this.myPlayerController.MyPlayerMovement.OnFire){
                        this.myPlayerController.MyPlayerMovement.OnFire = false;
                    }
                }
            }
        }
    }
    
    Fire(){
        if(this.myPlayerController){
            if(!this.myPlayerController.MyPlayerMovement.OnFire){
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
}