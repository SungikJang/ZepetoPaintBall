import { WaitForSeconds } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../IOC';
import { InterMyPlayerData } from './MyPlayerData'
import { InterMyPlayerMovement } from './MyPlayerMovement'

export interface InterMyPlayerController {
    get MyPlayerData();

    get MyPlayerMovement();
    
    Update(): void;
}

export class MyPlayerController extends ZepetoScriptBehaviour implements InterMyPlayerController{
    private _mpData: InterMyPlayerData;
    private _mpMovement: InterMyPlayerMovement;

    constructor(
        _MyPlayerData: InterMyPlayerData,
        _MyPlayerMovement: InterMyPlayerMovement,
    ) {
        super();
        this._mpData = _MyPlayerData;
        this._mpMovement = _MyPlayerMovement;

        this._mpMovement.Init();
        this._mpData.Init();
    }

    public get MyPlayerData(): InterMyPlayerData {
        return this._mpData;
    }

    public get MyPlayerMovement(): InterMyPlayerMovement {
        return this._mpMovement;
        
    }
  
    Init() {
        
    }
    
    Update(){
        if(this._mpData){
            this._mpData.Update();
        }
        if(this._mpMovement){
            this._mpMovement.Update();
        }
    }
} 