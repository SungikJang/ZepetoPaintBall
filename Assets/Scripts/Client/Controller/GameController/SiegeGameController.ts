import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {
  BoxCollider,
  GameObject,
  LayerMask,
  Quaternion,
  Random,
  Transform,
  Vector3,
} from 'UnityEngine';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import Manager from '../../Manager/Manager';
import {GAME_NAME} from '../../Enums';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';
import Utils from '../../Utils/index';
import OtherZepetoCharacterController from '../OtherZepetoCharacterController';
import Connector from '../../Network/Connector';

export default class SiegeGameController extends ZepetoScriptBehaviour {
  private static _instance: SiegeGameController = null;

  public static get Instance() {
    return this._instance;
  }

  public siegeEnv: GameObject;
  public startPoint: Transform;
  public homePoint: Transform;

  private winningTeam: string = '';

  Awake() {
    try {
      if (!SiegeGameController._instance) {
        SiegeGameController._instance = this;
      }
    } catch (e) {
      console.error(e);
    }
  }

  Start() {
    this.siegeEnv.SetActive(false);
  }

  JoinGame(team: string) {
    Manager.UI.CloseDefaultUI('StartUI');
    Manager.UI.ShowDefaultUI('InGameUI');
    Manager.UI.ControllerUI.SetJump(true);
    Manager.UI.ControllerUI.SetPad(true);
    this.siegeEnv.SetActive(true);
    Connector.Instance.ReqToServer('SiegeTeamReq');
    MyPlayerController.Data.SetTeam(team);
    Manager.Game.IsGamePlaying = true;
    this.PlayerSpawn(team);
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
  }

  EndGame(winningTeam: string) {
    Manager.UI.CloseDefaultUI('InGameUI');
    Manager.UI.CloseDefaultUI('RespawnUI');
    Manager.UI.ControllerUI.SetJump(false);
    Manager.UI.ControllerUI.SetPad(false);
    this.siegeEnv.SetActive(false);
    MyPlayerController.Data.SetTeam('');
    Manager.Game.IsGamePlaying = false;
    MyPlayerController.Movement.Teleport(this.homePoint.position, this.homePoint.rotation);
  }

  PlayerSpawn(team: string) {
    let rangeCollider: BoxCollider;
    let respawnPosition: Vector3;
    if (team === 'A') {
      rangeCollider = this.startPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
      let range_X = rangeCollider.bounds.size.x;
      let range_Z = rangeCollider.bounds.size.z;

      range_X = Random.Range((range_X / 2) * -1, range_X / 2);
      range_Z = Random.Range((range_Z / 2) * -1, range_Z / 2);

      respawnPosition = Utils.VectorPlusCalc(
        this.startPoint.GetChild(0).GetChild(0).position,
        new Vector3(range_X, 0, range_Z),
      );
    } else {
      rangeCollider = this.startPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
      let range_X = rangeCollider.bounds.size.x;
      let range_Z = rangeCollider.bounds.size.z;

      range_X = Random.Range((range_X / 2) * -1, range_X / 2);
      range_Z = Random.Range((range_Z / 2) * -1, range_Z / 2);

      respawnPosition = Utils.VectorPlusCalc(
        this.startPoint.GetChild(1).GetChild(0).position,
        new Vector3(range_X, 0, range_Z),
      );
    }
    MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero));
  }

  PlayerRespawn(team: string) {
    Manager.UI.ShowDefaultUI('InGameUI');
    Manager.UI.CloseDefaultUI('RespawnUI');
    Manager.UI.ControllerUI.SetJump(true);
    Manager.UI.ControllerUI.SetPad(true);
    this.PlayerSpawn(team);
  }

  GetHit(player: GameObject) {
    Utils.ChangeLayer(player, 'hittedPlayer');
  }

  Siege(team: string) {
    if (team === 'A') {
      Manager.UI.InGameUI.BteamSiege.SetActive(false);
      Manager.UI.InGameUI.AteamSiege.SetActive(true);
    } else {
      Manager.UI.InGameUI.AteamSiege.SetActive(false);
      Manager.UI.InGameUI.BteamSiege.SetActive(true);
    }

    if (team === MyPlayerController.Data.Team) {
      //우리팀이 점령 성공했다 UI
      Manager.UI.ShowPopUpUI('MyTeamSiege');
    } else {
      //적이 점령 성공했다 UI
      Manager.UI.ShowPopUpUI('OpponentSiege');
    }
    this.winningTeam = team;
  }

  get WinnigTeam() {
    return this.winningTeam;
  }
}
