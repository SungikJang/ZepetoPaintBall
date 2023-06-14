import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Transform} from "UnityEngine";
import Manager, { InterManager } from '../Manager/Manager';
import { InterMyPlayerController, MyPlayerController } from './MyPalyerController';
import IOC from '../IOC';

export default class MyPlayerCoroutineController extends ZepetoScriptBehaviour {
    manager: InterManager;
    myPlayerController: InterMyPlayerController;

    Start(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.myPlayerController.MyPlayerData.MyCoroutineController = this;
        this.myPlayerController.MyPlayerMovement.MyCoroutineController = this;
    }


}