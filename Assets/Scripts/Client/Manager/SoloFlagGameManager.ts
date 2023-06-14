import {GameObject, Quaternion, Transform, Vector3} from "UnityEngine";
import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Manager, { InterManager } from "./Manager";
import Utils from "../Utils/index"

export interface InterSoloFlagGameManager {
    Init(): void;

    GameStart(sessionId: string): void;

    JoinGame(): void;

    LeaveGame(): void;

    EndGame(): void;

    RuntheGame(sessionId: string): void;
}

export default class SoloFlagGameManager implements InterSoloFlagGameManager{
    manager: InterManager;
    myPlayerController: InterMyPlayerController;
    private SoloFlagStartPoint: Transform;

    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
    }

    GameStart(sessionId: string){
        this.manager.Game.NowOnGame = GAME_NAME.SoloFlag;
        this.manager.Game.GameStart(sessionId);
    }

    RuntheGame(sessionId: string){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("SoloFlagStartPoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.SoloFlagStartPoint)
        this.myPlayerController.MyPlayerData.SetTeam(sessionId)
        this.manager.Game.IsGameRunning = true;
    }
    
    JoinGame(){
        if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("FlagStartPoint").transform;
        const ind = Utils.RandomInt(0, this.SoloFlagStartPoint.GetChild(0).childCount);
        this.myPlayerController.MyPlayerMovement.Teleport(this.SoloFlagStartPoint.GetChild(1).GetChild(ind))
        this.myPlayerController.MyPlayerData.SetTeam(this.myPlayerController.MyPlayerData.MySessionId);
        this.manager.Game.IsGameRunning = true;
    }

    LeaveGame(){
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGameRunning = false;
        let t: Transform;
        t.position = Vector3.zero;
        t.rotation = Quaternion.Euler(Vector3.zero)
        this.myPlayerController.MyPlayerMovement.Teleport(t);
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ShowDefaultUI('StartUI')
    }

    EndGame(){
        
    }
}
