import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Room, RoomData} from "ZEPETO.Multiplay";
import {WaitForSeconds} from "UnityEngine";

export default class NetworkBase extends ZepetoScriptBehaviour {
    protected _room: Room;
    protected _pingTime = 0;
    protected _serverTimeDifferenceSum = 0;
    protected _serverTimeDifferenceCount = 0;
    protected _serverTimeDifference = 0;
    protected _timeState = null;

    public get CurrentServerTimestamp() {
        return Number(new Date().getTime() + this._serverTimeDifference);
    }
    protected GetServerTimeDifference() {
        this._pingTime = new Date().getTime();
        this._room.Send('Ping');
    }
    protected *CoSyncServerTime() {
        yield new WaitForSeconds(2);
        this.GetServerTimeDifference();
    }
    protected ObjToRoomData(data: any): RoomData {
        const roomData = new RoomData();
        for (const key of Object.keys(data)) {
            if (typeof data[key] === 'object') {
                roomData.Add(key, this.ObjToRoomData(data[key]).GetObject());
            } else {
                roomData.Add(key, data[key]);
            }
        }

        return roomData;
    }

    public ReqToServer(eventName: string, data?: any) {
        if (this._room === undefined) {
            console.error('Room is not connected');
            return;
        }
        if (data) {
            this._room.Send(eventName, this.ObjToRoomData(data).GetObject());
        } else {
            this._room.Send(eventName);
        }
    }
    public SendToServer(type: string, data?: any) {
        if (this._room === undefined) {
            console.error('Room is not connected');
            return;
        }
        if (data) {
            this._room.Send(type, this.ObjToRoomData(data).GetObject());
        } else {
            this._room.Send(type);
        }
    }
}