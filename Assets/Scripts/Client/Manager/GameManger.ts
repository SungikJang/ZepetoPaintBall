import {GameObject, Transform, Vector3 } from "UnityEngine";
import GunController from "../Controller/GunController";
import { GAME_NAME } from "../Enums";
import Connector from "../Network/Connector";
import Manager from "./Manager";
import ControllerUI from "../UI/ControllerUI/ControllerUI"
import {ProductRecord} from "ZEPETO.Product";
import ObjectController from "../Controller/ObjectController";
import MyPlayerController from "../MyPlayerController/MyPlayerController";

export default class GameManager{
    nowOnGame: string = ''
    isGamePlaying: boolean = false;
    gameTime: number = 0;
    
    homePoint: Transform;

    private gunController: GunController
    
    private controllerUI: ControllerUI
    
    private objectController: ObjectController
    
    // private otherPlayers: string[] = [];
    //
    // private otherInGamePlayers: string[] = [];
    
    Init(){
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
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                Manager.FlagGame.JoinGame(team);
                break
            case GAME_NAME.Siege:
                Manager.SiegeGame.JoinGame(team);
                break
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.JoinGame();
            //     break
        }
    }

    GameStart(sessionId: string){
        Connector.Instance.ReqToServer("StartGameReq", {gameName: this.nowOnGame})
    }

    GameEnd(winningTeam: string){
        if(winningTeam === MyPlayerController.Data.Team){
            Manager.UI.ShowPopUpUI("WinUI")
        }
        else{
            Manager.UI.ShowPopUpUI("LoseUI")
        }
        Manager.UI.ShowDefaultUI("GameVoteUI")
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                Manager.FlagGame.EndGame(winningTeam);
                break
            case GAME_NAME.Siege:
                Manager.SiegeGame.EndGame(winningTeam);
                break
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.EndGame(winningTeam);
            //     break
        }
    }

    LeaveGame(){
        Connector.Instance.ReqToServer("LeaveGame", {player: MyPlayerController.Data.MySessionId})
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                Manager.FlagGame.LeaveGame();
                break
            case GAME_NAME.Siege:
                Manager.SiegeGame.LeaveGame();
                break
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.LeaveGame();
            //     break
        }
    }

    Respawn(team?: string){
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                Manager.FlagGame.Respawn(team);
                break
            case GAME_NAME.Siege:
                Manager.SiegeGame.Respawn(team);
                break
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.Respawn();
            //     break
        }
    }

    GameReady(){
        Manager.UI.DeleteDefaultUI("GameVoteUI")
        Manager.UI.ShowPopUpUI("GameReadyUI")
        Manager.UI.ShowDefaultUI("StartUI")
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

    get ObjectController(){
        return this.objectController
    }

    set ObjectController(value: ObjectController){
        this.objectController = value
    }
}