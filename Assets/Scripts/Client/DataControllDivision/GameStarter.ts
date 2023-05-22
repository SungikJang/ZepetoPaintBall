import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../IOC';
import { MyPlayerController } from '../MyPlayerDivision/MyPalyerController';

export default class GameStarter extends ZepetoScriptBehaviour {

    Start() {
        IOC.Instance.createInstance<MyPlayerController>(MyPlayerController);
    }

}