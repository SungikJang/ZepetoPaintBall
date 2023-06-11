import {SandboxPlayer} from 'ZEPETO.Multiplay';

export interface IMessageType {
    type: string;
    value: any;
}
export interface IBroadcastInfo extends IMessageType {
    options?: any;
    isBroadcast?: any;
}
export interface ISendInfo extends IMessageType {
    client: SandboxPlayer;
    type: string;
    value: any;
}

export const ObjectIsMessage = (object: any): object is IMessageType => {
    return 'type' in object && 'value' in object;
};
export const MessageIsBroadcast = (object: any): object is IBroadcastInfo => {
    return ObjectIsMessage(object) && 'isBroadcast' in object;
};
export const MessageIsSend = (object: any): object is ISendInfo => {
    return ObjectIsMessage(object) && 'client' in object;
};
