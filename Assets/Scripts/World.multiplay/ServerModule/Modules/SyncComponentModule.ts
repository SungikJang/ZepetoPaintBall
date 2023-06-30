import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";
import {sVector3, sQuaternion, SyncTransform, PlayerAdditionalValue, ZepetoAnimationParam} from "ZEPETO.Multiplay.Schema";
import RespawnTimer from "../RespawnTimer";
import AdminGameStartTimer from "../AdminGameStartTimer";
import GameManager from "../GameManager";
//import {DataStorage} from "ZEPETO.Multiplay.DataStorage";
import {loadInventory} from "ZEPETO.Multiplay.Inventory";
import {loadCurrency} from "ZEPETO.Multiplay.Currency";
import { DataStorage } from "ZEPETO.Multiplay.DataStorage";
import GameVoteTimer from "../GameVoteTimer";

export default class SyncComponentModule extends IModule {
    private sessionIdQueue: string[] = [];
    private instantiateObjCaches : InstantiateObj[] = [];
    private masterClient: Function = (): SandboxPlayer | undefined => this.server.loadPlayer(this.sessionIdQueue[0]);
    
    private adminPlayer: SandboxPlayer;
    
    private isGameRunning: boolean = false;
    private nowGame: GameManager;
    private gameVote: GameVoteTimer;
    private adminTimer: AdminGameStartTimer;
    
    private playerWeaponInfo: Map<string,string> = new Map<string,string>();
    
    private HittedPlayer: string[] = []

    async OnCreate() {
        this.ForBasic();
        this.ForCustomize();
        this.ForProduct();
    }

    async OnJoin(client: SandboxPlayer) {
        if(!this.adminPlayer){
            this.adminPlayer = client
        }
        else{
            this.adminTimer = new AdminGameStartTimer(this, this.adminPlayer);
            this.adminTimer.Start();
        }
        if(!this.sessionIdQueue.includes(client.sessionId)) {
            this.sessionIdQueue.push(client.sessionId.toString());
        }
    }

    async OnLeave(client: SandboxPlayer) {
        if(this.sessionIdQueue.includes(client.sessionId)) {
            this.nowGame.LeavePlayer(client)
            const leavePlayerIndex = this.sessionIdQueue.indexOf(client.sessionId);
            this.sessionIdQueue.splice(leavePlayerIndex, 1);
            if (leavePlayerIndex == 0) {
                console.log(`master->, ${this.sessionIdQueue[0]}`);
                this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
            }
            if(this.sessionIdQueue.length > 0){
                this.adminPlayer = this.server.loadPlayer(this.sessionIdQueue[0]);
            }
            this.playerWeaponInfo.delete(client.sessionId)
        }
    }
    

    OnTick(deltaTime: number) {
    }

