import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";
import {GameObject, Transform} from "UnityEngine";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";


export interface InterSeigeGameManager {
    Init(): void;
    
    GameStart(sessionId: string): void;
    
    JoinGame(team: string): void;

    LeaveGame(): void;
}

export default class SeigeGameManager implements InterSeigeGameManager{
    manager: InterManager;
    myPlayerController: InterMyPlayerController;
    private SeigeStartPoint: Transform;

    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
    }

    GameStart(sessionId: string){
        this.manager.Game.NowOnGame = GAME_NAME.Siege;
        this.manager.Game.GameStart(sessionId)
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        if(!this.SeigeStartPoint) this.SeigeStartPoint = GameObject.Find("SeigeStartPoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.SeigeStartPoint)
        this.myPlayerController.MyPlayerData.SetTeam('A')
    }

    JoinGame(team: string){
        
    }

    LeaveGame(){
        
    }
}
