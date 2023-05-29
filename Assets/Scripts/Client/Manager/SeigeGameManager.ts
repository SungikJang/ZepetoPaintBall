import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";

export interface InterSeigeGameManager {
    Init(): void;
    
    GameStart(sessionId: string): void;
    
    JoinGame(): void;

    LeaveGame(): void;
}

export default class SeigeGameManager implements InterSeigeGameManager{
    manager: InterManager;

    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
    }

    GameStart(sessionId: string){
        
    }

    JoinGame(){
        
    }

    LeaveGame(){
        
    }
}
