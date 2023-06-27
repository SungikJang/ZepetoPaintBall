import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NetworkBase from './NetworkBase';
import {GameObject, LayerMask, Vector3} from "UnityEngine";
import MultiplayManager from './MultiplayManager';
import {Action$1} from "System";
import { InterMyPlayerController, MyPlayerController } from '../MyPlayer/MyPalyerController';
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import { GAME_NAME } from '../Enums';
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import OtherZepetoCharacterController from '../Controller/OtherZepetoCharacterController';

export interface InterConnector {
    ManualSyncResHandlerFunc(room): void;
    Start();
    Update();
}


export default class Connector extends NetworkBase implements InterConnector{
    private static _instance: Connector;

    public static get Instance(): Connector {
        if (!Connector._instance) {
            const go = GameObject.Find('Connector');
            Connector._instance = go.GetComponent<Connector>();
        }
        return Connector._instance;
    }
    
    private init: boolean = false;
    
    public myPlayerController: InterMyPlayerController;
    public manager: InterManager;

    public ManualSyncResHandlerFunc(room): void {
        room.AddMessageHandler(
            'GameStartRes',
            (data: { isAdmin: boolean }) => {
                if(data.isAdmin){
                    this.manager.UI.ShowPopUpUI('GameSelectPopUpUI')
                }
                else{
                    this.manager.UI.ShowPopUpUI('NotGameRunningUI')
                }
            }
        );

        room.AddMessageHandler(
            'GameJoinRes',
            (data: { player: string, nowRunningGame: string, team?: string }) => {
                if(data.player === this.myPlayerController.MyPlayerData.MySessionId){
                    if (data.team) {
                        this.manager.Game.GameJoin(data.nowRunningGame, data.team)
                    } else {
                        this.manager.Game.GameJoin(data.nowRunningGame)
                    }
                }
            }
        );

        room.AddMessageHandler(
            'LeaveGameRes',
            (data: { player: string }) => {
                
            }
        );

        room.AddMessageHandler(
            'GameStart',
            (data: { sessionId: string, gameName: string }) => {
                switch (data.gameName){
                    case GAME_NAME.Flag:
                        this.manager.FlagGame.RuntheGame()
                        break;
                    case GAME_NAME.Siege:
                        this.manager.SiegeGame.RuntheGame()
                        break;
                    // case GAME_NAME.SoloFlag:
                    //     this.manager.SoloFlagGame.RuntheGame(data.sessionId)
                    //     break;
                }
            }
        );

        room.AddMessageHandler(
            'UrgeGameStart',
            (data: { player: string }) => {
                this.manager.UI.ShowPopUpUI("UrgeGameStartPopUpUI")
            }
        );

        room.AddMessageHandler(
            'GameTime',
            (data: { time: number }) => {
                this.manager.Game.GameTime = data.time;
            }
        );

        room.AddMessageHandler(
            'EndGame',
            (data: { winningTeam: string, players: string[] }) => {
                if(data.players.includes(this.myPlayerController.MyPlayerData.MySessionId)){
                    this.manager.Game.GameEnd(data.winningTeam);
                }
            }
        );

        room.AddMessageHandler(
            'SpineAngleRes',
            (data: { player: string, spineAngle: float }) => {
                if(data.player === this.myPlayerController.MyPlayerData.MySessionId){
                    this.myPlayerController.MyPlayerMovement.SetSpineAngle(data.spineAngle);
                }
                else{
                    ZepetoPlayers.instance.GetPlayer(data.player).character.ZepetoAnimator.SetFloat("SpineAngle", data.spineAngle);
                }
            }
        );

        room.AddMessageHandler(
            'PlayerHitRes',
            (data: { player: string }) => {
                if(data.player === this.myPlayerController.MyPlayerData.MySessionId){
                    if(this.myPlayerController.MyPlayerMovement.HavingFlag){
                        this.myPlayerController.MyPlayerMovement.LostFlag()
                    }
                    this.myPlayerController.MyPlayerMovement.GetHit();
                }
                else{
                    let c = ZepetoPlayers.instance.GetPlayer(data.player).character;
                    let opc = c.gameObject.GetComponent<OtherZepetoCharacterController>()
                    if(opc.haveFlag){
                        this.manager.FlagGame.FreeFlag();
                    }
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.layer = LayerMask.NameToLayer("hitted")
                }
            }
        );

        room.AddMessageHandler(
            'PlayerRespawn',
            (data: { player: string, team: string }) => {
                if (data.player === this.myPlayerController.MyPlayerData.MySessionId) {
                    this.myPlayerController.MyPlayerData.MyPlayer.character.gameObject.layer = LayerMask.NameToLayer("player")
                    this.manager.UI.InGameUI.readyObj.SetActive(true);
                }
                else{
                    if(this.manager.Game.IsGamePlaying){
                        let c = ZepetoPlayers.instance.GetPlayer(data.player).character
                        c.gameObject.layer = LayerMask.NameToLayer("otherPlayer")
                    }
                }
            }
        );

        room.AddMessageHandler(
            'ShootStartRes',
            (data: { player: string }) => {
                if (data.player === this.myPlayerController.MyPlayerData.MySessionId) {
                    this.myPlayerController.MyPlayerMovement.GunController.StartShoot();
                }
                else{
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().StartShoot()
                }
            }
        );

        room.AddMessageHandler(
            'ShootRes',
            (data: { player: string }) => {
                if (data.player === this.myPlayerController.MyPlayerData.MySessionId) {
                    this.myPlayerController.MyPlayerMovement.GunController.Eject();
                }
                else{
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().Shoot()
                }
            }
        );

        room.AddMessageHandler(
            'StopShootRes',
            (data: { player: string }) => {
                if (data.player === this.myPlayerController.MyPlayerData.MySessionId) {
                    this.myPlayerController.MyPlayerMovement.GunController.StopShoot()
                }
                else{
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().StopShoot()
                }
            }
        );

        room.AddMessageHandler(
            'DirRes',
            (data: { player: string, dir: string }) => {
                if(this.manager.Game.IsGamePlaying){
                    let s = data.dir.split("_")
                    let dir = new Vector3(Number(s[0]), Number(s[1]), Number(s[2]))
                    if (data.player === this.myPlayerController.MyPlayerData.MySessionId) {
                        this.myPlayerController.MyPlayerData.ShootDir = dir
                    } else {
                        ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().ShootDir = dir
                    }
                }
            }
        );
        room.AddMessageHandler(
            'DirsRes',
            (data: { player: string, dirs: string }) => {
                if(this.manager.Game.IsGamePlaying){
                    let ss = data.dirs.split(" ")
                    let dirs: Vector3[] = []
                    for (let i = 0; i < 8; i++) {
                        let s = ss[i].split("_")
                        dirs.push(new Vector3(Number(s[0]), Number(s[1]), Number(s[2])))
                    }
                    if (data.player === this.myPlayerController.MyPlayerData.MySessionId) {
                        this.myPlayerController.MyPlayerData.ShotGunDirs = dirs
                    } else {
                        ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().ShotGunDirs = dirs
                    }
                }
            }
        );

        room.AddMessageHandler(
            'EqiupGunRes',
            (data: { player: string, name: string }) => {
                if (data.player !== this.myPlayerController.MyPlayerData.MySessionId) {
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().EqiupGun(data.name)
                    // this.manager.Game.OtherPlayerWeaponInfo.set(data.player, data.name);
                    // let c = ZepetoPlayers.instance.GetPlayer(data.player).character
                }
            }
        );

        room.AddMessageHandler(
            'SiegeRes',
            (data: { player: string, team: string }) => {
                this.manager.SiegeGame.Siege(data.team);
                if(data.player === this.myPlayerController.MyPlayerData.MySessionId){
                    //돈줘야댐
                }
            }
        );

        room.AddMessageHandler(
            'GetFlagRes',
            (data: { player: string, team: string }) => {
                this.manager.FlagGame.GetFlag(data.team, data.player);
            }
        );

        room.AddMessageHandler(
            'StartInfoRes',
            (data: { lastEquipWeapon: string, playerWeapon: string[] }) => {
                console.log("????")
                console.log(data.lastEquipWeapon)
                console.log(data.playerWeapon.length)
                this.myPlayerController.MyPlayerData.EqiupGun(data.lastEquipWeapon)
                for(let i = 0; i < data.playerWeapon.length; i++){
                    let s: string[] = data.playerWeapon[i].split(" ");
                    ZepetoPlayers.instance.GetPlayer(s[0]).character.gameObject.GetComponent<OtherZepetoCharacterController>().EqiupGun(s[1])
                }
            }
        );

        room.AddMessageHandler(
            'SyncBalances',
            (data: { players: string}) => {
                this.manager.Product.ProductSyncinstance.StartRefreshBalance()
            }
        );

        room.AddMessageHandler(
            'VoteEnd',
            (data: { voters: string[] }) => {
                if(data.voters.includes(this.myPlayerController.MyPlayerData.MySessionId)){
                    this.manager.Game.GameReady();
                }
            }
        );

        room.AddMessageHandler(
            'Vote',
            (data: { player: string, userId: string, gameName: string }) => {
                this.manager.UI.GameVoteUI.CreatUserImage(data.player, data.userId, data.gameName)
            }
        );
    }

    Start() {
        try {
            if (!MultiplayManager.instance) {
                //console.log('아직 오토어쩌고 인스턴스가 없음');
                return;
            } else {
                const room = MultiplayManager.instance.room;
                if (room) {
                    if (room.IsConnected) {
                        this._room = room;
                        this.ManualSyncResHandlerFunc(room);
                        this.GetServerTimeDifference();
                        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
                        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
                        this.init = true;
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    Update() {
        try {
            if (!this.init) {
                if (!MultiplayManager.instance) {
                    //console.log('아직 오토어쩌고 인스턴스가 없음');
                    return;
                } else {
                    const room = MultiplayManager.instance.room;
                    if (room) {
                        if (room.IsConnected) {
                            this._room = room;
                            this.ManualSyncResHandlerFunc(room);
                            this.GetServerTimeDifference();
                            this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
                            this.manager = IOC.Instance.getInstance<InterManager>(Manager);
                            this.init = true;
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}