import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {DOMAIN_OBJECT_ENUM, EVENT_NAME } from './Enums';
import { IEvent, ISubjectDomainObjectDestroy } from './EventContainer';
import {IObserver, ISubject } from './Observer';

interface IPoolObject {
    Destroy(): void;
}

class DomainObject implements ISubject, IPoolObject {
    readonly id: string;
    private domainObjectEnum: DOMAIN_OBJECT_ENUM
    private observers: Map<string, IObserver>;

    public constructor() {
        this.id = '1';
        this.observers = new Map<string, IObserver>();
        this.domainObjectEnum = this.constructor.name.toUpperCase() as DOMAIN_OBJECT_ENUM;
    }

    AttachObserver(key: string, observer: IObserver): void {
        this.observers.set(key, observer);
    }

    DetachObserver(key: string): void {
        this.observers.delete(key);
    }

    Notify(event: IEvent) {
        for (const [key, observer] of this.observers) {
            observer.OnSubjectEventHandler(event);
        }
    }

    Destroy<T>(): void {
        const subjectEvent: ISubjectDomainObjectDestroy = {
            name: EVENT_NAME.DOMAIN_OBJECT_DESTROY,
            data: {
                domainObjectEnum: DOMAIN_OBJECT_ENUM.POTION
            }
        }
        this.Notify(subjectEvent);
    }
}

export default DomainObject;