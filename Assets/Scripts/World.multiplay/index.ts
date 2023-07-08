import {Sandbox, SandboxOptions, SandboxPlayer} from "ZEPETO.Multiplay";
import { Player } from "ZEPETO.Multiplay.Schema";
import { IModule } from "./ServerModule/IModule";
import SyncComponentModule from "./ServerModule/Modules/SyncComponentModule";

export default class extends Sandbox {

    private readonly _modules: IModule[] = [];
    private _isCreated: boolean = false;

    async onCreate(options: SandboxOptions) {
        console.log("onCreate1")
        this._modules.push(new SyncComponentModule(this));
        console.log("onCreate2")
        for (const module of this._modules) {
            await module.OnCreate();
        }
        console.log("onCreate3")
        this._isCreated = true;
        console.log("onCreate4")
    }

    async onJoin(client: SandboxPlayer) {
        console.log("onJoin1")
        for (const module of this._modules) {
            await module.OnJoin(client);
        }
        console.log("onJoin2")

        const player = new Player();
        console.log("onJoin3")
        player.sessionId = client.sessionId;
        console.log("onJoin4")
        if (client.hashCode) {
            player.zepetoHash = client.hashCode;
        }
        console.log("onJoin5")
        if (client.userId) {
            player.zepetoUserId = client.userId;
        }
        console.log("onJoin6")
        this.state.players.set(client.sessionId, player);
        console.log("onJoin7")
        console.log(`join player, ${client.sessionId}`);
        
    }


    async onLeave(client: SandboxPlayer, consented?: boolean) {
        for (const module of this._modules) {
            await module.OnLeave(client);
        }
        this.state.players.delete(client.sessionId);

        console.log(`leave player, ${client.sessionId}`);
    }

    async onTick(deltaTime: number) {
        if (!this._isCreated) {
            return;
        }
        for (const module of this._modules) {
            module.OnTick(deltaTime);
        }
    }
}

