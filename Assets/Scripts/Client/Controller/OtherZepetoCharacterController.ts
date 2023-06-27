import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import {WaitForSeconds, Vector3, GameObject, HumanBodyBones, Quaternion} from "UnityEngine";
import Manager, { InterManager } from '../Manager/Manager';
import { InterMyPlayerController, MyPlayerController } from '../MyPlayer/MyPalyerController';
import IOC from '../IOC';
import OtherGunController from './OtherGunController';

export default class OtherZepetoCharacterController extends ZepetoScriptBehaviour {

    public ShotGunDirs: Vector3[]
    public ShootDir: Vector3
    public team: string;
    public haveFlag: boolean = false;
    private nowWeapon: GameObject;
    private manager: InterManager;
    private myPlayerController: InterMyPlayerController;
    private instanceSet: boolean = false;
    
    private gunController: OtherGunController
    
    Start(){
        this.StartCoroutine(this.GetInstance())
    }
    
    public GetHit(){
        this.gameObject.SetActive(false)
    }

    Shoot(){
        this.gunController.Eject()
    }

    StartShoot(){
        this.gunController.StartShoot()
    }

    StopShoot(){
        this.gunController.StopShoot()
    }

    TakeFlag(flagObj: GameObject){
        this.haveFlag = true;
        //
    }

    EqiupGun(name: string) {
        if(!this.manager){
            this.manager = IOC.Instance.getInstance(Manager)
        }
        if(this.nowWeapon){
            GameObject.Destroy(this.nowWeapon)
        }
        this.nowWeapon = this.manager.Resource.Instantiate("Prefabs\\OtherGuns\\" + name);
        this.nowWeapon.transform.SetParent(IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController).MyPlayerMovement.MyAnimator.GetBoneTransform(HumanBodyBones.RightIndexIntermediate), false);
        this.nowWeapon.transform.localPosition = Vector3.zero;
        this.nowWeapon.transform.localRotation = Quaternion.Euler(Vector3.zero);
        this.nowWeapon.name += "_";
        this.nowWeapon.name += this.gameObject.name;
        this.gunController = this.nowWeapon.GetComponent<OtherGunController>();
    }

    * GetInstance(){
        while(!this.instanceSet){
            this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
            this.manager = IOC.Instance.getInstance<InterManager>(Manager);
            if(this.manager && this.myPlayerController){
                this.instanceSet = true;
                return;
            }
            yield new WaitForSeconds(0.1);
        }
    }
}