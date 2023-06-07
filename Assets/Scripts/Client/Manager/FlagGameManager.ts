import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";
import {GameObject, Transform} from "UnityEngine";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";

export interface InterFlagGameManager {
    Init(): void;

    GameStart(sessionId: string): void;

    JoinGame(team: string): void;

    LeaveGame(): void;
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
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        if(!this.FlagStartPoint) this.FlagStartPoint = GameObject.Find("FlagStartPoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.FlagStartPoint)
        this.myPlayerController.MyPlayerData.SetTeam('A')
    }

    JoinGame(team: string){

    }

    LeaveGame(){

    }
}