import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { IEvent } from './EventContainer';
import { InterManager } from './Manager/Manager';
import { InterServiceManager } from './Service/ServiceManager';

export interface IObserver {
    id: string;
    serviceManager: InterServiceManager;
    manager: InterManager;

    Inject() : void
    OnSubjectEventHandler(event: IEvent): void
}


export interface ISubject {
    AttachObserver(key: string, observer: IObserver): void

    DetachObserver(key: string): void

    Notify(event: IEvent): void
}