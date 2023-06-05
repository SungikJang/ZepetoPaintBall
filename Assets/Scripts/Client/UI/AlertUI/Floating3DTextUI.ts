import {Color, Mathf, TextMesh, Time} from 'UnityEngine';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import Manager from '../../Manager';

export default class Floating3DTextUI extends ZepetoScriptBehaviour {
    private text: string;
    private alpha: Color;
    private moveSpeed: number;
    private alphaSpeed: number;
    private destroyTime: number;
    private yPos: number;

    Start() {
        try {
            this.moveSpeed = 20.0;
            this.alphaSpeed = 2.0;
            this.destroyTime = 2.0;

            this.text = this.gameObject.GetComponent<TextMesh>().text;
            this.gameObject.GetComponent<TextMesh>().fontSize = Manager.UI.textSize;
            this.text = Manager.UI.FloatingTextContent;
            this.gameObject.GetComponent<TextMesh>().color = Manager.UI.FloatingTextColor;
            this.alpha = this.gameObject.GetComponent<TextMesh>().color;
            this.yPos = this.gameObject.transform.position.y;
            //this.StartCoroutine(this.Close);
            Manager.Resource.Destroy(this.gameObject, 2.0);
        } catch (e) {
            console.error(e)
        }
    }

    Update() {
        try {
            // this.gameObject.transform.Translate(new Vector3(0, this.moveSpeed * Time.deltaTime, 0)); // 텍스트 위치
            // this.yPos = Mathf.Lerp(this.yPos, 0, Time.deltaTime * this.alphaSpeed); // 텍스트 알파값
            // this.gameObject.transform.position = new Vector3(this.gameObject.transform.position.x, this.yPos , this.gameObject.transform.position.z)

            this.alpha.a = Mathf.Lerp(this.alpha.a, 0, Time.deltaTime * this.alphaSpeed); // 텍스트 알파값
            this.gameObject.GetComponent<TextMesh>().color = this.alpha;
        } catch (e) {
            console.error(e);
        }
    }
}
