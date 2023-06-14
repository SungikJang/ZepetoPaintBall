import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";
import {GameObject, Quaternion, Transform, Vector3} from "UnityEngine";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Utils from "../Utils/index"

export interface InterFlagGameManager {
    Init(): void;

    GameStart(sessionId: string): void;

    JoinGame(team: string): void;

    LeaveGame(): void;
    
    EndGame(): void;

    RuntheGame(): void;
}

export default class FlagGameManager implements InterFlagGameManager{
    manager: InterManager;
    myPlayerController: InterMyPlayerController;
    private FlagStartPoint: Transform;

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
        if(!this.FlagStartPoint) this.FlagStartPoint = GameObject.Find("FlagStartPoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.FlagStartPoint.GetChild(0).GetChild(0))
        this.myPlayerController.MyPlayerData.SetTeam('A')
        this.manager.Game.IsGameRunning = true;
    }

    JoinGame(team: string){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.FlagStartPoint) this.FlagStartPoint = GameObject.Find("FlagStartPoint").transform;
        const ind = Utils.RandomInt(0, this.FlagStartPoint.GetChild(0).childCount);
        if(team === "A") {
            this.myPlayerController.MyPlayerMovement.Teleport(this.FlagStartPoint.GetChild(0).GetChild(ind))
        }
        else{
            this.myPlayerController.MyPlayerMovement.Teleport(this.FlagStartPoint.GetChild(1).GetChild(ind))
        }
        this.myPlayerController.MyPlayerData.SetTeam(team)
        this.manager.Game.IsGameRunning = true;
    }

    LeaveGame(){
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGameRunning = false;
        if(!this.manager.Game.HomePoint) this.manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.HomePoint);
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ShowDefaultUI('StartUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
    }

    EndGame(){
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
    }
}