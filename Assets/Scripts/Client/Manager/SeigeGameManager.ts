import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";
import {GameObject, Quaternion, Transform, Vector3} from "UnityEngine";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Utils from "../Utils/index"


export interface InterSeigeGameManager {
    Init(): void;
    
    GameStart(sessionId: string): void;
    
    JoinGame(team: string): void;

    LeaveGame(): void;

    EndGame(): void;

    RuntheGame(): void;
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
    }

    RuntheGame(){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        if(!this.SeigeStartPoint) this.SeigeStartPoint = GameObject.Find("SeigeStartPoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.SeigeStartPoint)
        this.myPlayerController.MyPlayerData.SetTeam('A')
        this.manager.Game.IsGameRunning = true;
    }

    JoinGame(team: string){
        if(!this.SeigeStartPoint) this.SeigeStartPoint = GameObject.Find("FlagStartPoint").transform;
        const ind = Utils.RandomInt(0, this.SeigeStartPoint.GetChild(0).childCount);
        if(team === "A") {
            this.myPlayerController.MyPlayerMovement.Teleport(this.SeigeStartPoint.GetChild(0).GetChild(ind))
        }
        else{
            this.myPlayerController.MyPlayerMovement.Teleport(this.SeigeStartPoint.GetChild(1).GetChild(ind))
        }
        this.myPlayerController.MyPlayerData.SetTeam(team)
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
