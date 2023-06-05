import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NetworkBase from './NetworkBase';
import {Player} from "ZEPETO.Multiplay.Schema";
import {GameObject, WaitForSeconds} from "UnityEngine";

export interface InterRequestSender {
    Start();
}


export default class RequestSender extends NetworkBase implements InterRequestSender{
    private static _instance: RequestSender;

    public static get Instance(): RequestSender {
        if (!RequestSender._instance) {
            RequestSender._instance = new RequestSender();
        }
        return RequestSender._instance;
    }
    

    Start() {

    }

    Update() {

    }
}