    ForCustomize(){
        this.server.onMessage(MESSAGE.StartInfoReq, async (client) => {
            const db: DataStorage = client.loadDataStorage();
            let last = (await db.get('lastEquipWeapon')) as string;
            if (!last) {
                last = "1"
            }
            let playerweapon: string[] = []
            this.playerWeaponInfo.forEach((values, key, obj) => {
                playerweapon.push(values + " " + key)
            })
            client.send("StartInfoRes", {lastEquipWeapon: last, playerWeapon: playerweapon})
        });
        
        this.server.onMessage(MESSAGE.GameStartBtnReq, (client, message) => {
            if(this.isGameRunning){
                this.nowGame.JoinPlayer(client)
            }
            else{
                let admin: boolean = false;
                if(client.sessionId === this.adminPlayer.sessionId) {
                    admin = true;
                }
                client.send('GameStartRes', { isAdmin: admin })
            }
        });

        this.server.onMessage(MESSAGE.StartGameReq, (client, message) => {
            this.isGameRunning = true;
            this.nowGame = new GameManager(this, client, message.gameName, true)
            if(this.adminTimer){
                this.adminTimer.Destroy();
                this.adminTimer = null
            }
            this.nowGame.Start();
        });

        this.server.onMessage(MESSAGE.LeaveGame, (client, message) => {
            this.server.broadcast("LeaveGameRes", {player:client.sessionId})
            this.nowGame.LeavePlayer(client);
        });

        this.server.onMessage(MESSAGE.SpineAngle, (client, message) => {
            this.server.broadcast("SpineAngleRes", {player: client.sessionId, spineAngle: message.spineAngle})
        });

        this.server.onMessage(MESSAGE.PlayerHit, (client, message) => {
            if(this.HittedPlayer.includes(client.sessionId)){
                this.HittedPlayer.slice(this.HittedPlayer.indexOf(client.sessionId), 1)
                this.server.broadcast("PlayerHitRes", {player: client.sessionId})
                let team = this.nowGame.GetTeam(client)
                const respawn = new RespawnTimer(this, client, team)
                respawn.Start();
            }
            else{
                this.HittedPlayer.push(client.sessionId);
            }
        });

        this.server.onMessage(MESSAGE.MyPlayerHit, (client, message) => {
            if(this.HittedPlayer.includes(client.sessionId)){
                this.HittedPlayer.slice(this.HittedPlayer.indexOf(client.sessionId), 1)
                this.server.broadcast("PlayerHitRes", {player: client.sessionId})
                let team = this.nowGame.GetTeam(client)
                const respawn = new RespawnTimer(this, client, team)
                respawn.Start();
            }
            else{
                this.HittedPlayer.push(client.sessionId);
            }
        });

        this.server.onMessage(MESSAGE.EqiupGunReq, (client, message) => {
            const db: DataStorage = client.loadDataStorage();
            db.set('lastEquipWeapon', message.name);
            this.playerWeaponInfo.set(client.sessionId, message.name)
            this.server.broadcast("EqiupGunRes", {player: client.sessionId, name: message.name})
        });

        this.server.onMessage(MESSAGE.SiegeReq, (client, message) => {
            this.server.broadcast("SiegeRes", {player:client.sessionId, team: message.team})
            this.nowGame.Siege(message.team)
        });
        
        this.server.onMessage(MESSAGE.GetFlagReq, (client, message) => {
            this.server.broadcast("GetFlagRes", {player:client.sessionId, team: message.team})
            this.nowGame.GetFlag(message.team)
        });

        this.server.onMessage(MESSAGE.FreeFlag, (client) => {
            this.nowGame.GetFlag("")
        });

        this.server.onMessage(MESSAGE.GameVote, (client, message) => {
            this.gameVote.Vote(client.sessionId, message.gameName)
            this.server.broadcast("Vote", {player: client.sessionId, userId: client.userId, gameName: message.gameName})
        });
        
        this.server.onMessage(MESSAGE.EjectReq, (client, message) => {
            this.server.broadcast("EjectRes", {player: client.sessionId, dir: message.dir, dirs: message.dirs})
        });
    }
    
