import {BoxCollider, GameObject, Quaternion, Random, Transform, Vector3} from "UnityEngine";
import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Manager, { InterManager } from "./Manager";
import Utils from "../Utils/index"
import Connector from "../Network/Connector";

export interface InterSoloFlagGameManager {
    Init(): void;

    GameStart(sessionId: string): void;

    JoinGame(): void;

    LeaveGame(): void;

    EndGame(winningTeam: string): void;

    RuntheGame(sessionId: string): void;

    Respawn()

    GetFlag()
}

export default class SoloFlagGameManager implements InterSoloFlagGameManager{
    manager: InterManager;
    myPlayerController: InterMyPlayerController;
    private SoloFlagStartPoint: Transform;
    
    private SoloFlagEnv: GameObject;

    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone")
        this.SoloFlagEnv.SetActive(false);
    }

    GameStart(sessionId: string){
        this.manager.Game.NowOnGame = GAME_NAME.SoloFlag;
        this.manager.Game.GameStart(sessionId);
    }

    RuntheGame(sessionId: string){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
        if(!this.SoloFlagEnv.activeSelf){
            this.SoloFlagEnv.SetActive(true)
        }
        if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("SoloFlagStartPoint").transform;
        const ind = Utils.RandomInt(0, this.SoloFlagStartPoint.childCount);
        let rangeCollider = this.SoloFlagStartPoint.GetChild(ind).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

        let respawnPosition = Utils.VectorPlusCalc(this.SoloFlagStartPoint.GetChild(ind).position, new Vector3(range_X, 0, range_Z));
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam(this.myPlayerController.MyPlayerData.MySessionId)
        this.manager.Game.IsGamePlaying = true;
    }
    
    JoinGame(){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
        if(!this.SoloFlagEnv.activeSelf){
            this.SoloFlagEnv.SetActive(true)
        }
        if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("SoloFlagStartPoint").transform;
        const ind = Utils.RandomInt(0, this.SoloFlagStartPoint.childCount);
        let rangeCollider = this.SoloFlagStartPoint.GetChild(ind).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

        let respawnPosition = Utils.VectorPlusCalc(this.SoloFlagStartPoint.GetChild(ind).position, new Vector3(range_X, 0, range_Z));
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam(this.myPlayerController.MyPlayerData.MySessionId);
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
        if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
        if(this.SoloFlagEnv.activeSelf){
            this.SoloFlagEnv.SetActive(false)
        }
        if(winningTeam === this.myPlayerController.MyPlayerData.Team){
            //보상
        }
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGamePlaying = false;
        if(!this.manager.Game.HomePoint) this.manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.HomePoint.position, this.manager.Game.HomePoint.rotation);
    }

    Respawn(){
        if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
        if(!this.SoloFlagEnv.activeSelf){
            this.SoloFlagEnv.SetActive(true)
        }
        if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("SoloFlagStartPoint").transform;
        const ind = Utils.RandomInt(0, this.SoloFlagStartPoint.childCount);
        let rangeCollider = this.SoloFlagStartPoint.GetChild(ind).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

        let respawnPosition = Utils.VectorPlusCalc(this.SoloFlagStartPoint.GetChild(ind).position, new Vector3(range_X, 0, range_Z));
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    }

    GetFlag(){
        Connector.Instance.ReqToServer("GetSoloFlag", {player: this.myPlayerController.MyPlayerData.MySessionId})
    }
}
