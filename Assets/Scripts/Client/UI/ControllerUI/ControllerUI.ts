import {Animator, GameObject, Input, Time, Vector3, WaitForSeconds} from 'UnityEngine';
import {Button, Image} from 'UnityEngine.UI';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {WEAPON_TYPE} from '../../Enums';
import Manager from '../../Manager/Manager';
import Connector from '../../Network/Connector';
import {TMP_Text} from 'TMPro';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';

export default class ControllerUI extends ZepetoScriptBehaviour {
  private pad: GameObject;
  private padBackG: GameObject;
  private padObject: GameObject;
  private jumpObject: GameObject;
  private reloadObj: GameObject;
  private zoomObj: GameObject;
  private sRUI: GameObject;
  private cross: GameObject;
  private ShootBtnObj: GameObject;

  private MousePressed: boolean = false;
  private PressedTime: float;

  private instanceSet: boolean = false;

  private padReady: boolean = false;
  private btnReady: boolean = false;
  private btnSetted: boolean = false;

  private jumpBtn: Button;
  private reloadBtn: Button;
  private shootBtn: Button;
  private zoomBtn: Button;
  private bulletcnt: TMP_Text;
  private bullets: TMP_Text;

  private padAnim: Animator;

  get ZoomObj() {
    return this.zoomObj;
  }

  get ReloadObj() {
    return this.reloadObj;
  }

  get Cross() {
    return this.cross;
  }

  get SRUI() {
    return this.sRUI;
  }

  Start() {
    this.StartCoroutine(this.GetPad());
  }

  Update() {
    this.MouseInputController();
    this.PadInputController();
    if (Manager.Game.ControllerUI !== this) {
      Manager.Game.ControllerUI = this;
    }
    if (Manager.UI.ControllerUI !== this) {
      Manager.UI.ControllerUI = this;
    }
    if (
      this.pad &&
      this.padBackG &&
      this.padObject &&
      this.jumpObject &&
      this.reloadObj &&
      this.zoomObj &&
      this.sRUI &&
      this.cross &&
      this.ShootBtnObj
    ) {
      this.btnReady = true;
    } else {
      this.pad = this.gameObject.transform.GetChild(0).GetChild(2).GetChild(2).gameObject;
      this.padBackG = this.gameObject.transform.GetChild(0).GetChild(2).GetChild(1).gameObject;
      this.padObject = this.gameObject.transform.GetChild(0).GetChild(2).gameObject;
      this.jumpObject = this.gameObject.transform.GetChild(0).GetChild(3).gameObject;
      this.reloadObj = this.gameObject.transform.GetChild(0).GetChild(4).GetChild(3).gameObject;
      this.zoomObj = this.gameObject.transform.GetChild(0).GetChild(5).gameObject;
      this.sRUI = this.gameObject.transform.GetChild(0).GetChild(0).gameObject;
      this.cross = this.gameObject.transform.GetChild(1).gameObject;
      this.ShootBtnObj = this.gameObject.transform.GetChild(0).GetChild(6).gameObject;
      this.jumpBtn = this.jumpObject.GetComponent<Button>();
      this.reloadBtn = this.reloadObj.GetComponent<Button>();
      this.shootBtn = this.ShootBtnObj.GetComponent<Button>();
      this.zoomBtn = this.zoomObj.GetComponent<Button>();
      this.bulletcnt = this.gameObject.transform
        .GetChild(0)
        .GetChild(4)
        .GetChild(0)
        .gameObject.GetComponent<TMP_Text>();
      this.bullets = this.gameObject.transform
        .GetChild(0)
        .GetChild(4)
        .GetChild(2)
        .gameObject.GetComponent<TMP_Text>();
      this.padAnim = this.pad.GetComponent<Animator>();
    }

    if (this.btnReady && !this.btnSetted) {
      this.zoomObj.GetComponent<Button>().onClick.AddListener(() => {
        Manager.Game.GunController.Zoom();
      });
      this.gameObject.transform.GetChild(0).GetChild(4).gameObject.GetComponent<Button>().onClick.AddListener(() => {
        Manager.Game.GunController.StartReload();
      });
      this.jumpObject.GetComponent<Button>().onClick.AddListener(() => {
        MyPlayerController.Movement.Jump();
      });
      this.ShootBtnObj.GetComponent<Button>().onClick.AddListener(() => {
        MyPlayerController.Movement.Shoot();
      });

      this.padObject.SetActive(false);
      this.jumpObject.SetActive(false);
      this.ShootBtnObj.SetActive(false);
      this.zoomObj.SetActive(false);

      this.btnSetted = true;
    }
  }

