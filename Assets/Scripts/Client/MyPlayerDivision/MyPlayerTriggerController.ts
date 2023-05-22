import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export interface InterMyPlayerTriggerController {
    init(): void;

}

export default class MyPlayerTriggerController extends ZepetoScriptBehaviour implements InterMyPlayerTriggerController{
    constructor() {
        super();
    }

    init() {
        console.log("트리거이닛")
    }

}