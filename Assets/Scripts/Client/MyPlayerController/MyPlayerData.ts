import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {WaitForSeconds, AudioListener, Random, GameObject, HumanBodyBones, Vector3, Quaternion} from "UnityEngine";
import { PLAYER_STATE } from '../Enums';
import Connector from '../Network/Connector';
import Utils from "../Utils/index"
import Manager from '../Manager/Manager';
import MyPlayerController from './MyPlayerController';

export default class MyPlayerData extends ZepetoScriptBehaviour {
    private _myPlayer: ZepetoPlayer = null;

    private _mySessionId: string = null;
    
    private state: string = PLAYER_STATE.Live;
    
   
    
    private team: string = '';

    private myZem: number;
    
    private myGold: number;

    private myDia: number;

    private myGoldPass: boolean;

    private myDiaPass: boolean;

    private myWeaponType: string;

    private myWeaponInfoArr: string[] = ["O", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"];
    
    private nowWeapon: GameObject;
    
    private shootDir: Vector3;
    
    private shotGunDirs: Vector3[]
    
    private waitingWeeapon: string = '';
    
    private flag: GameObject;
    
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
        Manager.UI.StartUI.SetZem(value);
        if(Manager.UI.GameVoteUI){
            Manager.UI.GameVoteUI.SetZem(value);
        }
        if(Manager.UI.RespawnUI){
            Manager.UI.RespawnUI.SetZem(value);
        }
    }

    get MyGold(){
        return this.myGold
    }

    set MyGold(value: number){
        this.myGold = value
        Manager.UI.StartUI.SetGold(value);
        if(Manager.UI.GameVoteUI){
            Manager.UI.GameVoteUI.SetGold(value);
        }
        if(Manager.UI.RespawnUI){
            Manager.UI.RespawnUI.SetZem(value);
        }
    }

    get MyDia(){
        return this.myDia
    }

    set MyDia(value: number){
        this.myDia = value
        Manager.UI.StartUI.SetDia(value);
        if(Manager.UI.GameVoteUI){
            Manager.UI.GameVoteUI.SetDia(value);
        }
        if(Manager.UI.RespawnUI){
            Manager.UI.RespawnUI.SetZem(value);
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

    get Flag(){
        return this.flag
    }

    set Flag(value: GameObject){
        this.flag = value;
    }


    Init() {
        console.log("????")
    }
    
    SetMyPlayer(player: ZepetoPlayer){
        this._myPlayer = player;
        this._mySessionId = player.id;
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
        if(this.nowWeapon){
            GameObject.Destroy(this.nowWeapon)
        }
        this.nowWeapon = Manager.Resource.Instantiate("Prefabs\\Guns\\" + name);
        this.nowWeapon.transform.SetParent(MyPlayerController.Movement.MyAnimator.GetBoneTransform(HumanBodyBones.RightIndexIntermediate), false);
        this.nowWeapon.transform.localPosition = Vector3.zero;
        this.nowWeapon.transform.localRotation = Quaternion.Euler(Vector3.zero);
        this.nowWeapon.name += "_";
        this.nowWeapon.name += this._mySessionId;
        this.nowWeapon.layer = this._myPlayer.character.gameObject.layer
        Connector.Instance.ReqToServer("EqiupGunReq", name)
    }
}   