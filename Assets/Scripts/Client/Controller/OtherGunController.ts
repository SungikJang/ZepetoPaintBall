import {Coroutine, ForceMode, GameObject, Ray, Rigidbody, Vector3, WaitForSeconds} from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import { WEAPON_TYPE } from '../Enums';
import IOC from '../IOC';
import Manager, {InterManager} from '../Manager/Manager';
import {InterMyPlayerController, MyPlayerController} from '../MyPlayer/MyPalyerController';
import Connector from '../Network/Connector';
import OtherZepetoCharacterController from './OtherZepetoCharacterController';

export default class OtherGunController extends ZepetoScriptBehaviour {
    public muzzle: GameObject;
    private type: string;
    private bullets: number
    private power: number
    private speed: number

    public manager: InterManager;

    public otherZepetoCharacterController: OtherZepetoCharacterController;

    public bulletPool: GameObject

    private bulletCnt: number = 0;
    
    private shootCoroutine: Coroutine;

    get Bullets(){
        return this.bullets
    }

    get BulletCnt(){
        return this.bulletCnt
    }

    OnEnable() {
        this.bulletCnt = 0;
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        const path = 'Weapon/' + this.manager.UI.NowPopUpWeaponNum;
        this.type = this.manager.Data.GetValueByKeys(path + '/Type') as string;
        this.power = this.manager.Data.GetValueByKeys(path + '/Power') as number;
        this.speed = this.manager.Data.GetValueByKeys(path + '/Speed') as number;
        this.bullets = this.manager.Data.GetValueByKeys(path + '/Bullets') as number;
    }
    
    public StartShoot(){
        this.shootCoroutine = this.StartCoroutine(this.ShootCoroutine())
    }

    public StopShoot(){
        this.StopCoroutine(this.shootCoroutine)
    }

    * ShootCoroutine(){
        while(true){
            this.Eject()
            yield new WaitForSeconds(8 / this.speed);
        }
    }

   public Eject(){
       switch (this.type) {
           case WEAPON_TYPE.Riffle:
           case WEAPON_TYPE.Sniper:
               let dir: Vector3
               dir = this.otherZepetoCharacterController.ShootDir
               const Bullet = this.SpanwBullet(this.otherZepetoCharacterController.team)
               Bullet.transform.position = this.muzzle.transform.position;
               Bullet.GetComponent<Rigidbody>().AddForce(dir * this.power * 15);
               break
           case WEAPON_TYPE.Shotgun:
               let dirs: Vector3[]
               dirs = this.otherZepetoCharacterController.ShotGunDirs
               for (let i = 0; i < 8; i++) {
                   let Sbullet = this.SpanwBullet(this.otherZepetoCharacterController.team)
                   Sbullet.transform.position = this.muzzle.transform.position;
                   Sbullet.GetComponent<Rigidbody>().AddForce(dirs[i] * this.power * 15);
               }
               break
       }
    }

    SpanwBullet(team: string){
        let bullet: GameObject;
        switch(team){
            case "A":
                bullet = this.bulletPool.transform.GetChild(0).GetChild(this.bulletCnt).gameObject
                bullet.SetActive(true);
                this.bulletCnt += 1;
                if(this.bulletCnt >= this.bulletPool.transform.GetChild(0).childCount){
                    this.bulletCnt = 0;
                    this.Reload()
                }
                break;
            case "B":
                bullet = this.bulletPool.transform.GetChild(1).GetChild(this.bulletCnt).gameObject
                bullet.SetActive(true);
                this.bulletCnt += 1;
                if(this.bulletCnt >= this.bulletPool.transform.GetChild(1).childCount){
                    this.bulletCnt = 0;
                    this.Reload()
                }
                break;
            case "Solo": 
                break;
        }
        return bullet;
    }
    
    Reload(){
        GameObject.Destroy(this.bulletPool)
        this.bulletPool = null;
        this.bulletPool = this.manager.Resource.Instantiate("Prefabs\\Bullets\\" + this.bullets.toString() + this.type + "BulletPool")
        this.bulletPool.transform.SetParent(this.gameObject.transform)
    }
}