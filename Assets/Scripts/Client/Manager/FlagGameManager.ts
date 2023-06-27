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
    
    private winningTeam: string = "";

    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
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
        if(!this.manager.Game.ObjectController.FlagEnv.activeSelf){
            this.manager.Game.ObjectController.FlagEnv.SetActive(true)
        }
        if(!this.manager.Game.ObjectController.flagObj.activeSelf){
            this.manager.Game.ObjectController.flagObj.SetActive(true);
        }
        let rangeCollider = this.manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);
        
        let respawnPosition = Utils.VectorPlusCalc(this.manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam('A')
        this.manager.Game.IsGamePlaying = true;
    }

    JoinGame(team: string){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.manager.Game.ObjectController.FlagEnv.activeSelf){
            this.manager.Game.ObjectController.FlagEnv.SetActive(true)
        }
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3;
        if(team === "A") {
            rangeCollider = this.manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = this.manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam(team)
        this.manager.Game.IsGamePlaying = true;
    }

    LeaveGame(){
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGamePlaying = false;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.ObjectController.homePoint.position, this.manager.Game.ObjectController.homePoint.rotation);
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ShowDefaultUI('StartUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
    }

    EndGame(winningTeam: string){
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
        if(this.manager.Game.ObjectController.flagObj.activeSelf){
            this.manager.Game.ObjectController.flagObj.SetActive(false)
        }
        if(this.manager.Game.ObjectController.FlagEnv.activeSelf){
            this.manager.Game.ObjectController.FlagEnv.SetActive(false)
        }
        if(winningTeam === this.myPlayerController.MyPlayerData.Team){
            //보상
        }
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGamePlaying = false;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.ObjectController.homePoint.position, this.manager.Game.ObjectController.homePoint.rotation);
    }

    Respawn(team: string){
        if(!this.manager.Game.ObjectController.FlagEnv.activeSelf){
            this.manager.Game.ObjectController.FlagEnv.SetActive(true)
        }
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3;
        if(team === "A") {
            rangeCollider = this.manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = this.manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    }
    
    GetFlag(team: string, player: string){
        this.winningTeam = team;
        if(!this.manager.Game.ObjectController.flagObj) this.manager.Game.ObjectController.flagObj = this.manager.Game.ObjectController.flagObj;
        if(player === this.myPlayerController.MyPlayerData.MySessionId){
            //돈줘야댐
            this.myPlayerController.MyPlayerMovement.TakeFlag(this.manager.Game.ObjectController.flagObj);
        }
        else{
            ZepetoPlayers.instance.GetPlayer(player).character.gameObject.GetComponent<OtherZepetoCharacterController>().TakeFlag(this.manager.Game.ObjectController.flagObj)
        }
    }

    get WinnigTeam(){
        return this.winningTeam
    }

    FreeFlag(){
        let p = this.manager.Game.ObjectController.flagObj.transform.position
        this.manager.Game.ObjectController.flagObj.transform.position = new Vector3(p.x, p.y - 2, p.z)
        this.manager.Game.ObjectController.flagObj.transform.SetParent(this.manager.Game.ObjectController.Colliders);
        Connector.Instance.ReqToServer("FreeFlag")
    }
}