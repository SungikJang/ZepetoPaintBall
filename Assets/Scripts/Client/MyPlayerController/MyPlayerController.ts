import {Collision, Coroutine, GameObject, Quaternion, Vector3, WaitForSeconds} from 'UnityEngine';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import FlagGameController from '../Controller/GameController/FlagGameController';
import SiegeGameController from '../Controller/GameController/SiegeGameController';
import Manager from '../Manager/Manager';
import Connector from '../Network/Connector';
import LoadingUI from '../UI/PopUpUI/LoadingUI';
import MyPlayerData from './MyPlayerData';
import MyPlayerMovement from './MyPlayerMovement';

export default class MyPlayerController extends ZepetoScriptBehaviour {
  private static _instance: MyPlayerController = null;
  private static _myPlayerData: MyPlayerData = new MyPlayerData();
  private static _myPlayerMovement: MyPlayerMovement = new MyPlayerMovement();

  private siegeCoroutine: Coroutine;
  private siegeCoroutineRunnig: boolean = false;

  public static get Instance(): MyPlayerController {
    return this._instance;
  }

  public static get Data(): MyPlayerData {
    return this._myPlayerData;
  }

  public static get Movement(): MyPlayerMovement {
    return this._myPlayerMovement;
  }

  Start() {
    if (!MyPlayerController._instance) {
      MyPlayerController._instance = this;
    }
    MyPlayerController.Data.Init();
    MyPlayerController.Movement.Init();
    MyPlayerController.Data.SetMyPlayer(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer);
    MyPlayerController.Movement.SetMyPlayer(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer);
    this.StartCoroutine(this.FindCamera());
    Manager.UI.ShowDefaultUI('StartUI');
    Connector.Instance.ReqToServer('StartInfoReq');
  }

  OnTriggerEnter(collider: GameObject) {
    if (collider.gameObject.CompareTag('flag')) {
      if (FlagGameController.Instance.WinnigTeam === '') {
        Connector.Instance.ReqToServer('GetFlagReq', {
          team: MyPlayerController.Data.Team,
        });
      }
    }
    if (collider.gameObject.CompareTag('siegeZone')) {
      if (SiegeGameController.Instance.WinnigTeam !== MyPlayerController.Data.Team) {
        this.StartSiege();
      }
    }
    if (collider.gameObject.CompareTag('respawnZone')) {
      Manager.UI.InGameUI.shopObj.SetActive(true);
    }
  }

  OnTriggerExit(collider: GameObject) {
    if (collider.gameObject.CompareTag('siegeZone')) {
      if (this.siegeCoroutineRunnig) {
        this.StopSiege();
      }
    }
    if (collider.gameObject.CompareTag('respawnZone')) {
      Manager.UI.InGameUI.shopObj.SetActive(false);
    }
  }

  OnCollisionEnter(collision: Collision) {
    if (collision.gameObject.CompareTag('bullet')) {
      if (collision.gameObject.name.includes(MyPlayerController.Data.Team + 'Bullet')) {
      } else {
        if (!MyPlayerController.Data.InShield) {
          console.log('내가맞음', collision.gameObject.name);
          Connector.Instance.ReqToServer('MyPlayerHit', {
            player: MyPlayerController.Data.MySessionId,
          });
        }
      }
    }
  }

  Update() {
    MyPlayerController.Movement.Rotate();
    MyPlayerController.Movement.LookDir();
    if (MyPlayerController.Data.MyPlayer) {
      if (MyPlayerController.Data.MyPlayer.character.characterController.isGrounded) {
        MyPlayerController.Movement.IsJumping = false;
      }
    }
  }

  *FindCamera() {
    while (true) {
      if (ZepetoPlayers.instance.LocalPlayer && Manager && Manager.UI) {
        Manager.UI.ScreenCenter = new Vector3(
          ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.pixelWidth / 2,
          ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.pixelHeight / 2,
        );
        let ls = Manager.UI.ScreenCenter.x * 0.015;
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x - ls,
            Manager.UI.ScreenCenter.y,
            Manager.UI.ScreenCenter.z,
          ),
        );
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x - ls,
            Manager.UI.ScreenCenter.y - ls,
            Manager.UI.ScreenCenter.z,
          ),
        );
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x - ls,
            Manager.UI.ScreenCenter.y + ls,
            Manager.UI.ScreenCenter.z,
          ),
        );
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x,
            Manager.UI.ScreenCenter.y - ls,
            Manager.UI.ScreenCenter.z,
          ),
        );
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x,
            Manager.UI.ScreenCenter.y + ls,
            Manager.UI.ScreenCenter.z,
          ),
        );
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x + ls,
            Manager.UI.ScreenCenter.y,
            Manager.UI.ScreenCenter.z,
          ),
        );
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x + ls,
            Manager.UI.ScreenCenter.y + ls,
            Manager.UI.ScreenCenter.z,
          ),
        );
        Manager.UI.SGCenter.push(
          new Vector3(
            Manager.UI.ScreenCenter.x + ls,
            Manager.UI.ScreenCenter.y - ls,
            Manager.UI.ScreenCenter.z,
          ),
        );
        return;
      }
      yield new WaitForSeconds(0.1);
    }
  }

  *Siege() {
    let go = Manager.UI.ShowPopUpUI('LoadingUI');
    let loadingUI = go.GetComponent<LoadingUI>();
    loadingUI.loadSlider.fillAmount = 0;
    while (true) {
      loadingUI.loadSlider.fillAmount += 0.025;
      yield new WaitForSeconds(0.1);
      if (loadingUI.loadSlider.fillAmount >= 1) {
        break;
      }
    }
    GameObject.Destroy(go);
    this.siegeCoroutineRunnig = false;
    Manager.UI.DeletePopUpUI('LoadingUI');
    Connector.Instance.ReqToServer('SiegeReq', {team: MyPlayerController.Data.Team});
  }

  StartSiege() {
    if (!this.siegeCoroutineRunnig) {
      this.siegeCoroutine = this.StartCoroutine(this.Siege());
      this.siegeCoroutineRunnig = true;
    }
  }

  StopSiege() {
    if (this.siegeCoroutineRunnig) {
      this.StopCoroutine(this.siegeCoroutine);
      Manager.UI.DeletePopUpUI('LoadingUI');
      this.siegeCoroutineRunnig = false;
    }
  }

  public StartShieldEffect() {
    this.StartCoroutine(this.ShieldEffect());
  }

  *ShieldEffect() {
    MyPlayerController.Data.InShield = true;
    const ShieldEffect = Manager.Resource.Instantiate('Prefabs\\ShieldEffect');
    ShieldEffect.transform.SetParent(
      MyPlayerController.Data.MyPlayer.character.gameObject.transform,
    );
    ShieldEffect.transform.localPosition = new Vector3(0, 0.65, 0);
    yield new WaitForSeconds(5);
    MyPlayerController.Data.InShield = false;
  }
}
