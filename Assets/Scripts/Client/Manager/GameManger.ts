import {GameObject, LayerMask, Transform, Vector3} from "UnityEngine";
import GunController from "../Controller/GunController";
import { GAME_NAME } from "../Enums";
import Connector from "../Network/Connector";
import Manager from "./Manager";
import ControllerUI from "../UI/ControllerUI/ControllerUI"
import {ProductRecord} from "ZEPETO.Product";
import MyPlayerController from "../MyPlayerController/MyPlayerController";
import FlagGameController from "../Controller/GameController/FlagGameController";
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import SiegeGameController from "../Controller/GameController/SiegeGameController";

export default class GameManager{
    nowOnGame: string = ''
    isGamePlaying: boolean = false;
    gameTime: number = 0;
    
    homePoint: Transform;

    private gunController: GunController
    
    private controllerUI: ControllerUI
    
    // private otherPlayers: string[] = [];
    //
    // private otherInGamePlayers: string[] = [];
    
    Init(){
        console.log("gamemanager")
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

    JoinGame(team?: string){
        switch (this.nowOnGame){
            case GAME_NAME.Flag:
                FlagGameController.Instance.JoinGame(team)
                break;
            case GAME_NAME.Siege:
                SiegeGameController.Instance.JoinGame(team)
                break;
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.RuntheGame(data.sessionId)
            //     break;
        }
    }

    LeaveGame(sessionId: string){
        if(sessionId === MyPlayerController.Data.MySessionId) {
            MyPlayerController.Data.MyPlayer.character.gameObject.layer = LayerMask.NameToLayer("myPlayer")
        }
        else{
            ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject.layer = LayerMask.NameToLayer("outGamePlayer")
        }
        switch (this.nowOnGame){
            case GAME_NAME.Flag:
                FlagGameController.Instance.LeaveGame(ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject)
                break;
            case GAME_NAME.Siege:
                SiegeGameController.Instance.LeaveGame()
                break;
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.RuntheGame(data.sessionId)
            //     break;
        }
    }

    EndGame(winningTeam: string){
        if(winningTeam === MyPlayerController.Data.Team){
            Manager.UI.ShowPopUpUI("WinUI")
        }
        else{
            Manager.UI.ShowPopUpUI("LoseUI")
        }
        Manager.UI.ShowDefaultUI("GameVoteUI")
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                FlagGameController.Instance.EndGame(winningTeam);
                break
            case GAME_NAME.Siege:
                SiegeGameController.Instance.EndGame(winningTeam);
                break
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.EndGame(winningTeam);
            //     break
        }
    }

    GetHit(sessionId: string){
        switch(this.nowOnGame){
            case GAME_NAME.Flag:
                FlagGameController.Instance.GetHit(ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject);
                break
            case GAME_NAME.Siege:
                SiegeGameController.Instance.GetHit(ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject);
                break
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.EndGame(winningTeam);
            //     break
        }
    }

    Respawn(team?: string){
        switch (this.nowOnGame){
            case GAME_NAME.Flag:
                FlagGameController.Instance.PlayerSpawn(team)
                break;
            case GAME_NAME.Siege:
                SiegeGameController.Instance.PlayerSpawn(team)
                break;
            // case GAME_NAME.SoloFlag:
            //     Manager.SoloFlagGame.RuntheGame(data.sessionId)
            //     break;
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
}