import {
    Animator,
    AudioListener,
    GameObject,
    LayerMask,
    Quaternion,
    Random,
    Time,
    Transform,
    Vector3,
    WaitForSeconds
} from 'UnityEngine';
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GunController from '../Controller/GunController';
import Manager  from '../Manager/Manager';
import Connector from '../Network/Connector';
import MyPlayerController from './MyPlayerController';

export default class MyPlayerMovement extends ZepetoScriptBehaviour{
    private isInStartUI: boolean = true;
    private myPlayer: ZepetoPlayer = null;
    private myPlayerObject: GameObject = null;
    private myAnimator: Animator;
    private lastSpineAngle: float = 0;

    private gunController: GunController;
    
    private isMoving: boolean = false;
    
    private isJumping: boolean = false;
    
    Init() {
        
        //this.serviceManager.EnglishGameService.SubscribeState(this);
        //this.StartCoroutine(this.Spin())
    }
    
    // * Spin(){
    //     while(true){
    //         console.log("????")
    //         ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.Rotate(new Vector3(0,1,0))
    //         yield new WaitForSeconds(0.2);
    //     }
    // }

    SetMyPlayer(player: ZepetoPlayer){
        this.myPlayer = player;
        this.myPlayerObject = this.myPlayer.character.gameObject;
        this.myAnimator = player.character.ZepetoAnimator;
    }

                           
    Teleport(pos: Vector3, rot: Quaternion){
        this.myPlayer.character.Teleport(pos, rot);
    }
    
    public Rotate(){
        if (!Manager.Game.IsGamePlaying) {
            if (this.isInStartUI && this.myPlayerObject) {
                this.myPlayerObject.transform.Rotate(Vector3.up * Time.deltaTime * 30);
            }
        }
    }
    
    public LookDir(){
        if (Manager.Game.IsGamePlaying) {
            let q = this.myPlayer.character.gameObject.transform.rotation.eulerAngles
            let cq = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera.gameObject.transform.rotation.eulerAngles
            this.myPlayer.character.gameObject.transform.rotation = Quaternion.Euler(new Vector3(q.x, cq.y, q.z));
            // this.myPlayer.character.MoveContinuously(cq);
            let sa: float = 0;
            if (cq.x === 0) {
                sa = 0;
            } else {
                if (cq.x > 300) {
                    sa = (360 - cq.x) / 36;
                } else {
                    sa = cq.x / -45;
                }
            }
            let val: float = this.lastSpineAngle - sa;
            if (Math.abs(val) > 0.001) {
                Connector.Instance.ReqToServer("SpineAngle", {spineAngle: sa});
                this.lastSpineAngle = sa;
            }
        }
    }

    get GunController(){
        return this.gunController
        
    }

    set GunController(value: GunController){
        this.gunController = value;
    }

    get MyAnimator(){
        return this.myAnimator;
    }

    get IsMoving(){
        return this.isMoving
    }

    set IsMoving(value: boolean){
        this.isMoving = value
    }

    get IsJumping(){
        return this.isJumping
    }

    set IsJumping(value: boolean){
        this.isJumping = value
    }

    SetSpineAngle(spineAngle: float){
        this.myAnimator.SetFloat("SpineAngle", spineAngle)
    }
    
    SetAnimParam(name: string, num: int){
        if(!this.isJumping){
            // if (this.myPlayer.character.characterController.isGrounded) {
            //     if (this.myAnimator.GetInteger(name) !== num) {
            //         this.myAnimator.SetInteger(name, num)
            //     }
            // }
            if (this.myAnimator.GetInteger(name) !== num) {
                this.myAnimator.SetInteger(name, num)
            }
        }
    }

    Shoot(){
        this.GunController.Shoot();
    }

    Move(x: float, y: float, amount: float){
        let speed = (amount / 27) / 5;
        this.myAnimator.SetFloat("Acceleration", amount / 27)
        let dir = new Vector3(y, 0, x).normalized
        let p: Vector3 = this.myPlayer.character.gameObject.transform.position
        dir = this.myPlayer.character.gameObject.transform.TransformDirection(dir)
        this.myPlayer.character.characterController.enabled = false;
        this.myPlayer.character.gameObject.transform.position = new Vector3(p.x + (dir.x * speed), p.y, p.z + (dir.z * speed))
        this.myPlayer.character.characterController.enabled = true;
    }

    Jump(){
        this.isJumping = true;
    }
}