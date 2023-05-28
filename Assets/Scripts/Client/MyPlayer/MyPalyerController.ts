import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../IOC';
import { InterMyPlayerData } from './MyPlayerData'
import { InterMyPlayerMovement } from './MyPlayerMovement'
//import { InterMyPlayerTriggerController } from './MyPlayerTriggerController';

export interface InterMyPlayerController {
    get MyPlayerData();

    get MyPlayerMovement();
}

export class MyPlayerController extends ZepetoScriptBehaviour implements InterMyPlayerController{
    private _mpData: InterMyPlayerData;
    private _mpMovement: InterMyPlayerMovement;
    //private _mpTriggerController: InterMyPlayerTriggerController;

    public get MyPlayerData(): InterMyPlayerData {
        return this._mpData;
    }

    public get MyPlayerMovement(): InterMyPlayerMovement {
        return this._mpMovement;
        
    }

    // public get MyPlayerTrigger(): InterMyPlayerTriggerController {
    //     return this._mpTriggerController;
    // }
    
    constructor(
        _MyPlayerData: InterMyPlayerData,
        _MyPlayerMovement: InterMyPlayerMovement,
        //_MyPlayerTriggerController: InterMyPlayerTriggerController
    ) {
        super();
        this._mpData = _MyPlayerData;
        this._mpMovement = _MyPlayerMovement;
        //this._mpTriggerController = _MyPlayerTriggerController
        
        
        this._mpData.init();
        this._mpMovement.init();
    }
    
  
    Init() {
        
    }
    
    Update(){
        this._mpData.Update();
        this._mpMovement.Update();
    }

} 