    ForBasic(){
        /**Zepeto Player Sync**/
        this.server.onMessage(MESSAGE.SyncPlayer, (client, message) => {
            const player = this.server.state.players.get(client.sessionId);
            if (player) {
                const animationParam = new ZepetoAnimationParam();
                player.animationParam = Object.assign(animationParam, message.animationParam);
                player.gestureName = message.gestureName ?? null;

                if (message.playerAdditionalValue) {
                    const pAdditionalValue = new PlayerAdditionalValue();
                    player.playerAdditionalValue = Object.assign(pAdditionalValue, message.playerAdditionalValue);
                }
            }
        });

        /**Transform Sync**/
        this.server.onMessage(MESSAGE.SyncTransform, (client, message) => {
            const { Id, position, localPosition, rotation, scale, sendTime } = message;
            let syncTransform = this.server.state.SyncTransforms.get(Id.toString());

            if (!syncTransform) {
                syncTransform = new SyncTransform();
                this.server.state.SyncTransforms.set(Id.toString(), syncTransform);
            }

            Object.assign(syncTransform.position, position);
            Object.assign(syncTransform.localPosition, localPosition);
            Object.assign(syncTransform.rotation, rotation);
            Object.assign(syncTransform.scale, scale);
            syncTransform.sendTime = sendTime;
        });

        this.server.onMessage(MESSAGE.SyncTransformStatus, (client, message) => {
            const syncTransform = this.server.state.SyncTransforms.get(message.Id);
            if(syncTransform !== undefined) {
                syncTransform.status = message.Status;
            }
        });

        /** Sync Animaotr **/
        this.server.onMessage(MESSAGE.SyncAnimator, (client, message) => {
            const animator: SyncAnimator = {
                Id: message.Id,
                clipNameHash: message.clipNameHash,
                clipNormalizedTime: message.clipNormalizedTime,
            };
            const masterClient = this.masterClient();
            if (masterClient !== null && masterClient !== undefined) {
                this.server.broadcast(MESSAGE.ResponseAnimator + message.Id, animator, {except: masterClient});
            }
        });

        /** SyncTransform Util **/
        this.server.onMessage(MESSAGE.ChangeOwner, (client,message:string) => {
            this.server.broadcast(MESSAGE.ChangeOwner+message, client.sessionId);
        });
        this.server.onMessage(MESSAGE.Instantiate, (client,message:InstantiateObj) => {
            const InstantiateObj: InstantiateObj = {
                Id: message.Id,
                prefabName: message.prefabName,
                ownerSessionId: message.ownerSessionId,
                spawnPosition: message.spawnPosition,
                spawnRotation: message.spawnRotation,
            };
            this.instantiateObjCaches.push(InstantiateObj);
            this.server.broadcast(MESSAGE.Instantiate, InstantiateObj);
        });

        this.server.onMessage(MESSAGE.RequestInstantiateCache, (client) => {
            for (const obj of this.instantiateObjCaches) {
                client.send(MESSAGE.Instantiate, obj);
            }
        });

        /**SyncDOTween**/
        this.server.onMessage(MESSAGE.SyncDOTween, (client, message: syncTween) => {
            const tween: syncTween = {
                Id: message.Id,
                position: message.position,
                nextIndex: message.nextIndex,
                loopCount: message.loopCount,
                sendTime: message.sendTime,
            };
            const masterClient = this.masterClient();
            if (masterClient !== null && masterClient !== undefined) {
                this.server.broadcast(MESSAGE.ResponsePosition + message.Id, tween, {except: masterClient});
            }
        });

        /**Common**/
        this.server.onMessage(MESSAGE.CheckServerTimeRequest, (client, message) => {
            let Timestamp = +new Date();
            client.send(MESSAGE.CheckServerTimeResponse, Timestamp);
        });
        this.server.onMessage(MESSAGE.CheckMaster, (client, message) => {
            console.log(`master->, ${this.sessionIdQueue[0]}`);
            this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
        });
        this.server.onMessage(MESSAGE.PauseUser, (client) => {
            if(this.sessionIdQueue.includes(client.sessionId)) {
                const pausePlayerIndex = this.sessionIdQueue.indexOf(client.sessionId);
                this.sessionIdQueue.splice(pausePlayerIndex, 1);

                if (pausePlayerIndex == 0) {
                    console.log(`master->, ${this.sessionIdQueue[0]}`);
                    this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
                }
            }
        });
        this.server.onMessage(MESSAGE.UnPauseUser, (client) => {
            if(!this.sessionIdQueue.includes(client.sessionId)) {
                this.sessionIdQueue.push(client.sessionId);
                this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
            }
        });
    }
    
    ForProduct(){
        this.server.onMessage(MESSAGE.onCredit, (client, message) => {
            const currencyId = message.currencyId;
            const quantity = message.quantity ?? 1;

            //client.send("SyncBalances", {player: client.sessionId});
            this.AddCredit(client, currencyId, quantity);
        });

        this.server.onMessage(MESSAGE.onDebit, (client, message) => {

            console.log(`[onDebit]`);
            const currencyId = message.currencyId;
            const quantity = message.quantity ?? 1;

            this.OnDebit(client, currencyId, quantity);
        });


        this.server.onMessage("onAddInventory", async (client, message: InventoryMessage) => {

            console.log(`[onAddInventory]`);
            const productId = message.productId;
            const quantity = message.quantity ?? 1;

            try {
                const inventory = await loadInventory(client.userId);
                await inventory.add(productId, quantity);
                const inventorySync: InventorySync = {
                    productId: productId,
                    inventoryAction: InventoryAction.Add
                }
                client.send("SyncInventories", inventorySync);
                console.log("success add");

            } catch (e) {
                console.log(`${e}`);
            }
        });


        this.server.onMessage("onUseInventory", (client, message:InventoryMessage) => {

            console.log(`[onUseInventory]`);
            const productId = message.productId;
            const quantity = message.quantity ?? 1;

            this.UseInventory(client, productId, quantity);
        });

        this.server.onMessage("onRemoveInventory", (client, message:InventoryMessage) => {

            console.log(`[onRemoveInventory]`);
            const productId = message.productId;

            this.RemoveInventory(client, productId);
        });
    }
    
