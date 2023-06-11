import {TMP_Text} from 'TMPro';
import {Color, Color32, GameObject, Mathf, Time, Vector3, WaitForSeconds} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import Manager from '../../Manager';

export default class UI_FloatingText extends ZepetoScriptBehaviour {
    private text: TMP_Text;
    private alpha: Color;
    private moveSpeed: number;
    private alphaSpeed: number;
    private destroyTime: number;

    Start() {
        try {
            this.moveSpeed = 20.0;
            this.alphaSpeed = 1.0;
            this.destroyTime = 2.0;

            this.text = this.gameObject.transform.GetChild(0).GetComponent<TMP_Text>();
            this.text.text = Manager.UI.FloatingTextContent;
            this.text.color = Manager.UI.FloatingTextColor;
            this.alpha = this.text.color;
            Manager.Resource.Destroy(this.gameObject, 2.0);
        } catch (e) {
            console.error(e)
        }
    }

    Update() {
        try {
            this.gameObject.transform.GetChild(0).transform.Translate(new Vector3(0, this.moveSpeed * Time.deltaTime, 0)); // 텍스트 위치

            this.alpha.a = Mathf.Lerp(this.alpha.a, 0, Time.deltaTime * this.alphaSpeed); // 텍스트 알파값
            this.text.color = this.alpha;

        } catch (e) {
            console.error(e)
        }
    }
}