  SetShootBtnObj(OnOff: boolean) {
    this.ShootBtnObj.SetActive(OnOff);
  }

  SetPad(OnOff: boolean) {
    this.padObject.SetActive(OnOff);
  }

  SetJump(OnOff: boolean) {
    this.jumpObject.SetActive(OnOff);
  }

  MouseInputController() {
    if (Input.GetMouseButton(0)) {
      if (Input.mousePosition.x > Manager.UI.ScreenCenter.x) {
        if (!this.MousePressed) {
          // 터치하는 순간
          this.MousePressed = true;
          this.PressedTime = Time.time;
          if (
            Manager.Game.IsGamePlaying &&
            MyPlayerController.Data.MyWeaponType !== WEAPON_TYPE.Sniper
          ) {
            MyPlayerController.Movement.Shoot();
          }
        } else {
        }
      }
    } else {
      if (this.MousePressed) {
        if (Time.time - this.PressedTime < 0.1) {
          //터치 함
        } else {
          //터치 떼는 순간
        }
        this.MousePressed = false;
        this.PressedTime = 0;
        if (MyPlayerController) {
          if (MyPlayerController.Data.MyWeaponType !== WEAPON_TYPE.Sniper) {
            MyPlayerController.Movement.GunController.StopShoot();
          }
        }
      }
    }
  }

  PadInputController() {
    if (this.padReady) {
      if (this.padAnim.GetCurrentAnimatorStateInfo(0).IsName('touchpad_handle_on')) {
        let v: Vector3 = this.pad.transform.position - this.padBackG.transform.position;
        // if(!MyPlayerController.Movement.IsMoving){
        //     MyPlayerController.Movement.IsMoving = true;
        //     MyPlayerController.Movement.SetAnimParam("State", 102);
        // }
        MyPlayerController.Movement.SetAnimParam('State', 102);
        if (v.magnitude > 12) {
          MyPlayerController.Movement.SetAnimParam('MoveState', 1);
        } else {
          MyPlayerController.Movement.SetAnimParam('MoveState', 0);
        }
        if (v.magnitude > 27) {
          MyPlayerController.Movement.Move(v.normalized.y, v.normalized.x, 27);
        } else {
          MyPlayerController.Movement.Move(v.normalized.y, v.normalized.x, v.magnitude);
        }
      } else {
        // if(MyPlayerController.Movement.IsMoving){
        //     MyPlayerController.Movement.IsMoving = false;
        //     MyPlayerController.Movement.SetAnimParam("State", 1);
        // }
        MyPlayerController.Movement.SetAnimParam('State', 1);
      }
    }
  }

  *GetPad() {
    while (!this.padReady) {
      if (this.padAnim && this.padBackG && this.pad) {
        this.padReady = true;
        return;
      }
      yield new WaitForSeconds(0.1);
    }
  }

  UpdateBullet() {
    if (this.bullets && this.bulletcnt) {
      this.bullets.text = Manager.Game.GunController.Bullets.toString();
      let b = Manager.Game.GunController.Bullets - Manager.Game.GunController.Bulletcnt;
      this.bulletcnt.text = b.toString();
    }
  }
}
