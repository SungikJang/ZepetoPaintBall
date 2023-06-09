import { GameObject } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from '../../../IOC';
import Manager from '../../../Manager/Manager';

export default class CloseButton extends ZepetoScriptBehaviour {
    public TargetUIObject: GameObject;
    public closeButton: Button;

    Start() {
        this.closeButton.onClick.AddListener(() => {
            if(this.TargetUIObject.name.includes("PopUp")){
                IOC.Instance.getInstance(Manager).UI.DeletePopUpUI();
            }
            else{
                this.TargetUIObject.SetActive(false);
            }
        });
    }

}