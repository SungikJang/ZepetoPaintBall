import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World'
import { Room } from 'ZEPETO.Multiplay'
import {Player, State} from 'ZEPETO.Multiplay.Schema';
import {SpawnInfo, ZepetoPlayers} from "ZEPETO.Character.Controller";
import {
    AudioListener,
    GameObject,
    Quaternion,
    Resources,
    Vector3,
    WaitForSeconds
} from "UnityEngine";
import IOC from '../IOC';
import MyPlayerTriggerController from '../MyPlayer/MyPlayerTriggerController';
import { MyPlayerController } from '../MyPlayer/MyPalyerController';

export default class WorldMultiPlayStarter extends ZepetoScriptBehaviour {
    private static _instance: WorldMultiPlayStarter;

    public static get Instance(): WorldMultiPlayStarter {
        if (!WorldMultiPlayStarter._instance) {
            const go = GameObject.Find('WorldMultiPlayStarter');
            WorldMultiPlayStarter._instance = go.GetComponent<WorldMultiPlayStarter>();
        }
        return WorldMultiPlayStarter._instance;
    }
    
    
    private _multiplay: ZepetoWorldMultiplay;
    private _room: Room;
    
    private isAdmin: boolean = false;
    
    private _currentPlayers: Map<string, Player> = new Map<string, Player>();
    
    public get Room(): Room{
        return this._room;
    }
    public set Room(r: Room){
        this._room = r;
    }

    Start() {
        this.StartCoroutine(this.SetMultiPlay());
    }
    
    private OnStateChange(state: State, isFirst: boolean){
        if (isFirst) {
            // 서버에서 state가 처음으로 변화할 때 이벤트 리스너를 정의한다
            ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {
                // 플레이어를 생성하면 실행된다
                const player = ZepetoPlayers.instance.GetPlayer(sessionId);
                player.character.name = sessionId;
            });
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.AddComponent<MyPlayerTriggerController>();
                IOC.Instance.getInstance(MyPlayerController).MyPlayerData.SetMyPlayer();
                IOC.Instance.getInstance(MyPlayerController).MyPlayerMovement.SetMyPlayer();
            });
        }
        
        if(state.players.Count === 1){
            this.isAdmin = true;
        }
        let JoinPlayers = new Map<string, Player>();
        let leavePlayers = new Map<string, Player>(this._currentPlayers);
        
        state.players.ForEach((sessionId: string, gemtoryPlayer: Player) => {
            if (!this._currentPlayers.has(sessionId)) {
                JoinPlayers.set(sessionId, gemtoryPlayer);
            }
            leavePlayers.delete(sessionId);
        });
        JoinPlayers.forEach((gemtoryPlayer: Player, sessionId: string) =>
            this.OnJoinPlayer(sessionId, gemtoryPlayer)
        );
        leavePlayers.forEach((gemtoryPlayer: Player, sessionId: string) =>
            this.OnLeavePlayer(sessionId, gemtoryPlayer)
        );
    }

    private OnJoinPlayer(sessionId: string, gemtoryPlayer: Player) {
        this._currentPlayers.set(sessionId, gemtoryPlayer);

        const spawnInfo = new SpawnInfo();
        spawnInfo.position = new Vector3(0, 0, 0);
        spawnInfo.rotation = Quaternion.Euler(0, 0, 0);
        ZepetoPlayers.instance.CreatePlayerWithUserId(
            sessionId,
            gemtoryPlayer.userId,
            spawnInfo,
            this._room.SessionId === gemtoryPlayer.sessionId
        );
    }
    private OnLeavePlayer(sessionId: string, gemtoryPlayer: Player) {
        const leavePlayer = ZepetoPlayers.instance.GetPlayer(sessionId);

        this._currentPlayers.delete(sessionId);
        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }
    

    * SetMultiPlay(){
        while(true){
            this._multiplay = GameObject.Find("WorldMultiPlay").GetComponent<ZepetoWorldMultiplay>();
            if(this._multiplay) {
                this._multiplay.RoomCreated += (room: Room) => {
                    this._room = room
                }
                this._multiplay.RoomJoined += (room: Room) => {
                    room.OnStateChange += this.OnStateChange
                }
                console.log('MultiplaySetCompleted')
                return;
            }
            yield new WaitForSeconds(0.1);
        }
    }
    
}