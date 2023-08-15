import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {
  WaitForSeconds,
  Vector3,
  GameObject,
  HumanBodyBones,
  Quaternion,
  LayerMask,
} from 'UnityEngine';
import Manager from '../Manager/Manager';
import OtherGunController from './OtherGunController';
import MyPlayerController from '../MyPlayerController/MyPlayerController';
import Utils from '../Utils/index';

export default class OtherZepetoCharacterController extends ZepetoScriptBehaviour {
  private sessionId: string;
  private player: ZepetoPlayer;
  public ShotGunDirs: Vector3[];
  public ShootDir: Vector3;
  public team: string;
  public haveFlag: boolean = false;
  public nowWeapon: GameObject;
  private instanceSet: boolean = false;

  private inShield: boolean = false;

  private gunController: OtherGunController;

  private mark: GameObject;

  private hitEffect: GameObject;

  OnHitEffect() {
    this.hitEffect.SetActive(true);
  }

  Start() {
    this.hitEffect = Manager.Resource.Instantiate('Prefabs\\Hit') as GameObject;
    this.hitEffect.transform.SetParent(
      ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform,
    );
    this.hitEffect.transform.localPosition = new Vector3(0, 0.55, 0);
    this.hitEffect.transform.localRotation = Quaternion.Euler(Vector3.zero);
    this.hitEffect.SetActive(false);
  }

  set Mark(value: GameObject) {
    this.mark = value;
    this.mark.transform.SetParent(this.gameObject.transform);
    this.mark.transform.position = new Vector3(0, 1, 0);
    this.mark.transform.rotation = Quaternion.Euler(Vector3.zero);
  }

  set SessionId(value: string) {
    this.sessionId = value;
    this.player = ZepetoPlayers.instance.GetPlayer(this.sessionId);
  }

  public GetHit() {
    this.gameObject.SetActive(false);
  }

  get InShield() {
    return this.inShield;
  }

  set InShield(value: boolean) {
    this.inShield = value;
  }

  set Team(value: string) {
    this.team = value;
    if (this.gunController) {
      this.gunController.team = this.team;
    }
  }

  Fire(dir: Vector3) {
    this.gunController.Fire(dir);
  }

  TakeFlag(flagObj: GameObject) {
    this.haveFlag = true;
    //
  }

  DestroyMark() {
    GameObject.Destroy(this.mark);
    this.mark = null;
  }

  EqiupGun(name: string) {
    if (this.nowWeapon) {
      GameObject.Destroy(this.nowWeapon);
    }
    this.nowWeapon = Manager.Resource.Instantiate('Prefabs\\OtherGuns\\' + name);
    this.nowWeapon.transform.SetParent(
      this.player.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.RightIndexIntermediate),
      false,
    );
    // 수정
    this.nowWeapon.transform.localPosition = Vector3.zero;
    this.nowWeapon.transform.localRotation = Quaternion.Euler(Vector3.zero);
    this.nowWeapon.name += '_';
    this.nowWeapon.name += this.gameObject.name;
    this.gunController = this.nowWeapon.GetComponent<OtherGunController>();
    this.gunController.team = this.team;
    Utils.ChangeLayer(
      this.nowWeapon,
      LayerMask.LayerToName(this.player.character.gameObject.layer),
    );
  }

  public StartShieldEffect() {
    this.StartCoroutine(this.ShieldEffect());
  }

  *ShieldEffect() {
    this.InShield = true;
    const ShieldEffect = Manager.Resource.Instantiate('Prefabs\\ShieldEffect');
    ShieldEffect.transform.SetParent(this.player.character.gameObject.transform);
    ShieldEffect.transform.localPosition = new Vector3(0, 0.65, 0);
    yield new WaitForSeconds(5);
    this.InShield = false;
  }
}
