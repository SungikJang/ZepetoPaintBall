import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";
import {BoxCollider, GameObject, LayerMask, Quaternion, Random, Transform, Vector3} from "UnityEngine";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Utils from "../Utils/index"
import Connector from "../Network/Connector";
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import OtherZepetoCharacterController from "../Controller/OtherZepetoCharacterController";

export interface InterFlagGameManager {
    Init(): void;

    GameStart(sessionId: string): void;

    JoinGame(team: string): void;

    LeaveGame(): void;
    
    EndGame(winningTeam: string): void;

    RuntheGame(): void;

    Respawn(team: string)

    GetFlag(team: string, player: string)
    
    get WinnigTeam()

    FreeFlag()
}

export default class FlagGameManager implements InterFlagGameManager{
    manager: InterManager;
    myPlayerController: InterMyPlayerController;
    private FlagStartPoint: Transform;
    private FlagEnv: GameObject;
    private flagObj: GameObject
    
    private winningTeam: string = "";

    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.flagObj = GameObject.Find("Colliders").transform.GetChild(0).gameObject
        this.flagObj.SetActive(false);
        this.FlagEnv = GameObject.Find("FlagGameZone")
        this.FlagEnv.SetActive(false);
    }

    GameStart(sessionId: string){
        this.manager.Game.NowOnGame = GAME_NAME.Flag;
        this.manager.Game.GameStart(sessionId)
    }
    
    RuntheGame(){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.FlagEnv) this.FlagEnv = GameObject.Find("FlagGameZone");
        if(!this.flagObj) this.flagObj = GameObject.Find("Colliders").transform.GetChild(0).gameObject
        if(!this.FlagEnv.activeSelf){
            this.FlagEnv.SetActive(true)
        }
        if(!this.flagObj.activeSelf){
            this.flagObj.SetActive(true);
        }
        if(!this.FlagStartPoint) this.FlagStartPoint = GameObject.Find("FlagStartPoint").transform;
        let rangeCollider = this.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);
        
        let respawnPosition = Utils.VectorPlusCalc(this.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam('A')
        this.manager.Game.IsGamePlaying = true;
    }

    JoinGame(team: string){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.FlagEnv) this.FlagEnv = GameObject.Find("FlagGameZone");
        if(!this.FlagEnv.activeSelf){
            this.FlagEnv.SetActive(true)
        }
        if(!this.FlagStartPoint) this.FlagStartPoint = GameObject.Find("FlagStartPoint").transform;
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3;
        if(team === "A") {
            rangeCollider = this.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = this.FlagStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.FlagStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam(team)
        this.manager.Game.IsGamePlaying = true;
    }

    LeaveGame(){
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGamePlaying = false;
        if(!this.manager.Game.HomePoint) this.manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.HomePoint.position, this.manager.Game.HomePoint.rotation);
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ShowDefaultUI('StartUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
    }

    EndGame(winningTeam: string){
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
        if(!this.flagObj) this.flagObj = GameObject.Find("Flag")
        if(this.flagObj.activeSelf){
            this.flagObj.SetActive(false)
        }
        if(!this.FlagEnv) this.FlagEnv = GameObject.Find("FlagGameZone");
        if(this.FlagEnv.activeSelf){
            this.FlagEnv.SetActive(false)
        }
        if(winningTeam === this.myPlayerController.MyPlayerData.Team){
            //보상
        }
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGamePlaying = false;
        if(!this.manager.Game.HomePoint) this.manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.HomePoint.position, this.manager.Game.HomePoint.rotation);
    }

    Respawn(team: string){
        if(!this.FlagEnv) this.FlagEnv = GameObject.Find("FlagGameZone");
        if(!this.FlagEnv.activeSelf){
            this.FlagEnv.SetActive(true)
        }
        if(!this.FlagStartPoint) this.FlagStartPoint = GameObject.Find("FlagStartPoint").transform;
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3;
        if(team === "A") {
            rangeCollider = this.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = this.FlagStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.FlagStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    }
    
    GetFlag(team: string, player: string){
        console.log("4")
        this.winningTeam = team;
        if(!this.flagObj) this.flagObj = GameObject.Find("Flag")
        if(player === this.myPlayerController.MyPlayerData.MySessionId){
            console.log("5")
            //돈줘야댐
            this.myPlayerController.MyPlayerMovement.TakeFlag(this.flagObj);
        }
        else{
            ZepetoPlayers.instance.GetPlayer(player).character.gameObject.GetComponent<OtherZepetoCharacterController>().TakeFlag(this.flagObj)
        }
    }

    get WinnigTeam(){
        return this.winningTeam
    }

    FreeFlag(){
        if(!this.flagObj) this.flagObj = GameObject.Find("Flag")
        let p = this.flagObj.transform.position
        this.flagObj.transform.position = new Vector3(p.x, p.y - 2, p.z)
        this.flagObj.transform.SetParent(GameObject.Find("Colliders").transform)
        Connector.Instance.ReqToServer("FreeFlag")
    }
}