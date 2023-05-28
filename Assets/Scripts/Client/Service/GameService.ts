import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { InterManager } from '../Manager/Manager';
import Service, { IService } from '../Service';
import { InterServiceManager } from './ServiceManager';

export interface InterGameState {
    
}

export interface InterGameService extends IService {
    //state: IGameState;
}

export default class GameService extends Service implements InterGameService {
    private serviceManager: InterServiceManager;
    private manager: InterManager;
    state: InterGameState;

    constructor(_ServiceManager: InterServiceManager, _Manager: InterManager) {
        super();
        this.serviceManager = _ServiceManager;
        this.manager = _Manager;
        this.state = {
            
        }
    }
}