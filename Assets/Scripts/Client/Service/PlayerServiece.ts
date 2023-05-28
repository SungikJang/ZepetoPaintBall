import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { InterManager } from '../Manager/Manager';
import Service, { IService } from '../Service';

export interface InterPlayerState {
    // myPlayer: IMyPlayer | null,
    // otherPlayers: IOtherPlayer[]
}

export interface InterPlayerService extends IService {
    //state: InterPlayerState;
}

class PlayerService extends Service implements InterPlayerService {
    public state: InterPlayerState;
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

export default PlayerService;