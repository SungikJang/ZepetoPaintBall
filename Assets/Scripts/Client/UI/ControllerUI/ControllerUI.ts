import {Animator, GameObject, Input, Time, Vector3, WaitForSeconds} from 'UnityEngine'
import { Button,Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { WEAPON_TYPE } from '../../Enums';
import Manager from '../../Manager/Manager';
import Connector from "../../Network/Connector"
import {TMP_Text} from "TMPro";
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import MyPlayerController from '../../MyPlayerController/MyPlayerController'

export default class ControllerUI extends ZepetoScriptBehaviour {
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
    public sRUI: GameObject;
    public cross: GameObject;

    private bulletcnt: TMP_Text;
    private bullets: TMP_Text;
    
    private MousePressed: boolean = false;
    private PressedTime: float;
    
    private instanceSet: boolean = false;

    private padReady: boolean = false;
    
    get ZoomObj(){
        return this.zoomObj
    }

    get ReloadObj(){
        return this.reloadObj
    }

    get Cross(){
        return this.reloadObj
    }

    get SRUI(){
        return this.sRUI
    }

    Start() {
        this.StartCoroutine(this.GetPad());
        this.pad = this.gameObject.transform.GetChild(0).GetChild(2).GetChild(2).gameObject;
        this.padBackG = this.gameObject.transform.GetChild(0).GetChild(2).GetChild(1).gameObject;
        this.padAnim = this.pad.GetComponent<Animator>();
        this.padObject = this.gameObject.transform.GetChild(0).GetChild(2).gameObject;
        this.jumpObject = this.gameObject.transform.GetChild(0).GetChild(3).gameObject;
        this.jumpBtn = this.jumpObject.GetComponent<Button>();
        this.reloadBtn = this.gameObject.transform.GetChild(0).GetChild(4).gameObject.GetComponent<Button>();
        this.reloadObj = this.gameObject.transform.GetChild(0).GetChild(4).GetChild(3).gameObject;
        this.zoomBtn = this.gameObject.transform.GetChild(0).GetChild(5).gameObject.GetComponent<Button>();
        this.zoomObj = this.gameObject.transform.GetChild(0).GetChild(5).gameObject;
        this.sRUI = this.gameObject.transform.GetChild(0).GetChild(0).gameObject;
        this.cross = this.gameObject.transform.GetChild(1).gameObject;
        this.bulletcnt = this.gameObject.transform.GetChild(0).GetChild(4).GetChild(0).GetComponent<TMP_Text>();
        this.bullets = this.gameObject.transform.GetChild(0).GetChild(4).GetChild(2).GetComponent<TMP_Text>();

        this.zoomBtn.onClick.AddListener(()=>{
            Manager.Game.GunController.Zoom();
        });
        this.reloadBtn.onClick.AddListener(()=>{
            Manager.Game.GunController.StartReload();
        });
        this.jumpBtn.onClick.AddListener(()=>{
            MyPlayerController.Movement.Jump();
        });

        this.padObject.SetActive(false);
        this.jumpObject.SetActive(false);
    }

    Update(){
        this.MouseInputController();
        this.PadInputController();
        if(Manager.Game.ControllerUI !== this){
            Manager.Game.ControllerUI = this
        }
        if(Manager.UI.ControllerUI !== this){
            Manager.UI.ControllerUI = this
        }
    }

    SetPad(OnOff: boolean){
        this.padObject.SetActive(OnOff);
    }

    SetJump(OnOff: boolean){
        this.jumpObject.SetActive(OnOff);
    }
    
    MouseInputController(){
        if (Input.GetMouseButton(0)) {
            if(Input.mousePosition.x > Manager.UI.ScreenCenter.x){
                if (!this.MousePressed) {
                    // 터치하는 순간
                    this.MousePressed = true;
                    this.PressedTime = Time.time;
                    if (Manager.Game.IsGamePlaying) {
                        MyPlayerController.Movement.Shoot();
                    }
                } else {
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
                if(MyPlayerController){
                    if (MyPlayerController.Data.MyWeaponType !== WEAPON_TYPE.Sniper) {
                        MyPlayerController.Movement.GunController.StopShoot()
                    }
                }
            }
        }
    }
    
    PadInputController(){
        if(this.padReady){
            if (this.padAnim.GetCurrentAnimatorStateInfo(0).IsName("touchpad_handle_on")) {
                let v: Vector3 = this.pad.transform.position - this.padBackG.transform.position;
                // if(!MyPlayerController.Movement.IsMoving){
                //     MyPlayerController.Movement.IsMoving = true;
                //     MyPlayerController.Movement.SetAnimParam("State", 102);
                // }
                MyPlayerController.Movement.SetAnimParam("State", 102);
                if (v.magnitude > 12) {
                    MyPlayerController.Movement.SetAnimParam("MoveState", 1);
                } else {
                    MyPlayerController.Movement.SetAnimParam("MoveState", 0);
                }
                if (v.magnitude > 27) {
                    MyPlayerController.Movement.Move(v.normalized.y, v.normalized.x, 27)
                } else {
                    MyPlayerController.Movement.Move(v.normalized.y, v.normalized.x, v.magnitude)
                }
            } else {
                // if(MyPlayerController.Movement.IsMoving){
                //     MyPlayerController.Movement.IsMoving = false;
                //     MyPlayerController.Movement.SetAnimParam("State", 1);
                // }
                MyPlayerController.Movement.SetAnimParam("State", 1);
            }
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

    UpdateBullet(){
        this.bullets.text = Manager.Game.GunController.Bullets.toString();
        let b = Manager.Game.GunController.Bullets - Manager.Game.GunController.BulletCnt;
        this.bulletcnt.text = b.toString();
    }
}