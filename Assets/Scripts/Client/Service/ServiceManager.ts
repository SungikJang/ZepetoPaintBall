import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Constructor } from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import UIService , { InterUIService, InterUIState } from './UIService';
import PlayerService , { InterPlayerService, IPlayerState } from './PlayerService';
import GameService , { InterGameService, InterGameState } from './GameService';

export interface InterGlobalState {
    ui: InterUIState | null,
    player: InterPlayerState | null,
    game: InterGameState| null,
}

export interface InterServiceManager {
    get GlobalState(): InterGlobalState

    get PlayerService(): InterPlayerService

    get GameService(): InterGameService
}

class ServiceManager implements InterServiceManager {
    private Manager: Manager;

    private _globalState: InterGlobalState;
    private _playerService: InterPlayerService;
    private _gameService: InterGameService;
    private _uiService: InterUIService
    private _services: Map<Constructor<any>, any> = new Map<Constructor<any>, any>();

    constructor(_Manager: InterManager) {
        this.Manager = _Manager;
        this._globalState = {
            ui: null,
            player: null,
            game: null,
        }
    }

    get GlobalState(): InterGlobalState {
        this._globalState = {
            player: this._globalState.player ?? this.PlayerService.state,
            game: this._globalState.game ?? this.GameService.state,
            ui: this._globalState.ui ?? this.UIService.state
        }
        return this._globalState;
    }

    public get UIService(): InterUIService {
        if (!this._services.get(UIService)) {
            this._services.set(UIService, IOC.Instance.createInstance<InterUIService>(UIService));
            const createdService = this._services.get(UIService) as InterUIService;
            this._globalState.ui = createdService.state;
        }
        return this._services.get(UIService);
    }

    public get PlayerService(): InterPlayerService {
        if (!this._services.get(PlayerService)) {
            this._services.set(PlayerService, IOC.Instance.createInstance<InterPlayerService>(PlayerService));
            const createdService = this._services.get(PlayerService) as InterPlayerService;
            this._globalState.player = createdService.state;
        }
        return this._services.get(PlayerService);
    }

    public get GameService(): InterGameService {
        if (!this._services.get(GameService)) {
            this._services.set(GameService, IOC.Instance.createInstance<InterGameService>(GameService));
            const createdService = this._services.get(GameService) as GameService;
            this._globalState.game = createdService.state;
        }
        return this._services.get(GameService);
    }
}

export default ServiceManager;