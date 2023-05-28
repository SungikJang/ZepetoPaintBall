import DataManager from "./Manager/DataManager";
import LanguageManager from "./Manager/LanguageManager";
import Manager from "./Manager/Manager";
import ResourceManager from "./Manager/ResourceManager";
import SoundManager from "./Manager/SoundManager";
import UIManager from "./Manager/UIManager";
import { MyPlayerController } from "./MyPlayer/MyPalyerController";
import MyPlayerData from "./MyPlayer/MyPlayerData";
import MyPlayerMovement from "./MyPlayer/MyPlayerMovement";
//import MyPlayerTriggerController from "./MyPlayerDivision/MyPlayerTriggerController";

export interface Injectable {
    injectable: boolean;
}

export function Injectable(): ClassDecorator {
    return (target: any) => {
        target.prototype.injectable = true;
    };
}

export type Constructor<T> = new (...args: any[]) => T;  

export interface IIOC {
    createInstance<T>(target: Constructor<T>): T;

    getInstance<T>(target: Constructor<T>): T;

    provide<T>(target: Constructor<T>, implementationClass: Constructor<T>): void;
}

export default class IOC implements IIOC {
    private static _instance: IOC;
    private instances = new Map<Constructor<any>, any>();
    private implementations = new Map<Constructor<any>, Constructor<any>>();
    private classTypeMap = new Map<string, Constructor<any>>();

    private constructor() {
        this.classTypeMap.set('_MyPlayerController', MyPlayerController);
        this.classTypeMap.set('_MyPlayerMovement', MyPlayerMovement);
        this.classTypeMap.set('_MyPlayerData', MyPlayerData);
        this.classTypeMap.set('_Manager', Manager);
        this.classTypeMap.set('_ResourceManager', ResourceManager);
        this.classTypeMap.set('_DataManager', DataManager);
        this.classTypeMap.set('_UIManager', UIManager);
        this.classTypeMap.set('_LanguageManager', LanguageManager);
        this.classTypeMap.set('_SoundManager', SoundManager);
    }

    public static get Instance(): IOC {
        if (!this._instance) {
            this._instance = new IOC();
        }
        return this._instance;
    }

    public createInstance<T>(classType: Constructor<T>): T {
        if (this.instances.get(classType)) {
            return this.instances.get(classType);
        }

        const stringDependencies = this.getStringDependencies(classType);
        const dependencies = stringDependencies.map((stringDependency: string) => {
            const classType = this.getClassType(stringDependency);
            return this.getInstance(classType) ?? this.createInstance(classType);
        });
        const createdInstance = new classType(...dependencies);
        this.instances.set(classType, createdInstance);

        return createdInstance;
    }

    public getInstance<T>(classType: { new(...args: any[]): T }): T {
        if (!this.instances.get(classType)) {
            return null;
        }
        return this.instances.get(classType);
    }

    private getStringDependencies(classType: any): any[] {
        console.log('1', classType.toString())
        const constructorArgs = classType.toString().match(/constructor\s*\((.*?)\)/);
        console.log('2', constructorArgs)
        if (!constructorArgs) {
            return [];
        }
        const args = constructorArgs[0].split("(")[1].split(")")[0];
        if (args === '') {
            return [];
        }
        console.log('3', constructorArgs)
        return args.split(',').map((arg) => arg.trim());
    }

    private getClassType(key: string) {
        return this.classTypeMap.get(key);
    }

    public provide<T>(targetClass: Constructor<T>, implementationClass: Constructor<T>): void {
        this.implementations.set(targetClass, implementationClass);
    }
}
