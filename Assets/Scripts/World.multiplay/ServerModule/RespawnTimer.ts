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

    constructor(scm: SyncComponentModule, client: SandboxPlayer) {
        this.scm = scm;
        this.interval = 3000
        this.client = client;
    }

    Start() {
        this.timer = setInterval(() => {
            this.scm.SendRespawn(this.client);
            this.Destroy();
        }, this.interval);
    }

    Destroy() {
        clearInterval(this.timer);
    }
}