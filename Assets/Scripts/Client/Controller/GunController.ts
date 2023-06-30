import {Coroutine, ForceMode, GameObject, LineRenderer, Quaternion, Ray, Rigidbody, Vector3, WaitForSeconds} from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import { WEAPON_TYPE } from '../Enums';
import Manager from '../Manager/Manager';
import MyPlayerController from '../MyPlayerController/MyPlayerController';
import Connector from '../Network/Connector';
import Utils from "../Utils/index"

export default class GunController extends ZepetoScriptBehaviour {
    public muzzle: GameObject;
    private type: string;
    private bullets: number
    private power: number
    private speed: number
    
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
        MyPlayerController.Movement.GunController = this;
        const path = 'Weapon/' + Manager.UI.NowPopUpWeaponNum;
        this.type = Manager.Data.GetValueByKeys(path + '/Type') as string;
        this.power = Manager.Data.GetValueByKeys(path + '/Power') as number;
        this.speed = Manager.Data.GetValueByKeys(path + '/Speed') as number;
        this.bullets = Manager.Data.GetValueByKeys(path + '/Bullets') as number;
        Manager.Game.GunController = this
        if(!this.bulletPool){
            this.bulletPool = Manager.Resource.Instantiate("Prefabs\\Bullets\\" + this.bullets.toString() + this.type + "BulletPool")
            this.bulletPool.transform.SetParent(MyPlayerController.Data.MyPlayer.character.gameObject.transform)
        }
        if(Manager.Game.ControllerUI){
            Manager.Game.ControllerUI.UpdateBullet();
            if(this.type === WEAPON_TYPE.Sniper){
                Manager.Game.ControllerUI.ZoomObj.SetActive(true)
            }
        }
    }
    
    public Shoot(){
        switch(this.type){
            case WEAPON_TYPE.Riffle:
            case WEAPON_TYPE.Shotgun:
                this.StartShoot();
                break
            case WEAPON_TYPE.Sniper:
                this.Eject();
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
            let d: Vector3
            let dir: string;
            let dirs: string[] = [];
            let ray: Ray;
            switch (this.type) {
                case WEAPON_TYPE.Riffle:
                case WEAPON_TYPE.Sniper:
                    ray = new Ray(this.muzzle.transform.position, ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.ScreenPointToRay(Manager.UI.ScreenCenter).direction);
                    d = ray.direction.normalized
                    dir = d.x.toString() + " " + d.y.toString() + " " + d.z.toString();
                    break
                case WEAPON_TYPE.Shotgun:
                    for (let i = 0; i < 8; i++) {
                        ray = new Ray(this.muzzle.transform.position, ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.ScreenPointToRay(Manager.UI.SGCenter[i]).direction);
                        d = ray.direction.normalized
                        let s1: string = d.x.toString() + " " + d.y.toString() + " " + d.z.toString();
                        dirs.push(s1)
                    }
                    break
            }
            Connector.Instance.ReqToServer("EjectReq", {dir: dir, dirs: dirs})
        }
        else{
            Manager.UI.ShowPopUpUI("ReloadUI");
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
                    Manager.Game.ControllerUI.ReloadObj.SetActive(true)
                    this.runOutBullet = true
                }
                break;
            case "B":
                bullet = this.bulletPool.transform.GetChild(1).GetChild(this.bulletCnt).gameObject
                bullet.SetActive(true);
                this.bulletCnt += 1;
                if(this.bulletCnt >= this.bulletPool.transform.GetChild(1).childCount){
                    Manager.Game.ControllerUI.ReloadObj.SetActive(true)
                    this.runOutBullet = true
                }
                break;
            case MyPlayerController.Data.MySessionId:
                bullet = this.bulletPool.transform.GetChild(0).GetChild(this.bulletCnt).gameObject
                bullet.SetActive(true);
                this.bulletCnt += 1;
                if(this.bulletCnt >= this.bulletPool.transform.GetChild(0).childCount){
                    Manager.Game.ControllerUI.ReloadObj.SetActive(true)
                    this.runOutBullet = true
                }
                break;
        }
        return bullet;
    }

    *Reload(){
        yield new WaitForSeconds(2);
        if(this.bulletPool){
            Manager.Resource.Destroy(this.bulletPool)
            this.bulletPool = null;
        }
        this.bulletPool = Manager.Resource.Instantiate("Prefabs\\Bullets\\" + this.bullets.toString() + this.type + "BulletPool")
        this.bulletPool.transform.SetParent(MyPlayerController.Data.MyPlayer.character.gameObject.transform)
        this.bulletCnt = 0;
        this.runOutBullet = false
        Manager.Game.ControllerUI.ReloadObj.SetActive(false)
        Manager.Game.ControllerUI.UpdateBullet();
    }

    public StartReload(){
        this.StartCoroutine(this.Reload());
    }

    Zoom(){
        if(!this.isZooming){
            Manager.Game.ControllerUI.Cross.SetActive(false);
            Manager.Game.ControllerUI.SRUI.SetActive(true);
            this.isZooming = true
        }
        else{
            Manager.Game.ControllerUI.Cross.SetActive(true);
            Manager.Game.ControllerUI.SRUI.SetActive(false);
            this.isZooming = false
        }
    }
    
    public Fire(dir: Vector3, dirs: Vector3[]){
        let d: Vector3;
        switch (this.type) {
            case WEAPON_TYPE.Riffle:
            case WEAPON_TYPE.Sniper:
                const Bullet = this.SpanwBullet(MyPlayerController.Data.Team)
                Bullet.transform.position = this.muzzle.transform.position;
                d = Utils.VectorMultiCalc(dir, this.power * 15)
                Bullet.GetComponent<Rigidbody>().AddForce(d);
                break
            case WEAPON_TYPE.Shotgun:
                for (let i = 0; i < 8; i++) {
                    let Sbullet = this.SpanwBullet(MyPlayerController.Data.Team)
                    Sbullet.transform.position = this.muzzle.transform.position;
                    d = Utils.VectorMultiCalc(dirs[i], this.power * 15)
                    Sbullet.GetComponent<Rigidbody>().AddForce(d);
                }
                break
        }
        Manager.Game.ControllerUI.UpdateBullet();
    }
}