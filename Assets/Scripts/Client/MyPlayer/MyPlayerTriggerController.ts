import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, HumanBodyBones} from "UnityEngine";
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';

export default class MyPlayerTriggerController extends ZepetoScriptBehaviour {
    private static _instance: MyPlayerTriggerController = null;

    public static get Instance() {
        return this._instance;
    }

    Start() {
        if (!MyPlayerTriggerController._instance) {
            MyPlayerTriggerController._instance = this;
        }
    }

    OnTriggerEnter(collider: GameObject) {
        
    }

}