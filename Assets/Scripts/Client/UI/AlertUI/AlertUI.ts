import {WaitForSeconds} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import Manager from '../../Manager';

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
        Manager.Resource.Destroy(this.gameObject);

        Manager.UI.ShowAlertUI();
    }
}
