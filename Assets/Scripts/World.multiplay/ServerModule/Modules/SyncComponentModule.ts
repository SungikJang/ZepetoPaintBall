import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";
import {sVector3, sQuaternion, SyncTransform, PlayerAdditionalValue, ZepetoAnimationParam} from "ZEPETO.Multiplay.Schema";
import RespawnTimer from "../RespawnTimer";
import AdminGameStartTimer from "../AdminGameStartTimer";
import GameManager from "../GameTimer";

export default class SyncComponentModule extends IModule {
    private sessionIdQueue: string[] = [];
    private instantiateObjCaches : InstantiateObj[] = [];
    private masterClient: Function = (): SandboxPlayer | undefined => this.server.loadPlayer(this.sessionIdQueue[0]);
    
    private adminPlayer: string;
    private isAdminPlayerAbsence: boolean = false;
    
    private isGameRunning: boolean = false;
    private nowRunningGame: string = 'None'
    private nowGame: GameManager;
    private adminTimer: AdminGameStartTimer;
    private nowGameTime: number;
    
    set IsAdminPlayerAbsence(value: boolean){
        this.isAdminPlayerAbsence = value
    }

    async OnCreate() {
        this.ForBasic();
        this.ForCustomize();
    }

    async OnJoin(client: SandboxPlayer) {
        if(!this.adminPlayer){
            this.adminPlayer = client.sessionId
            this.adminTimer = new AdminGameStartTimer(this, client);
            this.adminTimer.Start();
        }
        if(!this.sessionIdQueue.includes(client.sessionId)) {
            this.sessionIdQueue.push(client.sessionId.toString());
        }
    }

    async OnLeave(client: SandboxPlayer) {
        if(this.sessionIdQueue.includes(client.sessionId)) {
            const leavePlayerIndex = this.sessionIdQueue.indexOf(client.sessionId);
            this.sessionIdQueue.splice(leavePlayerIndex, 1);
            if (leavePlayerIndex == 0) {
                console.log(`master->, ${this.sessionIdQueue[0]}`);
                this.server.broadcast(MESSAGE.MasterResponse, this.sessionIdQueue[0]);
            }
            if(this.sessionIdQueue.length > 0){
                this.adminPlayer = this.sessionIdQueue[0];
            }
        }
    }
    

    OnTick(deltaTime: number) {
    }
    
    ForCustomize(){
        this.server.onMessage(MESSAGE.GameStartBtnReq, (client, message) => {
            if(this.isGameRunning){
                if(this.nowRunningGame.includes('Solo')){
                    this.nowGame.JoinPlayer(client)
                }
                else{
                    this.nowGame.JoinPlayer(client)
                }
            }
            else{
                let admin: boolean = false;
                if(client.sessionId === this.adminPlayer) {
                    admin = true;
                }
                client.send('GameStartRes', { isAdmin: admin })
            }
        });

        this.server.onMessage(MESSAGE.StartGameReq, (client, message) => {
            this.isGameRunning = true;
            this.nowRunningGame = message.gameName;
            this.nowGame = new GameManager(this, client, message.gameName)
            this.adminTimer.Destroy();
            this.nowGame.Start();
        });

        this.server.onMessage(MESSAGE.PlayerDieReq, (client, message) => {
            const timer = new RespawnTimer(this, client);
            timer.Start();
            this.server.broadcast('PlayerDieRes', {player: client.sessionId})
        });
        
        this.server.onMessage(MESSAGE.JoinGameReq, (client, message) => {
            this.server.broadcast("JoinGameRes", {player: client.sessionId, time: this.nowGameTime})
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
    
    public GameStart(client: SandboxPlayer, gameName: string){
        client.send('GameStart', {sessionId: client.sessionId, gameName: gameName});
    }

    public GameJoin(client: SandboxPlayer, gameName: string, team?: string){
       if(team){
           client.send('GameJoinRes', {nowRunningGame: gameName, team: team});
       }
       else{
           client.send('GameJoinRes', {nowRunningGame: gameName});
       }
    }
    
    public EndGame(winningTeam: string){
        this.server.broadcast('EndGame', {winningTeam: winningTeam});
    }

    public SendRespawn(client: SandboxPlayer){
        this.server.broadcast('PlayerRespawn', {player: client.sessionId});
    }
    
    public UrgeGameStart(client: SandboxPlayer, cnt: number){
        if(this.isAdminPlayerAbsence){
            if (cnt > 1) {
                this.kickPlayer(client, client.sessionId);
                //  플레이어 퇴장
                this.isAdminPlayerAbsence = false;
            } else {
                client.send('UrgeGameStart', {player: client.sessionId});
            }
        }
    }
    
    public SendGameTime(cnt: number){
        this.nowGameTime = cnt
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
}
