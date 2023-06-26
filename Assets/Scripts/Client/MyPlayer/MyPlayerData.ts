import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {WaitForSeconds, AudioListener, Random, GameObject, HumanBodyBones, Vector3, Quaternion} from "UnityEngine";
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import { PLAYER_STATE } from '../Enums';
import Connector from '../Network/Connector';
import Utils from "../Utils/index"
import { InterMyPlayerController, MyPlayerController } from './MyPalyerController';
import MyPlayerAttachedController from './MyPlayerAttachedController';

export interface InterMyPlayerData {
    Init(): void;

    SetMyPlayer(player: ZepetoPlayer, sessionId: string): void;

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

    get MyWeaponType()

    set MyWeaponType(value: string)

    get NowWeapon()

    set NowWeapon(value: GameObject)

    get MyWeaponInfoArr()

    get MyPlayerAttachedController()

    set MyPlayerAttachedController(value: MyPlayerAttachedController)

    get ShootDir()

    set ShootDir(value: Vector3)

    get ShotGunDirs()

    set ShotGunDirs(value: Vector3[])

    get WaitingWeeapon()

    set WaitingWeeapon(value: string)

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

    private myWeaponType: string;

    private myWeaponInfoArr: string[] = ["O", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"];
    
    private nowWeapon: GameObject;
    
    private myPlayerAttachedController: MyPlayerAttachedController
    
    private shootDir: Vector3;
    
    private shotGunDirs: Vector3[]
    
    private waitingWeeapon: string = '';
    
    get MyPlayer(){
        return this._myPlayer
    }

    get MySessionId(){
        return this._mySessionId
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
        if(this.manager.UI.GameVoteUI){
            this.manager.UI.GameVoteUI.SetZem(value);
        }
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
        if(this.manager.UI.GameVoteUI){
            this.manager.UI.GameVoteUI.SetGold(value);
        }
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
        if(this.manager.UI.GameVoteUI){
            this.manager.UI.GameVoteUI.SetDia(value);
        }
    }

    get MyWeaponType(){
        return this.myWeaponType
    }

    set MyWeaponType(value: string){
        this.myWeaponType = value
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

    get MyPlayerAttachedController(){
        return this.myPlayerAttachedController
    }

    set MyPlayerAttachedController(value: MyPlayerAttachedController){
        this.myPlayerAttachedController = value
    }

    get ShootDir(){
        return this.shootDir
    }

    set ShootDir(value: Vector3){
        this.shootDir = value
    }

    get ShotGunDirs(){
        return this.shotGunDirs
    }

    set ShotGunDirs(value: Vector3[]){
        this.shotGunDirs = value
    }

    get WaitingWeeapon(){
        return this.waitingWeeapon
    }

    set WaitingWeeapon(value: string){
        this.waitingWeeapon = value
    }


    Init() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
    }
    
    SetMyPlayer(player: ZepetoPlayer, sessionId: string){
        this._myPlayer = player;
        this._mySessionId = sessionId;
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
        this.nowWeapon.name += "_";
        this.nowWeapon.name += this._mySessionId;
        Connector.Instance.ReqToServer("EqiupGunReq", name)
    }
}   