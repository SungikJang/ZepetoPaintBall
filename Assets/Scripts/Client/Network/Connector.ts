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
import FlagGameController from '../Controller/GameController/FlagGameController';
import SiegeGameController from '../Controller/GameController/SiegeGameController';

export default class Connector extends NetworkBase{
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
            'GameStartBtnRes',
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
            'OpenGameRes',
            (data: { sessionId: string, gameName: string }) => {
                Manager.Game.NowOnGame = GAME_NAME.Flag;
                Manager.Game.JoinGame('A');
            }
        );

        room.AddMessageHandler(
            'GameJoinRes',
            (data: { player: string, nowRunningGame: string, team?: string }) => {
                if(data.player === MyPlayerController.Data.MySessionId){
                    if (Manager.Game.NowOnGame === data.nowRunningGame) {
                        if (data.team) {
                            Manager.Game.JoinGame(data.team)
                        } else {
                            Manager.Game.JoinGame()
                        }
                    }
                }
                else{
                    ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.layer = LayerMask.NameToLayer("inGamePlayer")
                }
            }
        );

        room.AddMessageHandler(
            'LeaveGameRes',
            (data: { player: string }) => {
                Manager.Game.LeaveGame(data.player);
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
            (data: { winningTeam: string }) => {
                Manager.Game.EndGame(data.winningTeam);
            }
        );
        
        room.AddMessageHandler(
            'AdminChanged',
            (data: { player: string }) => {
                Manager.UI.ShowPopUpUI('AdminChangedUI')
            }
        );

        room.AddMessageHandler(
            'WaitForNextGame',
            (data: { player: string }) => {
                Manager.UI.ShowPopUpUI('WaitForNextGameUI')
            }
        );

        room.AddMessageHandler(
            'UrgeGameStart',
            (data: { player: string }) => {
                Manager.UI.ShowPopUpUI("UrgeGameStartPopUpUI")
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
                Manager.Game.GetHit(data.player)
                if(data.player === MyPlayerController.Data.MySessionId){
                    Manager.UI.ShowDefaultUI("RespawnUI")
                }
            }
        );

        room.AddMessageHandler(
            'RespawnRes',
            (data: { player: string, team: string }) => {
                if (data.player === MyPlayerController.Data.MySessionId) {
                    MyPlayerController.Data.MyPlayer.character.gameObject.layer = LayerMask.NameToLayer("myPlayer")
                    Manager.Game.JoinGame(data.team)
                }
                else{
                    if(Manager.Game.IsGamePlaying){
                        ZepetoPlayers.instance.GetPlayer(data.player).character.gameObject.layer = LayerMask.NameToLayer("inGamePlayer")
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
                SiegeGameController.Instance.Siege(data.team);
            }
        );

        room.AddMessageHandler(
            'GetFlagRes',
            (data: { player: string, team: string }) => {
                FlagGameController.Instance.GetFlag(data.team, data.player);
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