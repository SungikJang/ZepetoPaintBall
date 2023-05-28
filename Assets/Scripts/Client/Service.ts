import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { IObserver } from './Observer';

export interface IService {
    GetState(): object

    SubscribeState(observer: IObserver): void,
}

export default abstract class Service implements IService {
    abstract state: object | undefined;

    public GetState() {
        return this.state;
    }

    public SubscribeState(observer: IObserver) {
        for (const [key, value] of Object.entries(this.state)) {
            if (Array.isArray(value)) {
                value.map((v) => v.AttachObserver(observer.id, observer));
            }
            else {
                value.AttachObserver(observer.id, observer)
            }
        }
    }

    public UnSubscribeState(observer: IObserver) {
        for (const [key, value] of Object.entries(this.state)) {
            value.DetachObserver(observer.id)
        }
    }
}