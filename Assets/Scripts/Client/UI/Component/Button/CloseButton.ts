import { GameObject } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class CloseButton extends ZepetoScriptBehaviour {
    public TargetUIObject: GameObject;
    public closeButton: Button;

    Start() {
        this.closeButton.onClick.AddListener(() => {
            this.TargetUIObject.SetActive(false);
        });
    }

}