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
        if (collider.gameObject.CompareTag("B")) {
            
        }
        else if(collider.gameObject.CompareTag("A")){
            
        }
        else if(collider.gameObject.CompareTag("Solo")){

        }
        else if(collider.gameObject.CompareTag("Flag")){

        }
        else if(collider.gameObject.CompareTag("Seige")){

        }
    }

}