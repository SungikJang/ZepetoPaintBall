import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NetworkBase from './NetworkBase';
import {GameObject, LayerMask, Vector3} from "UnityEngine";
import MultiplayManager from './MultiplayManager';
import {Action$1} from "System";

import Manager from '../Manager/Manager';
import { GAME_NAME } from '../Enums';
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import OtherZepetoCharacterController from '../Controller/OtherZepetoCharacterController';
import MyPlayerController from '../MyPlayerController/MyPlayerController';

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
    
    
   

    public ManualSyncResHandlerFunc(room): void {
        room.AddMessageHandler(
            'GameStartRes',
            (data: { isAdmin: boolean }) => {
                if(data.isAdmin){
                    Manager.UI.ShowPopUpUI('GameSelectPopUpUI')
                }
                else{
                    Manager.UI.ShowPopUpUI('NotGameRunningUI')
                }
            }
        );

        room.AddMessageHandler(
            'GameJoinRes',
            (data: { player: string, nowRunningGame: string, team?: string }) => {
                if(data.player === MyPlayerController.Data.MySessionId){
                    if (data.team) {
                        Manager.Game.GameJoin(data.nowRunningGame, data.team)
                    } else {
                        Manager.Game.GameJoin(data.nowRunningGame)
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
                        Manager.FlagGame.RuntheGame()
                        break;
                    case GAME_NAME.Siege:
                        Manager.SiegeGame.RuntheGame()
                        break;
                    // case GAME_NAME.SoloFlag:
                    //     Manager.SoloFlagGame.RuntheGame(data.sessionId)
                    //     break;
                }
            }
        );

        room.AddMessageHandler(
            'UrgeGameStart',
            (data: { player: string }) => {
                Manager.UI.ShowPopUpUI("UrgeGameStartPopUpUI")
            }
        );

        room.AddMessageHandler(
            'GameTime',
            (data: { time: number }) => {
                Manager.Game.GameTime = data.time;
            }
        );

        room.AddMessageHandler(
            'EndGame',
            (data: { winningTeam: string, players: string[] }) => {
                if(data.players.includes(MyPlayerController.Data.MySessionId)){
                    Manager.Game.GameEnd(data.winningTeam);
                }
            }
        );

        room.AddMessageHandler(
            'SpineAngleRes',
            (data: { player: string, spineAngle: float }) => {
                if(data.player === MyPlayerController.Data.MySessionId){
                    MyPlayerController.Movement.SetSpineAngle(data.spineAngle);
                }
                else{
                    ZepetoPlayers.instance.GetPlayer(data.player).character.ZepetoAnimator.SetFloat("SpineAngle", data.spineAngle);
                }
            }
        );

        room.AddMessageHandler(
            'PlayerHitRes',
            (data: { player: string }) => {
                if(data.player === MyPlayerController.Data.MySessionId){
                    if(MyPlayerController.Movement.HavingFlag){
                        MyPlayerController.Movement.LostFlag()
                    }
                    MyPlayerController.Movement.GetHit();
                }
                else{
                    let c = ZepetoPlayers.instance.GetPlayer(data.player).character;
                    let opc = c.gameObject.GetComponent<OtherZepetoCharacterController>()
                    if(opc.haveFlag){
                        Manager.FlagGame.FreeFlag();
                    }
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.layer = LayerMask.NameToLayer("hitted")
                }
            }
        );

        room.AddMessageHandler(
            'PlayerRespawn',
            (data: { player: string, team: string }) => {
                if (data.player === MyPlayerController.Data.MySessionId) {
                    MyPlayerController.Data.MyPlayer.character.gameObject.layer = LayerMask.NameToLayer("player")
                    Manager.UI.InGameUI.readyObj.SetActive(true);
                }
                else{
                    if(Manager.Game.IsGamePlaying){
                        let c = ZepetoPlayers.instance.GetPlayer(data.player).character
                        c.gameObject.layer = LayerMask.NameToLayer("otherPlayer")
                    }
                }
            }
        );

        room.AddMessageHandler(
            'EqiupGunRes',
            (data: { player: string, name: string }) => {
                if (data.player !== MyPlayerController.Data.MySessionId) {
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().EqiupGun(data.name)
                    // Manager.Game.OtherPlayerWeaponInfo.set(data.player, data.name);
                    // let c = ZepetoPlayers.instance.GetPlayer(data.player).character
                }
            }
        );

        room.AddMessageHandler(
            'SiegeRes',
            (data: { player: string, team: string }) => {
                Manager.SiegeGame.Siege(data.team);
                if(data.player === MyPlayerController.Data.MySessionId){
                    //돈줘야댐
                }
            }
        );

        room.AddMessageHandler(
            'GetFlagRes',
            (data: { player: string, team: string }) => {
                Manager.FlagGame.GetFlag(data.team, data.player);
            }
        );

        room.AddMessageHandler(
            'StartInfoRes',
            (data: { lastEquipWeapon: string, playerWeapon: string[] }) => {
                Manager.Product.ProductSyncinstance.StartRefreshBalance();
                Manager.Product.ProductSyncinstance.StartRefreshInventory();
                MyPlayerController.Data.EqiupGun(data.lastEquipWeapon)
                for(let i = 0; i < data.playerWeapon.length; i++){
                    let s: string[] = data.playerWeapon[i].split(" ");
                    ZepetoPlayers.instance.GetPlayer(s[0]).character.gameObject.GetComponent<OtherZepetoCharacterController>().EqiupGun(s[1])
                }
            }
        );

        room.AddMessageHandler(
            'SyncBalances',
            (data: { players: string}) => {
                Manager.Product.ProductSyncinstance.StartRefreshBalance()
            }
        );

        room.AddMessageHandler(
            'VoteEnd',
            (data: { voters: string[] }) => {
                if(data.voters.includes(MyPlayerController.Data.MySessionId)){
                    Manager.Game.GameReady();
                }
            }
        );

        room.AddMessageHandler(
            'Vote',
            (data: { player: string, userId: string, gameName: string }) => {
                Manager.UI.GameVoteUI.CreatUserImage(data.player, data.userId, data.gameName)
            }
        );

        room.AddMessageHandler(
            'EjectRes',
            (data: { player: string, dir: string, dirs: string[] }) => {
                let dir: Vector3
                let dirs: Vector3[]
                let ss: string[];
                for(let i = 0; i < data.dirs.length; i++){
                    ss = data.dirs[i].split(" ")
                    dir = new Vector3(Number(ss[0]), Number(ss[1]), Number(ss[2]))
                    dirs.push(dir)
                }
                let s = data.dir.split(" ")
                dir = new Vector3(Number(s[0]), Number(s[1]), Number(s[2]))
                if(data.player === MyPlayerController.Data.MySessionId){
                    MyPlayerController.Movement.GunController.Fire(dir, dirs)
                }
                else{
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.GetComponent<OtherZepetoCharacterController>().Fire(dir, dirs)
                }
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