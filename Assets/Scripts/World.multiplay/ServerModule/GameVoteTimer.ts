import SyncComponentModule from "./Modules/SyncComponentModule";

export interface IGameVoteTimer {
    Start(): void

    Destroy(): void

    GameVoteEnd(): void

    Vote(player: string, gameName: string): void
}

export default class GameVoteTimer implements IGameVoteTimer {
    private timer: number | undefined;
    private interval: number;
    private scm: SyncComponentModule;
    private flag: number = 0;
    private siege: number = 0;
    private flagList: string[];
    private siegeList: string[];
    private voters: string[];

    constructor(scm: SyncComponentModule, voters: string[]) {
        this.scm = scm;
        this.voters = voters
        this.siegeList = []
        this.flagList = []
        this.interval = 15000
    }

    Start() {
        this.timer = setInterval(() => {
            this.GameVoteEnd()
            this.Destroy();
        }, this.interval);
    }
    
    Vote(player: string, gameName: string){
        switch (gameName){
            case "Flag":
                if(this.siegeList.includes(player)){
                    this.siegeList.splice(this.siegeList.indexOf(player), 1)
                    this.flag -= 1
                }
                this.flagList.push(player)
                this.flag += 1
                break
            case "Siege":
                if(this.flagList.includes(player)){
                    this.flagList.splice(this.flagList.indexOf(player), 1)
                    this.siege -= 1
                }
                this.siegeList.push(player)
                this.siege += 1
                break
        }
    }

    GameVoteEnd(){
        if(this.flag >= this.siege){
            this.scm.GameVoteEnd("Flag", this.voters)
        }
        else{
            this.scm.GameVoteEnd("Siege", this.voters)
        }
    }

    Destroy() {
        clearInterval(this.timer);
    }
}