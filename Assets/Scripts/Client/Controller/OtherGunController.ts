import {
  Coroutine,
  ForceMode,
  GameObject,
  Ray,
  Rigidbody,
  Vector3,
  WaitForSeconds,
} from 'UnityEngine';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {WEAPON_TYPE} from '../Enums';
import Manager from '../Manager/Manager';
import MyPlayerController from '../MyPlayerController/MyPlayerController';
import Connector from '../Network/Connector';
import OtherZepetoCharacterController from './OtherZepetoCharacterController';
import Utils from '../Utils/index';

export default class OtherGunController extends ZepetoScriptBehaviour {
  public muzzle: GameObject;
  private type: string;
  private bullets: number;
  private power: number;
  private speed: number;

  public team: string = '';

  public otherZepetoCharacterController: OtherZepetoCharacterController;

  public bulletPool: GameObject;

  private bulletCnt: number = 0;

  private shootCoroutine: Coroutine;

  get Bullets() {
    return this.bullets;
  }

  get BulletCnt() {
    return this.bulletCnt;
  }

  OnEnable() {
    this.bulletCnt = 0;

    const path = 'Weapon/' + Manager.UI.NowPopUpWeaponNum;
    this.type = Manager.Data.GetValueByKeys(path + '/Type') as string;
    this.power = Manager.Data.GetValueByKeys(path + '/Power') as number;
    this.speed = Manager.Data.GetValueByKeys(path + '/Speed') as number;
    this.bullets = Manager.Data.GetValueByKeys(path + '/Bullets') as number;
  }

  SpanwBullet(team: string) {
    let bullet: GameObject;
    switch (team) {
      case 'A':
        bullet = this.bulletPool.transform.GetChild(0).GetChild(this.bulletCnt).gameObject;
        bullet.SetActive(true);
        this.bulletCnt += 1;
        if (this.bulletCnt >= this.bulletPool.transform.GetChild(0).childCount) {
          this.bulletCnt = 0;
          this.Reload();
        }
        break;
      case 'B':
        bullet = this.bulletPool.transform.GetChild(1).GetChild(this.bulletCnt).gameObject;
        bullet.SetActive(true);
        this.bulletCnt += 1;
        if (this.bulletCnt >= this.bulletPool.transform.GetChild(1).childCount) {
          this.bulletCnt = 0;
          this.Reload();
        }
        break;
      case 'Solo':
        break;
    }
    return bullet;
  }

  Reload() {
    GameObject.Destroy(this.bulletPool);
    this.bulletPool = null;
    this.bulletPool = Manager.Resource.Instantiate(
      'Prefabs\\Bullets\\' + this.bullets.toString() + this.type + 'BulletPool',
    );
    this.bulletPool.transform.SetParent(this.gameObject.transform);
  }

  public Fire(dir: Vector3) {
    let d: Vector3;
    const Bullet = this.SpanwBullet(this.team);
    Bullet.transform.position = this.muzzle.transform.position;
    d = Utils.VectorMultiCalc(dir, this.power * 15);
    Bullet.GetComponent<Rigidbody>().AddForce(d);
  }
}