    public GameStart(client: SandboxPlayer, gameName: string){
        client.send('GameStart', {sessionId: client.sessionId, gameName: gameName});
    }

    public GameJoin(client: SandboxPlayer, gameName: string, team?: string){
       if(team){
           this.server.broadcast('GameJoinRes', {player: client.sessionId, nowRunningGame: gameName, team: team});
       }
       else{
           this.server.broadcast('GameJoinRes', {player: client.sessionId, nowRunningGame: gameName});
       }
    }
    
    public GameOver(){
        this.isGameRunning = false;
        this.nowGame.Destroy();
    }
    
    public EndGame(winningTeam: string, winningTeamPlayers: string[], players: string[]){
        for(let i = 0; i < winningTeamPlayers.length; i++){
            this.Reward(this.server.loadPlayer(winningTeamPlayers[i]), "zepetogunsgold", 100)
            this.Reward(this.server.loadPlayer(winningTeamPlayers[i]), "zepetogunsdia", 10)
        }
        this.server.broadcast('EndGame', {winningTeam: winningTeam, players: players});
        this.gameVote = new GameVoteTimer(this, players)
        this.gameVote.Start();
    }

    public SendRespawn(client: SandboxPlayer, team: string){
        this.server.broadcast('PlayerRespawn', {player: client.sessionId, team: team});
    }
    
    public UrgeGameStart(client: SandboxPlayer, cnt: number){
        if(!this.isGameRunning){
            if (cnt > 1) {
                this.kickPlayer(client, client.sessionId);
                //  플레이어 퇴장
            } else {
                client.send('UrgeGameStart', {player: client.sessionId});
            }
        }
    }
    
    public SendGameTime(cnt: number){
        this.server.broadcast('GameTime', {time: cnt})
    }

    async kickPlayer(client: SandboxPlayer, userId: string){
        let player: SandboxPlayer;
        if (userId == null) {
            player = client;
        } else {
            const kickPlayerSessionId: string = this.server.state.players.get(userId).sessionId;
            player = this.server.loadPlayer(kickPlayerSessionId);
        }

        console.log(`try kick : ${player.userId}`);
        await this.server.kick(player);

        this.server.broadcast("Log", `kick : ${player.userId}`);
    }
    
    async UseInventory(client: SandboxPlayer, productId: string, quantity: number) {

        try {
            const inventory = await loadInventory(client.userId);
            if (await inventory.use(productId, quantity) === true) {
                const inventorySync: InventorySync = {
                    productId: productId,
                    inventoryAction: InventoryAction.Use
                }
                client.send("SyncInventories", inventorySync);

            }
            else{
                console.log("use error");
            }
        }
        catch (e)
        {
            console.log(`${e}`);
        }
    }

    async RemoveInventory(client: SandboxPlayer, productId: string) {

        try {
            const inventory = await loadInventory(client.userId);
            if (await inventory.remove(productId) === true) {
                const inventorySync: InventorySync = {
                    productId: productId,
                    inventoryAction: InventoryAction.Remove
                }
                client.send("SyncInventories", inventorySync);
            }
            else{
                console.log("remove error");
            }
        }
        catch (e)
        {
            console.log(`${e}`);
        }
    }

    async AddCredit(client: SandboxPlayer, currencyId: string, quantity: number) {
        // try {
        //     const currency = await loadCurrency(client.userId);
        //     await currency.credit(currencyId, quantity);
        //
        //     client.send("SyncBalances");
        // }
        // catch (e)
        // {
        //     console.log(`${e}`);
        // }
        const currency = await loadCurrency(client.userId);
        await currency.credit(currencyId, quantity);

        client.send("SyncBalances", {player: client.sessionId});
        //client.send("SyncBalances");
    }

