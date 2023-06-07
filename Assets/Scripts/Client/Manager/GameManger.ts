import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Connector from "../Network/Connector";
import Manager, { InterManager } from "./Manager";

export interface InterGameManager {
    nowOnGame: string

    GameJoin(sessionId: string, team?: string): void;
    
    GameStart(sessionId: string): void;
    
    Init(): void;
    
    get NowOnGame();
    
    set NowOnGame(value: string);
}

export default class GameManager implements InterGameManager{
    nowOnGame: string = ''
    manager: InterManager;
    
    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
    }

    get NowOnGame(){
        return this.nowOnGame
    }

    set NowOnGame(value: string){
        this.nowOnGame = value;
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
}