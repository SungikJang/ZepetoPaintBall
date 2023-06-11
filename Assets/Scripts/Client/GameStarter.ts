import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from './IOC';
import Manager, { InterManager } from './Manager/Manager';
import {InterMyPlayerController, MyPlayerController } from './MyPlayer/MyPalyerController';


export default class GameStarter extends ZepetoScriptBehaviour {
    private instanceReady: boolean = false;

    Awake() {
        IOC.Instance.createInstance<InterMyPlayerController>(MyPlayerController);
        IOC.Instance.createInstance<InterManager>(Manager);
        this.instanceReady = true;
        IOC.Instance.getInstance(Manager).Init();
        IOC.Instance.getInstance(Manager).UI.ShowDefaultUI("StartUI")
    }
    
    Update(){
        if(this.instanceReady){
            IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController).Update();
        }
    }

}