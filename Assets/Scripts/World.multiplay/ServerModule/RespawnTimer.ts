import SyncComponentModule from "./Modules/SyncComponentModule";
import {SandboxPlayer} from "ZEPETO.Multiplay";


export interface IRespawnTimer {
    Start(): void

    Destroy(): void
}

export default class RespawnTimer implements IRespawnTimer {
    private timer: number | undefined;
    private interval: number;
    private scm: SyncComponentModule;
    private client: SandboxPlayer;
    private team: string;

    constructor(scm: SyncComponentModule, client: SandboxPlayer, team: string) {
        this.scm = scm;
        this.interval = 3000
        this.client = client;
        this.team = team;
    }

    Start() {
        this.timer = setInterval(() => {
            this.scm.SendRespawn(this.client, this.team);
            this.Destroy();
        }, this.interval);
    }

    Destroy() {
        clearInterval(this.timer);
    }
}