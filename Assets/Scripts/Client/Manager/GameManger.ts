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
            case '':
                //게임고르는 UI
                break
            case 'Flag':
                this.manager.FlagGame.JoinGame();
                break
            case 'Seige':
                this.manager.SeigeGame.JoinGame();
                break
            case 'SoloFlag':
                this.manager.SoloFlagGame.JoinGame();
                break
        }
    }
}