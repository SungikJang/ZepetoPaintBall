import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NetworkBase from './NetworkBase';
import {GameObject} from "UnityEngine";
import MultiplayManager from './MultiplayManager';

export interface InterResponseReceiver {
    ManualSyncResHandlerFunc(room): void;
    Start();
    Update();
}


export default class ResponseReceiver extends NetworkBase implements InterResponseReceiver{
    private static _instance: ResponseReceiver;

    public static get Instance(): ResponseReceiver {
        if (!ResponseReceiver._instance) {
            const go = GameObject.Find('ResponseReceiver');
            ResponseReceiver._instance = go.GetComponent<ResponseReceiver>();
        }
        return ResponseReceiver._instance;
    }
    
    private init: boolean = false;

    public ManualSyncResHandlerFunc(room): void {
        
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