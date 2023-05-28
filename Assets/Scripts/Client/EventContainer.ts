import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, HumanBodyBones, Vector3} from "UnityEngine";
import {DOMAIN_OBJECT_ENUM, EVENT_NAME } from './Enums';


export interface IEvent {
    name: EVENT_NAME;
    data: object;
}

// 이벤트 설계
export interface ISubjectDomainObjectDestroy extends IEvent {
    name: EVENT_NAME.DOMAIN_OBJECT_DESTROY
    data: {
        domainObjectEnum: DOMAIN_OBJECT_ENUM
    };
}