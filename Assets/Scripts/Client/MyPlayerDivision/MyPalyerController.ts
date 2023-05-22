import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { InterMyPlayerData } from './MyPlayerData'
import { InterMyPlayerMovement } from './MyPlayerMovement'

export interface InterMyPlayerController {
    get MyPlayerData();

    get MyPlayerMovement();
}

export class MyPlayerController extends ZepetoScriptBehaviour implements InterMyPlayerController{
    private _mpData: InterMyPlayerData;
    private _mpMovement: InterMyPlayerMovement;

    public get MyPlayerData(): InterMyPlayerData {
        return this._mpData;
    }

    public get MyPlayerMovement(): InterMyPlayerMovement {
        return this._mpMovement;
    }
    
    constructor(
        _MyPlayerData: InterMyPlayerData,
        _MyPlayerMovement: InterMyPlayerMovement,
    ) {
        super();
        this._mpData = _MyPlayerData;
        this._mpMovement = _MyPlayerMovement;
        
        
        this._mpData.init();
        this._mpMovement.init();
    }
    
  
    Init() {
        
    }

} 