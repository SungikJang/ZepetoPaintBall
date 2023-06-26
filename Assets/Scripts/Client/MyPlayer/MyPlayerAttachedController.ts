import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collision, Coroutine, GameObject, HumanBodyBones, Ray, Vector3, WaitForSeconds} from "UnityEngine";
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import IOC from '../IOC';
import { InterMyPlayerController, MyPlayerController } from './MyPalyerController';
import Manager, { InterManager } from '../Manager/Manager';
import { WEAPON_TYPE } from '../Enums';
import Connector from '../Network/Connector';
import LoadingUI from '../UI/PopUpUI/LoadingUI';

export default class MyPlayerAttachedController extends ZepetoScriptBehaviour {
    private static _instance: MyPlayerAttachedController = null;

    public static get Instance() {
        return this._instance;
    }

    public manager: InterManager;

    public myPlayerController: InterMyPlayerController;
    
    private siegeCoroutine: Coroutine
    private siegeCoroutineRunnig: boolean = false;

    Start() {
        if (!MyPlayerAttachedController._instance) {
            MyPlayerAttachedController._instance = this;
        }
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.myPlayerController.MyPlayerData.MyCoroutineController = this;
        this.myPlayerController.MyPlayerMovement.MyCoroutineController = this;
        this.StartCoroutine(this.FindCamera())
        this.StartCoroutine(this.SetDir())
        Connector.Instance.ReqToServer("StartInfoReq")
    }

    OnTriggerEnter(collider: GameObject) {
        if(collider.gameObject.CompareTag("flag")){
            if(this.manager.FlagGame.WinnigTeam === "") {
                Connector.Instance.ReqToServer("GetFlagReq", {
                    team: this.myPlayerController.MyPlayerData.Team
                })
                console.log("1")
            }
        }
        if(collider.gameObject.CompareTag("siegeZone")){
            if(this.manager.SiegeGame.SiegeTeam !== this.myPlayerController.MyPlayerData.Team){
                this.StartSiege()
            }
        }
        if(collider.gameObject.CompareTag("respawnZone")){
            this.manager.UI.InGameUI.shopObj.SetActive(true)
        }
    }

    OnTriggerExit(collider: GameObject) {
        if(collider.gameObject.CompareTag("siegeZone")){
            if(this.siegeCoroutineRunnig){
                this.StopSiege()
            }
        }
        if(collider.gameObject.CompareTag("respawnZone")){
            this.manager.UI.InGameUI.shopObj.SetActive(false)
        }
    }

    OnCollisionEnter(collision: Collision){
        if(collision.gameObject.CompareTag("bullet")){
            if(collision.gameObject.name.includes(this.myPlayerController.MyPlayerData.Team)){
                
            }
            else{
                Connector.Instance.ReqToServer("MyPlayerHit", {player: this.myPlayerController.MyPlayerData.MySessionId});
            }
        }
        
    }

    * FindCamera(){
        while(true){
            if(ZepetoPlayers.instance.LocalPlayer){
                this.manager.UI.ScreenCenter = new Vector3(ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.pixelWidth / 2, ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.pixelHeight / 2);
                let ls = this.manager.UI.ScreenCenter.x * 0.04
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x - ls, this.manager.UI.ScreenCenter.y, this.manager.UI.ScreenCenter.z))
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x - ls, this.manager.UI.ScreenCenter.y - ls, this.manager.UI.ScreenCenter.z))
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x - ls, this.manager.UI.ScreenCenter.y + ls, this.manager.UI.ScreenCenter.z))
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x, this.manager.UI.ScreenCenter.y - ls, this.manager.UI.ScreenCenter.z))
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x, this.manager.UI.ScreenCenter.y + ls, this.manager.UI.ScreenCenter.z))
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x + ls, this.manager.UI.ScreenCenter.y, this.manager.UI.ScreenCenter.z))
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x + ls, this.manager.UI.ScreenCenter.y + ls, this.manager.UI.ScreenCenter.z))
                this.manager.UI.SGCenter.push(new Vector3(this.manager.UI.ScreenCenter.x + ls, this.manager.UI.ScreenCenter.y - ls, this.manager.UI.ScreenCenter.z))
                return
            }
            yield new WaitForSeconds(0.1);
        }
    }

    * SetDir(){
        while(true){
            if(this.manager.Game.IsGamePlaying){
                if (this.myPlayerController.MyPlayerData.NowWeapon) {
                    let ray: Ray;
                    if (this.myPlayerController.MyPlayerData.MyWeaponType === WEAPON_TYPE.Shotgun) {
                        let dirs = ''
                        for (let i = 0; i < 8; i++) {
                            ray = new Ray(this.myPlayerController.MyPlayerMovement.GunController.muzzle.transform.position, ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.ScreenPointToRay(this.manager.UI.SGCenter[i]).direction);
                            let s: string = ray.direction.normalized.x.toString() + "_" + ray.direction.normalized.y.toString() + "_" + ray.direction.normalized.z.toString()
                            dirs += (s + " ")
                        }
                        Connector.Instance.ReqToServer("DirsReq", {dirs: dirs})
                    } else {
                        let dir: Vector3;
                        dir = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.ScreenPointToRay(this.manager.UI.ScreenCenter).direction;
                        ray = new Ray(this.myPlayerController.MyPlayerMovement.GunController.muzzle.transform.position, dir);
                        dir = ray.direction.normalized
                        let s: string = dir.x.toString() + "_" + dir.y.toString() + "_" + dir.z.toString()
                        Connector.Instance.ReqToServer("DirReq", {dir: s})
                    }
                }
            }
            yield new WaitForSeconds(0.1);
        }
    }
    
    *Siege(){
        let go = this.manager.UI.ShowPopUpUI("LoadingUI")
        let loadingUI = go.GetComponent<LoadingUI>();
        while(true){
            loadingUI.loadSlider.value += (1 / 35)
            yield new WaitForSeconds(0.1);
        }
        this.siegeCoroutineRunnig = false;
        this.manager.UI.DeletePopUpUI("LoadingUI")
        Connector.Instance.ReqToServer("SiegeReq", {team: this.myPlayerController.MyPlayerData.Team})
    }

    StartSiege(){
        if(!this.siegeCoroutineRunnig) {
            this.siegeCoroutine = this.StartCoroutine(this.Siege())
            this.siegeCoroutineRunnig = true;
        }
    }
    
    StopSiege(){
        if(this.siegeCoroutineRunnig){
            this.StopCoroutine(this.siegeCoroutine)
            this.manager.UI.DeletePopUpUI("LoadingUI")
            this.siegeCoroutineRunnig = false;
        }
    }
}