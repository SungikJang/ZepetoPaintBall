import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, Transform} from "UnityEngine";
import Manager, { InterManager } from '../Manager/Manager';
import IOC from '../IOC';
import Connector from '../Network/Connector';

export default class ObjectController extends ZepetoScriptBehaviour {

    public FlagEnv: GameObject;
    public flagObj: GameObject;
    public SiegeEnv: GameObject;
    public SiegeStartPoint: Transform;
    public FlagStartPoint: Transform;
    public homePoint: Transform;
    public Colliders: Transform;

    Start() {
        IOC.Instance.getInstance<InterManager>(Manager).Game.ObjectController = this;
        this.flagObj.SetActive(false);
        this.FlagEnv.SetActive(false);
        this.SiegeEnv.SetActive(false);
        Connector.Instance.ReqToServer("StartInfoReq")
    }

}