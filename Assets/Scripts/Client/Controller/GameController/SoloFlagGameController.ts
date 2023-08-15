import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {
  BoxCollider,
  GameObject,
  LayerMask,
  Quaternion,
  Random,
  Rigidbody,
  Transform,
  Vector3,
} from 'UnityEngine';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import Manager from '../../Manager/Manager';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';
import Utils from '../../Utils/index';
import Connector from '../../Network/Connector';
import OtherZepetoCharacterController from '../OtherZepetoCharacterController';

export default class SoloFlagGameController extends ZepetoScriptBehaviour {
  private static _instance: SoloFlagGameController = null;

  public static get Instance() {
    return this._instance;
  }

  public soloFlagEnv: GameObject;
  public flagObj: GameObject;
  public colliders: Transform;
  public startPoint: Transform;
  public homePoint: Transform;

  private winningTeam: string = '';

  Awake() {
    try {
      if (!SoloFlagGameController._instance) {
        SoloFlagGameController._instance = this;
      }
    } catch (e) {
      console.error(e);
    }
  }

  Start() {
    this.soloFlagEnv.SetActive(false);
  }

  JoinGame() {
    Manager.UI.CloseDefaultUI('StartUI');
    Manager.UI.ShowDefaultUI('InGameUI');
    Manager.UI.ControllerUI.SetJump(true);
    Manager.UI.ControllerUI.SetPad(true);
    this.soloFlagEnv.SetActive(true);
    this.flagObj.SetActive(true);
    MyPlayerController.Data.SetTeam(MyPlayerController.Data.MySessionId);
    Manager.Game.IsGamePlaying = true;
    this.PlayerSpawn();
  }

  LeaveGame(sessionId: string) {
    if (sessionId === MyPlayerController.Data.MySessionId) {
      Utils.ChangeLayer(MyPlayerController.Data.MyPlayer.character.gameObject, 'myPlayer');
      Utils.ChangeLayer(MyPlayerController.Data.NowWeapon, 'myPlayer');
      MyPlayerController.Data.SetTeam('');
      Manager.Game.IsGamePlaying = false;
      MyPlayerController.Movement.Teleport(this.homePoint.position, this.homePoint.rotation);
      Manager.UI.CloseDefaultUI('InGameUI');
      Manager.UI.ShowDefaultUI('StartUI');
      Manager.UI.CloseDefaultUI('RespawnUI');
      Manager.UI.ControllerUI.SetJump(false);
      Manager.UI.ControllerUI.SetPad(false);
    } else {
      Utils.ChangeLayer(
        ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject,
        'outGamePlayer',
      );
      Utils.ChangeLayer(
        ZepetoPlayers.instance
          .GetPlayer(sessionId)
          .character.gameObject.GetComponent<OtherZepetoCharacterController>().nowWeapon,
        'outGamePlayer',
      );
    }
    if (
      this.flagObj.transform.parent.gameObject ===
      ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject
    ) {
      this.flagObj.transform.SetParent(this.colliders);
    }
  }

  EndGame(winningTeam: string) {
    Manager.UI.CloseDefaultUI('InGameUI');
    Manager.UI.CloseDefaultUI('RespawnUI');
    Manager.UI.ControllerUI.SetJump(false);
    Manager.UI.ControllerUI.SetPad(false);
    this.soloFlagEnv.SetActive(false);
    this.flagObj.SetActive(false);
    MyPlayerController.Data.SetTeam('');
    Manager.Game.IsGamePlaying = false;
    MyPlayerController.Movement.Teleport(this.homePoint.position, this.homePoint.rotation);
    this.flagObj.transform.SetParent(this.colliders);
    this.flagObj.transform.localPosition = new Vector3(-17.3630009, -4.91300011, -85.072998);
    this.flagObj.transform.localRotation = Quaternion.Euler(Vector3.zero);
  }

  PlayerSpawn() {
    let rangeCollider: BoxCollider;
    let respawnPosition: Vector3;
    let ind = Utils.RandomInt(0, this.startPoint.childCount - 1);
    rangeCollider = this.startPoint.GetChild(ind).GetComponent<BoxCollider>();
    let range_X = rangeCollider.bounds.size.x;
    let range_Z = rangeCollider.bounds.size.z;

    range_X = Random.Range((range_X / 2) * -1, range_X / 2);
    range_Z = Random.Range((range_Z / 2) * -1, range_Z / 2);

    respawnPosition = Utils.VectorPlusCalc(
      this.startPoint.GetChild(ind).position,
      new Vector3(range_X, 0, range_Z),
    );
    MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero));
    MyPlayerController.Instance.StartShieldEffect();
  }

  PlayerRespawn() {
    Manager.UI.ShowDefaultUI('InGameUI');
    Manager.UI.CloseDefaultUI('RespawnUI');
    Manager.UI.ControllerUI.SetJump(true);
    Manager.UI.ControllerUI.SetPad(true);
    this.PlayerSpawn();
  }

  GetHit(player: GameObject) {
    this.FreeFlag();
    Utils.ChangeLayer(player, 'hittedPlayer');
  }

  GetFlag(team: string, player: string) {
    this.winningTeam = team;
    this.flagObj.transform.SetParent(
      ZepetoPlayers.instance.GetPlayer(player).character.gameObject.transform,
    );
    this.flagObj.transform.localPosition = new Vector3(0, 1.5, 0);
  }

  FreeFlag() {
    this.flagObj.transform.SetParent(this.colliders);
    const p = this.flagObj.transform.position;
    this.flagObj.transform.position = new Vector3(p.x, p.y - 1, p.z);
    Connector.Instance.ReqToServer('FreeFlag');
  }

  get WinnigTeam() {
    return this.winningTeam;
  }
}
