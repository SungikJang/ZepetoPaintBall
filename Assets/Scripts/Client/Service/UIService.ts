import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { InterManager } from '../Manager/Manager';
import Service, { IService } from '../Service';

export interface InterUIState {
    // myPlayer: IMyPlayer | null,
    // otherPlayers: IOtherPlayer[]
}

export interface InterUIService extends IService {
    //state: InterPlayerState;
}

class UIService extends Service implements InterUIService {
    public state: InterUIState;
    private manager: InterManager;

    constructor(_Manager: InterManager) {
        super();
        this.manager = _Manager;
        // this.state = {
        //     myPlayer: new MyPlayer("baepo"),
        //     otherPlayers: [new OtherPlayer("test-other-id")]
        // }
    }
}

export default UIService;