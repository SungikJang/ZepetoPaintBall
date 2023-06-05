import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";

export interface InterGameManager {
    nowOnGmae: string
    
    GameStart(sessionId: string): void;
    
    Init(): void;
}

export default class GameManager implements InterGameManager{
    nowOnGmae: string = ''
    manager: InterManager;
    
    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
    }
    
    GameStart(sessionId: string){
        switch(this.nowOnGmae){
            case GAME_NAME.Flag:
                this.manager.FlagGame.JoinGame();
                break
            case GAME_NAME.Siege:
                this.manager.SeigeGame.JoinGame();
                break
            case GAME_NAME.SoloFlag:
                this.manager.SoloFlagGame.JoinGame();
                break
        }
    }
}