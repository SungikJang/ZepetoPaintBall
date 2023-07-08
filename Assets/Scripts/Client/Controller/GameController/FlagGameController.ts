import {BoxCollider, GameObject, LayerMask, Quaternion, Random, Transform, Vector3} from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GAME_NAME } from '../../Enums';
import Manager from '../../Manager/Manager';
import MyPlayerController from '../../MyPlayerController/MyPlayerController';
import Utils from '../../Utils/index'
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import OtherZepetoCharacterController from '../OtherZepetoCharacterController';
import Connector from '../../Network/Connector';

export default class FlagGameController extends ZepetoScriptBehaviour {
    private static _instance: FlagGameController = null;

    public static get Instance() {
        return this._instance;
    }
    
    public flagEnv: GameObject;
    public flagObj: GameObject;
    public colliders: Transform;
    public startPoint: Transform;
    public homePoint: Transform;

    private winningTeam: string = "";

    Awake() {
        try {
            if (!FlagGameController._instance) {
                FlagGameController._instance = this;
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    Start() {
        this.flagEnv.SetActive(false)
    }
    
    JoinGame(team: string){
        Manager.UI.CloseDefaultUI('StartUI');
        Manager.UI.ShowDefaultUI('InGameUI');
        Manager.UI.ControllerUI.SetJump(true);
        Manager.UI.ControllerUI.SetPad(true);
        this.flagEnv.SetActive(true);
        this.flagObj.SetActive(true);
        MyPlayerController.Data.SetTeam(team)
        Manager.Game.IsGamePlaying = true;
        this.PlayerSpawn(team);
    }
    
    LeaveGame(player: GameObject){
        MyPlayerController.Data.SetTeam("")
        Manager.Game.IsGamePlaying = false;
        MyPlayerController.Movement.Teleport(this.homePoint.position, this.homePoint.rotation);
        Manager.UI.CloseDefaultUI('InGameUI')
        Manager.UI.ShowDefaultUI('StartUI')
        Manager.UI.CloseDefaultUI("RespawnUI")
        Manager.UI.ControllerUI.SetJump(false);
        Manager.UI.ControllerUI.SetPad(false);
        if(this.flagObj.transform.parent.gameObject === player){
            this.flagObj.transform.SetParent(null);
        }
    }

    EndGame(winningTeam: string){
        Manager.UI.CloseDefaultUI('InGameUI')
        Manager.UI.CloseDefaultUI("RespawnUI")
        Manager.UI.ControllerUI.SetJump(false);
        Manager.UI.ControllerUI.SetPad(false);
        this.flagEnv.SetActive(false);
        this.flagObj.SetActive(false);
        MyPlayerController.Data.SetTeam("")
        Manager.Game.IsGamePlaying = false;
        MyPlayerController.Movement.Teleport(this.homePoint.position, this.homePoint.rotation);
    }
    
    PlayerSpawn(team: string){
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3;
        if(team === "A") {
            rangeCollider = this.startPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.startPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = this.startPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.startPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    }

    GetHit(player: GameObject){
        if(this.flagObj.transform.parent.gameObject === player){
            this.flagObj.transform.SetParent(null);
        }
        player.layer = LayerMask.NameToLayer("hittedPlayer")
    }

    GetFlag(team: string, player: string){
        this.winningTeam = team;
        if(!this.flagObj) this.flagObj = this.flagObj;
        if(player === MyPlayerController.Data.MySessionId){
            //돈줘야댐
            this.flagObj.transform.SetParent(MyPlayerController.Data.MyPlayer.character.gameObject.transform)
        }
        else{
            this.flagObj.transform.SetParent(ZepetoPlayers.instance.GetPlayer(player).character.gameObject.transform)
        }
        this.flagObj.transform.localPosition = new Vector3(0,1.5,0)
    }

    FreeFlag(){
        let p = this.flagObj.transform.position
        this.flagObj.transform.position = new Vector3(p.x, p.y - 2, p.z)
        this.flagObj.transform.SetParent(this.colliders);
        Connector.Instance.ReqToServer("FreeFlag")
    }

    get WinnigTeam(){
        return this.winningTeam
    }
}