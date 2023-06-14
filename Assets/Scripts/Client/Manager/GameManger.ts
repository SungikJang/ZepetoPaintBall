import { Transform } from "UnityEngine";
import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import { InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Connector from "../Network/Connector";
import Manager, { InterManager } from "./Manager";

export interface InterGameManager {
    nowOnGame: string

    GameJoin(sessionId: string, team?: string): void;
    
    GameStart(sessionId: string): void;

    LeaveGame(): void;
    
    GameEnd(): void;
    
    Init(): void;

    get IsGameRunning();
    
    set IsGameRunning(value: boolean);
    
    get NowOnGame();
    
    set NowOnGame(value: string);

    get GameTime();
    
    set GameTime(value: number);

    get HomePoint();

    set HomePoint(value: Transform);
}

export default class GameManager implements InterGameManager{
    nowOnGame: string = ''
    manager: InterManager;
    isGameRunning: boolean = false;
    gameTime: number = 0;
    
    homePoint: Transform;
    
    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
    }

    get IsGameRunning(){
        return this.isGameRunning
    }

    set IsGameRunning(value: boolean){
        this.isGameRunning = value;
    }

    get NowOnGame(){
        return this.nowOnGame
    }

    set NowOnGame(value: string){
        this.nowOnGame = value;
    }

    get GameTime(){
        return this.gameTime
    }

    set GameTime(value: number){
        this.gameTime = value;
    }

    get HomePoint(){
        return this.homePoint
    }

    set HomePoint(value: Transform){
        this.homePoint = value;
    }
    
    GameJoin(sessionId: string, team?: string){
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                IOC.Instance.getInstance<InterManager>(Manager).FlagGame.JoinGame(team);
                break
            case GAME_NAME.Siege:
                IOC.Instance.getInstance<InterManager>(Manager).SeigeGame.JoinGame(team);
                break
            case GAME_NAME.SoloFlag:
                IOC.Instance.getInstance<InterManager>(Manager).SoloFlagGame.JoinGame();
                break
        }
    }

    GameStart(sessionId: string){
        Connector.Instance.ReqToServer("StartGameReq", {gameName: this.nowOnGame})
    }

    GameEnd(){
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                IOC.Instance.getInstance<InterManager>(Manager).FlagGame.EndGame();
                break
            case GAME_NAME.Siege:
                IOC.Instance.getInstance<InterManager>(Manager).SeigeGame.EndGame();
                break
            case GAME_NAME.SoloFlag:
                IOC.Instance.getInstance<InterManager>(Manager).SoloFlagGame.EndGame();
                break
        }
    }

    LeaveGame(){
        Connector.Instance.ReqToServer("LeaveGame", {player: IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController).MyPlayerData.MySessionId})
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                IOC.Instance.getInstance<InterManager>(Manager).FlagGame.LeaveGame();
                break
            case GAME_NAME.Siege:
                IOC.Instance.getInstance<InterManager>(Manager).SeigeGame.LeaveGame();
                break
            case GAME_NAME.SoloFlag:
                IOC.Instance.getInstance<InterManager>(Manager).SoloFlagGame.LeaveGame();
                break
        }
    }
}