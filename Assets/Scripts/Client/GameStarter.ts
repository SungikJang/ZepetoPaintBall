import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from './IOC';
import Manager from './Manager/Manager';
import { MyPlayerController } from './MyPlayer/MyPalyerController';


export default class GameStarter extends ZepetoScriptBehaviour {

    Start() {
        IOC.Instance.createInstance<MyPlayerController>(MyPlayerController);
        IOC.Instance.createInstance<Manager>(Manager);
    }
    
    Update(){
        IOC.Instance.getInstance(MyPlayerController).Update();
    }

}