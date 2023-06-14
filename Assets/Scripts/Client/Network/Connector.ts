import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NetworkBase from './NetworkBase';
import {GameObject} from "UnityEngine";
import MultiplayManager from './MultiplayManager';
import {Action$1} from "System";
import { InterMyPlayerController, MyPlayerController } from '../MyPlayer/MyPalyerController';
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import { GAME_NAME } from '../Enums';
import {ZepetoPlayers} from "ZEPETO.Character.Controller";

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
            'PlayerDateRes',
            (data: { goldPassInfo: boolean,
                diaPassInfo: boolean,
                weaponInfo: string,
                gold: number,
                dia: number }) => {
                console.log("?")
                this.myPlayerController.MyPlayerData.SetData(data.gold, data.dia, data.goldPassInfo, data.diaPassInfo, data.weaponInfo)
            }
        );
        
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
            (data: { nowRunningGame: string, team?: string }) => {
                if(data.team) {
                    this.manager.Game.GameJoin(data.nowRunningGame, data.team)
                }
                else{
                    this.manager.Game.GameJoin(data.nowRunningGame)
                }
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
                        this.manager.SeigeGame.RuntheGame()
                        break;
                    case GAME_NAME.SoloFlag:
                        this.manager.SoloFlagGame.RuntheGame(data.sessionId)
                        break;
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
            (data: { winningTeam: string }) => {
                this.manager.Game.GameEnd();
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