    async OnDebit(client: SandboxPlayer, currencyId: string, quantity: number) {
        try {
            const currency = await loadCurrency(client.userId);
            if(await currency.debit(currencyId, quantity) === true) {
                // const currencySync: CurrencyMessage = {
                //     currencyId: currencyId,
                //     quantity: -quantity
                // }
                client.send("SyncBalances");
            }
            else{
                //It's usually the case that there's no balance.
                client.send("DebitError", "Currency Not Enough");
            }
        }
        catch (e)
        {
            console.log(`${e}`);
        }
    }
    
    async Reward(client: SandboxPlayer, currencyId: string, quantity: number){
        const currency = await loadCurrency(client.userId);
        await currency.credit(currencyId, quantity);

        client.send("Reward", {player: client.sessionId, currencyId: currencyId, quantity: quantity});
    }

    GameVoteEnd(gameName: string, voters: string[]){
        this.isGameRunning = true;
        this.nowGame = new GameManager(this, this.adminPlayer, gameName, false)
        if(this.adminTimer){
            this.adminTimer.Destroy();
            this.adminTimer = null
        }
        this.nowGame.Start();
        this.server.broadcast("VoteEnd", {voters: voters})
    }
}
interface syncTween {
    Id: string,
    position: sVector3,
    nextIndex: number,
    loopCount: number,
    sendTime: number,
}

interface SyncAnimator {
    Id: string,
    clipNameHash: number,
    clipNormalizedTime: number,
}

interface InstantiateObj{
    Id:string;
    prefabName:string;
    ownerSessionId?:string;
    spawnPosition?:sVector3;
    spawnRotation?:sQuaternion;
}

enum MESSAGE {
    SyncPlayer = "SyncPlayer",
    SyncTransform = "SyncTransform",
    SyncTransformStatus = "SyncTransformStatus",
    SyncAnimator = "SyncAnimator",
    ResponseAnimator = "ResponseAnimator",
    ChangeOwner = "ChangeOwner",
    Instantiate = "Instantiate",
    RequestInstantiateCache = "RequestInstantiateCache",
    ResponsePosition = "ResponsePosition",
    SyncDOTween = "SyncDOTween",
    CheckServerTimeRequest = "CheckServerTimeRequest",
    CheckServerTimeResponse = "CheckServerTimeResponse",
    CheckMaster = "CheckMaster",
    MasterResponse = "MasterResponse",
    PauseUser = "PauseUser",
    UnPauseUser = "UnPauseUser",

    /** Sample Code **/

    GameStartBtnReq = "GameStartBtnReq",
    StartGameReq = "StartGameReq",
    PlayerDieReq = "PlayerDieReq",
    JoinGameReq = "JoinGameReq",
    LeaveGame = "LeaveGame",
    SpineAngle = "SpineAngle",
    PlayerDateReq = "PlayerDateReq",
    PlayerHit = "PlayerHit",
    MyPlayerHit = "MyPlayerHit",
    DirReq = "DirReq",
    DirsReq = "DirsReq",
    StopShootReq = "StopShootReq",
    ShootStartReq = "ShootStartReq",
    ShootReq = "ShootReq",
    EqiupGunReq = "EqiupGunReq",
    LastEquipWeaponReq = "LastEquipWeaponReq",
    SiegeReq = "SiegeReq",
    GetFlagReq = "GetFlagReq",
    StartInfoReq = "StartInfoReq",
    FreeFlag = "FreeFlag",
    onCredit = "onCredit",
    onDebit = "onDebit",
    GameVote = "GameVote",
    EjectReq = "EjectReq"
    
}
// interface CurrencyMessage {
//     currencyId: string,
//     quantity?: number,
// }

interface InventoryMessage {
    productId: string,
    quantity?: number,
}

interface InventorySync {
    productId: string,
    inventoryAction: InventoryAction,
}

export enum InventoryAction{
    Remove = -1,
    Use,
    Add,
}