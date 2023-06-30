import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import {WaitForSeconds, Vector3, GameObject, HumanBodyBones, Quaternion} from "UnityEngine";
import Manager from '../Manager/Manager';
import OtherGunController from './OtherGunController';
import MyPlayerController from '../MyPlayerController/MyPlayerController';

export default class OtherZepetoCharacterController extends ZepetoScriptBehaviour {

    public ShotGunDirs: Vector3[]
    public ShootDir: Vector3
    public team: string;
    public haveFlag: boolean = false;
    private nowWeapon: GameObject;
    private instanceSet: boolean = false;
    
    private gunController: OtherGunController
    
    Start(){
        
    }
    
    public GetHit(){
        this.gameObject.SetActive(false)
    }

    Fire(dir: Vector3, dirs: Vector3[]){
        this.gunController.Fire(dir, dirs)
    }

    TakeFlag(flagObj: GameObject){
        this.haveFlag = true;
        //
    }   

    EqiupGun(name: string) {
        if(this.nowWeapon){
            GameObject.Destroy(this.nowWeapon)
        }
        this.nowWeapon = Manager.Resource.Instantiate("Prefabs\\OtherGuns\\" + name);
        this.nowWeapon.transform.SetParent(MyPlayerController.Movement.MyAnimator.GetBoneTransform(HumanBodyBones.RightIndexIntermediate), false);
        // 수정
        this.nowWeapon.transform.localPosition = Vector3.zero;
        this.nowWeapon.transform.localRotation = Quaternion.Euler(Vector3.zero);
        this.nowWeapon.name += "_";
        this.nowWeapon.name += this.gameObject.name;
        this.gunController = this.nowWeapon.GetComponent<OtherGunController>();
    }
}