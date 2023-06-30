import { Camera } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';

export default class VideoCamera extends ZepetoScriptBehaviour {
    private ZepetoCamera: Camera;

    Start() {
        try {
            this.ZepetoCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera;
            this.transform.position = this.ZepetoCamera.gameObject.transform.position;
            this.transform.rotation = this.ZepetoCamera.gameObject.transform.rotation;
        }
        catch (e) {
            console.error(e);
        }
    }
    Update() {
        try {
            this.transform.position = this.ZepetoCamera.gameObject.transform.position;
            this.transform.rotation = this.ZepetoCamera.gameObject.transform.rotation;
        }
        catch (e) {
            console.error(e);
        }
    }
}
