import { Collision, Quaternion, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import Connector from "../Network/Connector";

export default class BulletController extends ZepetoScriptBehaviour {

    Start() {    

    }

    OnCollisionEnter(collision: Collision){
        if(collision.gameObject.CompareTag("player")){
            if(this.gameObject.transform.parent.parent.parent.gameObject.name === ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id){
                Connector.Instance.ReqToServer("PlayerHit", {player: collision.gameObject.name});
            }
            this.gameObject.SetActive(false);
        }
        else if(collision.gameObject.CompareTag("bullet")){
            
        }
        else{
            this.gameObject.SetActive(false);
        }
    }
    
}