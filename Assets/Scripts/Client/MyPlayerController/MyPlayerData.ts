import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {
  WaitForSeconds,
  AudioListener,
  Random,
  GameObject,
  HumanBodyBones,
  Vector3,
  Quaternion,
  LayerMask,
} from 'UnityEngine';
import {PLAYER_STATE} from '../Enums';
import Connector from '../Network/Connector';
import Utils from '../Utils/index';
import Manager from '../Manager/Manager';
import MyPlayerController from './MyPlayerController';

export default class MyPlayerData extends ZepetoScriptBehaviour {
  private _myPlayer: ZepetoPlayer = null;

  private _mySessionId: string = null;

  private state: string = PLAYER_STATE.Live;

  private team: string = '';

  private myZem: number;

  private myGold: number;

  private myWeaponType: string;

  private myWeaponInfoArr: string[] = ['O', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];

  private nowWeapon: GameObject;

  private shootDir: Vector3;

  private shotGunDirs: Vector3[];

  private waitingWeeapon: string = '';

  private flag: GameObject;

  private inShield: boolean = false;

  get MyPlayer() {
    return this._myPlayer;
  }

  get MySessionId() {
    return this._mySessionId;
  }

  get MyZem() {
    return this.myZem;
  }

  set MyZem(value: number) {
    this.myZem = value;
    Manager.UI.StartUI.SetZem(value);
    if (Manager.UI.GameVoteUI) {
      Manager.UI.GameVoteUI.SetZem(value);
    }
    if (Manager.UI.RespawnUI) {
      Manager.UI.RespawnUI.SetZem(value);
    }
  }

  get MyGold() {
    return this.myGold;
  }

  set MyGold(value: number) {
    this.myGold = value;
    Manager.UI.StartUI.SetGold(value);
    if (Manager.UI.GameVoteUI) {
      Manager.UI.GameVoteUI.SetGold(value);
    }
    if (Manager.UI.RespawnUI) {
      Manager.UI.RespawnUI.SetZem(value);
    }
  }

  get MyWeaponType() {
    return this.myWeaponType;
  }

  set MyWeaponType(value: string) {
    this.myWeaponType = value;
  }

  get MyWeaponInfoArr() {
    return this.myWeaponInfoArr;
  }

  get NowWeapon() {
    return this.nowWeapon;
  }

  set NowWeapon(value: GameObject) {
    this.nowWeapon = value;
  }

  get ShootDir() {
    return this.shootDir;
  }

  set ShootDir(value: Vector3) {
    this.shootDir = value;
  }

  get ShotGunDirs() {
    return this.shotGunDirs;
  }

  set ShotGunDirs(value: Vector3[]) {
    this.shotGunDirs = value;
  }

  get WaitingWeeapon() {
    return this.waitingWeeapon;
  }

  set WaitingWeeapon(value: string) {
    this.waitingWeeapon = value;
  }

  get Flag() {
    return this.flag;
  }

  set Flag(value: GameObject) {
    this.flag = value;
  }

  get InShield() {
    return this.inShield;
  }

  set InShield(value: boolean) {
    this.inShield = value;
  }

  Init() {}

  SetMyPlayer(player: ZepetoPlayer) {
    this._myPlayer = player;
    this._mySessionId = player.id;
    this._myPlayer.character.gameObject.AddComponent<AudioListener>();
  }

  Update() {
    // if(this.state !== PLAYER_STATE.Die){
    //     if (this.hp <= 0) {
    //         this.state = PLAYER_STATE.Die;
    //         Connector.Instance.ReqToServer('PlayerDieReq')
    //     }
    // }
  }

  SetTeam(team: string) {
    this.team = team;
  }

  SetPlayerState(state: string) {
    this.state = state;
  }

  get Team() {
    return this.team;
  }

  EqiupGun(name: string) {
    if (this.nowWeapon) {
      GameObject.Destroy(this.nowWeapon);
    }
    this.nowWeapon = Manager.Resource.Instantiate('Prefabs\\Guns\\' + name);
    this.nowWeapon.transform.SetParent(
      MyPlayerController.Movement.MyAnimator.GetBoneTransform(
        HumanBodyBones.RightIndexIntermediate,
      ),
      false,
    );
    this.nowWeapon.transform.localPosition = Vector3.zero;
    this.nowWeapon.transform.localRotation = Quaternion.Euler(Vector3.zero);
    this.nowWeapon.name += '_';
    this.nowWeapon.name += this._mySessionId;
    Utils.ChangeLayer(
      this.nowWeapon,
      LayerMask.LayerToName(this._myPlayer.character.gameObject.layer),
    );
    const path = 'Weapon/' + name;
    this.myWeaponType = Manager.Data.GetValueByKeys(path + '/Type') as string;
    Connector.Instance.ReqToServer('EqiupGunReq', {name: name});
  }
}
