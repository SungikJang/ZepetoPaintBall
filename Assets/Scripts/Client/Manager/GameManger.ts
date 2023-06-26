import {GameObject, Transform, Vector3 } from "UnityEngine";
import GunController from "../Controller/GunController";
import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import { InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Connector from "../Network/Connector";
import Manager, { InterManager } from "./Manager";
import ControllerUI from "../UI/ControllerUI/ControllerUI"
import {ProductRecord} from "ZEPETO.Product";

export interface InterGameManager {
    nowOnGame: string

    GameJoin(sessionId: string, team?: string): void;
    
    GameStart(sessionId: string): void;

    LeaveGame(): void;
    
    GameEnd(winningTeam: string): void;
    
    Init(): void;

    Respawn(team?: string)

    get IsGamePlaying();
    
    set IsGamePlaying(value: boolean);
    
    get NowOnGame();
    
    set NowOnGame(value: string);

    get GameTime();
    
    set GameTime(value: number);

    get HomePoint();

    set HomePoint(value: Transform);

    get GunController()

    set GunController(value: GunController)

    get ControllerUI()

    set ControllerUI(value: ControllerUI)

    get OtherPlayerWeaponInfo()

    set OtherPlayerWeaponInfo(value: Map<string, string>)

    GameReady()
    //
    // get OtherInGamePlayers()
    //
    // set OtherInGamePlayers(value: string[])
}

export default class GameManager implements InterGameManager{
    nowOnGame: string = ''
    manager: InterManager;
    isGamePlaying: boolean = false;
    gameTime: number = 0;
    
    homePoint: Transform;

    private gunController: GunController
    
    private controllerUI: ControllerUI
    
    private otherPlayerWeaponInfo: Map<string, string> = new Map<string, string>();
    
    // private otherPlayers: string[] = [];
    //
    // private otherInGamePlayers: string[] = [];
    
    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
    }

    get IsGamePlaying(){
        return this.isGamePlaying
    }

    set IsGamePlaying(value: boolean){
        this.isGamePlaying = value;
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

    get OtherPlayerWeaponInfo(){
        return this.otherPlayerWeaponInfo
    }

    set OtherPlayerWeaponInfo(value: Map<string, string>){
        this.otherPlayerWeaponInfo = value
    }
    //
    // get OtherInGamePlayers()
    // {
    //     return this.otherInGamePlayers
    // }
    //
    // set OtherInGamePlayers(value: string[])
    // {
    //     this.otherInGamePlayers = value
    // }
    
    GameJoin(sessionId: string, team?: string){
        Connector.Instance.ReqToServer("InGamePlayerReq");
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                IOC.Instance.getInstance<InterManager>(Manager).FlagGame.JoinGame(team);
                break
            case GAME_NAME.Siege:
                IOC.Instance.getInstance<InterManager>(Manager).SiegeGame.JoinGame(team);
                break
            case GAME_NAME.SoloFlag:
                IOC.Instance.getInstance<InterManager>(Manager).SoloFlagGame.JoinGame();
                break
        }
    }

    GameStart(sessionId: string){
        Connector.Instance.ReqToServer("StartGameReq", {gameName: this.nowOnGame})
    }

    GameEnd(winningTeam: string){
        if(winningTeam === IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController).MyPlayerData.Team){
            this.manager.UI.ShowPopUpUI("WinUI")
        }
        else{
            this.manager.UI.ShowPopUpUI("LoseUI")
        }
        this.manager.UI.ShowDefaultUI("GameVoteUI")
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                IOC.Instance.getInstance<InterManager>(Manager).FlagGame.EndGame(winningTeam);
                break
            case GAME_NAME.Siege:
                IOC.Instance.getInstance<InterManager>(Manager).SiegeGame.EndGame(winningTeam);
                break
            case GAME_NAME.SoloFlag:
                IOC.Instance.getInstance<InterManager>(Manager).SoloFlagGame.EndGame(winningTeam);
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
                IOC.Instance.getInstance<InterManager>(Manager).SiegeGame.LeaveGame();
                break
            case GAME_NAME.SoloFlag:
                IOC.Instance.getInstance<InterManager>(Manager).SoloFlagGame.LeaveGame();
                break
        }
    }

    Respawn(team?: string){
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                IOC.Instance.getInstance<InterManager>(Manager).FlagGame.Respawn(team);
                break
            case GAME_NAME.Siege:
                IOC.Instance.getInstance<InterManager>(Manager).SiegeGame.Respawn(team);
                break
            case GAME_NAME.SoloFlag:
                IOC.Instance.getInstance<InterManager>(Manager).SoloFlagGame.Respawn();
                break
        }
    }

    GameReady(){
        this.manager.UI.DeleteDefaultUI("GameVoteUI")
        this.manager.UI.ShowPopUpUI("GameReadyUI")
        this.manager.UI.ShowDefaultUI("StartUI")
    }

    get GunController(){
        return this.gunController
    }

    set GunController(value: GunController){
        this.gunController = value
    }

    get ControllerUI(){
        return this.controllerUI
    }

    set ControllerUI(value: ControllerUI){
        this.controllerUI = value
    }
}