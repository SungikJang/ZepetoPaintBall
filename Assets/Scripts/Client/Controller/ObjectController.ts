import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, Transform, WaitForSeconds} from "UnityEngine";
import Manager from '../Manager/Manager';

export default class ObjectController extends ZepetoScriptBehaviour {

    public FlagEnv: GameObject;
    public flagObj: GameObject;
    public SiegeEnv: GameObject;
    public SiegeStartPoint: Transform;
    public FlagStartPoint: Transform;
    public homePoint: Transform;
    public Colliders: Transform;

    Start() {
        Manager.Game.ObjectController = this;
        this.flagObj.SetActive(false);
        this.FlagEnv.SetActive(false);
        this.SiegeEnv.SetActive(false);
    }
}