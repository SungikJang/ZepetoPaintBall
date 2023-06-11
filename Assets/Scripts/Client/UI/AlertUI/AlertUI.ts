import {WaitForSeconds} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import IOC from '../../IOC';
import Manager, { InterManager } from '../../Manager/Manager';


export default class AlertUI extends ZepetoScriptBehaviour {
    Start() {
        try {
            this.StartCoroutine(this.DestroyAlertUI());
        } catch (e) {
            console.error(e);
        }
    }

    *DestroyAlertUI() {
        yield new WaitForSeconds(2);
        IOC.Instance.getInstance<InterManager>(Manager).Resource.Destroy(this.gameObject.transform.parent.gameObject);

        //IOC.Instance.getInstance<InterManager>(Manager).UI.ShowAlertUI();
    }
}
