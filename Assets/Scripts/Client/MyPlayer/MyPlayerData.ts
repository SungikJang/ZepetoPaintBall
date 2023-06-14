import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {WaitForSeconds, AudioListener, Random, GameObject, HumanBodyBones, Vector3, Quaternion} from "UnityEngine";
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import { PLAYER_STATE } from '../Enums';
import Connector from '../Network/Connector';
import Utils from "../Utils/index"
import { InterMyPlayerController, MyPlayerController } from './MyPalyerController';
import MyPlayerCoroutineController from './MyplayerCoroutineController';

export interface InterMyPlayerData {
    Init(): void;

    SetMyPlayer(player: ZepetoPlayer): void;

    Update(): void;
    
    SetTeam(team: string): void;
    
    SetPlayerState(state: string): void;
    
    get MyPlayer();

    get MySessionId();
    
    get Team();

    get MyGoldPass()
    
    set MyGoldPass(value: boolean)

    get MyDiaPass()

    set MyDiaPass(value: boolean)

    get MyZem()
    
    set MyZem(value: number)

    get MyGold()

    set MyGold(value: number)

    get MyDia()

    set MyDia(value: number)

    get MyWeaponInfo()

    set MyWeaponInfo(value: string)

    get NowWeapon()

    set NowWeapon(value: GameObject)

    get MyWeaponInfoArr()

    get MyCoroutineController()

    set MyCoroutineController(value: MyPlayerCoroutineController)

    EqiupGun(name: string);
}

export default class MyPlayerData extends ZepetoScriptBehaviour implements InterMyPlayerData {
    private _myPlayer: ZepetoPlayer = null;

    private _mySessionId: string = null;
    
    private state: string = PLAYER_STATE.Live;
    
    public manager: InterManager;
    
    private team: string = '';

    private myZem: number;
    
    private myGold: number;

    private myDia: number;

    private myGoldPass: boolean;

    private myDiaPass: boolean;

    private myWeaponInfo: string;

    private myWeaponInfoArr: string[] = ["O", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"];
    
    private nowWeapon: GameObject;
    
    private myCoroutineController: MyPlayerCoroutineController
    
    get MyPlayer(){
        return this._myPlayer
    }

    get MySessionId(){
        return this._myPlayer
    }

    get MyGoldPass(){
        return this.myGoldPass
    }

    set MyGoldPass(value: boolean){
        this.myGoldPass = value
    }

    get MyDiaPass(){
        return this.myDiaPass
    }

    set MyDiaPass(value: boolean){
        this.myDiaPass = value
    }

    get MyZem(){
        return this.myZem
    }

    set MyZem(value: number){
        this.myZem = value
        if(!this.manager){
            this.manager = IOC.Instance.getInstance(Manager)
        }
        this.manager.UI.StartUI.SetZem(value);
    }

    get MyGold(){
        return this.myGold
    }

    set MyGold(value: number){
        this.myGold = value
        if(!this.manager){
            this.manager = IOC.Instance.getInstance(Manager)
        }
        this.manager.UI.StartUI.SetGold(value);
    }

    get MyDia(){
        return this.myDia
    }

    set MyDia(value: number){
        this.myDia = value
        if(!this.manager){
            this.manager = IOC.Instance.getInstance(Manager)
        }
        this.manager.UI.StartUI.SetDia(value);
    }

    get MyWeaponInfo(){
        return this.myWeaponInfo
    }

    set MyWeaponInfo(value: string){
        this.myWeaponInfo = value
        this.myWeaponInfoArr = this.myWeaponInfo.split("_")
    }

    get MyWeaponInfoArr(){
        return this.myWeaponInfoArr
    }

    get NowWeapon(){
        return this.nowWeapon
    }

    set NowWeapon(value: GameObject){
        this.nowWeapon = value
    }

    get MyCoroutineController(){
        return this.myCoroutineController
    }

    set MyCoroutineController(value: MyPlayerCoroutineController){
        this.myCoroutineController = value
    }


    Init() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
    }
    
    SetMyPlayer(player: ZepetoPlayer){
        this._myPlayer = player;
        this._mySessionId = this._myPlayer.id;
        this._myPlayer.character.gameObject.AddComponent<AudioListener>();
    }
    
    Update(){
        // if(this.state !== PLAYER_STATE.Die){
        //     if (this.hp <= 0) {
        //         this.state = PLAYER_STATE.Die;
        //         Connector.Instance.ReqToServer('PlayerDieReq')
        //     }
        // }
    }
    
    SetData(myGold: number, myDia: number, myGoldPass: boolean, myDiaPass: boolean, myWeaponInfo: string){
        this.myGold = myGold
        this.myDia = myDia
        this.myGoldPass = myGoldPass
        this.myDiaPass = myDiaPass
        this.myWeaponInfo = myWeaponInfo
    }

    SetTeam(team: string){
        this.team = team;
    }

    SetPlayerState(state: string){
        this.state = state;
    }
    
    get Team(){
        return this.team;
    }

    EqiupGun(name: string) {
        if(!this.manager){
            this.manager = IOC.Instance.getInstance(Manager)
        }
        if(this.nowWeapon){
            GameObject.Destroy(this.nowWeapon)
        }
        this.nowWeapon = this.manager.Resource.Instantiate("Prefabs\\Guns\\" + name);
        this.nowWeapon.transform.SetParent(IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController).MyPlayerMovement.MyAnimator.GetBoneTransform(HumanBodyBones.RightIndexIntermediate), false);
        this.nowWeapon.transform.localPosition = Vector3.zero;
        this.nowWeapon.transform.localRotation = Quaternion.Euler(Vector3.zero);
    }
}   