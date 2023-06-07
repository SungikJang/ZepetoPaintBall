import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NetworkBase from './NetworkBase';
import {GameObject} from "UnityEngine";
import MultiplayManager from './MultiplayManager';
import {Action$1} from "System";
import { InterMyPlayerController, MyPlayerController } from '../MyPlayer/MyPalyerController';
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';

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
            (data: { nowRunningGame: string, team?: string }) => {
                if(data.team) {
                    this.manager.Game.GameJoin(data.nowRunningGame, data.team)
                }
                else{
                    this.manager.Game.GameJoin(data.nowRunningGame)
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