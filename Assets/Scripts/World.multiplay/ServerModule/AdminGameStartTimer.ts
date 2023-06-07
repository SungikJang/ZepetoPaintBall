import SyncComponentModule from "./Modules/SyncComponentModule";
import {SandboxPlayer} from "ZEPETO.Multiplay";


export interface IAdminGameStartTimer {
    Start(): void

    Destroy(): void
}

export default class AdminGameStartTimer implements IAdminGameStartTimer {
    private timer: number | undefined;
    private interval: number;
    private scm: SyncComponentModule;
    private client: SandboxPlayer;
    private cnt = 0;

    constructor(scm: SyncComponentModule, client: SandboxPlayer) {
        this.scm = scm;
        this.interval = 5000
        this.client = client;
    }

    Start() {
        this.scm.IsAdminPlayerAbsence = true;
        this.timer = setInterval(() => {
            this.scm.UrgeGameStart(this.client, this.cnt);
            this.cnt += 1
            this.interval -= 500;
            if(this.cnt > 2){
                this.Destroy();
            }
        }, this.interval);
    }

    Destroy() {
        clearInterval(this.timer);
    }
}