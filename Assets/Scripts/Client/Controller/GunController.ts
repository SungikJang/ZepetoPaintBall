import {Coroutine, ForceMode, GameObject, Ray, Rigidbody, Vector3, WaitForSeconds} from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import { WEAPON_TYPE } from '../Enums';
import IOC from '../IOC';
import Manager, {InterManager} from '../Manager/Manager';
import {InterMyPlayerController, MyPlayerController} from '../MyPlayer/MyPalyerController';
import Connector from '../Network/Connector';
import Utils from "../Utils/index"

export default class GunController extends ZepetoScriptBehaviour {
    public muzzle: GameObject;
    private type: string;
    private bullets: number
    private power: number
    private speed: number

    public manager: InterManager;

    public myPlayerController: InterMyPlayerController;

    public bulletPool: GameObject

    private bulletCnt: number = 0;

    private runOutBullet: boolean = false;

    private isZooming: boolean = false;

    private ray: Ray;
    
    private shootCoroutine: Coroutine;

    get Bullets(){
        return this.bullets
    }

    get BulletCnt(){
        return this.bulletCnt
    }

    OnEnable() {
        this.bulletCnt = 0;
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController.MyPlayerMovement.GunController = this;
        const path = 'Weapon/' + this.manager.UI.NowPopUpWeaponNum;
        this.type = this.manager.Data.GetValueByKeys(path + '/Type') as string;
        this.power = this.manager.Data.GetValueByKeys(path + '/Power') as number;
        this.speed = this.manager.Data.GetValueByKeys(path + '/Speed') as number;
        this.bullets = this.manager.Data.GetValueByKeys(path + '/Bullets') as number;
        this.manager.Game.GunController = this
        if(!this.bulletPool){
            this.bulletPool = this.manager.Resource.Instantiate("Prefabs\\Bullets\\" + this.bullets.toString() + this.type + "BulletPool")
            this.bulletPool.transform.SetParent(this.myPlayerController.MyPlayerData.MyPlayer.character.gameObject.transform)
        }
        if(this.manager.Game.ControllerUI){
            this.manager.Game.ControllerUI.UpdateBullet();
            if(this.type === WEAPON_TYPE.Sniper){
                this.manager.Game.ControllerUI.zoomObj.SetActive(true)
            }
        }
    }

    public Shoot(){
        switch(this.type){
            case WEAPON_TYPE.Riffle:
            case WEAPON_TYPE.Shotgun:
                Connector.Instance.ReqToServer("ShootStartReq");
                break
            case WEAPON_TYPE.Sniper:
                Connector.Instance.ReqToServer("ShootReq");
                break
        }
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
        if(!this.runOutBullet){
            switch (this.type) {
                case WEAPON_TYPE.Riffle:
                case WEAPON_TYPE.Sniper:
                    const Bullet = this.SpanwBullet(this.myPlayerController.MyPlayerData.Team)
                    Bullet.transform.position = this.muzzle.transform.position;
                    let dir: Vector3 = Utils.VectorMultiCalc(this.myPlayerController.MyPlayerData.ShootDir, this.power * 15)
                    Bullet.GetComponent<Rigidbody>().AddForce(dir);
                    break
                case WEAPON_TYPE.Shotgun:
                    for (let i = 0; i < 8; i++) {
                        let Sbullet = this.SpanwBullet(this.myPlayerController.MyPlayerData.Team)
                        Sbullet.transform.position = this.muzzle.transform.position;
                        let dir: Vector3 = Utils.VectorMultiCalc(this.myPlayerController.MyPlayerData.ShotGunDirs[i], this.power * 15)
                        Sbullet.GetComponent<Rigidbody>().AddForce(dir);
                    }
                    break
            }
            this.manager.Game.ControllerUI.UpdateBullet();
        }
        else{
            this.manager.UI.ShowPopUpUI("ReloadUI");
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
                    this.manager.Game.ControllerUI.reloadObj.SetActive(true)
                    this.runOutBullet = true
                }
                break;
            case "B":
                bullet = this.bulletPool.transform.GetChild(1).GetChild(this.bulletCnt).gameObject
                bullet.SetActive(true);
                this.bulletCnt += 1;
                if(this.bulletCnt >= this.bulletPool.transform.GetChild(1).childCount){
                    this.manager.Game.ControllerUI.reloadObj.SetActive(true)
                    this.runOutBullet = true
                }
                break;
            case this.myPlayerController.MyPlayerData.MySessionId:
                bullet = this.bulletPool.transform.GetChild(0).GetChild(this.bulletCnt).gameObject
                bullet.SetActive(true);
                this.bulletCnt += 1;
                if(this.bulletCnt >= this.bulletPool.transform.GetChild(0).childCount){
                    this.manager.Game.ControllerUI.reloadObj.SetActive(true)
                    this.runOutBullet = true
                }
                break;
        }
        return bullet;
    }

    *Reload(){
        yield new WaitForSeconds(2);
        if(this.bulletPool){
            this.manager.Resource.Destroy(this.bulletPool)
            this.bulletPool = null;
        }
        this.bulletPool = this.manager.Resource.Instantiate("Prefabs\\Bullets\\" + this.bullets.toString() + this.type + "BulletPool")
        this.bulletPool.transform.SetParent(this.myPlayerController.MyPlayerData.MyPlayer.character.gameObject.transform)
        this.bulletCnt = 0;
        this.runOutBullet = false
        this.manager.Game.ControllerUI.reloadObj.SetActive(false)
        this.manager.Game.ControllerUI.UpdateBullet();
    }

    public StartReload(){
        this.StartCoroutine(this.Reload());
    }

    Zoom(){
        if(!this.isZooming){
            this.manager.Game.ControllerUI.cross.SetActive(false);
            this.manager.Game.ControllerUI.SRUI.SetActive(true);
            this.isZooming = true
        }
        else{
            this.manager.Game.ControllerUI.cross.SetActive(true);
            this.manager.Game.ControllerUI.SRUI.SetActive(false);
            this.isZooming = false
        }
    }
}