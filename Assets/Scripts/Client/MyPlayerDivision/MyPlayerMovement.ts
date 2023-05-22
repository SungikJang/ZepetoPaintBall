import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export interface InterMyPlayerMovement {
    init(): void;
    
}

export default class MyPlayerMovement extends ZepetoScriptBehaviour implements InterMyPlayerMovement{
    constructor() {
        super();
    }

    init() {
        console.log("무브이닛")
    }

}