import SyncComponentModule from "./Modules/SyncComponentModule";
import {SandboxPlayer} from "ZEPETO.Multiplay";


export interface IGameManager {
    Start(): void

    Destroy(): void

    JoinPlayer(client: SandboxPlayer): void

    EndGame(): void

    GetFlag(): void
    
    Siege(): void
}

export default class GameManager implements IGameManager {
    private timer: number | undefined;
    private interval: number;
    private scm: SyncComponentModule;
    private cnt = 0;
    private gameName: string;
    private teamA: string[]
    private teamB: string[]
    private Starter: SandboxPlayer
    private winningTeam: string;

    constructor(scm: SyncComponentModule, client: SandboxPlayer, gameName: string) {
        this.scm = scm;
        this.interval = 1000
        this.gameName = gameName
        this.teamA = []
        this.teamB = []
        this.Starter = client
    }

    Start() {
        if(this.gameName.includes("Solo")){
            this.winningTeam = this.Starter.sessionId;
        }
        else{
            this.teamA.push(this.Starter.sessionId)
        }
        this.scm.GameStart(this.Starter, this.gameName);
        this.timer = setInterval(() => {
            this.scm.SendGameTime(this.cnt);
            this.cnt += 1
            if(this.cnt > 300){
                this.EndGame();
                this.Destroy();
            }
        }, this.interval);
    }
    
    JoinPlayer(client: SandboxPlayer){
        if(this.gameName === 'SoloFlag'){
            this.scm.GameJoin(client, this.gameName)
        }
        else{
            if (this.teamA.length >= this.teamB.length) {
                this.teamB.push(client.sessionId)
                this.scm.GameJoin(client, this.gameName, 'B')
            } else {
                this.teamA.push(client.sessionId)
                this.scm.GameJoin(client, this.gameName, 'A')
            }
        }
    }
    
    EndGame(){
        this.scm.EndGame(this.winningTeam);
    }
    
    GetFlag(){
        
    }
    
    Siege(){
        
    }

    Destroy() {
        clearInterval(this.timer);
    }
}