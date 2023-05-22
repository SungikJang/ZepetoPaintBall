import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NetworkBase from './NetworkBase';
import WorldMultiPlayStarter from './WorldMultiPlayStarter';

export interface InterResponseReceiver {
    ManualSyncResHandlerFunc(room): void;
    Start();
    Update();
}


export default class ResponseReceiver extends NetworkBase implements InterResponseReceiver{
    private init: boolean = false;

    public ManualSyncResHandlerFunc(room): void {
        
    }

    Start() {
        try {
            if (!WorldMultiPlayStarter.Instance) {
                //console.log('아직 오토어쩌고 인스턴스가 없음');
                return;
            } else {
                const room = WorldMultiPlayStarter.Instance.Room;
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
                if (!WorldMultiPlayStarter.Instance) {
                    //console.log('아직 오토어쩌고 인스턴스가 없음');
                    return;
                } else {
                    const room = WorldMultiPlayStarter.Instance.Room;
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