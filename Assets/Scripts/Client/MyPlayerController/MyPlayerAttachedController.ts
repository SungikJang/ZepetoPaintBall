import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collision, Coroutine, GameObject, HumanBodyBones, Quaternion, Ray, Vector3, WaitForSeconds} from "UnityEngine";
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import Manager from '../Manager/Manager';
import { WEAPON_TYPE } from '../Enums';
import Connector from '../Network/Connector';
import LoadingUI from '../UI/PopUpUI/LoadingUI';
import MyPlayerController from './MyPlayerController';

export default class MyPlayerAttachedController extends ZepetoScriptBehaviour {
    private static _instance: MyPlayerAttachedController = null;

    public static get Instance() {
        return this._instance;
    }
    
    private siegeCoroutine: Coroutine
    private siegeCoroutineRunnig: boolean = false;

    Start() {
        if (!MyPlayerAttachedController._instance) {
            MyPlayerAttachedController._instance = this;
        }
        MyPlayerController.Data.MyPlayerAttachedController = this;
        MyPlayerController.Movement.MyPlayerAttachedController = this;
        this.StartCoroutine(this.FindCamera())
        Manager.UI.ShowDefaultUI("StartUI")
        Connector.Instance.ReqToServer("StartInfoReq")  
    }

    OnTriggerEnter(collider: GameObject) {
        if(collider.gameObject.CompareTag("flag")){
            if(Manager.FlagGame.WinnigTeam === "") {
                Connector.Instance.ReqToServer("GetFlagReq", {
                    team: MyPlayerController.Data.Team
                })
                console.log("1")
            }
        }
        if(collider.gameObject.CompareTag("siegeZone")){
            if(Manager.SiegeGame.SiegeTeam !== MyPlayerController.Data.Team){
                this.StartSiege()
            }
        }
        if(collider.gameObject.CompareTag("respawnZone")){
            Manager.UI.InGameUI.shopObj.SetActive(true)
        }
    }

    OnTriggerExit(collider: GameObject) {
        if(collider.gameObject.CompareTag("siegeZone")){
            if(this.siegeCoroutineRunnig){
                this.StopSiege()
            }
        }
        if(collider.gameObject.CompareTag("respawnZone")){
            Manager.UI.InGameUI.shopObj.SetActive(false)
        }
    }

    OnCollisionEnter(collision: Collision){
        if(collision.gameObject.CompareTag("bullet")){
            if(collision.gameObject.name.includes(MyPlayerController.Data.Team)){
                
            }
            else{
                Connector.Instance.ReqToServer("MyPlayerHit", {player: MyPlayerController.Data.MySessionId});
            }
        }
        
    }

    * FindCamera(){
        while(true){
            if(ZepetoPlayers.instance.LocalPlayer && Manager &&Manager.UI){
                Manager.UI.ScreenCenter = new Vector3(ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.pixelWidth / 2, ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.pixelHeight / 2);
                let ls = Manager.UI.ScreenCenter.x * 0.04
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x - ls, Manager.UI.ScreenCenter.y, Manager.UI.ScreenCenter.z))
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x - ls, Manager.UI.ScreenCenter.y - ls, Manager.UI.ScreenCenter.z))
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x - ls, Manager.UI.ScreenCenter.y + ls, Manager.UI.ScreenCenter.z))
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x, Manager.UI.ScreenCenter.y - ls, Manager.UI.ScreenCenter.z))
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x, Manager.UI.ScreenCenter.y + ls, Manager.UI.ScreenCenter.z))
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x + ls, Manager.UI.ScreenCenter.y, Manager.UI.ScreenCenter.z))
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x + ls, Manager.UI.ScreenCenter.y + ls, Manager.UI.ScreenCenter.z))
                Manager.UI.SGCenter.push(new Vector3(Manager.UI.ScreenCenter.x + ls, Manager.UI.ScreenCenter.y - ls, Manager.UI.ScreenCenter.z))
                return
            }
            yield new WaitForSeconds(0.1);
        }
    }
    
    *Siege(){
        let go = Manager.UI.ShowPopUpUI("LoadingUI")
        let loadingUI = go.GetComponent<LoadingUI>();
        while(true){
            loadingUI.loadSlider.value += (1 / 35)
            yield new WaitForSeconds(0.1);
        }
        this.siegeCoroutineRunnig = false;
        Manager.UI.DeletePopUpUI("LoadingUI")
        Connector.Instance.ReqToServer("SiegeReq", {team: MyPlayerController.Data.Team})
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
            Manager.UI.DeletePopUpUI("LoadingUI")
            this.siegeCoroutineRunnig = false;
        }
    }
    
    Update(){
        MyPlayerController.Movement.Rotate();
        MyPlayerController.Movement.LookDir();
        if(MyPlayerController.Data.MyPlayer){
            if (MyPlayerController.Data.MyPlayer.character.characterController.isGrounded) {
                MyPlayerController.Movement.IsJumping = false;
            }
        }
    }
}