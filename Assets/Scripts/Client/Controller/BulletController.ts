import {Collision, GameObject, Quaternion, Vector3} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import Connector from '../Network/Connector';
import Manager from '../Manager/Manager';
import Utils from '../Utils/index';
import OtherZepetoCharacterController from '../Controller/OtherZepetoCharacterController';
import MyPlayerController from '../MyPlayerController/MyPlayerController';

export default class BulletController extends ZepetoScriptBehaviour {
  Start() {}

  OnCollisionEnter(collision: Collision) {
    if (collision.gameObject.CompareTag('player')) {
      if (this.gameObject.transform.parent.parent.gameObject.name === 'Local') {
        let ozc = collision.gameObject.GetComponent<OtherZepetoCharacterController>();
        let b: boolean = this.gameObject.name.includes(ozc.Team + 'Bullet');
        console.log('내가맞춤', this.gameObject.name, ozc.Team);
        if (!ozc.InShield && !b) {
          Connector.Instance.ReqToServer('PlayerHit', {player: collision.gameObject.name});
        }
      }
      this.gameObject.SetActive(false);
    } else if (collision.gameObject.CompareTag('bullet')) {
    } else if (collision.gameObject.CompareTag('wall')) {
    } else {
      let ind = Utils.RandomInt(1, 5);
      let p = collision.GetContact(0);
      let rot = Quaternion.LookRotation(
        new Vector3(-1 * p.normal.x, -1 * p.normal.y, -1 * p.normal.z),
      );
      if (this.gameObject.name.includes('ABullet')) {
        const s: GameObject = Manager.Resource.Instantiate(
          'Prefabs\\SplatA\\Splat Design ' + ind.toString(),
          this.gameObject.transform.position,
          rot,
        );
        GameObject.Destroy(s, 2);
      } else {
        const s: GameObject = Manager.Resource.Instantiate(
          'Prefabs\\SplatB\\Splat Design ' + ind.toString(),
          this.gameObject.transform.position,
          rot,
        );
        GameObject.Destroy(s, 2);
      }
      this.gameObject.SetActive(false);
    }
  }
}
